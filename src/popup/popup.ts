import { getCookedLabel } from "../core/cooked-meter";
import type { CookedStatus, SessionState, SettingsState, SiteKey } from "../core/types";

/* ── DOM refs ─────────────────────────────────────────── */
const scoreEmoji = document.getElementById("scoreEmoji")!;
const scoreNumber = document.getElementById("scoreNumber")!;
const scoreLabel = document.getElementById("scoreLabel")!;
const scoreHint = document.getElementById("scoreHint")!;
const ringFill = document.getElementById("ringFill") as SVGCircleElement | null;
const statusPill = document.getElementById("statusPill")!;
const siteName = document.getElementById("siteName")!;
const siteToggle = document.getElementById("siteToggle") as HTMLInputElement;
const btnPack = document.getElementById("btnPack")!;
const btnGrass = document.getElementById("btnGrass")!;
const btnVibe = document.getElementById("btnVibe")!;
const packMenu = document.getElementById("packMenu")!;
const linkOptions = document.getElementById("linkOptions")!;
const linkDashboard = document.getElementById("linkDashboard")!;
const brainrotNotes = document.getElementById("brainrotNotes") as HTMLTextAreaElement;
const notesCount = document.getElementById("notesCount")!;
const btnSaveNotes = document.getElementById("btnSaveNotes")!;
const btnDownloadNotes = document.getElementById("btnDownloadNotes")!;

let currentSite: SiteKey | null = null;
let currentTabId: number | null = null;

/* ── Init ─────────────────────────────────────────────── */

async function init() {
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.url) return;

        currentTabId = tab.id ?? null;
        const url = new URL(tab.url);
        currentSite = getSite(url);

        const siteNames: Record<string, string> = { youtube: "YouTube", shorts: "YouTube Shorts", reddit: "Reddit" };
        if (currentSite) {
            siteName.textContent = siteNames[currentSite] || currentSite;
        } else {
            siteName.textContent = "Not on a supported site";
            siteToggle.disabled = true;
        }

        // Get settings
        const settingsRes = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
        if (settingsRes?.success) {
            const settings: SettingsState = settingsRes.data;
            statusPill.classList.toggle("inactive", !settings.masterEnabled);
            statusPill.querySelector(".status-text")!.textContent = settings.masterEnabled ? "Active" : "Off";
            if (currentSite) {
                siteToggle.checked = settings.sites[currentSite]?.enabled ?? true;
            }
        }

        // Get session for current tab
        if (currentTabId) {
            const sessionRes = await chrome.runtime.sendMessage({ type: "GET_SESSION", payload: { tabId: currentTabId } });
            if (sessionRes?.success && sessionRes.data) {
                updateScore(sessionRes.data);
            }
        }

        setupListeners();
        initNotes();

        // Add SVG gradient definition
        addRingGradient();
    } catch (err) {
        console.error("[brainrot detox popup]", err);
    }
}

function getSite(url: URL): SiteKey | null {
    if (url.hostname === "www.youtube.com") {
        return url.pathname.startsWith("/shorts") ? "shorts" : "youtube";
    }
    if (url.hostname === "www.reddit.com") return "reddit";
    return null;
}

/* ── Update score display ─────────────────────────────── */

function updateScore(session: SessionState) {
    const score = session.cookedScore;
    const status = session.cookedStatus as CookedStatus;
    const label = getCookedLabel(status);

    scoreEmoji.textContent = label.emoji;
    scoreNumber.textContent = String(score);
    scoreLabel.textContent = label.label;
    scoreHint.textContent = label.hint;

    // Ring animation (circumference = 2π * 52 ≈ 326.7)
    if (ringFill) {
        const circumference = 326.7;
        const offset = circumference - (score / 100) * circumference;
        ringFill.style.strokeDashoffset = String(offset);

        // Color the ring based on status (warm tones for light/notebook mode)
        const colors: Record<string, string> = {
            "Based": "#2e7d32",
            "Medium Cooked": "#e65100",
            "Absolutely Cooked": "#c0392b",
        };
        ringFill.style.stroke = colors[status] || "#7b2d8b";
    }
}

/* ── Listeners ────────────────────────────────────────── */

function setupListeners() {
    // Pack button
    btnPack.addEventListener("click", () => {
        packMenu.classList.toggle("hidden");
    });

    // Pack options
    packMenu.querySelectorAll(".pack-opt").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const mode = (btn as HTMLElement).dataset.mode as "items" | "time";
            const value = parseInt((btn as HTMLElement).dataset.value!, 10);
            if (currentTabId) {
                await chrome.tabs.sendMessage(currentTabId, { type: "TRIGGER_PACK", payload: { mode, limit: value } });
            }
            window.close();
        });
    });

    // Touch Grass
    btnGrass.addEventListener("click", async () => {
        if (currentTabId) {
            await chrome.tabs.sendMessage(currentTabId, { type: "TRIGGER_TOUCH_GRASS", payload: { minutes: 5 } });
        }
        window.close();
    });

    // Vibe Check
    btnVibe.addEventListener("click", async () => {
        if (currentTabId) {
            await chrome.tabs.sendMessage(currentTabId, { type: "TRIGGER_VIBE_CHECK" });
        }
        window.close();
    });

    // Site toggle
    siteToggle.addEventListener("change", async () => {
        if (!currentSite) return;
        await chrome.runtime.sendMessage({
            type: "UPDATE_SETTINGS",
            payload: { sites: { [currentSite]: { enabled: siteToggle.checked } } },
        });
    });

    // Options link
    linkOptions.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });

    // Dashboard link
    linkDashboard.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: chrome.runtime.getURL("src/dashboard/dashboard.html") });
    });
}

/* ── Notes ────────────────────────────────────────────── */

const NOTES_KEY = "brainrot_detox_notes";

function initNotes() {
    // Load saved notes
    const saved = localStorage.getItem(NOTES_KEY) ?? "";
    brainrotNotes.value = saved;
    updateNotesCount();

    brainrotNotes.addEventListener("input", () => {
        updateNotesCount();
    });

    btnSaveNotes.addEventListener("click", () => {
        localStorage.setItem(NOTES_KEY, brainrotNotes.value);
        btnSaveNotes.textContent = "saved!";
        setTimeout(() => { btnSaveNotes.textContent = "save"; }, 1500);
    });

    btnDownloadNotes.addEventListener("click", () => {
        const text = brainrotNotes.value || "(no notes yet)";
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "brainrot-notes.txt";
        a.click();
        URL.revokeObjectURL(url);
    });
}

function updateNotesCount() {
    const len = brainrotNotes.value.length;
    notesCount.textContent = `${len} / 2000`;
}

/* ── SVG gradient ─────────────────────────────────────── */

function addRingGradient() {
    const svg = document.querySelector(".ring-svg")!;
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#a78bfa" />
    </linearGradient>
  `;
    svg.prepend(defs);
}

/* ── Go ───────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", init);
