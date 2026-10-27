import type { CSSProperties } from "react";

import { SectionHead } from "@/app/components/section-head";
import { FLEET_COUNTS, SHIPS, STATUS_LABEL, type Ship } from "@/content/fleet";
import { ROUTES } from "@/content/site";
import { Badge, Button, Card, DotMeter } from "@/design-system";

export function StatusBadge({ ship }: { ship: Ship }) {
    if (ship.status === "launched") return <Badge tone="success">{STATUS_LABEL.launched}</Badge>;
    if (ship.status === "shipyard")
        return (
            <Badge tone="beam" dot>
                {STATUS_LABEL.shipyard}
            </Badge>
        );
    return <Badge>{STATUS_LABEL[ship.status]}</Badge>;
}

export function FleetLog({ style }: { style?: CSSProperties }) {
    return (
        <Card variant="plain" eyebrow="Fleet log" data-reveal style={style}>
            <dl className="fleet-log">
                {FLEET_COUNTS.map((row) => (
                    <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                    </div>
                ))}
            </dl>
        </Card>
    );
}

export function Fleet() {
    const [flagship, ...rest] = SHIPS;
    if (!flagship) return null;
    return (
        <section className="section" id="fleet" aria-labelledby="fleet-title">
            <div className="container">
                <SectionHead
                    id="fleet"
                    eyebrow="The fleet"
                    title="Something’s on the horizon."
                    more={{ href: ROUTES.fleet, label: "Explore the fleet" }}
                >
                    Our first ship is nearly ready to leave the harbour. Here’s where the fleet
                    stands today.
                </SectionHead>
                <div className="fleet-grid">
                    <Card
                        data-reveal
                        tone="overprint"
                        className="ship-card"
                        footer={
                            <>
                                <Button variant="tonal" href="#dispatches">
                                    Get launch news
                                </Button>
                                <Button variant="ghost" href={`${ROUTES.fleet}#${flagship.id}`}>
                                    Read more
                                </Button>
                            </>
                        }
                    >
                        <div className="ship-meta">
                            <span className="mono muted">{flagship.code}</span>
                            <StatusBadge ship={flagship} />
                        </div>
                        <h3 className="title-2 ship-name">{flagship.name}</h3>
                        <p className="body-lg muted ship-blurb">{flagship.summary}</p>
                        <DotMeter
                            className="ship-meter"
                            size="lg"
                            columns={24}
                            value={flagship.readiness}
                            label="Ready to sail"
                        />
                    </Card>

                    <div className="fleet-aside">
                        {rest.slice(0, 1).map((ship) => (
                            <Card
                                key={ship.id}
                                variant="plain"
                                className="ship-card ship-card-small"
                                data-reveal
                                style={{ "--d": 1 } as CSSProperties}
                            >
                                <div className="ship-meta">
                                    <span className="mono muted">{ship.code}</span>
                                    <StatusBadge ship={ship} />
                                </div>
                                <h3 className="headline ship-name-small">{ship.name}</h3>
                                <p className="bc-card-body">{ship.summary}</p>
                            </Card>
                        ))}
                        <FleetLog style={{ "--d": 2 } as CSSProperties} />
                    </div>
                </div>
            </div>
        </section>
    );
}
