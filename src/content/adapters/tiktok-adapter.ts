import { TOUCH_GRASS_TIPS, VIBE_OPTIONS } from "@/core/constants";
import { computeTikTokCookedScore, deriveCookedStatus, getCookedLabel, isMaxCooked, shouldIntervene } from "@/core/cooked-meter";
import { sendMessage } from "@/core/messaging";
import { getPackProgress, incrementPack, isPackComplete } from "@/core/snack-packs";
import type { CookedStatus, VibeIntent } from "@/core/types";
import { removeAllOverlays as removeAll, removeOverlay, showOverlay } from "../overlays/overlay-manager";
import { BaseAdapter } from "./base-adapter";

/**
 * TikTok adapter
 * Uses hybrid scoring: watch time + swipes
 */
export class TikTokAdapter extends BaseAdapter {
    readonly site = "tiktok" as const;
    private itemsSinceLastTick = 0;
    private watchTimeSinceLastTick = 0;
    private lastVideoId = "";
    private videoObserver: MutationObserver | null = null;
    private currentVideo: HTMLVideoElement | null = null;

    /* -- Video helpers ------------------------------------ */

    private getTikTokVideo(): HTMLVideoElement | null {
        return (
            document.querySelector<HTMLVideoElement>("[data-e2e='recommend-list-item-container'] video") ??
            document.querySelector<HTMLVideoElement>(".tiktok-web-player video") ??
            document.querySelector<HTMLVideoElement>("video")
        );
    }

    private freezeFeed() {
        const v = this.getTikTokVideo();
        if (v && !v.paused) v.pause();
    }

    private thawFeed() {
        const v = this.getTikTokVideo();
        if (v && v.paused) v.play().catch(() => { });
    }

    /* -- Observers ---------------------------------------- */

