import { YouTubeAdapter } from "./adapters/youtube-adapter";

console.log("[brainrot detox] YouTube content script loaded");

// Don't run on shorts pages — there's a separate adapter for that
if (!window.location.pathname.startsWith("/shorts")) {
    const adapter = new YouTubeAdapter();
    adapter.init();
}
