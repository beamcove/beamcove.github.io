import type { ReactNode } from "react";

import { cx } from "./cx";

export interface BadgeProps {
    tone?: "neutral" | "beam" | "success" | "warning" | "danger" | "flare";
    dot?: boolean;
    className?: string;
    children: ReactNode;
}

/** A 22px mono status tag. `flare` is a solid accent block, for “Now”. */
export function Badge({ tone = "neutral", dot, className, children }: BadgeProps) {
    return (
        <span className={cx("bc-badge", `bc-badge-${tone}`, className)}>
            {dot && <span className="bc-badge-dot" aria-hidden="true" />}
            {children}
        </span>
    );
}