    protected setupObservers(): void {
        // Track scroll/swipe events
        window.addEventListener("wheel", this.onWheel, { passive: true });

        // Touch events for mobile swipe detection
        let touchStartY = 0;
        window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0]?.clientY ?? 0; }, { passive: true });
        window.addEventListener("touchend", (e) => {
            const delta = touchStartY - (e.changedTouches[0]?.clientY ?? 0);
            if (Math.abs(delta) > 50) {
                this.swipeCount++;
                this.itemsSinceLastTick++;
            }
        }, { passive: true });

        // Watch for video changes (TikTok is a single-page feed)
        this.watchVideoChanges();

        // Track watch time via timeupdate
        this.trackWatchTime();

        // Listen for messages from background/popup
        chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
            if (msg.type === "END_TOUCH_GRASS") {
                this.session.touchGrass = { active: false, endsAt: 0, bypassCount: 0 };
                removeOverlay("skyrim");
                removeOverlay("touchgrass");
                this.thawFeed();
                sendResponse({ success: true });
                return false;
            }
            if (msg.type === "TRIGGER_TOUCH_GRASS") {
                this.startTouchGrass(msg.payload?.minutes ?? 5);
                sendResponse({ success: true });
                return false;
            }
            if (msg.type === "TRIGGER_PACK") {
                this.startPack(msg.payload?.mode ?? "items", msg.payload?.limit ?? 10);
                sendResponse({ success: true });
                return false;
            }
            if (msg.type === "TRIGGER_VIBE_CHECK") {
                this.showVibeCheckOverlay();
                sendResponse({ success: true });
                return false;
            }
            return false;
        });
    }

    private onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > 20) {
            this.swipeCount++;
        }
    };

    private watchVideoChanges() {
        // Poll for video element and track which video is playing
        const poll = () => {
            const video = this.getTikTokVideo();
            if (video && video !== this.currentVideo) {
                this.currentVideo = video;
                // New video detected - count as item consumed
                const videoId = video.src || video.currentSrc || String(Date.now());
                if (videoId !== this.lastVideoId) {
                    this.lastVideoId = videoId;
                    this.itemsSinceLastTick++;
                }
            }
        };

        setInterval(poll, 500);

        // Also watch DOM for feed container changes
        const observer = new MutationObserver(() => poll());
        const tryObserve = () => {
            const container =
                document.querySelector("[data-e2e='recommend-list-item-container']") ??
                document.querySelector(".tiktok-web-player") ??
                document.body;
            observer.observe(container, { childList: true, subtree: true });
        };

        if (document.readyState === "complete") {
            tryObserve();
        } else {
            window.addEventListener("load", tryObserve);
        }

        this.videoObserver = observer;
    }

    private trackWatchTime() {
        // Accumulate watch time from current video
        const tick = () => {
            const video = this.getTikTokVideo();
            if (video && !video.paused && this.isVideoInViewport(video)) {
                this.watchTimeSinceLastTick += 100; // ~100ms per tick
            }
        };
        setInterval(tick, 100);
    }

    private isVideoInViewport(video: HTMLVideoElement): boolean {
        const rect = video.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /* -- Item tracking ------------------------------------ */

    protected getNewItemsSinceLastTick(): number {
        const count = this.itemsSinceLastTick;
        this.itemsSinceLastTick = 0;
        return count;
    }

    /* -- Override tick for TikTok-specific scoring --------- */

    protected getWatchTimeSinceLastTick(): number {
        const ms = this.watchTimeSinceLastTick;
        this.watchTimeSinceLastTick = 0;
        return ms;
    }

    /* -- Cooked widget ------------------------------------ */

    protected mountCookedWidget(): void {
        this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);
    }

    protected updateCookedWidget(score: number, status: string): void {
        const label = getCookedLabel(status as CookedStatus);
        const scoreClass =
            status === "Based" ? "brd-score-based" :
                status === "Medium Cooked" ? "brd-score-medium" : "brd-score-cooked";

        let packHtml = "";
        if (this.session.packState.active) {
            const progress = getPackProgress(this.session.packState);
            const packLabel = this.session.packState.mode === "time" && progress.timeRemaining
                ? `[#] Pack: ${progress.timeRemaining}`
                : `[#] Pack: ${progress.current}/${progress.total}`;
            packHtml = `
                <div style="width:100%;margin-top:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">${packLabel}</div>
                    <div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${progress.percent}%"></div></div>
                </div>
            `;
        }

        const wrapper = showOverlay("widget", `
            <div class="brd-widget">
                <span class="brd-widget-emoji">${label.emoji}</span>
                <span class="brd-widget-label">${label.label}</span>
                <span class="brd-widget-score ${scoreClass}">${score}</span>
                ${packHtml}
            </div>
        `);

        const widget = wrapper.querySelector(".brd-widget");
        if (widget) {
            (widget as HTMLElement).style.cursor = "pointer";
            (widget as HTMLElement).onclick = () => this.showVibeCheckOverlay();
        }
    }

    /* -- Intervention overlay ------------------------------ */

    protected showInterventionOverlay(): void {
        const label = getCookedLabel(this.session.cookedStatus);
        const wrapper = showOverlay("intervention", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>${label.emoji} ${label.label}!</h2>
                    <p>Your scrolling score just hit ${this.session.cookedScore}. Your brain is getting crispy. Time to make a choice:</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going [->]</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button>
                    </div>
                </div>
            </div>
        `);

        wrapper.querySelector("[data-action='dismiss']")?.addEventListener("click", () => removeOverlay("intervention"));
        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("intervention");
            this.startPack("items", 10);
        });
        wrapper.querySelector("[data-action='grass']")?.addEventListener("click", () => {
            removeOverlay("intervention");
            this.startTouchGrass(this.settings.touchGrass.defaultMinutes);
        });
    }

    /* -- "No you are not" overlay ------------------------- */

    protected showBuiltDifferentDeniedOverlay(): void {
        this.freezeFeed();

        const wrapper = showOverlay("denied", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2>
                    <p style="text-align:center;">You thought you could just scroll away? Pick one.</p>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass (5 min)</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
                        <button class="brd-btn brd-btn-ghost" data-action="vibe">[?] Vibe Check</button>
                    </div>
                </div>
            </div>
        `);

        wrapper.querySelector("[data-action='grass']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.thawFeed();
            this.startTouchGrass(this.settings.touchGrass.defaultMinutes);
        });
        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.thawFeed();
            this.startPack("items", 10);
        });
        wrapper.querySelector("[data-action='vibe']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.thawFeed();
            this.showVibeCheckOverlay();
        });
    }

    /* -- Skyrim overlay (max cooked, pack complete) ------- */

    protected showSkyrimOverlay(message: string): void {
        const videoUrl = chrome.runtime.getURL("assets/skyrim-skeleton.mp4");
        this.freezeFeed();

        const wrapper = showOverlay("skyrim", `
            <div class="brd-fullscreen">
                <div class="brd-video-wrap">
                    <video playsinline></video>
                </div>
                <div class="brd-message">${message}</div>
                <div class="brd-btn-row">
                    <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass (5 min)</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different [+]</button>
                </div>
            </div>
        `);

        const video = wrapper.querySelector("video");
        if (video) {
            video.src = videoUrl;
            video.load();
            video.play().catch(() => { });
        }

        wrapper.querySelector("[data-action='grass']")?.addEventListener("click", () => {
            removeOverlay("skyrim");
            this.thawFeed();
            this.startTouchGrass(this.settings.touchGrass.defaultMinutes);
        });
        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("skyrim");
            this.thawFeed();
            this.startPack("items", 10);
        });
        wrapper.querySelector("[data-action='dismiss']")?.addEventListener("click", () => {
            removeOverlay("skyrim");
            this.thawFeed();
            this.builtDifferentDismissed = true;
        });
    }

    /* -- Touch Grass overlay ------------------------------- */

    protected showTouchGrassOverlay(): void {
        const endTime = this.session.touchGrass.endsAt;
        const tips = TOUCH_GRASS_TIPS.sort(() => Math.random() - 0.5).slice(0, 3);
        this.freezeFeed();

        const ZEN_IMAGES = [
            "https://cataas.com/cat?width=900&height=700&t=1",
            "https://cataas.com/cat?width=900&height=700&t=2",
            "https://cataas.com/cat?width=900&height=700&t=3",
            "https://cataas.com/cat?width=900&height=700&t=4",
            "WEBCAM",
            "https://cataas.com/cat?width=900&height=700&t=5",
            "https://cataas.com/cat?width=900&height=700&t=6",
        ];

        const shuffled = [...ZEN_IMAGES].sort(() => Math.random() - 0.5);

        const wrapper = showOverlay("touchgrass", `
            <div class="brd-fullscreen brd-zen-bg">
                <div class="brd-zen-slide-wrap">
                    <img class="brd-zen-img" src="" alt="zen" />
                    <video class="brd-zen-webcam" autoplay muted playsinline style="display:none;"></video>
                    <div class="brd-zen-caption"></div>
                </div>
                <div class="brd-zen-card">
                    <div class="brd-zen-header">[*] Touch Grass Mode</div>
                    <div class="brd-timer" id="brd-tg-timer">00:00</div>
                    <div class="brd-tips">
                        ${tips.map((t) => `<div class="brd-tip">${t}</div>`).join("")}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button>
                    </div>
                </div>
            </div>
        `);

        const imgEl = wrapper.querySelector<HTMLImageElement>(".brd-zen-img")!;
        const webcamEl = wrapper.querySelector<HTMLVideoElement>(".brd-zen-webcam")!;
        const captionEl = wrapper.querySelector<HTMLElement>(".brd-zen-caption")!;
        let webcamStream: MediaStream | null = null;
        let slideIndex = 0;

        const ZEN_CAPTIONS = [
            "breathe.", "you are here.", "it's okay.", "look at this.",
            "touch grass.", "be present.", "slow down.", "this is real life.",
        ];

        const showSlide = async (idx: number) => {
            const src = shuffled[idx % shuffled.length];
            if (src === "WEBCAM") {
                imgEl.style.display = "none";
                webcamEl.style.display = "block";
                captionEl.textContent = "hi. this is you.";
                if (!webcamStream) {
                    try {
                        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                        webcamEl.srcObject = webcamStream;
                    } catch {
                        showSlide(idx + 1);
                    }
                }
            } else {
                webcamEl.style.display = "none";
                imgEl.style.display = "block";
                imgEl.src = src;
                captionEl.textContent = ZEN_CAPTIONS[Math.floor(Math.random() * ZEN_CAPTIONS.length)];
            }
        };

        showSlide(slideIndex);
        const slideInterval = setInterval(() => {
            slideIndex++;
            showSlide(slideIndex);
        }, 4000);

        const timerEl = wrapper.querySelector("#brd-tg-timer");
        const timerInterval = setInterval(() => {
            const remaining = Math.max(0, endTime - Date.now());
            const min = Math.floor(remaining / 60_000);
            const sec = Math.floor((remaining % 60_000) / 1_000);
            if (timerEl) timerEl.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
            if (remaining <= 0) {
                clearInterval(timerInterval);
                clearInterval(slideInterval);
                if (webcamStream) webcamStream.getTracks().forEach((t) => t.stop());
                this.endTouchGrass();
                this.thawFeed();
                removeOverlay("touchgrass");
            }
        }, 1000);

        wrapper.querySelector("[data-action='bypass']")?.addEventListener("click", () => {
            clearInterval(timerInterval);
            clearInterval(slideInterval);
            if (webcamStream) webcamStream.getTracks().forEach((t) => t.stop());
            this.bypassTouchGrass();
            this.thawFeed();
            removeOverlay("touchgrass");
        });
    }

    /* -- Vibe Check overlay ------------------------------- */

    protected showVibeCheckOverlay(): void {
        const vibes = VIBE_OPTIONS.map((v) => `
            <div class="brd-vibe-card" data-vibe="${v.id}">
                <span class="brd-vibe-emoji">${v.emoji}</span>
                <span class="brd-vibe-label">${v.label}</span>
            </div>
        `).join("");

        const wrapper = showOverlay("vibecheck", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>[?] Vibe Check</h2>
                    <p>What are you here for?</p>
                    <div class="brd-vibe-grid">
                        ${vibes}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button>
                    </div>
                </div>
            </div>
        `);

        wrapper.querySelectorAll("[data-vibe]").forEach((el) => {
            el.addEventListener("click", () => {
                const intent = (el as HTMLElement).dataset.vibe as VibeIntent;
                this.setVibeIntent(intent);
                removeOverlay("vibecheck");
            });
        });

        wrapper.querySelector("[data-action='skip']")?.addEventListener("click", () => {
            removeOverlay("vibecheck");
        });
    }

    /* ── Override tick for TikTok-specific scoring ──────── */

    protected async tick() {
        if (!this.enabled) return;

        const now = Date.now();
        const newItems = this.getNewItemsSinceLastTick();
        this.session.itemsConsumed += newItems;
        this.session.scrollEvents += this.scrollCount;

        const hasNewSignals = this.scrollCount > 0 || newItems > 0 || this.swipeCount > 0;
        if (hasNewSignals) this.lastSignalAt = now;
        const idleMs = this.lastSignalAt === 0 ? 0 : now - this.lastSignalAt;

        // Handle "Built Different" dismissal
        if (this.builtDifferentDismissed && hasNewSignals) {
            this.builtDifferentDismissed = false;
            this.scrollCount = 0;
            this.swipeCount = 0;
            this.onBuiltDifferentDenied();
            return;
        }

        // Get watch time for this tick
        const watchTimeMs = this.getWatchTimeSinceLastTick();

        // Compute score using TikTok-specific formula
        let newScore: number;
        if (this.session.packState.active) {
            newScore = this.session.cookedScore; // frozen during pack
        } else {
            newScore = computeTikTokCookedScore(
                this.session.cookedScore,
                watchTimeMs,
                this.swipeCount,
                this.session.vibeIntent,
                idleMs
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

        // Intervention check
        if (!this.session.packState.active) {
            if (isMaxCooked(newScore)) {
                if (!this.maxCookedShown) {
                    this.maxCookedShown = true;
                    this.onMaxCooked();
                }
            } else {
                if (newScore < 95) this.maxCookedShown = false;
                const scoreRising = newScore >= this.session.cookedScore;
                if (scoreRising && shouldIntervene(newScore, this.session.lastInterventionAt, this.settings.cooked.thresholds, now)) {
                    this.session.lastInterventionAt = now;
                    this.onIntervention();
                }
            }
        }

        this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);
        await sendMessage({ type: "UPDATE_SESSION", payload: { tabId: this.session.tabId, patch: this.session } });
    }

    /* -- Cleanup ------------------------------------------ */

    protected removeAllOverlays(): void {
        removeAll();
        this.thawFeed();
    }
}
