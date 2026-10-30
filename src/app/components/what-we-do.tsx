import { KindGrid } from "@/app/components/kind-grid";
import { SectionHead } from "@/app/components/section-head";
import { ROUTES } from "@/content/site";

export function WhatWeDo() {
    return (
        <section className="section" id="what-we-do" aria-labelledby="what-we-do-title">
            <div className="container">
                <SectionHead
                    id="what-we-do"
                    eyebrow="What we do"
                    title="Three directions."
                    more={{ href: ROUTES.projects, label: "See our projects" }}
                >
                    Different problems, same care.
                </SectionHead>
                <KindGrid />
            </div>
        </section>
    );
}
