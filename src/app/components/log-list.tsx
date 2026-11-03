import { formatDate } from "@/content/site";
import type { LogEntry } from "@/content/logbook";
import { Badge } from "@/design-system";

export function LogList({ entries }: { entries: LogEntry[] }) {
    return (
        <ol className="logbook">
            {entries.map((entry) => (
                <li key={entry.title}>
                    <article className="entry">
                        <p className="entry-meta">
                            {entry.date ? (
                                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                            ) : (
                                <Badge tone="flare">Now</Badge>
                            )}
                            <Badge>{entry.tag}</Badge>
                        </p>
                        <h3 className="title-3 entry-title">{entry.title}</h3>
                        <p className="body-text">{entry.body}</p>
                    </article>
                </li>
            ))}
        </ol>
    );
}
