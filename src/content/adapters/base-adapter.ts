import {
    ACTIVITY_THRESHOLD_MS,
    DEFAULT_PACK_STATE,
    DEFAULT_TOUCH_GRASS,
    SIDE_QUEST_SCORE_RELIEF,
    SIDE_QUESTS,
    TICK_FAST_MS,
    TICK_IDLE_MS,
    VELOCITY_MULTIPLIER_COEFFICIENT,
    VELOCITY_MULTIPLIER_MAX,
    VELOCITY_WINDOW_MS,
} from "@/core/constants";
import {
    computeInstantScore,
    computeRollingScore,
    computeShortsCookedScore,
    deriveCookedStatus,
    isMaxCooked,
    shouldIntervene,
} from "@/core/cooked-meter";
import { sendMessage } from "@/core/messaging";
import { getPackProgress, incrementPack, isPackComplete } from "@/core/snack-packs";
import type { CookedStatus, SessionState, SettingsState, SideQuestDefinition, SiteKey } from "@/core/types";
import { getOverlayRoot, initWidgetPosition, mountOrUpdateWidget, removeOverlay, showOverlay } from "../overlays/overlay-manager";

type RuntimeMessageListener = Parameters<typeof chrome.runtime.onMessage.addListener>[0];

interface VelocitySample {
    at: number;
    units: number;
}

const LOCATION_CHANGE_EVENT = "brd:locationchange";

interface LocationChangePatch {
    refCount: number;
    popstateListener: () => void;
    originalPushState: History["pushState"];
    originalReplaceState: History["replaceState"];
}

interface LocationChangeWindow extends Window {
    __brdLocationChangePatch?: LocationChangePatch;
}

export abstract class BaseAdapter {
    abstract readonly site: SiteKey;

    protected settings!: SettingsState;
    protected session!: SessionState;
    protected enabled = false;
    protected lastSignalAt = 0;
    protected lastActivityAt = 0;
    protected scrollCount = 0;
    protected swipeCount = 0;
    protected maxCookedShown = false;
    protected builtDifferentDismissed = false;

    private tickTimer: number | null = null;
    private cleanupFns: Array<() => void> = [];
    private velocitySamples: VelocitySample[] = [];
    private sideQuestSeed = Math.floor(Math.random() * SIDE_QUESTS.length);
    private maxCookedChoiceLocked = false;
    private reopenForcedChoiceAfterSideQuest = false;

    async init() {
        if (this.enabled) {
            this.destroy();
        }

        try {
            const settingsRes = await sendMessage({ type: "GET_SETTINGS" });
            if (!settingsRes.success) return;
            this.settings = settingsRes.data;

            if (!this.settings.masterEnabled || !this.settings.sites[this.site]?.enabled) {
                console.log(`[brainrot detox] Disabled for ${this.site}`);
                return;
            }

            const tab = await this.getCurrentTabId();
            const sessionRes = await sendMessage({ type: "GET_SESSION", payload: { tabId: tab } });

            if (!sessionRes.data) {
                this.session = {
                    site: this.site,
                    tabId: tab,
                    startedAt: Date.now(),
                    cookedScore: 0,
                    cookedStatus: "Based",
                    lastInterventionAt: 0,
                    packState: { ...DEFAULT_PACK_STATE },
                    touchGrass: { ...DEFAULT_TOUCH_GRASS },
                    itemsConsumed: 0,
                    scrollEvents: 0,
                };
                await sendMessage({ type: "UPDATE_SESSION", payload: { tabId: tab, patch: this.session } });
            } else {
                this.session = sessionRes.data;
            }

            this.enabled = true;
            this.lastSignalAt = 0;
            this.lastActivityAt = Date.now();
            this.velocitySamples = [];

            await initWidgetPosition(this.site);
            this.mountCookedWidget();
            this.setupObservers();
            this.scheduleNextTick();

            if (this.isTouchGrassActive()) {
                this.showTouchGrassOverlay();
            }

            console.log(`[brainrot detox] ${this.site} adapter initialized`);
        } catch (err) {
            console.error(`[brainrot detox] Init error for ${this.site}:`, err);
        }
    }

