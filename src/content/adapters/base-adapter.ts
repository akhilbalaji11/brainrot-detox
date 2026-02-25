import { DEFAULT_PACK_STATE, DEFAULT_TOUCH_GRASS, TICK_INTERVAL_MS } from "@/core/constants";
import { computeInstantScore, computeRollingScore, computeShortsCookedScore, deriveCookedStatus, isMaxCooked, shouldIntervene } from "@/core/cooked-meter";
import { sendMessage } from "@/core/messaging";
import { incrementPack, isPackComplete } from "@/core/snack-packs";
import type { SessionState, SettingsState, SiteKey, VibeIntent } from "@/core/types";

/**
 * Abstract base adapter – handles lifecycle, cooked meter ticking,
 * pack counting, and overlay triggers. Subclasses implement site-specific
 * DOM observation.
 */
export abstract class BaseAdapter {
    abstract readonly site: SiteKey;
    protected settings!: SettingsState;
    protected session!: SessionState;
    protected enabled = false;
    private tickTimer: number | null = null;
    protected lastSignalAt = 0;
    protected scrollCount = 0;
    protected swipeCount = 0;
    protected maxCookedShown = false;
    protected builtDifferentDismissed = false;

    /* ── Lifecycle ────────────────────────────────────────── */

    async init() {
        try {
            const settingsRes = await sendMessage({ type: "GET_SETTINGS" });
            if (!settingsRes.success) return;
            this.settings = settingsRes.data;

            if (!this.settings.masterEnabled || !this.settings.sites[this.site]?.enabled) {
                console.log(`[brainrot detox] Disabled for ${this.site}`);
                return;
            }

            // Create or restore session
            const tab = await this.getCurrentTabId();
            let sessionRes = await sendMessage({ type: "GET_SESSION", payload: { tabId: tab } });
            if (!sessionRes.data) {
                // Create new session
                this.session = {
                    site: this.site,
                    tabId: tab,
                    startedAt: Date.now(),
                    cookedScore: 0,
                    cookedStatus: "Based",
                    lastInterventionAt: 0,
                    packState: { ...DEFAULT_PACK_STATE },
                    touchGrass: { ...DEFAULT_TOUCH_GRASS },
                    vibeIntent: this.settings.vibeCheck.activeIntent,
                    itemsConsumed: 0,
                    scrollEvents: 0,
                };
                await sendMessage({ type: "UPDATE_SESSION", payload: { tabId: tab, patch: this.session } });
            } else {
                this.session = sessionRes.data;
            }

            this.enabled = true;
            console.log(`[brainrot detox] ${this.site} adapter initialized`);

            // Mount initial widget
            this.mountCookedWidget();

            // Setup observers
            this.setupObservers();

            // Start tick loop
            this.tickTimer = window.setInterval(() => this.tick(), TICK_INTERVAL_MS);

            // Check if touch grass was already active
            if (this.session.touchGrass.active && this.session.touchGrass.endsAt > Date.now()) {
                this.showTouchGrassOverlay();
            }
        } catch (err) {
            console.error(`[brainrot detox] Init error for ${this.site}:`, err);
        }
    }

    destroy() {
        this.enabled = false;
        if (this.tickTimer) clearInterval(this.tickTimer);
        this.removeAllOverlays();
    }

    /* ── Abstract methods subclasses must implement ──────── */

    /** Set up DOM observation (scroll, navigation, feed items) */
    protected abstract setupObservers(): void;

    /** Mount the floating cooked widget at the right position */
    protected abstract mountCookedWidget(): void;

    /** Get the number of new items seen since last tick */
    protected abstract getNewItemsSinceLastTick(): number;

    /* ── Tick loop ──────────────────────────────────────── */

    protected async tick() {
        if (!this.enabled) return;

        const now = Date.now();
        const newItems = this.getNewItemsSinceLastTick();
        this.session.itemsConsumed += newItems;
        this.session.scrollEvents += this.scrollCount;

        const hasNewSignals = this.scrollCount > 0 || newItems > 0 || this.swipeCount > 0;
        if (hasNewSignals) this.lastSignalAt = now;
        const idleMs = this.lastSignalAt === 0 ? 0 : now - this.lastSignalAt;

        // "No you are not" — if user dismissed and then scrolled again, re-intervene
        if (this.builtDifferentDismissed && hasNewSignals) {
            this.builtDifferentDismissed = false;
            this.scrollCount = 0;
            this.swipeCount = 0;
            this.onBuiltDifferentDenied();
            return;
        }

        // While a pack is active, freeze the cooked score — packs are separate
        let newScore: number;
        if (this.session.packState.active) {
            newScore = this.session.cookedScore; // frozen
        } else if (this.site === "shorts") {
            newScore = computeShortsCookedScore(
                this.session.cookedScore,
                this.swipeCount,
                this.session.vibeIntent,
                idleMs
            );
        } else {
            const sessionMin = (now - this.session.startedAt) / 60_000;
            const instant = computeInstantScore(
                sessionMin,
                this.settings.cooked.sessionCapMinutes,
                this.session.scrollEvents,
                this.session.itemsConsumed
            );
            newScore = computeRollingScore(
                this.session.cookedScore,
                instant,
                hasNewSignals,
                idleMs,
                this.session.vibeIntent
            );
        }

        // Reset per-tick counters
        this.scrollCount = 0;
        this.swipeCount = 0;

        this.session.cookedScore = newScore;
        this.session.cookedStatus = deriveCookedStatus(newScore, this.settings.cooked.thresholds);

        // Pack progress check
        if (this.session.packState.active) {
            this.session.packState = incrementPack(this.session.packState, newItems);
            if (isPackComplete(this.session.packState, now)) {
                this.onPackComplete();
            }
        }

        // Intervention check (only when not in a pack)
        if (!this.session.packState.active) {
            if (isMaxCooked(newScore)) {
                if (!this.maxCookedShown) {
                    this.maxCookedShown = true;
                    this.onMaxCooked();
                }
            } else {
                // Reset the max-cooked flag only when score drops well below 100
                if (newScore < 95) this.maxCookedShown = false;
                // Only trigger intervention when score is rising (not decaying from 100)
                const scoreRising = newScore >= this.session.cookedScore;
                if (scoreRising && shouldIntervene(newScore, this.session.lastInterventionAt, this.settings.cooked.thresholds, now)) {
                    this.session.lastInterventionAt = now;
                    this.onIntervention();
                }
            }
        }

        // Update widget display
        this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);

