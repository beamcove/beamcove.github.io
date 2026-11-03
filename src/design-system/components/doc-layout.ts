/**
 * Runs `measure` now, and again (at most once a frame) whenever the page's
 * layout may have moved things: the body or the window resizes. Scroll
 * handlers can then work from cached document positions and `scrollY`, so
 * scrolling never has to read the layout.
 */
export function onLayout(measure: () => void) {
    let frame = 0;
    const run = () => {
        if (!frame)
            frame = requestAnimationFrame(() => {
                frame = 0;
                measure();
            });
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(run) : null;
    ro?.observe(document.body);
    window.addEventListener("resize", run);
    return () => {
        cancelAnimationFrame(frame);
        ro?.disconnect();
        window.removeEventListener("resize", run);
    };
}

/** Where an element's top sits in the document (stable while scrolling). */
export const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
