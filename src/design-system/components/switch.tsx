import { useState, type ChangeEvent, type ReactNode } from "react";

import { cx } from "./cx";

export interface SwitchProps {
    label?: ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    name?: string;
    onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

/** An on/off setting: a hatched track and a square thumb that steps across. */
export function Switch({
    label,
    checked,
    defaultChecked = false,
    disabled,
    name,
    onChange,
    className,
}: SwitchProps) {
    const [inner, setInner] = useState(defaultChecked);
    const on = checked ?? inner;
    return (
        <label className={cx("bc-switch", className)}>
            <input
                type="checkbox"
                role="switch"
                checked={on}
                disabled={disabled}
                name={name}
                onChange={(e) => {
                    if (checked === undefined) setInner(e.target.checked);
                    onChange?.(e.target.checked, e);
                }}
            />
            <span className="bc-switch-track" aria-hidden="true">
                <span className="bc-switch-thumb" />
            </span>
            {label && <span>{label}</span>}
        </label>
    );
}
