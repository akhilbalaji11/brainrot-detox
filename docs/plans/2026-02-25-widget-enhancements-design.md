# Widget Enhancements Design

**Date:** 2026-02-25
**Status:** Approved

## Overview

Three enhancements to the Brainrot Detox extension:
1. Movable widget on screen edges
2. Adaptive update timer
3. Dark mode support

---

## Feature 1: Movable Widget

### Goal
Allow users to drag the widget to reposition it along either the left or right edge of the screen, with per-site position persistence.

### Behavior
- Drag anywhere on widget to reposition
- Automatically snaps to nearest edge (left or right) when released
- Vertical position is preserved exactly where dropped
- Position remembered per-site (YouTube, Instagram, TikTok, Reddit, Shorts)

### Data Structure

```typescript
// In types.ts
type WidgetPosition = {
  edge: 'left' | 'right';
  verticalOffset: number; // pixels from bottom
};

// In storage.ts - add to schema
widgetPositions: Record<SiteKey, WidgetPosition>
```

### Implementation
- Add drag event handlers (mousedown, mousemove, mouseup + touch equivalents) to widget in `overlay-manager.ts`
- On drag end, calculate nearest edge and snap to it while preserving vertical position
- Store position per-site in Chrome storage
- Apply position via CSS `top/bottom` and `left/right` based on edge
- Default: `{ edge: 'right', verticalOffset: 20 }`

### Files Changed
- `src/core/types.ts` - Add WidgetPosition type
- `src/core/storage.ts` - Add widgetPositions to schema
- `src/content/overlays/overlay-manager.ts` - Drag handling, position loading

---

## Feature 2: Adaptive Timer

### Goal
Make the widget update faster when the user is actively scrolling, but stay efficient when idle.

### Behavior
- Use 500ms interval when user activity detected within last 2 seconds
- Switch to 3000ms interval after 2 seconds of idle
- Activity includes: scroll, swipe, keypress, wheel events

### Constants

```typescript
// In constants.ts
TICK_FAST_MS = 500
TICK_IDLE_MS = 3000
ACTIVITY_THRESHOLD_MS = 2000
```

### Implementation
- Add `lastActivityAt` timestamp tracking in each adapter
- Update timestamp on every scroll, swipe, keypress, and wheel event
- Modify tick loop to check activity and reschedule with appropriate interval
- `base-adapter.ts`: Add activity tracking helper methods
- Each adapter: Update activity timestamp on user interactions

### Files Changed
- `src/core/constants.ts` - Add new constants
- `src/content/adapters/base-adapter.ts` - Activity tracking helpers
- `src/content/adapters/*.ts` - Update activity on interactions

---

## Feature 3: Dark Mode

### Goal
Add dark mode option to dashboard, options page, and widget, controlled via manual toggle.

### Behavior
- Manual toggle in dashboard header and options General tab
- Setting synced across all UI (dashboard, options, widget)
- Widget on content pages follows the same setting

### Color Palette

```css
:root[data-theme="dark"] {
  --background: #1a1a1a;      /* Dark charcoal */
  --page: #2d2d2d;            /* Dark paper */
  --ink: #e8e0d0;             /* Light cream text */
  --secondary-ink: #a09080;   /* Muted notes */
  --accent-red: #e74c3c;      /* Brighter red for contrast */
  --accent-purple: #a855f7;   /* Brighter purple */
  --accent-green: #4ade80;    /* Brighter green */
}
```

### Data Structure

```typescript
// In storage.ts - add to ExtensionSettings
theme: 'light' | 'dark'  // default: 'light'
```

### Implementation
1. **storage.ts**: Add `theme` to `ExtensionSettings` with default `'light'`
2. **options.ts**: Add theme toggle switch in General tab
3. **options.css / dashboard.css**: Add dark mode variable overrides under `[data-theme="dark"]`
4. **overlay-manager.ts**: Read theme setting, apply dark class to shadow root

### Files Changed
- `src/core/types.ts` - Add theme type
- `src/core/storage.ts` - Add theme to settings
- `src/options/options.ts` - Theme toggle logic
- `src/options/options.css` - Dark mode styles
- `src/dashboard/dashboard.ts` - Theme toggle logic
- `src/dashboard/dashboard.css` - Dark mode styles
- `src/content/overlays/overlay-manager.ts` - Apply theme to widget

---

## Success Criteria

1. Widget can be dragged and snaps to left/right edges, position persists per-site
2. Widget updates at 500ms when active, 3000ms when idle
3. Dark mode toggle works across dashboard, options, and widget
