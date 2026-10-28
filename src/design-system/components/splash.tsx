import { useRef, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";
import { useDotFit } from "./dot-fit";

export type SplashTone =
    | "overprint"
    | "tide"
    | "flare"
    | "meadow"
    | "sun"
    | "lagoon"
    | "rose"
    | "sky"
    | "night";

export interface SplashProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    tone?: SplashTone;
    /** Content alignment; default 'start'. */
    align?: "start" | "center";
    /** Overprinted triangle and bar; default true for the overprint tone. */
    shapes?: boolean;
    dots?: boolean;
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

/** Printed ink splash with grain and the fitted dot grid. One per view. */
export function Splash({
    tone = "overprint",
    align = "start",
    shapes = tone === "overprint",
    dots = true,
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
    useDotFit(ref, innerRef, dots);

    return (
        <section
            {...rest}
            ref={ref}
            className={cx(
                "bc-splash",
                "bc-on-splash",
                `bc-tone-${tone}`,
                align === "center" && "bc-splash-center",
                dots ? "bc-dotfield" : "bc-splash-flat",
                className,
            )}
        >
            {shapes && (
                <div className="bc-splash-shapes" aria-hidden="true">
                    <i className="tri" />
                    <i className="bar" />
                </div>
            )}
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
