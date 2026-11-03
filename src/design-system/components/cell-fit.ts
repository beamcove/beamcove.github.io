import { useLayoutEffect, type RefObject } from "react";

/**
 * Grows a surface to the next whole cell (16px by default) so its glyph grid
 * ends exactly, with no half row at the bottom.
 */
export function useCellFit(
    ref: RefObject<HTMLElement | null>,
    innerRef: RefObject<HTMLElement | null>,
    enabled = true,
) {
    useLayoutEffect(() => {
        const el = ref.current;
        const inner = innerRef.current;
        if (!el || !inner || !enabled || typeof ResizeObserver === "undefined") return;

        const fit = () => {
            if (el.style.height) return;
            el.style.minHeight = "";
            const cell = parseFloat(getComputedStyle(el).getPropertyValue("--cell")) || 16;
            const height = el.getBoundingClientRect().height;
            el.style.minHeight = `${Math.ceil((height - 0.01) / cell) * cell}px`;
        };

        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(inner);
        window.addEventListener("resize", fit);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", fit);
        };
    }, [ref, innerRef, enabled]);
}
