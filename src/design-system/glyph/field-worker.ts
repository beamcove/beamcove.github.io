// The field worker: paints every field's canvas off the main thread, so scrolling and
// taps never wait on it. The page measures the layout and says what to draw
// (remote-painter.ts); this side holds the canvases, the scenes and the atlases.
import type { GlyphComposition } from "./engine";
import {
    createPainter,
    type FieldFrame,
    type FieldOptions,
    type Neighbour,
    type PainterEnv,
    type Rect,
} from "./painter";

/** What the page sends, one message per painter call. */
export type FieldMessage =
    | {
          type: "add";
          id: number;
          canvas: OffscreenCanvas;
          comp: GlyphComposition;
          opts: FieldOptions;
          env: PainterEnv;
      }
    | {
          type: "resize";
          id: number;
          width: number;
          height: number;
          offset: { x: number; y: number };
          maxDpr: number;
      }
    | { type: "layout"; id: number; quiet: Rect[]; prev: Neighbour | null; next: Neighbour | null }
    | { type: "draw"; id: number; frame: FieldFrame }
    | { type: "invalidate" | "release" | "remove"; id: number };

type Painter = NonNullable<ReturnType<typeof createPainter>>;
const painters = new Map<number, Painter>();

addEventListener("message", (event: MessageEvent<FieldMessage>) => {
    const m = event.data;
    if (m.type === "add") {
        const painter = createPainter(m.canvas, m.comp, m.opts, m.env);
        if (painter) painters.set(m.id, painter);
        return;
    }
    const painter = painters.get(m.id);
    if (!painter) return;
    switch (m.type) {
        case "resize":
            painter.resize(m.width, m.height, m.offset, m.maxDpr);
            break;
        case "layout":
            painter.layout(m.quiet, m.prev, m.next);
            break;
        case "draw":
            painter.draw(m.frame);
            break;
        case "invalidate":
            painter.invalidate();
            break;
        case "release":
            painter.release();
            break;
        case "remove":
            painter.release();
            painters.delete(m.id);
            break;
    }
});
