import { DEFAULT_PACK_STATE } from "./constants";
import type { PackMode, PackState } from "./types";

export function startPack(mode: PackMode, limit: number): PackState {
    return {
        active: true,
        mode,
        limit,
        consumed: 0,
        startedAt: Date.now(),
    };
}

export function incrementPack(state: PackState, delta: number = 1): PackState {
    if (!state.active) return state;
    return { ...state, consumed: state.consumed + delta };
}

export function isPackComplete(state: PackState, now: number = Date.now()): boolean {
    if (!state.active) return false;
    if (state.mode === "items") return state.consumed >= state.limit;
    if (state.mode === "time") {
        const elapsedMin = (now - state.startedAt) / 60_000;
        return elapsedMin >= state.limit;
    }
    return false;
}

export function endPack(): PackState {
    return { ...DEFAULT_PACK_STATE };
}

export function getPackProgress(state: PackState, now: number = Date.now()): { current: number; total: number; percent: number; timeRemaining?: string } {
    if (!state.active) return { current: 0, total: 0, percent: 0 };
    if (state.mode === "items") {
        return {
            current: state.consumed,
            total: state.limit,
            percent: Math.min(100, Math.round((state.consumed / state.limit) * 100)),
        };
    }
    const elapsedMin = (now - state.startedAt) / 60_000;
    const remainingMin = Math.max(0, state.limit - elapsedMin);
    const mins = Math.floor(remainingMin);
    const secs = Math.floor((remainingMin - mins) * 60);
    return {
        current: Math.round(elapsedMin),
        total: state.limit,
        percent: Math.min(100, Math.round((elapsedMin / state.limit) * 100)),
        timeRemaining: `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
    };
}
