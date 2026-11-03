import { buildAtlasRow } from "./draw";
import {
    buildField,
    glyphFor,
    RAMPS,
    type Field,
    type GlyphComposition,
    type RampName,
} from "./engine";
import { CELL } from "./lattice";

/** A box in canvas CSS px that the art stays quiet behind (the copy). */
export interface Rect {
    l: number;
    t: number;
    r: number;
    b: number;
    /** Only thin the glyphs here; ink blocks may still print. */
    soft?: boolean;
}

export interface FieldFrame {
    quiet: Rect[];
    time: number;
    animate: boolean;
    /** How much of the lighthouse beam to show, 0–1. */
    beam: number;
    /** The pointer, in canvas CSS px, and how lit it is (0–1). */
    pointer?: { x: number; y: number; amt: number };
    /** Print-in: rows up to this one are printed (Infinity: all). */
    head: number;
}

export interface FieldOptions {
    /** Draw the resting dots too (fields on an opaque surface); the page has them otherwise. */
    dots: boolean;
    /** Thin the art over the top and bottom rows, where neighbouring sections meet. */
    soften: boolean;
}

// around the copy: fully quiet within PAD, the art returns over FADE, and ink
// blocks that come closer than CLEAR don't print at all (tighter on phones)
const QUIET = { wide: [20, 72, 40], narrow: [8, 32, 16] } as const;
const SWEEP_MS = 4200;
const PAUSE_MS = 3800;
const BAND = 120;
const SLANT = 0.45;
const POINTER_RADIUS = 140;

