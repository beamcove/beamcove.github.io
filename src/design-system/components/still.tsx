import { useEffect, useRef } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { createPainter, quietRects } from "../glyph/painter";

/**
 * One scene printed still, filling its positioned parent, quiet behind the
 * parent's `[data-quiet]` boxes. What each Screen shows when the Stage isn't
 * running (no JS motion, or reduced motion).
 */
export function Still({ composition }: { composition: GlyphComposition }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof ResizeObserver === "undefined") return;
        const painter = createPainter(canvas);
        if (!painter) return;
        const paint = () => {
            painter.resize(host.clientWidth, host.clientHeight, 1.5);
            painter.draw({
                a: composition,
                b: null,
                t: 0,
                quiet: quietRects(host, host.getBoundingClientRect()),
                time: 0,
                animate: false,
                beam: 0,
            });
        };
        const ro = new ResizeObserver(paint);
        ro.observe(host);
        void document.fonts?.ready.then(paint);
        return () => ro.disconnect();
    }, [composition]);

    return <canvas ref={ref} className="bc-still" aria-hidden="true" />;
}
