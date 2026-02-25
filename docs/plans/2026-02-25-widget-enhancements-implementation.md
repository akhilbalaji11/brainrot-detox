# Widget Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add movable widget, adaptive timer, and dark mode to the Brainrot Detox extension.

**Architecture:**
- Feature 1: Drag handling in overlay-manager.ts with per-site position storage
- Feature 2: Activity-based interval switching (500ms active, 3000ms idle) in base-adapter
- Feature 3: CSS custom properties for theming with toggle in options/dashboard

**Tech Stack:** TypeScript, Chrome Extension APIs, CSS custom properties, Shadow DOM

---

## Task 1: Add WidgetPosition Type and Theme Type

**Files:**
- Modify: `src/core/types.ts`

**Step 1: Add WidgetPosition type**

Add after line 40 (after `VibeIntent` type):

```typescript
/* ── Widget Position ──────────────────────────────────── */
export interface WidgetPosition {
    edge: 'left' | 'right';
    verticalOffset: number; // pixels from bottom
}

/* ── Theme ────────────────────────────────────────────── */
export type Theme = 'light' | 'dark';
```

**Step 2: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/core/types.ts
git commit -m "feat: add WidgetPosition and Theme types"
```

---

## Task 2: Add Widget Positions Storage and Theme to Settings

**Files:**
- Modify: `src/core/storage.ts`
- Modify: `src/core/constants.ts`

**Step 1: Add default widget position to constants.ts**

Add after line 126 (after `IDLE_DECAY_THRESHOLD_MS`):

```typescript
/* ── Adaptive timer constants ─────────────────────────── */
export const TICK_FAST_MS = 500;
export const TICK_IDLE_MS = 3000;
export const ACTIVITY_THRESHOLD_MS = 2000;

/* ── Default widget position ─────────────────────────── */
export const DEFAULT_WIDGET_POSITION = { edge: 'right' as const, verticalOffset: 20 };
```

**Step 2: Add widgetPositions storage key to storage.ts**

Add after line 6 (after `SESSION_KEY`):

```typescript
const WIDGET_POSITIONS_KEY = "brd_widget_positions";
```

**Step 3: Add widget position getter/setter to storage.ts**

Add after line 76 (after `deleteSession` function):

```typescript
/* ── Widget Positions ─────────────────────────────────── */

export async function getWidgetPositions(): Promise<Record<string, { edge: 'left' | 'right'; verticalOffset: number }>> {
    return get<Record<string, { edge: 'left' | 'right'; verticalOffset: number }>>(WIDGET_POSITIONS_KEY, {});
}

export async function getWidgetPosition(siteKey: string): Promise<{ edge: 'left' | 'right'; verticalOffset: number }> {
    const positions = await getWidgetPositions();
    return positions[siteKey] ?? { edge: 'right', verticalOffset: 20 };
}

export async function saveWidgetPosition(siteKey: string, position: { edge: 'left' | 'right'; verticalOffset: number }): Promise<void> {
    const positions = await getWidgetPositions();
    positions[siteKey] = position;
    await set(WIDGET_POSITIONS_KEY, positions);
}
```

**Step 4: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/core/constants.ts src/core/storage.ts
git commit -m "feat: add widget position storage and adaptive timer constants"
```

---

## Task 3: Add Theme to Settings

**Files:**
- Modify: `src/core/types.ts` (add to SettingsState)
- Modify: `src/core/constants.ts` (add default)
- Modify: `src/core/storage.ts` (no changes needed - uses patchSettings)

**Step 1: Add theme to SettingsState in types.ts**

In the `SettingsState` interface (around line 66-87), add after `vibeCheck` block:

```typescript
    theme: 'light' | 'dark';
```

The full interface should now have theme at the end.

**Step 2: Add theme default to constants.ts**

In `DEFAULT_SETTINGS` (around line 46-73), add after the `vibeCheck` block:

```typescript
    theme: 'light',
```

**Step 3: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/core/types.ts src/core/constants.ts
git commit -m "feat: add theme setting to SettingsState"
```

---

## Task 4: Add Adaptive Timer to BaseAdapter

**Files:**
- Modify: `src/content/adapters/base-adapter.ts`

**Step 1: Update imports**

Change line 1 from:
```typescript
import { DEFAULT_PACK_STATE, DEFAULT_TOUCH_GRASS, TICK_INTERVAL_MS } from "@/core/constants";
```
To:
```typescript
import { DEFAULT_PACK_STATE, DEFAULT_TOUCH_GRASS, TICK_FAST_MS, TICK_IDLE_MS, ACTIVITY_THRESHOLD_MS } from "@/core/constants";
```

**Step 2: Add lastActivityAt property**

Add after line 18 (`protected lastSignalAt = 0;`):

```typescript
    protected lastActivityAt = 0;
