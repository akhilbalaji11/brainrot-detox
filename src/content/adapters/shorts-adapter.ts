import { TOUCH_GRASS_TIPS, VIBE_OPTIONS } from "@/core/constants";
import { getCookedLabel } from "@/core/cooked-meter";
import { getPackProgress } from "@/core/snack-packs";
import type { CookedStatus, VibeIntent } from "@/core/types";
import { removeAllOverlays as removeAll, removeOverlay, showOverlay } from "../overlays/overlay-manager";
import { BaseAdapter } from "./base-adapter";

/**
 * YouTube Shorts adapter
 * Monitors swipe-based navigation by watching URL changes and
 * DOM mutations in the Shorts player container.
 */
export class ShortsAdapter extends BaseAdapter {
  readonly site = "shorts" as const;
  private itemsSinceLastTick = 0;
  private lastVideoId = "";
  private urlObserver: MutationObserver | null = null;

  /* ── Helpers: pause/resume the Shorts player ────────── */

  private getShortsVideo(): HTMLVideoElement | null {
    // YouTube Shorts player video element (outside our shadow DOM)
    return (
      document.querySelector<HTMLVideoElement>("ytd-shorts video") ??
      document.querySelector<HTMLVideoElement>(".html5-main-video") ??
      document.querySelector<HTMLVideoElement>("video.video-stream") ??
      null
    );
  }

  private freezeFeed() {
    const v = this.getShortsVideo();
    if (v && !v.paused) v.pause();
  }

  private thawFeed() {
    const v = this.getShortsVideo();
    if (v && v.paused) v.play().catch(() => { });
  }

  /* ── Observers ──────────────────────────────────────── */

