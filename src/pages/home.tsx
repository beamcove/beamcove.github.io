import { Dispatches } from "@/app/components/dispatches";
import { Hero } from "@/app/components/hero";
import { LatestUpdates } from "@/app/components/latest-updates";
import { Manifesto } from "@/app/components/manifesto";
import { Questions } from "@/app/components/questions";
import { SceneTakeover } from "@/app/components/scene-takeover";
import { SiteLayout } from "@/app/components/site-layout";
import { Story } from "@/app/components/story";
import { Values } from "@/app/components/values";
import { WhatWeDo } from "@/app/components/what-we-do";
import type { Chapter } from "@/design-system";

const CHAPTERS: Chapter[] = [
    { id: "top", label: "Start" },
    { id: "what-we-do", label: "What we do" },
    { id: "story", label: "About" },
    { id: "values", label: "Values" },
    { id: "updates", label: "Updates" },
    { id: "questions", label: "FAQ" },
    { id: "newsletter", label: "Newsletter" },
];

/** The landing page: the whole company as one scroll, one idea per screen. */
export function HomePage() {
    return (
        <SceneTakeover.Provider value>
            <SiteLayout chapters={CHAPTERS}>
                <Hero />
                <WhatWeDo n={1} />
                <Story n={2} />
                <Manifesto />
                <Values n={3} />
                <LatestUpdates n={4} />
                <Questions n={5} />
                <Dispatches n={6} />
            </SiteLayout>
        </SceneTakeover.Provider>
    );
}
