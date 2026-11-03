import { useEffect, useRef } from "react";

import { buildField, type GlyphComposition } from "../glyph/engine";
import { CELL, elementLattice, restingRect } from "../glyph/lattice";
import { motionAllowed } from "../glyph/motion";
import {
    beamSweeping,
    createPainter,
    quietRects,
    type Rect,
    type SceneLayer,
    type WaveFrame,
} from "../glyph/painter";
import { cx } from "./cx";

// frame pacing: the shimmer is slow, so 12fps is plenty; the beam and the pointer
// light move, so they get 30fps; a scroll redraws on the very next frame
const IDLE_MS = 1000 / 12;
const MOVING_MS = 1000 / 30;
// 1.5 device px per CSS px is crisp enough for 16px glyphs and keeps canvases light
const MAX_DPR = 1.5;
// canvases this far off screen give their pixels back (a canvas is width × height × 4 bytes)
const KEEP_MARGIN = "100% 0px";
// the takeover: it starts as a section's top passes 90% of the screen, and is done at 20%
const TAKE_FROM = 0.9;
const TAKE_TO = 0.2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// the scene each section's canvas prints, so neighbours can print it too
const SCENES = new WeakMap<HTMLCanvasElement, GlyphComposition>();

/** Where an element's top sits in the document at rest (stable while scrolling). */
const docTop = (el: Element) => restingRect(el).top + window.scrollY;

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
    /**
     * Take part in the takeover between sections: as the next section moves up
     * the screen, its scene replaces this one cell by cell, bottom first, and
     * this scene carries on into the next section until then. Default false.
     */
    wave?: boolean;
    className?: string;
}

/**
 * One glyph scene printed on a canvas that fills its positioned parent, its
 * cells snapped to the page lattice so they sit exactly over the page dots.
 * It shimmers while visible; with `wave`, neighbouring scenes take over from
 * each other as you scroll. With motion off it prints one still frame.
 *
 * It only holds pixels while near the screen, only redraws the rows on
 * screen, and reads the layout once per resize, not per frame.
 */
