# Instagram Reels & TikTok Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Instagram Reels and TikTok platform support to Brainrot Detox with swipe-based scoring for Reels and watch-time + swipe hybrid scoring for TikTok.

**Architecture:** Create two new adapters following the existing Shorts adapter pattern. Instagram Reels adapter mirrors Shorts logic (+1 per swipe). TikTok adapter adds watch-time tracking (+0.5 per 15s watched + +1 per swipe). Update types, constants, manifest, and build scripts.

**Tech Stack:** TypeScript, Vite, Chrome Extension MV3

---

## Task 1: Update SiteKey Type

**Files:**
- Modify: `src/core/types.ts:1`

**Step 1: Add new SiteKey values**

```typescript
/* ── Site keys ─────────────────────────────────────────── */
export type SiteKey = "youtube" | "shorts" | "reddit" | "instagram-reels" | "tiktok";
```

**Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/core/types.ts
git commit -m "feat: add instagram-reels and tiktok to SiteKey type"
```

---

## Task 2: Update Constants for New Sites

**Files:**
- Modify: `src/core/constants.ts`

**Step 1: Add default settings for new sites**

In `DEFAULT_SETTINGS`, extend the `sites` object:

```typescript
export const DEFAULT_SETTINGS: SettingsState = {
    masterEnabled: true,
    sites: {
        youtube: { ...SITE_DEFAULTS },
        shorts: { ...SITE_DEFAULTS },
        reddit: { ...SITE_DEFAULTS },
        "instagram-reels": { ...SITE_DEFAULTS },
        "tiktok": { ...SITE_DEFAULTS },
    },
    // ... rest unchanged
};
```

**Step 2: Add default stats for new sites**

In `DEFAULT_STATS`, extend the `sites` object:

```typescript
export const DEFAULT_STATS: StatsState = {
    totalPacksCompleted: 0,
    totalTouchGrassSessions: 0,
    totalInterventions: 0,
    totalVibeChecks: 0,
    totalBypassCount: 0,
    sites: {
        youtube: { ...SITE_STATS_DEFAULTS },
        shorts: { ...SITE_STATS_DEFAULTS },
        reddit: { ...SITE_STATS_DEFAULTS },
        "instagram-reels": { ...SITE_STATS_DEFAULTS },
        "tiktok": { ...SITE_STATS_DEFAULTS },
    },
    weeklyScores: [],
};
```

**Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add src/core/constants.ts
git commit -m "feat: add default settings and stats for instagram-reels and tiktok"
```

---

## Task 3: Add TikTok Cooked Score Function

**Files:**
- Modify: `src/core/cooked-meter.ts`

**Step 1: Add TikTok score constants**

Add after the existing imports at top of file:

```typescript
/* ── TikTok scoring constants ─────────────────────────── */
export const TIKTOK_WATCH_SCORE_PER_SECOND = 1 / 30;  // ~0.033 per second
export const TIKTOK_SWIPE_SCORE = 1;
```

**Step 2: Add TikTok cooked score function**

Add after `isMaxCooked` function (around line 99):

```typescript
/* ── TikTok cooked score (watch time + swipes) ─────────── */

export function computeTikTokCookedScore(
    previousScore: number,
    watchTimeMs: number,
    swipes: number,
    vibeIntent: VibeIntent,
    idleMs: number
): number {
    // Watch time contribution (capped at 3s per tick)
    const watchSeconds = Math.min(watchTimeMs / 1000, 3);
    const watchScore = watchSeconds * TIKTOK_WATCH_SCORE_PER_SECOND;

    // Swipe contribution
    const swipeScore = swipes * TIKTOK_SWIPE_SCORE;

    const totalGain = watchScore + swipeScore;
    const newScore = previousScore + totalGain;

    // Idle decay (same as Shorts)
    if (idleMs < 15000) return Math.min(100, Math.round(newScore));
    if (idleMs < 60000) return Math.max(0, Math.round(newScore - 1));
    return Math.max(0, Math.round(newScore - 3));
}
```

**Step 3: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add src/core/cooked-meter.ts
git commit -m "feat: add computeTikTokCookedScore with watch-time tracking"
```

---

## Task 4: Add Instagram Reels Cooked Score Function

**Files:**
- Modify: `src/core/cooked-meter.ts`

**Step 1: Add Instagram Reels cooked score function**

Add after `computeTikTokCookedScore`:

```typescript
/* ── Instagram Reels cooked score (swipes only, same as Shorts) ─── */

