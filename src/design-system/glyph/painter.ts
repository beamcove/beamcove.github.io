import { type AnyCanvas, buildAtlasRow, context2d, makeCanvas } from "./draw";
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
    /**
     * Quiet boxes that move from frame to frame (fixed furniture, like the chapter
     * rail). The copy's own boxes hold between layouts: pass them to `layout`.
     */
    live?: Rect[];
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

/** A neighbouring section's scene, and where this canvas's first cell sits in it. */
export interface Neighbour {
    comp: GlyphComposition;
    at: { c: number; r: number };
}

/**
 * As the next section moves up the screen, its scene takes over on a wave:
 * a dense band of its glyphs, lit along the leading edge, sweeps from the
 * bottom of the screen to the top, and the scene settles to its own density
 * behind it. `tIn` is how far this section has taken over from the one before
 * and `tOut` how far the next one has taken over from this: 0 → 1 turns every
 * cell over, and on to 1 + WAVE_BAND carries the band off the top. Both
 * follow scroll.
 */
export interface WaveFrame {
    tIn: number;
    tOut: number;
    /** The canvas's top on screen, and the screen height (CSS px). */
    top: number;
    vh: number;
    /** The page-lattice column and row of this canvas's first cell, so grain matches across canvases. */
    col: number;
    row: number;
}

/**
 * When a cell turns over, 0–1: the bottom of the screen first. The edge is a
 * slow swell across the columns with a little grain, so the wave reads as one
 * front rather than scattered specks.
 */
export function flipAt(viewY: number, vh: number, col: number, row: number) {
    return flipHeight(viewY, vh) + flipGrain(col, row);
}
/** The part of `flipAt` that follows the cell's height on screen. */
const flipHeight = (viewY: number, vh: number) => (1 - Math.min(1, Math.max(0, viewY / vh))) * 0.76;
/** The part of `flipAt` fixed to the cell: the swell and the grain (worked out once per layout). */
export function flipGrain(col: number, row: number) {
    const swell = 0.5 + 0.3 * Math.sin(col * 0.19) + 0.2 * Math.sin(col * 0.071 + 1.3);
    return swell * 0.14 + hash(col, row, 5) * 0.1;
}
/** How deep the wave's dense band is, in turnover units (about a third of the screen). */
export const WAVE_BAND = 0.24;
// the leading edge of the band is lit
const CREST = 0.035;

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

/** A canvas's size and where its cells start, as `resize` lays it out. */
export interface Geometry {
    dpr: number;
    /** The first cell's top left (the lattice offset, snapped to device px). */
    ox: number;
    oy: number;
    cols: number;
    rows: number;
}

/** Lays a canvas of `width` × `height` CSS px over the page lattice, at `offset` (in (-CELL, 0]). */
export function geometry(
    width: number,
    height: number,
    offset: { x: number; y: number },
    maxDpr: number,
    deviceDpr: number,
): Geometry {
    // a whole number of device pixels per cell, so neighbouring cells meet without seams
    const dpr = Math.max(1, Math.round(Math.min(maxDpr, deviceDpr || 1) * 4) / 4);
    const ox = Math.round(offset.x * dpr) / dpr;
    const oy = Math.round(offset.y * dpr) / dpr;
    return {
        dpr,
        ox,
        oy,
        cols: Math.max(1, Math.ceil((width - ox) / CELL)),
        rows: Math.max(1, Math.ceil((height - oy) / CELL)),
    };
}

/**
 * What a painter needs from the page, read once on the main thread (a painter
 * in a worker can't read styles): the design tokens it prints with, its host's
 * background and the screen's pixel ratio.
 */
export interface PainterEnv {
    tokens: Partial<Record<(typeof PAINTER_TOKENS)[number], string>>;
    /** The host's background colour (an opaque card paints its own paper). */
    bg: string;
    dpr: number;
}
const PAINTER_TOKENS = [
    "--surface-page",
    "--glyph-dim",
    "--glyph-blend",
    "--glyph-block-alpha",
    "--ink",
    "--ink-a",
    "--ink-b",
    "--ink-c",
    "--ink-d",
    "--ink-e",
] as const;

/** Reads a painter's environment for `canvas` (main thread only). */
export function readEnv(canvas: HTMLCanvasElement): PainterEnv {
    const style = getComputedStyle(canvas);
    return {
        tokens: Object.fromEntries(
            PAINTER_TOKENS.map((name) => [name, style.getPropertyValue(name).trim()]),
        ),
        bg: getComputedStyle(canvas.parentElement ?? canvas).backgroundColor,
        dpr: window.devicePixelRatio || 1,
    };
}

