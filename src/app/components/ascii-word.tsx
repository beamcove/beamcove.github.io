import "./ascii-word.css";

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
/**
 * Lit pixels draw from the grid ramp (+ ✕ ▢ ⊠), weighted toward the dense end
 * so the letters read solid; unlit cells next to a letter get a faint +, so
 * the word sits in a little glyph field of its own.
 */
const GRID: [shape: string, weight: number][] = [
    ["boxx", 0.5],
    ["square", 0.32],
    ["cross", 0.12],
    ["plus", 0.06],
];
const pick = (h: number) => {
    let acc = 0;
    for (const [shape, weight] of GRID) {
        acc += weight;
        if (h < acc) return shape;
    }
    return "boxx";
};
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
    const lit = (x: number, row: number) => {
        if (x < 0 || x >= cols || row < 0 || row > 6 || x % 6 === 5) return false;
        return letters[Math.floor(x / 6)]![row]![x % 6] === "#";
    };
    const cells: { cls: string; x: number }[] = [];
    for (let row = 0; row < 7; row++) {
        for (let x = 0; x < cols; x++) {
            if (lit(x, row)) {
                const ink = INKS[Math.floor(x / 6) % INKS.length]!;
                cells.push({ cls: `px g-${pick(hash(x, row, seed))} ink-${ink}`, x });
            } else {
                const near =
                    lit(x - 1, row) || lit(x + 1, row) || lit(x, row - 1) || lit(x, row + 1);
                cells.push({ cls: near ? "px g-plus g-halo" : "px g-off", x });
            }
        }
    }
    return (
        <div
            {...rest}
            className={["ascii-word", className].filter(Boolean).join(" ")}
            aria-hidden="true"
        >
            <div className="ascii-grid" style={{ "--cols": cols } as CSSProperties}>
                {cells.map((cell, i) => (
                    <span key={i} className={cell.cls} style={{ "--x": cell.x } as CSSProperties} />
                ))}
            </div>
        </div>
    );
}
