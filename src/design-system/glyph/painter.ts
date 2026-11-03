import { buildAtlasRow } from "./draw";
import {
    buildField,
    glyphFor,
    hash,
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
    /** The takeover between this section's scene and its neighbours'; leave it out for its own scene only. */
    wave?: WaveFrame;
    /** Only draw rows between these canvas y's (the part on screen); default all. */
    view?: { top: number; bottom: number };
}

/** A scene from a neighbouring section, as this canvas prints it. */
export interface SceneLayer {
    comp: GlyphComposition;
    field: Field;
}

/**
 * As the next section moves up the screen, its scene takes over cell by cell:
 * bottom of the screen first, with grain, so it dissolves in gradually. `tIn`
 * is how far this section has taken over from the one before (0–1), `tOut`
 * how far the next one has taken over from this. Both follow scroll.
 */
export interface WaveFrame {
    prev: SceneLayer | null;
    next: SceneLayer | null;
    tIn: number;
    tOut: number;
    /** The canvas's top on screen, and the screen height (CSS px). */
    top: number;
    vh: number;
    /** The page-lattice column and row of this canvas's first cell, so grain matches across canvases. */
    col: number;
    row: number;
}

/** When a cell turns over, 0–1: the bottom of the screen first, with grain. */
export function flipAt(viewY: number, vh: number, col: number, row: number) {
    const v = Math.min(1, Math.max(0, viewY / vh));
    return (1 - v) * 0.6 + hash(col, row, 5) * 0.4;
}
// the cells about to turn over light up: a thin seam that runs ahead of the takeover
const SEAM = 0.035;

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

