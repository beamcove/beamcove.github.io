import { Dispatches } from "@/app/components/dispatches";
import { KindGrid } from "@/app/components/kind-grid";
import { PageHero } from "@/app/components/page-hero";
import { RisoArt } from "@/app/components/riso-art";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { Badge, Card } from "@/design-system";

/** The fleet is empty for now: an open shipyard and the kinds of ships it builds. */
export function ProductsPage() {
    return (
        <SiteLayout>
            <PageHero
                tone="overprint"
                eyebrow="Products"
                title="Our products."
                art={<RisoArt name="cove" className="page-splash-art" />}
            >
                Beamcove’s products are in development. Each one will be listed here once it’s
                ready.
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
                        <p className="body-lg muted">
                            Our first products are being built right now. Newsletter subscribers
                            hear about each one first.
                        </p>
                    </Card>
                </div>
            </section>

            <section className="section" id="what-we-build" aria-labelledby="what-we-build-title">
                <div className="container">
                    <SectionHead id="what-we-build" eyebrow="What we build" title="What we build.">
                        Software in three areas: for work, for everyday life, and for play.
                    </SectionHead>
                    <KindGrid />
                </div>
            </section>

            <Dispatches />
        </SiteLayout>
    );
}
