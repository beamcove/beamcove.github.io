import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";

import { ROUTES, SITE } from "@/content/site";
import { AboutPage } from "@/pages/about";
import { BrandPage } from "@/pages/brand";
import { ContactPage } from "@/pages/contact";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import { PrivacyPage } from "@/pages/privacy";
import { ProjectsPage } from "@/pages/projects";
import { TermsPage } from "@/pages/terms";
import { UpdatesPage } from "@/pages/updates";

const PAGES: [string, () => ReactElement][] = [
    [ROUTES.home, () => <HomePage />],
    [ROUTES.projects, () => <ProjectsPage />],
    [ROUTES.about, () => <AboutPage />],
    [ROUTES.updates, () => <UpdatesPage />],
    [ROUTES.contact, () => <ContactPage />],
    [ROUTES.brand, () => <BrandPage />],
    [ROUTES.privacy, () => <PrivacyPage />],
    [ROUTES.terms, () => <TermsPage />],
    ["/404.html", () => <NotFoundPage />],
];

/** Ids present on each route, for checking `/page/#id` links. */
function idsOn(route: string) {
    const page = PAGES.find(([path]) => path === route);
    if (!page) return null;
    const { container, unmount } = render(page[1]());
    const ids = new Set([...container.querySelectorAll("[id]")].map((el) => el.id));
    unmount();
    return ids;
}

describe.each(PAGES)("%s", (_route, renderPage) => {
    it("has exactly one h1", () => {
        render(renderPage());
        expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });

    it("lists no projects (none are public yet)", () => {
        const { container } = render(renderPage());
        expect(container.textContent).not.toMatch(/caskade|BC-\d{3}|ready to sail/i);
    });

    it("only links to pages and sections that exist", () => {
        const { container } = render(renderPage());
        const own = new Set([...container.querySelectorAll("[id]")].map((el) => el.id));
        const hrefs = [...container.querySelectorAll("a[href]")].map(
            (a) => a.getAttribute("href")!,
        );

        for (const href of new Set(hrefs)) {
            if (/^(https?:|mailto:)/.test(href)) continue;
            if (href.startsWith("#")) {
                expect(own.has(href.slice(1)), href).toBe(true);
                continue;
            }
            const [path = "", hash] = href.split("#");
            expect(Object.values(ROUTES) as string[], href).toContain(path);
            if (hash) expect(idsOn(path)?.has(hash), href).toBe(true);
        }
    });
});

describe("HomePage", () => {
    it("summarises every section and links to the full pages", () => {
        render(<HomePage />);
        expect(screen.getByRole("heading", { level: 1, name: SITE.tagline })).toBeInTheDocument();
        for (const name of [/see our projects/i, /more about beamcove/i, /see all questions/i]) {
            expect(screen.getByRole("link", { name })).toBeInTheDocument();
        }
    });
});

describe("UpdatesPage", () => {
    it("dates entries the house way", () => {
        render(<UpdatesPage />);
        expect(screen.getAllByText("Oct 27, 2026")[0]).toHaveAttribute("datetime", "2026-10-27");
    });
});
