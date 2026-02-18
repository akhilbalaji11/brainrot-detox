import { COOKED_LABELS, DEFAULT_THRESHOLDS, EMA_ALPHA, IDLE_DECAY_THRESHOLD_MS } from "./constants";
import type { CookedStatus, CookedThresholds, VibeIntent } from "./types";

/* ── Cooked score computation ─────────────────────────── */

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
    idleMs: number,
    vibeIntent: VibeIntent
): number {
    // Intent-based sensitivity multiplier
    const intentMultiplier =
        vibeIntent === "Learn" ? 1.3 :
            vibeIntent === "JustHere" ? 1.1 :
                vibeIntent === "Laugh" ? 0.8 :
                    vibeIntent === "Chill" ? 0.7 : 1.0;

    if (hasNewSignals) {
        const adjusted = instantScore * intentMultiplier;
        const smoothed = previousScore * (1 - EMA_ALPHA) + adjusted * EMA_ALPHA;
        return Math.max(0, Math.min(100, Math.round(smoothed)));
    }

    // Idle decay
    if (idleMs < IDLE_DECAY_THRESHOLD_MS) return previousScore;
    const decay = idleMs < 45_000 ? 1 : idleMs < 90_000 ? 2 : 4;
    return Math.max(0, previousScore - decay);
}

export function computeShortsCookedScore(
    previousScore: number,
    swipes: number,
    vibeIntent: VibeIntent,
    idleMs: number
): number {
    if (swipes > 0) {
        // +1 per swipe, always — predictable and consistent like the pack counter.
        // Vibe intent affects how fast the score decays when idle, not how fast it rises.
        return Math.max(0, Math.min(100, previousScore + swipes));
    }
    // Idle decay — vibe intent adjusts how quickly you cool down
    const decayThreshold =
        vibeIntent === "Chill" || vibeIntent === "Laugh" ? 15_000 :   // forgives idle faster
            vibeIntent === "Learn" || vibeIntent === "JustHere" ? 25_000 : // slower to forgive
                20_000;
    if (idleMs < decayThreshold) return previousScore;
    if (idleMs < 60_000) return Math.max(0, previousScore - 1);
    return Math.max(0, previousScore - 3);
}

/* ── Status derivation ────────────────────────────────── */

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

/* ── Intervention check ───────────────────────────────── */

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

/* ── Late-night check ─────────────────────────────────── */

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
    return Math.min(100, Math.round(score * multiplier));
}
