import type { ReactNode } from "react";

import { Scene } from "@/app/components/scene";
import type { SceneName } from "@/app/components/scenes";
import { Kicker } from "@/design-system";

/**
 * A section of a reading page: as tall as its content, a 2px rule on top,
 * the heading in a sticky column on the left and the content on the right
 * (`stacked` puts the heading on top, for wide grids). Its art is a margin
 * scene: glyphs and small ink blocks in the side margins, the column quiet.
 */
export function Section({
    id,
    n,
    kicker,
    title,
    lead,
    scene,
    stacked = false,
    children,
}: {
    id: string;
    n?: number;
    kicker: string;
    title: ReactNode;
    lead?: ReactNode;
    /** Default: one of the margin scenes, chosen from the id. */
    scene?: SceneName;
    stacked?: boolean;
    children: ReactNode;
}) {
    const margins: SceneName[] = ["reading", "readingB", "readingC"];
    const pick = margins[[...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % margins.length]!;
    return (
        <Scene
            name={scene ?? pick}
            size="fit"
            className={stacked ? "section section-stacked" : "section"}
            id={id}
            aria-labelledby={`${id}-title`}
        >
            <div className="wrap section-grid">
                <header className="section-head" data-quiet>
                    <Kicker n={n}>{kicker}</Kicker>
                    <h2 className="title-2 section-title" id={`${id}-title`}>
                        {title}
                    </h2>
                    {lead && <p className="section-lead">{lead}</p>}
                </header>
                <div className="section-body" data-quiet data-reveal>
                    {children}
                </div>
            </div>
        </Scene>
    );
}
