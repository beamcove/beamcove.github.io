import type { GlyphComposition } from "@/design-system";

/**
 * The glyph scenes, one per section. Each section prints its own scene onto
 * the page grid; with motion off it prints one still frame.
 *
 * Rules (scenes.test.ts checks them):
 * - Scenes name ink slots (a–e), never colours.
 * - Each uses two or three different inks, and its blocks only use those.
 * - Blocks may cross a little where two inks meet, never sit one inside
 *   another, and two blocks of the same ink never overlap.
 * - Copy sits left or centred: blocks stay near the edges (and clear of the
 *   chapter rail's middle band on the right); the copy also gets a quiet
 *   patch at draw time, and a block that would touch it doesn't print.
 * - Reading scenes (`gather: "margins"`) keep their blocks in the outer 4%
 *   of the width, so on wide screens the art lives in the margins.
 * - The three kinds of work each get their own ink pair.
 */
export type SceneName =
    | "hero"
    | "intro"
    | "work"
    | "live"
    | "play"
    | "story"
    | "mission"
    | "vision"
    | "values"
    | "updates"
    | "faq"
    | "contact"
    | "projects"
    | "shipyard"
    | "about"
    | "team"
    | "log"
    | "hello"
    | "channels"
    | "brand"
    | "design"
    | "reading"
    | "readingB"
    | "readingC"
    | "legal"
    | "lost";

