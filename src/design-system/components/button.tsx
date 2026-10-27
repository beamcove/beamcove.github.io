import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "./cx";

interface ButtonOwnProps {
    /** `primary` is the riso-blue beam key — one per view. */
    variant?: "primary" | "secondary" | "tonal" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    /** Square button holding just an icon; requires aria-label. */
    iconOnly?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    children?: ReactNode;
}

type AsButton = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = ButtonOwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = AsButton | AsLink;

/** Triggers an action. Renders an `<a>` when given an `href`. */
export function Button(props: ButtonProps) {
    const {
        variant = "primary",
        size = "md",
        iconOnly,
        iconLeft,
        iconRight,
        className,
        children,
        ...rest
    } = props;
    const classes = cx(
        "bc-btn",
        `bc-btn-${variant}`,
        size !== "md" && `bc-btn-${size}`,
        iconOnly && "bc-btn-icon",
        className,
    );
    const content = (
        <>
            {iconLeft}
            {children}
            {iconRight}
        </>
    );

    if (typeof rest.href === "string") {
        return (
            <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
                {content}
            </a>
        );
    }
    return (
        <button
            type="button"
            {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
            className={classes}
        >
            {content}
        </button>
    );
}
