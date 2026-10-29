import { SiteLayout } from "@/app/components/site-layout";
import { ROUTES } from "@/content/site";
import { Button, Splash } from "@/design-system";

export function NotFoundPage() {
    return (
        <SiteLayout>
            <div className="container page-hero" id="top">
                <Splash
                    tone="tide"
                    align="center"
                    className="not-found"
                    data-theme="light"
                    titleAs="h1"
                    eyebrow="Page not found"
                    title={
                        <>
                            <span className="not-found-figure">
                                <span className="ink-figure">404</span>
                            </span>
                            Off the map.
                        </>
                    }
                    actions={
                        <>
                            <Button size="lg" href={ROUTES.home}>
                                Go to the homepage
                            </Button>
                            <Button size="lg" variant="secondary" href={ROUTES.contact}>
                                Contact us
                            </Button>
                        </>
                    }
                >
                    This page doesn’t exist, or it wandered off. Check the address, or head back
                    home.
                </Splash>
            </div>
        </SiteLayout>
    );
}
