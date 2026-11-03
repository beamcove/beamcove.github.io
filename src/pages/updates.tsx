import { Dispatches } from "@/app/components/dispatches";
import { LogList } from "@/app/components/log-list";
import { PageHero } from "@/app/components/page-hero";
import { Section } from "@/app/components/section";
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

            {byYear(LOGBOOK).map(([year, entries]) => (
                <Section
                    key={year}
                    id={`year-${year.toLowerCase()}`}
                    kicker={`${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
                    title={year}
                >
                    <LogList entries={entries} />
                </Section>
            ))}

            <Dispatches compact />
        </SiteLayout>
    );
}
