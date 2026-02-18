import { RedditAdapter } from "./adapters/reddit-adapter";

console.log("[brainrot detox] Reddit content script loaded");

const adapter = new RedditAdapter();
adapter.init();
