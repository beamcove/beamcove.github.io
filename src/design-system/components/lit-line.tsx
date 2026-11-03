import type { CSSProperties } from "react";

import { cx } from "./cx";

/**
 * A sentence whose words light up one by one as its pinned Screen scrolls
 * (it reads `--p` from the pin). Fully lit without motion.
 */
export function LitLine({ text, className }: { text: string; className?: string }) {
    const words = text.split(" ");
    return (
        <p className={cx("bc-lit", className)} style={{ "--n": words.length } as CSSProperties}>
            {words.map((word, i) => (
                <span key={i} style={{ "--i": i } as CSSProperties}>
                    {word}{" "}
                </span>
            ))}
        </p>
    );
}
