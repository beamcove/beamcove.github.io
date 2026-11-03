import type { CSSProperties } from "react";

import { SYMBOL_PATHS, TRI_STROKE } from "../glyph/symbol-paths";
import { cx } from "./cx";
import { MARK, type ShapeInk, type ShapeName } from "./shape-data";

const inkVar = (ink: ShapeInk) =>
    ink === "beam" || ink === "flare" || ink === "ink" ? `var(--${ink})` : `var(--ink-${ink})`;

/**
 * One symbol's marks in a 16×16 cell at (x, y), for drawing inside your own
 * SVG (the glyph wordmark is built from these). Paints in `currentColor`.
 */
export function ShapeCell({ name, x = 0, y = 0 }: { name: ShapeName; x?: number; y?: number }) {
    const t = `translate(${x} ${y})`;
    switch (name) {
        case "disc":
        case "square":
        case "heart":
            return <path transform={t} d={SYMBOL_PATHS[name]} fill="currentColor" />;
        case "tri":
            return (
                <path
                    transform={t}
                    d={SYMBOL_PATHS.tri}
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={TRI_STROKE}
                    strokeLinejoin="round"
                />
            );
        case "cross":
            return (
                <path
                    transform={t}
                    d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                />
            );
        case "plus":
            return (
                <path
                    transform={t}
                    d="M8 3.2V12.8M3.2 8H12.8"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                />
            );
        case "dash":
            return (
                <path
                    transform={t}
                    d="M3.5 8H12.5"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                />
            );
    }
}

interface CommonProps {
    /** Side of one cell, in px (16 by default; use multiples of 16 on the page grid). */
    size?: number;
    /** Read out as an image with this name; without it the shape is decoration. */
    label?: string;
    className?: string;
}

const a11y = (label?: string) =>
    label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };

export interface ShapeProps extends CommonProps {
    name: ShapeName;
    ink?: ShapeInk;
}

/** One symbol: ● ▲ ■ ✕ + or a dash, bold and round, in `currentColor` or an ink. */
export function Shape({ name, ink, size = 16, label, className }: ShapeProps) {
    const style: CSSProperties | undefined = ink ? { color: inkVar(ink) } : undefined;
    return (
        <svg
            className={cx("bc-shape", className)}
            viewBox="0 0 16 16"
            width={size}
            height={size}
            style={style}
            focusable="false"
            {...a11y(label)}
        >
            <ShapeCell name={name} />
        </svg>
    );
}

/** The Beamcove mark: ● ▲ ■ on three cells, each in its own ink. `mono` draws it in one colour. */
export function Mark({ size = 16, label, mono, className }: CommonProps & { mono?: boolean }) {
    return (
        <svg
            className={cx("bc-mark", className)}
            viewBox="0 0 48 16"
            width={size * 3}
            height={size}
            focusable="false"
            {...a11y(label)}
        >
            {MARK.map((m, i) => (
                <g key={m.name} style={mono ? undefined : { color: inkVar(m.ink) }}>
                    <ShapeCell name={m.name} x={i * 16} />
                </g>
            ))}
        </svg>
    );
}

export type FaceEyes = "disc" | "cross" | "plus" | "square" | "tri";

export interface FaceProps extends CommonProps {
    /** ● ● calm, ✕ ✕ lost or broken, + + curious, ■ ■ focused, ▲ ▲ bright. */
    eyes?: FaceEyes;
    /** Wink: the right eye becomes a dash. */
    wink?: boolean;
    ink?: ShapeInk;
}

/**
 * A face from the symbol set on a 3×3 cell grid: two eyes over a dash. For
 * empty states, errors and the odd friendly moment; never a logo.
 */
export function Face({ eyes = "disc", wink, ink, size = 16, label, className }: FaceProps) {
    const style: CSSProperties | undefined = ink ? { color: inkVar(ink) } : undefined;
    return (
        <svg
            className={cx("bc-face", className)}
            viewBox="0 0 48 48"
            width={size * 3}
            height={size * 3}
            style={style}
            focusable="false"
            {...a11y(label)}
        >
            <ShapeCell name={eyes} x={0} y={0} />
            <ShapeCell name={wink ? "dash" : eyes} x={32} y={0} />
            <path d="M15 40H33" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
        </svg>
    );
}
