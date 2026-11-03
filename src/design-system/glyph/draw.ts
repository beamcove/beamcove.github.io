import type { GlyphId } from "./engine";

/**
 * Draws one glyph into a square of side `s` at (x, y). Glyphs are drawn as
 * shapes, not font characters, so every field looks the same everywhere and
 * the strokes land on whole pixels.
 */
export function drawGlyph(
    ctx: CanvasRenderingContext2D,
    id: GlyphId,
    x: number,
    y: number,
    s: number,
) {
    const m = Math.round(s * 0.2);
    const g = s - 2 * m; // inner box
    const lw = Math.max(1, Math.round(s * 0.09));
    const cx = x + s / 2;
    const cy = y + s / 2;
    const half = lw / 2;
    ctx.lineWidth = lw;
    ctx.lineCap = "square";

    const line = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };
    const box = () => ctx.strokeRect(x + m + half, y + m + half, g - lw, g - lw);
    const sq = (px: number, py: number, size: number) =>
        ctx.fillRect(
            Math.round(px - size / 2),
            Math.round(py - size / 2),
            Math.round(size),
            Math.round(size),
        );

    switch (id) {
        case "dot":
            sq(cx, cy, Math.max(2, s * 0.14));
            break;
        case "dot2":
            sq(cx, cy, Math.max(3, s * 0.28));
            break;
        case "plus":
            line(cx, y + m + half, cx, y + s - m - half);
            line(x + m + half, cy, x + s - m - half, cy);
            break;
        case "slash":
            line(x + m + half, y + m + half, x + s - m - half, y + s - m - half);
            break;
        case "cross":
            ctx.lineWidth = lw * 1.5;
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
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(1.5, g * 0.18), 0, Math.PI * 2);
            ctx.fill();
            break;
        case "square":
            box();
            break;
        case "boxx":
            box();
            line(x + m + lw, y + m + lw, x + s - m - lw, y + s - m - lw);
            line(x + s - m - lw, y + m + lw, x + m + lw, y + s - m - lw);
            break;
        case "boxdot":
            box();
            sq(cx, cy, g * 0.42);
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
            ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
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
