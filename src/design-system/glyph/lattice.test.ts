import { CELL, latticeOffset } from "@/design-system/glyph/lattice";

/** Centre x of cell 0 in document coordinates, for an element at `left`. */
const firstCentre = (left: number, page: number) =>
    left + latticeOffset(left, 0, page).x + CELL / 2;

describe("the page lattice", () => {
    it.each([375, 390, 768, 1024, 1280, 1440, 1920, 1366])(
        "puts cell centres on the page dots at %ipx",
        (page) => {
            for (const left of [0, 24, 160, 333.5, page / 2]) {
                const centre = firstCentre(left, page);
                // the CSS dots sit at page/2 + CELL * k
                const k = (centre - page / 2) / CELL;
                expect(Math.abs(k - Math.round(k))).toBeLessThan(1e-9);
            }
        },
    );

    it("keeps margins equal on both sides", () => {
        for (const page of [375, 390, 1280, 1440, 1921]) {
            // the outermost dots that fit, mirrored about the centre
            const n = Math.floor(page / 2 / CELL);
            const leftDot = page / 2 - CELL * n;
            const rightDot = page / 2 + CELL * n;
            expect(leftDot).toBeCloseTo(page - rightDot, 9);
            // the first cell of a full-width element is that dot's cell, or the one before it
            const first = firstCentre(0, page);
            expect([leftDot, leftDot - CELL].some((d) => Math.abs(d - first) < 1e-9)).toBe(true);
        }
    });

    it("starts each element on the lattice, at or before its edge", () => {
        for (const top of [0, 7, 16, 1000.5]) {
            const { x, y } = latticeOffset(37, top, 1440);
            expect(x).toBeLessThanOrEqual(0);
            expect(x).toBeGreaterThan(-CELL);
            expect(y).toBeLessThanOrEqual(0);
            expect(y).toBeGreaterThan(-CELL);
            // rows land on document multiples of CELL
            expect((((top + y) % CELL) + CELL) % CELL).toBeCloseTo(0, 9);
        }
    });
});
