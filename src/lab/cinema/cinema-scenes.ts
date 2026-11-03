import type { GlyphComposition } from "@/design-system";

/**
 * One glyph composition per screen of the story, sized for the whole
 * viewport. The stage dissolves from one to the next as you scroll; with
 * motion off, each section prints its own. Every scene has its own ink pair
 * (neighbours never share one), blocks only in those inks, crossing a little
 * and never nesting. Blocks keep clear of the copy (left on most screens,
 * centred on the hero and statements) and of the chapter rail (right edge,
 * middle band); the copy also gets a quiet patch at draw time.
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
    | "contact";

export const SCENES: Record<SceneName, GlyphComposition> = {
    // the lighthouse: two corners of blue; the beam sweeps between them
    hero: {
        seed: 7,
        inks: ["a", "b"],
        ramp: "signal",
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
        ramp: "marks",
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
};
