import { useEffect, useRef } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { elementLattice } from "../glyph/lattice";
import { motionAllowed } from "../glyph/motion";
import { createPainter, quietRects, type Rect } from "../glyph/painter";
import { cx } from "./cx";

const FRAME_MS = 1000 / 30;
const ROW_MS = 24; // print-in: one row every 24ms

export interface FieldProps {
    composition: GlyphComposition;
    /** Sweep the lighthouse beam across. */
    beam?: boolean;
    /** Glyphs light up under the pointer; default true. */
    pointer?: boolean;
    /** Thin the glyphs and keep ink blocks clear around `[data-quiet]` copy; default true. */
    quiet?: boolean;
    /** Draw the resting dots (on an opaque surface); default false: the page has them. */
    dots?: boolean;
    /** Thin the art over the first and last rows, where sections meet; default false. */
    soften?: boolean;
    /** Inside a pinned frame: rows start at the frame's top, columns still on the page lattice. */
    pinned?: boolean;
    className?: string;
}

/**
 * One glyph scene printed on a canvas that fills its positioned parent, its
 * cells snapped to the page lattice so they sit exactly over the page dots.
 * It prints in once, row by row, the first time it comes into view, then
 * shimmers while visible; with motion off it prints one still frame.
 */
export function Field({
    composition,
    beam = false,
    pointer = true,
    quiet = true,
    dots = false,
    soften = false,
    pinned = false,
    className,
}: FieldProps) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof ResizeObserver === "undefined") return;
        const painter = createPainter(canvas, composition, { dots, soften });
        if (!painter) return;
        const animate = motionAllowed();

        let boxes: Rect[] = [];
        let started = 0;
        let head = animate ? -1 : Infinity;
        let visible = false;
        let frame = 0;
        let last = 0;
        let px = 0;
        let py = 0;
        let amt = 0;
        let over = false;

        const layout = () => {
            // measure the canvas itself: it fills the host's padding box, inside any border
            const lattice = elementLattice(canvas);
            painter.resize(
                host.clientWidth,
                host.clientHeight,
                pinned ? { x: lattice.x, y: 0 } : lattice,
            );
            boxes = quiet ? quietRects(host, canvas.getBoundingClientRect()) : [];
            canvas.dataset.lattice = `${painter.origin.x},${painter.origin.y}`;
        };
        // fixed furniture (the chapter rail) floats over every section: glyphs thin behind it
        const floating = (): Rect[] => {
            const fixed = document.querySelectorAll<HTMLElement>('[data-quiet="fixed"]');
            if (!fixed.length) return boxes;
            const o = canvas.getBoundingClientRect();
            return [
                ...boxes,
                ...[...fixed].map((el) => {
                    const r = el.getBoundingClientRect();
                    return {
                        l: r.left - o.left,
                        t: r.top - o.top,
                        r: r.right - o.left,
                        b: r.bottom - o.top,
                        soft: true,
                    };
                }),
            ];
        };
        const paint = (time: number) =>
            painter.draw({
                quiet: floating(),
                time,
                animate,
                beam: beam ? 1 : 0,
                pointer: amt > 0 ? { x: px, y: py, amt } : undefined,
                head,
            });
        const redraw = () => {
            layout();
            paint(performance.now());
        };

        const tick = (t: number) => {
            frame = 0;
            if (!visible) return;
            if (t - last >= FRAME_MS) {
                last = t;
                if (!started) started = t;
                if (head !== Infinity) {
                    head = (t - started) / ROW_MS - 1;
                    if (head > painter.rows + 1) head = Infinity;
                }
                amt += ((over ? 1 : 0) - amt) * 0.2;
                if (amt < 0.01 && !over) amt = 0;
                paint(t);
            }
            frame = requestAnimationFrame(tick);
        };

        layout();
        if (!animate) paint(0);
        void document.fonts?.ready.then(redraw);

        const ro = new ResizeObserver(redraw);
        ro.observe(host);
        ro.observe(document.body);

        let io: IntersectionObserver | undefined;
        if (animate) {
            io = new IntersectionObserver(
                ([entry]) => {
                    visible = !!entry?.isIntersecting;
                    if (visible && !frame) frame = requestAnimationFrame(tick);
                },
                { rootMargin: "0px 0px -15% 0px" },
            );
            io.observe(host);
        }

        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            px = e.clientX - r.left;
            py = e.clientY - r.top;
            over = true;
        };
        const onLeave = () => {
            over = false;
        };
        if (animate && pointer) {
            host.addEventListener("pointermove", onMove);
            host.addEventListener("pointerleave", onLeave);
        }

        return () => {
            cancelAnimationFrame(frame);
            ro.disconnect();
            io?.disconnect();
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
        };
    }, [composition, beam, pointer, quiet, dots, soften, pinned]);

    return <canvas ref={ref} className={cx("bc-print", className)} aria-hidden="true" />;
}
