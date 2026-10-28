import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// One HTML file per page, so every page has a real URL on GitHub Pages
// (beamcove.com/about/ → dist/about/index.html). 404.html is served by Pages
// for any missing path.
const PAGES = ["products", "about", "values", "updates", "contact", "brand", "privacy", "terms"];

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    // No SPA fallback in dev: unknown paths 404 like they will on Pages.
    appType: "mpa",
    build: {
        // Matches tsconfig.app.json's target (modern evergreens, Safari 16+);
        // drop to "es2020" if pre-2023 browser support is required.
        target: "es2022",
        // Emits .map files without referencing them from the bundle — uploadable
        // to an error tracker without exposing source publicly.
        sourcemap: "hidden",
        rollupOptions: {
            input: {
                home: resolve(import.meta.dirname, "index.html"),
                "not-found": resolve(import.meta.dirname, "404.html"),
                ...Object.fromEntries(
                    PAGES.map((page) => [page, resolve(import.meta.dirname, page, "index.html")]),
                ),
            },
        },
    },
});
