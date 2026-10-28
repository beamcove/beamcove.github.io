import type { RisoArtName } from "@/app/components/riso-art";
import type { SplashTone } from "@/design-system";

/**
 * The fleet is empty for now: no project is ready to be listed publicly.
 * When one is, add it here and give the fleet page a list again.
 */
/** `art` picks the card's riso composition (see RisoArt). */
export const KINDS: { tone: SplashTone; art: RisoArtName; title: string; body: string }[] = [
    {
        tone: "overprint",
        art: "work",
        title: "Better ways to work",
        body: "Software that rethinks how work gets done, so it feels lighter and goes further.",
    },
    {
        tone: "tide",
        art: "live",
        title: "Better ways to live",
        body: "Ideas that make daily life a little easier, and a little more interesting.",
    },
    {
        tone: "flare",
        art: "play",
        title: "Better ways to play",
        body: "Playful ideas and new kinds of fun, charted for the joy of discovery.",
    },
];
