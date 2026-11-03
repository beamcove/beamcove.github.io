import type { ReactNode } from "react";

import { ART, type GlyphArtName } from "@/app/components/glyph-compositions";
import { ScrambleText, Splash } from "@/design-system";

/**
 * The top of an inner page: a compact Splash, the page's one glyph field,
 * with the title decoding in on load.
 */
export function PageHero({
    eyebrow,
    title,
    art,
    meta,
    children,
}: {
    eyebrow: string;
    title: string;
    /** The page's glyph composition. */
    art: GlyphArtName;
    meta?: ReactNode;
    children?: ReactNode;
}) {
    const path = `~/${eyebrow.toLowerCase().replace(/\s+/g, "-")}`;
    return (
        <div className="container page-hero" id="top">
            <Splash
                className="page-splash"
                field={ART[art]}
                titleAs="h1"
                eyebrow={eyebrow}
                title={<ScrambleText text={title} trigger="mount" />}
                art={
                    <div className="splash-hud" aria-hidden="true">
                        <span>{path}</span>
                    </div>
                }
            >
                {children && <p className="bc-splash-body">{children}</p>}
                {meta && <div className="page-meta">{meta}</div>}
            </Splash>
        </div>
    );
}
