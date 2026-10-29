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
        title: "For work",
        body: "Tools that take work off your plate instead of adding to it, so there’s more time for the parts you enjoy.",
    },
    {
        tone: "tide",
        art: "live",
        title: "For everyday life",
        body: "Small things that make everyday life a little easier, or a little more interesting.",
    },
    {
        tone: "flare",
        art: "play",
        title: "For play",
        body: "New kinds of fun, made for the joy of finding them. No further justification needed.",
    },
];
