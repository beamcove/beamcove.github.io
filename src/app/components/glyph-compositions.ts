import type { GlyphComposition } from "@/design-system";

/**
 * Glyph art for every splash and card: a field of glyphs cut by solid ink
 * blocks, like a printed terminal readout.
 *
 * Rules (glyph-compositions.test.ts checks them):
 * - Compositions name ink slots (a–e), never colours, so each theme re-inks them.
 * - Each uses two or three different inks, and its blocks only use those.
 * - Blocks cross a little where two inks meet (they overprint: screen on dark
 *   themes, multiply on paper), but never sit one inside another, and two
 *   blocks of the same ink never overlap.
 * - The cards in a KindGrid each use their own ink pair.
 * - Copy sits on the left, so fields gather right and blocks stay right.
 */
export type GlyphArtName =
    | "hero"
    | "work"
    | "live"
    | "play"
    | "projects"
    | "about"
    | "updates"
    | "contact"
    | "brand"
    | "legal"
    | "design"
    | "vision"
    | "newsletter"
    | "lost";

export const ART: Record<GlyphArtName, GlyphComposition> = {
    // a big lime block off the top right, stepping down, with a pink and a cyan block crossing
    hero: {
        seed: 7,
        inks: ["a", "b", "c"],
        ramp: "signal",
        density: 0.6,
        gather: "right",
        blocks: [
            { x: 0.7, y: 0, w: 0.3, h: 0.32, ink: "a" },
            { x: 0.6, y: 0.32, w: 0.16, h: 0.26, ink: "a" },
            { x: 0.84, y: 0.6, w: 0.16, h: 0.22, ink: "c" },
            { x: 0.72, y: 0.5, w: 0.16, h: 0.16, ink: "b" },
        ],
    },
    // two stacked blocks, like windows on a desk
    work: {
        seed: 11,
        inks: ["a", "c"],
        ramp: "grid",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.56, y: 0, w: 0.3, h: 0.5, ink: "a" },
            { x: 0.74, y: 0.36, w: 0.26, h: 0.5, ink: "c" },
        ],
    },
    // a sun dropping behind a hill
    live: {
        seed: 23,
        inks: ["b", "d"],
        ramp: "marks",
        density: 0.48,
        gather: "right",
        blocks: [
            { x: 0.66, y: 0.2, w: 0.16, h: 0.44, ink: "b" },
            { x: 0.52, y: 0.56, w: 0.48, h: 0.44, ink: "d" },
        ],
    },
    // a tall piece and a short one, mid-bounce
    play: {
        seed: 37,
        inks: ["e", "a"],
        ramp: "blocks",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.5, y: 0.1, w: 0.22, h: 0.62, ink: "e" },
            { x: 0.66, y: 0.46, w: 0.3, h: 0.4, ink: "a" },
        ],
    },
    projects: {
        seed: 41,
        inks: ["d", "b"],
        ramp: "grid",
        density: 0.56,
        gather: "right",
        blocks: [
            { x: 0.72, y: 0, w: 0.18, h: 0.56, ink: "d" },
            { x: 0.84, y: 0.42, w: 0.16, h: 0.58, ink: "b" },
        ],
    },
    about: {
        seed: 53,
        inks: ["e", "c"],
        ramp: "marks",
        density: 0.56,
        gather: "right",
        blocks: [
            { x: 0.64, y: 0.12, w: 0.14, h: 0.5, ink: "e" },
            { x: 0.74, y: 0.5, w: 0.26, h: 0.5, ink: "c" },
        ],
    },
    updates: {
        seed: 67,
        inks: ["b", "c"],
        ramp: "signal",
        density: 0.56,
        gather: "right",
        blocks: [
            { x: 0.78, y: 0, w: 0.22, h: 0.42, ink: "b" },
            { x: 0.68, y: 0.34, w: 0.14, h: 0.4, ink: "c" },
        ],
    },
    contact: {
        seed: 79,
        inks: ["c", "d"],
        ramp: "marks",
        density: 0.56,
        gather: "right",
        blocks: [
            { x: 0.62, y: 0.18, w: 0.14, h: 0.46, ink: "d" },
            { x: 0.7, y: 0.56, w: 0.3, h: 0.44, ink: "c" },
        ],
    },
    brand: {
        seed: 83,
        inks: ["a", "e"],
        ramp: "blocks",
        density: 0.54,
        gather: "right",
        blocks: [
            { x: 0.66, y: 0.08, w: 0.1, h: 0.84, ink: "a" },
            { x: 0.72, y: 0.3, w: 0.22, h: 0.34, ink: "e" },
        ],
    },
    legal: {
        seed: 97,
        inks: ["e", "b"],
        ramp: "grid",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.82, y: 0.16, w: 0.18, h: 0.6, ink: "e" },
            { x: 0.72, y: 0.62, w: 0.14, h: 0.38, ink: "b" },
        ],
    },
    design: {
        seed: 101,
        inks: ["a", "b", "c"],
        ramp: "signal",
        density: 0.58,
        gather: "right",
        blocks: [
            { x: 0.64, y: 0, w: 0.12, h: 0.4, ink: "c" },
            { x: 0.72, y: 0.3, w: 0.28, h: 0.3, ink: "a" },
            { x: 0.84, y: 0.6, w: 0.16, h: 0.4, ink: "b" },
        ],
    },
    vision: {
        seed: 113,
        inks: ["d", "e"],
        ramp: "grid",
        density: 0.52,
        blocks: [
            { x: 0.86, y: 0, w: 0.14, h: 0.36, ink: "e" },
            { x: 0.78, y: 0.28, w: 0.12, h: 0.24, ink: "d" },
        ],
    },
    newsletter: {
        seed: 127,
        inks: ["b", "a"],
        ramp: "marks",
        density: 0.5,
        blocks: [
            { x: 0, y: 0, w: 0.12, h: 0.46, ink: "b" },
            { x: 0.88, y: 0.54, w: 0.12, h: 0.46, ink: "a" },
        ],
    },
    lost: {
        seed: 404,
        inks: ["c", "a"],
        ramp: "blocks",
        density: 0.46,
        blocks: [
            { x: 0, y: 0.6, w: 0.14, h: 0.4, ink: "c" },
            { x: 0.86, y: 0, w: 0.14, h: 0.34, ink: "a" },
        ],
    },
};