export function computeReelsCookedScore(
    previousScore: number,
    swipes: number,
    vibeIntent: VibeIntent,
    idleMs: number
): number {
    if (swipes > 0) {
        return Math.max(0, Math.min(100, previousScore + swipes));
    }

    // Idle decay with vibe-based threshold
    const decayThreshold =
        vibeIntent === "Chill" || vibeIntent === "Laugh" ? 15000 :
            vibeIntent === "Learn" || vibeIntent === "JustHere" ? 25000 :
                20000;

    if (idleMs < decayThreshold) return previousScore;
    if (idleMs < 60000) return Math.max(0, previousScore - 1);
    return Math.max(0, previousScore - 3);
}
```

**Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/core/cooked-meter.ts
git commit -m "feat: add computeReelsCookedScore (swipe-based like Shorts)"
```

---

## Task 5: Create TikTok Adapter

**Files:**
- Create: `src/content/adapters/tiktok-adapter.ts`

**Step 1: Create the adapter file**

```typescript
import { TOUCH_GRASS_TIPS, VIBE_OPTIONS } from "@/core/constants";
import { computeTikTokCookedScore, getCookedLabel } from "@/core/cooked-meter";
import { getPackProgress } from "@/core/snack-packs";
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
    private videoWatchStart = 0;

    /* ── Video helpers ───────────────────────────────────── */

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

    /* ── Observers ──────────────────────────────────────── */

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

    /* ── Item tracking ──────────────────────────────────── */

    protected getNewItemsSinceLastTick(): number {
        const count = this.itemsSinceLastTick;
        this.itemsSinceLastTick = 0;
        return count;
    }

    /* ── Override tick for TikTok-specific scoring ──────── */

    private lastWatchTime = 0;

    protected getWatchTimeSinceLastTick(): number {
        const ms = this.watchTimeSinceLastTick;
        this.watchTimeSinceLastTick = 0;
        return ms;
    }

    /* ── Cooked widget ──────────────────────────────────── */

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
            packHtml = `
                <div style="width:100%;margin-top:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">[#] Pack: ${progress.current}/${progress.total}</div>
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

    /* ── Intervention overlay ───────────────────────────── */

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
            this.startTouchGrass(5);
        });
    }

    /* ── "No you are not" overlay ───────────────────────── */

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
            this.startTouchGrass(5);
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

    /* ── Skyrim overlay (max cooked, pack complete) ─────── */

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
            this.startTouchGrass(5);
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

    /* ── Touch Grass overlay ─────────────────────────────── */

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

    /* ── Vibe Check overlay ─────────────────────────────── */

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

    /* ── Cleanup ────────────────────────────────────────── */

    protected removeAllOverlays(): void {
        removeAll();
        this.thawFeed();
    }
}
```

**Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/content/adapters/tiktok-adapter.ts
git commit -m "feat: add TikTok adapter with watch-time tracking"
```

---

## Task 6: Override BaseAdapter Tick for TikTok

**Files:**
- Modify: `src/content/adapters/tiktok-adapter.ts`

**Step 1: Add tick override to TikTokAdapter**

Add this method to the TikTokAdapter class (before the cleanup section):

```typescript
    /* ── Override tick for TikTok-specific scoring ──────── */

    private async tick() {
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
```

**Step 2: Add required imports to tiktok-adapter.ts**

Add these imports at the top:

```typescript
import { DEFAULT_PACK_STATE, DEFAULT_THRESHOLDS, TOUCH_GRASS_TIPS, VIBE_OPTIONS } from "@/core/constants";
import { computeTikTokCookedScore, deriveCookedStatus, getCookedLabel, isMaxCooked, shouldIntervene } from "@/core/cooked-meter";
import { sendMessage } from "@/core/messaging";
import { getPackProgress, incrementPack, isPackComplete } from "@/core/snack-packs";
```

**Step 3: Add required private properties**

Add these to the class properties:

```typescript
    private lastSignalAt = 0;
    private maxCookedShown = false;
```

**Step 4: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 5: Commit**

```bash
git add src/content/adapters/tiktok-adapter.ts
git commit -m "feat: add TikTok-specific tick with watch-time scoring"
```

---

## Task 7: Create Instagram Reels Adapter

**Files:**
- Create: `src/content/adapters/instagram-reels-adapter.ts`

**Step 1: Create the adapter file**

