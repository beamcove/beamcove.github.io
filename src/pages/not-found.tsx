import { Scene } from "@/app/components/scene";
import { SiteLayout } from "@/app/components/site-layout";
import { ROUTES } from "@/content/site";
import { Button, Face, Kicker } from "@/design-system";

export function NotFoundPage() {
    return (
        <SiteLayout>
            <Scene name="lost" className="not-found" id="top" aria-labelledby="page-title">
                <div className="wrap">
                    <div className="not-found-copy" data-quiet>
                        <Face eyes="cross" ink="c" size={32} className="not-found-face" />
                        <Kicker>404 · Page not found</Kicker>
                        <h1 className="display page-title" id="page-title">
                            Off the map.
                        </h1>
                        <p className="lead">
                            This page doesn’t exist, or it wandered off. Check the address, or head
                            back home.
                        </p>
                        <div className="hero-actions">
                            <Button size="lg" href={ROUTES.home}>
                                Go to the homepage
                            </Button>
                            <Button size="lg" variant="secondary" href={ROUTES.contact}>
                                Contact us
                            </Button>
                        </div>
                    </div>
                </div>
            </Scene>
        </SiteLayout>
    );
}