export function Field({
    composition,
    beam = false,
    pointer = true,
    quiet = true,
    dots = false,
    soften = false,
    pinned = false,
    wave = false,
    className,
}: FieldProps) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof IntersectionObserver === "undefined") return;
        const painter = createPainter(canvas, composition, { dots, soften });
        if (!painter) return;
        const animate = motionAllowed();
        const takeover = wave && animate;
        if (wave) SCENES.set(canvas, composition);
        // a pinned canvas rides a sticky frame, so its place on screen has to be read live
        const sticky = pinned || !!canvas.closest(".bc-pin-frame");
        const section = canvas.closest<HTMLElement>("[data-scene]") ?? host;

        let near = false;
        let visible = false;
        let ready = false;
        let size = "";
        let frame = 0;
        let pending = 0;
        let last = 0;
        let lastY = NaN;
        let px = 0;
        let py = 0;
        let amt = 0;
        let over = false;

        // measured at layout: the copy to keep quiet around, fixed furniture, positions
        let boxes: Rect[] = [];
        let fixed: DOMRect[] = [];
        let canvasTop = 0;
        let canvasLeft = 0;
        let sectionTop = 0;
        let prev: SceneLayer | null = null;
        let next: (SceneLayer & { top: number }) | null = null;

        /** A neighbour's scene as this canvas prints it, its noise carried on across the edge. */
        const neighbour = (
            other: HTMLCanvasElement | undefined,
            mine: { left: number; top: number },
        ) => {
            const comp = other && SCENES.get(other);
            if (!other || !comp) return null;
            const theirs = restingRect(other);
            const lattice = other.closest(".bc-pin-frame")
                ? { x: elementLattice(other).x, y: 0 }
                : elementLattice(other);
            const at = {
                c: Math.round((mine.left + painter.origin.x - (theirs.left + lattice.x)) / CELL),
                r: Math.round((mine.top + painter.origin.y - (theirs.top + lattice.y)) / CELL),
            };
            return {
                comp,
                field: buildField(comp, painter.cols, painter.rows, at),
                top: docTop(other.closest("[data-scene]") ?? other),
            };
        };

        const layout = () => {
            const rect = restingRect(canvas);
            // measure the canvas itself: it fills the host's padding box, inside any border
            const lattice = elementLattice(canvas);
            const offset = pinned ? { x: lattice.x, y: 0 } : lattice;
            const key = `${host.clientWidth}x${host.clientHeight}@${offset.x},${offset.y}`;
            if (!ready || key !== size) {
                painter.resize(host.clientWidth, host.clientHeight, offset, MAX_DPR);
                canvas.dataset.lattice = `${painter.origin.x},${painter.origin.y}`;
                size = key;
                ready = true;
            }
            boxes = quiet ? quietRects(host, canvas.getBoundingClientRect()) : [];
            fixed = [...document.querySelectorAll('[data-quiet="fixed"]')].map((el) =>
                el.getBoundingClientRect(),
            );
            canvasTop = rect.top + window.scrollY;
            canvasLeft = rect.left;
            sectionTop = docTop(section);
            if (takeover) {
                const all = [...document.querySelectorAll<HTMLCanvasElement>("canvas[data-wave]")];
                const i = all.indexOf(canvas);
                prev = neighbour(all[i - 1], rect);
                next = neighbour(all[i + 1], rect);
            }
            painter.invalidate();
        };

        const paint = (time: number) => {
            if (!ready) return;
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            const top = sticky ? canvas.getBoundingClientRect().top : canvasTop - scrollY;
            const quietNow = fixed.length
                ? [
                      ...boxes,
                      // fixed furniture (the chapter rail) floats over every section
                      ...fixed.map((r) => ({
                          l: r.left - canvasLeft,
                          t: r.top - top,
                          r: r.right - canvasLeft,
                          b: r.bottom - top,
                          soft: true,
                      })),
                  ]
                : boxes;
            const progress = (docY: number) =>
                clamp01((vh * TAKE_FROM - (docY - scrollY)) / (vh * (TAKE_FROM - TAKE_TO)));
            const wave: WaveFrame | undefined = takeover
                ? {
                      prev,
                      next,
                      tIn: prev ? progress(sectionTop) : 1,
                      tOut: next ? progress(next.top) : 0,
                      top,
                      vh,
                      col: Math.round((canvasLeft + painter.origin.x) / CELL),
                      row: Math.round((top + scrollY + painter.origin.y) / CELL),
                  }
                : undefined;
            painter.draw({
                quiet: quietNow,
                time,
                animate,
                beam: beam ? 1 : 0,
                pointer: amt > 0 ? { x: px, y: py, amt } : undefined,
                wave,
                // only the rows on screen (and a little either side)
                view: { top: -top - CELL * 2, bottom: vh - top + CELL * 2 },
            });
        };

        /** Lay out and paint on the next frame (resizes and font loads come in bursts). */
        const relayout = () => {
            if (pending || !near) return;
            pending = requestAnimationFrame((t) => {
                pending = 0;
                if (!near) return;
                layout();
                paint(t);
            });
        };

        const tick = (t: number) => {
            frame = 0;
            if (!visible || !animate) return;
            const y = window.scrollY;
            const moving = over || amt > 0 || (beam && beamSweeping(t));
            if (y !== lastY || t - last >= (moving ? MOVING_MS : IDLE_MS)) {
                last = t;
                lastY = y;
                amt += ((over ? 1 : 0) - amt) * 0.2;
                if (amt < 0.01 && !over) amt = 0;
                paint(t);
            }
            frame = requestAnimationFrame(tick);
        };

        // near the screen: hold pixels and stay laid out; far away: let them go
        const keep = new IntersectionObserver(
            ([entry]) => {
                near = !!entry?.isIntersecting;
                if (near) relayout();
                else if (ready) {
                    painter.release();
                    ready = false;
                }
            },
            { rootMargin: KEEP_MARGIN },
        );
        keep.observe(host);
        // on screen: run the frame loop
        const show = new IntersectionObserver(([entry]) => {
            visible = !!entry?.isIntersecting;
            if (visible && !frame) frame = requestAnimationFrame(tick);
            // without motion, a still frame is redrawn when it comes into view (rows on screen only)
            if (visible && !animate) relayout();
        });
        show.observe(host);

        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(relayout) : null;
        ro?.observe(host);
        // the page lattice depends on where the section sits, so any change above it matters
        ro?.observe(document.body);
        void document.fonts?.ready.then(relayout);
        // without motion nothing redraws per frame, so a scroll repaints the rows coming in
        const onScroll = () => {
            if (!visible || frame) return;
            frame = requestAnimationFrame((t) => {
                frame = 0;
                paint(t);
            });
        };
        if (!animate) window.addEventListener("scroll", onScroll, { passive: true });

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
            cancelAnimationFrame(pending);
            keep.disconnect();
            show.disconnect();
            ro?.disconnect();
            window.removeEventListener("scroll", onScroll);
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
        };
    }, [composition, beam, pointer, quiet, dots, soften, pinned, wave]);

    return (
        <canvas
            ref={ref}
            className={cx("bc-print", className)}
            data-wave={wave ? "" : undefined}
            aria-hidden="true"
        />
    );
}
