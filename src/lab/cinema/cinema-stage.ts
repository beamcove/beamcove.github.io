import { buildAtlasRow } from "@/design-system/glyph/draw";
import {
    buildField,
    glyphFor,
    hash,
    RAMPS,
    type Field,
    type GlyphComposition,
    type RampName,
} from "@/design-system/glyph/engine";

/** A box in canvas CSS px that the art stays quiet behind (the copy). */
export interface Rect {
    l: number;
    t: number;
    r: number;
    b: number;
    /** Only thin the glyphs here; ink blocks may still print. */
    soft?: boolean;
}

export interface StageFrame {
    /** The scene on screen, and the next one dissolving in by `t` (0–1). */
    a: GlyphComposition;
    b: GlyphComposition | null;
    t: number;
    quiet: Rect[];
    time: number;
    animate: boolean;
    /** How much of the lighthouse beam to show, 0–1. */
    beam: number;
}

const CELL = 16;
// around the copy: fully quiet within PAD, the art returns over FADE, and ink
// blocks keep CLEAR away (tighter on phones, where the copy fills the width)
const QUIET = { wide: [20, 72, 40], narrow: [8, 32, 20] } as const;
const SWEEP_MS = 4200;
const PAUSE_MS = 3800;
const BAND = 120;
const SLANT = 0.45;
const BLOCK_ALPHA = 0.72;

/** Where a cell flips to the next scene: bottom rows first, with grain. */
const flipAt = (c: number, r: number, rows: number) =>
    (1 - r / Math.max(1, rows - 1)) * 0.6 + hash(c, r, 5) * 0.4;

/**
 * Draws glyph fields onto a canvas, cell-aligned to its top left. One
 * painter serves both the fixed stage (dissolving between scenes, with
 * shimmer and the beam) and the still prints of the no-motion layout.
 */
