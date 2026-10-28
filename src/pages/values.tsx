import { Manifesto } from "@/app/components/manifesto";
import { PageHero } from "@/app/components/page-hero";
import { SiteLayout } from "@/app/components/site-layout";
import { VALUES } from "@/content/values";

export function ValuesPage() {
    return (
        <SiteLayout>
            <PageHero tone="flare" eyebrow="Values" title="Our values.">
                Adventure, integrity and balance: the three values behind everything Beamcove
                builds.
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
                                <span className="ink-figure" aria-hidden="true">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h2 className="title-1 value-title" id={`${value.id}-title`}>
                                    {value.title}
                                </h2>
                            </div>
                            <p className="title-3 value-body">{value.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <Manifesto tone="tide" />
        </SiteLayout>
    );
}
