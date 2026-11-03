import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./cx";

export interface FrameProps extends HTMLAttributes<HTMLDivElement> {
    /** A label set into the top rule: ┤ label ├. */
    label?: ReactNode;
    children?: ReactNode;
}

/** A 1px rule with box-drawing corner ticks, for grouping and specimens. */
export function Frame({ label, className, children, ...rest }: FrameProps) {
    return (
        <div {...rest} className={cx("bc-frame", className)}>
            {label && <span className="bc-frame-label">{label}</span>}
            {children}
        </div>
    );
}
