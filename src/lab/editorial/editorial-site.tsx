import "./editorial.css";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { ART } from "@/app/components/glyph-compositions";
import { Icon } from "@/app/components/icon";
import { useReveal } from "@/app/utils/motion";
import { useSubscribe } from "@/app/utils/subscribe";
import { QUESTIONS } from "@/content/faq";
import { KINDS } from "@/content/fleet";
import { LOGBOOK } from "@/content/logbook";
import { formatDate, ROUTES, SITE, SOCIALS } from "@/content/site";
import { MISSION, STORY, STORY_MARK, VALUES, VISION } from "@/content/values";
import { Button, GlyphField, type GlyphComposition } from "@/design-system";
import { LabBar } from "@/lab/lab-bar";

const SECTIONS = [
    { id: "what-we-do", label: "What we do" },
    { id: "about", label: "About" },
    { id: "values", label: "Values" },
    { id: "updates", label: "Updates" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
] as const;

/** The cover plate: a black-and-blue signal field at half density, like a halftone photograph. */
const COVER: GlyphComposition = {
    seed: 19,
    inks: ["d", "a"],
    ramp: "signal",
    density: 0.5,
    scale: 6,
    blocks: [
        { x: 0.6, y: 0.16, w: 0.15, h: 0.5, ink: "a" },
        { x: 0.73, y: 0.6, w: 0.08, h: 0.24, ink: "d" },
    ],
};

/** Plate captions for the three kinds, after the shapes in their compositions. */
const PLATE_NOTES: Record<string, string> = {
    work: "Two stacked blocks, like windows on a desk.",
    live: "A sun dropping behind a hill.",
    play: "A tall piece and a short one, mid-bounce.",
};

const PAGES = [
    { href: ROUTES.about, label: "About" },
    { href: ROUTES.projects, label: "Projects" },
    { href: ROUTES.updates, label: "Updates" },
    { href: ROUTES.contact, label: "Contact" },
    { href: ROUTES.brand, label: "Brand kit" },
    { href: ROUTES.design, label: "Design system" },
    { href: ROUTES.privacy, label: "Privacy" },
    { href: ROUTES.terms, label: "Terms" },
];

/** Splits a line into `n` lines of words, keeping the longest line as short as possible. */
function breakLines(text: string, n: number): string[] {
    const words = text.split(" ");
    if (words.length <= n) return words;
    let best: string[] = [text];
    let bestMax = Infinity;
    const walk = (start: number, left: number, acc: string[]) => {
        if (left === 1) {
            const lines = [...acc, words.slice(start).join(" ")];
            const max = Math.max(...lines.map((l) => l.length));
            if (max < bestMax) [best, bestMax] = [lines, max];
            return;
        }
        for (let end = start + 1; end <= words.length - left + 1; end++)
            walk(end, left - 1, [...acc, words.slice(start, end).join(" ")]);
    };
    walk(0, n, []);
    return best;
}

/** The tagline set in four staggered lines. Offsets are in characters, clamped to the measure. */
function Tagline() {
    const lines = breakLines(SITE.tagline, 4);
    const wide = [0, 3, 9, 4];
    const narrow = [0, 0, 6, 0];
    return (
        <h1 className="ed-h1">
            {lines.map((line, i) => (
                <span
                    key={line}
                    className="ed-h1-line"
                    style={
                        {
                            "--i": i,
                            "--o": Math.max(0, Math.min(wide[i] ?? 0, 16 - line.length)),
                            "--om": Math.max(0, Math.min(narrow[i] ?? 0, 12 - line.length)),
                        } as CSSProperties
                    }
                >
                    {line}{" "}
                </span>
            ))}
        </h1>
    );
}

function Masthead() {
    const [open, setOpen] = useState(false);
    const latest = LOGBOOK.find((entry) => entry.date)?.date;

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="ed-masthead">
            <div className="ed-wrap">
                <div className="ed-runline">
                    <span>
                        {latest ? (
                            <>
                                Latest update · <time dateTime={latest}>{formatDate(latest)}</time>
                            </>
                        ) : (
                            "Now building"
                        )}
                    </span>
                    <span className="ed-runline-mid">beamcove.com</span>
                    <span className="ed-runline-end">A technology company</span>
                </div>
                <div className="ed-mast-row">
                    <a className="ed-wordmark" href="#top">
                        {SITE.name}
                    </a>
                    <button
                        type="button"
                        className="ed-menu-btn"
                        aria-expanded={open}
                        aria-controls="ed-nav"
                        onClick={() => setOpen((v) => !v)}
                    >
                        <Icon node={open ? X : Menu} size={18} />
                        {open ? "Close" : "Menu"}
                    </button>
                    <nav
                        id="ed-nav"
                        className="ed-nav"
                        aria-label="Sections"
                        data-open={open || undefined}
                    >
                        <ul>
                            {SECTIONS.map((s) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                                        {s.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <a
                            className="ed-btn ed-btn-solid"
                            href="#newsletter"
                            onClick={() => setOpen(false)}
                        >
                            Subscribe
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section className="ed-hero" id="top" aria-label="Introduction">
            <div className="ed-wrap">
                <p className="ed-kicker ed-hero-kicker">
                    <span className="ed-dot" aria-hidden="true" />
                    Beamcove, in brief
                </p>
                <Tagline />
                <div className="ed-hero-foot">
                    <p className="ed-hero-meta">
                        Words and glyph art by Beamcove.
                        <br />
                        Six short sections, one long scroll.
                    </p>
                    <div className="ed-standfirst">
                        <p className="ed-standfirst-lead">{SITE.summary}</p>
                        <p>
                            We take the craft seriously and still have fun doing it. What we’re
                            building is almost ready to meet you.
                        </p>
                        <div className="ed-actions">
                            <a className="ed-btn ed-btn-solid" href="#what-we-do">
                                What we do
                                <Icon node={ArrowDown} size={16} />
                            </a>
                            <a className="ed-btn" href="#newsletter">
                                Get the newsletter
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <figure className="ed-plate">
                <div className="ed-plate-art bc-glyphs" data-theme="paper">
                    <GlyphField composition={COVER} quiet={false} />
                </div>
                <figcaption className="ed-wrap ed-caption">
                    <span>Plate 1. The digital sea at half tide.</span>
                    <span>Glyph art, two inks on paper. Drawn live in your browser.</span>
                </figcaption>
            </figure>
        </section>
    );
}

function Spread({
    id,
    n,
    title,
    dek,
    children,
}: {
    id: string;
    n: number;
    title: string;
    dek?: ReactNode;
    children: ReactNode;
}) {
    const num = String(n).padStart(2, "0");
    return (
        <section id={id} className={`ed-spread ed-spread-${id}`} aria-labelledby={`${id}-title`}>
            <div className="ed-wrap">
                <div className="ed-runhead" aria-hidden="true">
                    <span>
                        {num} · {title}
                    </span>
                    <span>Beamcove</span>
                </div>
                <div className="ed-spread-grid">
                    <p className="ed-num" aria-hidden="true">
                        {num}
                    </p>
                    <div className="ed-spread-body">
                        <div className="ed-spread-head" data-reveal>
                            <h2 className="ed-h2" id={`${id}-title`}>
                                {title}
                            </h2>
                            {dek ? <p className="ed-dek">{dek}</p> : null}
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Plate({ art, caption }: { art: GlyphComposition; caption: string }) {
    return (
        <figure className="ed-fig">
            <div className="ed-fig-art bc-glyphs" data-theme="paper">
                <GlyphField composition={art} quiet={false} />
            </div>
            <figcaption className="ed-caption">{caption}</figcaption>
        </figure>
    );
}

function WhatWeDo() {
    return (
        <Spread
            id="what-we-do"
            n={1}
            title="What we do"
            dek="Three directions. Different problems, same care."
        >
            <div className="ed-features">
                {KINDS.map((kind, i) => (
                    <article
                        key={kind.art}
                        className={`ed-feature ed-feature-${i + 1}`}
                        data-reveal
                        style={{ "--d": i } as CSSProperties}
                    >
                        <Plate
                            art={ART[kind.art]}
                            caption={`Plate ${i + 2}. ${PLATE_NOTES[kind.art] ?? kind.title}`}
                        />
                        <h3 className="ed-h3">{kind.title}</h3>
                        <p>{kind.body}</p>
                    </article>
                ))}
            </div>
            <a className="ed-more" href={ROUTES.projects}>
                See our projects
                <Icon node={ArrowRight} size={16} />
            </a>
        </Spread>
    );
}

function StoryText({ text }: { text: string }) {
    const at = text.indexOf(STORY_MARK);
    if (at < 0) return <>{text}</>;
    return (
        <>
            {text.slice(0, at)}
            <mark className="ed-mark">{STORY_MARK}</mark>
            {text.slice(at + STORY_MARK.length)}
        </>
    );
}

function About() {
    const [first = "", ...rest] = STORY;
    return (
        <Spread id="about" n={2} title="About" dek="How Beamcove started.">
            <div className="ed-story">
                <div className="ed-prose" data-reveal>
                    <p className="ed-dropcap">
                        <StoryText text={first} />
                    </p>
                </div>
                <aside className="ed-margin-note" data-reveal aria-label="Founder">
                    <p className="ed-kicker">Founder</p>
                    <p>{SITE.founder}</p>
                    <a className="ed-more" href={ROUTES.about}>
                        The full story
                        <Icon node={ArrowRight} size={16} />
                    </a>
                </aside>
                <blockquote className="ed-pull" data-reveal>
                    <p>…{STORY_MARK}.</p>
                </blockquote>
                <div className="ed-prose ed-prose-after" data-reveal>
                    {rest.map((p) => (
                        <p key={p}>{p}</p>
                    ))}
                </div>
            </div>
            <div className="ed-bearing">
                <article className="ed-bearing-col" data-reveal>
                    <h3 className="ed-kicker">Mission · what we do</h3>
                    <p className="ed-bearing-text">{MISSION}</p>
                </article>
                <article
                    className="ed-bearing-col"
                    data-reveal
                    style={{ "--d": 1 } as CSSProperties}
                >
                    <h3 className="ed-kicker">Vision · where we’re going</h3>
                    <p className="ed-bearing-text">{VISION}</p>
                    <p className="ed-bearing-note">
                        That’s the whole plan. The rest is details, and we like details.
                    </p>
                </article>
            </div>
        </Spread>
    );
}

function Values() {
    return (
        <Spread
            id="values"
            n={3}
            title="Values"
            dek="Three rules we keep. Three, because we can remember three."
        >
            <ol className="ed-values">
                {VALUES.map((value, i) => (
                    <li
                        key={value.id}
                        className="ed-value"
                        data-reveal
                        style={{ "--d": i } as CSSProperties}
                    >
                        <span className="ed-value-n" aria-hidden="true">
                            {i + 1}
                        </span>
                        <h3 className="ed-h3">{value.title}</h3>
                        <p>{value.body}</p>
                    </li>
                ))}
            </ol>
        </Spread>
    );
}

function Updates() {
    return (
        <Spread id="updates" n={4} title="Updates" dek="News from Beamcove, newest first.">
            <ol className="ed-contents">
                {LOGBOOK.map((entry) => (
                    <li key={entry.title} className="ed-entry" data-reveal>
                        <p className="ed-entry-date">
                            {entry.date ? (
                                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                            ) : (
                                "In progress"
                            )}
                        </p>
                        <div className="ed-entry-main">
                            <h3 className="ed-entry-title">{entry.title}</h3>
                            <p>{entry.body}</p>
                        </div>
                        <p className="ed-entry-tag">{entry.tag}</p>
                    </li>
                ))}
            </ol>
            <a className="ed-more" href={ROUTES.updates}>
                All updates
                <Icon node={ArrowRight} size={16} />
            </a>
        </Spread>
    );
}

/** An answer, with the privacy policy's path turned into a link. */
function Answer({ text }: { text: string }) {
    const at = text.indexOf(ROUTES.privacy);
    if (at < 0) return <>{text}</>;
    return (
        <>
            {text.slice(0, at)}
            <a href={ROUTES.privacy}>{ROUTES.privacy}</a>
            {text.slice(at + ROUTES.privacy.length)}
        </>
    );
}

function Faq() {
    return (
        <Spread
            id="faq"
            n={5}
            title="FAQ"
            dek="Asked and answered. Didn’t find yours? Email us. A real person reads every message."
        >
            <div className="ed-interview">
                {QUESTIONS.map((item) => (
                    <div key={item.q} className="ed-qa" data-reveal>
                        <h3 className="ed-q">{item.q}</h3>
                        <p className="ed-a">
                            <Answer text={item.a} />
                        </p>
                    </div>
                ))}
            </div>
        </Spread>
    );
}

function Newsletter() {
    const { email, setEmail, error, done, submitting, submit } = useSubscribe();
    return (
        <article className="ed-letter" id="newsletter" aria-labelledby="newsletter-title">
            <p className="ed-kicker">Newsletter</p>
            <h3 className="ed-letter-title" id="newsletter-title">
                Hear when we launch.
            </h3>
            <p className="ed-letter-body">
                A friendly email whenever there’s something worth telling you. Unsubscribe any time,
                no hard feelings.
            </p>
            {done ? (
                <p className="ed-done" role="status">
                    <strong>You’re subscribed.</strong> We’ll write when there’s news.
                </p>
            ) : (
                <form className="ed-form" onSubmit={submit} noValidate>
                    <label className="ed-label" htmlFor="ed-email">
                        Email address
                    </label>
                    <div className="ed-form-row">
                        <input
                            id="ed-email"
                            className="ed-input"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            disabled={submitting}
                            aria-invalid={error ? true : undefined}
                            aria-describedby="ed-email-note"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" size="lg" disabled={submitting}>
                            {submitting ? "Subscribing…" : "Subscribe"}
                        </Button>
                    </div>
                    <p
                        id="ed-email-note"
                        className={error ? "ed-note ed-note-error" : "ed-note"}
                        role={error ? "alert" : undefined}
                    >
                        {error || "We only use it to send the newsletter."}
                    </p>
                </form>
            )}
        </article>
    );
}

function Letters() {
    return (
        <Spread id="contact" n={6} title="Stay in touch" dek="Two ways to keep the line open.">
            <div className="ed-letters">
                <Newsletter />
                <article
                    className="ed-letter ed-letter-contact"
                    aria-labelledby="contact-mail-title"
                    data-reveal
                >
                    <p className="ed-kicker">Contact</p>
                    <h3 className="ed-letter-title" id="contact-mail-title">
                        Say hello.
                    </h3>
                    <p className="ed-letter-body">
                        Questions, partnerships, press, or just a kind word: here’s how to reach us.
                    </p>
                    <a className="ed-mail" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                    </a>
                    <ul className="ed-socials">
                        {SOCIALS.map((s) => (
                            <li key={s.name}>
                                <a href={s.href} rel="noopener noreferrer">
                                    <BrandIcon name={s.name} />
                                    <span>{s.label}</span>
                                    <span className="ed-handle">{s.handle}</span>
                                    <Icon node={ArrowUpRight} size={16} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </Spread>
    );
}

function Footer() {
    return (
        <footer className="ed-footer">
            <div className="ed-wrap">
                <div className="ed-footer-grid">
                    <div className="ed-footer-brand">
                        <p className="ed-footer-mark">{SITE.name}</p>
                        <p>{SITE.summary}</p>
                    </div>
                    <nav className="ed-footer-pages" aria-label="Pages">
                        <p className="ed-kicker">Pages</p>
                        <ul>
                            {PAGES.map((page) => (
                                <li key={page.href}>
                                    <a href={page.href}>{page.label}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="ed-colophon">
                        <p className="ed-kicker">Colophon</p>
                        <p>
                            Set in Departure Mono, JetBrains Mono and Onest. Plates are glyph art,
                            drawn in two inks on paper. No tracking cookies were harmed, because
                            none were used.
                        </p>
                    </div>
                </div>
                <div className="ed-footer-base">
                    <p>
                        © {new Date().getFullYear()} {SITE.legalName}
                    </p>
                    <a href="#top">Back to top</a>
                </div>
            </div>
        </footer>
    );
}

/** Lab version of the site: Editorial, a design magazine crossed with a 1984 computing journal. */
export function EditorialSite() {
    useReveal();
    return (
        <div className="editorial">
            <Masthead />
            <main>
                <Hero />
                <WhatWeDo />
                <About />
                <Values />
                <Updates />
                <Faq />
                <Letters />
            </main>
            <Footer />
            <LabBar current="editorial" />
        </div>
    );
}
