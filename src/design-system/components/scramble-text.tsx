import { useEffect, useRef } from "react";

import { motionAllowed } from "../glyph/motion";

const NOISE = "▢◎⊠✕+·╳/\\#%&▣◇░▒";

export interface ScrambleTextProps {
    text: string;
    /** Decode when first shown (`view`) or straight away (`mount`); default `view`. */
    trigger?: "mount" | "view";
    /** Total time to resolve, ms; default 900. */
    duration?: number;
    delay?: number;
    className?: string;
}

/**
 * Text that decodes: scrambled glyphs resolve into the real words, left to
 * right, once. Screen readers get the real text straight away; with motion
 * off, so does everyone.
 */
export function ScrambleText({
    text,
    trigger = "view",
    duration = 900,
    delay = 0,
    className,
}: ScrambleTextProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !motionAllowed()) return;
        let frame = 0;
        let timer = 0;
        let begin = 0;

        const tick = (t: number) => {
            if (!begin) begin = t;
            const p = Math.min(1, (t - begin) / duration);
            const shown = Math.floor(p * text.length);
            let out = text.slice(0, shown);
            for (let i = shown; i < text.length; i++) {
                const ch = text[i]!;
                out += ch === " " ? " " : NOISE[Math.floor(Math.random() * NOISE.length)];
            }
            el.textContent = out;
            if (p < 1) frame = requestAnimationFrame(tick);
        };
        const run = () => {
            timer = window.setTimeout(() => {
                frame = requestAnimationFrame(tick);
            }, delay);
        };

        let io: IntersectionObserver | undefined;
        if (trigger === "mount" || typeof IntersectionObserver === "undefined") {
            run();
        } else {
            io = new IntersectionObserver(([entry]) => {
                if (!entry?.isIntersecting) return;
                io?.disconnect();
                run();
            });
            io.observe(el);
        }
        return () => {
            io?.disconnect();
            window.clearTimeout(timer);
            cancelAnimationFrame(frame);
            el.textContent = text;
        };
    }, [text, trigger, duration, delay]);

    return (
        <span className={["bc-scramble", className].filter(Boolean).join(" ")}>
            <span className="bc-visually-hidden">{text}</span>
            <span ref={ref} aria-hidden="true">
                {text}
            </span>
        </span>
    );
}
