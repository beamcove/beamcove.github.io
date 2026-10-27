import { Dispatches } from "@/app/components/dispatches";
import { Fleet } from "@/app/components/fleet";
import { Hero } from "@/app/components/hero";
import { Logbook } from "@/app/components/logbook";
import { Manifesto } from "@/app/components/manifesto";
import { Principles } from "@/app/components/principles";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { Ticker } from "@/app/components/ticker";
import { Voyage } from "@/app/components/voyage";
import { WhatWeBuild } from "@/app/components/what-we-build";
import { useReveal } from "@/app/utils/motion";

export function App() {
    useReveal();
    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <SiteHeader />
            <main id="main">
                <Hero />
                <Ticker />
                <WhatWeBuild />
                <Voyage />
                <Fleet />
                <Manifesto />
                <Principles />
                <Logbook />
                <Dispatches />
            </main>
            <SiteFooter />
        </>
    );
}
