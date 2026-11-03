import type { ReactNode } from "react";

import { SCENES } from "@/app/components/scenes";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { useReveal } from "@/app/utils/motion";
import { ChapterRail, Stage, type Chapter } from "@/design-system";

/**
 * Every page: one glyph Stage behind everything, the fixed header, an
 * optional chapter rail, the page's screens, and the footer.
 */
export function SiteLayout({ chapters, children }: { chapters?: Chapter[]; children: ReactNode }) {
    useReveal();
    return (
        <div className="site">
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <Stage scenes={SCENES} />
            <SiteHeader />
            {chapters && <ChapterRail chapters={chapters} />}
            <main id="main">{children}</main>
            <SiteFooter />
        </div>
    );
}
