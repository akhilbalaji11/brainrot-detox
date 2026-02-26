import type { StatsState } from "../core/types";

async function init() {
    // Load and apply theme
    const settingsRes = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    const theme = settingsRes?.success && settingsRes.data?.theme ? settingsRes.data.theme : 'light';
    applyTheme(theme);

    const res = await chrome.runtime.sendMessage({ type: "GET_STATS" });
    if (!res?.success) return;
    const stats: StatsState = res.data;

    document.getElementById("statPacks")!.textContent = String(stats.totalPacksCompleted);
    document.getElementById("statGrass")!.textContent = String(stats.totalTouchGrassSessions);
    document.getElementById("statInterventions")!.textContent = String(stats.totalInterventions);
    document.getElementById("statVibes")!.textContent = String(stats.totalVibeChecks);
    document.getElementById("statBypasses")!.textContent = String(stats.totalBypassCount);

    // Share card
    document.getElementById("sharePacks")!.textContent = String(stats.totalPacksCompleted);
    document.getElementById("shareGrass")!.textContent = String(stats.totalTouchGrassSessions);
    document.getElementById("shareInterventions")!.textContent = String(stats.totalInterventions);
}

// Copy recap
document.getElementById("btnCopy")!.addEventListener("click", async () => {
    const packs = document.getElementById("sharePacks")!.textContent;
    const grass = document.getElementById("shareGrass")!.textContent;
    const interventions = document.getElementById("shareInterventions")!.textContent;

    const text = `My Brainrot Detox Week\n\n${packs} Packs completed\n${grass} Touch Grass sessions\n${interventions} Interventions\n\nno cap, I'm getting better\n\n#BrainrotDetox`;
    await navigator.clipboard.writeText(text);

    const btn = document.getElementById("btnCopy")!;
    btn.textContent = "✅ Copied!";
    setTimeout(() => { btn.textContent = "📋 Copy Recap"; }, 2000);
});

// Options link
document.getElementById("linkOptions")!.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
});

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

document.addEventListener("DOMContentLoaded", init);
