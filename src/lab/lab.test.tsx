import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";

import { LAB_ROUTES, ROUTES } from "@/content/site";
import { BentoSite } from "@/lab/bento/bento-site";
import { CinemaSite } from "@/lab/cinema/cinema-site";
import { EditorialSite } from "@/lab/editorial/editorial-site";
import { GridSite } from "@/lab/grid/grid-site";
import { LabIndexPage } from "@/lab/lab-index";
import { PosterSite } from "@/lab/poster/poster-site";

const SITES: [string, () => ReactElement][] = [
    [LAB_ROUTES.lab, () => <LabIndexPage />],
    [LAB_ROUTES.editorial, () => <EditorialSite />],
    [LAB_ROUTES.grid, () => <GridSite />],
    [LAB_ROUTES.bento, () => <BentoSite />],
    [LAB_ROUTES.cinema, () => <CinemaSite />],
    [LAB_ROUTES.poster, () => <PosterSite />],
];

const KNOWN = [...Object.values(ROUTES), ...Object.values(LAB_ROUTES)] as string[];

describe.each(SITES)("%s", (route, renderSite) => {
    it("has exactly one h1", () => {
        render(renderSite());
        expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });

    it("lists no projects (none are public yet)", () => {
        const { container } = render(renderSite());
        expect(container.textContent).not.toMatch(/caskade|BC-\d{3}|ready to sail/i);
    });

    it("links only to pages that exist, and to its own sections", () => {
        const { container } = render(renderSite());
        const own = new Set([...container.querySelectorAll("[id]")].map((el) => el.id));
        for (const a of container.querySelectorAll("a[href]")) {
            const href = a.getAttribute("href")!;
            if (/^(https?:|mailto:)/.test(href)) continue;
            if (href.startsWith("#")) {
                expect(own.has(href.slice(1)), href).toBe(true);
                continue;
            }
            expect(KNOWN, href).toContain(href.split("#")[0]);
        }
    });

    if (route !== LAB_ROUTES.lab) {
        it("has the lab bar", () => {
            render(renderSite());
            expect(screen.getByRole("navigation", { name: "Lab sites" })).toBeInTheDocument();
        });
    }
});
