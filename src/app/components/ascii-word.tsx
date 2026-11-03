import type { CSSProperties } from "react";

import { hash } from "@/design-system/glyph/engine";

/**
 * A 5×7 pixel face for the few words drawn in glyphs: the footer wordmark
 * and the 404. Each lit pixel is a glyph cell; the rest is the resting dot grid.
 */
const FONT: Record<string, string[]> = {
    B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
    e: [".....", ".....", ".###.", "#...#", "#####", "#....", ".####"],
    a: [".....", ".....", ".###.", "....#", ".####", "#...#", ".####"],
    m: [".....", ".....", "##.#.", "#.#.#", "#.#.#", "#.#.#", "#.#.#"],
    c: [".....", ".....", ".####", "#....", "#....", "#....", ".####"],
    o: [".....", ".....", ".###.", "#...#", "#...#", "#...#", ".###."],
    v: [".....", ".....", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
    "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
    "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
};
const SHAPES = ["block", "boxx", "target", "boxdot", "block", "ring", "block"] as const;
const INKS = ["a", "b", "c", "d", "e"] as const;

export function AsciiWord({
    text,
    className,
    seed = 1,
    ...rest
}: {
    text: string;
    className?: string;
    seed?: number;
    "data-reveal"?: string;
}) {
    const letters = [...text].map((ch) => FONT[ch] ?? FONT.o!);
    const cols = letters.length * 6 - 1;
    const cells: { on: boolean; shape: string; ink: string; x: number }[] = [];
    for (let row = 0; row < 7; row++) {
        letters.forEach((glyph, li) => {
            for (let col = 0; col < 6; col++) {
                const x = li * 6 + col;
                if (x >= cols) continue;
                const on = col < 5 && glyph[row]![col] === "#";
                const h = hash(x, row, seed);
                cells.push({
                    on,
                    shape: SHAPES[Math.floor(h * SHAPES.length)]!,
                    ink: INKS[li % INKS.length]!,
                    x,
                });
            }
        });
    }
    return (
        <div
            {...rest}
            className={["ascii-word", className].filter(Boolean).join(" ")}
            aria-hidden="true"
        >
            <div className="ascii-grid" style={{ "--cols": cols } as CSSProperties}>
                {cells.map((cell, i) => (
                    <span
                        key={i}
                        className={cell.on ? `px g-${cell.shape} ink-${cell.ink}` : "px g-off"}
                        style={{ "--x": cell.x } as CSSProperties}
                    />
                ))}
            </div>
        </div>
    );
}
