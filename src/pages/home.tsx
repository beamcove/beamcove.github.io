import { Dispatches } from "@/app/components/dispatches";
import { Fleet } from "@/app/components/fleet";
import { Hero } from "@/app/components/hero";
import { Logbook } from "@/app/components/logbook";
import { Manifesto } from "@/app/components/manifesto";
import { Principles } from "@/app/components/principles";
import { SiteLayout } from "@/app/components/site-layout";
import { Ticker } from "@/app/components/ticker";
import { Voyage } from "@/app/components/voyage";
import { WhatWeBuild } from "@/app/components/what-we-build";
import { ROUTES } from "@/content/site";

/** The landing page: the abstract. Each section links to its full page. */
export function HomePage() {
    return (
        <SiteLayout>
            <Hero />
            <Ticker />
            <WhatWeBuild />
            <Voyage
                more={{ href: `${ROUTES.about}#how-we-work`, label: "More about the studio" }}
            />
            <Fleet />
            <Manifesto />
            <Principles />
            <Logbook />
            <Dispatches />
        </SiteLayout>
    );
}
