import { useState, type KeyboardEvent, type ReactNode } from "react";

import { cx } from "./cx";

export interface SegmentedOption<T extends string> {
    value: T;
    label: ReactNode;
    icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
    options: (SegmentedOption<T> | T)[];
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    /** The group's accessible name (or pass `aria-label`). */
    label?: string;
    "aria-label"?: string;
    fullWidth?: boolean;
    className?: string;
}

/** One choice from a few, as slash-separated tabs; the chosen one inverts. Arrow keys move. */
export function SegmentedControl<T extends string>({
    options,
    value,
    defaultValue,
    onChange,
    label,
    "aria-label": ariaLabel,
    fullWidth,
    className,
}: SegmentedControlProps<T>) {
    const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
    const [inner, setInner] = useState<T | undefined>(defaultValue ?? opts[0]?.value);
    const current = value ?? inner;
    const pick = (v: T) => {
        if (value === undefined) setInner(v);
        onChange?.(v);
    };
    const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const j = (i + step + opts.length) % opts.length;
        const next = opts[j];
        if (!next) return;
        pick(next.value);
        const group = e.currentTarget.closest(".bc-seg");
        group?.querySelectorAll<HTMLButtonElement>(".bc-seg-item")[j]?.focus();
    };

    return (
        <div
            role="radiogroup"
            aria-label={label ?? ariaLabel}
            className={cx("bc-seg", fullWidth && "bc-seg-full", className)}
        >
            {opts.map((o, i) => {
                const on = o.value === current;
                return (
                    <span key={o.value}>
                        <button
                            type="button"
                            role="radio"
                            aria-checked={on}
                            tabIndex={on ? 0 : -1}
                            className="bc-seg-item"
                            onClick={() => pick(o.value)}
                            onKeyDown={(e) => onKey(e, i)}
                        >
                            {o.icon}
                            {o.label}
                        </button>
                    </span>
                );
            })}
        </div>
    );
}
