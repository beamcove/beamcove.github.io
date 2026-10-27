import type { SplashTone } from "@/design-system";

/**
 * The fleet is empty for now: no project is ready to be listed publicly.
 * When one is, add it here and give the fleet page a list again.
 */
export const KINDS: { tone: SplashTone; title: string; body: string; more: string }[] = [
    {
        tone: "overprint",
        title: "Better ways to work",
        body: "Dependable software that clears away busywork, so you can get on with the part you care about.",
        more: "Tools that take a chore off your plate and then get out of the way. Reliable first, clever second.",
    },
    {
        tone: "tide",
        title: "Better ways to live",
        body: "Useful apps that help you find your way through the everyday.",
        more: "Apps that earn their place on your home screen: quick to open, kind to your attention and useful every day.",
    },
    {
        tone: "flare",
        title: "Better ways to play",
        body: "Experiments, curiosities and side quests, built for the fun of it.",
        more: "Original ideas we want to see exist, built for the fun of it. Some become ships; some stay in the harbor.",
    },
];