// every glyph of a ramp in one ink, pre-printed over the paper at each of the 17
// alpha steps (one row per step), shared by every painter: a changed cell is then
// one image copy, instead of clear, fill, set alpha and copy
const PRINTED = new Map<string, AnyCanvas>();
function printedAtlas(ramp: RampName, color: string, paper: string, size: number) {
    const key = `${ramp}:${color}:${paper}:${size}`;
    let out = PRINTED.get(key);
    if (!out) {
        const glyphs = buildAtlasRow(RAMPS[ramp], color, size);
        out = makeCanvas(glyphs.width, size * (ALPHA_STEPS + 1));
        const g = context2d(out);
        if (g) {
            g.fillStyle = paper;
            g.fillRect(0, 0, out.width, out.height);
            for (let a = 1; a <= ALPHA_STEPS; a++) {
                g.globalAlpha = a / ALPHA_STEPS;
                g.drawImage(glyphs, 0, a * size);
            }
        }
        PRINTED.set(key, out);
    }
    return out;
}
// sixteen steps of alpha: smooth to the eye, and most frames change none
const ALPHA_STEPS = 16;

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
 *
 * It reads nothing from the page (`env` carries what it needs), so it runs the
 * same on the main thread or in the field worker.
 */
export function createPainter(
    canvas: AnyCanvas,
    comp: GlyphComposition,
    opts: FieldOptions,
    env: PainterEnv,
) {
    const ctx = context2d(canvas);
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
    // one cell with its resting dot, tiled: far cheaper than a circle path per cell
    let dotTile: CanvasPattern | null = null;
    const colors = new Map<string, string>();

    const token = (name: string, fallback: string) =>
        env.tokens[name as keyof PainterEnv["tokens"]] || fallback;
    const inkColor = (slot: string) => {
        let color = colors.get(slot);
        if (!color) {
            color = token(slot === "lit" ? "--ink" : `--ink-${slot}`, "#8fa2ff");
            colors.set(slot, color);
        }
        return color;
    };

    // the copy to keep quiet around, and the neighbours' scenes: both hold between layouts
    let quietBoxes: Rect[] = [];
    let near: { prev: Neighbour | null; next: Neighbour | null } = { prev: null, next: null };
    let prevField: Field | null = null;
    let nextField: Field | null = null;
    // worked out once per layout, per cell: how quiet the copy keeps it, and when the
    // wave turns it over (the part that doesn't follow scroll); and the blocks that print
    let still: Float32Array | null = null;
    let grain: Float32Array | null = null;
    let grainAt = "";
    let blocks: Field["blocks"] = [];
    const neighbourField = (n: Neighbour | null) =>
        n ? buildField(n.comp, cols, rows, n.at) : null;

    /** Size the canvas and snap its cells to the lattice offset (in (-CELL, 0]). */
    const resize = (
        width: number,
        height: number,
        offset: { x: number; y: number },
        maxDpr = 2,
    ) => {
        w = width;
        h = height;
        ({ dpr, ox, oy, cols, rows } = geometry(w, h, offset, maxDpr, env.dpr));
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        field = buildField(comp, cols, rows);
        prevField = neighbourField(near.prev);
        nextField = neighbourField(near.next);
        fresh = true;
        still = null;
        grain = null;
        colors.clear();
        paper = token("--surface-page", paper);
        const bg = env.bg;
        if (opts.dots && bg && !bg.endsWith(", 0)") && bg !== "transparent") paper = bg;
        dim = token("--glyph-dim", dim);
        dotTile = null;
        if (opts.dots) {
            const tile = makeCanvas(Math.round(CELL * dpr), Math.round(CELL * dpr));
            const t = context2d(tile);
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

    /** The copy moved, or the neighbours changed: take the new boxes and scenes, and repaint. */
    const layout = (quiet: Rect[], prev: Neighbour | null, next: Neighbour | null) => {
        quietBoxes = quiet;
        near = { prev, next };
        prevField = field && neighbourField(prev);
        nextField = field && neighbourField(next);
        still = null;
        fresh = true;
    };

    /** Per cell, how quiet a set of boxes keeps it (1 silent, 0 untouched). */
    const quietness = (boxes: Rect[], x: number, y: number, pad: number, fade: number) => {
        let q = 0;
        for (const rect of boxes) {
            const d = Math.max(rect.l - x - CELL, x - rect.r, rect.t - y - CELL, y - rect.b, 0);
            q = Math.max(q, d <= pad ? 1 : d < pad + fade ? 1 - (d - pad) / fade : 0);
        }
        return q;
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
        const onCanvas = (q: Rect) => q.b > -FADE && q.t < h + FADE;
        if (!still || still.length !== rows * cols) {
            // the copy only moves on layout: how quiet it keeps each cell, and which ink
            // blocks print (whole, or not at all near the copy), hold until then
            const boxes = quietBoxes.filter(onCanvas);
            still = new Float32Array(rows * cols);
            for (let r = 0; r < rows; r++)
                for (let c = 0; c < cols; c++)
                    still[r * cols + c] = quietness(boxes, ox + c * CELL, oy + r * CELL, PAD, FADE);
            blocks = f.blocks.filter(
                (b) =>
                    !boxes.some(
                        (q) =>
                            !q.soft &&
                            ox + b.c0 * CELL < q.r + CLEAR &&
                            ox + b.c1 * CELL > q.l - CLEAR &&
                            oy + b.r0 * CELL < q.b + CLEAR &&
                            oy + b.r1 * CELL > q.t - CLEAR,
                    ),
            );
        }
        const quietStill = still;
        // fixed furniture moves over the canvas every frame
        const live = (fr.live ?? []).filter(onCanvas);

        let bx = -1e9;
        if (fr.beam > 0.02 && fr.animate) {
            const p = ((fr.time + 600) % (SWEEP_MS + PAUSE_MS)) / SWEEP_MS;
            if (p <= 1) bx = -BAND * 2 + (w + BAND * 4) * p;
        }

        // the wave: which neighbours there are, and the fixed part of each cell's turnover
        const prev = wave && prevField ? { comp: near.prev!.comp, field: prevField } : null;
        const next = wave && nextField ? { comp: near.next!.comp, field: nextField } : null;
        if (wave && (prev || next)) {
            const at = `${wave.col},${wave.row}`;
            if (!grain || grain.length !== rows * cols || grainAt !== at) {
                grainAt = at;
                grain = new Float32Array(rows * cols);
                for (let r = 0; r < rows; r++)
                    for (let c = 0; c < cols; c++)
                        grain[r * cols + c] = flipGrain(wave.col + c, wave.row + r);
            }
        }
        const turn = grain;

        // cells a neighbouring scene takes are cleared
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

                // which scene this cell shows (0 its own, 1 the one before, 2 the next), and
                // how deep in the wave's band it sits (1 at the leading edge, 0 behind the band)
                let src: Field = f;
                let sc: GlyphComposition = comp;
                let scene = 0;
                let surge = 0;
                let crest = false;
                if (wave && turn && (next || prev)) {
                    const key = flipHeight(wave.top + cy, wave.vh) + turn[i]!;
                    let behind = Infinity; // how far behind the leading edge, in turnover units
                    if (next && wave.tOut > 0 && key < wave.tOut) {
                        src = next.field;
                        sc = next.comp;
                        scene = 2;
                        behind = wave.tOut - key;
                    } else if (prev && key >= wave.tIn) {
                        src = prev.field;
                        sc = prev.comp;
                        scene = 1;
                    } else if (prev) behind = wave.tIn - key;
                    if (behind < WAVE_BAND) {
                        surge = 1 - behind / WAVE_BAND;
                        crest = behind < CREST;
                    }
                }

                let state: number;
                let step = -1;
                let slot = "";
                let aq = 0;
                if (scene === 0 && f.covered[i] && inBlock(c, r)) state = BLOCK;
                else {
                    let q = quietStill[i]!;
                    if (live.length) q = Math.max(q, quietness(live, x, y, PAD, FADE));
                    let boost = crest ? 0.6 : 0;
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
                    // the wave's band: packed with glyphs, densest at the leading edge
                    if (surge > 0) v = Math.max(v, (0.5 + 0.5 * surge) * (1 - 0.85 * q));
                    boost *= 1 - 0.75 * q;
                    v += boost * 0.55;
                    const g = glyphFor(v, sc.density, RAMPS[sc.ramp].length);
                    step = g.step;
                    if (step < 0) state = EMPTY;
                    else {
                        const lit = boost > 0.3;
                        const zone = src.zone[i]!;
                        slot = lit ? "lit" : (sc.inks[zone] ?? sc.inks[0]!);
                        aq = Math.round(
                            (lit ? 0.85 : (0.32 + 0.55 * g.level) * (1 - 0.6 * q)) * ALPHA_STEPS,
                        );
                        state = 1 + step + ((lit ? 7 : zone) << 4) + (aq << 7) + (scene << 12);
                    }
                }

                if (drawn[i] === state) continue;
                drawn[i] = state;
                if (state === EMPTY) clearCell(x, y, size);
                else if (state === BLOCK) {
                    clearCell(x, y, size);
                    blockCell(c, r, x, y);
                } else {
                    // the glyph pre-printed over the paper, which covers the page dot under it
                    const atlas = printedAtlas(sc.ramp, inkColor(slot), paper, size);
                    c2d.drawImage(atlas, step * size, aq * size, size, size, x, y, CELL, CELL);
                }
            }
        }
    };

    return {
        resize,
        layout,
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
            prevField = null;
            nextField = null;
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
