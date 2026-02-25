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
