import type { ReactNode } from "react";

import { cx } from "./cx";

const ICONS = {
    info: "M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
    success: "m8.5 12.5 2.5 2.5 5-5.5M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
    warning:
        "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
    danger: "m15 9-6 6m0-6 6 6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
};

export interface CalloutProps {
    tone?: keyof typeof ICONS;
    title?: ReactNode;
    className?: string;
    children?: ReactNode;
}

/** Soft tinted panel with a status icon. */
export function Callout({ tone = "info", title, className, children }: CalloutProps) {
    return (
        <div
            className={cx("bc-callout", `bc-callout-${tone}`, className)}
            role={tone === "danger" ? "alert" : "status"}
        >
            <svg
                className="bc-callout-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d={ICONS[tone]} />
            </svg>
            <div>
                {title && <p className="bc-callout-title">{title}</p>}
                {children && <p className="bc-callout-body">{children}</p>}
            </div>
        </div>
    );
}
