import type { CSSProperties } from "react";

import { ART } from "@/app/components/glyph-compositions";
import { KINDS } from "@/content/fleet";
import { Card, GlyphField } from "@/design-system";

/** Each kind of venture as a card topped by its own two-ink glyph strip. */
export function KindGrid() {
    return (
        <ul className="kind-grid">
            {KINDS.map((kind, i) => (
                <li key={kind.title} data-reveal style={{ "--d": i } as CSSProperties}>
                    <Card
                        variant="art"
                        className="kind-card"
                        media={<GlyphField composition={ART[kind.art]} quiet={false} />}
                        eyebrow={`0${i + 1}`}
                        title={kind.title}
                    >
                        {kind.body}
                    </Card>
                </li>
            ))}
        </ul>
    );
}
