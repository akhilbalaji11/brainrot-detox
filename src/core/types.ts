/* ── Site keys ─────────────────────────────────────────── */
export type SiteKey = "youtube" | "shorts" | "reddit";

/* ── Cooked Meter ─────────────────────────────────────── */
export type CookedStatus = "Based" | "Medium Cooked" | "Absolutely Cooked";

export interface CookedThresholds {
    basedMax: number;      // 0-100
    mediumMax: number;     // 0-100
    intervention: number;  // score that triggers intervention
    cooldownMs: number;    // ms before another intervention
}

/* ── Snack Packs ──────────────────────────────────────── */
export type PackMode = "items" | "time";

export interface PackState {
    active: boolean;
    mode: PackMode;
    limit: number;           // items count or minutes
    consumed: number;        // items consumed so far
    startedAt: number;       // Date.now()
}

export interface PackPreset {
    id: string;
    label: string;
    mode: PackMode;
    value: number;
}

/* ── Touch Grass ──────────────────────────────────────── */
export interface TouchGrassState {
    active: boolean;
    endsAt: number;
    bypassCount: number;
}

/* ── Vibe Check ───────────────────────────────────────── */
export type VibeIntent = "Chill" | "Learn" | "Laugh" | "Music" | "JustHere";

/* ── Session state (per-tab, lives in service worker) ── */
export interface SessionState {
    site: SiteKey;
    tabId: number;
    startedAt: number;
    cookedScore: number;
    cookedStatus: CookedStatus;
    lastInterventionAt: number;
    packState: PackState;
    touchGrass: TouchGrassState;
    vibeIntent: VibeIntent;
    itemsConsumed: number;
    scrollEvents: number;
}

/* ── Settings ─────────────────────────────────────────── */
export interface SiteSettings {
    enabled: boolean;
    cookedMeter: boolean;
    snackPacks: boolean;
    touchGrass: boolean;
    vibeCheck: boolean;
}

export interface SettingsState {
    masterEnabled: boolean;
    sites: Record<SiteKey, SiteSettings>;
    cooked: {
        thresholds: CookedThresholds;
        sessionCapMinutes: number;
        lateNight: { enabled: boolean; startHour: number; endHour: number; multiplier: number };
    };
    snackPacks: {
        defaultMode: PackMode;
        defaultLimit: number;
    };
    touchGrass: {
        defaultMinutes: number;
        emergencyBypass: boolean;
    };
    vibeCheck: {
        intervalMinutes: number;
        snoozeUntilMs: number;
        activeIntent: VibeIntent;
    };
}

/* ── Stats (persisted) ────────────────────────────────── */
export interface StatsState {
    totalPacksCompleted: number;
    totalTouchGrassSessions: number;
    totalInterventions: number;
    totalVibeChecks: number;
    totalBypassCount: number;
    sites: Record<SiteKey, { packsCompleted: number; interventions: number; timeSpentMin: number }>;
    weeklyScores: number[]; // last 7 days average cooked scores
}

/* ── Messaging ────────────────────────────────────────── */
export type MessageType =
    | "GET_SESSION"
    | "UPDATE_SESSION"
    | "GET_SETTINGS"
    | "UPDATE_SETTINGS"
    | "GET_STATS"
    | "UPDATE_STATS"
    | "START_PACK"
    | "END_PACK"
    | "START_TOUCH_GRASS"
    | "END_TOUCH_GRASS"
    | "LOG_EVENT"
    | "GET_CURRENT_TAB";

export interface ExtMessage {
    type: MessageType;
    payload?: any;
}

export interface ExtResponse {
    success: boolean;
    data?: any;
    error?: string;
}
