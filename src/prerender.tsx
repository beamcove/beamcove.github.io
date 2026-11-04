// Every page rendered to HTML at build time (scripts/prerender.mjs runs it after `vite build`),
// so text shows before any JavaScript runs; each page's entry then hydrates it (app/mount.tsx).
// A new page needs a line here too.
import { StrictMode, type ReactNode } from "react";
import { renderToString } from "react-dom/server";

import { AboutPage } from "@/pages/about";
import { BrandPage } from "@/pages/brand";
import { ContactPage } from "@/pages/contact";
import { DesignPage } from "@/pages/design";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import { PrivacyPage } from "@/pages/privacy";
import { ProjectsPage } from "@/pages/projects";
import { TermsPage } from "@/pages/terms";
import { UpdatesPage } from "@/pages/updates";
import { DEBUG, DEBUG_ROUTES } from "@/content/site";

/** Built HTML file → its page, and the path it is served at. */
export const PRERENDER: Record<string, { path: string; page: () => ReactNode }> = {
    "index.html": { path: "/", page: () => <HomePage /> },
    "404.html": { path: "/404.html", page: () => <NotFoundPage /> },
    "about/index.html": { path: "/about/", page: () => <AboutPage /> },
    "brand/index.html": { path: "/brand/", page: () => <BrandPage /> },
    "contact/index.html": { path: "/contact/", page: () => <ContactPage /> },
    "privacy/index.html": { path: "/privacy/", page: () => <PrivacyPage /> },
    "projects/index.html": { path: "/projects/", page: () => <ProjectsPage /> },
    "terms/index.html": { path: "/terms/", page: () => <TermsPage /> },
    "updates/index.html": { path: "/updates/", page: () => <UpdatesPage /> },
    // debug builds only: a production build doesn't build this page at all
    ...(DEBUG
        ? { "design/index.html": { path: DEBUG_ROUTES.design, page: () => <DesignPage /> } }
        : {}),
};

export function render(file: string) {
    const entry = PRERENDER[file];
    if (!entry) throw new Error(`No page for ${file}`);
    (globalThis as { __PAGE_PATH__?: string }).__PAGE_PATH__ = entry.path;
    return renderToString(<StrictMode>{entry.page()}</StrictMode>);
}
