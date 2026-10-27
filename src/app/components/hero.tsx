import { ArrowRight } from "lucide";

import { BeamDots } from "@/app/components/beam-dots";
import { Icon } from "@/app/components/icon";
import { Button, Card, DotMeter, Splash } from "@/design-system";

export function Hero() {
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
                        <Card variant="glass" className="hero-glass" eyebrow="Now building">
                            <div className="hero-glass-row">
                                <span className="headline">Caskade</span>
                                <span className="mono">BC-001</span>
                            </div>
                            <div data-reveal="fill">
                                <DotMeter value={72} columns={18} label="Ready to sail" />
                            </div>
                        </Card>
                    </>
                }
                actions={
                    <>
                        <Button
                            size="lg"
                            href="#fleet"
                            className="btn-nudge"
                            iconRight={<Icon node={ArrowRight} />}
                        >
                            Meet the fleet
                        </Button>
                        <Button size="lg" variant="secondary" href="/about/">
                            About the studio
                        </Button>
                    </>
                }
            >
                Beamcove is home to a fleet of apps, tools and other bounties — each one built with
                craft and a little fun.
            </Splash>
        </div>
    );
}
