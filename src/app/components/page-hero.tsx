import type { ReactNode } from "react";

import { Scene } from "@/app/components/scene";
import type { SceneName } from "@/app/components/scenes";
import { Kicker, ScrambleText } from "@/design-system";

/**
 * The top of an inner page: a compact band, not a whole screen, so the
 * content starts within the first view. The band prints the page's own
 * scene on the page grid, its ink blocks to the right of the copy.
 */
export function PageHero({
    eyebrow,
    title,
    scene,
    meta,
    children,
}: {
    eyebrow: string;
    title: string;
    scene: SceneName;
    meta?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <Scene name={scene} size="fit" className="page-hero" id="top" aria-labelledby="page-title">
            <div className="wrap">
                <div className="page-hero-copy" data-quiet>
                    <Kicker>{eyebrow}</Kicker>
                    <h1 className="title-1 page-title" id="page-title">
                        <ScrambleText text={title} trigger="mount" />
                    </h1>
                    {children && <p className="lead">{children}</p>}
                    {meta && <div className="page-meta">{meta}</div>}
                </div>
            </div>
        </Scene>
    );
}
