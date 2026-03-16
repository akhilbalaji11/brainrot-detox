import {
    COOKED_LABELS,
    DEFAULT_THRESHOLDS,
    EMA_ALPHA,
    IDLE_DECAY_THRESHOLD_MS,
    SHORT_FORM_DECAY_THRESHOLD_MS,
} from "./constants";
import type { CookedStatus, CookedThresholds } from "./types";

export const TIKTOK_WATCH_SCORE_PER_SECOND = 1 / 30;
export const TIKTOK_SWIPE_SCORE = 1;

function clampCookedScore(score: number): number {
    return Math.max(0, Math.min(100, score));
}

export function computeInstantScore(
    sessionMinutes: number,
    sessionCapMinutes: number,
    scrollEvents: number,
    itemsConsumed: number
): number {
    const timeRatio = Math.min(1, sessionMinutes / sessionCapMinutes);
    const scrollRatio = Math.min(1, scrollEvents / 150);
    const itemRatio = Math.min(1, itemsConsumed / 60);

    const raw = timeRatio * 35 + scrollRatio * 35 + itemRatio * 30;
    return Math.round(Math.min(100, raw));
}

export function computeRollingScore(
    previousScore: number,
    instantScore: number,
    hasNewSignals: boolean,
    idleMs: number
): number {
    if (hasNewSignals) {
        const smoothed = previousScore * (1 - EMA_ALPHA) + instantScore * EMA_ALPHA;
        return clampCookedScore(smoothed);
    }

    if (idleMs < IDLE_DECAY_THRESHOLD_MS) return previousScore;
    const decay = idleMs < 45_000 ? 1 : idleMs < 90_000 ? 2 : 4;
    return clampCookedScore(previousScore - decay);
}

export function computeShortsCookedScore(
    previousScore: number,
    signalGain: number,
    idleMs: number
): number {
    if (signalGain > 0) {
        return clampCookedScore(previousScore + signalGain);
    }

    if (idleMs < SHORT_FORM_DECAY_THRESHOLD_MS) return previousScore;
    if (idleMs < 60_000) return clampCookedScore(previousScore - 1);
    return clampCookedScore(previousScore - 3);
}

export function deriveCookedStatus(
    score: number,
    thresholds: CookedThresholds = DEFAULT_THRESHOLDS
): CookedStatus {
    if (score <= thresholds.basedMax) return "Based";
    if (score <= thresholds.mediumMax) return "Medium Cooked";
    return "Absolutely Cooked";
}

export function getCookedLabel(status: CookedStatus) {
    if (status === "Based") return COOKED_LABELS.based;
    if (status === "Medium Cooked") return COOKED_LABELS.medium;
    return COOKED_LABELS.cooked;
}

export function shouldIntervene(
    score: number,
    lastInterventionAt: number,
    thresholds: CookedThresholds = DEFAULT_THRESHOLDS,
    now: number = Date.now()
): boolean {
    if (score < thresholds.intervention) return false;
    if (now - lastInterventionAt < thresholds.cooldownMs) return false;
    return true;
}

export function isMaxCooked(score: number): boolean {
    return score >= 100;
}

export function computeTikTokCookedScore(
    previousScore: number,
    signalGain: number,
    idleMs: number
): number {
    if (signalGain > 0) {
        return clampCookedScore(previousScore + signalGain);
    }

    if (idleMs < SHORT_FORM_DECAY_THRESHOLD_MS) return previousScore;
    if (idleMs < 60_000) return clampCookedScore(previousScore - 1);
    return clampCookedScore(previousScore - 3);
}

export function computeReelsCookedScore(
    previousScore: number,
    signalGain: number,
    idleMs: number
): number {
    if (signalGain > 0) {
        return clampCookedScore(previousScore + signalGain);
    }

    if (idleMs < SHORT_FORM_DECAY_THRESHOLD_MS) return previousScore;
    if (idleMs < 60_000) return clampCookedScore(previousScore - 1);
    return clampCookedScore(previousScore - 3);
}

export function isLateNight(
    hour: number,
    startHour: number,
    endHour: number
): boolean {
    if (startHour > endHour) {
        return hour >= startHour || hour < endHour;
    }
    return hour >= startHour && hour < endHour;
}

export function applyLateNightMultiplier(
    score: number,
    enabled: boolean,
    startHour: number,
    endHour: number,
    multiplier: number,
    now: Date = new Date()
): number {
    if (!enabled) return score;
    if (!isLateNight(now.getHours(), startHour, endHour)) return score;
    return clampCookedScore(score * multiplier);
}
