import { DEFAULT_PACK_STATE, DEFAULT_SETTINGS, DEFAULT_STATS, DEFAULT_TOUCH_GRASS, DEFAULT_WIDGET_POSITION } from "./constants";
import { deriveCookedStatus } from "./cooked-meter";
import type { SessionState, SettingsState, SiteKey, StatsState, WidgetPosition } from "./types";

const SETTINGS_KEY = "brd_settings";
const STATS_KEY = "brd_stats";
const SESSION_KEY = "brd_sessions";
const WIDGET_POSITIONS_KEY = "brd_widget_positions";

async function get<T>(key: string, fallback: T): Promise<T> {
    const result = await chrome.storage.local.get(key);
    return (result[key] as T) ?? fallback;
}

async function set(key: string, value: any): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
}

export async function getSettings(): Promise<SettingsState> {
    const raw = await get<any>(SETTINGS_KEY, DEFAULT_SETTINGS);
    return normalizeSettings(raw);
}

export async function saveSettings(settings: SettingsState): Promise<void> {
    await set(SETTINGS_KEY, normalizeSettings(settings));
}

export async function patchSettings(patch: Partial<SettingsState>): Promise<SettingsState> {
    const current = await getSettings();
    const merged = deepMerge(current, patch);
    const normalized = normalizeSettings(merged);
    await saveSettings(normalized);
    return normalized;
}

export async function getStats(): Promise<StatsState> {
    const raw = await get<any>(STATS_KEY, DEFAULT_STATS);
    return normalizeStats(raw);
}

export async function saveStats(stats: StatsState): Promise<void> {
    await set(STATS_KEY, normalizeStats(stats));
}

export async function incrementStat(
    key: keyof Pick<StatsState, "totalPacksCompleted" | "totalTouchGrassSessions" | "totalInterventions" | "totalSideQuestsCompleted" | "totalBypassCount">,
    delta: number = 1
): Promise<void> {
    const stats = await getStats();
    stats[key] += delta;
    await saveStats(stats);
}

export async function getSessions(): Promise<Record<string, SessionState>> {
    const rawSessions = await get<Record<string, any>>(SESSION_KEY, {});
    const normalized: Record<string, SessionState> = {};

    for (const [tabId, session] of Object.entries(rawSessions)) {
        const next = normalizeSession(session, Number(tabId));
        if (next) {
            normalized[tabId] = next;
        }
    }

    return normalized;
}

export async function getSession(tabId: number): Promise<SessionState | null> {
    const sessions = await get<Record<string, any>>(SESSION_KEY, {});
    return normalizeSession(sessions[String(tabId)], tabId);
}

export async function saveSession(tabId: number, session: SessionState): Promise<void> {
    const sessions = await get<Record<string, any>>(SESSION_KEY, {});
    const normalized = normalizeSession(session, tabId);
    if (!normalized) return;

    sessions[String(tabId)] = normalized;
    await set(SESSION_KEY, sessions);
}

export async function deleteSession(tabId: number): Promise<void> {
    const sessions = await get<Record<string, any>>(SESSION_KEY, {});
    delete sessions[String(tabId)];
    await set(SESSION_KEY, sessions);
}

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

function normalizeSettings(raw: any): SettingsState {
    const normalizedSites = Object.fromEntries(
        (Object.keys(DEFAULT_SETTINGS.sites) as SiteKey[]).map((siteKey) => {
            const defaults = DEFAULT_SETTINGS.sites[siteKey];
            const legacySite = raw?.sites?.[siteKey] ?? {};

            return [siteKey, {
                enabled: legacySite.enabled ?? defaults.enabled,
                cookedMeter: legacySite.cookedMeter ?? defaults.cookedMeter,
                snackPacks: legacySite.snackPacks ?? defaults.snackPacks,
                touchGrass: legacySite.touchGrass ?? defaults.touchGrass,
                sideQuest: legacySite.sideQuest ?? legacySite.vibeCheck ?? defaults.sideQuest,
            }];
        })
    ) as SettingsState["sites"];

    return {
        masterEnabled: raw?.masterEnabled ?? DEFAULT_SETTINGS.masterEnabled,
        sites: normalizedSites,
        cooked: {
            thresholds: {
                ...DEFAULT_SETTINGS.cooked.thresholds,
                ...(raw?.cooked?.thresholds ?? {}),
            },
            sessionCapMinutes: raw?.cooked?.sessionCapMinutes ?? DEFAULT_SETTINGS.cooked.sessionCapMinutes,
            lateNight: {
                ...DEFAULT_SETTINGS.cooked.lateNight,
                ...(raw?.cooked?.lateNight ?? {}),
            },
        },
        snackPacks: {
            ...DEFAULT_SETTINGS.snackPacks,
            ...(raw?.snackPacks ?? {}),
        },
        touchGrass: {
            ...DEFAULT_SETTINGS.touchGrass,
            ...(raw?.touchGrass ?? {}),
        },
        sideQuest: {
            promptCooldownMinutes:
                raw?.sideQuest?.promptCooldownMinutes ??
                raw?.vibeCheck?.intervalMinutes ??
                DEFAULT_SETTINGS.sideQuest.promptCooldownMinutes,
            nextPromptAfterMs:
                raw?.sideQuest?.nextPromptAfterMs ??
                0,
        },
        theme: raw?.theme ?? DEFAULT_SETTINGS.theme,
    };
}

function normalizeStats(raw: any): StatsState {
    const normalizedSites = Object.fromEntries(
        (Object.keys(DEFAULT_STATS.sites) as SiteKey[]).map((siteKey) => {
            return [siteKey, {
                ...DEFAULT_STATS.sites[siteKey],
                ...(raw?.sites?.[siteKey] ?? {}),
            }];
        })
    ) as StatsState["sites"];

    return {
        totalPacksCompleted: raw?.totalPacksCompleted ?? DEFAULT_STATS.totalPacksCompleted,
        totalTouchGrassSessions: raw?.totalTouchGrassSessions ?? DEFAULT_STATS.totalTouchGrassSessions,
        totalInterventions: raw?.totalInterventions ?? DEFAULT_STATS.totalInterventions,
        totalSideQuestsCompleted: raw?.totalSideQuestsCompleted ?? DEFAULT_STATS.totalSideQuestsCompleted,
        totalBypassCount: raw?.totalBypassCount ?? DEFAULT_STATS.totalBypassCount,
        sites: normalizedSites,
        weeklyScores: Array.isArray(raw?.weeklyScores) ? raw.weeklyScores : DEFAULT_STATS.weeklyScores,
    };
}

function normalizeSession(raw: any, fallbackTabId: number): SessionState | null {
    if (!raw || typeof raw !== "object") return null;
    if (typeof raw.site !== "string") return null;

    const cookedScore = typeof raw.cookedScore === "number" ? raw.cookedScore : 0;

    return {
        site: raw.site,
        tabId: raw.tabId ?? fallbackTabId,
        startedAt: raw.startedAt ?? Date.now(),
        cookedScore,
        cookedStatus: raw.cookedStatus ?? deriveCookedStatus(cookedScore),
        lastInterventionAt: raw.lastInterventionAt ?? 0,
        packState: {
            ...DEFAULT_PACK_STATE,
            ...(raw.packState ?? {}),
        },
        touchGrass: {
            ...DEFAULT_TOUCH_GRASS,
            ...(raw.touchGrass ?? {}),
        },
        itemsConsumed: raw.itemsConsumed ?? 0,
        scrollEvents: raw.scrollEvents ?? 0,
    };
}

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