    destroy() {
        this.enabled = false;

        if (this.tickTimer !== null) {
            clearTimeout(this.tickTimer);
            this.tickTimer = null;
        }

        while (this.cleanupFns.length > 0) {
            const cleanup = this.cleanupFns.pop();
            try {
                cleanup?.();
            } catch (err) {
                console.warn(`[brainrot detox] Cleanup error for ${this.site}:`, err);
            }
        }

        this.velocitySamples = [];
        this.removeAllOverlays();
    }

    protected scheduleNextTick() {
        if (!this.enabled) return;

        if (this.tickTimer !== null) {
            clearTimeout(this.tickTimer);
        }

        const interval = Date.now() - this.lastActivityAt < ACTIVITY_THRESHOLD_MS ? TICK_FAST_MS : TICK_IDLE_MS;
        this.tickTimer = window.setTimeout(async () => {
            await this.tick();
            this.scheduleNextTick();
        }, interval);
    }

    protected recordActivity(at: number = Date.now()) {
        this.lastActivityAt = at;
    }

    protected recordSignalUnits(units: number, at: number = Date.now()) {
        if (units <= 0) return;
        this.velocitySamples.push({ at, units });
        this.lastSignalAt = at;
        this.recordActivity(at);
        this.pruneVelocitySamples(at);
    }

    protected recordSuccessfulNavigation(units: number = 1, at: number = Date.now()) {
        if (units <= 0) return;
        this.swipeCount += units;
        this.recordSignalUnits(units, at);
    }

    protected getVelocityMultiplier(now: number = Date.now()): number {
        this.pruneVelocitySamples(now);
        const totalUnits = this.velocitySamples.reduce((sum, sample) => sum + sample.units, 0);
        const rate = totalUnits / (VELOCITY_WINDOW_MS / 1000);
        return Math.min(
            VELOCITY_MULTIPLIER_MAX,
            1 + VELOCITY_MULTIPLIER_COEFFICIENT * Math.pow(rate, 1.5)
        );
    }

    protected addCleanup(cleanup: () => void) {
        this.cleanupFns.push(cleanup);
    }

    protected registerEventListener(
        target: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ) {
        target.addEventListener(type, listener, options);
        this.addCleanup(() => target.removeEventListener(type, listener, options));
    }

    protected registerMutationObserver(
        target: Node,
        options: MutationObserverInit,
        callback: MutationCallback
    ): MutationObserver {
        const observer = new MutationObserver(callback);
        observer.observe(target, options);
        this.addCleanup(() => observer.disconnect());
        return observer;
    }

    protected registerInterval(callback: () => void, ms: number): number {
        const id = window.setInterval(callback, ms);
        this.addCleanup(() => clearInterval(id));
        return id;
    }

    protected registerRuntimeMessageListener(listener: RuntimeMessageListener) {
        chrome.runtime.onMessage.addListener(listener);
        this.addCleanup(() => chrome.runtime.onMessage.removeListener(listener));
    }

    protected registerLocationChangeListener(listener: () => void) {
        const patchedWindow = window as LocationChangeWindow;
        let patch = patchedWindow.__brdLocationChangePatch;

        if (!patch) {
            const dispatchLocationChange = () => window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function (...args) {
                const result = originalPushState.apply(history, args as Parameters<History["pushState"]>);
                dispatchLocationChange();
                return result;
            } as History["pushState"];

            history.replaceState = function (...args) {
                const result = originalReplaceState.apply(history, args as Parameters<History["replaceState"]>);
                dispatchLocationChange();
                return result;
            } as History["replaceState"];

            window.addEventListener("popstate", dispatchLocationChange);
            patch = {
                refCount: 0,
                popstateListener: dispatchLocationChange,
                originalPushState,
                originalReplaceState,
            };
            patchedWindow.__brdLocationChangePatch = patch;
        }

        patch.refCount++;
        window.addEventListener(LOCATION_CHANGE_EVENT, listener);

        this.addCleanup(() => {
            window.removeEventListener(LOCATION_CHANGE_EVENT, listener);

            const currentPatch = patchedWindow.__brdLocationChangePatch;
            if (!currentPatch) return;

            currentPatch.refCount--;
            if (currentPatch.refCount > 0) return;

            history.pushState = currentPatch.originalPushState;
            history.replaceState = currentPatch.originalReplaceState;
            window.removeEventListener("popstate", currentPatch.popstateListener);
            delete patchedWindow.__brdLocationChangePatch;
        });
    }