/** Whether the lighthouse beam is crossing the field at `time` (it pauses between sweeps). */
export function beamSweeping(time: number) {
    return ((time + 600) % (SWEEP_MS + PAUSE_MS)) / SWEEP_MS <= 1.05;
}

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
    // one cell with its resting dot, tiled: far cheaper than a circle path per cell
    let dotTile: CanvasPattern | null = null;
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
        fresh = true;
        atlas.clear();
        colors.clear();
        paper = token("--surface-page", paper);
        const bg = getComputedStyle(canvas.parentElement ?? canvas).backgroundColor;
        if (opts.dots && bg && !bg.endsWith(", 0)") && bg !== "transparent") paper = bg;
        dim = token("--glyph-dim", dim);
        dotTile = null;
        if (opts.dots) {
            const tile = document.createElement("canvas");
            tile.width = tile.height = Math.round(CELL * dpr);
            const t = tile.getContext("2d");
            if (t) {
                t.fillStyle = dim;
                t.beginPath();
                t.arc(tile.width / 2, tile.height / 2, 1.1 * dpr, 0, Math.PI * 2);
                t.fill();
                dotTile = c2d.createPattern(tile, "repeat");
            }
        }
        blend = token("--glyph-blend", "screen") === "multiply" ? "multiply" : "screen";
        blockAlpha = parseFloat(token("--glyph-block-alpha", "0.72")) || 0.72;
    };

    // what each cell shows right now, so a frame only repaints the cells that changed
    // (the shimmer moves a few cells at a time; most of a field is still from frame to frame)
    let drawn = new Int32Array(0);
    let fresh = true;
    const EMPTY = 0;
    const BLOCK = -2;

    /** Clear one cell back to the page (or to its resting dot, on an opaque surface). */
    const clearCell = (x: number, y: number, size: number) => {
        c2d.clearRect(x, y, CELL, CELL);
        if (dotTile) {
            c2d.setTransform(1, 0, 0, 1, ox * dpr, oy * dpr);
            c2d.fillStyle = dotTile;
            c2d.fillRect((x - ox) * dpr, (y - oy) * dpr, size, size);
            c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    };

    const draw = (fr: FieldFrame) => {
        const f = field;
        if (!f) return;
        c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        const size = CELL * dpr;
        const wave = fr.animate ? fr.wave : undefined;
        // with the takeover on, scenes run across section edges, so the edges don't thin out
        const softEdges = opts.soften && !wave;
        const r0 = fr.view ? Math.max(0, Math.floor((fr.view.top - oy) / CELL)) : 0;
        const r1 = fr.view ? Math.min(rows, Math.ceil((fr.view.bottom - oy) / CELL)) : rows;

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

        // ink blocks print whole or not at all near the copy (the copy only moves on layout,
        // so this set holds between layouts); cells a neighbouring scene takes are cleared
        const blocks = f.blocks.filter(
            (b) =>
                !nearCopy(ox + b.c0 * CELL, oy + b.r0 * CELL, ox + b.c1 * CELL, oy + b.r1 * CELL),
        );
        const inBlock = (c: number, r: number) =>
            blocks.some((b) => c >= b.c0 && c < b.c1 && r >= b.r0 && r < b.r1);
        const blockColor = (b: (typeof blocks)[number]) =>
            overprint(inkColor(b.ink), paper, blockAlpha);
        /** One cell of ink, layered the way the whole blocks are: the first opaque, crossings blended. */
        const blockCell = (c: number, r: number, x: number, y: number) => {
            c2d.globalAlpha = 1;
            blocks.forEach((b, n) => {
                if (c < b.c0 || c >= b.c1 || r < b.r0 || r >= b.r1) return;
                c2d.globalCompositeOperation = n === 0 ? "source-over" : blend;
                c2d.fillStyle = blockColor(b);
                c2d.fillRect(x, y, CELL, CELL);
            });
            c2d.globalCompositeOperation = "source-over";
        };

        if (fresh || drawn.length !== rows * cols) {
            // a full print: clear, the resting dots, then the blocks whole
            fresh = false;
            drawn = new Int32Array(rows * cols);
            c2d.setTransform(1, 0, 0, 1, 0, 0);
            c2d.clearRect(0, 0, canvas.width, canvas.height);
            if (dotTile) {
                c2d.setTransform(1, 0, 0, 1, ox * dpr, oy * dpr);
                c2d.fillStyle = dotTile;
                c2d.fillRect(-ox * dpr, -oy * dpr, canvas.width, canvas.height);
            }
            c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
            c2d.globalAlpha = 1;
            blocks.forEach((b, n) => {
                c2d.globalCompositeOperation = n === 0 ? "source-over" : blend;
                c2d.fillStyle = blockColor(b);
                c2d.fillRect(
                    ox + b.c0 * CELL,
                    oy + b.r0 * CELL,
                    (b.c1 - b.c0) * CELL,
                    (b.r1 - b.r0) * CELL,
                );
                for (let r = b.r0; r < b.r1; r++)
                    for (let c = b.c0; c < b.c1; c++) drawn[r * cols + c] = BLOCK;
            });
            c2d.globalCompositeOperation = "source-over";
        }

        for (let r = r0; r < r1; r++) {
            const y = oy + r * CELL;
            const cy = y + CELL / 2;
            const edge = softEdges ? Math.min(r, rows - 1 - r) : 9;
            const soft = edge === 0 ? 0.25 : edge === 1 ? 0.6 : 1;
            for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                const x = ox + c * CELL;
                const cx = x + CELL / 2;

                // which scene this cell shows (0 its own, 1 the one before, 2 the next),
                // and whether it's on the seam
                let src: Field = f;
                let sc: GlyphComposition = comp;
                let scene = 0;
                let seam = false;
                if (wave && (wave.next || wave.prev)) {
                    const key = flipAt(wave.top + cy, wave.vh, wave.col + c, wave.row + r);
                    if (wave.next && wave.tOut > 0 && key < wave.tOut) {
                        src = wave.next.field;
                        sc = wave.next.comp;
                        scene = 2;
                    } else if (wave.prev && wave.tIn < 1 && key >= wave.tIn) {
                        src = wave.prev.field;
                        sc = wave.prev.comp;
                        scene = 1;
                        seam = key - wave.tIn < SEAM && wave.tIn > 0.02;
                    } else if (wave.next && wave.tOut > 0.02) {
                        seam = key - wave.tOut < SEAM;
                    }
                }

                let state: number;
                let step = -1;
                let slot = "";
                let alpha = 0;
                if (scene === 0 && f.covered[i] && inBlock(c, r)) state = BLOCK;
                else {
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
                    let boost = seam ? 0.5 : 0;
                    if (bx > -1e8) {
                        const d = Math.abs(cx - bx + (cy - h / 2) * SLANT);
                        if (d < BAND) boost = Math.max(boost, (1 - d / BAND) ** 2 * fr.beam);
                    }
                    if (fr.pointer && fr.pointer.amt > 0) {
                        const d = Math.hypot(cx - fr.pointer.x, cy - fr.pointer.y);
                        if (d < POINTER_RADIUS)
                            boost = Math.max(boost, (1 - d / POINTER_RADIUS) ** 2 * fr.pointer.amt);
                    }
                    let v =
                        src.base[i]! +
                        (fr.animate ? 0.05 * Math.sin(fr.time * 0.0011 + src.phase[i]!) : 0);
                    v *= (1 - 0.8 * q) * soft;
                    boost *= 1 - 0.75 * q;
                    v += boost * 0.55;
                    const g = glyphFor(v, sc.density, RAMPS[sc.ramp].length);
                    step = g.step;
                    if (step < 0) state = EMPTY;
                    else {
                        const lit = boost > 0.3;
                        const zone = src.zone[i]!;
                        slot = lit ? "lit" : (sc.inks[zone] ?? sc.inks[0]!);
                        // sixteen steps of alpha: smooth to the eye, and most frames change none
                        const aq = Math.round(
                            (lit ? 0.85 : (0.32 + 0.55 * g.level) * (1 - 0.6 * q)) * 16,
                        );
                        alpha = aq / 16;
                        state = 1 + step + ((lit ? 7 : zone) << 4) + (aq << 7) + (scene << 12);
                    }
                }

                if (drawn[i] === state) continue;
                drawn[i] = state;
                clearCell(x, y, size);
                if (state === BLOCK) blockCell(c, r, x, y);
                else if (state !== EMPTY) {
                    // cover the page dot under the glyph, then print it
                    c2d.globalAlpha = 1;
                    c2d.fillStyle = paper;
                    c2d.fillRect(x, y, CELL, CELL);
                    c2d.globalAlpha = alpha;
                    c2d.drawImage(row(sc.ramp, slot), step * size, 0, size, size, x, y, CELL, CELL);
                }
            }
        }
        c2d.globalAlpha = 1;
    };

    return {
        resize,
        draw,
        get cols() {
            return cols;
        },
        get rows() {
            return rows;
        },
        /** Repaint every cell on the next draw (the copy, or a neighbour's scene, moved). */
        invalidate() {
            fresh = true;
        },
        /** Drop the canvas's pixels (it's far off screen); `resize` brings them back. */
        release() {
            canvas.width = 0;
            canvas.height = 0;
            field = null;
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
