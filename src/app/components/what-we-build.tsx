import type { CSSProperties } from "react";
import { Sparkles } from "lucide";

import { Icon } from "@/app/components/icon";
import { KIND_ICONS } from "@/app/components/kind-icons";
import { SectionHead } from "@/app/components/section-head";
import { KINDS } from "@/content/fleet";
import { ROUTES } from "@/content/site";
import { Badge, Card } from "@/design-system";

export function WhatWeBuild() {
    return (
        <section className="section" id="build" aria-labelledby="build-title">
            <div className="container">
                <SectionHead
                    id="build"
                    eyebrow="What we build"
                    title="One cove, many ships."
                    more={{ href: ROUTES.fleet, label: "See the whole fleet" }}
                >
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
                                    <Icon node={KIND_ICONS[i] ?? Sparkles} size={20} />
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
