import type { InkSlot } from "../glyph/engine";

/**
 * The symbol set: a handful of shapes everyone already knows, drawn bold and
 * round on one 16px cell, the same family as the glyph art. ● ▲ ■ are the
 * mark (and the three kinds of work); ♥ is for the things we love; ✕ + and
 * the dash make faces and status.
 */
export type ShapeName = "disc" | "tri" | "square" | "heart" | "cross" | "plus" | "dash";

/** A shape's colour: an ink slot, the action ink, the accent, or the text colour. */
export type ShapeInk = InkSlot | "beam" | "flare" | "ink";

/** The character each shape stands for. */
export const SHAPE_CHARS: Record<ShapeName, string> = {
    disc: "●",
    tri: "▲",
    square: "■",
    heart: "♥",
    cross: "✕",
    plus: "+",
    dash: "—",
};

/** The mark's three shapes, in the inks of the kinds of work they stand for. */
export const MARK: readonly { name: ShapeName; ink: InkSlot; kind: string }[] = [
    { name: "disc", ink: "b", kind: "everyday life" },
    { name: "tri", ink: "e", kind: "play" },
    { name: "square", ink: "a", kind: "work" },
];
