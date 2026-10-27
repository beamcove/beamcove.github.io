import type { CSSProperties } from "react";

import { MoreLink } from "@/app/components/more-link";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { StudioFacts } from "@/app/components/studio-facts";
import { ROUTES, SITE } from "@/content/site";
import { MISSION, STORY, VISION } from "@/content/values";
import { Badge, Card } from "@/design-system";

const CREW = [
    {
        initials: "YD",
        name: SITE.founder,
        role: "Founder",
        blurb: "Sets the course and keeps the horizon in view.",
    },
];

export function AboutPage() {
    return (
        <SiteLayout>
            <PageHero tone="tide" eyebrow="About" title="A safe harbor for promising projects.">
                Beamcove is a home for promising projects to grow into thoughtful digital products.
            </PageHero>

            <section className="section" aria-labelledby="story-title">
                <div className="container story">
                    <div data-reveal>
                        <p className="bc-eyebrow">Our story</p>
                        <h2 className="title-1 section-title" id="story-title">
                            How it started.
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
                <StudioFacts />
            </section>

            <section className="section" aria-labelledby="bearing-title">
                <div className="container">
                    <SectionHead
                        id="bearing"
                        eyebrow="Mission and vision"
                        title="Why Beamcove exists."
                        more={{ href: ROUTES.values, label: "Read our values" }}
                    />
                    <div className="bearing-grid">
                        <Card variant="plain" eyebrow="Mission" data-reveal>
                            <p className="title-3">{MISSION}</p>
                        </Card>
                        <Card
                            variant="plain"
                            eyebrow="Vision"
                            data-reveal
                            style={{ "--d": 1 } as CSSProperties}
                        >
                            <p className="title-3">{VISION}</p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="crew-title">
                <div className="container">
                    <SectionHead id="crew" eyebrow="The crew" title="Who’s aboard.">
                        Beamcove is founder-operated for now.
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
                                        There’s no hiring yet, but if you build with care, we’d
                                        still like to hear from you.
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
