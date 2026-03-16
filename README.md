# Brainrot Detox

```text
  ____             _                  _     ____       _
 | __ ) _ __ __ _(_)_ __  _ __ ___ | |_  |  _ \  ___| |_ _____  __
 |  _ \| '__/ _` | | '_ \| '__/ _ \| __| | | | |/ _ \ __/ _ \ \/ /
 | |_) | | | (_| | | | | | | | (_) | |_  | |_| |  __/ || (_) >  <
 |____/|_|  \__,_|_|_| |_|_|  \___/ \__| |____/ \___|\__\___/_/\_\

 [B] your feed is infinite
 [x] your attention is not
```

Brainrot Detox is a Chrome extension that watches how aggressively you scroll on infinite feeds, raises a "cooked meter" as sessions spiral, and interrupts doomscrolling with lightweight interventions before the session gets out of hand.

## Supported Platforms

| Platform | Signals used | Current state |
| --- | --- | --- |
| YouTube feed | Scroll, wheel, session intensity | Working |
| YouTube Shorts | Successful short changes, wheel, touch swipe, keyboard | Working |
| Reddit | Scroll, wheel, session intensity | Working |
| Instagram Reels | Successful reel changes, wheel, touch swipe, keyboard | Working |
| TikTok | Successful video changes, wheel, touch swipe, keyboard, watch time | Working |

## Current Working State

- The extension builds successfully and loads as an unpacked Manifest v3 Chrome extension.
- The cooked meter widget now updates in place instead of remounting on each tick.
- Intervention overlays such as "Absolutely Cooked", Skyrim/max-cooked, Side Quest, snack packs, and touch grass no longer get reset by widget refreshes.
- Short-form velocity scoring now uses recent successful navigation history so rapid scrolling increases score faster than slow scrolling.
- The widget can be dragged vertically and snapped to either the left or right edge, and that position is persisted per site.
- Instagram Reels and TikTok content scripts keep a single adapter alive across supported in-app route changes instead of tearing everything down on every SPA navigation.
- A browser verification harness lives at `scripts/verify-runtime.cjs` for extension-level runtime checks.
- The runtime harness verifies slow versus fast scoring behavior on YouTube, Shorts, Reddit, Instagram Reels, and TikTok.

## Features

- `Cooked Meter`: shows the current scroll state as `Based`, `Medium Cooked`, or `Absolutely Cooked`.
- `Snack Packs`: short item-count or time-based goals to break scrolling momentum.
- `Touch Grass Mode`: temporarily blocks the feed with a cooldown screen and reset prompts.
- `Side Quest`: offers quick playful break missions that lower the cooked meter after a short reset.
- `Stats Dashboard`: tracks interventions, pack completions, and progress over time.

## Changelog

### v1.1.0 - Runtime Stabilization and Scoring Pass

- Fixed the core widget refresh bug by moving widget ownership into the shared overlay manager and updating the widget in place.
- Added managed adapter cleanup for event listeners, mutation observers, runtime message listeners, intervals, and timers.
- Fixed intervention/max-cooked gating so overlays use the real previous score instead of retriggering off an already-mutated session value.
- Reworked short-form scoring so successful content transitions are the canonical signal and rapid navigation applies a shared 4 second velocity multiplier.
- Primed YouTube and Reddit feed baselines so the first mutation after page load does not overcount the whole visible feed as newly consumed content.
- Restored draggable edge snapping for the widget with click-vs-drag separation and persisted left/right placement.
- Stabilized Instagram Reels and TikTok SPA handling so adapters survive supported in-feed route changes.
- Added `scripts/verify-runtime.cjs` to load the built extension in a real browser and verify widget persistence, overlay stability, scoring behavior, and drag behavior across all supported platforms.

### v1.2.0 - Side Quest Refresh

- Removed the old Vibe Check intent system and simplified cooked-meter scoring back to a neutral baseline.
- Added Side Quest, a shared lightweight overlay with timed break missions, rerolls, cooldown-aware auto prompts, and a completion reward that lowers cooked score.
- Rewired the widget click target, popup quick action, options toggle, and dashboard stat from Vibe Check to Side Quest.
- Added storage compatibility so older installs seed the new Side Quest cooldown from legacy Vibe Check settings without crashing or corrupting saved sessions.
- Updated runtime behavior so automatic Side Quest prompts only appear when a session crosses from Based into Medium Cooked and no stronger overlay is already active.

## Tech Stack

- TypeScript
- Vite
- Chrome Extension Manifest v3
- Chrome Storage and Alarms APIs

## Local Setup

```bash
npm install
npm run typecheck
npm run build
```

Build output lands in `dist/`.

## Install in Chrome

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project's `dist/` folder.

## Development Workflow

- `npm run dev` runs the Vite build in watch mode.
- `npm run typecheck` validates TypeScript types.
- `npm run build` creates the production extension build.
- `node scripts/verify-runtime.cjs` runs the browser-based extension verification harness against the built `dist/` output.

## Why This Exists

Because "just one more short" is the biggest lie on the modern internet.

If the extension tells you to touch grass, that is not an error. That is the product working as designed.
