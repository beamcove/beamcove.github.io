import type { ReactNode } from "react";

import { Badge } from "./badge";
import { cx } from "./cx";

export interface StatProps {
    value: ReactNode;
    label?: ReactNode;
    unit?: ReactNode;
    delta?: ReactNode;
    trend?: "up" | "down" | "flat";
    caption?: ReactNode;
    className?: string;
}

/** A key number with label, unit, trend and caption. */
export function Stat({ value, label, unit, delta, trend, caption, className }: StatProps) {
    const tone = trend === "down" ? "danger" : trend === "up" ? "success" : "neutral";
    const arrow = trend === "up" ? "↑ " : trend === "down" ? "↓ " : "";
    return (
        <div className={cx("bc-stat", className)}>
            {label && <p className="bc-stat-label">{label}</p>}
            <div className="bc-stat-row">
                <p className="bc-stat-value">
                    {value}
                    {unit && <span className="bc-stat-unit">{unit}</span>}
                </p>
                {delta && (
                    <Badge tone={tone}>
                        {arrow}
                        {delta}
                    </Badge>
                )}
            </div>
            {caption && <p className="bc-stat-caption">{caption}</p>}
        </div>
    );
}
