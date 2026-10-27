import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
}

/** Labelled 40px input with a crisp 1px outline and a 2px focus outline. */
export function TextField({ label, hint, error, className, id, ...rest }: TextFieldProps) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const describedBy = error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined;

    return (
        <div className={cx("bc-field", className)}>
            <label className="bc-field-label" htmlFor={fieldId}>
                {label}
            </label>
            <input
                className="bc-input"
                id={fieldId}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={describedBy}
                {...rest}
            />
            {error ? (
                <p className="bc-field-error" id={`${fieldId}-err`}>
                    {error}
                </p>
            ) : hint ? (
                <p className="bc-field-hint" id={`${fieldId}-hint`}>
                    {hint}
                </p>
            ) : null}
        </div>
    );
}