```

**Step 3: Replace tick interval setup in init()**

Replace line 70:
```typescript
            this.tickTimer = window.setInterval(() => this.tick(), TICK_INTERVAL_MS);
```
With:
```typescript
            this.lastActivityAt = Date.now();
            this.scheduleNextTick();
```

**Step 4: Add scheduleNextTick method**

Add after the `destroy()` method (around line 85):

```typescript
    /* ── Adaptive tick scheduling ───────────────────────────── */

    protected scheduleNextTick() {
        if (this.tickTimer) clearTimeout(this.tickTimer);

        const now = Date.now();
        const timeSinceActivity = now - this.lastActivityAt;
        const useFastTick = timeSinceActivity < ACTIVITY_THRESHOLD_MS;
        const interval = useFastTick ? TICK_FAST_MS : TICK_IDLE_MS;

        this.tickTimer = window.setTimeout(() => {
            this.tick();
            this.scheduleNextTick();
        }, interval);
    }

    protected recordActivity() {
        this.lastActivityAt = Date.now();
    }
```

**Step 5: Update destroy() to use clearTimeout**

Change line 83 from:
```typescript
        if (this.tickTimer) clearInterval(this.tickTimer);
```
To:
```typescript
        if (this.tickTimer) clearTimeout(this.tickTimer);
```

**Step 6: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 7: Commit**

```bash
git add src/content/adapters/base-adapter.ts
git commit -m "feat: add adaptive timer to base adapter"
```

---

## Task 5: Record Activity in ShortsAdapter

**Files:**
- Modify: `src/content/adapters/shorts-adapter.ts`

**Step 1: Add recordActivity calls to event handlers**

In `onScroll` (line 97), change to:
```typescript
  private onScroll = () => { this.scrollCount++; this.recordActivity(); };
```

In `onWheel` (lines 98-102), change to:
```typescript
  private onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) > 20) {
      this.swipeCount++;
      this.recordActivity();
    }
  };
```

In `onKeyDown` (lines 104-109), change to:
```typescript
  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "j") {
      this.swipeCount++;
      this.itemsSinceLastTick++;
      this.recordActivity();
    }
  };
```

In `touchend` handler (around line 60-66), add `this.recordActivity();` after `this.itemsSinceLastTick++;`:

```typescript
    window.addEventListener("touchend", (e) => {
      const delta = touchStartY - (e.changedTouches[0]?.clientY ?? 0);
      if (Math.abs(delta) > 50) {
        this.swipeCount++;
        this.itemsSinceLastTick++;
        this.recordActivity();
      }
    }, { passive: true });
```

In `watchUrlChanges` (around line 116-121), add `this.recordActivity();` after `this.swipeCount++;`:

```typescript
      if (currentId && currentId !== this.lastVideoId) {
        this.lastVideoId = currentId;
        this.itemsSinceLastTick++;
        this.swipeCount++;
        this.recordActivity();
      }
```

**Step 2: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/content/adapters/shorts-adapter.ts
git commit -m "feat: record activity in shorts adapter"
```

---

## Task 6: Record Activity in Other Adapters

**Files:**
- Modify: `src/content/adapters/youtube-adapter.ts`
- Modify: `src/content/adapters/reddit-adapter.ts`
- Modify: `src/content/adapters/instagram-reels-adapter.ts`
- Modify: `src/content/adapters/tiktok-adapter.ts`

**Step 1: Update youtube-adapter.ts**

Read the file first to understand its structure, then add `this.recordActivity();` to scroll handlers and item tracking.

**Step 2: Update reddit-adapter.ts**

Add `this.recordActivity();` to scroll and item tracking handlers.

**Step 3: Update instagram-reels-adapter.ts**

Add `this.recordActivity();` to wheel, touch, and keyboard handlers.

**Step 4: Update tiktok-adapter.ts**

Add `this.recordActivity();` to wheel, touch, keyboard, and watch time tracking.

