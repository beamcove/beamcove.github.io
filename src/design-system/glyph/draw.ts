import type { GlyphId } from "./engine";
import { SYMBOL_PATHS, TRI_STROKE } from "./symbol-paths";

const paths = new Map<string, Path2D>();
/** A symbol's path (16×16 cell units), built once. */
const symbol = (name: keyof typeof SYMBOL_PATHS) => {
    let p = paths.get(name);
    if (!p) {
        p = new Path2D(SYMBOL_PATHS[name]);
        paths.set(name, p);
    }
    return p;
};

/**
 * Draws one glyph into a square of side `s` at (x, y). Glyphs are drawn as
 * shapes, not font characters, so every field looks the same everywhere.
 * They are chunky: bold strokes with round caps and joins, and soft corners,
 * the same family as the Symbol marks (● ▲ ■ ✕ +).
 */
export function drawGlyph(
    ctx: CanvasRenderingContext2D,
    id: GlyphId,
    x: number,
    y: number,
    s: number,
) {
    const m = s * 0.2;
    const g = s - 2 * m; // inner box
    const lw = Math.max(1.5, s * 0.13);
    const cx = x + s / 2;
    const cy = y + s / 2;
    const half = lw / 2;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const line = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };
    const rounded = (bx: number, by: number, size: number, r: number) => {
        ctx.beginPath();
        ctx.roundRect(bx, by, size, size, r);
    };
    const box = () => {
        rounded(x + m + half, y + m + half, g - lw, g * 0.18);
        ctx.stroke();
    };
    const dot = (r: number) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
    };
    const sq = (px: number, py: number, size: number) => {
        rounded(px - size / 2, py - size / 2, size, size * 0.25);
        ctx.fill();
    };

    switch (id) {
        case "dot":
            dot(Math.max(1.2, s * 0.08));
            break;
        case "dot2":
            dot(Math.max(1.8, s * 0.15));
            break;
        case "plus":
            line(cx, y + m + half, cx, y + s - m - half);
            line(x + m + half, cy, x + s - m - half, cy);
            break;
        case "slash":
            line(x + m + half, y + m + half, x + s - m - half, y + s - m - half);
            break;
        case "cross":
            ctx.lineWidth = lw * 1.3;
            line(x + m + lw, y + m + lw, x + s - m - lw, y + s - m - lw);
            line(x + s - m - lw, y + m + lw, x + m + lw, y + s - m - lw);
            break;
        case "ring":
            ctx.beginPath();
            ctx.arc(cx, cy, g / 2 - half, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case "target":
            ctx.beginPath();
            ctx.arc(cx, cy, g / 2 - half, 0, Math.PI * 2);
            ctx.stroke();
            dot(Math.max(1.5, g * 0.16));
            break;
        case "square":
            box();
            break;
        case "boxx":
            box();
            ctx.lineWidth = lw * 0.8;
            line(x + m + lw * 1.6, y + m + lw * 1.6, x + s - m - lw * 1.6, y + s - m - lw * 1.6);
            line(x + s - m - lw * 1.6, y + m + lw * 1.6, x + m + lw * 1.6, y + s - m - lw * 1.6);
            break;
        case "boxdot":
            box();
            sq(cx, cy, g * 0.36);
            break;
        case "quad": {
            const q = g * 0.34;
            const o = g / 2 - q / 2;
            sq(cx - o, cy - o, q);
            sq(cx + o, cy - o, q);
            sq(cx - o, cy + o, q);
            sq(cx + o, cy + o, q);
            sq(cx, cy, q);
            break;
        }
        case "diamond":
            ctx.beginPath();
            ctx.moveTo(cx, y + m);
            ctx.lineTo(x + s - m, cy);
            ctx.lineTo(cx, y + s - m);
            ctx.lineTo(x + m, cy);
            ctx.closePath();
            ctx.stroke();
            break;
        // the symbol set, filled, the same shapes as the Shape marks: ● ▲ ■ ♥
        case "disc":
        case "tri":
        case "solid":
        case "heart": {
            const name = id === "solid" ? "square" : id;
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(s / 16, s / 16);
            ctx.fill(symbol(name));
            if (name === "tri") {
                ctx.lineWidth = TRI_STROKE;
                ctx.stroke(symbol(name));
            }
            ctx.restore();
            break;
        }
        case "shade1":
        case "shade2":
        case "shade3": {
            const p = Math.max(2, Math.round(s / 8));
            // pixels on per 2×2 tile: ░ one, ▒ two (a checker), ▓ three
            const on = (k: number) =>
                id === "shade1" ? k === 0 : id === "shade2" ? k === 0 || k === 3 : k !== 1;
            for (let py = 0; py + p <= s; py += p) {
                for (let px = 0; px + p <= s; px += p) {
                    const k = ((px / p) % 2) + ((py / p) % 2) * 2;
                    if (on(k)) ctx.fillRect(x + px, y + py, p, p);
                }
            }
            break;
        }
        case "block":
            // █ fills its cell, square, like the shades beside it
            ctx.fillRect(x, y, s, s);
            break;
    }
}

/** One horizontal strip of glyphs in one colour, each `size` device px square. */
export function buildAtlasRow(
    glyphs: readonly GlyphId[],
    color: string,
    size: number,
): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = size * glyphs.length;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    glyphs.forEach((id, i) => drawGlyph(ctx, id, i * size, 0, size));
    return canvas;
}
