import type { CSSProperties, ReactNode } from "react";

import { Splash, type SplashTone } from "@/design-system";

/**
 * The top of an inner page. Printed pages get a compact Splash (their one
 * printed moment); `plain` pages (legal, contact) stay on paper.
 */
export function PageHero({
    eyebrow,
    title,
    tone = "plain",
    band = "tide",
    meta,
    children,
}: {
    eyebrow: string;
    title: string;
    tone?: SplashTone | "plain";
    /** Ink for the thin printed band under a plain header. */
    band?: Exclude<SplashTone, "night">;
    meta?: ReactNode;
    children?: ReactNode;
}) {
    if (tone === "plain") {
        return (
            <div className="container page-hero page-hero-plain" id="top">
                <p className="bc-eyebrow" data-reveal>
                    {eyebrow}
                </p>
                <h1
                    className="display page-title"
                    data-reveal
                    style={{ "--d": 1 } as CSSProperties}
                >
                    {title}
                </h1>
                {children && (
                    <p
                        className="body-lg muted page-lead"
                        data-reveal
                        style={{ "--d": 2 } as CSSProperties}
                    >
                        {children}
                    </p>
                )}
                {meta && <div className="page-meta">{meta}</div>}
                <div
                    className={`page-hero-band bc-on-splash bc-tone-${band} bc-dotfield`}
                    data-theme="light"
                    aria-hidden="true"
                />
            </div>
        );
    }
    return (
        <div className="container page-hero" id="top">
            <Splash
                tone={tone}
                className="page-splash"
                data-theme="light"
                titleAs="h1"
                eyebrow={eyebrow}
                title={title}
            >
                {children && <p className="bc-splash-body">{children}</p>}
                {meta && <div className="page-meta">{meta}</div>}
            </Splash>
        </div>
    );
}
