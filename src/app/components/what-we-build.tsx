import { KindGrid } from "@/app/components/kind-grid";
import { SectionHead } from "@/app/components/section-head";
import { ROUTES } from "@/content/site";

export function WhatWeBuild() {
    return (
        <section className="section" id="build" aria-labelledby="build-title">
            <div className="container">
                <SectionHead
                    id="build"
                    eyebrow="What we build"
                    title="Three directions."
                    more={{ href: ROUTES.products, label: "See our products" }}
                >
                    Different problems, same care.
                </SectionHead>
                <KindGrid />
            </div>
        </section>
    );
}
