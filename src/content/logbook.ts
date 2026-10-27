export interface LogEntry {
    /** ISO date, or null for something in progress right now. */
    date: string | null;
    tag: "Fleet" | "Studio" | "Site" | "Design";
    title: string;
    body: string;
}

/** Newest first. Dates come from the studio's own history. */
export const LOGBOOK: LogEntry[] = [
    {
        date: null,
        tag: "Fleet",
        title: "Caskade is in the shipyard",
        body: "Final coat of paint on the hull. Launch news goes out by dispatch first.",
    },
    {
        date: "2026-10-27",
        tag: "Site",
        title: "The site grows into a harbour",
        body: "beamcove.com gets pages of its own: the fleet, our values, this logbook, and plain-language privacy and terms.",
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
        body: "The first proper home for the studio, with the fleet, our values and a way to get dispatches.",
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
];
