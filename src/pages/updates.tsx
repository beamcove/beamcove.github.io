import { Dispatches } from "@/app/components/dispatches";
import { LogList } from "@/app/components/log-list";
import { PageHero } from "@/app/components/page-hero";
import { SiteLayout } from "@/app/components/site-layout";
import { LOGBOOK, type LogEntry } from "@/content/logbook";

function byYear(entries: LogEntry[]) {
    const groups = new Map<string, LogEntry[]>();
    for (const entry of entries) {
        const year = entry.date ? entry.date.slice(0, 4) : "Now";
        groups.set(year, [...(groups.get(year) ?? []), entry]);
    }
    return [...groups];
}

export function UpdatesPage() {
    return (
        <SiteLayout>
            <PageHero tone="flare" eyebrow="Updates" title="Company updates.">
                Launches, milestones and other news from Beamcove, newest first.
            </PageHero>

            <section className="section section-tight" aria-label="Log entries">
                <div className="container log-years">
                    {byYear(LOGBOOK).map(([year, entries]) => (
                        <div key={year} className="log-year">
                            <h2 className="title-3 log-year-title" data-reveal>
                                {year}
                            </h2>
                            <LogList entries={entries} tags />
                        </div>
                    ))}
                </div>
            </section>

            <Dispatches />
        </SiteLayout>
    );
}
