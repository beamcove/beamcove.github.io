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
                    eyebrow="404"
                    title="Off the map."
                    actions={
                        <>
                            <Button size="lg" href={ROUTES.home}>
                                Back to the cove
                            </Button>
                            <Button size="lg" variant="secondary" href={ROUTES.contact}>
                                Contact us
                            </Button>
                        </>
                    }
                >
                    This page has sailed somewhere we can’t follow. Check the address, or head back
                    to familiar waters.
                </Splash>
            </div>
        </SiteLayout>
    );
}
