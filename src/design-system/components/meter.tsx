import type { ReactNode } from "react";

import { cx } from "./cx";

export interface MeterProps {
    value: number;
    max?: number;
    /** Characters in the bar; default 24. */
    columns?: number;
    label?: ReactNode;
    valueText?: ReactNode;
    size?: "md" | "lg";
    className?: string;
}

/** Progress as a row of block characters: █ done, ▓▒ the leading edge, ░ to go. */
export function Meter({
    value,
    max = 100,
    columns = 24,
    label,
    valueText,
    size = "md",
    className,
}: MeterProps) {
    const v = Math.max(0, Math.min(max, value));
    const exact = (v / max) * columns;
    const full = Math.floor(exact);
    const part = exact - full;
    const edge = full < columns && part > 0 ? (part > 0.5 ? "▓" : "▒") : "";
    const done = "█".repeat(full) + edge;
    const rest = "░".repeat(columns - done.length);
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
            <span className="bc-meter-bar" aria-hidden="true">
                {done}
                <span className="off">{rest}</span>
            </span>
        </div>
    );
}

/** The old name, kept so existing imports keep working. */
export const DotMeter = Meter;
export type DotMeterProps = MeterProps;
