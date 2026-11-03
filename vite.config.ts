import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { SITE } from "./src/content/identity.ts";

// One HTML file per page, so every page has a real URL on GitHub Pages
// (beamcove.com/about/ → dist/about/index.html). 404.html is served by Pages
// for any missing path.
const PAGES = ["projects", "about", "updates", "contact", "brand", "design", "privacy", "terms"];

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

/**
 * Speeds up first paint: inlines public/boot.js (a blocking script, so a
 * whole round trip before anything renders), and preloads the two fonts so
 * text renders in its own face from the start instead of swapping late.
 */
function fastHead(): Plugin {
    const boot = readFileSync(resolve(import.meta.dirname, "public/boot.js"), "utf8").trim();
    return {
        name: "fast-head",
        transformIndexHtml: {
            order: "post",
            handler: (html, ctx) => {
                const out = html.replace(
                    '<script src="/boot.js"></script>',
                    () => `<script>${boot}</script>`,
                );
                const fonts = Object.keys(ctx.bundle ?? {}).filter((f) => f.endsWith(".woff2"));
                return {
                    html: out,
                    tags: fonts.map((f) => ({
                        tag: "link",
                        attrs: {
                            rel: "preload",
                            as: "font",
                            type: "font/woff2",
                            href: `/${f}`,
                            crossorigin: "",
                        },
                        injectTo: "head" as const,
                    })),
                };
            },
        },
    };
}

export default defineConfig({
    plugins: [react(), tsconfigPaths(), siteCopy(), fastHead()],
    // No SPA fallback in dev: unknown paths 404 like they will on Pages.
    appType: "mpa",
    build: {
        // Matches tsconfig.app.json's target (modern evergreens, Safari 16+);
        // drop to "es2020" if pre-2023 browser support is required.
        target: "es2022",
        // Emits .map files without referencing them from the bundle — uploadable
        // to an error tracker without exposing source publicly.
        sourcemap: "hidden",
        // modern browsers preload modules natively; the polyfill would be one more request
        modulePreload: { polyfill: false },
        rollupOptions: {
            input: {
                home: resolve(import.meta.dirname, "index.html"),
                "not-found": resolve(import.meta.dirname, "404.html"),
                ...Object.fromEntries(
                    PAGES.map((page) => [page, resolve(import.meta.dirname, page, "index.html")]),
                ),
            },
            // merge the many tiny shared chunks: fewer requests, each a round trip on a slow phone
            output: {
                experimentalMinChunkSize: 12_000,
                // three layers: React (changes rarely, so it stays cached across deploys), the
                // shared site code, and each page's own small chunk
                manualChunks: (id) =>
                    /node_modules\/(react|react-dom|scheduler)\//.test(id)
                        ? "react"
                        : /\/src\/(app|design-system|content)\/|node_modules\/lucide\//.test(id)
                          ? "site"
                          : undefined,
            },
        },
    },
});
