import type { HTMLAttributes, ReactNode, Ref } from "react";

import { cx } from "./cx";

export interface WindowProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    /** The title set into the striped bar, in Departure Mono. */
    title: ReactNode;
    /** Heading level for the title; default h3. */
    titleAs?: "h1" | "h2" | "h3" | "h4" | "p";
    /** A close box at the left of the bar; it calls this when pressed. */
    onClose?: () => void;
    /** A small readout at the right of the bar (a count, a size). */
    meta?: ReactNode;
    /** A window that isn't in front: plain bar, no stripes. */
    inactive?: boolean;
    bodyClassName?: string;
    ref?: Ref<HTMLElement>;
    children?: ReactNode;
}

/** A system window: a bold rule, a 2px drop and a striped title bar with a close box. */
export function Window({
    title,
    titleAs: Title = "h3",
    onClose,
    meta,
    inactive,
    className,
    bodyClassName,
    children,
    ...rest
}: WindowProps) {
    return (
        <section {...rest} className={cx("bc-window", inactive && "bc-window-inactive", className)}>
            <header className="bc-window-bar">
                {onClose && (
                    <button
                        type="button"
                        className="bc-window-close"
                        aria-label="Close"
                        onClick={onClose}
                    />
                )}
                <Title className="bc-window-title">{title}</Title>
                {meta && <span className="bc-window-meta">{meta}</span>}
            </header>
            <div className={cx("bc-window-body", bodyClassName)}>{children}</div>
        </section>
    );
}