```typescript
import { DEFAULT_PACK_STATE, DEFAULT_TOUCH_GRASS, TOUCH_GRASS_TIPS, VIBE_OPTIONS } from "@/core/constants";
import { computeReelsCookedScore, deriveCookedStatus, getCookedLabel, isMaxCooked, shouldIntervene } from "@/core/cooked-meter";
import { sendMessage } from "@/core/messaging";
import { getPackProgress, incrementPack, isPackComplete } from "@/core/snack-packs";
import type { CookedStatus, VibeIntent } from "@/core/types";
import { removeAllOverlays as removeAll, removeOverlay, showOverlay } from "../overlays/overlay-manager";
import { BaseAdapter } from "./base-adapter";

/**
 * Instagram Reels adapter
 * Uses swipe-based scoring (same as YouTube Shorts)
 */
export class InstagramReelsAdapter extends BaseAdapter {
    readonly site = "instagram-reels" as const;
    private itemsSinceLastTick = 0;
    private lastReelId = "";
    private urlObserver: MutationObserver | null = null;
    private lastSignalAt = 0;
    private maxCookedShown = false;

    /* ── Video helpers ───────────────────────────────────── */

    private getReelsVideo(): HTMLVideoElement | null {
        return (
            document.querySelector<HTMLVideoElement>("div[role='presentation'] video") ??
            document.querySelector<HTMLVideoElement>("._ac8m video") ??
            document.querySelector<HTMLVideoElement>("video")
        );
    }

    private freezeFeed() {
        const v = this.getReelsVideo();
        if (v && !v.paused) v.pause();
    }

    private thawFeed() {
        const v = this.getReelsVideo();
        if (v && v.paused) v.play().catch(() => { });
    }

    /* ── Observers ──────────────────────────────────────── */

    protected setupObservers(): void {
        // Track scroll/swipe events
        window.addEventListener("wheel", this.onWheel, { passive: true });

        // Touch events for mobile
        let touchStartY = 0;
        window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0]?.clientY ?? 0; }, { passive: true });
        window.addEventListener("touchend", (e) => {
            const delta = touchStartY - (e.changedTouches[0]?.clientY ?? 0);
            if (Math.abs(delta) > 50) {
                this.swipeCount++;
                this.itemsSinceLastTick++;
            }
        }, { passive: true });

        // Watch for reel changes via URL polling
        this.watchReelChanges();

        // Listen for messages
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

    private watchReelChanges() {
        // Poll for URL changes (Instagram is SPA)
        const poll = () => {
            const match = window.location.pathname.match(/\/reel\/([^/?]+)/);
            const currentId = match?.[1] ?? "";
            if (currentId && currentId !== this.lastReelId) {
                this.lastReelId = currentId;
                this.itemsSinceLastTick++;
                this.swipeCount++;
            }
        };
        setInterval(poll, 500);

        // Also watch DOM for feed container changes
        const observer = new MutationObserver(() => poll());
        const tryObserve = () => {
            const container =
                document.querySelector("div[role='presentation']") ??
                document.querySelector("main") ??
                document.body;
            observer.observe(container, { childList: true, subtree: true });
        };

        if (document.readyState === "complete") {
            tryObserve();
        } else {
            window.addEventListener("load", tryObserve);
        }

        this.urlObserver = observer;
    }

    /* ── Item tracking ──────────────────────────────────── */

    protected getNewItemsSinceLastTick(): number {
        const count = this.itemsSinceLastTick;
        this.itemsSinceLastTick = 0;
        return count;
    }

    /* ── Override tick for Reels-specific scoring ───────── */

    private async tick() {
        if (!this.enabled) return;

        const now = Date.now();
        const newItems = this.getNewItemsSinceLastTick();
        this.session.itemsConsumed += newItems;
        this.session.scrollEvents += this.scrollCount;

        const hasNewSignals = this.scrollCount > 0 || newItems > 0 || this.swipeCount > 0;
        if (hasNewSignals) this.lastSignalAt = now;
        const idleMs = this.lastSignalAt === 0 ? 0 : now - this.lastSignalAt;

        if (this.builtDifferentDismissed && hasNewSignals) {
            this.builtDifferentDismissed = false;
            this.scrollCount = 0;
            this.swipeCount = 0;
            this.onBuiltDifferentDenied();
            return;
        }

        let newScore: number;
        if (this.session.packState.active) {
            newScore = this.session.cookedScore;
        } else {
            newScore = computeReelsCookedScore(
                this.session.cookedScore,
                this.swipeCount,
                this.session.vibeIntent,
                idleMs
            );
        }

        this.scrollCount = 0;
        this.swipeCount = 0;

        this.session.cookedScore = newScore;
        this.session.cookedStatus = deriveCookedStatus(newScore, this.settings.cooked.thresholds);

        if (this.session.packState.active) {
            this.session.packState = incrementPack(this.session.packState, newItems);
            if (isPackComplete(this.session.packState, now)) {
                this.onPackComplete();
            }
        }

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

    /* ── Cooked widget ──────────────────────────────────── */

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
            packHtml = `
                <div style="width:100%;margin-top:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">[#] Pack: ${progress.current}/${progress.total}</div>
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

    /* ── Overlays (same pattern as other adapters) ──────── */

    protected showInterventionOverlay(): void {
        const label = getCookedLabel(this.session.cookedStatus);
        const wrapper = showOverlay("intervention", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>${label.emoji} ${label.label}!</h2>
                    <p>Your score hit ${this.session.cookedScore}. Make a choice:</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going</button>
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
            this.startTouchGrass(5);
        });
    }

    protected showBuiltDifferentDeniedOverlay(): void {
        this.freezeFeed();
        const wrapper = showOverlay("denied", `
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2>
                    <p style="text-align:center;">Pick one.</p>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
                    </div>
                </div>
            </div>
        `);

        wrapper.querySelector("[data-action='grass']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.thawFeed();
            this.startTouchGrass(5);
        });
        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.thawFeed();
            this.startPack("items", 10);
        });
    }

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
                    <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
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
            this.startTouchGrass(5);
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

    protected showTouchGrassOverlay(): void {
        const endTime = this.session.touchGrass.endsAt;
        const tips = TOUCH_GRASS_TIPS.sort(() => Math.random() - 0.5).slice(0, 3);
        this.freezeFeed();

        const wrapper = showOverlay("touchgrass", `
            <div class="brd-fullscreen brd-zen-bg">
                <div class="brd-zen-slide-wrap">
                    <img class="brd-zen-img" src="https://cataas.com/cat?width=900&height=700" alt="zen" />
                    <div class="brd-zen-caption">breathe.</div>
                </div>
                <div class="brd-zen-card">
                    <div class="brd-zen-header">[*] Touch Grass Mode</div>
                    <div class="brd-timer" id="brd-tg-timer">00:00</div>
                    <div class="brd-tips">
                        ${tips.map((t) => `<div class="brd-tip">${t}</div>`).join("")}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass</button>
                    </div>
                </div>
            </div>
        `);

        const timerEl = wrapper.querySelector("#brd-tg-timer");
        const timerInterval = setInterval(() => {
            const remaining = Math.max(0, endTime - Date.now());
            const min = Math.floor(remaining / 60_000);
            const sec = Math.floor((remaining % 60_000) / 1_000);
            if (timerEl) timerEl.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
            if (remaining <= 0) {
                clearInterval(timerInterval);
                this.endTouchGrass();
                this.thawFeed();
                removeOverlay("touchgrass");
            }
        }, 1000);

        wrapper.querySelector("[data-action='bypass']")?.addEventListener("click", () => {
            clearInterval(timerInterval);
            this.bypassTouchGrass();
            this.thawFeed();
            removeOverlay("touchgrass");
        });
    }

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
                    <div class="brd-vibe-grid">${vibes}</div>
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

    protected removeAllOverlays(): void {
        removeAll();
        this.thawFeed();
    }
}
```

**Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/content/adapters/instagram-reels-adapter.ts
git commit -m "feat: add Instagram Reels adapter with swipe-based scoring"
```

