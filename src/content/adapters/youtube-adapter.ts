import { TOUCH_GRASS_TIPS } from "@/core/constants";
import { getCookedLabel } from "@/core/cooked-meter";
import { removeAllOverlays as removeAll, removeOverlay, showOverlay } from "../overlays/overlay-manager";
import { BaseAdapter } from "./base-adapter";

export class YouTubeAdapter extends BaseAdapter {
    readonly site = "youtube" as const;

    private itemsSinceLastTick = 0;
    private lastSeenItems = 0;

    private readonly handleRuntimeMessage = (msg: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
        if (msg.type === "END_TOUCH_GRASS") {
            this.session.touchGrass = { active: false, endsAt: 0, bypassCount: 0 };
            removeOverlay("skyrim");
            removeOverlay("touchgrass");
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

    protected setupObservers(): void {
        this.registerEventListener(window, "scroll", () => {
            this.scrollCount++;
            this.recordActivity();
        }, { passive: true });

        const observeFeed = () => {
            const feed = document.querySelector("ytd-browse, ytd-search, ytd-watch-flexy, #content") || document.body;
            this.lastSeenItems = document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer").length;
            this.registerMutationObserver(feed, { childList: true, subtree: true }, () => {
                const items = document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer");
                if (items.length > this.lastSeenItems) {
                    this.itemsSinceLastTick += items.length - this.lastSeenItems;
                    this.lastSeenItems = items.length;
                }
            });
        };

        if (document.readyState === "complete") {
            observeFeed();
        } else {
            this.registerEventListener(window, "load", observeFeed, { once: true });
        }

        this.registerEventListener(window, "yt-navigate-finish", () => {
            this.lastSeenItems = document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer").length;
        });

        this.registerRuntimeMessageListener(this.handleRuntimeMessage);
    }

    protected getNewItemsSinceLastTick(): number {
        const count = this.itemsSinceLastTick;
        this.itemsSinceLastTick = 0;
        return count;
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
                    <p>Your scrolling score hit ${Math.round(this.session.cookedScore)}. Time to make a choice:</p>
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

    protected showSkyrimOverlay(message: string): void {
        const videoUrl = chrome.runtime.getURL("assets/skyrim-skeleton.mp4");
        const wrapper = showOverlay("skyrim", `
            <div class="brd-fullscreen">
                <div class="brd-video-wrap">
                    <video autoplay muted playsinline>
                        <source src="${videoUrl}" type="video/mp4" />
                    </video>
                </div>
                <div class="brd-message">${message}</div>
                <div class="brd-btn-row">
                    <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
                </div>
            </div>
        `);

        wrapper.querySelector("video")?.play().catch(() => undefined);
        wrapper.querySelector("[data-action='grass']")?.addEventListener("click", () => {
            removeOverlay("skyrim");
            this.startTouchGrass(this.settings.touchGrass.defaultMinutes);
        });
        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("skyrim");
            this.startPack("items", 10);
        });
        wrapper.querySelector("[data-action='dismiss']")?.addEventListener("click", () => {
            removeOverlay("skyrim");
            this.armBuiltDifferentFollowUp();
        });
    }

    protected showTouchGrassOverlay(): void {
        const endTime = this.session.touchGrass.endsAt;
        const tips = TOUCH_GRASS_TIPS.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        const videoUrl = chrome.runtime.getURL("assets/skyrim-skeleton.mp4");
        const wrapper = showOverlay("touchgrass", `
            <div class="brd-fullscreen">
                <div class="brd-video-wrap">
                    <video autoplay loop muted playsinline>
                        <source src="${videoUrl}" type="video/mp4" />
                    </video>
                </div>
                <div class="brd-card">
                    <h2>Touch Grass Mode</h2>
                    <p>Feed locked. Time to go outside.</p>
                    <div class="brd-timer" id="brd-tg-timer">00:00</div>
                    <div class="brd-tips">${tips.map((tip) => `<div class="brd-tip">${tip}</div>`).join("")}</div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass</button>
                    </div>
                </div>
            </div>
        `);

        const timerEl = wrapper.querySelector("#brd-tg-timer") as HTMLElement | null;
        const interval = window.setInterval(() => {
            const remaining = Math.max(0, endTime - Date.now());
            const minutes = Math.floor(remaining / 60_000);
            const seconds = Math.floor((remaining % 60_000) / 1_000);
            if (timerEl) {
                timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            }
            if (remaining <= 0) {
                clearInterval(interval);
                this.endTouchGrass();
                removeOverlay("touchgrass");
            }
        }, 1000);

        this.addCleanup(() => clearInterval(interval));
        wrapper.querySelector("[data-action='bypass']")?.addEventListener("click", () => {
            clearInterval(interval);
            this.bypassTouchGrass();
            removeOverlay("touchgrass");
        });
        wrapper.querySelector("video")?.play().catch(() => undefined);
    }

    protected showBuiltDifferentDeniedOverlay(): void {
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
            this.startTouchGrass(this.settings.touchGrass.defaultMinutes);
        });
        wrapper.querySelector("[data-action='pack']")?.addEventListener("click", () => {
            removeOverlay("denied");
            this.startPack("items", 10);
        });
        wrapper.querySelector("[data-action='sidequest']")?.addEventListener("click", () => {
            removeOverlay("denied");
            void this.openSideQuest("manual", { returnToForcedChoice: true });
        });
    }

    protected removeAllOverlays(): void {
        removeAll();
    }
}
