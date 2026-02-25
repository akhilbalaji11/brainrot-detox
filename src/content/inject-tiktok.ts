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
