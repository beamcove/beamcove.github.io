import { useEffect, useRef } from "react";

import { buildAtlasRow } from "../glyph/draw";
import { buildField, glyphFor, RAMPS, type Field, type GlyphComposition } from "../glyph/engine";
import { motionAllowed } from "../glyph/motion";

const SWEEP_MS = 3600; // one pass of the beam
const PAUSE_MS = 4400; // dark time between passes
const BAND = 110; // half-width of the beam, px
const SLANT = 0.45; // how far the beam leans
const POINTER_RADIUS = 130;
const SHIMMER = 0.07; // how far a cell's value drifts
const FRAME_MS = 1000 / 30;

export interface GlyphFieldProps {
    composition: GlyphComposition;
    /** The lighthouse: a beam sweeps across now and then. */
    beam?: boolean;
    /** Glyphs light up under the pointer; default true. */
    pointer?: boolean;
    /** Keep glyphs sparse behind `.bc-splash-content`; default true. */
    quiet?: boolean;
    className?: string;
}

/**
 * A field of glyphs on a canvas that fills its parent, which should be a
 * `.bc-glyphs` surface (a Splash, a card strip). Glyphs shimmer slowly, a
 * beam can sweep across, and the pointer lights them up. With motion off it
 * draws one still frame. Colours come from the ink slot tokens.
 */
