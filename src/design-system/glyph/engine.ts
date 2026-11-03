/**
 * Signal glyph engine: pure, deterministic maths behind every glyph field.
 *
 * A field is a grid of character cells. Each cell gets a value from layered
 * noise. Coarse, quantised noise makes the rectangular clusters of the
 * reference prints; finer noise breaks their edges. A ramp turns the value
 * into a glyph, light to dense. Solid ink blocks cut through the field.
 * Compositions name ink *slots* (a–e), never colours, so every theme re-inks
 * the same art.
 */

export type InkSlot = "a" | "b" | "c" | "d" | "e";
export const INK_SLOTS: readonly InkSlot[] = ["a", "b", "c", "d", "e"];

export type GlyphId =
    | "dot"
    | "dot2"
    | "plus"
    | "slash"
    | "cross"
    | "ring"
    | "target"
    | "square"
    | "boxx"
    | "boxdot"
    | "quad"
    | "diamond"
    | "shade1"
    | "shade2"
    | "shade3"
    | "block"
    | "disc"
    | "tri"
    | "solid"
    | "heart";

/** The character each drawn glyph stands for (for text, docs and fallbacks). */
export const GLYPH_CHARS: Record<GlyphId, string> = {
    dot: "·",
    dot2: "•",
    plus: "+",
    slash: "╲",
    cross: "✕",
    ring: "○",
    target: "◎",
    square: "▢",
    boxx: "⊠",
    boxdot: "▣",
    quad: "⁙",
    diamond: "◇",
    shade1: "░",
    shade2: "▒",
    shade3: "▓",
    block: "█",
    disc: "●",
    tri: "▲",
    solid: "■",
    heart: "♥",
};

/** Density ramps, light to dense. */
export const RAMPS = {
    signal: ["dot", "plus", "slash", "cross", "square", "target", "boxx", "quad", "boxdot"],
    grid: ["dot", "plus", "cross", "square", "boxx"],
    marks: ["dot2", "plus", "diamond", "ring", "heart", "target", "quad"],
    blocks: ["dot", "shade1", "shade2", "shade3", "block"],
    /** The symbol set: universal shapes, bold, ending in ♥ and the three marks ● ▲ ■. */
    symbols: ["dot", "plus", "cross", "heart", "disc", "tri", "solid"],
} satisfies Record<string, GlyphId[]>;
export type RampName = keyof typeof RAMPS;

/** A solid ink rectangle, in fractions of the field (0–1). */
export interface InkBlock {
    x: number;
    y: number;
    w: number;
    h: number;
    ink: InkSlot;
}

export interface GlyphComposition {
    seed: number;
    /** Glyph inks: the first is the main ink, the others print in zones. */
    inks: InkSlot[];
    ramp: RampName;
    /** Share of cells that carry a glyph, 0–1. */
    density: number;
    /** Cluster size in cells; default 4. */
    scale?: number;
    /**
     * Gather the glyphs toward one edge (the copy sits on the other), or to
     * both side `margins` (reading pages: the content column stays quiet).
     */
    gather?: "left" | "right" | "top" | "bottom" | "margins";
    blocks?: InkBlock[];
    /** Cell size in CSS px; default 16. */
    cell?: number;
}

