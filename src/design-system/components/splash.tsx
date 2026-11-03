import { useRef, type HTMLAttributes, type ReactNode } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { useCellFit } from "./cell-fit";
import { cx } from "./cx";
import { GlyphField } from "./glyph-field";

export interface SplashProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    /** The glyph composition printed behind the copy. */
    field?: GlyphComposition;
    /** Sweep the lighthouse beam across the field (the hero's). */
    beam?: boolean;
    /** Content alignment; default 'start'. */
    align?: "start" | "center";
    eyebrow?: ReactNode;
    title?: ReactNode;
    /** Heading level for the title; default 2. */
    titleAs?: "h1" | "h2";
    actions?: ReactNode;
    /** Extra layers behind or beside the content (absolutely positioned). */
    art?: ReactNode;
    /** A string becomes the lead paragraph; anything else renders as-is. */
    children?: ReactNode;
}

/** A dark panel holding the view's glyph field, with the copy on a quiet patch. One per view. */
export function Splash({
    field,
    beam = false,
    align = "start",
    eyebrow,
    title,
    titleAs: Title = "h2",
    actions,
    art,
    className,
    children,
    ...rest
}: SplashProps) {
    const ref = useRef<HTMLElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    useCellFit(ref, innerRef);

    return (
        <section
            {...rest}
            ref={ref}
            className={cx(
                "bc-splash",
                "bc-glyphs",
                align === "center" && "bc-splash-center",
                className,
            )}
        >
            {field && <GlyphField composition={field} beam={beam} />}
            {art}
            <div ref={innerRef} className="bc-splash-content">
                {eyebrow && <p className="bc-eyebrow">{eyebrow}</p>}
                {title && <Title className="bc-splash-title">{title}</Title>}
                {typeof children === "string" ? (
                    <p className="bc-splash-body">{children}</p>
                ) : (
                    children
                )}
                {actions && <div className="bc-splash-actions">{actions}</div>}
            </div>
        </section>
    );
}
