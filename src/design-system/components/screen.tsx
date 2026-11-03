import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { motionAllowed } from "../glyph/motion";
import { cx } from "./cx";
import { docTop, onLayout } from "./doc-layout";
import { Field } from "./field";

export interface ScreenProps extends HTMLAttributes<HTMLElement> {
    /** The scene's name (for styling and tests). */
    scene: string;
    /** The scene this screen prints, on the page grid behind its copy. */
    field: GlyphComposition;
    /** Sweep the lighthouse beam (the first screen of the home page). */
    beam?: boolean;
    /**
     * Take part in the scene takeover: as the next screen moves up, its scene
     * replaces this one cell by cell. For a landing page of full screens;
     * reading pages leave it off. Default false.
     */
    takeover?: boolean;
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
        let top = 0;
        let span = 0;
        let last = "";
        // from cached positions and scrollY: no layout reads while scrolling, and no
        // style writes unless the value changed
        const update = () => {
            frame = 0;
            const p = span > 40 ? clamp01((window.scrollY - top) / span) : 1;
            const key = p.toFixed(3);
            if (key === last) return;
            last = key;
            el.style.setProperty("--p", key);
            if (steps) {
                const step = String(Math.min(steps - 1, Math.floor(p * steps)));
                if (el.dataset.step !== step) el.dataset.step = step;
            }
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        const stop = onLayout(() => {
            top = docTop(el);
            span = el.offsetHeight - window.innerHeight;
            update();
        });
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            stop();
            window.removeEventListener("scroll", onScroll);
        };
    }, [ref, steps]);
}

/**
 * A section of the page with its own glyph scene, printed on the page grid
 * behind its copy (put `data-quiet` on the copy so the art keeps clear). The
 * art scrolls with the section; with `takeover`, as the next section moves up
 * the screen, its scene takes over this one cell by cell. Home screens fill the
 * viewport; reading pages use `size="fit"`.
 */
export function Screen({
    scene,
    field,
    beam = false,
    takeover = false,
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
            wave={takeover}
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
