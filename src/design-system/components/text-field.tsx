import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
}

/** A labelled 40px input behind a > prompt, with a block caret. */
export function TextField({ label, hint, error, className, id, ...rest }: TextFieldProps) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const describedBy = error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined;

    return (
        <div className={cx("bc-field", className)}>
            <label className="bc-field-label" htmlFor={fieldId}>
                {label}
            </label>
            <span className="bc-input-row">
                <input
                    className="bc-input"
                    id={fieldId}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={describedBy}
                    {...rest}
                />
            </span>
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