    protected buildPackDisplay() {
        if (!this.session.packState.active) return null;

        const progress = getPackProgress(this.session.packState);
        const label = this.session.packState.mode === "time" && progress.timeRemaining
            ? `[#] Pack: ${progress.timeRemaining}`
            : `[#] Pack: ${progress.current}/${progress.total}`;

        return { label, percent: progress.percent };
    }

    protected renderCookedWidget(score: number, status: string) {
        mountOrUpdateWidget({
            siteKey: this.site,
            score,
            status,
            pack: this.buildPackDisplay(),
            onActivate: () => {
                void this.openSideQuest("manual");
            },
        });
    }

    protected getGeneralVelocityUnits(newItems: number): number {
        return newItems + this.scrollCount * 0.25;
    }

    protected computeGeneralBurstBonus(signalUnits: number, velocityMultiplier: number): number {
        if (signalUnits <= 0) return 0;
        return Math.max(0, velocityMultiplier - 1) * Math.min(12, signalUnits) * 0.6;
    }

    protected resetMomentum() {
        this.velocitySamples = [];
        this.lastSignalAt = 0;
    }

    protected isSideQuestOpen(): boolean {
        return Boolean(getOverlayRoot().querySelector(`[data-overlay="sidequest"]`));
    }

    protected hasBlockingOverlayOpen(excluding: string[] = []): boolean {
        const exclusions = new Set(["widget", ...excluding]);
        return Array.from(getOverlayRoot().querySelectorAll<HTMLElement>("[data-overlay]"))
            .some((element) => !exclusions.has(element.dataset.overlay ?? ""));
    }

    protected canOpenSideQuest(source: "manual" | "auto", now: number = Date.now()): boolean {
        if (!this.settings?.sites[this.site]?.sideQuest) return false;
        if (this.isTouchGrassActive()) return false;
        if (this.isSideQuestOpen()) return false;
        if (this.hasBlockingOverlayOpen()) return false;
        if (source === "auto" && this.session.packState.active) return false;
        if (source === "auto" && now < this.settings.sideQuest.nextPromptAfterMs) return false;
        return true;
    }

    protected async openSideQuest(
        source: "manual" | "auto" = "manual",
        options?: { returnToForcedChoice?: boolean }
    ): Promise<boolean> {
        if (!this.enabled || !this.canOpenSideQuest(source)) {
            return false;
        }

        this.reopenForcedChoiceAfterSideQuest = options?.returnToForcedChoice ?? false;
        const quest = this.pickSideQuest();
        this.onSideQuestOpened();
        this.renderSideQuestPrompt(quest, source);
        return true;
    }

    protected async tick() {
        if (!this.enabled) return;

        const now = Date.now();
        const previousScore = this.session.cookedScore;
        const previousStatus = this.session.cookedStatus;
        const newItems = this.getNewItemsSinceLastTick();

        this.session.itemsConsumed += newItems;
        this.session.scrollEvents += this.scrollCount;

        const hasNewSignals = this.scrollCount > 0 || newItems > 0 || this.swipeCount > 0;
        const idleMs = this.lastSignalAt === 0 ? 0 : now - this.lastSignalAt;

        if (this.builtDifferentDismissed && hasNewSignals) {
            this.builtDifferentDismissed = false;
            this.scrollCount = 0;
            this.swipeCount = 0;
            this.onBuiltDifferentDenied();
            return;
        }

        let newScore = previousScore;

        if (this.session.packState.active) {
            newScore = previousScore;
        } else if (this.site === "shorts") {
            const navigationGain = newItems * this.getVelocityMultiplier(now);
            newScore = computeShortsCookedScore(previousScore, navigationGain, idleMs);
        } else {
            const velocityUnits = this.getGeneralVelocityUnits(newItems);
            if (velocityUnits > 0) {
                this.recordSignalUnits(velocityUnits, now);
            }

            const sessionMin = (now - this.session.startedAt) / 60_000;
            const instant = computeInstantScore(
                sessionMin,
                this.settings.cooked.sessionCapMinutes,
                this.session.scrollEvents,
                this.session.itemsConsumed
            );
            const velocityMultiplier = this.getVelocityMultiplier(now);
            const rolling = computeRollingScore(previousScore, instant, hasNewSignals, idleMs);
            newScore = Math.min(100, rolling + this.computeGeneralBurstBonus(velocityUnits, velocityMultiplier));
        }

        await this.completeTick(previousScore, previousStatus, newScore, newItems, now);
    }

