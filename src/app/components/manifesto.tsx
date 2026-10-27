import { useRef, type CSSProperties } from "react";

import { useScrollProgress } from "@/app/utils/motion";
import { Splash } from "@/design-system";

const LINE = "Small ships, built with care, made to sail a long way.";

/** The night band: the line inks in word by word as it scrolls into view. */
export function Manifesto() {
    const ref = useRef<HTMLDivElement>(null);
    useScrollProgress(ref);
    const words = LINE.split(" ");

    return (
        <section className="section" aria-label="Our bearing">
            <div className="container" ref={ref}>
                <Splash
                    tone="night"
                    className="manifesto"
                    data-theme="light"
                    eyebrow="Our bearing"
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
                    Beamcove is independent and in no hurry. We’d rather make a few things people
                    love than many they forget.
                </Splash>
            </div>
        </section>
    );
}