---

## Task 8: Create TikTok Inject Script

**Files:**
- Create: `src/content/inject-tiktok.ts`

**Step 1: Create the inject script**

```typescript
import { TikTokAdapter } from "./adapters/tiktok-adapter";

console.log("[brainrot detox] TikTok content script loaded");

const adapter = new TikTokAdapter();
adapter.init();

// Handle SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        // Check if we're still on a TikTok feed page
        if (location.pathname.includes("/foryou") || location.pathname.includes("/following") || location.pathname === "/") {
            adapter.destroy();
            adapter.init();
        }
    }
}).observe(document.body, { subtree: true, childList: true });
```

**Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/content/inject-tiktok.ts
git commit -m "feat: add TikTok content script injector"
```

---

## Task 9: Create Instagram Reels Inject Script

**Files:**
- Create: `src/content/inject-instagram.ts`

**Step 1: Create the inject script**

```typescript
import { InstagramReelsAdapter } from "./adapters/instagram-reels-adapter";

console.log("[brainrot detox] Instagram Reels content script loaded");

const adapter = new InstagramReelsAdapter();
adapter.init();

// Handle SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        // Re-init when navigating to/from reels
        if (location.pathname.includes("/reels") || location.pathname.includes("/reel")) {
            adapter.destroy();
            adapter.init();
        }
    }
}).observe(document.body, { subtree: true, childList: true });
```

**Step 2: Verify typecheck passes**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/content/inject-instagram.ts
git commit -m "feat: add Instagram Reels content script injector"
```

