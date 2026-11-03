import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { motionAllowed } from "../glyph/motion";
import { cx } from "./cx";
import { Field } from "./field";

export interface ScreenProps extends HTMLAttributes<HTMLElement> {
    /** The scene's name (for styling and tests). */
    scene: string;
    /** The scene this screen prints, on the page grid behind its copy. */
    field: GlyphComposition;
    /** Sweep the lighthouse beam (the first screen of the home page). */
    beam?: boolean;
    /**
     * Pin the screen while you scroll past it: `true` for a statement (writes
     * `--p`), or a number of steps (also writes `data-step`, e.g. one per value).
     */
    pin?: boolean | number;
    /** `full` (default) fills the viewport; `fit` is as tall as its content, for reading pages. */
    size?: "full" | "fit";
    as?: "section" | "div";
    children?: ReactNode;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Writes scroll progress through a pinned screen: `--p` 0 → 1, and `data-step`. */
function usePinProgress(ref: React.RefObject<HTMLElement | null>, steps: number | undefined) {
    useEffect(() => {
        const el = ref.current;
        if (!el || steps === undefined) return;
        if (!motionAllowed()) {
            el.style.setProperty("--p", "1");
            return;
        }
        let frame = 0;
        const update = () => {
            frame = 0;
            const r = el.getBoundingClientRect();
            const span = r.height - window.innerHeight;
            const p = span > 40 ? clamp01(-r.top / span) : 1;
            el.style.setProperty("--p", p.toFixed(3));
            if (steps) el.dataset.step = String(Math.min(steps - 1, Math.floor(p * steps)));
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [ref, steps]);
}

/**
 * A section of the page with its own glyph scene, printed on the page grid
 * behind its copy (put `data-quiet` on the copy so the art keeps clear). The
 * art belongs to the section and scrolls with it: it prints in, row by row,
 * the first time the section comes into view. Home screens fill the
 * viewport; reading pages use `size="fit"`.
 */
export function Screen({
    scene,
    field,
    beam = false,
    pin,
    size = "full",
    as: Tag = "section",
    className,
    style,
    children,
    ...rest
}: ScreenProps) {
    const ref = useRef<HTMLElement>(null);
    const steps = typeof pin === "number" ? pin : pin ? 0 : undefined;
    usePinProgress(ref, steps);
    const art = (
        <Field
            composition={field}
            beam={beam}
            pinned={steps !== undefined}
            dots={steps !== undefined}
            soften
        />
    );
    return (
        <Tag
            {...rest}
            ref={ref as React.RefObject<HTMLDivElement>}
            className={cx(
                steps !== undefined ? "bc-pin" : "bc-screen",
                size === "fit" && "bc-screen-fit",
                className,
            )}
            data-scene={scene}
            data-progress={steps}
            data-steps={steps ? steps : undefined}
            style={steps ? ({ ...style, "--bc-steps": steps } as CSSProperties) : style}
        >
            {steps !== undefined ? (
                <div className="bc-pin-frame">
                    {art}
                    {children}
                </div>
            ) : (
                <>
                    {art}
                    {children}
                </>
            )}
        </Tag>
    );
}
