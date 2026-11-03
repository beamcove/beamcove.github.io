import type { BrandName } from "@/app/components/brand";

export { SITE } from "@/content/identity";

export const ROUTES = {
    home: "/",
    projects: "/projects/",
    about: "/about/",
    updates: "/updates/",
    contact: "/contact/",
    brand: "/brand/",
    design: "/design/",
    privacy: "/privacy/",
    terms: "/terms/",
} as const;

type Route = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * The lab: five versions of this website, each taking the design system in a
 * different direction. Not in the
 * sitemap or the nav; every lab page carries `noindex`.
 */
export const LAB_ROUTES = {
    lab: "/lab/",
    editorial: "/lab/editorial/",
    grid: "/lab/grid/",
    bento: "/lab/bento/",
    cinema: "/lab/cinema/",
    poster: "/lab/poster/",
} as const;

export const NAV: { href: Route; label: string }[] = [
    { href: ROUTES.projects, label: "Projects" },
    { href: ROUTES.about, label: "About" },
    { href: ROUTES.updates, label: "Updates" },
    { href: ROUTES.contact, label: "Contact" },
    { href: ROUTES.design, label: "Design" },
];

export const FOOTER_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
    {
        title: "Company",
        links: [
            { href: ROUTES.about, label: "About" },
            { href: `${ROUTES.about}#values`, label: "Values" },
            { href: ROUTES.updates, label: "Updates" },
            { href: ROUTES.brand, label: "Brand kit" },
            { href: ROUTES.design, label: "Design system" },
        ],
    },
    {
        title: "Projects",
        links: [
            { href: ROUTES.projects, label: "Projects" },
            { href: `${ROUTES.projects}#what-we-do`, label: "What we do" },
            { href: "/#newsletter", label: "Newsletter" },
        ],
    },
    {
        title: "Help",
        links: [
            { href: ROUTES.contact, label: "Contact" },
            { href: `${ROUTES.contact}#questions`, label: "FAQ" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: ROUTES.privacy, label: "Privacy" },
            { href: ROUTES.terms, label: "Terms" },
        ],
    },
];

export const SOCIALS: { name: BrandName; href: string; label: string; handle: string }[] = [
    { name: "x", href: "https://x.com/beamcove", label: "X", handle: "@beamcove" },
    { name: "github", href: "https://github.com/beamcove", label: "GitHub", handle: "beamcove" },
];

/** "Oct 27, 2026" from "2026-10-27". */
export function formatDate(iso: string) {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
