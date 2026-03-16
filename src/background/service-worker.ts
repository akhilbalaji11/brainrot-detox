import { DEFAULT_PACK_STATE, DEFAULT_TOUCH_GRASS } from "@/core/constants";
import { deleteSession, getSession, getSettings, getStats, patchSettings, saveSession, saveStats } from "@/core/storage";
import type { ExtMessage, ExtResponse, SessionState } from "@/core/types";

/* ── Message handler ──────────────────────────────────── */

chrome.runtime.onMessage.addListener(
    (message: ExtMessage, sender, sendResponse: (r: ExtResponse) => void) => {
        handleMessage(message, sender).then(sendResponse).catch((err) => {
            sendResponse({ success: false, error: String(err) });
        });
        return true; // keep channel open for async
    }
);

async function handleMessage(msg: ExtMessage, sender: chrome.runtime.MessageSender): Promise<ExtResponse> {
    switch (msg.type) {
        case "GET_SETTINGS":
            return { success: true, data: await getSettings() };

        case "UPDATE_SETTINGS":
            return { success: true, data: await patchSettings(msg.payload) };

        case "GET_STATS":
            return { success: true, data: await getStats() };

        case "UPDATE_STATS": {
            const stats = await getStats();
            Object.assign(stats, msg.payload);
            await saveStats(stats);
            return { success: true, data: stats };
        }

        case "GET_SESSION": {
            const tabId = msg.payload?.tabId ?? sender.tab?.id;
            if (!tabId) return { success: false, error: "No tab ID" };
            const session = await getSession(tabId);
            return { success: true, data: session };
        }

        case "UPDATE_SESSION": {
            const tabId = msg.payload?.tabId ?? sender.tab?.id;
            if (!tabId) return { success: false, error: "No tab ID" };
            const existing = await getSession(tabId);
            const updated: SessionState = { ...existing!, ...msg.payload.patch };
            await saveSession(tabId, updated);
            return { success: true, data: updated };
        }

        case "START_PACK": {
            const tabId = msg.payload?.tabId ?? sender.tab?.id;
            if (!tabId) return { success: false, error: "No tab ID" };
            const session = await getSession(tabId);
            if (!session) return { success: false, error: "No session" };
            session.packState = {
                active: true,
                mode: msg.payload.mode,
                limit: msg.payload.limit,
                consumed: 0,
                startedAt: Date.now(),
            };
            await saveSession(tabId, session);
            return { success: true, data: session };
        }

        case "END_PACK": {
            const tabId = msg.payload?.tabId ?? sender.tab?.id;
            if (!tabId) return { success: false, error: "No tab ID" };
            const session = await getSession(tabId);
            if (!session) return { success: false, error: "No session" };
            session.packState = { ...DEFAULT_PACK_STATE };
            await saveSession(tabId, session);
            // update stats
            const stats = await getStats();
            stats.totalPacksCompleted++;
            if (stats.sites[session.site]) stats.sites[session.site].packsCompleted++;
            await saveStats(stats);
            return { success: true, data: session };
        }

        case "START_TOUCH_GRASS": {
            const tabId = msg.payload?.tabId ?? sender.tab?.id;
            if (!tabId) return { success: false, error: "No tab ID" };
            const session = await getSession(tabId);
            if (!session) return { success: false, error: "No session" };
            const durationMs = (msg.payload.minutes ?? 5) * 60_000;
            session.touchGrass = {
                active: true,
                endsAt: Date.now() + durationMs,
                bypassCount: session.touchGrass.bypassCount,
            };
            await saveSession(tabId, session);
            // Alarm for auto-end
            chrome.alarms.create(`touchgrass_${tabId}`, { delayInMinutes: msg.payload.minutes ?? 5 });
            // stats
            const stats2 = await getStats();
            stats2.totalTouchGrassSessions++;
            await saveStats(stats2);
            return { success: true, data: session };
        }

        case "END_TOUCH_GRASS": {
            const tabId = msg.payload?.tabId ?? sender.tab?.id;
            if (!tabId) return { success: false, error: "No tab ID" };
            const session = await getSession(tabId);
            if (!session) return { success: false, error: "No session" };
            session.touchGrass = { ...DEFAULT_TOUCH_GRASS };
            await saveSession(tabId, session);
            chrome.alarms.clear(`touchgrass_${tabId}`);
            return { success: true, data: session };
        }

        case "LOG_EVENT": {
            const stats = await getStats();
            const eventType: string = msg.payload?.eventType;
            if (eventType === "intervention") stats.totalInterventions++;
            if (eventType === "side_quest_completed") stats.totalSideQuestsCompleted++;
            if (eventType === "bypass") stats.totalBypassCount++;
            await saveStats(stats);
            return { success: true };
        }

        case "GET_CURRENT_TAB": {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            return { success: true, data: tab ? { id: tab.id, url: tab.url } : null };
        }

        default:
            return { success: false, error: `Unknown message type: ${msg.type}` };
    }
}

/* ── Alarm handler (touch grass auto-end) ─────────────── */

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name.startsWith("touchgrass_")) {
        const tabId = parseInt(alarm.name.replace("touchgrass_", ""), 10);
        const session = await getSession(tabId);
        if (session) {
            session.touchGrass = { ...DEFAULT_TOUCH_GRASS };
            await saveSession(tabId, session);
            // Notify content script
            try {
                chrome.tabs.sendMessage(tabId, { type: "END_TOUCH_GRASS" });
            } catch (_) { /* tab may be closed */ }
        }
    }
});

/* ── Tab cleanup ──────────────────────────────────────── */

chrome.tabs.onRemoved.addListener(async (tabId) => {
    await deleteSession(tabId);
    chrome.alarms.clear(`touchgrass_${tabId}`);
});

/* ── Install handler ──────────────────────────────────── */

chrome.runtime.onInstalled.addListener(async () => {
    console.log("[brainrot detox] Extension installed / updated");
    // Ensure defaults are set
    await getSettings();
    await getStats();
});
