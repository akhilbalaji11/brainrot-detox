import type {
    CookedThresholds,
    PackPreset,
    PackState,
    SettingsState,
    SideQuestDefinition,
    SiteSettings,
    StatsState,
    TouchGrassState,
    WidgetPosition,
} from "./types";

export const DEFAULT_THRESHOLDS: CookedThresholds = {
    basedMax: 35,
    mediumMax: 65,
    intervention: 80,
    cooldownMs: 60_000,
};

export const PACK_PRESETS: PackPreset[] = [
    { id: "5items", label: "5 Items", mode: "items", value: 5 },
    { id: "10items", label: "10 Items", mode: "items", value: 10 },
    { id: "20items", label: "20 Items", mode: "items", value: 20 },
    { id: "5min", label: "5 Minutes", mode: "time", value: 5 },
    { id: "10min", label: "10 Minutes", mode: "time", value: 10 },
    { id: "20min", label: "20 Minutes", mode: "time", value: 20 },
];

export const DEFAULT_PACK_STATE: PackState = {
    active: false,
    mode: "items",
    limit: 10,
    consumed: 0,
    startedAt: 0,
};

export const DEFAULT_TOUCH_GRASS: TouchGrassState = {
    active: false,
    endsAt: 0,
    bypassCount: 0,
};

const SITE_DEFAULTS: SiteSettings = {
    enabled: true,
    cookedMeter: true,
    snackPacks: true,
    touchGrass: true,
    sideQuest: true,
};

export const DEFAULT_SETTINGS: SettingsState = {
    masterEnabled: true,
    sites: {
        youtube: { ...SITE_DEFAULTS },
        shorts: { ...SITE_DEFAULTS },
        reddit: { ...SITE_DEFAULTS },
        "instagram-reels": { ...SITE_DEFAULTS },
        tiktok: { ...SITE_DEFAULTS },
    },
    cooked: {
        thresholds: DEFAULT_THRESHOLDS,
        sessionCapMinutes: 120,
        lateNight: { enabled: true, startHour: 23, endHour: 5, multiplier: 1.4 },
    },
    snackPacks: {
        defaultMode: "items",
        defaultLimit: 10,
    },
    touchGrass: {
        defaultMinutes: 5,
        emergencyBypass: true,
    },
    sideQuest: {
        promptCooldownMinutes: 15,
        nextPromptAfterMs: 0,
    },
    theme: "light",
};

const SITE_STATS_DEFAULTS = { packsCompleted: 0, interventions: 0, timeSpentMin: 0 };

export const DEFAULT_STATS: StatsState = {
    totalPacksCompleted: 0,
    totalTouchGrassSessions: 0,
    totalInterventions: 0,
    totalSideQuestsCompleted: 0,
    totalBypassCount: 0,
    sites: {
        youtube: { ...SITE_STATS_DEFAULTS },
        shorts: { ...SITE_STATS_DEFAULTS },
        reddit: { ...SITE_STATS_DEFAULTS },
        "instagram-reels": { ...SITE_STATS_DEFAULTS },
        tiktok: { ...SITE_STATS_DEFAULTS },
    },
    weeklyScores: [],
};

export const TOUCH_GRASS_TIPS = [
    "[>] Step outside for 2 minutes",
    "[~] Drink a glass of water",
    "[o] Do 5 deep breaths",
    "[!] Do 10 jumping jacks",
    "[*] Look at something 20 feet away for 20 seconds",
    "[~] Put on your favorite song",
    "[>] Text a friend something nice",
    "[=] Open a window and feel the air",
];

export const COOKED_LABELS = {
    based: { emoji: "( ._.)", label: "Based", hint: "Keep it chill, you're doing great." },
    medium: { emoji: "(-_-;)", label: "Medium Cooked", hint: "Maybe take a breather soon?" },
    cooked: { emoji: "(x_x) ", label: "Absolutely Cooked", hint: "Bro. Step away from the screen." },
} as const;

export const SIDE_QUEST_SCORE_RELIEF = 12;

export const SIDE_QUESTS: SideQuestDefinition[] = [
    {
        id: "hydrate",
        icon: "[~]",
        title: "Hydration Hero",
        instruction: "Take a real sip of water. Yes, right now.",
        durationSec: 8,
    },
    {
        id: "stretch",
        icon: "[>]",
        title: "Stretch Goblin",
        instruction: "Stand up and stretch your arms overhead like you mean it.",
        durationSec: 10,
    },
    {
        id: "far-focus",
        icon: "[*]",
        title: "Far Away Focus",
        instruction: "Look at something far away until your eyeballs stop buzzing.",
        durationSec: 8,
    },
    {
        id: "jaw-reset",
        icon: "[=]",
        title: "Jaw Reset",
        instruction: "Unclench your jaw and roll your shoulders twice.",
        durationSec: 6,
    },
    {
        id: "breaths",
        icon: "[o]",
        title: "Five Deep Breaths",
        instruction: "Take 5 slow breaths. In. Out. Main character reset.",
        durationSec: 10,
    },
    {
        id: "window-patrol",
        icon: "[!]",
        title: "Window Patrol",
        instruction: "Look out a window or focus on something real-world for a moment.",
        durationSec: 8,
    },
];

export const SKYRIM_VIDEO_FILENAME = "skyrim-skeleton.mp4";
export const EMA_ALPHA = 0.3;
export const TICK_INTERVAL_MS = 3000;
export const IDLE_DECAY_THRESHOLD_MS = 15_000;

export const TICK_FAST_MS = 500;
export const TICK_IDLE_MS = 3000;
export const ACTIVITY_THRESHOLD_MS = 2000;
export const VELOCITY_WINDOW_MS = 4000;
export const VELOCITY_MULTIPLIER_COEFFICIENT = 0.35;
export const VELOCITY_MULTIPLIER_MAX = 3;
export const SHORT_FORM_DECAY_THRESHOLD_MS = 20_000;

export const DEFAULT_WIDGET_POSITION: WidgetPosition = { edge: "right", verticalOffset: 20 };
