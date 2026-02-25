import { DEFAULT_SETTINGS, DEFAULT_STATS, DEFAULT_WIDGET_POSITION } from "./constants";
import type { SessionState, SettingsState, StatsState, WidgetPosition } from "./types";

const SETTINGS_KEY = "brd_settings";
const STATS_KEY = "brd_stats";
const SESSION_KEY = "brd_sessions";
const WIDGET_POSITIONS_KEY = "brd_widget_positions";

/* ── Generic helpers ──────────────────────────────────── */

async function get<T>(key: string, fallback: T): Promise<T> {
    const result = await chrome.storage.local.get(key);
    return (result[key] as T) ?? fallback;
}

async function set(key: string, value: any): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
}

/* ── Settings ─────────────────────────────────────────── */

export async function getSettings(): Promise<SettingsState> {
    return get<SettingsState>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: SettingsState): Promise<void> {
    await set(SETTINGS_KEY, settings);
}

export async function patchSettings(patch: Partial<SettingsState>): Promise<SettingsState> {
    const current = await getSettings();
    const merged = deepMerge(current, patch) as SettingsState;
    await saveSettings(merged);
    return merged;
}

/* ── Stats ────────────────────────────────────────────── */

export async function getStats(): Promise<StatsState> {
    return get<StatsState>(STATS_KEY, DEFAULT_STATS);
}

export async function saveStats(stats: StatsState): Promise<void> {
    await set(STATS_KEY, stats);
}

export async function incrementStat(
    key: keyof Pick<StatsState, "totalPacksCompleted" | "totalTouchGrassSessions" | "totalInterventions" | "totalVibeChecks" | "totalBypassCount">,
    delta: number = 1
): Promise<void> {
    const stats = await getStats();
    (stats[key] as number) += delta;
    await saveStats(stats);
}

/* ── Sessions ─────────────────────────────────────────── */

export async function getSessions(): Promise<Record<string, SessionState>> {
    return get<Record<string, SessionState>>(SESSION_KEY, {});
}

export async function getSession(tabId: number): Promise<SessionState | null> {
    const sessions = await getSessions();
    return sessions[String(tabId)] ?? null;
}

export async function saveSession(tabId: number, session: SessionState): Promise<void> {
    const sessions = await getSessions();
    sessions[String(tabId)] = session;
    await set(SESSION_KEY, sessions);
}

export async function deleteSession(tabId: number): Promise<void> {
    const sessions = await getSessions();
    delete sessions[String(tabId)];
    await set(SESSION_KEY, sessions);
}

/* ── Widget Positions ─────────────────────────────────── */

export async function getWidgetPositions(): Promise<Record<string, WidgetPosition>> {
    return get<Record<string, WidgetPosition>>(WIDGET_POSITIONS_KEY, {});
}

export async function getWidgetPosition(siteKey: string): Promise<WidgetPosition> {
    const positions = await getWidgetPositions();
    return positions[siteKey] ?? DEFAULT_WIDGET_POSITION;
}

export async function saveWidgetPosition(siteKey: string, position: WidgetPosition): Promise<void> {
    const positions = await getWidgetPositions();
    positions[siteKey] = position;
    await set(WIDGET_POSITIONS_KEY, positions);
}

/* ── Export / Import / Clear ──────────────────────────── */

export async function exportAllData(): Promise<object> {
    const settings = await getSettings();
    const stats = await getStats();
    return { version: 1, exportedAt: Date.now(), settings, stats };
}

export async function importData(data: any): Promise<void> {
    if (data.settings) await saveSettings(data.settings);
    if (data.stats) await saveStats(data.stats);
}

export async function clearAllData(): Promise<void> {
    await chrome.storage.local.clear();
}

/* ── Deep merge utility ───────────────────────────────── */

function deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === "object"
        ) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}
