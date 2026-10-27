import { useRef, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";
import { useDotFit } from "./dot-fit";
import type { SplashTone } from "./splash";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: "band" | "plain" | "splash" | "glass";
    /** Gradient for the band or the splash card. */
    tone?: SplashTone;
    /** Dot grid on the band or splash; default true. */
    dots?: boolean;
    eyebrow?: ReactNode;
    title?: ReactNode;
    footer?: ReactNode;
    interactive?: boolean;
    children?: ReactNode;
}

/** Container for one idea. Default `band` cards wear a 48px printed strip. */
export function Card({
    variant = "band",
    tone = "overprint",
    dots = true,
    eyebrow,
    title,
    footer,
    interactive,
    className,
    children,
    ...rest
}: CardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLSpanElement>(null);
    const splash = variant === "splash";
    useDotFit(ref, innerRef, splash && dots);
    useDotFit(stripRef, null, variant === "band" && dots);

    return (
        <div
            {...rest}
            ref={ref}
            className={cx(
                "bc-card",
                `bc-card-${variant}`,
                splash && `bc-on-splash bc-tone-${tone}`,
                splash && dots && "bc-dotfield",
                interactive && "bc-card-interactive",
                className,
            )}
        >
            {variant === "band" && (
                <span
                    ref={stripRef}
                    className={cx(
                        "bc-card-strip",
                        "bc-on-splash",
                        `bc-tone-${tone}`,
                        dots && "bc-dotfield",
                    )}
                    aria-hidden="true"
                />
            )}
            <div ref={innerRef} className={variant === "band" ? "bc-card-content" : undefined}>
                {eyebrow && <p className="bc-eyebrow">{eyebrow}</p>}
                {title && <h3 className="bc-card-title">{title}</h3>}
                {children && (title ? <div className="bc-card-body">{children}</div> : children)}
                {footer && <div className="bc-card-footer">{footer}</div>}
            </div>
        </div>
    );
}
