import { Dispatches } from "@/app/components/dispatches";
import { KindGrid } from "@/app/components/kind-grid";
import { PageHero } from "@/app/components/page-hero";
import { RisoArt } from "@/app/components/riso-art";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { Badge, Card } from "@/design-system";

/** The fleet is empty for now: an open shipyard and the directions it's sailing in. */
export function ProjectsPage() {
    return (
        <SiteLayout>
            <PageHero
                tone="lagoon"
                eyebrow="Projects"
                title="Our projects."
                art={<RisoArt name="projects" className="page-splash-art" />}
            >
                Everything we’re working on will show up here when it’s ready, not a day before.
            </PageHero>

            <section className="section section-tight" aria-labelledby="ships-title">
                <div className="container">
                    <h2 className="visually-hidden" id="ships-title">
                        Ships
                    </h2>
                    <Card variant="plain" className="shipyard-empty" data-reveal>
                        <Badge tone="beam" dot>
                            In development
                        </Badge>
                        <p className="title-2">No ships at sea yet.</p>
                    </Card>
                </div>
            </section>

            <section className="section" id="what-we-do" aria-labelledby="what-we-do-title">
                <div className="container">
                    <SectionHead id="what-we-do" eyebrow="What we do" title="Where we’re headed." />
                    <KindGrid />
                </div>
            </section>

            <Dispatches />
        </SiteLayout>
    );
}
