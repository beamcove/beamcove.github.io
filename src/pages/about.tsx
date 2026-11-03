import { ArrowRight } from "lucide";

import { ChapterHead } from "@/app/components/chapter-head";
import { Icon } from "@/app/components/icon";
import { Manifesto } from "@/app/components/manifesto";
import { PageHero } from "@/app/components/page-hero";
import { Scene } from "@/app/components/scene";
import { SiteLayout } from "@/app/components/site-layout";
import { Story } from "@/app/components/story";
import { Values } from "@/app/components/values";
import { ROUTES, SITE } from "@/content/site";
import { Badge, type Chapter } from "@/design-system";

const CREW = [{ initials: "YD", name: SITE.founder, role: "Founder" }];

const CHAPTERS: Chapter[] = [
    { id: "top", label: "Hello" },
    { id: "story", label: "Story" },
    { id: "values", label: "Values" },
    { id: "team", label: "Team" },
];

export function AboutPage() {
    return (
        <SiteLayout chapters={CHAPTERS}>
            <PageHero scene="about" eyebrow="About" title="Hello, we’re Beamcove.">
                Where we came from, where we’re headed, and who’s steering.
            </PageHero>

            <Story n={1} title="How Beamcove started." full />
            <Manifesto />
            <Values n={2} />

            <Scene name="team" id="team" aria-labelledby="team-title">
                <div className="wrap">
                    <div className="copy" data-quiet data-reveal>
                        <ChapterHead id="team" n={3} kicker="Team" title="Who builds it." />
                    </div>
                    <ul className="crew" data-quiet data-reveal>
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
                </div>
            </Scene>
        </SiteLayout>
    );
}
