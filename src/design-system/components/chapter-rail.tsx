import { useActiveChapter, type Chapter } from "./use-active-chapter";

/**
 * The chapter list pinned to the right edge on wide screens: numbered ticks,
 * the current chapter named and drawn out in beam. It doubles as navigation.
 */
export function ChapterRail({
    chapters,
    label = "Chapters",
}: {
    chapters: Chapter[];
    label?: string;
}) {
    const active = useActiveChapter(chapters);
    return (
        <nav className="bc-rail" aria-label={label} data-quiet="fixed">
            <ol>
                {chapters.map((c, i) => (
                    <li key={c.id}>
                        <a
                            href={`#${c.id}`}
                            aria-current={active === c.id ? "location" : undefined}
                        >
                            <span className="bc-rail-label">{c.label}</span>
                            <span className="bc-rail-n">{String(i).padStart(2, "0")}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
