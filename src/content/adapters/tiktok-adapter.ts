import { TOUCH_GRASS_TIPS } from "@/core/constants";
import {
    TIKTOK_WATCH_SCORE_PER_SECOND,
    computeTikTokCookedScore,
    getCookedLabel,
} from "@/core/cooked-meter";
import { removeAllOverlays as removeAll, removeOverlay, showOverlay } from "../overlays/overlay-manager";
import { BaseAdapter } from "./base-adapter";

export class TikTokAdapter extends BaseAdapter {
    readonly site = "tiktok" as const;

    private itemsSinceLastTick = 0;
    private watchTimeSinceLastTick = 0;
    private lastActiveVideoFingerprint = "";
    private readonly nodeIds = new WeakMap<Element, number>();
    private nextNodeId = 1;

    private readonly handleRuntimeMessage = (msg: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
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

        if (msg.type === "TRIGGER_SIDE_QUEST") {
            void this.openSideQuest("manual");
            sendResponse({ success: true });
            return false;
        }

        return false;
    };

    private getActiveTikTokVideo(): HTMLVideoElement | null {
        const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
        return videos.find((video) => this.isVideoMostlyInViewport(video)) ?? videos[0] ?? null;
    }

    private getNodeId(element: Element): number {
        const existing = this.nodeIds.get(element);
        if (existing) return existing;

        const nextId = this.nextNodeId++;
        this.nodeIds.set(element, nextId);
        return nextId;
    }

    private getVideoFingerprint(video: HTMLVideoElement): string {
        return `${this.getNodeId(video)}:${video.currentSrc || video.src || video.poster || "no-src"}`;
    }

    private freezeFeed() {
        const video = this.getActiveTikTokVideo();
        if (video && !video.paused) {
            video.pause();
        }
    }

    private thawFeed() {
        const video = this.getActiveTikTokVideo();
        if (video && video.paused) {
            video.play().catch(() => undefined);
        }
    }

    protected onSideQuestOpened(): void {
        this.freezeFeed();
    }

    protected onSideQuestClosed(): void {
        this.thawFeed();
    }

    protected onLockedMaxCookedOverlayOpened(): void {
        this.freezeFeed();
    }

    protected onLockedMaxCookedOverlayClosed(): void {
        this.thawFeed();
    }

    protected setupObservers(): void {
        this.registerEventListener(window, "wheel", (event: Event) => {
            const wheelEvent = event as WheelEvent;
            if (Math.abs(wheelEvent.deltaY) > 20) {
                this.scrollCount++;
                this.recordActivity();
            }
        }, { passive: true });

        this.registerEventListener(window, "keydown", (event: Event) => {
            const keyEvent = event as KeyboardEvent;
            if (keyEvent.key === "ArrowDown" || keyEvent.key === "j") {
                this.scrollCount++;
                this.recordActivity();
            }
        }, { passive: true });

        let touchStartY = 0;
        this.registerEventListener(window, "touchstart", (event: Event) => {
            touchStartY = (event as TouchEvent).touches[0]?.clientY ?? 0;
        }, { passive: true });
        this.registerEventListener(window, "touchend", (event: Event) => {
            const delta = touchStartY - ((event as TouchEvent).changedTouches[0]?.clientY ?? 0);
            if (Math.abs(delta) > 50) {
                this.scrollCount++;
                this.recordActivity();
            }
        }, { passive: true });

        const detectActiveVideo = () => {
            const video = this.getActiveTikTokVideo();
            if (!video) return;

            const fingerprint = this.getVideoFingerprint(video);
            if (!this.lastActiveVideoFingerprint) {
                this.lastActiveVideoFingerprint = fingerprint;
                return;
            }

            if (fingerprint !== this.lastActiveVideoFingerprint) {
                this.lastActiveVideoFingerprint = fingerprint;
                this.itemsSinceLastTick++;
                this.recordSuccessfulNavigation();
            }
        };

        this.registerInterval(detectActiveVideo, 250);
        this.registerInterval(() => {
            const video = this.getActiveTikTokVideo();
            if (video && !video.paused && this.isVideoMostlyInViewport(video) && !this.hasBlockingOverlayOpen()) {
                this.watchTimeSinceLastTick += 100;
            }
        }, 100);

        const observeFeed = () => {
            const container =
                document.querySelector("[data-e2e='recommend-list-item-container']") ??
                document.querySelector(".tiktok-web-player") ??
                document.body;
            this.registerMutationObserver(container, { childList: true, subtree: true }, () => detectActiveVideo());
        };

        if (document.readyState === "complete") {
            observeFeed();
        } else {
            this.registerEventListener(window, "load", observeFeed, { once: true });
        }

        this.registerRuntimeMessageListener(this.handleRuntimeMessage);
    }

