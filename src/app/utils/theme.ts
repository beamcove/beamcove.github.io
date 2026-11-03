import type { InkSlot } from "@/design-system";

export const THEMES = [
    { id: "signal", label: "Signal", note: "Five neon inks on a black terminal." },
    { id: "phosphor", label: "Phosphor", note: "A green CRT, with teal and amber." },
    { id: "amber", label: "Amber", note: "A warm amber terminal." },
    { id: "ultraviolet", label: "Ultraviolet", note: "Magenta and cyan on deep indigo." },
    { id: "paper", label: "Paper", note: "A printout: four inks on paper." },
] as const;

export type Theme = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: Theme = "signal";
export const THEME_STORAGE_KEY = "bc-theme";
export const SWATCH_SLOTS: InkSlot[] = ["a", "b", "c", "d", "e"];

/** Saved choices from before the colour themes: dark → signal, light → paper. */
const LEGACY: Record<string, Theme> = { dark: "signal", light: "paper" };

export function toTheme(value: string | null | undefined): Theme {
    if (!value) return DEFAULT_THEME;
    if (value in LEGACY) return LEGACY[value]!;
    return THEMES.some((t) => t.id === value) ? (value as Theme) : DEFAULT_THEME;
}

/** The theme public/boot.js put on <html> before first paint. */
export function readTheme(): Theme {
    return toTheme(document.documentElement.dataset.theme);
}

export function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // storage blocked (private mode etc.): the choice just won't stick
    }
    window.dispatchEvent(new CustomEvent("bc-theme", { detail: theme }));
}
