import { buildField, type GlyphComposition } from "@/design-system/glyph/engine";

const comp: GlyphComposition = { seed: 7, inks: ["a", "b"], ramp: "grid", density: 0.5 };

describe("fields at an offset", () => {
    it("carry a scene on across a section edge without a seam", () => {
        // one tall field, and the same scene printed in a canvas that starts 6 rows down
        const whole = buildField(comp, 12, 20);
        const part = buildField(comp, 12, 10, { c: 0, r: 6 });
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 12; c++) {
                expect(part.base[r * 12 + c]).toBe(whole.base[(r + 6) * 12 + c]);
                expect(part.zone[r * 12 + c]).toBe(whole.zone[(r + 6) * 12 + c]);
            }
        }
    });

    it("work above a field too (negative rows)", () => {
        const f = buildField(comp, 8, 4, { c: 0, r: -30 });
        expect([...f.base].every((v) => v >= 0 && v <= 1)).toBe(true);
    });
});