/** "#rrggbb" → [r, g, b]; anything else → null. */
function rgb(color: string): [number, number, number] | null {
    const m = /^#([0-9a-f]{6})/i.exec(color.trim());
    if (!m) return null;
    const n = parseInt(m[1]!, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** An ink printed at `alpha` over `paper`, as an opaque colour. */
function overprint(ink: string, paper: string, alpha: number) {
    const a = rgb(ink);
    const b = rgb(paper);
    if (!a || !b) return ink;
    const mix = a.map((v, i) => Math.round(v * alpha + b[i]! * (1 - alpha)));
    return `rgb(${mix.join(",")})`;
}

/**
 * Prints one glyph scene onto a canvas, on the page lattice. The canvas
 * belongs to one element (a section, a card strip); its cells start at the
 * lattice offset, so they sit exactly over the page's dots. Glyphs thin out
 * around every quiet box (the copy); ink blocks print whole, or not at all
 * if they would come too close to it, so text never sits on ink.
 */
export function createPainter(
    canvas: HTMLCanvasElement,
    comp: GlyphComposition,
    opts: FieldOptions,
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const c2d = ctx;

    let w = 0;
    let h = 0;
    let ox = 0;
    let oy = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let field: Field | null = null;
    let paper = "#11131d";
    let dim = "#23273a";
    let blend: GlobalCompositeOperation = "screen";
    let blockAlpha = 0.72;
    const atlas = new Map<string, HTMLCanvasElement>();
    const colors = new Map<string, string>();

    const token = (name: string, fallback: string) =>
        getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
    const inkColor = (slot: string) => {
        let color = colors.get(slot);
        if (!color) {
            color = token(slot === "lit" ? "--ink" : `--ink-${slot}`, "#8fa2ff");
            colors.set(slot, color);
        }
        return color;
    };
    const row = (ramp: RampName, slot: string) => {
        const key = `${ramp}:${slot}`;
        let out = atlas.get(key);
        if (!out) {
            out = buildAtlasRow(RAMPS[ramp], inkColor(slot), CELL * dpr);
            atlas.set(key, out);
        }
        return out;
    };

    /** Size the canvas and snap its cells to the lattice offset (in (-CELL, 0]). */
    const resize = (
        width: number,
        height: number,
        offset: { x: number; y: number },
        maxDpr = 2,
    ) => {
        w = width;
        h = height;
        // a whole number of device pixels per cell, so neighbouring cells meet without seams
        dpr = Math.max(1, Math.round(Math.min(maxDpr, window.devicePixelRatio || 1) * 4) / 4);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ox = Math.round(offset.x * dpr) / dpr;
        oy = Math.round(offset.y * dpr) / dpr;
        cols = Math.max(1, Math.ceil((w - ox) / CELL));
        rows = Math.max(1, Math.ceil((h - oy) / CELL));
        field = buildField(comp, cols, rows);
        atlas.clear();
        colors.clear();
        paper = token("--surface-page", paper);
        const bg = getComputedStyle(canvas.parentElement ?? canvas).backgroundColor;
        if (opts.dots && bg && !bg.endsWith(", 0)") && bg !== "transparent") paper = bg;
        dim = token("--glyph-dim", dim);
        blend = token("--glyph-blend", "screen") === "multiply" ? "multiply" : "screen";
        blockAlpha = parseFloat(token("--glyph-block-alpha", "0.72")) || 0.72;
    };

    const draw = (fr: FieldFrame) => {
        const f = field;
        if (!f) return;
        c2d.setTransform(1, 0, 0, 1, 0, 0);
        c2d.clearRect(0, 0, canvas.width, canvas.height);
        c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        const size = CELL * dpr;
        const glyphs = RAMPS[comp.ramp];
        const [PAD, FADE, CLEAR] = w < 600 ? QUIET.narrow : QUIET.wide;
        const quiet = fr.quiet.filter((q) => q.b > -FADE && q.t < h + FADE);
        const nearCopy = (x: number, y: number, x2: number, y2: number) =>
            quiet.some(
                (q) =>
                    !q.soft &&
                    x < q.r + CLEAR &&
                    x2 > q.l - CLEAR &&
                    y < q.b + CLEAR &&
                    y2 > q.t - CLEAR,
            );

        let bx = -1e9;
        if (fr.beam > 0.02 && fr.animate) {
            const p = ((fr.time + 600) % (SWEEP_MS + PAUSE_MS)) / SWEEP_MS;
            if (p <= 1) bx = -BAND * 2 + (w + BAND * 4) * p;
        }

        // ink blocks print whole or not at all: drop any that would touch the copy
        const blocks = f.blocks.filter(
            (b) =>
                b.r0 < fr.head &&
                !nearCopy(ox + b.c0 * CELL, oy + b.r0 * CELL, ox + b.c1 * CELL, oy + b.r1 * CELL),
        );
        const inBlock = (c: number, r: number) =>
            blocks.some((b) => c >= b.c0 && c < b.c1 && r >= b.r0 && r < b.r1);

        for (let r = 0; r < rows; r++) {
            const y = oy + r * CELL;
            const cy = y + CELL / 2;
            const edge = opts.soften ? Math.min(r, rows - 1 - r) : 9;
            const soft = edge === 0 ? 0.25 : edge === 1 ? 0.6 : 1;
            for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                const x = ox + c * CELL;
                const cx = x + CELL / 2;

                if (opts.dots) {
                    c2d.globalAlpha = 1;
                    c2d.fillStyle = dim;
                    c2d.beginPath();
                    c2d.arc(cx, cy, 1.1, 0, Math.PI * 2);
                    c2d.fill();
                }
                if (r > fr.head || (f.covered[i] && inBlock(c, r))) continue;

                let q = 0;
                for (const rect of quiet) {
                    const d = Math.max(
                        rect.l - x - CELL,
                        x - rect.r,
                        rect.t - y - CELL,
                        y - rect.b,
                        0,
                    );
                    q = Math.max(q, d <= PAD ? 1 : d < PAD + FADE ? 1 - (d - PAD) / FADE : 0);
                }

                let boost = 0;
                if (bx > -1e8) {
                    const d = Math.abs(cx - bx + (cy - h / 2) * SLANT);
                    if (d < BAND) boost = (1 - d / BAND) ** 2 * fr.beam;
                }
                if (fr.pointer && fr.pointer.amt > 0) {
                    const d = Math.hypot(cx - fr.pointer.x, cy - fr.pointer.y);
                    if (d < POINTER_RADIUS)
                        boost = Math.max(boost, (1 - d / POINTER_RADIUS) ** 2 * fr.pointer.amt);
                }
                // the print head: glyphs in the row being printed flash lit, nothing extra prints
                const atHead = Number.isFinite(fr.head) && r > fr.head - 1;

                let v =
                    f.base[i]! + (fr.animate ? 0.05 * Math.sin(fr.time * 0.0011 + f.phase[i]!) : 0);
                v *= (1 - 0.8 * q) * soft;
                boost *= 1 - 0.75 * q;
                v += boost * 0.55;

                const { step, level } = glyphFor(v, comp.density, glyphs.length);
                if (step < 0) continue;
                // cover the page dot under the glyph, then print it
                c2d.globalAlpha = 1;
                c2d.fillStyle = paper;
                c2d.fillRect(x, y, CELL, CELL);
                const lit = boost > 0.3 || atHead;
                const slot = lit ? "lit" : (comp.inks[f.zone[i]!] ?? comp.inks[0]!);
                c2d.globalAlpha = lit ? 0.85 : (0.32 + 0.55 * level) * (1 - 0.6 * q);
                c2d.drawImage(row(comp.ramp, slot), step * size, 0, size, size, x, y, CELL, CELL);
            }
        }

        // ink blocks: opaque (each ink overprinted on the paper), crossings blend
        c2d.globalAlpha = 1;
        blocks.forEach((b, n) => {
            c2d.globalCompositeOperation = n === 0 ? "source-over" : blend;
            c2d.fillStyle = overprint(inkColor(b.ink), paper, blockAlpha);
            const top = Math.min(b.r1, Math.floor(fr.head) + 1);
            c2d.fillRect(
                ox + b.c0 * CELL,
                oy + b.r0 * CELL,
                (b.c1 - b.c0) * CELL,
                (top - b.r0) * CELL,
            );
        });
        c2d.globalCompositeOperation = "source-over";
    };

    return {
        resize,
        draw,
        get rows() {
            return rows;
        },
        get origin() {
            return { x: ox, y: oy };
        },
    };
}

/** The boxes of the quiet elements under `root`, relative to `origin`'s top left. */
export function quietRects(root: ParentNode, origin: { left: number; top: number }): Rect[] {
    return [...root.querySelectorAll<HTMLElement>('[data-quiet]:not([data-quiet="fixed"])')].map(
        (el) => {
            const r = el.getBoundingClientRect();
            return {
                l: r.left - origin.left,
                t: r.top - origin.top,
                r: r.right - origin.left,
                b: r.bottom - origin.top,
                soft: el.dataset.quiet === "soft",
            };
        },
    );
}
