import type { CSSProperties } from "react";

import { MoreLink } from "@/app/components/more-link";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { Voyage } from "@/app/components/voyage";
import { SHIPS } from "@/content/fleet";
import { ROUTES } from "@/content/site";
import { Badge, Card, Stat } from "@/design-system";

const CREW = [
    {
        initials: "YD",
        name: "Y. Dubuc",
        role: "Captain",
        blurb: "Sets the course and keeps the horizon in view.",
    },
];

export function AboutPage() {
    return (
        <SiteLayout>
            <PageHero tone="tide" eyebrow="About" title="A small studio with a big map.">
                Beamcove is an independent software studio. We build our own ships, take our time
                with them and keep them sailing.
            </PageHero>

            <section className="section" aria-labelledby="story-title">
                <div className="container story">
                    <div data-reveal>
                        <p className="bc-eyebrow">Our story</p>
                        <h2 className="title-1 section-title" id="story-title">
                            Why a cove?
                        </h2>
                    </div>
                    <div className="prose" data-reveal style={{ "--d": 1 } as CSSProperties}>
                        <p className="body-lg">
                            We started Beamcove in January 2026 with a simple idea: build our own
                            products, give each one the care it deserves, and keep them running for
                            a long time.
                        </p>
                        <p>
                            A cove is a sheltered harbour, the kind of place where ships are built,
                            launched and brought back in for repairs. That’s the studio we want to
                            be. Each product is a ship, and together they’re the fleet.
                        </p>
                        <p>
                            Some ships are apps you carry in your pocket. Some are tools for work.
                            Some are experiments that may never leave the harbour, and that’s fine
                            too. What they share is the craft that goes into them and a little fun
                            along the way.
                        </p>
                    </div>
                </div>
                <div className="container stat-row" data-reveal>
                    <Stat label="Founded" value="2026" caption="In the cove since January" />
                    <Stat
                        label="Ships in the fleet"
                        value={SHIPS.length}
                        caption="One nearly ready to sail"
                    />
                    <Stat label="Crew" value={CREW.length} caption="Small on purpose" />
                </div>
            </section>

            <Voyage id="how-we-work" />

            <section className="section" aria-labelledby="crew-title">
                <div className="container">
                    <SectionHead
                        id="crew"
                        eyebrow="The crew"
                        title="Who’s aboard."
                        more={{ href: ROUTES.values, label: "How we work together" }}
                    >
                        A small crew with a big map. Small enough that everyone knows every ship.
                    </SectionHead>
                    <ul className="crew-grid">
                        {CREW.map((member) => (
                            <li key={member.name} data-reveal>
                                <Card variant="plain" className="crew-card">
                                    <span className="crew-avatar" aria-hidden="true">
                                        {member.initials}
                                    </span>
                                    <div>
                                        <h3 className="headline">{member.name}</h3>
                                        <p className="caption muted">{member.role}</p>
                                        <p className="muted crew-blurb">{member.blurb}</p>
                                    </div>
                                </Card>
                            </li>
                        ))}
                        <li data-reveal style={{ "--d": 1 } as CSSProperties}>
                            <Card variant="plain" className="crew-card crew-card-open">
                                <div>
                                    <Badge>No open roles right now</Badge>
                                    <h3 className="headline crew-open-title">Join the crew</h3>
                                    <p className="muted crew-blurb">
                                        We like meeting people who build with care. When we open a
                                        role, it’ll be in the logbook and in dispatches first.
                                    </p>
                                    <MoreLink href={ROUTES.contact}>Say hello</MoreLink>
                                </div>
                            </Card>
                        </li>
                    </ul>
                </div>
            </section>
        </SiteLayout>
    );
}
