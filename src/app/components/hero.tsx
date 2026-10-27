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
                eyebrow="A fleet of creative ventures"
                title="Charting new horizons in the digital sea."
                art={<BeamDots />}
                actions={
                    <>
                        <Button
                            size="lg"
                            href={ROUTES.about}
                            className="btn-nudge"
                            iconRight={<Icon node={ArrowRight} />}
                        >
                            About the studio
                        </Button>
                        <Button size="lg" variant="secondary" href="#build">
                            What we build
                        </Button>
                    </>
                }
            >
                {SITE.summary}
            </Splash>
        </div>
    );
}
