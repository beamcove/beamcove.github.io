export interface LogEntry {
    /** ISO date, or null for something in progress right now. */
    date: string | null;
    tag: "Fleet" | "Studio" | "Site" | "Design";
    title: string;
    body: string;
}

/** Newest first. Nothing has launched yet, so the log starts with the site itself. */
export const LOGBOOK: LogEntry[] = [
    {
        date: "2026-10-27",
        tag: "Site",
        title: "A new beamcove.com",
        body: "The website is redesigned on Ink & tide, our new design system, and grows pages of its own: about, values, this logbook, and plain-language privacy and terms.",
    },
];
