import { Plus } from "lucide";

import { Icon } from "@/app/components/icon";
import { Badge } from "@/design-system";

const ENTRIES = [
    {
        date: null,
        title: "Caskade is in the shipyard",
        body: "Final coat of paint on the hull. Launch news goes out by dispatch first.",
    },
    {
        date: "2026-10-27",
        title: "Ink & tide comes off the press",
        body: "Version 1 of our design system: riso paper, two inks and a fitted dot grid. This site is its first print.",
    },
    {
        date: "2026-01-31",
        title: "beamcove.com points home",
        body: "The cove gets its address, and a first page goes up.",
    },
    {
        date: "2026-01-22",
        title: "The first plank",
        body: "The Beamcove repository is laid down, along with a lot of plans.",
    },
];

const QUESTIONS = [
    {
        q: "What is Beamcove?",
        a: "A small studio that builds and runs its own software: apps, tools and experiments. Together, they’re the fleet.",
    },
    {
        q: "When does Caskade launch?",
        a: "When it’s seaworthy. Subscribe to dispatches and you’ll hear before anyone else.",
    },
    {
        q: "How often do dispatches go out?",
        a: "Only when there’s news: a launch, a big update or something worth sharing. No schedule and no spam.",
    },
    {
        q: "Can I suggest an idea?",
        a: "Please do. Find us on GitHub, X, Reddit or Discord. The links are at the bottom of the page.",
    },
    {
        q: "Why the nautical theme?",
        a: "A cove is a sheltered harbour where ships are built and set out from. That’s what we want Beamcove to be for the things we make.",
    },
];

const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

export function Logbook() {
    return (
        <section className="section" aria-label="Logbook and questions">
            <div className="container logbook-grid">
                <div id="logbook">
                    <header className="split-head" data-reveal>
                        <p className="bc-eyebrow">Logbook</p>
                        <h2 className="title-2">Notes from the voyage so far.</h2>
                    </header>
                    <ol className="logbook">
                        {ENTRIES.map((entry) => (
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
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                <div id="questions">
                    <header className="split-head" data-reveal>
                        <p className="bc-eyebrow">Questions</p>
                        <h2 className="title-2">Asked at the dock.</h2>
                    </header>
                    <div className="faq" data-reveal>
                        {QUESTIONS.map((item) => (
                            <details key={item.q} className="faq-item">
                                <summary>
                                    <span>{item.q}</span>
                                    <Icon node={Plus} size={18} />
                                </summary>
                                <p className="muted">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
