import { ArrowRight } from "lucide";

import { BeamDots } from "@/app/components/beam-dots";
import { Icon } from "@/app/components/icon";
import { ROUTES, SITE } from "@/content/site";
import { Button, Splash } from "@/design-system";

export function Hero() {
    return (
        <div className="container hero-wrap" id="top">
            <Splash
                className="hero"
                data-theme="light"
                titleAs="h1"
                eyebrow="Innovation company"
                title={SITE.tagline}
                art={<BeamDots />}
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
                        <Button size="lg" variant="secondary" href="#build">
                            What we build
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
