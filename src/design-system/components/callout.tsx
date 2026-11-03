import type { ReactNode } from "react";

import { cx } from "./cx";

const GLYPHS = { info: "i", success: "✓", warning: "!", danger: "✕" };

export interface CalloutProps {
    tone?: keyof typeof GLYPHS;
    title?: ReactNode;
    className?: string;
    children?: ReactNode;
}

/** A tinted panel with a glyph cell and a left rule in the status ink. */
export function Callout({ tone = "info", title, className, children }: CalloutProps) {
    return (
        <div
            className={cx("bc-callout", `bc-callout-${tone}`, className)}
            role={tone === "danger" ? "alert" : "status"}
        >
            <span className="bc-callout-icon" aria-hidden="true">
                {GLYPHS[tone]}
            </span>
            <div>
                {title && <p className="bc-callout-title">{title}</p>}
                {children && <p className="bc-callout-body">{children}</p>}
            </div>
        </div>
    );
}
