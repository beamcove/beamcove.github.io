import type { GlyphComposition } from "@/design-system/glyph/engine";
import { CELL } from "@/design-system/glyph/lattice";
import {
    createPainter,
    type FieldFrame,
    flipAt,
    geometry,
    type PainterEnv,
} from "@/design-system/glyph/painter";

/** A 2D context that only counts what it is asked to do. */
function countingContext() {
    const calls: Record<string, number> = {};
    const ctx = new Proxy(
        {},
        {
            get: (_, name: string) =>
                name === "calls"
                    ? calls
                    : () => {
                          calls[name] = (calls[name] ?? 0) + 1;
                          return null;
                      },
            set: () => true,
        },
    );
    return { ctx, calls };
}

/** A stand-in canvas (jsdom has no 2D context). */
function fakeCanvas() {
    const { ctx, calls } = countingContext();
    return { canvas: { width: 0, height: 0, getContext: () => ctx }, calls };
}

const COMP: GlyphComposition = { seed: 7, inks: ["a", "b"], ramp: "signal", density: 0.6 };
const ENV: PainterEnv = { tokens: { "--surface-page": "#11131d" }, bg: "rgba(0, 0, 0, 0)", dpr: 2 };
const FRAME: FieldFrame = { time: 1000, animate: false, beam: 0 };
const W = 640;
const H = 480;

function painter() {
    const { canvas, calls } = fakeCanvas();
    const p = createPainter(
        canvas as unknown as OffscreenCanvas,
        COMP,
        { dots: false, soften: false },
        ENV,
    )!;
    p.resize(W, H, { x: -4, y: -8 }, 1.5);
    p.layout([], null, null);
    const reset = () => {
        for (const k of Object.keys(calls)) delete calls[k];
    };
    return { p, calls, reset };
}

beforeAll(() => {
    // the shared glyph atlases are scratch canvases too
    vi.stubGlobal(
        "OffscreenCanvas",
        class {
            width: number;
            height: number;
            constructor(w: number, h: number) {
                this.width = w;
                this.height = h;
            }
            getContext() {
                return countingContext().ctx;
            }
        },
    );
});
afterAll(() => vi.unstubAllGlobals());

describe("geometry", () => {
    it("rounds the pixel ratio to quarters and caps it", () => {
        expect(geometry(100, 100, { x: 0, y: 0 }, 1.5, 3).dpr).toBe(1.5);
        expect(geometry(100, 100, { x: 0, y: 0 }, 2, 1.3).dpr).toBe(1.25);
        expect(geometry(100, 100, { x: 0, y: 0 }, 2, 0).dpr).toBe(1);
    });

    it("snaps the lattice offset to device pixels and covers the canvas with cells", () => {
        const g = geometry(100, 50, { x: -3.3, y: -7.9 }, 2, 2);
        expect(g.ox).toBe(-3.5);
        expect(g.oy).toBe(-8);
        expect(g.ox + g.cols * CELL).toBeGreaterThanOrEqual(100);
        expect(g.oy + g.rows * CELL).toBeGreaterThanOrEqual(50);
        expect(g.ox + (g.cols - 1) * CELL).toBeLessThan(100);
    });
});

describe("the takeover's turnover", () => {
    it("turns the bottom of the screen over first", () => {
        for (const col of [0, 5, 40])
            expect(flipAt(800, 800, col, 3)).toBeLessThan(flipAt(0, 800, col, 3));
    });
});

describe("the painter", () => {
    it("repaints only the cells that changed", () => {
        const { p, calls, reset } = painter();
        p.draw(FRAME);
        expect(calls.drawImage).toBeGreaterThan(0);
        reset();
        p.draw(FRAME);
        expect(calls.drawImage ?? 0).toBe(0);
        expect(calls.clearRect ?? 0).toBe(0);
    });

    it("prints everything again after a layout", () => {
        const { p, calls, reset } = painter();
        p.draw(FRAME);
        reset();
        p.layout([{ l: 100, t: 100, r: 300, b: 200 }], null, null);
        p.draw(FRAME);
        // a full print starts by clearing the whole canvas
        expect(calls.clearRect).toBeGreaterThan(0);
    });

    it("keeps the copy quiet, and fixed furniture quiet as it moves", () => {
        const glyphs = (setup: (p: ReturnType<typeof painter>["p"]) => FieldFrame) => {
            const { p, calls } = painter();
            p.draw(setup(p));
            return calls.drawImage ?? 0;
        };
        const all = { l: 0, t: 0, r: W, b: H };
        const open = glyphs(() => FRAME);
        const copy = glyphs((p) => {
            p.layout([all], null, null);
            return FRAME;
        });
        const furniture = glyphs(() => ({ ...FRAME, live: [{ ...all, soft: true }] }));
        expect(copy).toBeLessThan(open);
        expect(furniture).toBeLessThan(open);
    });

    it("only draws the rows on screen", () => {
        const { p, calls } = painter();
        p.draw({ ...FRAME, view: { top: 0, bottom: CELL * 2 } });
        const some = calls.drawImage ?? 0;
        const full = painter();
        full.p.draw(FRAME);
        expect(some).toBeLessThan(full.calls.drawImage ?? 0);
    });
});
