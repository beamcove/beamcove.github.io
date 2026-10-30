import type { CSSProperties } from "react";

import { ART, type RisoArtName } from "@/app/components/riso-compositions";

/** Prints one riso composition (see riso-compositions.ts for the art and its rules). */
export function RisoArt({ name, className }: { name: RisoArtName; className?: string }) {
    return (
        <div className={["riso-art", className].filter(Boolean).join(" ")} aria-hidden="true">
            {ART[name].map((piece, i) => (
                <span
                    key={i}
                    className={`riso-${piece.shape} riso-ink-${piece.ink}`}
                    style={{ ...piece.style, "--s": i } as CSSProperties}
                />
            ))}
        </div>
    );
}
