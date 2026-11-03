import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./cx";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * `plain` a filled panel; `framed` an open frame with corner ticks;
     * `art` a glyph strip on top (pass it as `media`); `splash` a sunken glyph panel.
     */
    variant?: "plain" | "framed" | "art" | "splash";
    /** The art strip's content, usually a GlyphField. */
    media?: ReactNode;
    eyebrow?: ReactNode;
    title?: ReactNode;
    footer?: ReactNode;
    interactive?: boolean;
    children?: ReactNode;
}

/** Container for one idea. */
export function Card({
    variant = "plain",
    media,
    eyebrow,
    title,
    footer,
    interactive,
    className,
    children,
    ...rest
}: CardProps) {
    const art = variant === "art";
    const content = (
        <>
            {eyebrow && <p className="bc-eyebrow">{eyebrow}</p>}
            {title && <h3 className="bc-card-title">{title}</h3>}
            {children && (title ? <div className="bc-card-body">{children}</div> : children)}
            {footer && <div className="bc-card-footer">{footer}</div>}
        </>
    );
    return (
        <div
            {...rest}
            className={cx(
                "bc-card",
                `bc-card-${variant}`,
                variant === "framed" && "bc-frame",
                variant === "splash" && "bc-glyphs",
                interactive && "bc-card-interactive",
                className,
            )}
        >
            {art ? (
                <>
                    <span className="bc-card-strip bc-glyphs" aria-hidden="true">
                        {media}
                    </span>
                    <div className="bc-card-content">{content}</div>
                </>
            ) : (
                content
            )}
        </div>
    );
}
