import { Dispatches } from "@/app/components/dispatches";
import { KindCards } from "@/app/components/kind-cards";
import { PageHero } from "@/app/components/page-hero";
import { Section } from "@/app/components/section";
import { SiteLayout } from "@/app/components/site-layout";
import { Badge } from "@/design-system";

/** The fleet is empty for now: an open shipyard and the directions it's sailing in. */
export function ProjectsPage() {
    return (
        <SiteLayout>
            <PageHero scene="projects" eyebrow="Projects" title="Our projects.">
                Everything we’re working on will show up here when it’s ready, not a day before.
            </PageHero>

            <Section id="ships" kicker="Shipyard" title="No ships at sea yet.">
                <div className="shipyard">
                    <Badge tone="beam" dot>
                        In development
                    </Badge>
                    <p className="lead">
                        The first ones are in the works. Subscribe below and you’ll hear the day one
                        launches.
                    </p>
                </div>
            </Section>

            <Section
                id="what-we-do"
                kicker="What we do"
                title="Where we’re headed."
                lead="Different problems, same care."
                stacked
            >
                <KindCards />
            </Section>

            <Dispatches compact />
        </SiteLayout>
    );
}
