import type { CSSProperties } from "react";
import { Sparkles } from "lucide";

import { Dispatches } from "@/app/components/dispatches";
import { FleetLog, StatusBadge } from "@/app/components/fleet";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { KIND_ICONS } from "@/app/components/kind-icons";
import { KINDS, SHIPS } from "@/content/fleet";
import { Card, DotMeter } from "@/design-system";

export function FleetPage() {
    return (
        <SiteLayout>
            <PageHero tone="overprint" eyebrow="The fleet" title="Every ship in the cove.">
                Apps, tools and other bounties: what’s sailing, what’s in the shipyard and what’s
                still a sketch on the chart table.
            </PageHero>

            <section className="section" aria-labelledby="ships-title">
                <div className="container">
                    <SectionHead id="ships" eyebrow="Ships" title="Where each one stands.">
                        Every ship gets a code when its keel is laid. It gets a name when it floats.
                    </SectionHead>
                    <div className="ship-list">
                        {SHIPS.map((ship) => (
                            <article
                                key={ship.id}
                                id={ship.id}
                                className="ship-row"
                                data-reveal
                                aria-labelledby={`${ship.id}-name`}
                            >
                                <div className="ship-row-main">
                                    <div className="ship-meta">
                                        <span className="mono muted">
                                            {ship.code} · {ship.kind}
                                        </span>
                                        <StatusBadge ship={ship} />
                                    </div>
                                    <h3 className="title-2 ship-name" id={`${ship.id}-name`}>
                                        {ship.name}
                                    </h3>
                                    {ship.story.map((p) => (
                                        <p key={p} className="body-lg muted ship-story">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                                <Card variant="plain" className="ship-row-side">
                                    <DotMeter
                                        size="lg"
                                        columns={20}
                                        value={ship.readiness}
                                        label="Ready to sail"
                                    />
                                    <p className="headline ship-notes-title">
                                        What we can share so far
                                    </p>
                                    <ul className="tick-list">
                                        {ship.notes.map((note) => (
                                            <li key={note}>{note}</li>
                                        ))}
                                    </ul>
                                </Card>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="kinds-title">
                <div className="container">
                    <SectionHead id="kinds" eyebrow="Kinds of ships" title="Three kinds of voyage.">
                        The colour on each card is the ink we print that kind of ship in.
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
                    <div className="fleet-log-wide">
                        <FleetLog />
                    </div>
                </div>
            </section>

            <Dispatches />
        </SiteLayout>
    );
}