    protected getNewItemsSinceLastTick(): number {
        const count = this.itemsSinceLastTick;
        this.itemsSinceLastTick = 0;
        return count;
    }

    protected async tick() {
        if (!this.enabled) return;

        const now = Date.now();
        const previousScore = this.session.cookedScore;
        const previousStatus = this.session.cookedStatus;
        const newItems = this.getNewItemsSinceLastTick();
        const watchTimeMs = this.watchTimeSinceLastTick;
        this.watchTimeSinceLastTick = 0;

        this.session.itemsConsumed += newItems;
        this.session.scrollEvents += this.scrollCount;

        const hasNewSignals = this.scrollCount > 0 || newItems > 0 || this.swipeCount > 0 || watchTimeMs > 0;
        const idleMs = this.lastSignalAt === 0 ? 0 : now - this.lastSignalAt;

        if (this.builtDifferentDismissed && hasNewSignals) {
            this.builtDifferentDismissed = false;
            this.scrollCount = 0;
            this.swipeCount = 0;
            this.onBuiltDifferentDenied();
            return;
        }

        let newScore = previousScore;
        if (!this.session.packState.active) {
            const baseGain = newItems + (watchTimeMs / 1000) * TIKTOK_WATCH_SCORE_PER_SECOND;
            const signalGain = baseGain * this.getVelocityMultiplier(now);
            newScore = computeTikTokCookedScore(previousScore, signalGain, idleMs);
        }
        await this.completeTick(previousScore, previousStatus, newScore, newItems, now);
    }

    protected mountCookedWidget(): void {
        this.renderCookedWidget(this.session.cookedScore, this.session.cookedStatus);
    }

    protected updateCookedWidget(score: number, status: string): void {
        this.renderCookedWidget(score, status);
    }

