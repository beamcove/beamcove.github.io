import type { SplashTone } from "@/design-system";

/**
 * The fleet is empty for now: no project is ready to be listed publicly.
 * When one is, add it here and give the fleet page a list again.
 */
export const KINDS: { tone: SplashTone; title: string; body: string; tag: string; more: string }[] =
    [
        {
            tone: "tide",
            title: "Apps for daily life",
            body: "Calm, useful mobile apps that help you find your way through the everyday.",
            tag: "Mobile",
            more: "Apps that earn their place on your home screen: quick to open, kind to your attention and useful every day.",
        },
        {
            tone: "overprint",
            title: "Tools for lighter work",
            body: "Dependable software that clears away busywork, so you can get on with the part you care about.",
            tag: "Desktop and web",
            more: "Tools that take a chore off your plate and then get out of the way. Reliable first, clever second.",
        },
        {
            tone: "flare",
            title: "Other bounties",
            body: "Experiments, curiosities and side quests we chart as we go.",
            tag: "Anything goes",
            more: "Small experiments and ideas we want to see exist. Some become ships; some stay in the harbor.",
        },
    ];
