import type { CSSProperties } from "react";

import { MoreLink } from "@/app/components/more-link";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { ROUTES, SITE } from "@/content/site";
import { HORIZONS, MISSION, STORY, VISION } from "@/content/values";
import { Badge, Card } from "@/design-system";

const CREW = [
    {
        initials: "YD",
        name: SITE.founder,
        role: "Founder",
        blurb: "Founded Beamcove to explore what comes next in technology.",
    },
];

export function AboutPage() {
    return (
        <SiteLayout>
            <PageHero tone="tide" eyebrow="About" title="About Beamcove.">
                Beamcove explores new possibilities through software, challenges familiar
                approaches, and turns original ideas into useful digital products.
            </PageHero>

            <section className="section" aria-labelledby="story-title">
                <div className="container story">
                    <div data-reveal>
                        <p className="bc-eyebrow">Our story</p>
                        <h2 className="title-1 section-title" id="story-title">
                            How Beamcove started.
                        </h2>
                    </div>
                    <div className="prose" data-reveal style={{ "--d": 1 } as CSSProperties}>
                        {STORY.map((paragraph, i) => (
                            <p key={paragraph} className={i === 0 ? "body-lg" : undefined}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="bearing-title">
                <div className="container">
                    <SectionHead
                        id="bearing"
                        eyebrow="Mission and vision"
                        title="Why Beamcove exists."
                        more={{ href: ROUTES.values, label: "Read our values" }}
                    >
                        {HORIZONS}
                    </SectionHead>
                    {/* A course on a chart: from where we sail now to where we're headed. */}
                    <ol className="bearing" data-reveal>
                        <li className="bearing-stop">
                            <p className="mono bearing-label">Mission · what we do</p>
                            <p className="bearing-text">{MISSION}</p>
                        </li>
                        <li className="bearing-stop bearing-stop-ahead">
                            <p className="mono bearing-label">Vision · where we’re going</p>
                            <p className="bearing-text">{VISION}</p>
                        </li>
                    </ol>
                </div>
            </section>

            <section className="section" aria-labelledby="crew-title">
                <div className="container">
                    <SectionHead id="crew" eyebrow="Team" title="The team." />
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
                                    <Badge>Not hiring yet</Badge>
                                    <h3 className="headline crew-open-title">
                                        Want to work with us?
                                    </h3>
                                    <p className="muted crew-blurb">
                                        We’re not hiring yet, but we like meeting curious people who
                                        build with care.
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
