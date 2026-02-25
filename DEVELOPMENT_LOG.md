# Development Log: Instagram Reels & TikTok Support

## Overview

This log documents the implementation of Instagram Reels and TikTok platform support for Brainrot Detox.

**Branch:** `feature/instagram-tiktok-support`
**Date:** February 2025

---

## Features Implemented

### 1. Core Type System Updates

- **File:** `src/core/types.ts`
- **Change:** Extended `SiteKey` type to include `"instagram-reels"` and `"tiktok"`
- Added corresponding entries to `SettingsState` and `StatsState` type definitions

### 2. Constants Updates

- **File:** `src/core/constants.ts`
- **Change:** Added default settings and stats for new platforms
- Both platforms inherit the same default feature toggles (cookedMeter, snackPacks, touchGrass, vibeCheck)

### 3. Cooked Meter Scoring Functions

- **File:** `src/core/cooked-meter.ts`
- **New Functions:**
  - `computeTikTokCookedScore()` - Hybrid scoring with watch time (+0.033/s) + swipes (+1/swipe)
  - `computeReelsCookedScore()` - Swipe-based scoring (same as Shorts: +1/swipe)

### 4. Platform Adapters

#### Instagram Reels Adapter
- **File:** `src/content/adapters/instagram-reels-adapter.ts`
- **Site Key:** `instagram-reels`
- **Detection Methods:**
  - URL polling for `/reel/ID` pattern changes
  - Wheel events (debounced at 500ms to prevent multiple counts)
  - Touch swipe detection (50px threshold)
  - Keyboard navigation (ArrowDown / j key)
- **Scoring:** Uses `computeReelsCookedScore()` - swipe-based

#### TikTok Adapter
- **File:** `src/content/adapters/tiktok-adapter.ts`
- **Site Key:** `tiktok`
- **Detection Methods:**
  - Video element polling (detects when video source changes)
  - DOM mutation observer on feed container
  - Watch time tracking (100ms intervals while video plays in viewport)
  - Wheel events
  - Touch swipe detection (50px threshold)
  - Keyboard navigation (ArrowDown / j key)
- **Scoring:** Uses `computeTikTokCookedScore()` - hybrid watch time + swipes
- **Custom tick override:** Implements own tick method for watch-time-based scoring

### 5. Content Script Injectors

- **File:** `src/content/inject-instagram.ts`
  - Handles SPA navigation by re-initializing adapter on URL changes to/from reels

- **File:** `src/content/inject-tiktok.ts`
  - Handles SPA navigation by re-initializing on foryou/following pages

### 6. Build System Updates

- **File:** `scripts/build-content-scripts.mjs`
- Added `inject-instagram` and `inject-tiktok` to the entries array

### 7. Manifest Updates

- **File:** `public/manifest.json`
- **Version:** Bumped to `1.1.0`
- **Host permissions added:**
  - `https://*.instagram.com/*`
  - `https://*.tiktok.com/*`
- **Content scripts added:**
  - Instagram: matches `/reels/*` and `/reel/*`
  - TikTok: matches all tiktok.com pages
- **Web accessible resources:** Updated to include new platforms

---

## Bug Fixes Applied

### Fix 1: Popup Not Recognizing New Platforms
- **Issue:** Dashboard showed "Not on a supported site" on Instagram/TikTok
- **File:** `src/popup/popup.ts`
- **Fix:** Updated `getSite()` function to detect Instagram Reels and TikTok URLs
- **Also:** Added platform names to `siteNames` record

### Fix 2: Snack Pack Items Not Incrementing
- **Issue:** Swiping on Instagram didn't increment pack progress
- **File:** `src/content/adapters/instagram-reels-adapter.ts`
- **Fix:** Added `itemsSinceLastTick++` to wheel handler

### Fix 3: Touch Grass Should Reset Cooked Score
- **Issue:** Cooked score persisted after completing Touch Grass mode
- **File:** `src/content/adapters/base-adapter.ts`
- **Fix:** `endTouchGrass()` now resets `cookedScore` to 0 and `cookedStatus` to "Based"

