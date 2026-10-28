import type { ReactNode } from "react";

import { Splash, type SplashTone } from "@/design-system";

/**
 * The top of an inner page: a compact Splash, the page's one printed moment,
 * with the fitted dot grid. Overprint headers carry riso `art` instead of the
 * hero's triangle and bar, which stay the home page's own.
 */
export function PageHero({
    eyebrow,
    title,
    tone = "tide",
    meta,
    art,
    children,
}: {
    eyebrow: string;
    title: string;
    tone?: Exclude<SplashTone, "night">;
    meta?: ReactNode;
    /** Printed art on the right; replaces the overprint triangle and bar. */
    art?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <div className="container page-hero" id="top">
            <Splash
                tone={tone}
                className="page-splash"
                data-theme="light"
                titleAs="h1"
                eyebrow={eyebrow}
                title={title}
                art={art}
                shapes={false}
            >
                {children && <p className="bc-splash-body">{children}</p>}
                {meta && <div className="page-meta">{meta}</div>}
            </Splash>
        </div>
    );
}
