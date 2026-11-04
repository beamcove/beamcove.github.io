import { useEffect, useRef, useState } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { CELL, elementLattice, restingRect } from "../glyph/lattice";
import { motionAllowed } from "../glyph/motion";
import {
    beamSweeping,
    createPainter,
    geometry,
    type Neighbour,
    readEnv,
    type Rect,
    type StoryFrame,
    type WaveFrame,
    WAVE_BAND,
} from "../glyph/painter";
import { quietRects, quietSources } from "../glyph/quiet";
import { canPaintOffThread, handedOver, remotePainter } from "../glyph/remote-painter";
import { cx } from "./cx";
import { cancelFrame, type FrameView, nextFrame } from "./frame-loop";

/** Run `fn` when the page has a moment (no requestIdleCallback in Safari: a short timeout). */
const whenIdle = (fn: () => void): number =>
    typeof requestIdleCallback === "function"
        ? requestIdleCallback(fn, { timeout: 1000 })
        : window.setTimeout(fn, 200);
const cancelIdle = (id: number) => {
    if (!id) return;
    if (typeof cancelIdleCallback === "function") cancelIdleCallback(id);
    else clearTimeout(id);
};

// frame pacing: the shimmer is slow, so 12fps is plenty; the beam and the pointer
// light move, so they get 30fps; a scroll redraws on the very next frame
const IDLE_MS = 1000 / 12;
const MOVING_MS = 1000 / 30;
// 1.5 device px per CSS px is crisp enough for 16px glyphs and keeps canvases light
const MAX_DPR = 1.5;
// canvases more than half a screen away give their pixels back (a canvas is
// width × height × 4 bytes); half a screen is still well ahead of a fast fling
const KEEP_MARGIN = "50% 0px";
// the takeover: it starts as a section's top passes 90% of the screen, and is done at 20%
const TAKE_FROM = 0.9;
const TAKE_TO = 0.2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// the scene each section's canvas prints, so neighbours can print it too
const SCENES = new WeakMap<HTMLCanvasElement, GlyphComposition>();

/**
 * The mouse, on screen, shared by every field. Each field turns it into its
 * own coordinates every frame, so the light stays under the cursor while the
 * page scrolls beneath a still mouse. Touch doesn't light anything.
 */
const POINTER = { x: 0, y: 0, in: false, listening: false };
function trackPointer() {
    if (POINTER.listening) return;
    POINTER.listening = true;
    window.addEventListener(
        "pointermove",
        (e) => {
            if (e.pointerType === "touch") return;
            POINTER.x = e.clientX;
            POINTER.y = e.clientY;
            POINTER.in = true;
        },
        { passive: true },
    );
    const out = () => {
        POINTER.in = false;
    };
    document.documentElement.addEventListener("pointerleave", out);
    window.addEventListener("blur", out);
}

/** Where an element's top sits in the document at rest (stable while scrolling). */
const docTop = (el: Element) => restingRect(el).top + window.scrollY;

/**
 * A page-wide story at one moment, in screen px (see `StoryFrame`, which is the
 * same in a canvas's px). `sky.horizon` is a fraction of the field's height:
 * the sky belongs to its section. `moving` keeps the frame rate up while
 * something moves on its own (a flash).
 */
export interface Story extends Omit<StoryFrame, "sky"> {
    sky?: { amt: number; horizon: number };
    moving?: boolean;
}
/** Where the page is, for a story to work out what to show. */
export interface StoryMoment {
    scrollY: number;
    vh: number;
    vw: number;
    time: number;
}

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
     * the screen, its scene sweeps over this one on a dense wave, bottom first, and
     * this scene carries on into the next section until then. Default false.
     */
    wave?: boolean;
    /** A page-wide story told across sections (motion only); called once per frame. */
    story?: (now: StoryMoment) => Story | null;
    className?: string;
}