  protected setupObservers(): void {
    // Track scroll/swipe events
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("wheel", this.onWheel, { passive: true });

    // Keyboard navigation (down arrow = next short)
    window.addEventListener("keydown", this.onKeyDown, { passive: true });

    // Watch URL changes (Shorts navigation is via popstate / replaceState)
    this.watchUrlChanges();

    // Watch for new shorts containers appearing
    this.watchShortsContainer();

    // Touch events for swipe detection on mobile
    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0]?.clientY ?? 0; }, { passive: true });
    window.addEventListener("touchend", (e) => {
      const delta = touchStartY - (e.changedTouches[0]?.clientY ?? 0);
      if (Math.abs(delta) > 50) {
        this.swipeCount++;
        this.itemsSinceLastTick++;
      }
    }, { passive: true });

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

  private onScroll = () => { this.scrollCount++; };
  private onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) > 20) {
      this.swipeCount++;
    }
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "j") {
      this.swipeCount++;
      this.itemsSinceLastTick++;
    }
  };

  private watchUrlChanges() {
    // Poll for URL changes (YouTube doesn't always fire popstate for Shorts)
    setInterval(() => {
      const match = window.location.pathname.match(/\/shorts\/([^/?]+)/);
      const currentId = match?.[1] ?? "";
      if (currentId && currentId !== this.lastVideoId) {
        this.lastVideoId = currentId;
        this.itemsSinceLastTick++;
        this.swipeCount++;
      }
    }, 500);
  }

  private watchShortsContainer() {
    // Watch for shorts player appearing via MutationObserver
    const observer = new MutationObserver(() => {
      const match = window.location.pathname.match(/\/shorts\/([^/?]+)/);
      const currentId = match?.[1] ?? "";
      if (currentId && currentId !== this.lastVideoId) {
        this.lastVideoId = currentId;
        this.itemsSinceLastTick++;
      }
    });

    const tryObserve = () => {
      const container = document.querySelector("ytd-shorts") || document.querySelector("#shorts-container") || document.body;
      observer.observe(container, { childList: true, subtree: true });
    };

    // Try immediately, retry if not found
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

    // Make widget clickable to trigger vibe check
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
      this.startTouchGrass(this.settings.touchGrass.defaultMinutes);
    });
  }

  /* ── "No you are not" overlay ───────────────────────── */

  protected showBuiltDifferentDeniedOverlay(): void {
    // Freeze the feed — you're not scrolling away from this
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

  /* ── Skyrim overlay (max cooked, pack complete) ─────── */

  protected showSkyrimOverlay(message: string): void {
    const videoUrl = chrome.runtime.getURL("assets/skyrim-skeleton.mp4");

    // Freeze the Shorts feed while overlay is up
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

    // Set src directly and call load() – more reliable than <source> child in Shadow DOM
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
      // Set the flag — next scroll will trigger "No you are not"
      this.builtDifferentDismissed = true;
    });
  }

  /* ── Touch Grass overlay — Zen Mode ─────────────────── */

  protected showTouchGrassOverlay(): void {
    const endTime = this.session.touchGrass.endsAt;
    const tips = TOUCH_GRASS_TIPS.sort(() => Math.random() - 0.5).slice(0, 3);

    // Freeze the Shorts feed
    this.freezeFeed();

    // Cats-only slideshow + occasional webcam
    // cataas.com — free cat image API, no auth needed
    const ZEN_IMAGES = [
      "https://cataas.com/cat?width=900&height=700&t=1",
      "https://cataas.com/cat?width=900&height=700&t=2",
      "https://cataas.com/cat?width=900&height=700&t=3",
      "https://cataas.com/cat?width=900&height=700&t=4",
      "https://cataas.com/cat?width=900&height=700&t=5",
      "https://cataas.com/cat?width=900&height=700&t=6",
      "https://cataas.com/cat?width=900&height=700&t=7",
      "https://cataas.com/cat?width=900&height=700&t=8",
      "https://cataas.com/cat?width=900&height=700&t=9",
      "https://cataas.com/cat?width=900&height=700&t=10",
      "WEBCAM", // show the user their own face
      "https://cataas.com/cat?width=900&height=700&t=11",
      "https://cataas.com/cat?width=900&height=700&t=12",
      "https://cataas.com/cat?width=900&height=700&t=13",
      "https://cataas.com/cat?width=900&height=700&t=14",
      "https://cataas.com/cat?width=900&height=700&t=15",
      "WEBCAM",
    ];

    // Shuffle and ensure webcam isn't always first
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
      "you look great btw.", "hi.", "go outside.", "drink water.",
    ];

    const showSlide = async (idx: number) => {
      const src = shuffled[idx % shuffled.length];

      if (src === "WEBCAM") {
        // Show webcam
        imgEl.style.display = "none";
        webcamEl.style.display = "block";
        captionEl.textContent = "hi. this is you. say hi.";
        if (!webcamStream) {
          try {
            webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            webcamEl.srcObject = webcamStream;
          } catch {
            // Webcam denied — skip to next
            showSlide(idx + 1);
            return;
          }
        }
      } else {
        // Show image
        webcamEl.style.display = "none";
        imgEl.style.display = "block";
        imgEl.src = src;
        captionEl.textContent = ZEN_CAPTIONS[Math.floor(Math.random() * ZEN_CAPTIONS.length)];
      }
    };

    // Start slideshow
    showSlide(slideIndex);
    const slideInterval = setInterval(() => {
      slideIndex++;
      showSlide(slideIndex);
    }, 4000);

    // Ambient audio via Web Audio API — soft sine wave drone
    let audioCtx: AudioContext | null = null;
    let gainNode: GainNode | null = null;
    try {
      audioCtx = new AudioContext();
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 2); // fade in gently
      gainNode.connect(audioCtx.destination);

      // Layer two detuned oscillators for a richer ambient tone
      const freqs = [110, 165, 220]; // A2, E3, A3 — open fifth chord
      freqs.forEach((freq, i) => {
        const osc = audioCtx!.createOscillator();
        const oscGain = audioCtx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx!.currentTime);
        oscGain.gain.setValueAtTime(1 / freqs.length, audioCtx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(gainNode!);
        osc.start();

        // Slow tremolo on each oscillator for a breathing effect
        const lfo = audioCtx!.createOscillator();
        const lfoGain = audioCtx!.createGain();
        lfo.frequency.setValueAtTime(0.15 + i * 0.05, audioCtx!.currentTime);
        lfoGain.gain.setValueAtTime(0.015, audioCtx!.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);
        lfo.start();
      });
    } catch {
      // Audio context not available — silent mode
    }

    // Countdown timer
    const timerEl = wrapper.querySelector("#brd-tg-timer");
    const timerInterval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      const min = Math.floor(remaining / 60_000);
      const sec = Math.floor((remaining % 60_000) / 1_000);
      if (timerEl) timerEl.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
      if (remaining <= 0) {
        clearInterval(timerInterval);
        clearInterval(slideInterval);
        this.stopZenAudio(audioCtx, gainNode);
        this.stopWebcam(webcamStream);
        this.endTouchGrass();
        this.thawFeed();
        removeOverlay("touchgrass");
      }
    }, 1000);

    wrapper.querySelector("[data-action='bypass']")?.addEventListener("click", () => {
      clearInterval(timerInterval);
      clearInterval(slideInterval);
      this.stopZenAudio(audioCtx, gainNode);
      this.stopWebcam(webcamStream);
      this.bypassTouchGrass();
      this.thawFeed();
      removeOverlay("touchgrass");
    });
  }

  private stopZenAudio(ctx: AudioContext | null, gain: GainNode | null) {
    if (!ctx || !gain) return;
    try {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => ctx.close(), 600);
    } catch { /* ignore */ }
  }

  private stopWebcam(stream: MediaStream | null) {
    if (!stream) return;
    stream.getTracks().forEach((t) => t.stop());
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
          <p>What are you here for? This adjusts how strict the cooked meter is.</p>
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
