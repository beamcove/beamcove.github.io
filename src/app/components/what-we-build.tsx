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
                    title="Software for better ways to work, live and play."
                    more={{ href: ROUTES.products, label: "See our products" }}
                >
                    Original ideas turned into useful digital products, built with care, curiosity
                    and a sense of adventure.
                </SectionHead>
                <KindGrid />
            </div>
        </section>
    );
}
