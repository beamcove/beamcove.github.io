(function () {
  var storageKey = "beamcove-theme";
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function setThemeColor(theme) {
    if (!themeMeta) {
      return;
    }

    themeMeta.setAttribute("content", theme === "dark" ? "#071922" : "#0f2432");
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (err) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (err) {
      // Ignore write failures in private browsing or restricted environments.
    }
  }

  function applyTheme(theme, persist) {
    var nextTheme = theme === "dark" ? "dark" : "light";

    root.setAttribute("data-theme", nextTheme);
    setThemeColor(nextTheme);

    if (button) {
      var isDark = nextTheme === "dark";
      button.setAttribute("aria-pressed", isDark ? "true" : "false");
      button.textContent = isDark ? "Light mode" : "Dark mode";
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    if (persist) {
      storeTheme(nextTheme);
    }
  }

  function preferredSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  var initialTheme = root.getAttribute("data-theme") || getStoredTheme() || preferredSystemTheme();
  applyTheme(initialTheme, false);

  if (button) {
    button.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark", true);
    });
  }

  if (window.matchMedia) {
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", function () {
      if (!getStoredTheme()) {
        applyTheme(preferredSystemTheme(), false);
      }
    });
  }
})();
