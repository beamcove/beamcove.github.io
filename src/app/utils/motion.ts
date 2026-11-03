import { useLayoutEffect } from "react";

/** Set by index.html when IntersectionObserver exists and motion isn't reduced. */
export function motionAllowed() {
    return document.documentElement.classList.contains("motion");
}

/**
 * Adds `is-in` to every `[data-reveal]` element as its top scrolls into view
 * (threshold 0, so even very tall blocks reveal). Whatever is already on
 * screen when the page opens shows straight away, before the first paint: it
 * would only hold back the page's first look.
 * Hidden states only apply under `html.motion`, so content never stays hidden
 * where this can't run.
 */
export function useReveal() {
    useLayoutEffect(() => {
        if (!motionAllowed()) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0 },
        );
        const fold = window.innerHeight * 0.88;
        const now: HTMLElement[] = [];
        document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
            if (el.getBoundingClientRect().top < fold) now.push(el);
            else io.observe(el);
        });
        // shown as is, without the fade (measuring above already gave them their hidden style)
        for (const el of now) {
            el.style.transition = "none";
            el.classList.add("is-in");
        }
        if (now.length) {
            void document.body.offsetHeight;
            for (const el of now) el.style.transition = "";
        }
        return () => io.disconnect();
    }, []);
}
