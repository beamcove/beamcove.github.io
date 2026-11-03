/**
 * The filled symbols, as SVG paths on one 16×16 cell. The Shape components
 * and the canvas glyphs both draw from these, so a ▲ in the art and a ▲ in the
 * mark are the same shape. All of them fill the same band, about 3 → 13, so
 * they read as one size side by side.
 */
export const SYMBOL_PATHS = {
    /** ● r 5, centred. */
    disc: "M8 3a5 5 0 1 1 0 10a5 5 0 1 1 0-10Z",
    /** ▲ drawn with a 1.6 round stroke on top, so its corners are soft; it sits on the 13 line. */
    tri: "M8 3.6 12.85 12.2H3.15Z",
    /** ■ 9.4 square, soft corners. */
    square: "M5.5 3.3h5a2.2 2.2 0 0 1 2.2 2.2v5a2.2 2.2 0 0 1-2.2 2.2h-5a2.2 2.2 0 0 1-2.2-2.2v-5a2.2 2.2 0 0 1 2.2-2.2Z",
    /** ♥ two lobes and a soft point, 11 wide. */
    heart: "M8 13C7.2 12.4 2.5 9.4 2.5 6C2.5 4.2 3.8 3 5.4 3C6.5 3 7.4 3.6 8 4.5C8.6 3.6 9.5 3 10.6 3C12.2 3 13.5 4.2 13.5 6C13.5 9.4 8.8 12.4 8 13Z",
} as const;

/** The triangle's soft-corner stroke width, in cell units. */
export const TRI_STROKE = 1.6;
