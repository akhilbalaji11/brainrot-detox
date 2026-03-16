/* Site keys */
export type SiteKey = "youtube" | "shorts" | "reddit" | "instagram-reels" | "tiktok";

/* Cooked meter */
export type CookedStatus = "Based" | "Medium Cooked" | "Absolutely Cooked";

export interface CookedThresholds {
    basedMax: number;
    mediumMax: number;
    intervention: number;
    cooldownMs: number;
}

/* Snack packs */
export type PackMode = "items" | "time";

export interface PackState {
    active: boolean;
    mode: PackMode;
    limit: number;
    consumed: number;
    startedAt: number;
}

export interface PackPreset {
    id: string;
    label: string;
    mode: PackMode;
    value: number;
}

/* Touch grass */
export interface TouchGrassState {
    active: boolean;
    endsAt: number;
    bypassCount: number;
}

/* Side quests */
export interface SideQuestDefinition {
    id: string;
    icon: string;
    title: string;
    instruction: string;
    durationSec: number;
}

/* Widget position */
export interface WidgetPosition {
    edge: "left" | "right";
    verticalOffset: number;
}

/* Theme */
export type Theme = "light" | "dark";

/* Session state (per-tab, lives in service worker) */
export interface SessionState {
    site: SiteKey;
    tabId: number;
    startedAt: number;
    cookedScore: number;
    cookedStatus: CookedStatus;
    lastInterventionAt: number;
    packState: PackState;
    touchGrass: TouchGrassState;
    itemsConsumed: number;
    scrollEvents: number;
}

/* Settings */
export interface SiteSettings {
    enabled: boolean;
    cookedMeter: boolean;
    snackPacks: boolean;
    touchGrass: boolean;
    sideQuest: boolean;
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
    sideQuest: {
        promptCooldownMinutes: number;
        nextPromptAfterMs: number;
    };
    theme: Theme;
}

/* Stats */
export interface StatsState {
    totalPacksCompleted: number;
    totalTouchGrassSessions: number;
    totalInterventions: number;
    totalSideQuestsCompleted: number;
    totalBypassCount: number;
    sites: Record<SiteKey, { packsCompleted: number; interventions: number; timeSpentMin: number }>;
    weeklyScores: number[];
}

/* Messaging */
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
    | "TRIGGER_PACK"
    | "TRIGGER_TOUCH_GRASS"
    | "TRIGGER_SIDE_QUEST"
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
