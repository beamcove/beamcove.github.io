import type { GlyphComposition } from "@/design-system/glyph/engine";
import type { FieldMessage } from "@/design-system/glyph/field-worker";
import { geometry, type PainterEnv } from "@/design-system/glyph/painter";

/** A stand-in worker that records what the page sends it. */
class FakeWorker {
    static last: FakeWorker | null = null;
    sent: FieldMessage[] = [];
    listeners: (() => void)[] = [];
    terminated = false;
    constructor() {
        FakeWorker.last = this;
    }
    postMessage(message: FieldMessage) {
        this.sent.push(message);
    }
    addEventListener(_: "error", fn: () => void) {
        this.listeners.push(fn);
    }
    terminate() {
        this.terminated = true;
    }
}

const COMP: GlyphComposition = { seed: 1, inks: ["a"], ramp: "grid", density: 0.4 };
const ENV: PainterEnv = { tokens: {}, bg: "transparent", dpr: 3 };
const OPTS = { dots: false, soften: false };

function canvas() {
    const el = document.createElement("canvas");
    Object.assign(el, { transferControlToOffscreen: () => ({ offscreen: true }) });
    return el;
}

// a fresh module each test: whether the worker went down is module state
async function load() {
    vi.resetModules();
    return import("@/design-system/glyph/remote-painter");
}

beforeEach(() => {
    vi.stubGlobal("Worker", FakeWorker);
    vi.stubGlobal("OffscreenCanvas", class {});
});
afterEach(() => vi.unstubAllGlobals());

describe("painting in the worker", () => {
    it("is only used where the canvas can be handed over", async () => {
        const { canPaintOffThread } = await load();
        expect(canPaintOffThread(canvas())).toBe(true);
        expect(canPaintOffThread(document.createElement("canvas"))).toBe(false);
        vi.stubGlobal("OffscreenCanvas", undefined);
        expect(canPaintOffThread(canvas())).toBe(false);
    });

    it("lays out like a painter on the page, and sends each call to the worker", async () => {
        const { remotePainter, handedOver } = await load();
        const el = canvas();
        const p = remotePainter(el, COMP, OPTS, ENV, () => {});
        expect(handedOver(el)).toBe(true);
        p.resize(500, 300, { x: -5, y: -2 }, 1.5);
        const g = geometry(500, 300, { x: -5, y: -2 }, 1.5, ENV.dpr);
        expect([p.cols, p.rows]).toEqual([g.cols, g.rows]);
        expect(p.origin).toEqual({ x: g.ox, y: g.oy });
        p.layout([], { comp: COMP, at: { c: 1, r: 2 } }, null);
        p.draw({ time: 0, animate: true, beam: 0 });
        p.remove();
        expect(FakeWorker.last!.sent.map((m) => m.type)).toEqual([
            "add",
            "resize",
            "layout",
            "draw",
            "remove",
        ]);
    });

    it("falls back to the main thread if the worker goes down", async () => {
        const { remotePainter, canPaintOffThread } = await load();
        const lost = vi.fn();
        remotePainter(canvas(), COMP, OPTS, ENV, lost);
        for (const fn of FakeWorker.last!.listeners) fn();
        expect(lost).toHaveBeenCalledOnce();
        expect(FakeWorker.last!.terminated).toBe(true);
        expect(canPaintOffThread(canvas())).toBe(false);
    });
});