**Step 5: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add src/content/adapters/youtube-adapter.ts src/content/adapters/reddit-adapter.ts src/content/adapters/instagram-reels-adapter.ts src/content/adapters/tiktok-adapter.ts
git commit -m "feat: record activity in all adapters"
```

---

## Task 7: Add Drag Handling to Overlay Manager

**Files:**
- Modify: `src/content/overlays/overlay-manager.ts`

**Step 1: Add imports at top**

Add after line 7 (after the comment block):

```typescript
import { getWidgetPosition, saveWidgetPosition } from "@/core/storage";
import type { SiteKey } from "@/core/types";
```

**Step 2: Add current site tracking**

Add after line 10 (`let shadowRoot: ShadowRoot | null = null;`):

```typescript
let currentSiteKey: SiteKey | null = null;
let currentPosition = { edge: 'right' as const, verticalOffset: 20 };
```

**Step 3: Add initialization function**

Add after the `getOverlayRoot()` function (around line 72):

```typescript
export async function initWidgetPosition(siteKey: SiteKey) {
    currentSiteKey = siteKey;
    currentPosition = await getWidgetPosition(siteKey);
    applyWidgetPosition();
}

function applyWidgetPosition() {
    if (!shadowRoot) return;
    const widget = shadowRoot.querySelector('.brd-widget') as HTMLElement;
    if (!widget) return;

    widget.style.right = currentPosition.edge === 'right' ? `${currentPosition.verticalOffset}px` : 'auto';
    widget.style.left = currentPosition.edge === 'left' ? `${currentPosition.verticalOffset}px` : 'auto';
    widget.style.bottom = '20px';
}

export function setupWidgetDrag(widget: HTMLElement, siteKey: SiteKey) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRight = 0;
    let startBottom = 0;

    const onPointerDown = (e: PointerEvent) => {
        // Don't drag if clicking on interactive elements
        if ((e.target as HTMLElement).closest('button, input, a')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startRight = currentPosition.edge === 'right' ? currentPosition.verticalOffset : window.innerWidth - widget.getBoundingClientRect().right;
        startBottom = window.innerHeight - widget.getBoundingClientRect().bottom;

        widget.style.cursor = 'grabbing';
        widget.style.transition = 'none';
        e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;

        const deltaX = startX - e.clientX;
        const deltaY = startY - e.clientY;

        const newRight = startRight + deltaX;
        const newBottom = startBottom + deltaY;

        widget.style.right = `${Math.max(0, newRight)}px`;
        widget.style.left = 'auto';
        widget.style.bottom = `${Math.max(0, newBottom)}px`;
    };

    const onPointerUp = async (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;

        widget.style.cursor = 'grab';
        widget.style.transition = 'all 0.2s ease';

        // Determine which edge is closer
        const rect = widget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const windowCenterX = window.innerWidth / 2;

        const newEdge = centerX < windowCenterX ? 'left' : 'right';
        const newVerticalOffset = newEdge === 'right'
            ? window.innerWidth - rect.right
            : rect.left;

        // Snap to edge
        currentPosition = {
            edge: newEdge,
            verticalOffset: Math.max(0, newVerticalOffset)
        };

        applyWidgetPosition();

        // Save position
        if (currentSiteKey) {
            await saveWidgetPosition(currentSiteKey, currentPosition);
        }
    };

    widget.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    // Set initial cursor
    widget.style.cursor = 'grab';
}
```

**Step 4: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/content/overlays/overlay-manager.ts
git commit -m "feat: add drag handling to overlay manager"
```

---

## Task 8: Update ShortsAdapter to Use Drag and Position

**Files:**
- Modify: `src/content/adapters/shorts-adapter.ts`

**Step 1: Update imports**

Add to imports (line 5):
```typescript
import { initWidgetPosition, setupWidgetDrag } from "../overlays/overlay-manager";
```

**Step 2: Update mountCookedWidget**

Replace the `mountCookedWidget` method (lines 160-162) with:

```typescript
  protected async mountCookedWidget(): Promise<void> {
    await initWidgetPosition(this.site);
    this.updateCookedWidget(this.session.cookedScore, this.session.cookedStatus);
  }
```

**Step 3: Update updateCookedWidget to setup drag**

In `updateCookedWidget` method, after the widget is created (after line 191), add:

