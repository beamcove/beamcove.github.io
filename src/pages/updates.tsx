import { Dispatches } from "@/app/components/dispatches";
import { LogList } from "@/app/components/log-list";
import { PageHero } from "@/app/components/page-hero";
import { Scene } from "@/app/components/scene";
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
            <PageHero scene="log" eyebrow="Updates" title="What’s new.">
                Launches, milestones and the occasional bit of news, newest first.
            </PageHero>

            <Scene name="updates" aria-label="Log entries">
                <div className="wrap log-years">
                    {byYear(LOGBOOK).map(([year, entries]) => (
                        <div key={year} className="log-year" data-quiet data-reveal>
                            <h2 className="title-1 log-year-title">{year}</h2>
                            <LogList entries={entries} />
                        </div>
                    ))}
                </div>
            </Scene>

            <Dispatches />
        </SiteLayout>
    );
}
