import type { ReactNode } from "react";

import { cx } from "./cx";

export interface BadgeProps {
    tone?: "neutral" | "beam" | "success" | "warning" | "danger" | "flare";
    dot?: boolean;
    className?: string;
    children: ReactNode;
}

/** 24px status or category pill. `flare` is red ink with speckle, for “New”. */
export function Badge({ tone = "neutral", dot, className, children }: BadgeProps) {
    return (
        <span className={cx("bc-badge", `bc-badge-${tone}`, className)}>
            {dot && <span className="bc-badge-dot" aria-hidden="true" />}
            {children}
        </span>
    );
}