```typescript
    // Setup drag handling
    const widget = wrapper.querySelector(".brd-widget") as HTMLElement;
    if (widget) {
      setupWidgetDrag(widget, this.site);
    }
```

And remove the existing click handler (lines 194-198) - we'll handle clicks differently:

Replace:
```typescript
    // Make widget clickable to trigger vibe check
    const widget = wrapper.querySelector(".brd-widget");
    if (widget) {
      (widget as HTMLElement).style.cursor = "pointer";
      (widget as HTMLElement).onclick = () => this.showVibeCheckOverlay();
    }
```

With:
```typescript
    // Setup drag handling (this also sets cursor to grab)
    const widget = wrapper.querySelector(".brd-widget") as HTMLElement;
    if (widget) {
      setupWidgetDrag(widget, this.site);
    }
```

**Step 4: Verify TypeScript compiles**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/content/adapters/shorts-adapter.ts
git commit -m "feat: integrate drag handling in shorts adapter"
```

---

## Task 9: Add Dark Mode CSS Variables

**Files:**
- Modify: `src/options/options.css`
- Modify: `src/dashboard/dashboard.css`
- Modify: `src/content/overlays/overlay-manager.ts`

**Step 1: Add CSS variables to options.css**

Add at the top of the file (after the `@import` line):

```css
:root {
    --bg: #d4c9a8;
    --page: #fdf8ee;
    --ink: #3a2e1e;
    --secondary-ink: #7a6a50;
    --accent-red: #c0392b;
    --accent-purple: #7b2d8b;
    --accent-green: #2e7d32;
    --line-color: #b8c8d8;
    --card-line-color: #e0d8c0;
    --border-muted: #c8b89a;
    --shadow-color: #3a2e1e;
}

:root[data-theme="dark"] {
    --bg: #1a1a1a;
    --page: #2d2d2d;
    --ink: #e8e0d0;
    --secondary-ink: #a09080;
    --accent-red: #e74c3c;
    --accent-purple: #a855f7;
    --accent-green: #4ade80;
    --line-color: #404040;
    --card-line-color: #383838;
    --border-muted: #505050;
    --shadow-color: #000000;
}
```

**Step 2: Replace hardcoded colors in options.css with variables**

Replace all instances of:
- `#d4c9a8` with `var(--bg)`
- `#fdf8ee` with `var(--page)`
- `#3a2e1e` with `var(--ink)`
- `#7a6a50` with `var(--secondary-ink)`
- `#c0392b` with `var(--accent-red)`
- `#7b2d8b` with `var(--accent-purple)`
- `#2e7d32` with `var(--accent-green)`
- `#b8c8d8` with `var(--line-color)`
- `#e0d8c0` with `var(--card-line-color)`
- `#c8b89a` with `var(--border-muted)`

**Step 3: Do the same for dashboard.css**

Add the same CSS variables and replace hardcoded colors.

**Step 4: Commit**

```bash
git add src/options/options.css src/dashboard/dashboard.css
git commit -m "feat: add dark mode CSS variables to options and dashboard"
```

---

## Task 10: Add Dark Mode to Widget (Shadow DOM)

**Files:**
- Modify: `src/content/overlays/overlay-manager.ts`

**Step 1: Add dark mode CSS to OVERLAY_CSS**

Add at the end of the `OVERLAY_CSS` template string (before the closing backtick):