export const SCENES: Record<SceneName, GlyphComposition> = {
    // the lighthouse: two corners of blue; the beam sweeps between them
    hero: {
        seed: 7,
        inks: ["a", "b"],
        ramp: "symbols",
        density: 0.52,
        scale: 5,
        blocks: [
            { x: 0, y: 0.7, w: 0.08, h: 0.3, ink: "a" },
            { x: 0.05, y: 0.62, w: 0.07, h: 0.16, ink: "b" },
            { x: 0.91, y: 0.07, w: 0.09, h: 0.22, ink: "b" },
            { x: 0.87, y: 0.24, w: 0.06, h: 0.12, ink: "a" },
        ],
    },
    // three directions: a column and a step, off to the right
    intro: {
        seed: 19,
        inks: ["d", "c"],
        ramp: "grid",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.7, y: 0.12, w: 0.08, h: 0.34, ink: "d" },
            { x: 0.75, y: 0.4, w: 0.11, h: 0.16, ink: "c" },
        ],
    },
    // two windows on a desk
    work: {
        seed: 11,
        inks: ["a", "c"],
        ramp: "grid",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.6, y: 0.18, w: 0.15, h: 0.26, ink: "a" },
            { x: 0.7, y: 0.38, w: 0.14, h: 0.24, ink: "c" },
        ],
    },
    // a sun dropping behind a hill
    live: {
        seed: 23,
        inks: ["b", "d"],
        ramp: "marks",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.68, y: 0.34, w: 0.08, h: 0.4, ink: "b" },
            { x: 0.6, y: 0.7, w: 0.3, h: 0.3, ink: "d" },
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
            { x: 0.62, y: 0.12, w: 0.08, h: 0.46, ink: "e" },
            { x: 0.67, y: 0.52, w: 0.15, h: 0.24, ink: "a" },
        ],
    },
    story: {
        seed: 53,
        inks: ["e", "c"],
        ramp: "marks",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.68, y: 0, w: 0.07, h: 0.34, ink: "e" },
            { x: 0.72, y: 0.28, w: 0.14, h: 0.18, ink: "c" },
        ],
    },
    mission: {
        seed: 131,
        inks: ["b", "e"],
        ramp: "symbols",
        density: 0.46,
        blocks: [
            { x: 0, y: 0, w: 0.08, h: 0.28, ink: "b" },
            { x: 0.05, y: 0.22, w: 0.07, h: 0.12, ink: "e" },
            { x: 0.92, y: 0.72, w: 0.08, h: 0.28, ink: "e" },
        ],
    },
    vision: {
        seed: 113,
        inks: ["d", "e"],
        ramp: "grid",
        density: 0.5,
        blocks: [
            { x: 0.9, y: 0, w: 0.1, h: 0.26, ink: "e" },
            { x: 0.85, y: 0.2, w: 0.07, h: 0.14, ink: "d" },
            { x: 0, y: 0.76, w: 0.09, h: 0.24, ink: "d" },
        ],
    },
    values: {
        seed: 149,
        inks: ["a", "d"],
        ramp: "blocks",
        density: 0.48,
        blocks: [
            { x: 0, y: 0.1, w: 0.07, h: 0.3, ink: "a" },
            { x: 0.04, y: 0.34, w: 0.06, h: 0.14, ink: "d" },
        ],
    },
    updates: {
        seed: 67,
        inks: ["b", "c"],
        ramp: "signal",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.72, y: 0.1, w: 0.12, h: 0.2, ink: "b" },
            { x: 0.66, y: 0.24, w: 0.08, h: 0.24, ink: "c" },
        ],
    },
    faq: {
        seed: 163,
        inks: ["a", "c"],
        ramp: "signal",
        density: 0.48,
        gather: "left",
        blocks: [
            { x: 0, y: 0.6, w: 0.08, h: 0.4, ink: "c" },
            { x: 0.05, y: 0.84, w: 0.12, h: 0.16, ink: "a" },
        ],
    },
    contact: {
        seed: 127,
        inks: ["b", "a"],
        ramp: "marks",
        density: 0.5,
        blocks: [
            { x: 0.74, y: 0.08, w: 0.12, h: 0.2, ink: "b" },
            { x: 0.82, y: 0.22, w: 0.07, h: 0.12, ink: "a" },
            { x: 0, y: 0.84, w: 0.1, h: 0.16, ink: "a" },
        ],
    },

    // inner page heroes: copy left, art gathered right, two corners of ink
    projects: {
        seed: 41,
        inks: ["d", "b"],
        ramp: "grid",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.74, y: 0.1, w: 0.1, h: 0.3, ink: "d" },
            { x: 0.8, y: 0.34, w: 0.12, h: 0.16, ink: "b" },
        ],
    },
    shipyard: {
        seed: 43,
        inks: ["c", "a"],
        ramp: "marks",
        density: 0.44,
        gather: "right",
        blocks: [{ x: 0.86, y: 0.7, w: 0.14, h: 0.3, ink: "c" }],
    },
    about: {
        seed: 59,
        inks: ["e", "b"],
        ramp: "symbols",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.72, y: 0.08, w: 0.08, h: 0.34, ink: "e" },
            { x: 0.76, y: 0.36, w: 0.14, h: 0.14, ink: "b" },
        ],
    },
    team: {
        seed: 71,
        inks: ["d", "a"],
        ramp: "marks",
        density: 0.46,
        gather: "right",
        blocks: [
            { x: 0.78, y: 0.66, w: 0.12, h: 0.2, ink: "d" },
            { x: 0.86, y: 0.8, w: 0.14, h: 0.2, ink: "a" },
        ],
    },
    log: {
        seed: 73,
        inks: ["c", "d"],
        ramp: "signal",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.7, y: 0.14, w: 0.14, h: 0.18, ink: "c" },
            { x: 0.8, y: 0.28, w: 0.08, h: 0.28, ink: "d" },
        ],
    },
    hello: {
        seed: 79,
        inks: ["a", "e"],
        ramp: "marks",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.7, y: 0.16, w: 0.08, h: 0.3, ink: "a" },
            { x: 0.74, y: 0.42, w: 0.16, h: 0.14, ink: "e" },
        ],
    },
    channels: {
        seed: 89,
        inks: ["b", "d"],
        ramp: "grid",
        density: 0.44,
        gather: "left",
        blocks: [{ x: 0, y: 0.72, w: 0.08, h: 0.28, ink: "b" }],
    },
    brand: {
        seed: 83,
        inks: ["a", "c"],
        ramp: "blocks",
        density: 0.5,
        gather: "right",
        blocks: [
            { x: 0.74, y: 0.06, w: 0.06, h: 0.42, ink: "a" },
            { x: 0.78, y: 0.32, w: 0.14, h: 0.14, ink: "c" },
        ],
    },
    design: {
        seed: 101,
        inks: ["a", "b", "c"],
        ramp: "symbols",
        density: 0.52,
        gather: "right",
        blocks: [
            { x: 0.7, y: 0.08, w: 0.08, h: 0.26, ink: "c" },
            { x: 0.76, y: 0.28, w: 0.16, h: 0.14, ink: "a" },
            { x: 0.88, y: 0.66, w: 0.12, h: 0.34, ink: "b" },
        ],
    },
    // reading sections: the art lives in the side margins, the content column stays quiet;
    // three variants so neighbouring sections never repeat the same print
    reading: {
        seed: 3,
        inks: ["b", "e"],
        ramp: "grid",
        density: 0.5,
        gather: "margins",
        blocks: [
            { x: 0, y: 0.18, w: 0.04, h: 0.22, ink: "b" },
            { x: 0.96, y: 0.56, w: 0.04, h: 0.2, ink: "e" },
        ],
    },
    readingB: {
        seed: 5,
        inks: ["a", "c"],
        ramp: "signal",
        density: 0.48,
        gather: "margins",
        blocks: [
            { x: 0.96, y: 0.12, w: 0.04, h: 0.26, ink: "c" },
            { x: 0, y: 0.6, w: 0.04, h: 0.18, ink: "a" },
        ],
    },
    readingC: {
        seed: 9,
        inks: ["d", "b"],
        ramp: "symbols",
        density: 0.48,
        gather: "margins",
        blocks: [{ x: 0, y: 0.34, w: 0.04, h: 0.3, ink: "d" }],
    },
    legal: {
        seed: 97,
        inks: ["e", "b"],
        ramp: "grid",
        density: 0.46,
        gather: "right",
        blocks: [
            { x: 0.84, y: 0.12, w: 0.1, h: 0.3, ink: "e" },
            { x: 0.78, y: 0.36, w: 0.1, h: 0.12, ink: "b" },
        ],
    },
    lost: {
        seed: 404,
        inks: ["c", "a"],
        ramp: "symbols",
        density: 0.46,
        blocks: [
            { x: 0, y: 0.66, w: 0.1, h: 0.34, ink: "c" },
            { x: 0.9, y: 0, w: 0.1, h: 0.3, ink: "a" },
        ],
    },
};
