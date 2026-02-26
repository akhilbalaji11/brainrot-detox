/**
 * Overlay manager – creates a Shadow DOM host once, then provides
 * methods to show/hide named overlays inside it.
 * All overlay CSS is injected into the shadow root so it can't
 * conflict with the host page.
 */

import { getWidgetPosition, saveWidgetPosition } from "@/core/storage";
import type { SiteKey, WidgetPosition } from "@/core/types";

const HOST_ID = "brd-overlay-host";

let shadowRoot: ShadowRoot | null = null;
let currentSiteKey: SiteKey | null = null;
let currentPosition: WidgetPosition = { edge: "right", verticalOffset: 20 };

function ensureHost(): ShadowRoot {
  if (shadowRoot) return shadowRoot;

  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement("div");
    host.id = HOST_ID;
    host.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;";
    document.documentElement.appendChild(host);
  }

  // Reuse existing shadow root if already attached (SPA re-navigation safety).
  // Calling attachShadow() on an element that already has a shadow root throws.
  if (host.shadowRoot) {
    shadowRoot = host.shadowRoot;
    return shadowRoot;
  }

  shadowRoot = host.attachShadow({ mode: "open" });

  // Inject shared overlay styles
  const style = document.createElement("style");
  style.textContent = OVERLAY_CSS;
  shadowRoot.appendChild(style);

  // @import is not supported inside Shadow DOM <style> tags – inject a <link> instead
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap";
  shadowRoot.appendChild(fontLink);

  // Apply theme
  applyTheme();

  return shadowRoot;
}

export function showOverlay(name: string, html: string): HTMLElement {
  const root = ensureHost();
  // Remove existing overlay with same name
  const existing = root.querySelector(`[data-overlay="${name}"]`);
  if (existing) existing.remove();

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-overlay", name);
  wrapper.innerHTML = html;
  root.appendChild(wrapper);
  return wrapper;
}

/** Update the widget overlay in-place (preserves position and drag handlers) */
export function updateWidgetOverlay(score: number, status: string, packHtml: string): void {
    const root = ensureHost();
    const existing = root.querySelector(`[data-overlay="widget"]`) as HTMLElement;
    if (!existing) return;

    const widget = existing.querySelector('.brd-widget') as HTMLElement;
    if (!widget) return;

    // Get the label based on status
    const getCookedLabel = (status: string) => {
        const labels: Record<string, { emoji: string; label: string }> = {
            "Based": { emoji: "( ._.)", label: "Based" },
            "Medium Cooked": { emoji: "( ◕_◕)", label: "Medium" },
            "Absolutely Cooked": { emoji: "( x_x)", label: "Cooked" }
        };
        return labels[status] || labels["Based"];
    };

    const label = getCookedLabel(status);
    const scoreClass =
        status === "Based" ? "brd-score-based" :
            status === "Medium Cooked" ? "brd-score-medium" : "brd-score-cooked";

    // Update the score element
    const scoreEl = widget.querySelector('.brd-widget-score') as HTMLElement;
    if (scoreEl) {
        scoreEl.textContent = String(score);
        scoreEl.className = `brd-widget-score ${scoreClass}`;
    }

    // Update the emoji
    const emojiEl = widget.querySelector('.brd-widget-emoji') as HTMLElement;
    if (emojiEl) {
        emojiEl.textContent = label.emoji;
    }

    // Update the label
    const labelEl = widget.querySelector('.brd-widget-label') as HTMLElement;
    if (labelEl) {
        labelEl.textContent = label.label;
    }

    // Update pack HTML (remove existing, add new if present)
    const existingPack = widget.querySelector('.brd-pack-bar')?.parentElement;
    if (existingPack) {
        existingPack.remove();
    }
    if (packHtml) {
        widget.insertAdjacentHTML('beforeend', packHtml);
    }
}

export function removeOverlay(name: string) {
  if (!shadowRoot) return;
  const el = shadowRoot.querySelector(`[data-overlay="${name}"]`);
  if (el) el.remove();
}

export function removeAllOverlays() {
  if (!shadowRoot) return;
  shadowRoot.querySelectorAll("[data-overlay]").forEach((el) => el.remove());
}

export function getOverlayRoot(): ShadowRoot {
  return ensureHost();
}

export async function initWidgetPosition(siteKey: SiteKey) {
    currentSiteKey = siteKey;
    currentPosition = await getWidgetPosition(siteKey);
    applyWidgetPosition();
}

function applyWidgetPosition() {
    if (!shadowRoot) return;
    const widget = shadowRoot.querySelector('.brd-widget') as HTMLElement;
    if (!widget) return;

    // Position on the edge (0px) and use verticalOffset for bottom position
    widget.style.right = currentPosition.edge === 'right' ? '0px' : 'auto';
    widget.style.left = currentPosition.edge === 'left' ? '0px' : 'auto';
    widget.style.bottom = `${currentPosition.verticalOffset}px`;
}

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

