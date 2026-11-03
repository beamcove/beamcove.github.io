import { ChapterHead } from "@/app/components/chapter-head";
import { Dispatches } from "@/app/components/dispatches";
import { PageHero } from "@/app/components/page-hero";
import { Scene } from "@/app/components/scene";
import { SiteLayout } from "@/app/components/site-layout";
import { WhatWeDo } from "@/app/components/what-we-do";
import { Badge } from "@/design-system";

/** The fleet is empty for now: an open shipyard and the directions it's sailing in. */
export function ProjectsPage() {
    return (
        <SiteLayout>
            <PageHero scene="projects" eyebrow="Projects" title="Our projects.">
                Everything we’re working on will show up here when it’s ready, not a day before.
            </PageHero>

            <Scene name="shipyard" aria-labelledby="ships-title">
                <div className="wrap">
                    <div className="copy shipyard" data-quiet data-reveal>
                        <Badge tone="beam" dot>
                            In development
                        </Badge>
                        <ChapterHead id="ships" kicker="Shipyard" title="No ships at sea yet.">
                            The first ones are in the works. Subscribe below and you’ll hear the day
                            one launches.
                        </ChapterHead>
                    </div>
                </div>
            </Scene>

            <WhatWeDo title="Where we’re headed." more={false} />
            <Dispatches />
        </SiteLayout>
    );
}
