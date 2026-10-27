import type { CSSProperties } from "react";
import { Sparkles } from "lucide";

import { Dispatches } from "@/app/components/dispatches";
import { Icon } from "@/app/components/icon";
import { KIND_ICONS } from "@/app/components/kind-icons";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { KINDS } from "@/content/fleet";
import { Badge, Card } from "@/design-system";

/** The fleet is empty for now: an open shipyard and the kinds of ships it builds. */
export function FleetPage() {
    return (
        <SiteLayout>
            <PageHero tone="overprint" eyebrow="The fleet" title="The shipyard is open.">
                Nothing has left the harbor yet. When the first ship is ready to be seen, it’ll be
                listed here.
            </PageHero>

            <section className="section section-tight" aria-labelledby="ships-title">
                <div className="container">
                    <h2 className="visually-hidden" id="ships-title">
                        Ships
                    </h2>
                    <Card variant="plain" className="shipyard-empty" data-reveal>
                        <Badge tone="beam" dot>
                            In the shipyard
                        </Badge>
                        <p className="title-2">No ships at sea yet.</p>
                        <p className="body-lg muted">
                            Projects are being built in the cove right now. Each one joins the fleet
                            once it’s ready, and dispatches hear about it first.
                        </p>
                    </Card>
                </div>
            </section>

            <section className="section" id="kinds" aria-labelledby="kinds-title">
                <div className="container">
                    <SectionHead id="kinds" eyebrow="What we build" title="Three kinds of voyage.">
                        The color on each card is the ink we print that kind of ship in.
                    </SectionHead>
                    <ul className="kind-grid">
                        {KINDS.map((kind, i) => (
                            <li key={kind.title} data-reveal style={{ "--d": i } as CSSProperties}>
                                <Card tone={kind.tone} className="kind-card">
                                    <span className="icon-tile">
                                        <Icon node={KIND_ICONS[i] ?? Sparkles} size={20} />
                                    </span>
                                    <h3 className="bc-card-title">{kind.title}</h3>
                                    <p className="bc-card-body">{kind.more}</p>
                                </Card>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <Dispatches />
        </SiteLayout>
    );
}
