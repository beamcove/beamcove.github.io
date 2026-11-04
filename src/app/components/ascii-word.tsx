import "./ascii-word.css";

import type { CSSProperties, ReactNode } from "react";

import { ShapeCell, type ShapeName } from "@/design-system";
import { hash } from "@/design-system/glyph/engine";

/**
 * A 5×7 pixel face for the few words drawn in glyphs: the footer wordmark
 * and the brand pages. Each lit pixel is a symbol (● ▲ ■ ♥ ✕ +) on a 16px
 * cell; the rest is the resting dot grid. The dots are one SVG and each letter another,
 * laid over it, so a reveal can fade whole letters cheaply.
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
 * Lit pixels are drawn from the symbol set, weighted toward the full shapes
 * (■ ● ▲, a few ♥) so the letters read solid, with ✕ and + for texture.
 * Unlit cells next to a letter get a small faint +, so the word sits in a
 * little glyph field of its own; the rest are resting dots.
 */
const SYMBOLS: [shape: ShapeName, weight: number][] = [
    ["square", 0.34],
    ["disc", 0.26],
    ["tri", 0.18],
    ["heart", 0.08],
    ["cross", 0.08],
    ["plus", 0.06],
];
const pick = (h: number): ShapeName => {
    let acc = 0;
    for (const [shape, weight] of SYMBOLS) {
        acc += weight;
        if (h < acc) return shape;
    }
    return "square";
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
    // the resting dots never change: one SVG; each letter's symbols (and its faint halo)
    // get an SVG of their own, so a reveal fades whole letters on the compositor instead
    // of repainting hundreds of shapes
    const dots: ReactNode[] = [];
    const byLetter: ReactNode[][] = letters.map(() => []);
    for (let row = 0; row < 7; row++) {
        for (let x = 0; x < cols; x++) {
            const key = `${x},${row}`;
            const letter = byLetter[Math.min(letters.length - 1, Math.floor(x / 6))]!;
            if (lit(x, row)) {
                const ink = INKS[Math.floor(x / 6) % INKS.length]!;
                letter.push(
                    <g key={key} className={`px ink-${ink}`}>
                        <ShapeCell name={pick(hash(x, row, seed))} x={x * 16} y={row * 16} />
                    </g>,
                );
            } else if (lit(x - 1, row) || lit(x + 1, row) || lit(x, row - 1) || lit(x, row + 1)) {
                letter.push(
                    <g
                        key={key}
                        className="px g-halo"
                        transform={`translate(${x * 16 + 4} ${row * 16 + 4}) scale(0.5)`}
                    >
                        <ShapeCell name="plus" />
                    </g>,
                );
            } else {
                dots.push(
                    <circle
                        key={key}
                        className="g-off"
                        cx={x * 16 + 8}
                        cy={row * 16 + 8}
                        r={1.4}
                    />,
                );
            }
        }
    }
    const share = (n: number) => `${((n * 16) / (cols * 16)) * 100}%`;
    return (
        <div
            {...rest}
            className={["ascii-word", className].filter(Boolean).join(" ")}
            aria-hidden="true"
        >
            <svg className="ascii-grid" viewBox={`0 0 ${cols * 16} ${7 * 16}`} focusable="false">
                {dots}
            </svg>
            {byLetter.map((cells, i) => (
                <svg
                    key={i}
                    className="ascii-letter"
                    viewBox={`${i * 96} 0 96 ${7 * 16}`}
                    style={{ left: share(i * 6), width: share(6), "--i": i } as CSSProperties}
                    focusable="false"
                >
                    {cells}
                </svg>
            ))}
        </div>
    );
}
