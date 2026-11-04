import type { GlyphComposition } from "@/design-system/glyph/engine";
import { CELL } from "@/design-system/glyph/lattice";
import {
    createPainter,
    type FieldFrame,
    type PainterEnv,
    type Rect,
} from "@/design-system/glyph/painter";

/**
 * A stand-in canvas that remembers what each cell shows: which atlas, and
 * where in it. Atlas canvases remember the ink their glyphs were drawn in.
 */
class Recorder {
    width: number;
    height: number;
    fill = "";
    from: Recorder[] = [];
    picture = new Map<string, { atlas: Recorder; sx: number; sy: number }>();
    constructor(w = 0, h = 0) {
        this.width = w;
        this.height = h;
    }
    getContext() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const canvas = this;
        return new Proxy(
            {},
            {
                get: (_, name: string) => {
                    if (name === "drawImage")
                        return (...args: [Recorder, ...number[]]) => {
                            const [img, sx = 0, sy = 0, , , dx = 0, dy = 0] = args;
                            canvas.from.push(img);
                            canvas.picture.set(`${dx},${dy}`, { atlas: img, sx, sy });
                        };
                    if (name === "clearRect")
                        return (x: number, y: number, w: number) => {
                            if (w > CELL) canvas.picture.clear();
                            else canvas.picture.delete(`${x},${y}`);
                        };
                    return () => null;
                },
                set: (_, name: string, value: unknown) => {
                    if (name === "fillStyle" && typeof value === "string") canvas.fill = value;
                    return true;
                },
            },
        );
    }
    /** The ink a printed atlas's glyphs were drawn in. */
    get ink() {
        return this.from[0]?.fill ?? "";
    }
}

const INKS = { a: "#aa0001", b: "#bb0002", c: "#cc0003", d: "#dd0004", e: "#ee0005" };
const ENV: PainterEnv = {
    tokens: Object.fromEntries(Object.entries(INKS).map(([k, v]) => [`--ink-${k}`, v])),
    bg: "transparent",
    dpr: 1,
};
// the `signal` ramp has nine glyphs; the mark comes from `symbols`, which has seven
const COMP: GlyphComposition = { seed: 3, inks: ["c", "d"], ramp: "signal", density: 0.55 };
const W = 960;
const H = 640;
const SIZE = CELL;
const isMark = (atlas: Recorder) => atlas.width === 7 * SIZE;

function painter(quiet: Rect[] = []) {
    const canvas = new Recorder();
    const p = createPainter(
        canvas as unknown as OffscreenCanvas,
        COMP,
        { dots: false, soften: false },
        ENV,
    )!;
    p.resize(W, H, { x: 0, y: 0 }, 1);
    p.layout(quiet, null, null);
    const picture = () =>
        new Map(
            [...canvas.picture].map(([k, v]) => [
                k,
                `${v.atlas.width}:${v.atlas.ink}:${v.sx}:${v.sy}`,
            ]),
        );
    return { p, canvas, picture };
}

const frame = (time: number, story?: FieldFrame["story"]): FieldFrame => ({
    time,
    animate: true,
    beam: 0,
    story,
});
// a light from the left edge, pointing straight across the canvas at y = 160
const LIGHT = { x: -40, y: 160, dir: 0, spread: 0.05, reach: 2000, amt: 1 };

beforeAll(() => {
    vi.stubGlobal("OffscreenCanvas", Recorder);
    // the mark's shapes are paths (jsdom has none)
    vi.stubGlobal("Path2D", class {});
});
afterAll(() => vi.unstubAllGlobals());

