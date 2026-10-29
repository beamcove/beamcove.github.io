import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { SITE } from "./src/content/identity.ts";

// One HTML file per page, so every page has a real URL on GitHub Pages
// (beamcove.com/about/ → dist/about/index.html). 404.html is served by Pages
// for any missing path.
const PAGES = ["products", "about", "updates", "contact", "brand", "privacy", "terms"];

/**
 * Fills %SITE_…% placeholders in every HTML file (pages and the social card
 * source in scripts/) from SITE, so the tagline and summary live in one place.
 * An unknown placeholder fails the build rather than shipping as text.
 */
function siteCopy(): Plugin {
    const values: Record<string, string> = {
        SITE_TAGLINE: SITE.tagline,
        SITE_TAGLINE_PLAIN: SITE.tagline.replace(/\.$/, ""),
        SITE_SUMMARY: SITE.summary,
    };
    const escape = (text: string) =>
        text
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    return {
        name: "site-copy",
        transformIndexHtml: {
            order: "pre",
            handler: (html, { filename }) =>
                html.replace(/%(SITE_[A-Z_]+)%/g, (token, key: string) => {
                    const value = values[key];
                    if (value === undefined) {
                        throw new Error(`Unknown placeholder ${token} in ${filename}`);
                    }
                    return escape(value);
                }),
        },
    };
}

export default defineConfig({
    plugins: [react(), tsconfigPaths(), siteCopy()],
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
