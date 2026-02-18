import { copyFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

// Copy video asset to public so it ends up in dist/assets/
const videoSrc = resolve(__dirname, "src/assets/skyrim-skeleton.mp4");
const publicAssetsDir = resolve(__dirname, "public/assets");
const videoDest = resolve(publicAssetsDir, "skyrim-skeleton.mp4");
if (existsSync(videoSrc) && !existsSync(videoDest)) {
    mkdirSync(publicAssetsDir, { recursive: true });
    copyFileSync(videoSrc, videoDest);
}

// Main build: HTML pages + service worker only.
// Content scripts are built separately via vite.content.config.ts as IIFE bundles,
// because Chrome MV3 content scripts cannot use ES module `import` statements.
export default defineConfig({
    base: '',
    resolve: {
        alias: { "@": resolve(__dirname, "src") },
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, "src/popup/popup.html"),
                options: resolve(__dirname, "src/options/options.html"),
                dashboard: resolve(__dirname, "src/dashboard/dashboard.html"),
                "service-worker": resolve(__dirname, "src/background/service-worker.ts"),
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "chunks/[name]-[hash].js",
                assetFileNames: "assets/[name].[ext]",
            },
        },
    },
    publicDir: "public",
});
