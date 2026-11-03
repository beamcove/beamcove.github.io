import { useEffect, useRef, type CSSProperties } from "react";

import { motionAllowed } from "../glyph/motion";
import { cx } from "./cx";

/**
 * A sentence whose words light up one after another when it comes into
 * view; the page keeps scrolling as it does. Fully lit without motion.
 */
export function LitLine({ text, className }: { text: string; className?: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || !motionAllowed() || typeof IntersectionObserver === "undefined") return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                el.classList.add("is-in");
                io.disconnect();
            },
            { rootMargin: "0px 0px -20% 0px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    const words = text.split(" ");
    return (
        <p
            ref={ref}
            className={cx("bc-lit", className)}
            style={{ "--n": words.length } as CSSProperties}
        >
            {words.map((word, i) => (
                <span key={i} style={{ "--i": i } as CSSProperties}>
                    {word}{" "}
                </span>
            ))}
        </p>
    );
}
