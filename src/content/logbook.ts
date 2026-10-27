export interface LogEntry {
    /** ISO date, or null for something in progress right now. */
    date: string | null;
    tag: "Fleet" | "Studio" | "Site" | "Design";
    title: string;
    body: string;
}

/** Newest first. Dates come from the company's own records and git history. */
export const LOGBOOK: LogEntry[] = [
    {
        date: "2026-10-27",
        tag: "Site",
        title: "The site grows into a harbor",
        body: "beamcove.com gets pages of its own: about, our values, this logbook, and plain-language privacy and terms.",
    },
    {
        date: "2026-10-27",
        tag: "Design",
        title: "Ink & tide comes off the press",
        body: "Version 1 of our design system: riso paper, two inks and a fitted dot grid. This site is its first print.",
    },
    {
        date: "2026-03-19",
        tag: "Site",
        title: "A new landing page",
        body: "The first proper home for the studio, with our values and a way to get dispatches.",
    },
    {
        date: "2026-01-31",
        tag: "Site",
        title: "beamcove.com points home",
        body: "The cove gets its address, and a first page goes up.",
    },
    {
        date: "2026-01-22",
        tag: "Studio",
        title: "The first plank",
        body: "The Beamcove repository is laid down, along with a lot of plans.",
    },
    {
        date: "2026-01-12",
        tag: "Studio",
        title: "Beamcove LLC is formed",
        body: "Beamcove becomes a company, registered in Georgia, USA, and founded by Yoan Dubuc.",
    },
];
