# Design: Instagram Reels & TikTok Support

**Date:** 2026-02-18
**Status:** Approved
**Approach:** Minimal Extension (Approach 1)

## Overview

Add support for Instagram Reels and TikTok to Brainrot Detox, focusing on short-form video only. Instagram Reels will use the same swipe-based scoring as YouTube Shorts. TikTok will use a hybrid model tracking both watch time and swipes.

## Goals

- Extend platform coverage to the two most popular short-form video platforms after YouTube Shorts
- Maintain consistency with existing UX (cooked meter, overlays, snack packs)
- Ship fast with minimal risk by reusing proven patterns

## Architecture

### File Structure Changes

```
src/
├── content/
│   ├── adapters/
│   │   ├── instagram-reels-adapter.ts   # NEW
│   │   └── tiktok-adapter.ts            # NEW
│   ├── inject-instagram.ts              # NEW
│   └── inject-tiktok.ts                 # NEW
├── core/
│   ├── constants.ts                     # Extend SiteSettings defaults
│   └── types.ts                         # Add "instagram-reels" | "tiktok" to SiteKey
└── manifest.json                        # Add content_scripts + host_permissions
```

### Type Extensions

```typescript
// types.ts
export type SiteKey = "youtube" | "shorts" | "reddit" | "instagram-reels" | "tiktok";
```

### Platform Detection Rules

| Platform | URL Pattern | DOM Container |
|----------|-------------|---------------|
| Instagram Reels | `*.instagram.com/reels/*`, `*.instagram.com/reel/*` | `[role="presentation"]` video container |
| TikTok | `*.tiktok.com/*` (excl. profile pages) | `[data-e2e="recommend-list-item-container"]` |

## TikTok Adapter

### Score Model (Watch-Time + Swipes)

```typescript
const WATCH_SCORE_PER_SECOND = 1/30;  // ~0.033 per second
const SWIPE_SCORE = 1;

function computeTikTokCookedScore(
  previousScore: number,
  watchTimeMs: number,
  swipes: number,
  vibeIntent: VibeIntent,
  idleMs: number
): number {
  const watchSeconds = Math.min(watchTimeMs / 1000, 3);
  const watchScore = watchSeconds * WATCH_SCORE_PER_SECOND;
  const swipeScore = swipes * SWIPE_SCORE;
  const totalGain = watchScore + swipeScore;
  const newScore = previousScore + totalGain;

  if (idleMs < 15000) return Math.min(100, Math.round(newScore));
  if (idleMs < 60000) return Math.max(0, Math.round(newScore - 1));
  return Math.max(0, Math.round(newScore - 3));
}
```

### DOM Observation

- Video element: `video[data-play]`
- Container: `[data-e2e="recommend-list-item-container"]`
- Track watch time via `timeupdate` events
- Track swipes via scroll/wheel events

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Video paused | Pause watch-time accumulation |
| User scrolls past quickly | Only count time video was in viewport |
| Premium ad overlay | Detect and skip score increment |

## Instagram Reels Adapter

### Score Model (Swipe-Based, Same as Shorts)

```typescript
function computeReelsCookedScore(
  previousScore: number,
  swipes: number,
  vibeIntent: VibeIntent,
  idleMs: number
): number {
  if (swipes > 0) {
    return Math.max(0, Math.min(100, previousScore + swipes));
  }
  const decayThreshold = vibeIntent === "Chill" || vibeIntent === "Laugh" ? 15000 : 20000;
  if (idleMs < decayThreshold) return previousScore;
  if (idleMs < 60000) return Math.max(0, previousScore - 1);
  return Math.max(0, previousScore - 3);
}
```

### DOM Observation

- Reels container: `div[role="presentation"]`
- Video element: `video`
- Reel item: `div[role="presentation"] > div > div`

### URL Patterns

| Route | Description |
|-------|-------------|
| `/reels/` | User's reels feed |
| `/reel/{id}` | Single reel view |
| `/explore/reels/` | Explore reels tab |

### Edge Cases

| Scenario | Handling |
|----------|----------|
| SPA navigation | MutationObserver on `document.body` for URL changes |
| Story overlay open | Pause score increment |
| Reel auto-loop | Don't double-count same reel position |

## Manifest Changes

```json
{
  "content_scripts": [
    // ... existing ...
    {
      "matches": ["*://*.instagram.com/reels/*", "*://*.instagram.com/reel/*"],
      "js": ["src/content/inject-instagram.js"]
    },
    {
      "matches": ["*://*.tiktok.com/*"],
      "exclude_matches": ["*://*.tiktok.com/trending*", "*://*.tiktok.com/@*"],
      "js": ["src/content/inject-tiktok.js"]
    }
  ],
  "host_permissions": [
    // ... existing ...
    "*://*.instagram.com/*",
    "*://*.tiktok.com/*"
  ]
}
```

## Injection Pattern

Each injector handles SPA navigation:

```typescript
const adapter = new TikTokAdapter();
adapter.init();

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    adapter.destroy();
    adapter.init();
  }
}).observe(document.body, { subtree: true, childList: true });
```

## Testing

### Manual Testing Checklist

- [ ] Instagram Reels: Widget appears, score increments on swipe
- [ ] Instagram Reels: SPA navigation between reels and feed works
- [ ] Instagram Reels: Story overlay pauses scoring
- [ ] TikTok: Widget appears, score increments on swipe
- [ ] TikTok: Watch-time accumulates correctly
- [ ] TikTok: Pause/resume works correctly
- [ ] Both: Overlays (intervention, touch grass, vibe check) appear correctly
- [ ] Both: Stats recorded to dashboard

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Instagram/TikTok DOM changes | Multiple selectors as fallback, log warnings on failure |
| TikTok rate limiting | Extension runs client-side only |
| TikTok aggressive caching | Force re-init on URL change |

## Version

Target release: **v1.1.0**
