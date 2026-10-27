export const SECTIONS = [
    { href: "#build", label: "What we build", nav: true },
    { href: "#voyage", label: "How we work", nav: true },
    { href: "#fleet", label: "Fleet", nav: true },
    { href: "#principles", label: "Principles", nav: false },
    { href: "#logbook", label: "Logbook", nav: true },
    { href: "#questions", label: "Questions", nav: false },
    { href: "#dispatches", label: "Dispatches", nav: false },
] as const;

export const NAV_LINKS = SECTIONS.filter((s) => s.nav);