### Fix 4: ASCII Art Display
- **Issue:** ASCII-style text like `( ._.)` not displaying correctly
- **Files:** `src/popup/popup.css`, `src/content/overlays/overlay-manager.ts`
- **Fix:** Added `white-space: pre` to `.score-emoji` and `.brd-widget-emoji`

### Fix 5: Timed Pack Display
- **Issue:** Time-based packs showed item count instead of countdown
- **File:** `src/core/snack-packs.ts`
- **Fix:** `getPackProgress()` now returns `timeRemaining` string (MM:SS format)
- **All adapters:** Updated widget to show timer for time-based packs

### Fix 6: Touch Grass Duration from Settings
- **Issue:** Hardcoded 5 minutes instead of using user setting
- **Files:** All adapters, `src/popup/popup.ts`
- **Fix:** Replaced hardcoded `5` with `this.settings.touchGrass.defaultMinutes`
- **Popup:** Now stores and uses `currentSettings` for Touch Grass duration

### Fix 7: Wheel Event Debouncing
- **Issue:** Single swipe triggered multiple wheel events, completing packs instantly
- **File:** `src/content/adapters/instagram-reels-adapter.ts`
- **Fix:** Added 500ms debounce (`WHEEL_DEBOUNCE_MS`) to wheel handler

### Fix 8: Keyboard Navigation Support
- **Issue:** Down arrow key didn't increment meter/pack
- **Files:** All swipe-based adapters (Shorts, Instagram, TikTok)
- **Fix:** Added `onKeyDown` handler for `ArrowDown` and `j` keys

---

## Architecture Decisions

### Why Separate Adapters?

Each platform has unique DOM structures and navigation patterns:
- **Instagram:** URL-based navigation (`/reel/ID`), presentation container
- **TikTok:** Video element changes, no URL change for each video

### Why TikTok Uses Watch Time

TikTok's feed is a continuous video player where users watch each video for varying durations. A pure swipe count doesn't capture engagement. The hybrid formula (`+0.033/s + +1/swipe`) accounts for both passive watching and active navigation.

### Why Debounce Wheel Events

Mouse wheel events fire 10+ times per physical swipe gesture. Without debouncing, one swipe would increment the counter by 10+ items, breaking pack progress.

---

## Testing Checklist

- [ ] Load extension from `dist/` folder
- [ ] Instagram Reels: Widget appears and score increments
- [ ] Instagram Reels: Pack progress works with swipes
- [ ] Instagram Reels: Keyboard (↓ / j) navigation detected
- [ ] TikTok: Widget appears and score increments
- [ ] TikTok: Watch time accumulates while video plays
- [ ] TikTok: Pack progress works with swipes
- [ ] TikTok: Keyboard (↓ / j) navigation detected
- [ ] Touch Grass: Timer resets cooked score on completion
- [ ] Touch Grass: Duration respects settings
- [ ] Popup: Shows correct platform name
- [ ] Time-based packs: Show countdown timer

---

## Commit History

```
53ffb0f feat: add Instagram Reels and TikTok support (v1.1.0)
4bfdfb4 feat: add Instagram and TikTok to build script and manifest
f28d960 feat: add TikTok and Instagram content script injectors
7deab86 feat: add Instagram Reels adapter with swipe-based scoring
37fc6db feat: add TikTok-specific tick with watch-time scoring
8fecd63 feat: add TikTok adapter with watch-time tracking
26ead69 feat: add computeReelsCookedScore (swipe-based like Shorts)
def3277 feat: add computeTikTokCookedScore with watch-time tracking
9451ea4 feat: add default settings and stats for instagram-reels and tiktok
12081cd feat: add instagram-reels and tiktok to SiteKey type
50b149d fix: multiple bug fixes for Instagram/TikTok support
19317b8 fix: debounce wheel events for Instagram pack counting
53ffb0f feat: add keyboard navigation support (down arrow / j key)
```
