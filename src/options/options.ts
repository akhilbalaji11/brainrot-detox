import type { SettingsState, SiteKey } from "../core/types";

/* ── Tabs ─────────────────────────────────────────────── */

document.querySelectorAll<HTMLButtonElement>(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`panel-${tab.dataset.tab}`)?.classList.add("active");
    });
});

/* ── Range value displays ─────────────────────────────── */

function syncRange(id: string, valId: string) {
    const input = document.getElementById(id) as HTMLInputElement;
    const display = document.getElementById(valId);
    if (input && display) {
        display.textContent = input.value;
        input.addEventListener("input", () => { display.textContent = input.value; });
    }
}
syncRange("threshold", "val-threshold");
syncRange("grassMin", "val-grassMin");
syncRange("vibeInt", "val-vibeInt");

/* ── Load settings ────────────────────────────────────── */

async function loadSettings() {
    const res = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    if (!res?.success) return;
    const s: SettingsState = res.data;

    (document.getElementById("masterEnabled") as HTMLInputElement).checked = s.masterEnabled;
    (document.getElementById("darkMode") as HTMLInputElement).checked = (s.theme ?? 'light') === 'dark';
    (document.getElementById("feat-cookedMeter") as HTMLInputElement).checked = s.sites.youtube.cookedMeter;
    (document.getElementById("feat-snackPacks") as HTMLInputElement).checked = s.sites.youtube.snackPacks;
    (document.getElementById("feat-touchGrass") as HTMLInputElement).checked = s.sites.youtube.touchGrass;
    (document.getElementById("feat-vibeCheck") as HTMLInputElement).checked = s.sites.youtube.vibeCheck;
    (document.getElementById("threshold") as HTMLInputElement).value = String(s.cooked.thresholds.intervention);
    document.getElementById("val-threshold")!.textContent = String(s.cooked.thresholds.intervention);
    (document.getElementById("grassMin") as HTMLInputElement).value = String(s.touchGrass.defaultMinutes);
    document.getElementById("val-grassMin")!.textContent = String(s.touchGrass.defaultMinutes);
    (document.getElementById("vibeInt") as HTMLInputElement).value = String(s.vibeCheck.intervalMinutes);
    document.getElementById("val-vibeInt")!.textContent = String(s.vibeCheck.intervalMinutes);

    // Sites
    document.querySelectorAll<HTMLInputElement>("[data-site]").forEach((el) => {
        const site = el.dataset.site as SiteKey;
        el.checked = s.sites[site]?.enabled ?? true;
    });
}

/* ── Save ─────────────────────────────────────────────── */

document.getElementById("btnSave")!.addEventListener("click", async () => {
    const masterEnabled = (document.getElementById("masterEnabled") as HTMLInputElement).checked;
    const darkMode = (document.getElementById("darkMode") as HTMLInputElement).checked;
    const threshold = parseInt((document.getElementById("threshold") as HTMLInputElement).value, 10);
    const grassMin = parseInt((document.getElementById("grassMin") as HTMLInputElement).value, 10);
    const vibeInt = parseInt((document.getElementById("vibeInt") as HTMLInputElement).value, 10);

    const cookedMeter = (document.getElementById("feat-cookedMeter") as HTMLInputElement).checked;
    const snackPacks = (document.getElementById("feat-snackPacks") as HTMLInputElement).checked;
    const touchGrass = (document.getElementById("feat-touchGrass") as HTMLInputElement).checked;
    const vibeCheck = (document.getElementById("feat-vibeCheck") as HTMLInputElement).checked;

    const siteStates: Partial<Record<SiteKey, any>> = {};
    document.querySelectorAll<HTMLInputElement>("[data-site]").forEach((el) => {
        siteStates[el.dataset.site as SiteKey] = { enabled: el.checked, cookedMeter, snackPacks, touchGrass, vibeCheck };
    });

    await chrome.runtime.sendMessage({
        type: "UPDATE_SETTINGS",
        payload: {
            masterEnabled,
            theme: darkMode ? 'dark' : 'light',
            sites: siteStates,
            cooked: { thresholds: { intervention: threshold } },
            touchGrass: { defaultMinutes: grassMin },
            vibeCheck: { intervalMinutes: vibeInt },
        },
    });

    const msg = document.getElementById("saveMsg")!;
    msg.textContent = "✅ Saved!";
    setTimeout(() => { msg.textContent = ""; }, 2000);
});

/* ── Data buttons ─────────────────────────────────────── */

document.getElementById("btnExport")!.addEventListener("click", async () => {
    const res = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    const statsRes = await chrome.runtime.sendMessage({ type: "GET_STATS" });
    const blob = new Blob([JSON.stringify({ settings: res.data, stats: statsRes.data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "brainrot-detox-export.json"; a.click();
    URL.revokeObjectURL(url);
});

document.getElementById("btnImport")!.addEventListener("click", () => {
    document.getElementById("importFile")!.click();
});

document.getElementById("importFile")!.addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.settings) await chrome.runtime.sendMessage({ type: "UPDATE_SETTINGS", payload: data.settings });
    alert("Data imported!");
    loadSettings();
});

document.getElementById("btnClear")!.addEventListener("click", async () => {
    if (!confirm("Are you sure? This will erase all data.")) return;
    await chrome.storage.local.clear();
    alert("All data cleared.");
    loadSettings();
});

/* ── Init ─────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", loadSettings);