/**
 * One glyph scene printed on a canvas that fills its positioned parent, its
 * cells snapped to the page lattice so they sit exactly over the page dots.
 * It shimmers while visible; with `wave`, neighbouring scenes take over from
 * each other as you scroll. With motion off it prints one still frame.
 *
 * It only holds pixels while near the screen, only redraws the rows on
 * screen, and reads the layout once per resize, not per frame. Where the
 * browser can (OffscreenCanvas), the painting runs in a worker: the page only
 * measures and says what to draw, so a busy frame never holds up scrolling.
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
    story,
    className,
}: FieldProps) {
    const ref = useRef<HTMLCanvasElement>(null);
    // bumped if the worker goes down: a fresh canvas, painted on the main thread
    const [canvasKey, setCanvasKey] = useState(0);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof IntersectionObserver === "undefined") return;
        // the props changed after the canvas went to the worker: start again on a fresh one
        if (handedOver(canvas)) {
            setCanvasKey((k) => k + 1);
            return;
        }
        const env = readEnv(canvas);
        const opts = { dots, soften };
        const remote = canPaintOffThread(canvas)
            ? remotePainter(canvas, composition, opts, env, () => setCanvasKey((k) => k + 1))
            : null;
        const painter = remote ?? createPainter(canvas, composition, opts, env);
        if (!painter) return;
        const animate = motionAllowed();
        const takeover = wave && animate;
        if (wave) SCENES.set(canvas, composition);
        // a pinned canvas rides a sticky frame: its place on screen follows from the frame's
        const frameEl = canvas.closest<HTMLElement>(".bc-pin-frame");
        const section = canvas.closest<HTMLElement>("[data-scene]") ?? host;

        let near = false;
        let visible = false;
        let ready = false;
        let size = "";
        let looping = false;
        let pending = 0;
        let idle = 0;
        let last = 0;
        let lastY = NaN;
        let px = 0;
        let py = 0;
        let amt = 0;

        /**
         * Everything this field reads from the layout, in document px where it can be,
         * so scrolling never has to read it again. Measured when the page is idle, and
         * again only when something resizes (`stale`).
         */
        interface Geometry {
            width: number;
            height: number;
            offset: { x: number; y: number };
            key: string;
            origin: { x: number; y: number };
            canvasTop: number;
            canvasLeft: number;
            sectionTop: number;
            /** A pinned canvas: its frame's sticky top, height, natural top, the section's end, and the canvas's place in the frame. */
            pin: { stick: number; height: number; top: number; end: number; inset: number } | null;
            boxes: Rect[];
            fixed: { left: number; top: number; right: number; bottom: number }[];
            prev: (Neighbour & { top: number }) | null;
            next: (Neighbour & { top: number }) | null;
        }
        let geo: Geometry | null = null;
        let stale = true;

        /** A neighbour's scene as this canvas prints it, its noise carried on across the edge. */
        const neighbour = (
            other: HTMLCanvasElement | undefined,
            mine: { left: number; top: number },
            origin: { x: number; y: number },
        ): (Neighbour & { top: number }) | null => {
            const comp = other && SCENES.get(other);
            if (!other || !comp) return null;
            const theirs = restingRect(other);
            const lattice = other.closest(".bc-pin-frame")
                ? { x: elementLattice(other).x, y: 0 }
                : elementLattice(other);
            const at = {
                c: Math.round((mine.left + origin.x - (theirs.left + lattice.x)) / CELL),
                r: Math.round((mine.top + origin.y - (theirs.top + lattice.y)) / CELL),
            };
            return { comp, at, top: docTop(other.closest("[data-scene]") ?? other) };
        };

        /** Read the layout (the only place this field does). */
        const measure = () => {
            const rect = restingRect(canvas);
            // measure the canvas itself: it fills the host's padding box, inside any border
            const lattice = elementLattice(canvas);
            const offset = pinned ? { x: lattice.x, y: 0 } : lattice;
            const width = host.clientWidth;
            const height = host.clientHeight;
            const g = geometry(width, height, offset, MAX_DPR, env.dpr);
            const origin = { x: g.ox, y: g.oy };
            const sectionTop = docTop(section);
            let pin: Geometry["pin"] = null;
            if (frameEl) {
                const f = restingRect(frameEl);
                pin = {
                    stick: parseFloat(getComputedStyle(frameEl).top) || 0,
                    height: frameEl.offsetHeight,
                    top: sectionTop,
                    end: sectionTop + section.offsetHeight,
                    inset: rect.top - f.top,
                };
            }
            let prev = null;
            let next = null;
            if (takeover) {
                const all = [...document.querySelectorAll<HTMLCanvasElement>("canvas[data-wave]")];
                const i = all.indexOf(canvas);
                prev = neighbour(all[i - 1], rect, origin);
                next = neighbour(all[i + 1], rect, origin);
            }
            geo = {
                width,
                height,
                offset,
                key: `${width}x${height}@${offset.x},${offset.y}`,
                origin,
                canvasTop: rect.top + window.scrollY,
                canvasLeft: rect.left,
                sectionTop,
                pin,
                boxes: quiet ? quietRects(host, rect) : [],
                fixed: [...document.querySelectorAll('[data-quiet="fixed"]')].map((el) =>
                    el.getBoundingClientRect(),
                ),
                prev,
                next,
            };
            stale = false;
        };

        /** Hand the measured layout to the painter (no reads): size the canvas, set the scene. */
        const apply = () => {
            if (!geo) return;
            if (!ready || geo.key !== size) {
                painter.resize(geo.width, geo.height, geo.offset, MAX_DPR);
                canvas.dataset.lattice = `${geo.origin.x},${geo.origin.y}`;
                size = geo.key;
                ready = true;
            }
            const scene = (n: Geometry["prev"]) => n && { comp: n.comp, at: n.at };
            painter.layout(geo.boxes, scene(geo.prev), scene(geo.next));
        };

        /** The canvas's top on screen at a scroll position. */
        const topAt = (g: Geometry, scrollY: number) => {
            if (!g.pin) return g.canvasTop - scrollY;
            // sticky: in its place until it reaches its top, then held until the section's end carries it off
            const { stick, height, top, end, inset } = g.pin;
            return Math.min(Math.max(top - scrollY, stick), end - height - scrollY) + inset;
        };

        const paint = (view: FrameView) => {
            const g = geo;
            if (!ready || !g) return;
            const { t: time, scrollY, vh } = view;
            const top = topAt(g, scrollY);
            // fixed furniture (the chapter rail) floats over every section
            const live = g.fixed.map((r) => ({
                l: r.left - g.canvasLeft,
                t: r.top - top,
                r: r.right - g.canvasLeft,
                b: r.bottom - top,
                soft: true,
            }));
            // 0 → 1 turns every cell over; on to 1 + WAVE_BAND carries the dense band off the top
            const progress = (docY: number) =>
                clamp01((vh * TAKE_FROM - (docY - scrollY)) / (vh * (TAKE_FROM - TAKE_TO))) *
                (1 + WAVE_BAND);
            const wave: WaveFrame | undefined = takeover
                ? {
                      tIn: g.prev ? progress(g.sectionTop) : 1,
                      tOut: g.next ? progress(g.next.top) : 0,
                      top,
                      vh,
                      col: Math.round((g.canvasLeft + g.origin.x) / CELL),
                      row: Math.round((top + scrollY + g.origin.y) / CELL),
                  }
                : undefined;
            painter.draw({
                story: storyFrame(view, g, top),
                live,
                time,
                animate,
                beam: beam ? 1 : 0,
                pointer: amt > 0 ? { x: px, y: py, amt } : undefined,
                wave,
                // only the rows on screen (and a little either side)
                view: { top: -top - CELL * 2, bottom: vh - top + CELL * 2 },
            });
        };

        // the light leaves an afterglow, so frames keep coming for a while after it moves
        let storyUntil = 0;
        let storyLastY = NaN;
        let storyMoving = false;
        /** The story now, in this canvas's px. */
        const storyFrame = (view: FrameView, g: Geometry, top: number) => {
            const s = animate
                ? story?.({ scrollY: view.scrollY, vh: view.vh, vw: view.vw, time: view.t })
                : null;
            if (!s) return undefined;
            if (view.scrollY !== storyLastY) {
                storyLastY = view.scrollY;
                storyUntil = view.t + (s.afterglow ?? 0);
            }
            const frame: StoryFrame = {
                afterglow: s.afterglow,
                marks: s.marks,
                beacons: s.beacons,
            };
            if (s.light)
                frame.light = { ...s.light, x: s.light.x - g.canvasLeft, y: s.light.y - top };
            if (s.swell) frame.swell = { amt: s.swell.amt, horizon: s.swell.horizon - top };
            if (s.sky) frame.sky = { amt: s.sky.amt, horizon: s.sky.horizon * g.height };
            storyMoving = !!s.moving || view.t < storyUntil;
            return frame;
        };

        /** Paint once on the next frame (a still frame, or a canvas just made ready). */
        const paintOnce = (view: FrameView) => paint(view);

        /** Something moved the layout: measure again (now if this field is near the screen, else when idle). */
        const invalidate = () => {
            stale = true;
            if (near) relayout();
            else if (!idle)
                idle = whenIdle(() => {
                    idle = 0;
                    if (stale) measure();
                });
        };

        /** Measure, size and paint on the next frame (resizes and font loads come in bursts). */
        const relayout = () => {
            if (pending || !near) return;
            pending = requestAnimationFrame(() => {
                pending = 0;
                if (!near) return;
                if (stale || !geo) measure();
                apply();
                nextFrame(paintOnce);
            });
        };

        /** Is the mouse over this field right now? Updates the light's spot, in canvas px. */
        const pointerOver = (g: Geometry, scrollY: number) => {
            if (!pointer || !POINTER.in) return false;
            px = POINTER.x - g.canvasLeft;
            py = POINTER.y - topAt(g, scrollY);
            return px >= 0 && py >= 0 && px < g.width && py < g.height;
        };

        const tick = (view: FrameView) => {
            looping = false;
            if (!visible || !animate) return;
            const { t, scrollY } = view;
            const over = geo ? pointerOver(geo, scrollY) : false;
            const moving = over || amt > 0 || (beam && beamSweeping(t)) || storyMoving;
            if (scrollY !== lastY || t - last >= (moving ? MOVING_MS : IDLE_MS)) {
                last = t;
                lastY = scrollY;
                amt += ((over ? 1 : 0) - amt) * 0.2;
                if (amt < 0.01 && !over) amt = 0;
                paint(view);
            }
            looping = true;
            nextFrame(tick);
        };

        // near the screen: hold pixels and stay laid out; far away: let them go. Coming near
        // reuses the measured layout, so scrolling a section into range reads nothing.
        const keep = new IntersectionObserver(
            ([entry]) => {
                near = !!entry?.isIntersecting;
                if (near) {
                    if (stale || !geo) relayout();
                    else {
                        apply();
                        nextFrame(paintOnce);
                    }
                } else if (ready) {
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
            if (visible && animate && !looping) {
                looping = true;
                nextFrame(tick);
            }
            // without motion, a still frame is redrawn when it comes into view (rows on screen only)
            if (visible && !animate) relayout();
        });
        show.observe(host);

        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(invalidate) : null;
        ro?.observe(host);
        // the page lattice depends on where the section sits, so any change above it matters
        ro?.observe(document.body);
        // the copy can change size inside a section that doesn't (an answer opening, a font
        // arriving, the form turning into a thank-you), and the quiet zones have to follow it
        if (quiet) for (const el of quietSources(host)) ro?.observe(el);
        // fixed furniture (the chapter rail) changes size on its own, a font arriving say,
        // without the page changing size
        for (const el of document.querySelectorAll('[data-quiet="fixed"]')) ro?.observe(el);
        void document.fonts?.ready.then(invalidate);
        // without motion nothing redraws per frame, so a scroll repaints the rows coming in
        const onScroll = () => {
            if (visible) nextFrame(paintOnce);
        };
        if (!animate) window.addEventListener("scroll", onScroll, { passive: true });

        if (animate && pointer) trackPointer();

        return () => {
            cancelFrame(tick);
            cancelFrame(paintOnce);
            cancelAnimationFrame(pending);
            cancelIdle(idle);
            keep.disconnect();
            show.disconnect();
            ro?.disconnect();
            window.removeEventListener("scroll", onScroll);
            remote?.remove();
        };
    }, [composition, beam, pointer, quiet, dots, soften, pinned, wave, story, canvasKey]);

    return (
        <canvas
            key={canvasKey}
            ref={ref}
            className={cx("bc-print", className)}
            data-wave={wave ? "" : undefined}
            aria-hidden="true"
        />
    );
}