export function setupWidgetDrag(widget: HTMLElement, siteKey: SiteKey) {
    let isDragging = false;
    let startY = 0;
    let startBottom = 0;
    let currentEdge: 'left' | 'right' = currentPosition.edge;

    const onPointerDown = (e: PointerEvent) => {
        // Don't drag if clicking on interactive elements
        if ((e.target as HTMLElement).closest('button, input, a')) return;

        isDragging = true;
        startY = e.clientY;
        startBottom = window.innerHeight - widget.getBoundingClientRect().bottom;
        currentEdge = currentPosition.edge;

        widget.style.cursor = 'grabbing';
        widget.style.transition = 'none';
        e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;

        const deltaY = startY - e.clientY;
        const newBottom = startBottom + deltaY;

        // Only move vertically, keep on the same edge
        widget.style.left = currentEdge === 'left' ? '0px' : 'auto';
        widget.style.right = currentEdge === 'right' ? '0px' : 'auto';
        widget.style.bottom = `${Math.max(0, Math.min(newBottom, window.innerHeight - 100))}px`;
    };

    const onPointerUp = async (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;

        widget.style.cursor = 'grab';
        widget.style.transition = 'all 0.2s ease';

        // Determine which edge based on pointer position
        const pointerX = e.clientX;
        const windowCenterX = window.innerWidth / 2;
        const newEdge = pointerX < windowCenterX ? 'left' : 'right';

        // Calculate vertical offset from bottom
        const rect = widget.getBoundingClientRect();
        const verticalOffset = Math.max(0, window.innerHeight - rect.bottom);

        // Update position
        currentPosition = {
            edge: newEdge,
            verticalOffset: Math.max(0, verticalOffset)
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

/* ──────────────────────────────────────────────────────── */
/*  Shared CSS for all overlays (injected into shadow DOM)  */
/* ──────────────────────────────────────────────────────── */

const OVERLAY_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Fullscreen backdrop ─────────────────────────── */
  .brd-fullscreen {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(212, 201, 168, 0.92);
    backdrop-filter: blur(4px);
    pointer-events: all;
    z-index: 999999;
    animation: brd-fadeIn 0.25s ease-out;
    font-family: 'Patrick Hand', 'Caveat', cursive, sans-serif;
    color: #3a2e1e;
  }

  /* ── Notebook card ───────────────────────────────── */
  .brd-card {
    background: #fdf8ee;
    border: 3px solid #3a2e1e;
    border-radius: 6px;
    padding: 28px 32px;
    max-width: 420px;
    width: 90vw;
    box-shadow: 6px 6px 0 #3a2e1e;
    pointer-events: all;
    animation: brd-slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    font-family: 'Patrick Hand', 'Caveat', cursive, sans-serif;
    /* Lined paper effect */
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      #c8d8e8 27px,
      #c8d8e8 28px
    );
    background-position: 0 36px;
  }

  .brd-card h2 {
    font-family: 'Caveat', cursive;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #3a2e1e;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-color: #c0392b;
    text-underline-offset: 3px;
  }

  .brd-card p {
    font-family: 'Patrick Hand', cursive;
    font-size: 15px;
    color: #7a6a50;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  /* ── Buttons ─────────────────────────────────────── */
  .brd-btn-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .brd-btn {
    padding: 9px 18px;
    border-radius: 5px;
    border: 2.5px solid #3a2e1e;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Caveat', cursive;
    background: #fdf8ee;
    color: #3a2e1e;
    box-shadow: 2px 2px 0 #3a2e1e;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .brd-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #3a2e1e;
  }

  .brd-btn:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  .brd-btn-primary {
    background: #e8d5f5;
    border-color: #7b2d8b;
    color: #7b2d8b;
    box-shadow: 2px 2px 0 #7b2d8b;
  }
  .brd-btn-primary:hover { box-shadow: 3px 3px 0 #7b2d8b; }

  .brd-btn-success {
    background: #d5f0e0;
    border-color: #2e7d32;
    color: #2e7d32;
    box-shadow: 2px 2px 0 #2e7d32;
  }
  .brd-btn-success:hover { box-shadow: 3px 3px 0 #2e7d32; }

  .brd-btn-ghost {
    background: #fdf8ee;
    color: #7a6a50;
    border-color: #c8b89a;
    box-shadow: 2px 2px 0 #c8b89a;
  }
  .brd-btn-ghost:hover { box-shadow: 3px 3px 0 #c8b89a; }

  .brd-btn-danger {
    background: #fdecea;
    color: #c0392b;
    border-color: #c0392b;
    box-shadow: 2px 2px 0 #c0392b;
  }
  .brd-btn-danger:hover { box-shadow: 3px 3px 0 #c0392b; }

  /* ── Floating widget (cooked meter pill) ─────── */
  .brd-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #fdf8ee;
    border: 2.5px solid #3a2e1e;
    border-radius: 8px;
    box-shadow: 3px 3px 0 #3a2e1e;
    pointer-events: all;
    z-index: 999998;
    font-family: 'Patrick Hand', 'Caveat', cursive, -apple-system, sans-serif;
    animation: brd-slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: default;
    user-select: none;
    transition: all 0.2s ease;
  }

  .brd-widget:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 #3a2e1e;
  }

  .brd-widget-emoji {
    font-size: 13px;
    font-family: 'Caveat', cursive;
    color: #3a2e1e;
    letter-spacing: -0.5px;
    white-space: pre;
  }

  .brd-widget-label {
    font-size: 13px;
    font-weight: 600;
    color: #3a2e1e;
    font-family: 'Patrick Hand', cursive;
  }

  .brd-widget-score {
    font-size: 12px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    min-width: 28px;
    text-align: center;
    font-family: 'Caveat', cursive;
    border: 1.5px solid currentColor;
  }

  .brd-score-based  { background: #e8f5e9; color: #2e7d32; }
  .brd-score-medium { background: #fff3e0; color: #e65100; }
  .brd-score-cooked { background: #fdecea; color: #c0392b; }

  /* ── Pack progress bar ───────────────────────── */
  .brd-pack-bar {
    width: 100%;
    height: 8px;
    background: #e8dcc8;
    border-radius: 0;
    border: 1.5px solid #8a8060;
    margin-top: 8px;
    overflow: hidden;
  }

  .brd-pack-fill {
    height: 100%;
    background: #2e7d32;
    transition: width 0.5s ease;
  }

  /* ── Timer ────────────────────────────────────── */
  .brd-timer {
    font-family: 'Caveat', cursive;
    font-size: 56px;
    font-weight: 700;
    color: #3a2e1e;
    letter-spacing: -2px;
    text-align: center;
    margin: 12px 0;
  }

  /* ── Vibe grid ───────────────────────────────── */
  .brd-vibe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 12px 0;
  }

  .brd-vibe-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    background: #fdf8ee;
    border: 2px solid #3a2e1e;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #3a2e1e;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .brd-vibe-card:hover {
    background: #e8d5f5;
    border-color: #7b2d8b;
    box-shadow: 3px 3px 0 #7b2d8b;
    transform: translate(-1px, -1px);
  }

  .brd-vibe-emoji {
    font-family: 'Caveat', cursive;
    font-size: 18px;
    color: #3a2e1e;
  }

  .brd-vibe-label {
    font-family: 'Patrick Hand', cursive;
    font-size: 11px;
    font-weight: 600;
    color: #7a6a50;
  }

  /* ── Tips ─────────────────────────────────────── */
  .brd-tips {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 12px 0;
  }

  .brd-tip {
    padding: 7px 12px;
    background: #fffde7;
    border: 1.5px dashed #c8b89a;
    border-radius: 4px;
    font-family: 'Patrick Hand', cursive;
    font-size: 13px;
    color: #7a6a50;
  }

  /* ── Video container ─────────────────────────── */
  .brd-video-wrap {
    width: 100%;
    max-width: 480px;
    border: 3px solid #3a2e1e;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 5px 5px 0 #3a2e1e;
  }

  .brd-video-wrap video {
    width: 100%;
    display: block;
  }

  .brd-message {
    font-family: 'Caveat', cursive;
    font-size: 26px;
    font-weight: 700;
    color: #3a2e1e;
    text-align: center;
    margin-bottom: 20px;
    line-height: 1.3;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-color: #c0392b;
    text-underline-offset: 4px;
  }

  /* ── Animations ──────────────────────────────── */
  @keyframes brd-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes brd-slideUp {
    from { opacity: 0; transform: translateY(20px) rotate(-0.5deg); }
    to   { opacity: 1; transform: translateY(0) rotate(0deg); }
  }

  @keyframes brd-slideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes brd-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* ── Zen / Touch Grass slideshow ─────────────────── */
  .brd-zen-bg {
    background: #000;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
  }

  .brd-zen-slide-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }

  .brd-zen-img,
  .brd-zen-webcam {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: brd-zenFade 0.8s ease-in-out;
  }

  .brd-zen-webcam {
    transform: scaleX(-1); /* mirror effect */
  }

  .brd-zen-caption {
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    text-align: center;
    font-family: 'Caveat', cursive;
    font-size: 22px;
    font-weight: 700;
    color: rgba(255,255,255,0.95);
    letter-spacing: 0.05em;
    text-shadow: 0 2px 12px rgba(0,0,0,0.9);
    animation: brd-zenFade 0.8s ease-in-out;
    pointer-events: none;
  }

  /* Zen sidebar — keep dark so the cat photos pop */
  .brd-zen-card {
    width: 260px;
    flex-shrink: 0;
    background: #fdf8ee;
    border-left: 3px solid #3a2e1e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px 20px;
    gap: 12px;
    pointer-events: all;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      #c8d8e8 27px,
      #c8d8e8 28px
    );
    background-position: 0 20px;
  }

  .brd-zen-header {
    font-family: 'Caveat', cursive;
    font-size: 16px;
    font-weight: 700;
    color: #2e7d32;
    letter-spacing: 0.05em;
    text-align: center;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-color: #2e7d32;
    text-underline-offset: 3px;
  }

  @keyframes brd-zenFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

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
`;

