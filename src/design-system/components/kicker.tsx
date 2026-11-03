import type { ReactNode } from "react";

import { cx } from "./cx";

/** A chapter kicker: a two-digit number, a rule, a word. `01 —— What we do` */
export function Kicker({
    n,
    className,
    children,
}: {
    n?: number;
    className?: string;
    children: ReactNode;
}) {
    return (
        <p className={cx("bc-kicker", className)}>
            {n !== undefined && <span className="bc-kicker-n">{String(n).padStart(2, "0")}</span>}
            {children}
        </p>
    );
}
