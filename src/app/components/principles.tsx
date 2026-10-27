import type { CSSProperties } from "react";

import { SectionHead } from "@/app/components/section-head";

const PRINCIPLES = [
    {
        title: "Adventure",
        body: "We sail past the edge of the map. New waters are where the good ideas live.",
    },
    {
        title: "Integrity",
        body: "Honest work and careful craft, in the parts you see and the parts you don’t.",
    },
    {
        title: "Balance",
        body: "A steady hand on the wheel. We build at a pace we can keep for the long voyage.",
    },
];

export function Principles() {
    return (
        <section className="section" id="principles" aria-labelledby="principles-title">
            <div className="container">
                <div className="principles bc-dots">
                    <SectionHead
                        id="principles"
                        eyebrow="How we sail"
                        title="Adventure, integrity, balance."
                    />
                    <ol className="principle-list">
                        {PRINCIPLES.map((p, i) => (
                            <li key={p.title} data-reveal style={{ "--d": i } as CSSProperties}>
                                <span className="mono-data principle-num" aria-hidden="true">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 className="title-3">{p.title}</h3>
                                <p className="muted">{p.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
