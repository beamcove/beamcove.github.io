import { ArrowRight } from "lucide";

import { ART } from "@/app/components/glyph-compositions";
import { Icon } from "@/app/components/icon";
import { ROUTES, SITE } from "@/content/site";
import { Button, ScrambleText, Splash } from "@/design-system";

export function Hero() {
    return (
        <div className="container hero-wrap" id="top">
            <Splash
                className="hero"
                field={ART.hero}
                beam
                titleAs="h1"
                eyebrow="Technology company"
                title={<ScrambleText text={SITE.tagline} trigger="mount" duration={1200} />}
                art={
                    <div className="splash-hud" aria-hidden="true">
                        <span>beamcove.com</span>
                        <span>◎ beam 01 · sweep 3.6s</span>
                    </div>
                }
                actions={
                    <>
                        <Button
                            size="lg"
                            href={ROUTES.about}
                            className="btn-nudge"
                            iconRight={<Icon node={ArrowRight} />}
                        >
                            About Beamcove
                        </Button>
                        <Button size="lg" variant="secondary" href="#what-we-do">
                            What we do
                        </Button>
                    </>
                }
            >
                We take the craft seriously and still have fun doing it. What we’re building is
                almost ready to meet you.
            </Splash>
        </div>
    );
}
