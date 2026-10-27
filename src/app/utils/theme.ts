export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "bc-theme";

/** The theme index.html's boot script put on <html> before first paint. */
export function readTheme(): Theme {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // storage blocked (private mode etc.): the choice just won't stick
    }
}
