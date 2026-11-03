// Runs after `vite build` (see the build script): renders every page to HTML into its
// built file, so text shows before any JavaScript runs; the page's script then takes it
// over (hydrates). Pages are listed in src/prerender.tsx. Usage: node scripts/prerender.mjs [dist]
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { createServer } from "vite";

const dist = process.argv[2] ?? "dist";

/** Every HTML file the build wrote, as paths relative to dist. */
function builtPages(dir) {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return name === "assets" ? [] : builtPages(path);
        return name.endsWith(".html") ? [relative(dist, path)] : [];
    });
}

const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
});
try {
    const { PRERENDER, render } = await vite.ssrLoadModule("/src/prerender.tsx");
    const missing = builtPages(dist).filter((file) => !(file in PRERENDER));
    if (missing.length)
        throw new Error(
            `No prerender entry for ${missing.join(", ")} (add it to src/prerender.tsx)`,
        );
    for (const file of Object.keys(PRERENDER)) {
        const path = join(dist, file);
        const html = readFileSync(path, "utf8");
        const out = html
            .replace('<div id="root"></div>', () => `<div id="root">${render(file)}</div>`)
            // ScrambleText leaves a title that's already on screen as it is
            .replace("<html", "<html data-prerendered");
        if (!out.includes("data-prerendered") || out === html)
            throw new Error(`No empty #root in ${path}`);
        writeFileSync(path, out);
    }
    console.log(`prerendered ${Object.keys(PRERENDER).length} pages`);
} finally {
    await vite.close();
}
