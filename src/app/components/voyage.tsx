import type { CSSProperties } from "react";
import { Hammer, LifeBuoy, Map as Chart, Sailboat, type IconNode } from "lucide";

import { Icon } from "@/app/components/icon";
import { SectionHead } from "@/app/components/section-head";

const STAGES: { icon: IconNode; title: string; body: string }[] = [
    {
        icon: Chart,
        title: "Chart",
        body: "Every ship starts as a sketch on the chart table: a problem worth solving and a reason to care about it.",
    },
    {
        icon: Hammer,
        title: "Build",
        body: "We build in small, careful passes, like ink on a press. Each pass adds something you can feel.",
    },
    {
        icon: Sailboat,
        title: "Launch",
        body: "When it floats, it ships. We’d rather launch something small and good than something big and late.",
    },
    {
        icon: LifeBuoy,
        title: "Keep afloat",
        body: "Launch is where the voyage starts. We keep tending every ship in the fleet long after it sails.",
    },
];

export function Voyage() {
    return (
        <section className="section" id="voyage" aria-labelledby="voyage-title">
            <div className="container">
                <SectionHead id="voyage" eyebrow="How we work" title="From sketch to sea.">
                    Every Beamcove venture makes the same voyage. Some take months, some take a
                    weekend.
                </SectionHead>
                <ol className="voyage" data-reveal="fill">
                    {STAGES.map((stage, i) => (
                        <li key={stage.title} style={{ "--i": i } as CSSProperties}>
                            <span className="voyage-marker" aria-hidden="true">
                                <Icon node={stage.icon} size={18} />
                            </span>
                            <span className="mono-data voyage-num">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="title-3">{stage.title}</h3>
                            <p className="muted">{stage.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
