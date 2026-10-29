import { useRef, type CSSProperties } from "react";

import { useScrollProgress } from "@/app/utils/motion";
import { VISION } from "@/content/values";
import { Splash, type SplashTone } from "@/design-system";

/**
 * The vision band: a paper splash whose line inks in word by word as it scrolls
 * into view. Pick a tone that differs from the page's header splash.
 */
export function Manifesto({ tone = "flare" }: { tone?: Exclude<SplashTone, "night"> }) {
    const ref = useRef<HTMLDivElement>(null);
    useScrollProgress(ref);
    const words = VISION.split(" ");

    return (
        <section className="section" aria-label="Our vision">
            <div className="container" ref={ref}>
                <Splash
                    tone={tone}
                    className="manifesto"
                    data-theme="light"
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
