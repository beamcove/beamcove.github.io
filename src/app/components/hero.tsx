import { ArrowDown } from "lucide";

import { Icon } from "@/app/components/icon";
import { Scene } from "@/app/components/scene";
import { SITE } from "@/content/site";
import { Button, ScrambleText } from "@/design-system";

/** The home page's first screen: the tagline, alone, with the beam sweeping. */
export function Hero() {
    return (
        <Scene name="hero" beam className="hero" id="top" aria-labelledby="hero-title">
            <div className="hero-copy">
                <p className="hero-eyebrow" data-quiet>
                    Beamcove is a technology company
                </p>
                <h1 className="display hero-title" id="hero-title">
                    <span data-quiet>
                        <ScrambleText text={SITE.tagline} trigger="mount" duration={1400} />
                    </span>
                </h1>
                <p className="hero-lead">
                    <span data-quiet>
                        We take the craft seriously and still have fun doing it. What we’re building
                        is almost ready to meet you.
                    </span>
                </p>
                <div className="hero-actions" data-quiet>
                    <Button size="lg" href="#what-we-do" iconRight={<Icon node={ArrowDown} />}>
                        See what we do
                    </Button>
                    <Button size="lg" variant="secondary" href="#newsletter">
                        Get the newsletter
                    </Button>
                </div>
            </div>
            <p className="hero-cue" aria-hidden="true" data-quiet>
                Scroll
            </p>
        </Scene>
    );
}
