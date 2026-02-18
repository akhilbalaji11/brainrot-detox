import type { ExtMessage, ExtResponse } from "./types";

/* ── Send message to background ───────────────────────── */

export function sendMessage(msg: ExtMessage): Promise<ExtResponse> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(msg, (response: ExtResponse) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            } else {
                resolve(response ?? { success: false, error: "No response" });
            }
        });
    });
}

/* ── Send message to content script in a tab ──────────── */

export function sendTabMessage(tabId: number, msg: ExtMessage): Promise<ExtResponse> {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, msg, (response: ExtResponse) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            } else {
                resolve(response ?? { success: false, error: "No response" });
            }
        });
    });
}
