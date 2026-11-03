// Runs before first paint on every page (loaded synchronously from <head>).
// Flags motion, so reveal animations and the glyph stage never hide content
// where they can't run (no IntersectionObserver, or reduced motion).
(function () {
    var root = document.documentElement;
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.classList.add("motion");
    }
})();
