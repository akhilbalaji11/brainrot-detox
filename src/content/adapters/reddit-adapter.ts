import { TOUCH_GRASS_TIPS, VIBE_OPTIONS } from "@/core/constants";
import { getCookedLabel } from "@/core/cooked-meter";
import { getPackProgress } from "@/core/snack-packs";
import type { CookedStatus, VibeIntent } from "@/core/types";
import { removeAllOverlays as removeAll, removeOverlay, showOverlay } from "../overlays/overlay-manager";
import { BaseAdapter } from "./base-adapter";

/**
 * Reddit adapter - monitors feed scroll and post loading.
 */
export class RedditAdapter extends BaseAdapter {
    readonly site = "reddit" as const;
    private itemsSinceLastTick = 0;
    private lastSeenItems = 0;

    protected setupObservers(): void {
        window.addEventListener("scroll", () => { this.scrollCount++; }, { passive: true });

        const observer = new MutationObserver(() => {
            const items = document.querySelectorAll("shreddit-post, [data-testid='post-container'], .Post, article");
            if (items.length > this.lastSeenItems) {
                this.itemsSinceLastTick += items.length - this.lastSeenItems;
                this.lastSeenItems = items.length;
            }
        });

        const tryObserve = () => {
            const feed = document.querySelector("#main-content, [data-testid='posts-list'], .ListingLayout-outerContainer") || document.body;
            observer.observe(feed, { childList: true, subtree: true });
        };
        if (document.readyState === "complete") tryObserve();
        else window.addEventListener("load", tryObserve);

        chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
            if (msg.type === "END_TOUCH_GRASS") { this.session.touchGrass = { active: false, endsAt: 0, bypassCount: 0 }; removeOverlay("skyrim"); removeOverlay("touchgrass"); sendResponse({ success: true }); return false; }
            if (msg.type === "TRIGGER_TOUCH_GRASS") { this.startTouchGrass(msg.payload?.minutes ?? 5); sendResponse({ success: true }); return false; }
            if (msg.type === "TRIGGER_PACK") { this.startPack(msg.payload?.mode ?? "items", msg.payload?.limit ?? 10); sendResponse({ success: true }); return false; }
            if (msg.type === "TRIGGER_VIBE_CHECK") { this.showVibeCheckOverlay(); sendResponse({ success: true }); return false; }
            return false;
        });
    }

    protected getNewItemsSinceLastTick(): number { const c = this.itemsSinceLastTick; this.itemsSinceLastTick = 0; return c; }
    protected mountCookedWidget(): void { this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus); }

    protected updateCookedWidget(score: number, status: string): void {
        const label = getCookedLabel(status as CookedStatus);
        const sc = status === "Based" ? "brd-score-based" : status === "Medium Cooked" ? "brd-score-medium" : "brd-score-cooked";
        let packHtml = "";
        if (this.session.packState.active) {
            const p = getPackProgress(this.session.packState);
            const packLabel = this.session.packState.mode === "time" && p.timeRemaining
                ? `[#] Pack: ${p.timeRemaining}`
                : `[#] Pack: ${p.current}/${p.total}`;
            packHtml = `<div style="width:100%;margin-top:6px;"><div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">${packLabel}</div><div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${p.percent}%"></div></div></div>`;
        }
        const w = showOverlay("widget", `<div class="brd-widget"><span class="brd-widget-emoji">${label.emoji}</span><span class="brd-widget-label">${label.label}</span><span class="brd-widget-score ${sc}">${score}</span>${packHtml}</div>`);
        const el = w.querySelector(".brd-widget") as HTMLElement;
        if (el) { el.style.cursor = "pointer"; el.onclick = () => this.showVibeCheckOverlay(); }
    }

    protected showInterventionOverlay(): void {
        const label = getCookedLabel(this.session.cookedStatus);
        const w = showOverlay("intervention", `<div class="brd-fullscreen"><div class="brd-card"><h2>${label.emoji} ${label.label}!</h2><p>Score: ${this.session.cookedScore}. Brain is getting crispy.</p><div class="brd-btn-row"><button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going 🤷</button><button class="brd-btn brd-btn-primary" data-action="pack">Start Pack 🍱</button><button class="brd-btn brd-btn-success" data-action="grass">Touch Grass 🌿</button></div></div></div>`);
        w.querySelector("[data-action='dismiss']")?.addEventListener("click", () => removeOverlay("intervention"));
        w.querySelector("[data-action='pack']")?.addEventListener("click", () => { removeOverlay("intervention"); this.startPack("items", 10); });
        w.querySelector("[data-action='grass']")?.addEventListener("click", () => { removeOverlay("intervention"); this.startTouchGrass(this.settings.touchGrass.defaultMinutes); });
    }

    protected showSkyrimOverlay(message: string): void {
        const videoUrl = chrome.runtime.getURL("assets/skyrim-skeleton.mp4");
        const w = showOverlay("skyrim", `<div class="brd-fullscreen"><div class="brd-video-wrap"><video playsinline></video></div><div class="brd-message">${message}</div><div class="brd-btn-row"><button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button><button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button><button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different [+]</button></div></div>`);
        const video = w.querySelector("video");
        if (video) { video.src = videoUrl; video.load(); video.play().catch(() => { }); }
        w.querySelector("[data-action='grass']")?.addEventListener("click", () => { removeOverlay("skyrim"); this.startTouchGrass(this.settings.touchGrass.defaultMinutes); });
        w.querySelector("[data-action='pack']")?.addEventListener("click", () => { removeOverlay("skyrim"); this.startPack("items", 10); });
        w.querySelector("[data-action='dismiss']")?.addEventListener("click", () => { removeOverlay("skyrim"); this.builtDifferentDismissed = true; });
    }

    protected showTouchGrassOverlay(): void {
        const endTime = this.session.touchGrass.endsAt;
        const tips = TOUCH_GRASS_TIPS.sort(() => Math.random() - 0.5).slice(0, 3);
        const videoUrl = chrome.runtime.getURL("assets/skyrim-skeleton.mp4");
        const w = showOverlay("touchgrass", `<div class="brd-fullscreen"><div class="brd-video-wrap"><video loop playsinline></video></div><div class="brd-card"><h2>[*] Touch Grass Mode</h2><p>Feed locked.</p><div class="brd-timer" id="brd-tg-timer">00:00</div><div class="brd-tips">${tips.map(t => `<div class="brd-tip">${t}</div>`).join("")}</div><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button></div></div></div>`);
        const video = w.querySelector("video");
        if (video) { video.src = videoUrl; video.load(); video.play().catch(() => { }); }
        const timerEl = w.querySelector("#brd-tg-timer");
        const interval = setInterval(() => { const rem = Math.max(0, endTime - Date.now()); const m = Math.floor(rem / 60000); const s = Math.floor((rem % 60000) / 1000); if (timerEl) timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; if (rem <= 0) { clearInterval(interval); this.endTouchGrass(); removeOverlay("touchgrass"); } }, 1000);
        w.querySelector("[data-action='bypass']")?.addEventListener("click", () => { clearInterval(interval); this.bypassTouchGrass(); removeOverlay("touchgrass"); });
    }

    protected showVibeCheckOverlay(): void {
        const vibes = VIBE_OPTIONS.map(v => `<div class="brd-vibe-card" data-vibe="${v.id}"><span class="brd-vibe-emoji">${v.emoji}</span><span class="brd-vibe-label">${v.label}</span></div>`).join("");
        const w = showOverlay("vibecheck", `<div class="brd-fullscreen"><div class="brd-card"><h2>✨ Vibe Check</h2><p>What are you here for?</p><div class="brd-vibe-grid">${vibes}</div><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button></div></div></div>`);
        w.querySelectorAll("[data-vibe]").forEach(el => el.addEventListener("click", () => { this.setVibeIntent((el as HTMLElement).dataset.vibe as VibeIntent); removeOverlay("vibecheck"); }));
        w.querySelector("[data-action='skip']")?.addEventListener("click", () => removeOverlay("vibecheck"));
    }

    protected showBuiltDifferentDeniedOverlay(): void {
        const w = showOverlay("denied", `<div class="brd-fullscreen"><div class="brd-card"><h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2><p style="text-align:center;">Pick one.</p><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button><button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button><button class="brd-btn brd-btn-ghost" data-action="vibe">[?] Vibe Check</button></div></div></div>`);
        w.querySelector("[data-action='grass']")?.addEventListener("click", () => { removeOverlay("denied"); this.startTouchGrass(this.settings.touchGrass.defaultMinutes); });
        w.querySelector("[data-action='pack']")?.addEventListener("click", () => { removeOverlay("denied"); this.startPack("items", 10); });
        w.querySelector("[data-action='vibe']")?.addEventListener("click", () => { removeOverlay("denied"); this.showVibeCheckOverlay(); });
    }

    protected removeAllOverlays(): void { removeAll(); }
}
