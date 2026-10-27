import { useLayoutEffect, type RefObject } from "react";

/**
 * Fitted dot grid: grows the surface to the next dot-pitch step so the grid
 * ends exactly, and nudges the dot layer onto whole device pixels.
 */
export function useDotFit(
    ref: RefObject<HTMLElement | null>,
    innerRef: RefObject<HTMLElement | null> | null,
    enabled: boolean,
) {
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || !enabled || typeof ResizeObserver === "undefined") return;
        const inner = innerRef?.current ?? null;

        const fit = () => {
            const cs = getComputedStyle(el);
            const pitch = parseFloat(cs.getPropertyValue("--dot-pitch")) || 16;
            if (inner && !el.style.height) {
                const need =
                    inner.getBoundingClientRect().height +
                    parseFloat(cs.paddingTop) +
                    parseFloat(cs.paddingBottom);
                const snapped = Math.ceil((need - 0.01) / pitch) * pitch;
                if (el.style.minHeight !== `${snapped}px`) el.style.minHeight = `${snapped}px`;
            }
            const r = el.getBoundingClientRect();
            const d = window.devicePixelRatio || 1;
            el.style.setProperty("--dot-dx", `${(Math.round(r.left * d) - r.left * d) / d}px`);
            el.style.setProperty("--dot-dy", `${(Math.round(r.top * d) - r.top * d) / d}px`);
        };

        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        if (inner) ro.observe(inner);
        window.addEventListener("resize", fit);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", fit);
        };
    }, [ref, innerRef, enabled]);
}
