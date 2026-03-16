import { InstagramReelsAdapter } from "./adapters/instagram-reels-adapter";

console.log("[brainrot detox] Instagram Reels content script loaded");

let adapter: InstagramReelsAdapter | null = null;
let lastUrl = location.href;

function isSupportedRoute() {
    return /^\/(reel|reels)\//.test(location.pathname) || location.pathname.startsWith("/explore/reels");
}

function syncAdapter() {
    if (isSupportedRoute()) {
        if (!adapter) {
            adapter = new InstagramReelsAdapter();
            void adapter.init();
        }
        return;
    }

    if (adapter) {
        adapter.destroy();
        adapter = null;
    }
}

syncAdapter();

new MutationObserver(() => {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    syncAdapter();
}).observe(document.body, { subtree: true, childList: true });
