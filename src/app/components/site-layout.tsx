import type { ReactNode } from "react";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { useReveal } from "@/app/utils/motion";

/** Skip link, header, main and footer around every page. */
export function SiteLayout({ children }: { children: ReactNode }) {
    useReveal();
    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
        </>
    );
}
