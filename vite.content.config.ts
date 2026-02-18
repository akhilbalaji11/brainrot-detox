import { resolve } from "path";
import { defineConfig } from "vite";

/**
 * Content script build config.
 *
 * Chrome MV3 content scripts run as CLASSIC scripts, not ES modules.
 * They cannot use `import` statements. This config builds each content
 * script as a fully self-contained IIFE with all dependencies inlined.
 *
 * Run via: vite build --config vite.content.config.ts
 */
export default defineConfig({
    resolve: {
        alias: { "@": resolve(__dirname, "src") },
    },
    build: {
        outDir: "dist",
        emptyOutDir: false, // don't wipe the main build output
        rollupOptions: {
            input: {
                "inject-shorts": resolve(__dirname, "src/content/inject-shorts.ts"),
                "inject-youtube": resolve(__dirname, "src/content/inject-youtube.ts"),
                "inject-reddit": resolve(__dirname, "src/content/inject-reddit.ts"),
            },
            output: {
                format: "iife",
                entryFileNames: "[name].js",
                // Inline everything — no shared chunks allowed for content scripts
                inlineDynamicImports: false,
                manualChunks: undefined,
            },
        },
        minify: true,
    },
});
