import { useEffect, useRef } from "react";

import { motionAllowed, RAMPS, type InkSlot, type RampName } from "@/design-system";
import { buildAtlasRow } from "@/design-system/glyph/draw";
import { buildField, glyphFor, type Field } from "@/design-system/glyph/engine";

const RADIUS = 110; // how far the pointer lights glyphs, px

export interface HalftoneProps {
    /** "circle", or one character set in the display face (a pixel letterform). */
    shape: string;
    /** Glyph inks; the first is the main one, the rest print in zones. */
    inks: InkSlot[];
    seed: number;
    ramp?: RampName;
    /** Cell size in CSS px. */
    cell?: number;
    className?: string;
}

/**
 * A glyph field printed only inside a shape, like a halftone screen: a circle,
 * or a character from the pixel display face scaled up a whole number of
 * cells per pixel so its edges stay on the grid. Glyphs under the pointer
 * light up when motion is allowed; otherwise it draws one still frame.
 */
export function Halftone({
    shape,
    inks,
    seed,
    ramp = "signal",
    cell = 14,
    className,
}: HalftoneProps) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof ResizeObserver === "undefined") return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const glyphs = RAMPS[ramp];
        const animate = motionAllowed();
        let w = 0;
        let h = 0;
        let dpr = 1;
        let ox = 0;
        let oy = 0;
        let field: Field | null = null;
        let mask = new Uint8Array(0);
        let inkRows: HTMLCanvasElement[] = [];
        let litRow: HTMLCanvasElement | null = null;
        let px = -1e4;
        let py = -1e4;
        let frame = 0;

        const letterMask = (cols: number, rows: number) => {
            const out = new Uint8Array(cols * rows);
            if (shape === "circle") {
                const r = Math.min(cols, rows) / 2;
                for (let y = 0; y < rows; y++)
                    for (let x = 0; x < cols; x++)
                        out[y * cols + x] =
                            Math.hypot(x + 0.5 - cols / 2, y + 0.5 - rows / 2) <= r ? 1 : 0;
                return out;
            }
            // set the character at the face's native 11px, then scale its pixels up
            const off = document.createElement("canvas");
            off.width = off.height = 24;
            const oc = off.getContext("2d");
            if (!oc) return out;
            const family = getComputedStyle(host).getPropertyValue("--font-display").trim();
            oc.font = `11px ${family || "monospace"}`;
            oc.textBaseline = "top";
            oc.fillText(shape, 4, 4);
            const img = oc.getImageData(0, 0, 24, 24).data;
            let x0 = 24;
            let y0 = 24;
            let x1 = -1;
            let y1 = -1;
            // a pixel-font bold: each pixel also inks the one to its right
            const ink = (x: number, y: number) =>
                x >= 0 && x < 24 && (img[(y * 24 + x) * 4 + 3] ?? 0) > 120;
            const on = (x: number, y: number) => ink(x, y) || ink(x - 1, y);
            for (let y = 0; y < 24; y++)
                for (let x = 0; x < 24; x++)
                    if (on(x, y)) {
                        x0 = Math.min(x0, x);
                        y0 = Math.min(y0, y);
                        x1 = Math.max(x1, x);
                        y1 = Math.max(y1, y);
                    }
            if (x1 < 0) return out;
            const bw = x1 - x0 + 1;
            const bh = y1 - y0 + 1;
            const k = Math.max(1, Math.floor(Math.min(cols / bw, rows / bh)));
            const sx = Math.floor((cols - bw * k) / 2);
            const sy = Math.floor((rows - bh * k) / 2);
            for (let y = 0; y < rows; y++)
                for (let x = 0; x < cols; x++) {
                    const gx = Math.floor((x - sx) / k);
                    const gy = Math.floor((y - sy) / k);
                    if (gx >= 0 && gy >= 0 && gx < bw && gy < bh && on(x0 + gx, y0 + gy))
                        out[y * cols + x] = 1;
                }
            return out;
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
            field = buildField({ seed, inks, ramp, density: 1, scale: 3 }, cols, rows);
            mask = letterMask(cols, rows);
            const cs = getComputedStyle(host);
            const size = Math.round(cell * dpr);
            inkRows = inks.map((slot) =>
                buildAtlasRow(glyphs, cs.getPropertyValue(`--ink-${slot}`).trim(), size),
            );
            litRow = buildAtlasRow(glyphs, cs.getPropertyValue("--ink").trim(), size);
        };

        const draw = () => {
            frame = 0;
            const f = field;
            if (!f || !litRow) return;
            const size = Math.round(cell * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            for (let r = 0; r < f.rows; r++) {
                for (let c = 0; c < f.cols; c++) {
                    const i = r * f.cols + c;
                    if (!mask[i]) continue;
                    const x = ox + c * cell;
                    const y = oy + r * cell;
                    const d = Math.hypot(x + cell / 2 - px, y + cell / 2 - py);
                    const boost = d < RADIUS ? (1 - d / RADIUS) ** 2 : 0;
                    const v = Math.min(1, 0.5 + 0.5 * f.base[i]! + boost * 0.9);
                    const { step } = glyphFor(v, 1, glyphs.length);
                    const row = boost > 0.3 ? litRow : (inkRows[f.zone[i]!] ?? inkRows[0]!);
                    ctx.drawImage(row, step * size, 0, size, size, x, y, cell, cell);
                }
            }
        };

        const redraw = () => {
            layout();
            draw();
        };
        redraw();
        // the letterform needs the display face; redraw once it has loaded
        if (shape !== "circle" && document.fonts) {
            void document.fonts.ready.then(() => {
                if (field) redraw();
            });
        }
        const ro = new ResizeObserver(redraw);
        ro.observe(host);

        const zone = host.closest("section") ?? host;
        const onMove = (e: Event) => {
            const p = e as PointerEvent;
            const r = canvas.getBoundingClientRect();
            px = p.clientX - r.left;
            py = p.clientY - r.top;
            if (!frame) frame = requestAnimationFrame(draw);
        };
        const onLeave = () => {
            px = py = -1e4;
            if (!frame) frame = requestAnimationFrame(draw);
        };
        if (animate) {
            zone.addEventListener("pointermove", onMove);
            zone.addEventListener("pointerleave", onLeave);
        }
        return () => {
            field = null;
            cancelAnimationFrame(frame);
            ro.disconnect();
            zone.removeEventListener("pointermove", onMove);
            zone.removeEventListener("pointerleave", onLeave);
        };
    }, [shape, inks, seed, ramp, cell]);

    return (
        <span className={["pst-tone", className].filter(Boolean).join(" ")} aria-hidden="true">
            <canvas ref={ref} />
        </span>
    );
}
