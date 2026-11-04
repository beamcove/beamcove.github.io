// The page side of the field worker: the same shape as a painter, but every call is a
// message, and the canvas's pixels belong to the worker. The page keeps only the
// geometry it needs to lay out (the lattice origin, the number of cells).
import type { GlyphComposition } from "./engine";
import type { FieldMessage } from "./field-worker";
import {
    type FieldFrame,
    type FieldOptions,
    geometry,
    type Geometry,
    type Neighbour,
    type PainterEnv,
    type Rect,
} from "./painter";

let worker: Worker | null = null;
let lost = false;
// fields to tell if the worker goes down, so they come back on the main thread
const onLost = new Set<() => void>();

function post(message: FieldMessage, transfer: Transferable[] = []) {
    if (!worker) {
        worker = new Worker(new URL("./field-worker.ts", import.meta.url), { type: "module" });
        // it failed to load or threw: every field paints on the main thread from now on
        worker.addEventListener("error", () => {
            lost = true;
            worker?.terminate();
            for (const fn of [...onLost]) fn();
        });
    }
    worker.postMessage(message, transfer);
}

/** Can this canvas be painted in the worker? (Not without OffscreenCanvas: Safari before 16.4.) */
export function canPaintOffThread(canvas: HTMLCanvasElement) {
    return (
        !lost &&
        typeof Worker !== "undefined" &&
        typeof OffscreenCanvas !== "undefined" &&
        typeof canvas.transferControlToOffscreen === "function"
    );
}

let nextId = 0;
// canvases already given to the worker: they can never be drawn on, or given, again
const handed = new WeakSet<HTMLCanvasElement>();

/** Was this canvas given to the worker already? Then a field needs a fresh one. */
export const handedOver = (canvas: HTMLCanvasElement) => handed.has(canvas);

/**
 * A painter whose canvas is painted in the field worker. Once handed over, the
 * canvas can't be drawn on here, so `lost` is called if the worker goes down: the
 * field then needs a fresh canvas.
 */
export function remotePainter(
    canvas: HTMLCanvasElement,
    comp: GlyphComposition,
    opts: FieldOptions,
    env: PainterEnv,
    lostFn: () => void,
) {
    const id = ++nextId;
    const offscreen = canvas.transferControlToOffscreen();
    handed.add(canvas);
    post({ type: "add", id, canvas: offscreen, comp, opts, env }, [offscreen]);
    onLost.add(lostFn);
    let g: Geometry = { dpr: 1, ox: 0, oy: 0, cols: 0, rows: 0 };
    return {
        resize(width: number, height: number, offset: { x: number; y: number }, maxDpr = 2) {
            g = geometry(width, height, offset, maxDpr, env.dpr);
            post({ type: "resize", id, width, height, offset, maxDpr });
        },
        layout(quiet: Rect[], prev: Neighbour | null, next: Neighbour | null) {
            post({ type: "layout", id, quiet, prev, next });
        },
        draw(frame: FieldFrame) {
            post({ type: "draw", id, frame });
        },
        invalidate() {
            post({ type: "invalidate", id });
        },
        release() {
            post({ type: "release", id });
        },
        /** The field is gone: drop its canvas in the worker. */
        remove() {
            onLost.delete(lostFn);
            if (!lost) post({ type: "remove", id });
        },
        get cols() {
            return g.cols;
        },
        get rows() {
            return g.rows;
        },
        get origin() {
            return { x: g.ox, y: g.oy };
        },
    };
}
