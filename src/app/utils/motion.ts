import { useEffect, type RefObject } from "react";

/** Set by index.html when IntersectionObserver exists and motion isn't reduced. */
export function motionAllowed() {
    return document.documentElement.classList.contains("motion");
}

/**
 * Adds `is-in` to every `[data-reveal]` element as it scrolls into view.
 * Hidden states only apply under `html.motion`, so content never stays hidden
 * where this can't run.
 */
export function useReveal() {
    useEffect(() => {
        if (!motionAllowed()) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
        );
        document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
}

/**
 * Writes `--p` (0 → 1) on the element as it travels from the bottom of the
 * viewport to the middle. Stays at 1 when motion is off.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!motionAllowed()) {
            el.style.setProperty("--p", "1");
            return;
        }
        let frame = 0;
        const update = () => {
            frame = 0;
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const p = (vh - r.top) / ((vh + r.height) / 2);
            el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [ref]);
}
