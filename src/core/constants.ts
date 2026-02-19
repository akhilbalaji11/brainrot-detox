import type { CookedThresholds, PackPreset, PackState, SettingsState, SiteSettings, StatsState, TouchGrassState } from "./types";

/* ── Cooked thresholds ────────────────────────────────── */
export const DEFAULT_THRESHOLDS: CookedThresholds = {
    basedMax: 35,
    mediumMax: 65,
    intervention: 80,
    cooldownMs: 60_000,
};

/* ── Pack presets ─────────────────────────────────────── */
export const PACK_PRESETS: PackPreset[] = [
    { id: "5items", label: "5 Items", mode: "items", value: 5 },
    { id: "10items", label: "10 Items", mode: "items", value: 10 },
    { id: "20items", label: "20 Items", mode: "items", value: 20 },
    { id: "5min", label: "5 Minutes", mode: "time", value: 5 },
    { id: "10min", label: "10 Minutes", mode: "time", value: 10 },
    { id: "20min", label: "20 Minutes", mode: "time", value: 20 },
];

/* ── Default states ───────────────────────────────────── */
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

/* ── Default site settings ────────────────────────────── */
const SITE_DEFAULTS: SiteSettings = {
    enabled: true,
    cookedMeter: true,
    snackPacks: true,
    touchGrass: true,
    vibeCheck: true,
};

/* ── Default settings ─────────────────────────────────── */
export const DEFAULT_SETTINGS: SettingsState = {
    masterEnabled: true,
    sites: {
        youtube: { ...SITE_DEFAULTS },
        shorts: { ...SITE_DEFAULTS },
        reddit: { ...SITE_DEFAULTS },
        "instagram-reels": { ...SITE_DEFAULTS },
        "tiktok": { ...SITE_DEFAULTS },
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
    vibeCheck: {
        intervalMinutes: 15,
        snoozeUntilMs: 0,
        activeIntent: "JustHere",
    },
};

/* ── Default per-site stats ──────────────────────────── */
const SITE_STATS_DEFAULTS = { packsCompleted: 0, interventions: 0, timeSpentMin: 0 };

export const DEFAULT_STATS: StatsState = {
    totalPacksCompleted: 0,
    totalTouchGrassSessions: 0,
    totalInterventions: 0,
    totalVibeChecks: 0,
    totalBypassCount: 0,
    sites: {
        youtube: { ...SITE_STATS_DEFAULTS },
        shorts: { ...SITE_STATS_DEFAULTS },
        reddit: { ...SITE_STATS_DEFAULTS },
        "instagram-reels": { ...SITE_STATS_DEFAULTS },
        "tiktok": { ...SITE_STATS_DEFAULTS },
    },
    weeklyScores: [],
};

/* ── Touch-grass tips ─────────────────────────────────── */
export const TOUCH_GRASS_TIPS = [
    "[>] Step outside for 2 minutes",
    "[~] Drink a glass of water",
    "[o] Do 5 deep breaths",
    "[!] Do 10 jumping jacks",
    "[*] Look at something 20 feet away for 20 seconds",
    "[♪] Put on your favorite song",
    "[>] Text a friend something nice",
    "[=] Open a window and feel the air",
];

/* ── Cooked status labels ─────────────────────────────── */
export const COOKED_LABELS = {
    based: { emoji: "( ._.)", label: "Based", hint: "Keep it chill, you're doing great." },
    medium: { emoji: "(-_-;)", label: "Medium Cooked", hint: "Maybe take a breather soon?" },
    cooked: { emoji: "(x_x) ", label: "Absolutely Cooked", hint: "Bro. Step away from the screen." },
} as const;

/* ── Vibe options ─────────────────────────────────────── */
export const VIBE_OPTIONS = [
    { id: "Chill", emoji: "~_~", label: "Just Vibing" },
    { id: "Learn", emoji: "o_O", label: "Learn Something" },
    { id: "Laugh", emoji: "xD", label: "Get Entertained" },
    { id: "Music", emoji: "♪♫", label: "Music / Audio" },
    { id: "JustHere", emoji: "...", label: "I'm Just Here" },
] as const;

/* ── Misc ─────────────────────────────────────────────── */
export const SKYRIM_VIDEO_FILENAME = "skyrim-skeleton.mp4";
export const EMA_ALPHA = 0.3;          // exponential smoothing factor
export const TICK_INTERVAL_MS = 3000;  // cooked meter tick interval
export const IDLE_DECAY_THRESHOLD_MS = 15_000;