export function createPainter(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const c2d = ctx;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    const fields = new Map<GlyphComposition, Field>();
    const atlas = new Map<string, HTMLCanvasElement>();
    let blend: GlobalCompositeOperation = "screen";
    const colors = new Map<string, string>();
    const inkColor = (slot: string) => {
        let color = colors.get(slot);
        if (!color) {
            const name =
                slot === "lit" ? "--ink" : slot === "dim" ? "--glyph-dim" : `--ink-${slot}`;
            color = getComputedStyle(canvas).getPropertyValue(name).trim() || "#8fa2ff";
            colors.set(slot, color);
        }
        return color;
    };

    const row = (ramp: RampName, slot: string) => {
        const key = `${ramp}:${slot}`;
        let out = atlas.get(key);
        if (!out) {
            out = buildAtlasRow(slot === "dim" ? ["dot"] : RAMPS[ramp], inkColor(slot), CELL * dpr);
            atlas.set(key, out);
        }
        return out;
    };

    const field = (c: GlyphComposition) => {
        let f = fields.get(c);
        if (!f) {
            f = buildField(c, cols, rows);
            fields.set(c, f);
        }
        return f;
    };

    const resize = (width: number, height: number, maxDpr: number) => {
        w = width;
        h = height;
        // keep a cell a whole number of device pixels, so block cells meet without seams
        dpr = Math.max(1, Math.round(Math.min(maxDpr, window.devicePixelRatio || 1) * 4) / 4);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        cols = Math.max(1, Math.ceil(w / CELL));
        rows = Math.max(1, Math.ceil(h / CELL));
        fields.clear();
        atlas.clear();
        colors.clear();
        blend =
            getComputedStyle(canvas).getPropertyValue("--glyph-blend").trim() === "multiply"
                ? "multiply"
                : "screen";
    };

    const fills: [number, number, string][] = [];

    const draw = (fr: StageFrame) => {
        c2d.setTransform(1, 0, 0, 1, 0, 0);
        c2d.clearRect(0, 0, canvas.width, canvas.height);
        c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        const fa = field(fr.a);
        const fb = fr.b ? field(fr.b) : null;
        const size = CELL * dpr;
        const dim = row("signal", "dim");
        const [PAD, FADE, CLEAR] = w < 600 ? QUIET.narrow : QUIET.wide;
        const quiet = fr.quiet.filter((q) => q.b > -FADE && q.t < h + FADE);

        let bx = -1e9;
        if (fr.beam > 0.02 && fr.animate) {
            const p = ((fr.time + 600) % (SWEEP_MS + PAUSE_MS)) / SWEEP_MS;
            if (p <= 1) bx = -BAND * 2 + (w + BAND * 4) * p;
        }
        fills.length = 0;

        for (let r = 0; r < rows; r++) {
            const y = r * CELL;
            const cy = y + CELL / 2;
            for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                const x = c * CELL;
                const cx = x + CELL / 2;
                const key = fb ? flipAt(c, r, rows) - fr.t : 1;
                const inB = fb !== null && key < 0;
                const comp = inB ? fr.b! : fr.a;
                const f = inB ? fb : fa;

                let q = 0;
                let clear = true;
                for (const rect of quiet) {
                    // distance from the cell's edge to the box
                    const d = Math.max(
                        rect.l - x - CELL,
                        x - rect.r,
                        rect.t - y - CELL,
                        y - rect.b,
                        0,
                    );
                    q = Math.max(q, d <= PAD ? 1 : d < PAD + FADE ? 1 - (d - PAD) / FADE : 0);
                    if (d < CLEAR && !rect.soft) clear = false;
                }

                if (f.covered[i] && clear) {
                    for (const b of f.blocks) {
                        if (c >= b.c0 && c < b.c1 && r >= b.r0 && r < b.r1)
                            fills.push([x, y, b.ink]);
                    }
                    continue;
                }

                let boost = 0;
                if (bx > -1e8) {
                    const d = Math.abs(cx - bx + (cy - h / 2) * SLANT);
                    if (d < BAND) boost = (1 - d / BAND) ** 2 * fr.beam;
                }
                // the dissolve front: a thin lit seam where cells are turning over
                if (fb && key >= 0 && key < 0.035 && fr.t > 0.02 && fr.t < 0.98) boost = 0.5;
                let v =
                    f.base[i]! + (fr.animate ? 0.06 * Math.sin(fr.time * 0.0013 + f.phase[i]!) : 0);
                v *= 1 - 0.75 * q;
                boost *= 1 - 0.7 * q;
                v += boost * 0.6;

                const glyphs = RAMPS[comp.ramp];
                const { step, level } = glyphFor(v, comp.density, glyphs.length);
                if (step < 0) {
                    c2d.globalAlpha = 1;
                    c2d.drawImage(dim, 0, 0, size, size, x, y, CELL, CELL);
                    continue;
                }
                const lit = boost > 0.3;
                const slot = lit ? "lit" : (comp.inks[f.zone[i]!] ?? comp.inks[0]!);
                c2d.globalAlpha = lit ? 0.85 : (0.3 + 0.55 * level) * (1 - 0.6 * q);
                c2d.drawImage(row(comp.ramp, slot), step * size, 0, size, size, x, y, CELL, CELL);
            }
        }

        // ink blocks, cell by cell, overprinting where two cross
        c2d.globalAlpha = BLOCK_ALPHA;
        c2d.globalCompositeOperation = blend;
        let last = "";
        for (const [x, y, ink] of fills) {
            if (ink !== last) {
                c2d.fillStyle = inkColor(ink);
                last = ink;
            }
            c2d.fillRect(x, y, CELL, CELL);
        }
        c2d.globalCompositeOperation = "source-over";
        c2d.globalAlpha = 1;
    };

    return { resize, draw };
}

/** The boxes of the quiet elements under `root`, relative to `origin`'s top left. */
export function quietRects(root: ParentNode, origin: { left: number; top: number }): Rect[] {
    return [...root.querySelectorAll<HTMLElement>("[data-quiet]")].map((el) => {
        const r = el.getBoundingClientRect();
        return {
            l: r.left - origin.left,
            t: r.top - origin.top,
            r: r.right - origin.left,
            b: r.bottom - origin.top,
            soft: el.dataset.quiet === "soft",
        };
    });
}
