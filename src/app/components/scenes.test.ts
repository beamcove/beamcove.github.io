import { SCENES, type SceneName } from "@/app/components/scenes";
import { KINDS } from "@/content/fleet";
import type { InkBlock } from "@/design-system";
import { buildField, glyphFor, RAMPS } from "@/design-system/glyph/engine";

const NAMES = Object.keys(SCENES) as SceneName[];

const crosses = (a: InkBlock, b: InkBlock) =>
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const inside = (a: InkBlock, b: InkBlock) =>
    a.x >= b.x && a.x + a.w <= b.x + b.w && a.y >= b.y && a.y + a.h <= b.y + b.h;
const pairs = <T>(list: T[]) =>
    list.flatMap((a, i) => list.slice(i + 1).map((b) => [a, b] as const));

describe("scenes", () => {
    it.each(NAMES)("%s prints in two or three different inks", (name) => {
        const { inks } = SCENES[name];
        expect(new Set(inks).size).toBe(inks.length);
        expect(inks.length).toBeGreaterThanOrEqual(2);
        expect(inks.length).toBeLessThanOrEqual(3);
    });

    it.each(NAMES)("%s prints its blocks in its own inks, inside the frame", (name) => {
        for (const block of SCENES[name].blocks ?? []) {
            expect(SCENES[name].inks).toContain(block.ink);
            expect(block.x).toBeGreaterThanOrEqual(0);
            expect(block.y).toBeGreaterThanOrEqual(0);
            expect(block.x + block.w).toBeLessThanOrEqual(1.0001);
            expect(block.y + block.h).toBeLessThanOrEqual(1.0001);
        }
    });

    it.each(NAMES)("%s never nests a block or doubles an ink", (name) => {
        for (const [a, b] of pairs(SCENES[name].blocks ?? [])) {
            expect(inside(a, b) || inside(b, a)).toBe(false);
            if (a.ink === b.ink) expect(crosses(a, b)).toBe(false);
        }
    });

    it("gives every kind of work its own ink pair", () => {
        const keys = KINDS.map((kind) => [...SCENES[kind.art].inks].sort().join("+"));
        expect(new Set(keys).size).toBe(keys.length);
    });
});

describe("glyph engine", () => {
    it("draws the same field for the same seed, and another for another", () => {
        const one = buildField(SCENES.hero, 40, 20);
        const two = buildField(SCENES.hero, 40, 20);
        const three = buildField({ ...SCENES.hero, seed: SCENES.hero.seed + 1 }, 40, 20);
        expect(Array.from(one.base)).toEqual(Array.from(two.base));
        expect(Array.from(one.base)).not.toEqual(Array.from(three.base));
    });

    it("keeps values and ink zones in range, and covers block cells", () => {
        const field = buildField(SCENES.design, 30, 12);
        for (const v of field.base) expect(v >= 0 && v <= 1).toBe(true);
        for (const z of field.zone) expect(z).toBeLessThan(SCENES.design.inks.length);
        expect(field.covered.some(Boolean)).toBe(true);
    });

    it("maps values onto the ramp, light to dense", () => {
        const steps = RAMPS.signal.length;
        expect(glyphFor(0.1, 0.5, steps).step).toBe(-1);
        expect(glyphFor(0.51, 0.5, steps).step).toBe(0);
        expect(glyphFor(1, 0.5, steps).step).toBe(steps - 1);
    });
});