```css
  /* ── Dark mode ──────────────────────────────────── */
  :host(.brd-dark) .brd-fullscreen {
    background: rgba(26, 26, 26, 0.95);
  }

  :host(.brd-dark) .brd-card,
  :host(.brd-dark) .brd-widget {
    background: #2d2d2d;
    border-color: #e8e0d0;
    box-shadow: 3px 3px 0 #000;
  }

  :host(.brd-dark) .brd-card h2,
  :host(.brd-dark) .brd-widget-emoji,
  :host(.brd-dark) .brd-widget-label,
  :host(.brd-dark) .brd-timer,
  :host(.brd-dark) .brd-message {
    color: #e8e0d0;
    text-decoration-color: #e74c3c;
  }

  :host(.brd-dark) .brd-card p {
    color: #a09080;
  }

  :host(.brd-dark) .brd-btn {
    background: #2d2d2d;
    border-color: #e8e0d0;
    color: #e8e0d0;
    box-shadow: 2px 2px 0 #000;
  }

  :host(.brd-dark) .brd-btn-primary {
    background: #3d2850;
    border-color: #a855f7;
    color: #a855f7;
    box-shadow: 2px 2px 0 #a855f7;
  }

  :host(.brd-dark) .brd-btn-success {
    background: #1a3d1a;
    border-color: #4ade80;
    color: #4ade80;
    box-shadow: 2px 2px 0 #4ade80;
  }

  :host(.brd-dark) .brd-btn-danger {
    background: #3d1a1a;
    border-color: #e74c3c;
    color: #e74c3c;
    box-shadow: 2px 2px 0 #e74c3c;
  }

  :host(.brd-dark) .brd-btn-ghost {
    background: #2d2d2d;
    border-color: #505050;
    color: #a09080;
    box-shadow: 2px 2px 0 #505050;
  }

  :host(.brd-dark) .brd-score-based { background: #1a3d1a; color: #4ade80; }
  :host(.brd-dark) .brd-score-medium { background: #3d2a1a; color: #f59e0b; }
  :host(.brd-dark) .brd-score-cooked { background: #3d1a1a; color: #e74c3c; }

  :host(.brd-dark) .brd-pack-bar {
    background: #383838;
    border-color: #505050;
  }

  :host(.brd-dark) .brd-vibe-card {
    background: #2d2d2d;
    border-color: #e8e0d0;
    box-shadow: 2px 2px 0 #000;
  }

  :host(.brd-dark) .brd-vibe-card:hover {
    background: #3d2850;
    border-color: #a855f7;
    box-shadow: 3px 3px 0 #a855f7;
  }

  :host(.brd-dark) .brd-vibe-emoji,
  :host(.brd-dark) .brd-vibe-label {
    color: #a09080;
  }

  :host(.brd-dark) .brd-tip {
    background: #383838;
    border-color: #505050;
    color: #a09080;
  }

  :host(.brd-dark) .brd-zen-card {
    background: #2d2d2d;
    border-left-color: #e8e0d0;
  }

  :host(.brd-dark) .brd-zen-header {
    color: #4ade80;
    text-decoration-color: #4ade80;
  }

  :host(.brd-dark) .brd-video-wrap {
    border-color: #e8e0d0;
    box-shadow: 5px 5px 0 #000;
  }
```

**Step 2: Add theme application function**

Add after `applyWidgetPosition()` function:

```typescript
export async function applyTheme() {
    const res = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    const theme = res?.success && res.data?.theme ? res.data.theme : 'light';

    const host = document.getElementById(HOST_ID);
    if (host) {
        if (theme === 'dark') {
            host.classList.add('brd-dark');
        } else {
            host.classList.remove('brd-dark');
        }
    }
}
```

**Step 3: Call applyTheme in ensureHost**

Add at the end of the `ensureHost()` function, before `return shadowRoot;`:

```typescript
    // Apply theme
    applyTheme();
```

**Step 4: Commit**

```bash
git add src/content/overlays/overlay-manager.ts
git commit -m "feat: add dark mode styles to widget shadow DOM"
```

---

## Task 11: Add Theme Toggle to Options Page

**Files:**
- Modify: `src/options/options.html`
- Modify: `src/options/options.ts`

**Step 1: Add theme toggle to options.html**

In the General tab section (around line 27-33), add after the masterEnabled setting:

```html
                <div class="setting">
                    <label><input type="checkbox" id="darkMode"> <strong>Dark Mode</strong></label>
                    <p class="desc">Switch to dark theme</p>
                </div>
```

**Step 2: Update options.ts to load theme**

In `loadSettings()` function (around line 30-52), add after line 35:

```typescript
    (document.getElementById("darkMode") as HTMLInputElement).checked = (s.theme ?? 'light') === 'dark';
```

**Step 3: Update options.ts to save theme**

In the save click handler (around line 56-86), add after line 60:

```typescript
    const darkMode = (document.getElementById("darkMode") as HTMLInputElement).checked;
```

And add to the payload object (after line 79):

```typescript
            theme: darkMode ? 'dark' : 'light',
```

**Step 4: Commit**

```bash
git add src/options/options.html src/options/options.ts
git commit -m "feat: add theme toggle to options page"
```

---

## Task 12: Add Theme Toggle to Dashboard

**Files:**
- Modify: `src/dashboard/dashboard.html`
- Modify: `src/dashboard/dashboard.ts`
- Modify: `src/dashboard/dashboard.css`

