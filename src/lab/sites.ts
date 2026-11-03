import { LAB_ROUTES } from "@/content/site";

/** The five lab versions of the site, in the order the lab bar steps through them. */
export const LAB_SITES = [
    {
        slug: "editorial",
        name: "Editorial",
        href: LAB_ROUTES.editorial,
        line: "A magazine: oversized type, asymmetric spreads and full-bleed glyph art.",
    },
    {
        slug: "grid",
        name: "Grid",
        href: LAB_ROUTES.grid,
        line: "Swiss and strict: one 12-column grid, black and red, numbers doing the talking.",
    },
    {
        slug: "bento",
        name: "Bento",
        href: LAB_ROUTES.bento,
        line: "A product launch: tiles of every size, each one a small live demo.",
    },
    {
        slug: "cinema",
        name: "Cinema",
        href: LAB_ROUTES.cinema,
        line: "Dark and scroll-driven: one idea per screen, the glyph field as the camera.",
    },
    {
        slug: "poster",
        name: "Poster",
        href: LAB_ROUTES.poster,
        line: "Loud and joyful: ink blocks, giant glyphs and type set like a gig poster.",
    },
] as const;

export type LabSlug = (typeof LAB_SITES)[number]["slug"];
