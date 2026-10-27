import { ArrowRight } from "lucide";

import { BeamDots } from "@/app/components/beam-dots";
import { Icon } from "@/app/components/icon";
import { MoreLink } from "@/app/components/more-link";
import { LOGBOOK } from "@/content/logbook";
import { formatDate, ROUTES, SITE } from "@/content/site";
import { Button, Card, Splash } from "@/design-system";

export function Hero() {
    const latest = LOGBOOK.find((entry) => entry.date);
    return (
        <div className="container hero-wrap" id="top">
            <Splash
                className="hero"
                data-theme="light"
                titleAs="h1"
                eyebrow="A fleet of creative ventures"
                title="Charting new horizons in the digital sea."
                art={
                    <>
                        <BeamDots />
                        {latest?.date && (
                            <Card
                                variant="glass"
                                className="hero-glass"
                                eyebrow="Latest from the logbook"
                            >
                                <time className="mono" dateTime={latest.date}>
                                    {formatDate(latest.date)}
                                </time>
                                <p className="headline hero-glass-title">{latest.title}</p>
                                <MoreLink href={ROUTES.logbook}>See the logbook</MoreLink>
                            </Card>
                        )}
                    </>
                }
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