/** Integer hash → [0, 1). */
export function hash(x: number, y: number, seed: number): number {
    let h =
        (Math.imul(x | 0, 374761393) +
            Math.imul(y | 0, 668265263) +
            Math.imul(seed | 0, 1442695041)) |
        0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Smooth value noise → [0, 1). */
export function valueNoise(x: number, y: number, seed: number): number {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = smooth(x - x0);
    const ty = smooth(y - y0);
    const a = hash(x0, y0, seed);
    const b = hash(x0 + 1, y0, seed);
    const c = hash(x0, y0 + 1, seed);
    const d = hash(x0 + 1, y0 + 1, seed);
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}

/** A block snapped to whole cells: [c0, r0) to [c1, r1). */
export interface CellRect {
    c0: number;
    r0: number;
    c1: number;
    r1: number;
    ink: InkSlot;
}

export function blockCells(block: InkBlock, cols: number, rows: number): CellRect {
    const clamp = (v: number, max: number) => Math.max(0, Math.min(max, Math.round(v)));
    return {
        c0: clamp(block.x * cols, cols),
        r0: clamp(block.y * rows, rows),
        c1: clamp((block.x + block.w) * cols, cols),
        r1: clamp((block.y + block.h) * rows, rows),
        ink: block.ink,
    };
}

/** Everything about a field that doesn't change frame to frame. */
export interface Field {
    cols: number;
    rows: number;
    /** Base value per cell, 0–1. */
    base: Float32Array;
    /** Index into composition.inks per cell. */
    zone: Uint8Array;
    /** Shimmer phase per cell, 0–2π. */
    phase: Float32Array;
    /** 1 where an ink block covers the cell. */
    covered: Uint8Array;
    blocks: CellRect[];
}

/**
 * `at` shifts the noise by whole cells: a scene drawn inside a neighbouring
 * section's canvas uses its offset from its own section, so its glyphs carry
 * on across the edge as if it were one field (gather still follows the width).
 */
export function buildField(
    c: GlyphComposition,
    cols: number,
    rows: number,
    at: { c: number; r: number } = { c: 0, r: 0 },
): Field {
    const n = cols * rows;
    const base = new Float32Array(n);
    const zone = new Uint8Array(n);
    const phase = new Float32Array(n);
    const covered = new Uint8Array(n);
    const s = c.scale ?? 4;

    for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
            const i = r * cols + col;
            const nc = col + at.c;
            const nr = r + at.r;
            const coarse = hash(Math.floor(nc / s), Math.floor(nr / s), c.seed);
            const mid = valueNoise(nc / (s * 3), nr / (s * 3), c.seed + 7);
            const fine = hash(nc, nr, c.seed + 13);
            let v = coarse * 0.45 + mid * 0.4 + fine * 0.15;
            if (c.gather) {
                const u = cols > 1 ? col / (cols - 1) : 0.5;
                const w = rows > 1 ? r / (rows - 1) : 0.5;
                const g =
                    c.gather === "margins"
                        ? Math.abs(u - 0.5) * 2
                        : c.gather === "right"
                          ? u
                          : c.gather === "left"
                            ? 1 - u
                            : c.gather === "bottom"
                              ? w
                              : 1 - w;
                // margins: near zero over the middle, rising steeply to both edges
                v *= c.gather === "margins" ? 0.15 + 1.05 * g ** 1.6 : 0.45 + 0.9 * g;
            }
            base[i] = Math.min(1, v);

            const z = valueNoise(nc / (s * 2.5), nr / (s * 2.5), c.seed + 31);
            zone[i] = c.inks.length < 2 ? 0 : z > 0.6 ? 1 : c.inks.length > 2 && z < 0.28 ? 2 : 0;
            phase[i] = hash(nc, nr, c.seed + 47) * Math.PI * 2;
        }
    }

    const blocks = (c.blocks ?? []).map((b) => blockCells(b, cols, rows));
    for (const b of blocks) {
        for (let r = b.r0; r < b.r1; r++) {
            for (let col = b.c0; col < b.c1; col++) covered[r * cols + col] = 1;
        }
    }
    return { cols, rows, base, zone, phase, covered, blocks };
}

/**
 * The ramp step for a value, or -1 for an empty cell (which shows the
 * resting dot). `level` is how far past the threshold the value sits, 0–1.
 */
export function glyphFor(
    value: number,
    density: number,
    steps: number,
): { step: number; level: number } {
    const t = 1 - density;
    if (value < t) return { step: -1, level: 0 };
    const level = Math.min(1, (value - t) / Math.max(0.0001, 1 - t));
    return { step: Math.min(steps - 1, Math.floor(level * steps)), level };
}

/** A sparkline as block characters, for Stat. */
export function sparkline(series: number[]): string {
    const bars = "▁▂▃▄▅▆▇█";
    if (!series.length) return "";
    const lo = Math.min(...series);
    const hi = Math.max(...series);
    return series.map((v) => bars[hi === lo ? 3 : Math.round(((v - lo) / (hi - lo)) * 7)]).join("");
}