    protected showInterventionOverlay(): void {
        const label = getCookedLabel(this.session.cookedStatus);
        const wrapper = showOverlay("intervention", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>${label.emoji} ${label.label}!</h2>
                    <p>Your scrolling score just hit ${Math.round(this.session.cookedScore)}. Your brain is getting crispy. Time to make a choice:</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="sidequest">Side Quest</button>
                    </div>
                </div>
            </div>
        `);

        wrapper.querySelector("[data-action='dismiss']")?.addEventListener("click", () => removeOverlay("intervention"));
        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("intervention");
            this.startPack("items", 10);
        });
        wrapper.querySelector("[data-action='sidequest']")?.addEventListener("click", () => {
            removeOverlay("intervention");
            void this.openSideQuest("manual");
        });
    }

    protected showBuiltDifferentDeniedOverlay(): void {
        this.freezeFeed();

        const wrapper = showOverlay("denied", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2>
                    <p style="text-align:center;">You thought you could just scroll away? Pick one.</p>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-ghost" data-action="sidequest">Side Quest</button>
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
        wrapper.querySelector("[data-action='sidequest']")?.addEventListener("click", () => {
            removeOverlay("denied");
            void this.openSideQuest("manual", { returnToForcedChoice: true });
        });
    }

    protected showSkyrimOverlay(message: string): void {
        const videoUrl = chrome.runtime.getURL("assets/skyrim-skeleton.mp4");
        this.freezeFeed();

        const wrapper = showOverlay("skyrim", `
            <div class="brd-fullscreen">
                <div class="brd-video-wrap"><video playsinline></video></div>
                <div class="brd-message">${message}</div>
                <div class="brd-btn-row">
                    <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
                </div>
            </div>
        `);

        const video = wrapper.querySelector("video") as HTMLVideoElement | null;
        if (video) {
            video.src = videoUrl;
            video.load();
            video.play().catch(() => undefined);
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
            this.armBuiltDifferentFollowUp();
        });
    }

    protected showTouchGrassOverlay(): void {
        const endTime = this.session.touchGrass.endsAt;
        const tips = TOUCH_GRASS_TIPS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        this.freezeFeed();

        const zenImages = [
            "https://cataas.com/cat?width=900&height=700&t=1",
            "https://cataas.com/cat?width=900&height=700&t=2",
            "https://cataas.com/cat?width=900&height=700&t=3",
            "https://cataas.com/cat?width=900&height=700&t=4",
            "WEBCAM",
            "https://cataas.com/cat?width=900&height=700&t=5",
            "https://cataas.com/cat?width=900&height=700&t=6",
        ];

        const shuffled = [...zenImages].sort(() => Math.random() - 0.5);
        const wrapper = showOverlay("touchgrass", `
            <div class="brd-fullscreen brd-zen-bg">
                <div class="brd-zen-slide-wrap">
                    <img class="brd-zen-img" src="" alt="zen" />
                    <video class="brd-zen-webcam" autoplay muted playsinline style="display:none;"></video>
                    <div class="brd-zen-caption"></div>
                </div>
                <div class="brd-zen-card">
                    <div class="brd-zen-header">Touch Grass Mode</div>
                    <div class="brd-timer" id="brd-tg-timer">00:00</div>
                    <div class="brd-tips">${tips.map((tip) => `<div class="brd-tip">${tip}</div>`).join("")}</div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass</button>
                    </div>
                </div>
            </div>
        `);

        const imgEl = wrapper.querySelector<HTMLImageElement>(".brd-zen-img")!;
        const webcamEl = wrapper.querySelector<HTMLVideoElement>(".brd-zen-webcam")!;
        const captionEl = wrapper.querySelector<HTMLElement>(".brd-zen-caption")!;
        let webcamStream: MediaStream | null = null;
        let slideIndex = 0;

        const captions = [
            "breathe.",
            "you are here.",
            "it's okay.",
            "look at this.",
            "touch grass.",
            "be present.",
            "slow down.",
            "this is real life.",
        ];

        const showSlide = async (index: number) => {
            const src = shuffled[index % shuffled.length];
            if (src === "WEBCAM") {
                imgEl.style.display = "none";
                webcamEl.style.display = "block";
                captionEl.textContent = "hi. this is you.";
                if (!webcamStream) {
                    try {
                        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                        webcamEl.srcObject = webcamStream;
                    } catch {
                        await showSlide(index + 1);
                    }
                }
                return;
            }

            webcamEl.style.display = "none";
            imgEl.style.display = "block";
            imgEl.src = src;
            captionEl.textContent = captions[Math.floor(Math.random() * captions.length)];
        };

        showSlide(slideIndex);
        const slideInterval = window.setInterval(() => {
            slideIndex++;
            void showSlide(slideIndex);
        }, 4000);

        const timerEl = wrapper.querySelector("#brd-tg-timer") as HTMLElement | null;
        const timerInterval = window.setInterval(() => {
            const remaining = Math.max(0, endTime - Date.now());
            const minutes = Math.floor(remaining / 60_000);
            const seconds = Math.floor((remaining % 60_000) / 1_000);
            if (timerEl) {
                timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            }

            if (remaining <= 0) {
                clearInterval(timerInterval);
                clearInterval(slideInterval);
                if (webcamStream) webcamStream.getTracks().forEach((track) => track.stop());
                this.endTouchGrass();
                this.thawFeed();
                removeOverlay("touchgrass");
            }
        }, 1000);

        this.addCleanup(() => clearInterval(slideInterval));
        this.addCleanup(() => clearInterval(timerInterval));
        wrapper.querySelector("[data-action='bypass']")?.addEventListener("click", () => {
            clearInterval(timerInterval);
            clearInterval(slideInterval);
            if (webcamStream) webcamStream.getTracks().forEach((track) => track.stop());
            this.bypassTouchGrass();
            this.thawFeed();
            removeOverlay("touchgrass");
        });
    }

    protected removeAllOverlays(): void {
        removeAll();
        this.thawFeed();
    }

    private isVideoMostlyInViewport(video: HTMLVideoElement): boolean {
        const rect = video.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        return visibleHeight > rect.height * 0.6 && visibleWidth > rect.width * 0.6;
    }
}
