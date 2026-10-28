import type { BrandName } from "@/app/components/brand";

export const SITE = {
    name: "Beamcove",
    url: "https://beamcove.com",
    legalName: "Beamcove LLC",
    founder: "Yoan Dubuc",
    tagline: "Charting new horizons in the digital sea.",
    /** Short boilerplate, as approved in the company's About page. */
    summary:
        "Beamcove is an innovation company exploring new possibilities through software, with the ambition to set trends and create better ways to work, live, and play.",
    email: "hello@beamcove.com",
    /** Effective date of the privacy policy and terms (ISO). */
    legalUpdated: "2026-10-27",
};

export const ROUTES = {
    home: "/",
    products: "/products/",
    about: "/about/",
    values: "/values/",
    updates: "/updates/",
    contact: "/contact/",
    brand: "/brand/",
    privacy: "/privacy/",
    terms: "/terms/",
} as const;

type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const NAV: { href: Route; label: string }[] = [
    { href: ROUTES.products, label: "Products" },
    { href: ROUTES.about, label: "About" },
    { href: ROUTES.values, label: "Values" },
    { href: ROUTES.updates, label: "Updates" },
    { href: ROUTES.contact, label: "Contact" },
];

export const FOOTER_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
    {
        title: "Company",
        links: [
            { href: ROUTES.about, label: "About" },
            { href: ROUTES.values, label: "Values" },
            { href: ROUTES.updates, label: "Updates" },
            { href: ROUTES.brand, label: "Brand kit" },
        ],
    },
    {
        title: "Products",
        links: [
            { href: ROUTES.products, label: "Products" },
            { href: `${ROUTES.products}#what-we-build`, label: "What we build" },
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
