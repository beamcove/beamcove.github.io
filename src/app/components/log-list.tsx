import { formatDate } from "@/content/site";
import type { LogEntry } from "@/content/logbook";
import { Badge } from "@/design-system";

export function LogList({ entries, tags = false }: { entries: LogEntry[]; tags?: boolean }) {
    return (
        <ol className="logbook">
            {entries.map((entry) => (
                <li key={entry.title} data-reveal>
                    {entry.date ? (
                        <time className="mono muted" dateTime={entry.date}>
                            {formatDate(entry.date)}
                        </time>
                    ) : (
                        <span>
                            <Badge tone="flare">Now</Badge>
                        </span>
                    )}
                    <div>
                        <h3 className="headline">{entry.title}</h3>
                        <p className="muted">{entry.body}</p>
                        {tags && <Badge className="log-tag">{entry.tag}</Badge>}
                    </div>
                </li>
            ))}
        </ol>
    );
}
