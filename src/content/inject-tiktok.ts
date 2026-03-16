import { TikTokAdapter } from "./adapters/tiktok-adapter";

console.log("[brainrot detox] TikTok content script loaded");

let adapter: TikTokAdapter | null = null;
let lastUrl = location.href;

function isSupportedRoute() {
    return location.pathname === "/" ||
        location.pathname.startsWith("/foryou") ||
        location.pathname.startsWith("/following") ||
        location.pathname.includes("/video/");
}

function syncAdapter() {
    if (isSupportedRoute()) {
        if (!adapter) {
            adapter = new TikTokAdapter();
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
