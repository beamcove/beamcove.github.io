// Runs before first paint on every page (loaded synchronously from <head>).
// Light unless the visitor saved a dark choice, and flag motion so reveal
// animations never hide content where they can't run.
(function () {
    var root = document.documentElement;
    var theme = "light";
    try {
        if (localStorage.getItem("bc-theme") === "dark") theme = "dark";
    } catch (e) {}
    root.dataset.theme = theme;
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.classList.add("motion");
    }
})();