    protected async completeTick(
        previousScore: number,
        previousStatus: CookedStatus,
        newScore: number,
        newItems: number,
        now: number
    ) {
        this.scrollCount = 0;
        this.swipeCount = 0;

        this.session.cookedScore = newScore;
        const newStatus = deriveCookedStatus(newScore, this.settings.cooked.thresholds);
        this.session.cookedStatus = newStatus;

        if (this.session.packState.active) {
            this.session.packState = incrementPack(this.session.packState, newItems);
            if (isPackComplete(this.session.packState, now)) {
                this.onPackComplete();
            }
        }

        if (!isMaxCooked(newScore)) {
            this.clearForcedMaxCookedChoice();
        }

        if (!this.session.packState.active && !this.isSideQuestOpen()) {
            const scoreRising = newScore > previousScore;
            if (scoreRising) {
                await this.maybeAutoPrompt(previousStatus, newStatus, now);
            }

            if (!this.isSideQuestOpen()) {
                if (
                    this.maxCookedChoiceLocked &&
                    isMaxCooked(newScore) &&
                    !this.builtDifferentDismissed &&
                    !this.hasBlockingOverlayOpen()
                ) {
                    this.showLockedMaxCookedOverlay();
                }

                if (isMaxCooked(newScore)) {
                    if (!this.maxCookedShown) {
                        this.maxCookedShown = true;
                        this.onMaxCooked();
                    }
                } else {
                    if (newScore < 95) this.maxCookedShown = false;
                    if (
                        scoreRising &&
                        !this.hasBlockingOverlayOpen() &&
                        shouldIntervene(newScore, this.session.lastInterventionAt, this.settings.cooked.thresholds, now)
                    ) {
                        this.session.lastInterventionAt = now;
                        this.onIntervention();
                    }
                }
            }
        }

        this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);
        await sendMessage({ type: "UPDATE_SESSION", payload: { tabId: this.session.tabId, patch: this.session } });
    }

    protected abstract setupObservers(): void;
    protected abstract mountCookedWidget(): void;
    protected abstract getNewItemsSinceLastTick(): number;

    protected onIntervention() {
        sendMessage({ type: "LOG_EVENT", payload: { eventType: "intervention" } });
        this.showInterventionOverlay();
    }

    protected onMaxCooked() {
        this.session.lastInterventionAt = Date.now();
        removeOverlay("intervention");
        sendMessage({ type: "LOG_EVENT", payload: { eventType: "intervention" } });
        this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)");
    }

    protected onPackComplete() {
        this.session.packState = { ...DEFAULT_PACK_STATE };
        this.maxCookedShown = false;
        sendMessage({ type: "END_PACK", payload: { tabId: this.session.tabId } });
        this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.");
        this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);
    }

    protected onBuiltDifferentDenied() {
        removeOverlay("intervention");
        this.showBuiltDifferentDeniedOverlay();
    }

    protected onSideQuestOpened() {
        // Hook for short-form adapters that want to pause playback.
    }

    protected onSideQuestClosed() {
        // Hook for short-form adapters that want to resume playback.
    }

    protected onLockedMaxCookedOverlayOpened() {
        // Hook for short-form adapters that want to pause playback.
    }

    protected onLockedMaxCookedOverlayClosed() {
        // Hook for short-form adapters that want to resume playback.
    }

    protected abstract showInterventionOverlay(): void;
    protected abstract showTouchGrassOverlay(): void;
    protected abstract showSkyrimOverlay(message: string): void;
    protected abstract showBuiltDifferentDeniedOverlay(): void;
    protected abstract updateCookedWidget(score: number, status: string): void;
    protected abstract removeAllOverlays(): void;

    async startPack(mode: "items" | "time", limit: number) {
        await sendMessage({ type: "START_PACK", payload: { tabId: this.session.tabId, mode, limit } });
        this.session.packState = { active: true, mode, limit, consumed: 0, startedAt: Date.now() };
        this.session.cookedScore = 0;
        this.session.cookedStatus = "Based";
        this.maxCookedShown = false;
        this.clearForcedMaxCookedChoice();
        this.resetMomentum();
        this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);
    }

    async startTouchGrass(minutes: number) {
        await sendMessage({ type: "START_TOUCH_GRASS", payload: { tabId: this.session.tabId, minutes } });
        this.session.touchGrass = { active: true, endsAt: Date.now() + minutes * 60_000, bypassCount: 0 };
        this.clearForcedMaxCookedChoice();
        this.showTouchGrassOverlay();
    }

    async endTouchGrass() {
        await sendMessage({ type: "END_TOUCH_GRASS", payload: { tabId: this.session.tabId } });
        this.session.touchGrass = { ...DEFAULT_TOUCH_GRASS };
        this.session.cookedScore = 0;
        this.session.cookedStatus = "Based";
        this.maxCookedShown = false;
        this.clearForcedMaxCookedChoice();
        this.resetMomentum();
        this.removeAllOverlays();
        this.mountCookedWidget();
    }

    async bypassTouchGrass() {
        this.session.touchGrass.bypassCount++;
        sendMessage({ type: "LOG_EVENT", payload: { eventType: "bypass" } });
        await this.endTouchGrass();
    }

    protected armBuiltDifferentFollowUp() {
        this.builtDifferentDismissed = true;
        this.maxCookedChoiceLocked = true;
    }

    private isTouchGrassActive(now: number = Date.now()): boolean {
        return this.session.touchGrass.active && this.session.touchGrass.endsAt > now;
    }

    private pickSideQuest(excludeId?: string): SideQuestDefinition {
        const candidates = SIDE_QUESTS.filter((quest) => quest.id !== excludeId);
        this.sideQuestSeed = (this.sideQuestSeed + 1) % Math.max(1, candidates.length);
        return candidates[this.sideQuestSeed] ?? SIDE_QUESTS[0];
    }

    private renderSideQuestPrompt(quest: SideQuestDefinition, source: "manual" | "auto") {
        const wrapper = showOverlay("sidequest", `
            <div class="brd-fullscreen">
                <div class="brd-card brd-sidequest-card">
                    <div class="brd-sidequest-badge">${source === "auto" ? "Mini reset unlocked" : "Manual Side Quest"}</div>
                    <div class="brd-sidequest-icon">${quest.icon}</div>
                    <h2>${quest.title}</h2>
                    <p>${quest.instruction}</p>
                    <p class="brd-sidequest-meta">${quest.durationSec}s timer. Finish it and shave 12 points off the cooked meter.</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-success" data-action="accept">Accept Quest</button>
                        <button class="brd-btn brd-btn-primary" data-action="reroll">Reroll</button>
                        <button class="brd-btn brd-btn-ghost" data-action="skip">Not Now</button>
                    </div>
                </div>
            </div>
        `);

        wrapper.querySelector("[data-action='accept']")?.addEventListener("click", () => {
            this.renderActiveSideQuest(quest);
        });

        wrapper.querySelector("[data-action='reroll']")?.addEventListener("click", () => {
            this.renderSideQuestPrompt(this.pickSideQuest(quest.id), source);
        });

        wrapper.querySelector("[data-action='skip']")?.addEventListener("click", () => {
            this.closeSideQuest("skip");
        });
    }

    private renderActiveSideQuest(quest: SideQuestDefinition) {
        const wrapper = showOverlay("sidequest", `
            <div class="brd-fullscreen">
                <div class="brd-card brd-sidequest-card">
                    <div class="brd-sidequest-badge">Side Quest Active</div>
                    <div class="brd-sidequest-icon">${quest.icon}</div>
                    <h2>${quest.title}</h2>
                    <p class="brd-sidequest-instruction">${quest.instruction}</p>
                    <div class="brd-sidequest-countdown" data-role="countdown">${quest.durationSec}</div>
                    <p class="brd-sidequest-meta">Done unlocks when the timer hits zero.</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-success" data-action="done" disabled>Done</button>
                        <button class="brd-btn brd-btn-ghost" data-action="bail">Bail</button>
                    </div>
                </div>
            </div>
        `);

        const countdownEl = wrapper.querySelector<HTMLElement>("[data-role='countdown']");
        const doneBtn = wrapper.querySelector<HTMLButtonElement>("[data-action='done']");
        const startedAt = Date.now();

        const interval = window.setInterval(() => {
            const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
            const remaining = Math.max(0, quest.durationSec - elapsedSec);
            if (countdownEl) {
                countdownEl.textContent = String(remaining);
            }
            if (remaining === 0) {
                clearInterval(interval);
                if (doneBtn) {
                    doneBtn.disabled = false;
                }
            }
        }, 200);

        doneBtn?.addEventListener("click", () => {
            clearInterval(interval);
            void this.completeSideQuest();
        });

        wrapper.querySelector("[data-action='bail']")?.addEventListener("click", () => {
            clearInterval(interval);
            this.closeSideQuest("bail");
        });
    }

    private closeSideQuest(reason: "skip" | "bail" | "complete") {
        if (!this.isSideQuestOpen()) return;
        removeOverlay("sidequest");
        const shouldReopenForcedChoice =
            reason !== "complete" &&
            this.reopenForcedChoiceAfterSideQuest &&
            this.maxCookedChoiceLocked &&
            isMaxCooked(this.session.cookedScore);
        this.reopenForcedChoiceAfterSideQuest = false;
        this.onSideQuestClosed();
        if (shouldReopenForcedChoice) {
            this.showLockedMaxCookedOverlay();
        }
    }

    private async completeSideQuest() {
        const now = Date.now();
        const nextPromptAfterMs = now + this.settings.sideQuest.promptCooldownMinutes * 60_000;

        this.session.cookedScore = Math.max(0, this.session.cookedScore - SIDE_QUEST_SCORE_RELIEF);
        this.session.cookedStatus = deriveCookedStatus(this.session.cookedScore, this.settings.cooked.thresholds);
        this.session.lastInterventionAt = now;
        this.maxCookedShown = this.session.cookedScore >= 100;
        this.clearForcedMaxCookedChoice();

        this.closeSideQuest("complete");
        this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);

        const settingsRes = await sendMessage({
            type: "UPDATE_SETTINGS",
            payload: {
                sideQuest: {
                    promptCooldownMinutes: this.settings.sideQuest.promptCooldownMinutes,
                    nextPromptAfterMs,
                },
            },
        });
        if (settingsRes?.success) {
            this.settings = settingsRes.data;
        } else {
            this.settings.sideQuest.nextPromptAfterMs = nextPromptAfterMs;
        }

        await sendMessage({ type: "UPDATE_SESSION", payload: { tabId: this.session.tabId, patch: this.session } });
        await sendMessage({ type: "LOG_EVENT", payload: { eventType: "side_quest_completed" } });
    }

    private async maybeAutoPrompt(previousStatus: CookedStatus, newStatus: CookedStatus, now: number) {
        if (previousStatus !== "Based" || newStatus !== "Medium Cooked") return;
        if (!this.canOpenSideQuest("auto", now)) return;
        await this.openSideQuest("auto");
    }

    private clearForcedMaxCookedChoice() {
        this.builtDifferentDismissed = false;
        this.maxCookedChoiceLocked = false;
        this.reopenForcedChoiceAfterSideQuest = false;
    }

    private showLockedMaxCookedOverlay() {
        removeOverlay("intervention");
        this.onLockedMaxCookedOverlayOpened();
        const wrapper = showOverlay("denied", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2 style="font-size:28px;text-align:center;color:#f87171;">You cannot keep doomscrolling man.</h2>
                    <p style="text-align:center;">Score is still maxed. Pick something that actually breaks the loop.</p>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                        <button class="brd-btn brd-btn-ghost" data-action="sidequest">Side Quest</button>
                    </div>
                </div>
            </div>
        `);

        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.onLockedMaxCookedOverlayClosed();
            void this.startPack("items", 10);
        });

        wrapper.querySelector("[data-action='grass']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.onLockedMaxCookedOverlayClosed();
            void this.startTouchGrass(this.settings.touchGrass.defaultMinutes);
        });

        wrapper.querySelector("[data-action='sidequest']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.onLockedMaxCookedOverlayClosed();
            void this.openSideQuest("manual", { returnToForcedChoice: true });
        });
    }

    private pruneVelocitySamples(now: number = Date.now()) {
        this.velocitySamples = this.velocitySamples.filter((sample) => now - sample.at <= VELOCITY_WINDOW_MS);
    }

    private async getCurrentTabId(): Promise<number> {
        return new Promise((resolve) => {
            const fallbackId = Math.floor(Math.random() * 1_000_000);
            sendMessage({ type: "GET_CURRENT_TAB" }).then((res) => {
                resolve(res.data?.id ?? fallbackId);
            });
        });
    }
}
