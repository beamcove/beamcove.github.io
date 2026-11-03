import type { GlyphComposition } from "../glyph/engine";
import { Field } from "./field";

export interface GlyphFieldProps {
    composition: GlyphComposition;
    /** The lighthouse: a beam sweeps across now and then. */
    beam?: boolean;
    /** Glyphs light up under the pointer; default true. */
    pointer?: boolean;
    /** Keep glyphs and ink blocks clear of `[data-quiet]` copy inside the parent; default true. */
    quiet?: boolean;
    className?: string;
}

/**
 * A glyph field inside a box on an opaque surface (a card strip, a
 * specimen): it draws its own resting dots, on the page lattice, so they
 * line up with the page's dots around it. Its parent must be positioned
 * (`.bc-glyphs`).
 */
export function GlyphField({ composition, beam, pointer, quiet, className }: GlyphFieldProps) {
    return (
        <Field
            composition={composition}
            beam={beam}
            pointer={pointer}
            quiet={quiet}
            dots
            className={className}
        />
    );
}
