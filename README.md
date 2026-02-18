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

Your brain on infinite scroll is cooked. This extension is the detox.

`Brainrot Detox` is a Chrome extension that watches your scrolling on YouTube, YouTube Shorts, and Reddit, then steps in before your frontal lobe files a missing person report.

## What it does

- `[%] Cooked Meter`: tracks scroll intensity and labels your state (`Based`, `Medium Cooked`, `Absolutely Cooked`).
- `[#] Snack Packs`: tiny goals that break doomscroll momentum.
- `[*] Touch Grass Mode`: temporarily locks the feed and forces a small reset.
- `✨ Vibe Check`: asks intent and adjusts strictness.
- `Dashboard + Stats`: weekly progress, interventions, and pack completions.

## Tech stack

- `TypeScript`
- `Vite`
- `Chrome Extension Manifest v3`
- `Chrome Storage + Alarms APIs`

## Local setup

```bash
npm install
npm run build
```

Build output lands in `dist/`.

## Install in Chrome (unpacked)

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project’s `dist/` folder.

## Dev workflow

- `npm run dev` for watch mode build loop.
- `npm run typecheck` to validate types.
- `npm run build` for production build.

## Why this exists

Because "just one more short" is the biggest lie since "I can stop anytime."

If the extension tells you to touch grass, that is not an error. That is a feature.

