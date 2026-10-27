import type { ReactNode } from "react";

import { PageHero } from "@/app/components/page-hero";
import { SiteLayout } from "@/app/components/site-layout";
import { formatDate, SITE } from "@/content/site";
import { Callout } from "@/design-system";

export interface LegalSection {
    id: string;
    title: string;
    body: ReactNode;
}

/** Shared layout for the privacy policy and terms: summary, contents, prose. */
export function LegalPage({
    eyebrow,
    title,
    lead,
    summary,
    sections,
}: {
    eyebrow: string;
    title: string;
    lead: string;
    summary: string[];
    sections: LegalSection[];
}) {
    return (
        <SiteLayout>
            <PageHero
                band="tide"
                eyebrow={eyebrow}
                title={title}
                meta={
                    <p className="mono muted">
                        Last updated{" "}
                        <time dateTime={SITE.legalUpdated}>{formatDate(SITE.legalUpdated)}</time>
                    </p>
                }
            >
                {lead}
            </PageHero>

            <div className="container legal">
                <aside className="legal-toc" aria-labelledby="toc-title">
                    <p className="caption muted" id="toc-title">
                        On this page
                    </p>
                    <ol>
                        {sections.map((section) => (
                            <li key={section.id}>
                                <a href={`#${section.id}`}>{section.title}</a>
                            </li>
                        ))}
                    </ol>
                </aside>
                <article className="prose legal-body">
                    <Callout tone="info" title="The short version">
                        {summary.join(" ")}
                    </Callout>
                    {sections.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            aria-labelledby={`${section.id}-h`}
                        >
                            <h2 className="title-3" id={`${section.id}-h`}>
                                {section.title}
                            </h2>
                            {section.body}
                        </section>
                    ))}
                </article>
            </div>
        </SiteLayout>
    );
}
