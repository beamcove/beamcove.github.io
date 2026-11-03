import type { ReactNode } from "react";

import { Scene } from "@/app/components/scene";
import type { SceneName } from "@/app/components/scenes";
import { Kicker, ScrambleText } from "@/design-system";

/** The first screen of an inner page: kicker, title, lead, on the page's own scene. */
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
        <Scene name={scene} className="page-hero" id="top" aria-labelledby="page-title">
            <div className="wrap">
                <div className="copy page-hero-copy" data-quiet>
                    <Kicker>{eyebrow}</Kicker>
                    <h1 className="display page-title" id="page-title">
                        <ScrambleText text={title} trigger="mount" />
                    </h1>
                    {children && <p className="lead">{children}</p>}
                    {meta && <div className="page-meta">{meta}</div>}
                </div>
            </div>
        </Scene>
    );
}