        // Persist session
        const tab = this.session.tabId;
        await sendMessage({ type: "UPDATE_SESSION", payload: { tabId: tab, patch: this.session } });
    }

    /* ── Tab ID helper ──────────────────────────────────── */

    private async getCurrentTabId(): Promise<number> {
        return new Promise((resolve) => {
            // Content scripts can use the sender tab id via background
            // But a simpler approach: use a unique ID per instance
            const id = Math.floor(Math.random() * 1_000_000);
            // Try to get actual tab id
            sendMessage({ type: "GET_CURRENT_TAB" }).then((res) => {
                resolve(res.data?.id ?? id);
            });
        });
    }

    /* ── Overlay methods (called by tick, implemented via overlay-manager) ── */

    protected onIntervention() {
        sendMessage({ type: "LOG_EVENT", payload: { eventType: "intervention" } });
        this.showInterventionOverlay();
    }

    protected onMaxCooked() {
        this.session.lastInterventionAt = Date.now();
        sendMessage({ type: "LOG_EVENT", payload: { eventType: "intervention" } });
        this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)");
    }

    protected onPackComplete() {
        // Re-enable score computation now that pack is done
        this.session.packState = { ...DEFAULT_PACK_STATE };
        this.maxCookedShown = false;
        sendMessage({ type: "END_PACK", payload: { tabId: this.session.tabId } });
        this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.");
    }

    protected onBuiltDifferentDenied() {
        this.showBuiltDifferentDeniedOverlay();
    }

    /* ── Overlay abstract hooks ─────────────────────────── */

    protected abstract showInterventionOverlay(): void;
    protected abstract showTouchGrassOverlay(): void;
    protected abstract showSkyrimOverlay(message: string): void;
    protected abstract showVibeCheckOverlay(): void;
    protected abstract showBuiltDifferentDeniedOverlay(): void;
    protected abstract updateCookedWidget(score: number, status: string): void;
    protected abstract removeAllOverlays(): void;

    /* ── Public actions (called by overlays / popup) ─────── */

    async startPack(mode: "items" | "time", limit: number) {
        await sendMessage({ type: "START_PACK", payload: { tabId: this.session.tabId, mode, limit } });
        this.session.packState = { active: true, mode, limit, consumed: 0, startedAt: Date.now() };
        // Reset cooked score to 0 — packs are a fresh start
        this.session.cookedScore = 0;
        this.session.cookedStatus = "Based";
        this.maxCookedShown = false;
        this.builtDifferentDismissed = false;
    }

    async startTouchGrass(minutes: number) {
        await sendMessage({ type: "START_TOUCH_GRASS", payload: { tabId: this.session.tabId, minutes } });
        this.session.touchGrass = { active: true, endsAt: Date.now() + minutes * 60_000, bypassCount: 0 };
        this.showTouchGrassOverlay();
    }

    async endTouchGrass() {
        await sendMessage({ type: "END_TOUCH_GRASS", payload: { tabId: this.session.tabId } });
        this.session.touchGrass = { ...DEFAULT_TOUCH_GRASS };
        // Reset cooked score after completing touch grass
        this.session.cookedScore = 0;
        this.session.cookedStatus = "Based";
        this.maxCookedShown = false;
        this.removeAllOverlays();
    }

    async bypassTouchGrass() {
        this.session.touchGrass.bypassCount++;
        sendMessage({ type: "LOG_EVENT", payload: { eventType: "bypass" } });
        await this.endTouchGrass();
    }

    setVibeIntent(intent: VibeIntent) {
        this.session.vibeIntent = intent;
        sendMessage({ type: "UPDATE_SESSION", payload: { tabId: this.session.tabId, patch: { vibeIntent: intent } } });
        sendMessage({ type: "LOG_EVENT", payload: { eventType: "vibe_check" } });
    }
}
