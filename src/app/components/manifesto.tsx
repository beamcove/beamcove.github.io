import { useRef, type CSSProperties } from "react";

import { useScrollProgress } from "@/app/utils/motion";
import { MISSION } from "@/content/values";
import { Splash } from "@/design-system";

/** The vision, from the company's About page. */
const LINE = "Setting new directions in the digital world.";

/** The night band: the line inks in word by word as it scrolls into view. */
export function Manifesto() {
    const ref = useRef<HTMLDivElement>(null);
    useScrollProgress(ref);
    const words = LINE.split(" ");

    return (
        <section className="section" aria-label="Where we’re headed">
            <div className="container" ref={ref}>
                <Splash
                    tone="night"
                    className="manifesto"
                    data-theme="light"
                    eyebrow="Where we’re headed"
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
                    Our mission: {MISSION}
                </Splash>
            </div>
        </section>
    );
}
