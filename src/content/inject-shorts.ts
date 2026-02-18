import { ShortsAdapter } from "./adapters/shorts-adapter";

console.log("[brainrot detox] Shorts content script loaded");

const adapter = new ShortsAdapter();
adapter.init();
