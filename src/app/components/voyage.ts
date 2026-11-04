import { createContext } from "react";

import type { SceneName } from "@/app/components/scenes";
import type { Story, StoryMoment } from "@/design-system";
import { onLayout } from "@/design-system/components/doc-layout";
import { restingRect } from "@/design-system/glyph/lattice";

/**
 * The home page's scroll is a passage at night, from open sea to the cove:
 * a lighthouse at the header mark turns its beam as you scroll, the light
 * leaves sparks that become the mark, the water swells, buoys blink, the
 * first screen has a sky, and at the newsletter the beam settles: landfall.
 * None of it is drawn as a picture; the glyphs only behave that way.
 *
 * Each part (a motif) can be switched off (`?lab` on the home page).
 */
export const MOTIFS = [
    "lighthouse",
    "clockwork",
    "rhythm",
    "sparks",
    "swell",
    "buoys",
    "sky",
    "landfall",
] as const;
export type Motif = (typeof MOTIFS)[number];

export const MOTIF_INFO: Record<Motif, { name: string; hint: string }> = {
    lighthouse: { name: "Lighthouse", hint: "A beam from the header mark, sweeping the page" },
    clockwork: {
        name: "Turns on its own",
        hint: "The beam sweeps at a steady pace, whatever you do; off, scrolling turns it",
    },
    rhythm: {
        name: "Light rhythm",
        hint: "When you stop, the beam flashes three times, then rests (scroll-turned beam only)",
    },
    sparks: { name: "Sparks", hint: "The beam leaves an afterglow; some glyphs become the mark" },
    swell: { name: "Sea swell", hint: "Slow waves through the glyphs low on the screen" },
    buoys: { name: "Buoys", hint: "A few ● and ▲ in open water, blinking on their own beat" },
    sky: { name: "Night sky", hint: "The first screen thins and twinkles above a horizon" },
    landfall: { name: "Landfall", hint: "At the newsletter the beam settles and the sea calms" },
};

/** Which motifs are on. The lab panel changes it; every field reads it each frame. */
export const MOTIFS_ON: Record<Motif, boolean> = Object.fromEntries(
    MOTIFS.map((m) => [m, true]),
) as Record<Motif, boolean>;

/** Where things are, measured on layout (never while scrolling). */
export interface VoyageLayout {
    /** The lighthouse: just off the screen's left edge, at the header mark's height. */
    origin: { x: number; y: number };
    /** The newsletter section's top, and its form's centre, in document px. */
    landfall: { top: number; x: number; y: number } | null;
}

// The beam turns one way, like a real lighthouse: at a steady speed it comes in just
// above the horizon (still under the header), sweeps down the screen and out past its
// left edge, then is dark for a moment while it comes round behind the light. (A beam
// that swung back up while the page moves up would ride along with the glyphs instead
// of sweeping across them; turning one way, it always crosses them, whichever way you scroll.)
const ENTER = -0.08;
const SPREAD = 0.06;
// turning on its own: 0.3 rad a second while in sight, then 1.5 s round the back
const CLOCK_RATE = 0.3 / 1000;
const CLOCK_DARK_MS = 1500;
const CLOCKWORK_AMT = 0.65;
// turned by scrolling: 1.15 rad per screen while in sight, then a quarter screen round the back
const SCROLL_RATE = 1.15;
const SCROLL_DARK = 0.25;
// the light's character: three flashes (one per mark), every nine seconds
const RHYTHM_MS = 9000;
const FLASHES = [0, 700, 1400];
const FLASH_MS = 380;
// the beam rests this long after the last scroll before the rhythm starts
const REST_MS = 1200;
const AFTERGLOW_MS = 1400;
// the swell lives below this line on screen; the sky above this share of the first screen
const SEA_LINE = 0.62;
const SKY_LINE = 0.36;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Where the beam leaves the screen: the direction past which its whole cone is
 * beyond the left edge, for a light at `origin` on a screen `vh` tall.
 */
export function exitAt(origin: { x: number; y: number }, vh: number) {
    return (
        Math.PI / 2 + Math.atan2(Math.max(0, origin.x), Math.max(1, vh - origin.y)) + SPREAD + 0.04
    );
}

/**
 * The beam's direction (radians, y down) at `t`: in sight it turns at a steady
 * `rate` from ENTER to `exit`, then is out of sight for `dark` while it comes
 * round behind the light. `t`, `rate` and `dark` share a unit: screens of scroll,
 * or ms.
 */
export function turnAt(t: number, rate: number, dark: number, exit: number) {
    const arc = exit - ENTER;
    const sweep = arc / rate;
    const period = sweep + dark;
    const p = ((t % period) + period) % period;
    if (p < sweep) return ENTER + rate * p;
    return exit + (2 * Math.PI - arc) * ((p - sweep) / dark);
}

