import type { CSSProperties } from "react";

/**
 * Riso compositions in the spirit of the hero: two large, simple shapes
 * printed in two inks that overprint into a third where they cross, cut off by
 * the edge, over one soft bloom. Speckle sits on top of the whole print.
 *
 * Inks are the print inks plus the illustration inks (yellow, green) and their
 * screened tints for blooms. The hero's triangle and bar stay the hero's own.
 */
type Shape = "bloom" | "disc" | "ring" | "block" | "half" | "cap" | "quarter";
type Ink = "blue" | "red" | "yellow" | "green" | "sky" | "pink" | "butter" | "mint";

interface Piece {
    shape: Shape;
    ink: Ink;
    style: CSSProperties;
}

export type RisoArtName = "work" | "live" | "play" | "cove" | "contact" | "palette";

const ART: Record<RisoArtName, Piece[]> = {
    // blue disc over a red block: violet where they cross
    work: [
        { shape: "bloom", ink: "sky", style: { right: -60, top: -110, width: 360, height: 280 } },
        { shape: "disc", ink: "blue", style: { right: -24, top: -48, width: 176, height: 176 } },
        { shape: "block", ink: "red", style: { right: 96, bottom: -32, width: 120, height: 120 } },
    ],
    // a yellow half disc rising off the edge, a blue disc over it: green where they cross
    live: [
        { shape: "bloom", ink: "butter", style: { right: 10, top: -100, width: 340, height: 260 } },
        { shape: "half", ink: "yellow", style: { right: 48, bottom: 0, width: 232, height: 116 } },
        { shape: "disc", ink: "blue", style: { right: 16, top: 20, width: 104, height: 104 } },
    ],
    // a thick red ring and a yellow disc: orange where they cross
    play: [
        { shape: "bloom", ink: "pink", style: { right: 60, top: -90, width: 340, height: 260 } },
        {
            shape: "ring",
            ink: "red",
            style: {
                right: 104,
                top: -24,
                width: 160,
                height: 160,
                "--ring": "30px",
            } as CSSProperties,
        },
        {
            shape: "disc",
            ink: "yellow",
            style: { right: 44, bottom: -28, width: 120, height: 120 },
        },
    ],
    // a green quarter in the corner, a blue disc on its edge: teal where they cross
    cove: [
        { shape: "quarter", ink: "green", style: { right: 0, bottom: 0, width: 248, height: 248 } },
        { shape: "disc", ink: "blue", style: { right: 168, bottom: 104, width: 136, height: 136 } },
    ],
    // two half discs reaching from opposite edges, overlapping in the middle: violet
    contact: [
        {
            shape: "half",
            ink: "blue",
            style: { right: "5%", bottom: 0, height: "58%", aspectRatio: "2 / 1" },
        },
        {
            shape: "cap",
            ink: "red",
            style: { right: "calc(5% + 80px)", top: 0, height: "58%", aspectRatio: "2 / 1" },
        },
    ],
    // the three inks as overlapping discs, like a riso colour chart
    palette: [
        { shape: "disc", ink: "red", style: { right: 168, top: 28, width: 144, height: 144 } },
        { shape: "disc", ink: "yellow", style: { right: 56, top: 28, width: 144, height: 144 } },
        { shape: "disc", ink: "blue", style: { right: 112, top: 124, width: 144, height: 144 } },
    ],
};

export function RisoArt({ name, className }: { name: RisoArtName; className?: string }) {
    return (
        <div className={["riso-art", className].filter(Boolean).join(" ")} aria-hidden="true">
            {ART[name].map((piece, i) => (
                <span
                    key={i}
                    className={`riso-${piece.shape} riso-ink-${piece.ink}`}
                    style={{ ...piece.style, "--s": i } as CSSProperties}
                />
            ))}
        </div>
    );
}
