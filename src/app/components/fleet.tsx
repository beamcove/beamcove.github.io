import type { CSSProperties } from "react";

import { SectionHead } from "@/app/components/section-head";
import { Badge, Button, Card, DotMeter } from "@/design-system";

const LOG = [
    { label: "Launched", value: 0 },
    { label: "In the shipyard", value: 1 },
    { label: "On the drawing board", value: 1 },
];

export function Fleet() {
    return (
        <section className="section" id="fleet" aria-labelledby="fleet-title">
            <div className="container">
                <SectionHead id="fleet" eyebrow="The fleet" title="Something’s on the horizon.">
                    Our first ship is nearly ready to leave the harbour. Here’s where the fleet
                    stands today.
                </SectionHead>
                <div className="fleet-grid">
                    <Card
                        data-reveal
                        tone="overprint"
                        className="ship-card"
                        footer={
                            <Button variant="tonal" href="#dispatches">
                                Get launch news
                            </Button>
                        }
                    >
                        <div className="ship-meta">
                            <span className="mono muted">BC-001</span>
                            <Badge tone="beam" dot>
                                In the shipyard
                            </Badge>
                        </div>
                        <h3 className="title-2 ship-name">Caskade</h3>
                        <p className="body-lg muted ship-blurb">
                            A tool that makes everyday work lighter. We’re putting the final coat of
                            paint on the hull.
                        </p>
                        <DotMeter
                            className="ship-meter"
                            size="lg"
                            columns={24}
                            value={72}
                            label="Ready to sail"
                        />
                    </Card>

                    <div className="fleet-aside">
                        <Card
                            variant="plain"
                            className="ship-card ship-card-small"
                            data-reveal
                            style={{ "--d": 1 } as CSSProperties}
                        >
                            <div className="ship-meta">
                                <span className="mono muted">BC-002</span>
                                <Badge>On the drawing board</Badge>
                            </div>
                            <h3 className="headline ship-name-small">An app for daily life</h3>
                            <p className="bc-card-body">
                                Still a sketch on the chart table. It gets a name once it floats.
                            </p>
                        </Card>

                        <Card
                            variant="plain"
                            eyebrow="Fleet log"
                            data-reveal
                            style={{ "--d": 2 } as CSSProperties}
                        >
                            <dl className="fleet-log">
                                {LOG.map((row) => (
                                    <div key={row.label}>
                                        <dt>{row.label}</dt>
                                        <dd>{row.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
