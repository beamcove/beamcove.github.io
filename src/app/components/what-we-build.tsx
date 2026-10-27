import type { CSSProperties } from "react";
import { Compass, Sparkles, Wrench, type IconNode } from "lucide";

import { Icon } from "@/app/components/icon";
import { SectionHead } from "@/app/components/section-head";
import { Badge, Card, type SplashTone } from "@/design-system";

// The band tone marks the kind of venture; the fleet reuses it.
const KINDS: { tone: SplashTone; icon: IconNode; title: string; body: string; tag: string }[] = [
    {
        tone: "tide",
        icon: Compass,
        title: "Apps for daily life",
        body: "Calm, useful mobile apps that help you find your way through the everyday.",
        tag: "Mobile",
    },
    {
        tone: "overprint",
        icon: Wrench,
        title: "Tools for lighter work",
        body: "Dependable software that clears away busywork, so you can get on with the part you care about.",
        tag: "Desktop and web",
    },
    {
        tone: "flare",
        icon: Sparkles,
        title: "Other bounties",
        body: "Experiments, curiosities and side quests we chart as we go.",
        tag: "Anything goes",
    },
];

export function WhatWeBuild() {
    return (
        <section className="section" id="build" aria-labelledby="build-title">
            <div className="container">
                <SectionHead id="build" eyebrow="What we build" title="One cove, many ships.">
                    We make small, well-made software: things you keep in your pocket, things that
                    lighten your work, and things we build because they are fun.
                </SectionHead>
                <ul className="kind-grid">
                    {KINDS.map((kind, i) => (
                        <li key={kind.title} data-reveal style={{ "--d": i } as CSSProperties}>
                            <Card
                                tone={kind.tone}
                                className="kind-card"
                                footer={<Badge>{kind.tag}</Badge>}
                            >
                                <span className="icon-tile">
                                    <Icon node={kind.icon} size={20} />
                                </span>
                                <h3 className="bc-card-title">{kind.title}</h3>
                                <p className="bc-card-body">{kind.body}</p>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
