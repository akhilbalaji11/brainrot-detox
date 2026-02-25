/**
 * build-content-scripts.mjs
 *
 * Builds each content script as a fully self-contained IIFE bundle.
 * Chrome MV3 content scripts run as classic scripts and cannot use
 * ES module `import` statements — they fail silently if they do.
 *
 * Vite's lib mode supports IIFE but only for a single entry at a time,
 * so we loop and call build() once per content script.
 *
 * Usage: node scripts/build-content-scripts.mjs
 */

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { build } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const entries = [
    { name: "inject-shorts", globalName: "injectShorts", entry: resolve(root, "src/content/inject-shorts.ts") },
    { name: "inject-youtube", globalName: "injectYoutube", entry: resolve(root, "src/content/inject-youtube.ts") },
    { name: "inject-reddit", globalName: "injectReddit", entry: resolve(root, "src/content/inject-reddit.ts") },
    { name: "inject-instagram", globalName: "injectInstagram", entry: resolve(root, "src/content/inject-instagram.ts") },
    { name: "inject-tiktok", globalName: "injectTiktok", entry: resolve(root, "src/content/inject-tiktok.ts") },
];

for (const { name, globalName, entry } of entries) {
    console.log(`\nBuilding ${name} as IIFE...`);
    await build({
        configFile: false,
        root,
        resolve: {
            alias: { "@": resolve(root, "src") },
        },
        build: {
            outDir: resolve(root, "dist"),
            emptyOutDir: false,   // never wipe — main build already ran
            lib: {
                entry,
                name: globalName,   // must be a valid JS identifier for IIFE
                formats: ["iife"],
                fileName: () => `${name}.js`,
            },
            minify: true,
        },
        logLevel: "info",
    });
}

console.log("\n✓ All content scripts built as IIFE bundles.");
