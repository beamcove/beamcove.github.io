import type { CSSProperties, ReactNode } from "react";

import { cx } from "./cx";

export interface DotMeterProps {
    value: number;
    max?: number;
    /** Dot rows; default 3. */
    rows?: number;
    /** Dot columns; default 20. */
    columns?: number;
    label?: ReactNode;
    valueText?: ReactNode;
    size?: "md" | "lg";
    className?: string;
}

/** Progress as a dot matrix that fills column by column, with a bold red figure. */
export function DotMeter({
    value,
    max = 100,
    rows = 3,
    columns = 20,
    label,
    valueText,
    size = "md",
    className,
}: DotMeterProps) {
    const total = rows * columns;
    const v = Math.max(0, Math.min(max, value));
    const on = Math.round((v / max) * total);
    const text = valueText ?? `${Math.round((v / max) * 100)}%`;

    return (
        <div
            className={cx("bc-meter", size === "lg" && "bc-meter-lg", className)}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={v}
            aria-label={typeof label === "string" ? label : undefined}
        >
            <div className="bc-meter-head">
                {label ? <span className="bc-meter-label">{label}</span> : <span />}
                <span className="bc-meter-value">{text}</span>
            </div>
            <div
                className="bc-meter-grid"
                style={{ "--bc-rows": rows } as CSSProperties}
                aria-hidden="true"
            >
                {Array.from({ length: total }, (_, i) => (
                    <span
                        key={i}
                        className={cx("bc-meter-dot", i < on && "is-on")}
                        style={{ "--col": Math.floor(i / rows) } as CSSProperties}
                    />
                ))}
            </div>
        </div>
    );
}