/** `from` turned `t` of the way to `to`, the short way round. */
function turnToward(from: number, to: number, t: number) {
    const d = ((((to - from) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
    return from + d * t;
}

/** The light's character at `ms` into its rhythm: 0 dark, 1 at a flash's peak. */
export function flashAt(ms: number) {
    const t = ((ms % RHYTHM_MS) + RHYTHM_MS) % RHYTHM_MS;
    for (const f of FLASHES) {
        const d = t - f;
        if (d >= 0 && d < FLASH_MS) return Math.sin((Math.PI * d) / FLASH_MS);
    }
    return 0;
}

/** How far into the cove, 0–1: from the newsletter's top passing 90% of the screen to 20%. */
export function landfallAt(scrollY: number, vh: number, top: number) {
    return smooth(clamp01((scrollY + vh * 0.9 - top) / (vh * 0.7)));
}

/**
 * The story at one moment, for one scene. `lastScroll` is when the page last
 * moved (same clock as `time`).
 */
export function voyageAt(
    now: StoryMoment & { lastScroll: number },
    layout: VoyageLayout,
    on: Record<Motif, boolean>,
    scene: SceneName,
): Story | null {
    const { scrollY, vh, vw, time } = now;
    const still = time - now.lastScroll;
    const land = on.landfall && layout.landfall ? landfallAt(scrollY, vh, layout.landfall.top) : 0;
    const story: Story = {};

    if (on.lighthouse) {
        const { origin } = layout;
        const clockwork = on.clockwork;
        const exit = exitAt(origin, vh);
        let dir = clockwork
            ? turnAt(time, CLOCK_RATE, CLOCK_DARK_MS, exit)
            : turnAt(scrollY / vh, SCROLL_RATE, SCROLL_DARK, exit);
        if (land > 0 && layout.landfall) {
            const target = Math.atan2(
                layout.landfall.y - scrollY - origin.y,
                layout.landfall.x - origin.x,
            );
            dir = turnToward(dir, target, land);
        }
        // turning on its own, it shines steadily; turned by scrolling, it's bright while
        // you scroll, then dims, and with the rhythm, flashes
        const active = Math.exp(-Math.max(0, still) / 600);
        let amt = clockwork ? CLOCKWORK_AMT : 0.3 + 0.5 * active;
        let flashing = false;
        if (!clockwork && on.rhythm && still > REST_MS) {
            const into = still - REST_MS;
            const fade = smooth(clamp01(into / 600));
            const flash = flashAt(into);
            amt = lerp(amt, 0.12 + 0.78 * flash, fade * (1 - land));
            flashing = into % RHYTHM_MS < FLASHES[FLASHES.length - 1]! + FLASH_MS + 100;
        }
        amt = lerp(amt, 0.6, land);
        story.light = {
            x: origin.x,
            y: origin.y,
            dir,
            spread: SPREAD * (1 - 0.3 * land),
            reach: Math.hypot(vw, vh),
            amt,
        };
        // frames keep coming while it turns or flashes (at the cove it holds still)
        story.moving = (clockwork || flashing) && land < 1;
        if (on.sparks) {
            story.afterglow = AFTERGLOW_MS;
            story.marks = true;
        }
    }
    if (on.swell && land < 1) story.swell = { amt: 1 - land, horizon: vh * SEA_LINE };
    if (on.buoys) story.beacons = 1;
    if (on.sky && scene === "hero") story.sky = { amt: 1, horizon: SKY_LINE };
    return story;
}

/**
 * The home page's voyage: measures where the lighthouse and the cove are on
 * layout, keeps when the page last scrolled, and hands each scene a story
 * (the same function every time, so fields don't restart).
 */
export function createVoyage() {
    const layout: VoyageLayout = { origin: { x: 0, y: 0 }, landfall: null };
    let lastY = NaN;
    let lastScroll = 0;
    let stop: (() => void) | null = null;

    const measure = () => {
        const mark = document.querySelector(".site-header .bc-mark");
        if (mark) {
            const r = mark.getBoundingClientRect();
            // just off the left edge, at the mark's height: the beam reads as coming from
            // the mark, and leaves the screen whole as it turns past straight down (from the
            // mark itself it would linger in the strip between the mark and the edge)
            layout.origin = { x: -8, y: r.top + r.height / 2 };
        }
        const section = document.querySelector("section#newsletter");
        const form = section?.querySelector(".dispatch-form, .dispatch-done") ?? section;
        if (section && form) {
            const s = restingRect(section);
            const f = restingRect(form);
            layout.landfall = {
                top: s.top + window.scrollY,
                x: f.left + f.width / 2,
                y: f.top + window.scrollY + f.height / 2,
            };
        }
    };

    const stories = new Map<SceneName, (now: StoryMoment) => Story | null>();
    return {
        layout,
        story(scene: SceneName) {
            let fn = stories.get(scene);
            if (!fn) {
                fn = (now) => {
                    stop ??= onLayout(measure);
                    if (now.scrollY !== lastY) {
                        lastY = now.scrollY;
                        lastScroll = now.time;
                    }
                    return voyageAt({ ...now, lastScroll }, layout, MOTIFS_ON, scene);
                };
                stories.set(scene, fn);
            }
            return fn;
        },
        dispose() {
            stop?.();
            stop = null;
        },
    };
}

export type VoyageApi = ReturnType<typeof createVoyage>;

/** The voyage, on the home page only. */
export const Voyage = createContext<VoyageApi | null>(null);
