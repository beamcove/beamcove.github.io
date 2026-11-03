import { useRef, type CSSProperties } from "react";

import { ART } from "@/app/components/glyph-compositions";
import { useScrollProgress } from "@/app/utils/motion";
import { VISION } from "@/content/values";
import { Splash } from "@/design-system";

/** The vision band: a glyph splash whose line lights up word by word as it scrolls into view. */
export function Manifesto() {
    const ref = useRef<HTMLDivElement>(null);
    useScrollProgress(ref);
    const words = VISION.split(" ");

    return (
        <section className="section" aria-label="Our vision">
            <div className="container" ref={ref}>
                <Splash
                    field={ART.vision}
                    className="manifesto"
                    eyebrow="Our vision"
                    title={
                        <span
                            className="manifesto-line"
                            style={{ "--n": words.length } as CSSProperties}
                        >
                            {words.map((word, i) => (
                                <span key={i} style={{ "--i": i } as CSSProperties}>
                                    {word}{" "}
                                </span>
                            ))}
                        </span>
                    }
                >
                    That’s the whole plan. The rest is details, and we like details.
                </Splash>
            </div>
        </section>
    );
}
