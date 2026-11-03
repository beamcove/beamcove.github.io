import type { GlyphArtName } from "@/app/components/glyph-compositions";

/**
 * The fleet is empty for now: no project is ready to be listed publicly.
 * When one is, add it here and give the fleet page a list again.
 */
/** `art` picks the card's glyph composition (see glyph-compositions.ts). */
export const KINDS: { art: GlyphArtName; title: string; body: string }[] = [
    {
        art: "work",
        title: "For work",
        body: "Tools that take work off your plate instead of adding to it, so there’s more time for the parts you enjoy.",
    },
    {
        art: "live",
        title: "For everyday life",
        body: "Small things that make everyday life a little easier, or a little more interesting.",
    },
    {
        art: "play",
        title: "For play",
        body: "New kinds of fun, made for the joy of finding them. No further justification needed.",
    },
];