describe("the story's light", () => {
    it("lights the cells in its cone and leaves the rest as they were", () => {
        const dark = painter();
        const lit = painter();
        dark.p.draw(frame(500));
        lit.p.draw(frame(500, { light: LIGHT }));
        const a = dark.picture();
        const b = lit.picture();
        const changed = [...b]
            .filter(([k, v]) => a.get(k) !== v)
            .map(([k]) => Number(k.split(",")[1]));
        expect(changed.length).toBeGreaterThan(10);
        // only rows near y = 160 change (the cone is a few cells wide there)
        for (const y of changed) expect(Math.abs(y + CELL / 2 - 160)).toBeLessThan(CELL * 4);
    });

    it("leaves an afterglow that fades away", () => {
        const plain = painter();
        plain.p.draw(frame(4000));
        const glow = painter();
        glow.p.draw(frame(0, { light: LIGHT, afterglow: 400 }));
        glow.p.draw(frame(200, { afterglow: 400 }));
        expect(glow.picture()).not.toEqual(plain.picture());
        // ten fade times later, nothing of it is left
        glow.p.draw(frame(4000, { afterglow: 400 }));
        expect(glow.picture()).toEqual(plain.picture());
    });

    it("sparks into the mark, in the mark's inks, and never near the copy", () => {
        const copy: Rect = { l: 300, t: 100, r: 700, b: 220 };
        const { p, canvas } = painter([copy]);
        p.draw(frame(0, { light: { ...LIGHT, y: 300 }, afterglow: 1000, marks: true }));
        p.draw(frame(0, { light: { ...LIGHT, y: 150 }, afterglow: 1000, marks: true }));
        const marks = [...canvas.picture].filter(([, v]) => isMark(v.atlas));
        expect(marks.length).toBeGreaterThan(0);
        for (const [key, v] of marks) {
            expect([INKS.b, INKS.e, INKS.a]).toContain(v.atlas.ink);
            expect(v.sx / SIZE).toBeGreaterThanOrEqual(4);
            const [x, y] = key.split(",").map(Number) as [number, number];
            const inside = x + CELL > copy.l && x < copy.r && y + CELL > copy.t && y < copy.b;
            expect(inside).toBe(false);
        }
    });
});

describe("beacons", () => {
    it("blink in a few fixed places, as ● or ▲", () => {
        const { p, canvas } = painter();
        const seen = new Set<string>();
        const counts: number[] = [];
        for (let t = 0; t < 12000; t += 500) {
            p.draw(frame(t, { beacons: 1 }));
            const marks = [...canvas.picture].filter(([, v]) => isMark(v.atlas));
            counts.push(marks.length);
            for (const [key, v] of marks) {
                seen.add(key);
                expect([INKS.b, INKS.e]).toContain(v.atlas.ink);
            }
        }
        const cells = (W / CELL) * (H / CELL);
        expect(seen.size).toBeGreaterThan(0);
        expect(seen.size).toBeLessThan(cells * 0.01);
        // they blink: not every beacon is lit at every moment
        expect(new Set(counts).size).toBeGreaterThan(1);
    });
});

describe("the swell and the sky", () => {
    it("only change the water below the horizon, and the sky above it", () => {
        const plain = painter();
        plain.p.draw(frame(2000));
        const sea = painter();
        sea.p.draw(frame(2000, { swell: { amt: 1, horizon: 400 } }));
        const sky = painter();
        sky.p.draw(frame(2000, { sky: { amt: 1, horizon: 200 } }));
        const rowsChanged = (other: Map<string, string>) => {
            const base = plain.picture();
            const keys = new Set([...base.keys(), ...other.keys()]);
            return [...keys]
                .filter((k) => base.get(k) !== other.get(k))
                .map((k) => Number(k.split(",")[1]));
        };
        const wet = rowsChanged(sea.picture());
        const high = rowsChanged(sky.picture());
        expect(wet.length).toBeGreaterThan(0);
        expect(high.length).toBeGreaterThan(0);
        for (const y of wet) expect(y + CELL / 2).toBeGreaterThan(400);
        for (const y of high) expect(y + CELL / 2).toBeLessThan(200);
    });
});

describe("the pointer over copy", () => {
    // the copy's box, and the pointer in its middle
    const copy: Rect = { l: 320, t: 240, r: 640, b: 400 };
    const pointer = { x: 480, y: 320, amt: 1 };
    // the minor glyphs come from the `grid` ramp (· + × ■ ⊠), which has five
    const isMinor = (atlas: Recorder) => atlas.width === 5 * SIZE;
    const insideCopy = (key: string) => {
        const [x, y] = key.split(",").map(Number) as [number, number];
        return x >= copy.l && x + CELL <= copy.r && y >= copy.t && y + CELL <= copy.b;
    };

    it("still shows, as faint minor glyphs (· + ×)", () => {
        const { p, canvas } = painter([copy]);
        p.draw({ ...frame(0), pointer });
        const minor = [...canvas.picture].filter(([k, v]) => insideCopy(k) && isMinor(v.atlas));
        expect(minor.length).toBeGreaterThan(10);
        for (const [, v] of minor) {
            expect(v.sx / SIZE).toBeLessThanOrEqual(2);
            // at most 40% opaque
            expect(v.sy / SIZE).toBeLessThanOrEqual(0.4 * 16);
        }
    });

    it("leaves the copy clear without it", () => {
        const { p, canvas } = painter([copy]);
        p.draw(frame(0));
        expect([...canvas.picture].filter(([k, v]) => insideCopy(k) && isMinor(v.atlas))).toEqual(
            [],
        );
    });
});
