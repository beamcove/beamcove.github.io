import { useRef, type CSSProperties } from "react";

import { useScrollProgress } from "@/app/utils/motion";
import { MISSION } from "@/content/values";
import { Splash, type SplashTone } from "@/design-system";

/** The vision, from the company's About page. */
const LINE = "Setting new directions in the digital world.";

/**
 * The vision band: a paper splash whose line inks in word by word as it scrolls
 * into view. Pick a tone that differs from the page's header splash.
 */
export function Manifesto({ tone = "flare" }: { tone?: Exclude<SplashTone, "night"> }) {
    const ref = useRef<HTMLDivElement>(null);
    useScrollProgress(ref);
    const words = LINE.split(" ");

    return (
        <section className="section" aria-label="Where we’re headed">
            <div className="container" ref={ref}>
                <Splash
                    tone={tone}
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