export function GlyphField({
    composition,
    beam = false,
    pointer = true,
    quiet = true,
    className,
}: GlyphFieldProps) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof ResizeObserver === "undefined") return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const glyphs = RAMPS[composition.ramp];
        const cell = composition.cell ?? 16;
        const animate = motionAllowed();

        let w = 0;
        let h = 0;
        let dpr = 1;
        let ox = 0;
        let oy = 0;
        let field: Field | null = null;
        let inkRows: HTMLCanvasElement[] = [];
        let litRow: HTMLCanvasElement | null = null;
        let dimRow: HTMLCanvasElement | null = null;
        let blockColors: Record<string, string> = {};
        let blend: GlobalCompositeOperation = "screen";
        let blockAlpha = 0.72;
        let quietRect = { l: 0, t: 0, r: 0, b: 0 };
        let px = -9999;
        let py = -9999;
        let pointerAmt = 0;
        let pointerOn = false;

        const paint = () => {
            const cs = getComputedStyle(host);
            const read = (name: string, fallback: string) =>
                cs.getPropertyValue(name).trim() || fallback;
            const size = Math.round(cell * dpr);
            inkRows = composition.inks.map((slot) =>
                buildAtlasRow(glyphs, read(`--ink-${slot}`, "#c8ff1a"), size),
            );
            litRow = buildAtlasRow(glyphs, read("--ink", "#ffffff"), size);
            dimRow = buildAtlasRow(["dot"], read("--glyph-dim", "#333333"), size);
            blockColors = {};
            for (const b of composition.blocks ?? [])
                blockColors[b.ink] = read(`--ink-${b.ink}`, "#c8ff1a");
            blend = read("--glyph-blend", "screen") === "multiply" ? "multiply" : "screen";
            blockAlpha = parseFloat(read("--glyph-block-alpha", "0.72")) || 0.72;
        };

        const layout = () => {
            w = host.clientWidth;
            h = host.clientHeight;
            dpr = Math.min(2, window.devicePixelRatio || 1);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            const cols = Math.max(1, Math.floor(w / cell));
            const rows = Math.max(1, Math.floor(h / cell));
            ox = Math.floor((w - cols * cell) / 2);
            oy = Math.floor((h - rows * cell) / 2);
            field = buildField(composition, cols, rows);
            const content = quiet ? host.querySelector<HTMLElement>(".bc-splash-content") : null;
            if (content) {
                const hr = host.getBoundingClientRect();
                const cr = content.getBoundingClientRect();
                const pad = 24;
                quietRect = {
                    l: cr.left - hr.left - pad,
                    t: cr.top - hr.top - pad,
                    r: cr.right - hr.left + pad,
                    b: cr.bottom - hr.top + pad,
                };
            } else {
                quietRect = { l: 0, t: 0, r: 0, b: 0 };
            }
            paint();
        };

        const draw = (t: number) => {
            if (!field || !litRow || !dimRow) return;
            const f = field;
            const size = Math.round(cell * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // beam position: a slanted band crossing left to right, then a pause
            let bx = -1e9;
            if (beam && animate) {
                const p = ((t + 900) % (SWEEP_MS + PAUSE_MS)) / SWEEP_MS;
                if (p <= 1) bx = -BAND * 2 + (w + BAND * 4) * p;
            }

            for (let r = 0; r < f.rows; r++) {
                const y = oy + r * cell;
                const ccy = y + cell / 2;
                for (let c = 0; c < f.cols; c++) {
                    const i = r * f.cols + c;
                    if (f.covered[i]) continue;
                    const x = ox + c * cell;
                    const ccx = x + cell / 2;

                    let boost = 0;
                    if (bx > -1e8) {
                        const d = Math.abs(ccx - bx + (ccy - h / 2) * SLANT);
                        if (d < BAND) boost = (1 - d / BAND) ** 2;
                    }
                    if (pointerAmt > 0) {
                        const d = Math.hypot(ccx - px, ccy - py);
                        if (d < POINTER_RADIUS)
                            boost = Math.max(boost, (1 - d / POINTER_RADIUS) ** 2 * pointerAmt);
                    }
                    let v =
                        f.base[i]! + (animate ? SHIMMER * Math.sin(t * 0.0014 + f.phase[i]!) : 0);
                    const inQuiet =
                        ccx > quietRect.l &&
                        ccx < quietRect.r &&
                        ccy > quietRect.t &&
                        ccy < quietRect.b;
                    if (inQuiet) {
                        v *= 0.3;
                        boost *= 0.35;
                    }
                    v += boost * 0.65;

                    const { step, level } = glyphFor(v, composition.density, glyphs.length);
                    if (step < 0) {
                        ctx.globalAlpha = 1;
                        ctx.drawImage(dimRow, 0, 0, size, size, x, y, cell, cell);
                        continue;
                    }
                    const lit = boost > 0.3;
                    const row = lit ? litRow : (inkRows[f.zone[i]!] ?? inkRows[0]!);
                    ctx.globalAlpha = lit ? 1 : inQuiet ? 0.35 : 0.4 + 0.6 * level;
                    ctx.drawImage(row, step * size, 0, size, size, x, y, cell, cell);
                }
            }

            // ink blocks, overprinting where they cross
            ctx.globalAlpha = blockAlpha;
            ctx.globalCompositeOperation = blend;
            for (const b of f.blocks) {
                ctx.fillStyle = blockColors[b.ink] ?? "#c8ff1a";
                // blocks that reach the grid's edge bleed off the surface, like a trimmed print
                const x0 = b.c0 === 0 ? 0 : ox + b.c0 * cell;
                const y0 = b.r0 === 0 ? 0 : oy + b.r0 * cell;
                const x1 = b.c1 === f.cols ? w : ox + b.c1 * cell;
                let y1 = b.r1 === f.rows ? h : oy + b.r1 * cell;
                // ink never prints under the copy: trim a block to the row above it
                const q = quietRect;
                if (q.r > q.l && x0 < q.r && x1 > q.l && y0 < q.b && y1 > q.t) {
                    y1 = oy + Math.floor((q.t - oy) / cell) * cell;
                }
                if (y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
            }
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
        };

        let frame = 0;
        let last = 0;
        let visible = true;
        const loop = (t: number) => {
            frame = 0;
            if (!visible) return;
            if (t - last >= FRAME_MS) {
                last = t;
                const target = pointerOn ? 1 : 0;
                pointerAmt += (target - pointerAmt) * 0.18;
                if (pointerAmt < 0.01) pointerAmt = target ? pointerAmt : 0;
                draw(t);
            }
            frame = requestAnimationFrame(loop);
        };
        const start = () => {
            if (animate && !frame) frame = requestAnimationFrame(loop);
        };
        const redraw = () => {
            layout();
            draw(performance.now());
        };

        redraw();
        host.setAttribute("data-live", "");

        const ro = new ResizeObserver(redraw);
        ro.observe(host);
        const content = host.querySelector(".bc-splash-content");
        if (content) ro.observe(content);

        let io: IntersectionObserver | undefined;
        if (animate && typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver(([entry]) => {
                visible = !!entry?.isIntersecting;
                if (visible) start();
            });
            io.observe(host);
        }
        start();

        const onMove = (e: PointerEvent) => {
            const r = host.getBoundingClientRect();
            px = e.clientX - r.left;
            py = e.clientY - r.top;
            pointerOn = true;
        };
        const onLeave = () => {
            pointerOn = false;
        };
        if (pointer && animate) {
            host.addEventListener("pointermove", onMove);
            host.addEventListener("pointerleave", onLeave);
        }

        return () => {
            cancelAnimationFrame(frame);
            ro.disconnect();
            io?.disconnect();
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
            host.removeAttribute("data-live");
        };
    }, [composition, beam, pointer, quiet]);

    return (
        <canvas
            ref={ref}
            className={["bc-glyph-field", className].filter(Boolean).join(" ")}
            aria-hidden="true"
        />
    );
}