**Step 1: Add theme toggle button to dashboard.html**

In the header section (around line 13-16), add a theme toggle:

```html
        <header class="header">
            <div class="header-row">
                <h1><span>[~]</span> Dashboard</h1>
                <button class="theme-toggle" id="btnTheme" title="Toggle theme">🌙</button>
            </div>
            <p class="subtitle">Your digital wellness insights — all local, all private</p>
        </header>
```

**Step 2: Add styles for theme toggle in dashboard.css**

Add to the CSS:

```css
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.theme-toggle {
    background: var(--page);
    border: 2px solid var(--border-muted);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 2px 2px 0 var(--shadow-color);
}

.theme-toggle:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--shadow-color);
}

:root[data-theme="dark"] .theme-toggle {
    background: var(--page);
    border-color: var(--border-muted);
}
```

**Step 3: Add theme logic to dashboard.ts**

Add to the `init()` function:

```typescript
    // Load and apply theme
    const settingsRes = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    const theme = settingsRes?.success && settingsRes.data?.theme ? settingsRes.data.theme : 'light';
    applyTheme(theme);
```

And add theme functions at the end of the file:

```typescript
function applyTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById("btnTheme");
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Theme toggle
document.getElementById("btnTheme")!.addEventListener("click", async () => {
    const res = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    const currentTheme = res?.success && res.data?.theme ? res.data.theme : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    await chrome.runtime.sendMessage({
        type: "UPDATE_SETTINGS",
        payload: { theme: newTheme }
    });

    applyTheme(newTheme);
});
```

**Step 4: Commit**

```bash
git add src/dashboard/dashboard.html src/dashboard/dashboard.ts src/dashboard/dashboard.css
git commit -m "feat: add theme toggle to dashboard"
```

---

## Task 13: Update Remaining Adapters for Widget Position

**Files:**
- Modify: `src/content/adapters/youtube-adapter.ts`
- Modify: `src/content/adapters/reddit-adapter.ts`
- Modify: `src/content/adapters/instagram-reels-adapter.ts`
- Modify: `src/content/adapters/tiktok-adapter.ts`

**Step 1: Update each adapter to use initWidgetPosition and setupWidgetDrag**

For each adapter:
1. Import `initWidgetPosition, setupWidgetDrag` from overlay-manager
2. Change `mountCookedWidget` to async and call `await initWidgetPosition(this.site)`
3. Add `setupWidgetDrag(widget, this.site)` after creating the widget

**Step 2: Commit**

```bash
git add src/content/adapters/youtube-adapter.ts src/content/adapters/reddit-adapter.ts src/content/adapters/instagram-reels-adapter.ts src/content/adapters/tiktok-adapter.ts
git commit -m "feat: integrate widget position and drag in all adapters"
```

---

## Task 14: Build and Test

**Step 1: Build the extension**

Run: `cd C:\Users\Akhil\PersonalProjects\brainrot-detox && npm run build`
Expected: Build succeeds without errors

**Step 2: Load extension in Chrome**

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

**Step 3: Test features manually**

1. **Movable Widget**: Go to YouTube Shorts, drag the widget, verify it snaps to edges and position persists on reload
2. **Adaptive Timer**: Scroll actively, observe widget updates faster (500ms), stop scrolling, observe it slows down (3000ms)
3. **Dark Mode**: Toggle in options/dashboard, verify theme applies to all pages

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete widget enhancements (movable, adaptive timer, dark mode)"
```

---

## Task 15: Update Options HTML with Missing Sites

**Files:**
- Modify: `src/options/options.html`

**Step 1: Add missing sites to the Sites tab**

In the Sites section (around line 70-75), add:

```html
                <div class="setting"><label><input type="checkbox" data-site="instagram-reels" checked> Instagram Reels</label></div>
                <div class="setting"><label><input type="checkbox" data-site="tiktok" checked> TikTok</label></div>
```

**Step 2: Commit**

```bash
git add src/options/options.html
git commit -m "fix: add Instagram and TikTok to options sites list"
```

---

## Success Criteria Verification

1. **Movable Widget**: Widget can be dragged, snaps to left/right edges, position persists per-site ✓
2. **Adaptive Timer**: Widget updates at 500ms when active, 3000ms when idle ✓
3. **Dark Mode**: Toggle works in options and dashboard, applies to widget ✓
