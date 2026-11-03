import type { ReactNode } from "react";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { useReveal } from "@/app/utils/motion";
import { ChapterRail, type Chapter } from "@/design-system";

/**
 * Every page: the fixed header, an optional chapter rail, the page's
 * screens (each prints its own scene on the page grid), and the footer.
 */
export function SiteLayout({ chapters, children }: { chapters?: Chapter[]; children: ReactNode }) {
    useReveal();
    return (
        <div className="site">
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <SiteHeader />
            {chapters && <ChapterRail chapters={chapters} />}
            <main id="main">{children}</main>
            <SiteFooter />
        </div>
    );
}
