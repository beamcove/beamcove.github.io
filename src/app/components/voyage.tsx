import type { CSSProperties } from "react";
import { Hammer, LifeBuoy, Map as Chart, Sailboat } from "lucide";

import { Icon } from "@/app/components/icon";
import { SectionHead } from "@/app/components/section-head";
import { STAGES } from "@/content/voyage";

const ICONS = [Chart, Hammer, Sailboat, LifeBuoy];

export function Voyage({
    id = "voyage",
    more,
}: {
    id?: string;
    more?: { href: string; label: string };
}) {
    return (
        <section className="section" id={id} aria-labelledby={`${id}-title`}>
            <div className="container">
                <SectionHead id={id} eyebrow="How we work" title="From sketch to sea." more={more}>
                    Every Beamcove venture makes the same voyage. Some take months, some take a
                    weekend.
                </SectionHead>
                <ol className="voyage" data-reveal="fill">
                    {STAGES.map((stage, i) => (
                        <li key={stage.title} style={{ "--i": i } as CSSProperties}>
                            <span className="voyage-marker" aria-hidden="true">
                                <Icon node={ICONS[i] ?? Sailboat} size={18} />
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
