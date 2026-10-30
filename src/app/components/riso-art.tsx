import type { CSSProperties } from "react";

/**
 * Riso compositions in the spirit of the hero: two large, simple shapes
 * printed in full ink that overprint into a third colour where they cross, cut
 * off by the edge, over one soft bloom. Speckle sits on top of the whole print.
 *
 * Rules: every composition prints its shapes in two different full inks, every
 * overlap multiplies (nothing knocks out or covers what's below), and the
 * cards in a KindGrid each use their own pair. Screened tints (sky, pink,
 * butter, mint) are for blooms, never shapes; the types enforce it and
 * riso-art.test.ts checks the rest. Shapes cross a little, never one inside
 * another. White is an opaque ink printed first, under everything else, so the
 * inks above still multiply over it (green over white stays green).
 *
 * Pair inks that make a clear third colour where they cross:
 * blue + yellow → green, blue + red → navy, blue + green → deep teal,
 * yellow + green → deep green. Red over yellow barely changes, so never pair them.
 * The hero's triangle and bar stay the hero's own.
 */
type Shape = "disc" | "ring" | "block" | "diamond" | "half" | "cap" | "lune";
type Ink = "blue" | "red" | "yellow" | "green" | "white";
type Tint = "sky" | "pink" | "butter" | "mint";

type Piece =
    | { shape: "bloom"; ink: Ink | Tint; style: CSSProperties }
    | { shape: Shape; ink: Ink; style: CSSProperties };

export type RisoArtName =
    | "work"
    | "live"
    | "play"
    | "projects"
    | "about"
    | "values"
    | "updates"
    | "contact"
    | "brand"
    | "legal";

export const ART: Record<RisoArtName, Piece[]> = {
    // blue disc over a red block: violet where they cross
    work: [
        { shape: "bloom", ink: "sky", style: { right: -60, top: -110, width: 360, height: 280 } },
        { shape: "disc", ink: "blue", style: { right: -24, top: -48, width: 176, height: 176 } },
        { shape: "block", ink: "red", style: { right: 96, bottom: -32, width: 120, height: 120 } },
    ],
    // a white sun setting behind a green hill off the right edge
    live: [
        { shape: "bloom", ink: "mint", style: { right: 20, top: -110, width: 340, height: 260 } },
        { shape: "disc", ink: "white", style: { right: 108, bottom: 70, width: 72, height: 72 } },
        {
            shape: "half",
            ink: "green",
            style: { right: -70, bottom: -30, width: 280, height: 140 },
        },
    ],
    // a yellow hoop and a blue ball bouncing through it: green where they cross
    play: [
        { shape: "bloom", ink: "butter", style: { right: 10, top: -130, width: 320, height: 240 } },
        {
            shape: "ring",
            ink: "yellow",
            style: {
                right: 26,
                top: 18,
                width: 150,
                height: 150,
                "--ring": "28px",
            } as CSSProperties,
        },
        { shape: "disc", ink: "blue", style: { right: 136, top: 70, width: 84, height: 84 } },
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
    // projects (lagoon): a red and a blue block stacked like cards, violet where they overlap
    projects: [
        { shape: "block", ink: "blue", style: { right: 72, top: 28, width: 150, height: 150 } },
        { shape: "block", ink: "red", style: { right: 160, top: 104, width: 150, height: 150 } },
    ],
    // about (tide): a yellow disc eclipsed by a blue one, a green lens between
    about: [
        { shape: "disc", ink: "yellow", style: { right: 64, top: 32, width: 172, height: 172 } },
        { shape: "disc", ink: "blue", style: { right: 184, top: 104, width: 136, height: 136 } },
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
    // legal (tide): a blue half moon off the right edge and a yellow disc, green between
    legal: [
        { shape: "lune", ink: "blue", style: { right: 0, bottom: 24, width: 120, height: 240 } },
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
