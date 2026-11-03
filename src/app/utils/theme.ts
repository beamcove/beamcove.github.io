import type { InkSlot } from "@/design-system";

export const THEMES = [
    { id: "paper", label: "Paper", note: "A printout: four inks and black on paper." },
    { id: "platinum", label: "Platinum", note: "Desktop grey with quiet inks." },
    { id: "graphite", label: "Graphite", note: "Charcoal with brass, slate and clay." },
    { id: "phosphor", label: "Phosphor", note: "A soft green monitor." },
    { id: "midnight", label: "Midnight", note: "Ink-blue night, periwinkle and cyan." },
] as const;

export type Theme = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: Theme = "paper";
export const THEME_STORAGE_KEY = "bc-theme";
export const SWATCH_SLOTS: InkSlot[] = ["a", "b", "c", "d", "e"];

/** Saved choices from older theme sets, mapped to their nearest theme today. */
const LEGACY: Record<string, Theme> = {
    light: "paper",
    dark: "graphite",
    signal: "graphite",
    amber: "graphite",
    ultraviolet: "midnight",
};

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
