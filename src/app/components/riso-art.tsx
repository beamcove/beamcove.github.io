import type { CSSProperties } from "react";

/**
 * Riso compositions in the spirit of the hero: two large, simple shapes
 * printed in two inks that overprint into a third where they cross, cut off by
 * the edge, over one soft bloom. Speckle sits on top of the whole print.
 *
 * Inks are the print inks plus the illustration inks (yellow, green) and their
 * screened tints. Pair inks that make a clear third colour where they cross:
 * blue + yellow → green, blue + red → navy, pink + yellow → orange,
 * pink + blue → violet. Red over yellow barely changes, so never pair them.
 * The hero's triangle and bar stay the hero's own.
 */
type Shape = "bloom" | "disc" | "ring" | "block" | "diamond" | "half" | "cap" | "lune";
type Ink = "blue" | "red" | "yellow" | "green" | "sky" | "pink" | "butter" | "mint";

interface Piece {
    shape: Shape;
    ink: Ink;
    style: CSSProperties;
}

export type RisoArtName =
    | "work"
    | "live"
    | "play"
    | "products"
    | "about"
    | "values"
    | "updates"
    | "contact"
    | "brand"
    | "legal";

const ART: Record<RisoArtName, Piece[]> = {
    // blue disc over a red block: violet where they cross
    work: [
        { shape: "bloom", ink: "sky", style: { right: -60, top: -110, width: 360, height: 280 } },
        { shape: "disc", ink: "blue", style: { right: -24, top: -48, width: 176, height: 176 } },
        { shape: "block", ink: "red", style: { right: 96, bottom: -32, width: 120, height: 120 } },
    ],
    // a blue half moon off the right edge and a yellow disc: green where they meet
    live: [
        { shape: "bloom", ink: "butter", style: { right: 40, top: -100, width: 320, height: 260 } },
        { shape: "lune", ink: "blue", style: { right: 0, top: -12, width: 100, height: 200 } },
        { shape: "disc", ink: "yellow", style: { right: 58, top: 30, width: 116, height: 116 } },
    ],
    // a blue ball dropping into a tilted pink bowl: violet where it lands
    play: [
        { shape: "bloom", ink: "butter", style: { right: 30, top: -100, width: 340, height: 260 } },
        {
            shape: "cap",
            ink: "pink",
            style: { right: 24, bottom: -44, width: 220, height: 110, rotate: "-14deg" },
        },
        { shape: "disc", ink: "blue", style: { right: 104, top: 36, width: 88, height: 88 } },
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
    // brand (rose): two swatch blades fanned out, green where they cross
    brand: [
        {
            shape: "block",
            ink: "yellow",
            style: { right: 150, top: 18, width: 96, height: 230, rotate: "-14deg" },
        },
        {
            shape: "block",
            ink: "blue",
            style: { right: 70, top: 18, width: 96, height: 230, rotate: "14deg" },
        },
    ],
    // products (lagoon): a red and a blue block stacked like cards, violet where they overlap
    products: [
        { shape: "block", ink: "blue", style: { right: 72, top: 28, width: 150, height: 150 } },
        { shape: "block", ink: "red", style: { right: 160, top: 104, width: 150, height: 150 } },
    ],
    // about (tide): a yellow disc eclipsed by a pink one, an orange lens between
    about: [
        { shape: "disc", ink: "yellow", style: { right: 64, top: 32, width: 172, height: 172 } },
        { shape: "disc", ink: "pink", style: { right: 184, top: 104, width: 136, height: 136 } },
    ],
    // values (flare): a blue diamond, like a compass, over a yellow disc
    values: [
        { shape: "diamond", ink: "blue", style: { right: 90, top: 50, width: 150, height: 150 } },
        {
            shape: "disc",
            ink: "yellow",
            style: { right: 80, bottom: 4, width: 120, height: 120 },
        },
    ],
    // updates (sky): a blue ring off the top edge and a red disc crossing it
    updates: [
        {
            shape: "ring",
            ink: "blue",
            style: {
                right: 60,
                top: -30,
                width: 200,
                height: 200,
                "--ring": "30px",
            } as CSSProperties,
        },
        { shape: "disc", ink: "red", style: { right: 152, top: 102, width: 96, height: 96 } },
    ],
    // legal (tide): a pink half moon off the right edge and a yellow disc, orange between
    legal: [
        { shape: "lune", ink: "pink", style: { right: 0, bottom: 24, width: 120, height: 240 } },
        { shape: "disc", ink: "yellow", style: { right: 64, top: 128, width: 110, height: 110 } },
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
