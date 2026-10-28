import { Dispatches } from "@/app/components/dispatches";
import { Hero } from "@/app/components/hero";
import { Logbook } from "@/app/components/logbook";
import { Manifesto } from "@/app/components/manifesto";
import { Principles } from "@/app/components/principles";
import { SiteLayout } from "@/app/components/site-layout";
import { Story } from "@/app/components/story";
import { Ticker } from "@/app/components/ticker";
import { WhatWeBuild } from "@/app/components/what-we-build";

/** The landing page: the abstract. Each section links to its full page. */
export function HomePage() {
    return (
        <SiteLayout>
            <Hero />
            <Ticker />
            <WhatWeBuild />
            {/* Printed blocks (principles, manifesto, dispatches) never sit back to back. */}
            <Principles />
            <Story />
            <Manifesto />
            <Logbook />
            <Dispatches />
        </SiteLayout>
    );
}