---

## Task 10: Update Build Script

**Files:**
- Modify: `scripts/build-content-scripts.mjs`

**Step 1: Add new entries to the build script**

Update the `entries` array:

```javascript
const entries = [
    { name: "inject-shorts", globalName: "injectShorts", entry: resolve(root, "src/content/inject-shorts.ts") },
    { name: "inject-youtube", globalName: "injectYoutube", entry: resolve(root, "src/content/inject-youtube.ts") },
    { name: "inject-reddit", globalName: "injectReddit", entry: resolve(root, "src/content/inject-reddit.ts") },
    { name: "inject-instagram", globalName: "injectInstagram", entry: resolve(root, "src/content/inject-instagram.ts") },
    { name: "inject-tiktok", globalName: "injectTiktok", entry: resolve(root, "src/content/inject-tiktok.ts") },
];
```

**Step 2: Verify build works**

Run: `npm run build`
Expected: Build completes successfully with all 5 inject scripts

**Step 3: Commit**

```bash
git add scripts/build-content-scripts.mjs
git commit -m "feat: add Instagram and TikTok to content script build"
```

---

## Task 11: Update Manifest

**Files:**
- Modify: `public/manifest.json`

**Step 1: Add host permissions**

Add to `host_permissions` array:

```json
"host_permissions": [
    "https://www.youtube.com/*",
    "https://www.reddit.com/*",
    "https://*.instagram.com/*",
    "https://*.tiktok.com/*"
],
```

**Step 2: Add content scripts**

Add to `content_scripts` array:

```json
{
    "matches": [
        "https://*.instagram.com/reels/*",
        "https://*.instagram.com/reel/*"
    ],
    "js": [
        "inject-instagram.js"
    ],
    "run_at": "document_idle"
},
{
    "matches": [
        "https://*.tiktok.com/*"
    ],
    "exclude_matches": [
        "https://*.tiktok.com/@*"
    ],
    "js": [
        "inject-tiktok.js"
    ],
    "run_at": "document_idle"
}
```

**Step 3: Add web_accessible_resources**

Update `web_accessible_resources` to include new platforms:

```json
"web_accessible_resources": [
    {
        "resources": ["assets/*"],
        "matches": [
            "https://www.youtube.com/*",
            "https://www.reddit.com/*",
            "https://*.instagram.com/*",
            "https://*.tiktok.com/*"
        ]
    }
]
```

**Step 4: Update version**

Change version from `1.0.0` to `1.1.0`:

```json
"version": "1.1.0",
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add public/manifest.json
git commit -m "feat: add Instagram and TikTok to manifest, bump to v1.1.0"
```

---

## Task 12: Final Build and Verification

**Step 1: Run full build**

Run: `npm run build`
Expected: All files build successfully, `dist/` contains all inject scripts

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Verify dist contents**

Run: `ls dist/`
Expected: Contains `inject-instagram.js` and `inject-tiktok.js`

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Instagram Reels and TikTok support (v1.1.0)"
```

---

## Manual Testing Checklist

After implementing, test manually:

- [ ] Load extension in Chrome (unpacked from `dist/`)
- [ ] Navigate to Instagram Reels — verify cooked widget appears
- [ ] Swipe through 5+ reels — verify score increments correctly
- [ ] Navigate away and back — verify SPA re-init works
- [ ] Navigate to TikTok — verify cooked widget appears
- [ ] Watch videos for 30+ seconds — verify watch-time accumulates
- [ ] Swipe through videos — verify swipe + watch-time both contribute
- [ ] Verify overlays (intervention, touch grass, vibe check) appear correctly
- [ ] Check stats are recorded to dashboard
