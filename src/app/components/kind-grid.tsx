import type { CSSProperties } from "react";

import { RisoArt } from "@/app/components/riso-art";
import { KINDS } from "@/content/fleet";
import { Card } from "@/design-system";

/** Each kind of venture as a card topped by its own riso print on dotted paper. */
export function KindGrid() {
    return (
        <ul className="kind-grid">
            {KINDS.map((kind, i) => (
                <li key={kind.title} data-reveal style={{ "--d": i } as CSSProperties}>
                    <Card variant="plain" className="kind-card">
                        <div className="kind-art bc-dots" data-theme="light">
                            <RisoArt name={kind.art} />
                        </div>
                        <h3 className="bc-card-title">{kind.title}</h3>
                        <p className="bc-card-body">{kind.body}</p>
                    </Card>
                </li>
            ))}
        </ul>
    );
}
