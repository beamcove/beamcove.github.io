import { ArrowRight } from "lucide";

import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { Section } from "@/app/components/section";
import { SiteLayout } from "@/app/components/site-layout";
import { Statements } from "@/app/components/statements";
import { ValueList } from "@/app/components/value-list";
import { ROUTES, SITE } from "@/content/site";
import { STORY, STORY_MARK } from "@/content/values";
import { Badge, type Chapter } from "@/design-system";

const CREW = [{ initials: "YD", name: SITE.founder, role: "Founder" }];

const CHAPTERS: Chapter[] = [
    { id: "top", label: "Hello" },
    { id: "story", label: "Story" },
    { id: "mission", label: "Mission" },
    { id: "values", label: "Values" },
    { id: "team", label: "Team" },
];

export function AboutPage() {
    const first = STORY[0] ?? "";
    const at = first.indexOf(STORY_MARK);
    return (
        <SiteLayout chapters={CHAPTERS}>
            <PageHero scene="about" eyebrow="About" title="Hello, we’re Beamcove.">
                Where we came from, where we’re headed, and who’s steering.
            </PageHero>

            <Section id="story" n={1} kicker="Our story" title="How Beamcove started.">
                <p className="lead lead-first">
                    {at < 0 ? (
                        first
                    ) : (
                        <>
                            {first.slice(0, at)}
                            <em className="bc-em">{STORY_MARK}</em>
                            {first.slice(at + STORY_MARK.length)}
                        </>
                    )}
                </p>
                {STORY.slice(1).map((p) => (
                    <p key={p} className="body-text">
                        {p}
                    </p>
                ))}
            </Section>

            <Section id="mission" n={2} kicker="Mission and vision" title="Why Beamcove exists.">
                <Statements />
            </Section>

            <Section
                id="values"
                n={3}
                kicker="Values"
                title="Three rules we keep."
                lead="Three, because we can remember three."
                stacked
            >
                <ValueList />
            </Section>

            <Section id="team" n={4} kicker="Team" title="Who builds it.">
                <ul className="crew">
                    {CREW.map((member) => (
                        <li key={member.name} className="crew-card">
                            <span className="crew-avatar" aria-hidden="true">
                                {member.initials}
                            </span>
                            <div>
                                <h3 className="headline">{member.name}</h3>
                                <p className="caption">{member.role}</p>
                            </div>
                        </li>
                    ))}
                    <li className="crew-card crew-card-open">
                        <Badge>Not hiring yet</Badge>
                        <h3 className="headline">Want to work with us?</h3>
                        <p className="body-text">
                            We’re not hiring yet, but we always enjoy meeting curious people who
                            build with care.
                        </p>
                        <a className="bc-more" href={ROUTES.contact}>
                            Say hello <Icon node={ArrowRight} />
                        </a>
                    </li>
                </ul>
            </Section>
        </SiteLayout>
    );
}
