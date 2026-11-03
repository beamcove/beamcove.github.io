import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { motionAllowed } from "../glyph/motion";
import { cx } from "./cx";
import { Still } from "./still";

export interface ScreenProps extends HTMLAttributes<HTMLElement> {
    /** The scene's name: the Stage dissolves to it as this screen arrives. */
    scene: string;
    /** The scene itself, printed still when the Stage isn't running. */
    field: GlyphComposition;
    /**
     * Pin the screen while you scroll past it: `true` for a statement (writes
     * `--p`), or a number of steps (also writes `data-step`, e.g. one per value).
     */
    pin?: boolean | number;
    as?: "section" | "div";
    children?: ReactNode;
}

/**
 * One idea per screen: a full-height section over the glyph Stage. Put
 * `data-quiet` on the copy so the art stays clear of it.
 */
export function Screen({
    scene,
    field,
    pin,
    as: Tag = "section",
    className,
    children,
    ...rest
}: ScreenProps) {
    const [still] = useState(() => !motionAllowed());
    const steps = typeof pin === "number" ? pin : pin ? 0 : undefined;
    return (
        <Tag
            {...rest}
            className={cx(pin !== undefined && pin !== false ? "bc-pin" : "bc-screen", className)}
            data-scene={scene}
            data-progress={steps}
            data-steps={steps ? steps : undefined}
            style={steps ? ({ ...rest.style, "--bc-steps": steps } as CSSProperties) : rest.style}
        >
            {still && <Still composition={field} />}
            {steps !== undefined ? <div className="bc-pin-frame">{children}</div> : children}
        </Tag>
    );
}
