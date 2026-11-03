import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { applyTheme, readTheme, SWATCH_SLOTS, THEMES, type Theme } from "@/app/utils/theme";

/** Keeps every picker on the page in step with the current theme. */
function useTheme(): [Theme, (theme: Theme) => void] {
    const [theme, setTheme] = useState<Theme>(readTheme);
    useEffect(() => {
        const sync = () => setTheme(readTheme());
        window.addEventListener("bc-theme", sync);
        return () => window.removeEventListener("bc-theme", sync);
    }, []);
    return [theme, applyTheme];
}

/** Five ink chips, printed in the given theme. */
export function ThemeSwatch({ theme }: { theme: Theme }) {
    return (
        <span className="theme-swatch" data-theme={theme} aria-hidden="true">
            {SWATCH_SLOTS.map((slot) => (
                <i key={slot} style={{ background: `var(--ink-${slot})` }} />
            ))}
        </span>
    );
}

const labelOf = (theme: Theme) => THEMES.find((t) => t.id === theme)?.label ?? theme;

/** The header's compact picker: a mono button that opens a menu of the colour themes. */
export function ThemePicker() {
    const [theme, setTheme] = useTheme();
    const [open, setOpen] = useState(false);
    const wrap = useRef<HTMLDivElement>(null);
    const menu = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        menu.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
        const onDown = (e: PointerEvent) => {
            if (!wrap.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                wrap.current?.querySelector<HTMLButtonElement>(".theme-trigger")?.focus();
            }
        };
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
        const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const items = [
            ...(menu.current?.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]") ?? []),
        ];
        const at = items.indexOf(document.activeElement as HTMLButtonElement);
        items[(at + step + items.length) % items.length]?.focus();
    };

    return (
        <div className="theme-picker" ref={wrap}>
            <button
                type="button"
                className="theme-trigger"
                aria-label={`Color theme: ${labelOf(theme)}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                <ThemeSwatch theme={theme} />
                <span className="theme-trigger-label" aria-hidden="true">
                    {theme}
                </span>
            </button>
            {open && (
                <div
                    className="theme-menu"
                    role="menu"
                    tabIndex={-1}
                    aria-label="Color theme"
                    ref={menu}
                    onKeyDown={onMenuKey}
                >
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            role="menuitemradio"
                            aria-checked={t.id === theme}
                            className="theme-option"
                            onClick={() => {
                                setTheme(t.id);
                                setOpen(false);
                            }}
                        >
                            <ThemeSwatch theme={t.id} />
                            <span>{t.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/** The Design page's full picker: each theme as a small live specimen. */
export function ThemeGrid() {
    const [theme, setTheme] = useTheme();
    return (
        <div className="theme-grid" role="radiogroup" aria-label="Color theme">
            {THEMES.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={t.id === theme}
                    className="theme-card"
                    data-theme={t.id}
                    onClick={() => setTheme(t.id)}
                >
                    <span className="theme-card-head">
                        <span className="theme-card-name">{t.label}</span>
                        <span className="theme-card-mark" aria-hidden="true">
                            {t.id === theme ? "[■]" : "[ ]"}
                        </span>
                    </span>
                    <span className="theme-card-inks" aria-hidden="true">
                        {SWATCH_SLOTS.map((slot) => (
                            <i key={slot} style={{ background: `var(--ink-${slot})` }} />
                        ))}
                    </span>
                    <span className="theme-card-note">{t.note}</span>
                </button>
            ))}
        </div>
    );
}
