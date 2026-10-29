import { Dispatches } from "@/app/components/dispatches";
import { Hero } from "@/app/components/hero";
import { Manifesto } from "@/app/components/manifesto";
import { Questions } from "@/app/components/questions";
import { SiteLayout } from "@/app/components/site-layout";
import { Story } from "@/app/components/story";
import { Ticker } from "@/app/components/ticker";
import { WhatWeBuild } from "@/app/components/what-we-build";

/** The landing page: the abstract. Values and updates live on their own pages. */
export function HomePage() {
    return (
        <SiteLayout>
            <Hero />
            <Ticker />
            <WhatWeBuild />
            <Story />
            {/* Printed blocks (manifesto, dispatches) never sit back to back. */}
            <Manifesto />
            <Questions />
            <Dispatches />
        </SiteLayout>
    );
}
