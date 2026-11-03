// Runs before first paint on every page (loaded synchronously from <head>).
// Restores the visitor's colour theme (Signal unless they picked another; the
// old light/dark choices map to Paper/Signal), and flags motion so reveal
// animations never hide content where they can't run.
(function () {
    var root = document.documentElement;
    var themes = ["signal", "phosphor", "amber", "ultraviolet", "paper"];
    var legacy = { dark: "signal", light: "paper" };
    var theme = "signal";
    try {
        var saved = localStorage.getItem("bc-theme");
        if (saved && legacy[saved]) saved = legacy[saved];
        if (saved && themes.indexOf(saved) >= 0) theme = saved;
    } catch (e) {}
    root.dataset.theme = theme;
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.classList.add("motion");
    }
})();
