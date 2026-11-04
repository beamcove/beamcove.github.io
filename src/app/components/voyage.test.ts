import {
    flashAt,
    landfallAt,
    MOTIFS,
    type Motif,
    exitAt,
    turnAt,
    voyageAt,
    type VoyageLayout,
} from "@/app/components/voyage";

const VH = 900;
const ALL = Object.fromEntries(MOTIFS.map((m) => [m, true])) as Record<Motif, boolean>;
const LAYOUT: VoyageLayout = {
    origin: { x: -8, y: 32 },
    landfall: { top: 8000, x: 400, y: 8500 },
};
// the beam turned by scrolling (the clockwork switch off), and turning on its own
const BY_SCROLL = { ...ALL, clockwork: false };
const at = (scrollY: number, time = 1000, lastScroll = time, on = BY_SCROLL) =>
    voyageAt({ scrollY, vh: VH, vw: 1440, time, lastScroll }, LAYOUT, on, "work");

describe("the beam's turn", () => {
    const TAU = 2 * Math.PI;
    /** How far it turned from `a` to `b`, forwards, in (−π, π]. */
    const turned = (a: number, b: number) => ((((b - a) % TAU) + TAU + Math.PI) % TAU) - Math.PI;
    const EXIT = exitAt(LAYOUT.origin, VH);
    // turning on its own: 0.3 rad/s in sight, 1.5 s dark
    const RATE = 0.3 / 1000;
    const DARK = 1500;
    const SWEEP = (EXIT + 0.08) / RATE;
    const clock = (t: number) => turnAt(t, RATE, DARK, EXIT);
    /** Is any of the cone on screen? (in sight between entering and leaving) */
    const inSight = (dir: number) => {
        const d = ((dir % TAU) + TAU) % TAU;
        return d <= EXIT || d >= TAU - 0.08;
    };

    it("turns one way at a steady speed while in sight", () => {
        for (let t = 0; t < SWEEP - 20; t += 20)
            expect(turned(clock(t), clock(t + 20))).toBeCloseTo(RATE * 20, 9);
    });

    it("leaves the screen whole before it goes dark", () => {
        // at the exit, the cone's near edge (half a cell wide at the light, widening with
        // distance) stays left of the screen all the way down
        const { x, y } = LAYOUT.origin;
        for (let along = 0; along < 2000; along += 25) {
            const half = along * Math.tan(0.06) + 8;
            const edgeX = x + along * Math.cos(EXIT) + half * Math.sin(EXIT);
            const edgeY = y + along * Math.sin(EXIT);
            if (edgeY > 64 && edgeY < VH) expect(edgeX).toBeLessThan(0);
        }
    });

    it("is out of sight for the dark pause, then comes in again just above the horizon", () => {
        for (let t = SWEEP + 10; t < SWEEP + DARK - 10; t += 50)
            expect(inSight(clock(t))).toBe(false);
        expect(clock(SWEEP + DARK)).toBeCloseTo(-0.08, 9);
    });

    it("sweeps across the page's glyphs as fast scrolling up as down", () => {
        const scrolled = (y: number) => turnAt(y / VH, 1.15, 0.25, EXIT);
        // a glyph under the beam, 600px from the light: scrolling moves it up or down the screen
        const across = (y: number, ds: number) => {
            const dir = scrolled(y);
            const gx = 600 * Math.cos(dir);
            const gy = 600 * Math.sin(dir) - ds;
            return Math.abs(turned(Math.atan2(gy, gx), scrolled(y + ds)));
        };
        for (const at of [0.25, 0.5, 0.75]) {
            const down = across(VH * at, 1);
            const up = across(VH * at, -1);
            expect(down).toBeGreaterThan(0.0015);
            expect(up).toBeGreaterThan(0.0015);
            expect(Math.max(down, up) / Math.min(down, up)).toBeLessThan(1.2);
        }
    });
});

describe("the beam turning on its own", () => {
    const clock = (scrollY: number, time: number) => at(scrollY, time, 0, ALL)!;

    it("turns with time, whatever the scroll", () => {
        expect(clock(0, 1000).light!.dir).toBeCloseTo(clock(3000, 1000).light!.dir, 9);
        expect(clock(0, 1000).light!.dir).not.toBeCloseTo(clock(0, 2000).light!.dir, 3);
        // one turn: in sight for the sweep, then dark for 1.5 s, and back where it was
        const period = (exitAt(LAYOUT.origin, VH) + 0.08) / (0.3 / 1000) + 1500;
        expect(clock(0, 1000).light!.dir).toBeCloseTo(clock(0, 1000 + period).light!.dir, 6);
    });

    it("shines steadily and keeps frames coming until the cove", () => {
        const a = clock(1000, 1000);
        const b = clock(1000, 60000);
        expect(a.light!.amt).toBe(b.light!.amt);
        expect(a.moving).toBe(true);
        expect(clock(8000, 1000).moving).toBe(false);
    });
});

describe("the light's rhythm", () => {
    it("flashes three times, then is dark for the rest of the cycle", () => {
        let peaks = 0;
        let prev = 0;
        for (let t = 0; t < 9000; t += 10) {
            const v = flashAt(t);
            if (prev === 0 && v > 0) peaks++;
            prev = v;
        }
        expect(peaks).toBe(3);
        expect(flashAt(5000)).toBe(0);
        expect(flashAt(190)).toBeGreaterThan(0.9);
    });

    it("dims the beam when you stop, and keeps frames coming only while it flashes", () => {
        const scrolling = at(1000);
        const resting = at(1000, 20000 + 1200 + 5000, 20000);
        const flashing = at(1000, 20000 + 1200 + 600 + 190, 20000);
        expect(resting!.light!.amt).toBeLessThan(scrolling!.light!.amt);
        expect(flashing!.light!.amt).toBeGreaterThan(resting!.light!.amt);
        expect(flashing!.moving).toBe(true);
        expect(resting!.moving).toBe(false);
    });
});

describe("landfall", () => {
    it("runs from 0 before the newsletter to 1 once it is in view", () => {
        expect(landfallAt(0, VH, 8000)).toBe(0);
        expect(landfallAt(8000, VH, 8000)).toBe(1);
        const mid = landfallAt(8000 - VH * 0.55, VH, 8000);
        expect(mid).toBeGreaterThan(0);
        expect(mid).toBeLessThan(1);
    });

    it("turns the beam onto the form and calms the sea", () => {
        const y = 8000 - VH * 0.2;
        const s = at(y);
        const target = Math.atan2(8500 - y - 32, 400 + 8);
        expect(Math.cos(s!.light!.dir)).toBeCloseTo(Math.cos(target), 6);
        expect(Math.sin(s!.light!.dir)).toBeCloseTo(Math.sin(target), 6);
        expect(s!.swell).toBeUndefined();
    });
});

describe("the motifs", () => {
    it("can each be switched off", () => {
        const none = Object.fromEntries(MOTIFS.map((m) => [m, false])) as Record<Motif, boolean>;
        const s = voyageAt(
            { scrollY: 0, vh: VH, vw: 1440, time: 0, lastScroll: 0 },
            LAYOUT,
            none,
            "hero",
        );
        expect(s).toEqual({});
    });

    it("only gives the first screen a sky", () => {
        const hero = voyageAt(
            { scrollY: 0, vh: VH, vw: 1440, time: 0, lastScroll: 0 },
            LAYOUT,
            ALL,
            "hero",
        );
        expect(hero!.sky).toBeDefined();
        expect(at(0)!.sky).toBeUndefined();
    });
});
