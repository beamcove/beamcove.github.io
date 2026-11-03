/**
 * Signal motion is opt-in: it runs only when the page has put `motion` on
 * <html> (after checking prefers-reduced-motion). Without the class, glyph
 * fields draw one still frame and text never scrambles.
 */
export function motionAllowed() {
    return typeof document !== "undefined" && document.documentElement.classList.contains("motion");
}
