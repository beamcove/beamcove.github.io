import type { CSSProperties } from "react";

import { Manifesto } from "@/app/components/manifesto";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { PROMISES, VALUES } from "@/content/values";

export function ValuesPage() {
    return (
        <SiteLayout>
            <PageHero tone="flare" eyebrow="Values" title="The compass we steer by.">
                Three words we come back to when a decision is hard, and four promises we make to
                everyone who sails with us.
            </PageHero>

            <section className="section" aria-label="Our values">
                <div className="container value-list">
                    {VALUES.map((value, i) => (
                        <article
                            key={value.id}
                            id={value.id}
                            className="value-row"
                            data-reveal
                            aria-labelledby={`${value.id}-title`}
                        >
                            <div>
                                <span className="mono-data principle-num">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h2 className="title-1 value-title" id={`${value.id}-title`}>
                                    {value.title}
                                </h2>
                                <p className="body-lg value-short">{value.short}</p>
                            </div>
                            <div>
                                <p className="muted">{value.long}</p>
                                <p className="headline value-practice-title">In practice</p>
                                <ul className="tick-list">
                                    {value.practice.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section" aria-labelledby="promises-title">
                <div className="container">
                    <div className="principles bc-dots">
                        <SectionHead
                            id="promises"
                            eyebrow="Our promises"
                            title="What you can hold us to."
                        >
                            These hold for every ship in the fleet, launched or not.
                        </SectionHead>
                        <ol className="promise-grid">
                            {PROMISES.map((promise, i) => (
                                <li
                                    key={promise.title}
                                    data-reveal
                                    style={{ "--d": i } as CSSProperties}
                                >
                                    <h3 className="title-3">{promise.title}</h3>
                                    <p className="muted">{promise.body}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            <Manifesto />
        </SiteLayout>
    );
}
