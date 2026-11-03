// Runs before first paint on every page (loaded synchronously from <head>).
// Restores the visitor's colour theme (Paper unless they picked another; older
// saved choices map to their nearest theme), and flags motion so reveal
// animations never hide content where they can't run.
(function () {
    var root = document.documentElement;
    var themes = ["paper", "platinum", "graphite", "phosphor", "midnight"];
    var legacy = {
        light: "paper",
        dark: "graphite",
        signal: "graphite",
        amber: "graphite",
        ultraviolet: "midnight",
    };
    var theme = "paper";
    try {
        var saved = localStorage.getItem("bc-theme");
        if (saved && legacy[saved]) saved = legacy[saved];
        if (saved && themes.indexOf(saved) >= 0) theme = saved;
    } catch (e) {}
    // a lab page can pin its own theme (data-force-theme on <html>)
    var forced = root.getAttribute("data-force-theme");
    if (forced && themes.indexOf(forced) >= 0) theme = forced;
    root.dataset.theme = theme;
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.classList.add("motion");
    }
})();
