import type { SplashTone } from "@/design-system";

export type ShipStatus = "launched" | "shipyard" | "drawing-board";

export interface Ship {
    id: string;
    code: string;
    name: string;
    kind: "App" | "Tool" | "Bounty";
    status: ShipStatus;
    /** How close it is to sailing, 0–100. */
    readiness: number;
    summary: string;
    story: string[];
    notes: string[];
}

export const STATUS_LABEL: Record<ShipStatus, string> = {
    launched: "Launched",
    shipyard: "In the shipyard",
    "drawing-board": "On the drawing board",
};

export const SHIPS: Ship[] = [
    {
        id: "caskade",
        code: "BC-001",
        name: "Caskade",
        kind: "Tool",
        status: "shipyard",
        readiness: 72,
        summary:
            "A tool that makes everyday work lighter. We’re putting the final coat of paint on the hull.",
        story: [
            "Caskade is our first ship: a tool for the small, repetitive jobs that quietly eat a working day.",
            "It’s built to be fast to open, quiet to use and easy to leave alone once it’s set up. We’re sanding the last rough edges now.",
        ],
        notes: [
            "Works the way you already work, without a new system to learn",
            "Fast to open and quiet while it runs",
            "Your data stays yours, with nothing collected that a feature doesn’t need",
        ],
    },
    {
        id: "bc-002",
        code: "BC-002",
        name: "An app for daily life",
        kind: "App",
        status: "drawing-board",
        readiness: 12,
        summary: "Still a sketch on the chart table. It gets a name once it floats.",
        story: [
            "Our second ship is a mobile app for the everyday. It’s early: a handful of sketches and a problem we keep coming back to.",
        ],
        notes: ["Calm by default, with no feeds and no streaks", "Made for one hand, on the go"],
    },
];

export const FLEET_COUNTS = (["launched", "shipyard", "drawing-board"] as const).map((status) => ({
    label: STATUS_LABEL[status],
    value: SHIPS.filter((s) => s.status === status).length,
}));

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
            more: "Small experiments, toys and ideas we want to see exist. Some become ships; some stay in the harbour.",
        },
    ];
