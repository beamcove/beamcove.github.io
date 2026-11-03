import "./grid.css";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Grid3x3, Menu, X } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { Icon } from "@/app/components/icon";
import { useReveal } from "@/app/utils/motion";
import { useSubscribe } from "@/app/utils/subscribe";
import { QUESTIONS } from "@/content/faq";
import { KINDS } from "@/content/fleet";
import { LOGBOOK } from "@/content/logbook";
import { FOOTER_GROUPS, formatDate, ROUTES, SITE, SOCIALS } from "@/content/site";
import { MISSION, STORY, STORY_MARK, VALUES, VISION } from "@/content/values";
import { GlyphField, type GlyphComposition } from "@/design-system";
import { LabBar } from "@/lab/lab-bar";

/** Seven numbered sections; the numbers do the talking. */
const SECTIONS = [
    { id: "what-we-do", n: "01", label: "What we do" },
    { id: "about", n: "02", label: "About" },
    { id: "values", n: "03", label: "Values" },
    { id: "updates", n: "04", label: "Updates" },
    { id: "faq", n: "05", label: "FAQ" },
    { id: "newsletter", n: "06", label: "Newsletter" },
    { id: "contact", n: "07", label: "Contact" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/** The header lists every section but the newsletter, which has its own button. */
const NAV = SECTIONS.filter((s) => s.id !== "newsletter");

const num = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.n;

/**
 * Square glyph modules, placed like photographs on a Swiss poster: black
 * glyphs with a zone of red, cut by solid blocks in the same two inks.
 */
const plate = (seed: number, blocks: GlyphComposition["blocks"]): GlyphComposition => ({
    seed,
    inks: ["d", "b"],
    ramp: "signal",
    density: 0.5,
    scale: 3,
    blocks,
});

/** For work: two stacked windows. Everyday life: a sun on a hill. Play: a piece mid-bounce. */
const KIND_ART = [
    plate(11, [
        { x: 0.5, y: 0, w: 0.5, h: 0.5, ink: "d" },
        { x: 0.25, y: 0.42, w: 0.33, h: 0.33, ink: "b" },
    ]),
    plate(23, [
        { x: 0, y: 0.67, w: 1, h: 0.33, ink: "d" },
        { x: 0.58, y: 0.42, w: 0.25, h: 0.33, ink: "b" },
    ]),
    plate(37, [
        { x: 0.17, y: 0, w: 0.25, h: 0.67, ink: "d" },
        { x: 0.38, y: 0.58, w: 0.42, h: 0.25, ink: "b" },
    ]),
];

const ABOUT_ART = plate(53, [
    { x: 0, y: 0, w: 0.5, h: 0.25, ink: "d" },
    { x: 0.42, y: 0.17, w: 0.25, h: 0.5, ink: "b" },
]);

const CONTACT_ART = plate(79, [
    { x: 0.5, y: 0.5, w: 0.5, h: 0.5, ink: "d" },
    { x: 0.33, y: 0.25, w: 0.25, h: 0.33, ink: "b" },
]);

const pad = (n: number) => String(n).padStart(2, "0");

/** Real facts only: counted from the content, or said in the FAQ. */
const FACTS = [
    { n: pad(KINDS.length), label: "Directions", note: "For work, everyday life and play." },
    { n: pad(VALUES.length), label: "Values", note: "Adventure, integrity, balance." },
    { n: "00", label: "Tracking cookies", note: "No analytics either." },
    { n: "00", label: "Released so far", note: "Our first projects are in the works." },
];

function Plate({ art, span = 2 }: { art: GlyphComposition; span?: 1 | 2 }) {
    return (
        <div className="gr-plate bc-glyphs" style={{ "--span": span } as CSSProperties}>
            <GlyphField composition={art} quiet={false} />
        </div>
    );
}

function Section({
    id,
    title,
    dek,
    children,
}: {
    id: SectionId;
    title: string;
    dek?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="gr-section" id={id} aria-labelledby={`${id}-title`}>
            <div className="gr-wrap">
                <div className="gr-row gr-head" data-reveal>
                    <p className="gr-num" aria-hidden="true">
                        {num(id)}
                    </p>
                    <div className="gr-head-text">
                        <h2 id={`${id}-title`}>{title}</h2>
                        {dek ? <p className="gr-dek">{dek}</p> : null}
                    </div>
                </div>
                {children}
            </div>
        </section>
    );
}

/** The FAQ's privacy answer names the policy's path: make it a link. */
function linkPrivacy(text: string) {
    const at = text.indexOf(ROUTES.privacy);
    if (at < 0) return text;
    return (
        <>
            {text.slice(0, at)}
            <a href={ROUTES.privacy}>{ROUTES.privacy}</a>
            {text.slice(at + ROUTES.privacy.length)}
        </>
    );
}

function isField(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/** Which section is under the reading line, for the header's index. */
function useCurrentSection() {
    const [current, setCurrent] = useState<string | null>(null);
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
            },
            { rootMargin: "-35% 0px -60% 0px" },
        );
        for (const s of SECTIONS) {
            const el = document.getElementById(s.id);
            if (el) io.observe(el);
        }
        return () => io.disconnect();
    }, []);
    return current;
}

function Header({ showGrid, onGrid }: { showGrid: boolean; onGrid: () => void }) {
    const [open, setOpen] = useState(false);
    const current = useCurrentSection();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="gr-header">
            <div className="gr-wrap gr-row gr-bar">
                <a className="gr-wordmark" href="#top">
                    <span className="gr-mark" aria-hidden="true" />
                    {SITE.name}
                </a>
                <nav className="gr-nav" aria-label="Sections">
                    <ul>
                        {NAV.map((s) => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    aria-current={current === s.id ? "location" : undefined}
                                >
                                    <span className="gr-nav-n">{s.n}</span>
                                    {s.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="gr-actions">
                    <button
                        type="button"
                        className="gr-toggle"
                        aria-pressed={showGrid}
                        onClick={onGrid}
                        title="Show the grid (G)"
                    >
                        <Icon node={Grid3x3} />
                        <span className="gr-toggle-text">Grid</span>
                        <kbd aria-hidden="true">G</kbd>
                    </button>
                    <a className="gr-btn gr-btn-sm gr-header-cta" href="#newsletter">
                        Subscribe
                    </a>
                    <button
                        type="button"
                        className="gr-menu-btn"
                        aria-expanded={open}
                        aria-controls="gr-menu"
                        onClick={() => setOpen((v) => !v)}
                    >
                        <Icon node={open ? X : Menu} size={18} />
                        <span className="visually-hidden">Menu</span>
                    </button>
                </div>
            </div>
            <nav id="gr-menu" className="gr-menu" aria-label="Menu" hidden={!open}>
                <ul className="gr-wrap">
                    {SECTIONS.map((s) => (
                        <li key={s.id}>
                            <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                                <span className="gr-menu-n">{s.n}</span>
                                {s.id === "newsletter" ? "Subscribe" : s.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

function GridOverlay() {
    return (
        <div className="gr-overlay" aria-hidden="true">
            <div className="gr-wrap gr-row">
                {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} />
                ))}
            </div>
        </div>
    );
}

function Hero() {
    return (
        <section className="gr-hero" id="top" aria-labelledby="hero-title">
            <div className="gr-wrap">
                <ul className="gr-row gr-meta">
                    <li>Technology company</li>
                    <li>Now building</li>
                    <li>Shipping when it’s ready, not before</li>
                    <li>Index 01–07</li>
                </ul>
                <div className="gr-row gr-hero-main">
                    <h1 className="gr-title" id="hero-title">
                        {SITE.tagline}
                    </h1>
                    <span className="gr-square" aria-hidden="true" />
                </div>
                <div className="gr-row gr-hero-foot">
                    <p className="gr-lead">{SITE.summary}</p>
                    <div className="gr-hero-side">
                        <p>
                            We take the craft seriously and still have fun doing it. What we’re
                            building is almost ready to meet you.
                        </p>
                        <div className="gr-ctas">
                            <a className="gr-btn" href="#newsletter">
                                Hear when we launch
                                <Icon node={ArrowRight} size={18} />
                            </a>
                            <a className="gr-btn gr-btn-line" href="#what-we-do">
                                What we do
                                <Icon node={ArrowDown} size={18} />
                            </a>
                        </div>
                    </div>
                </div>
                <ul className="gr-row gr-facts" aria-label="Beamcove in numbers">
                    {FACTS.map((f) => (
                        <li key={f.label}>
                            <span className="gr-fact-n">{f.n}</span>
                            <span className="gr-fact-label">{f.label}</span>
                            <span className="gr-fact-note">{f.note}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function WhatWeDo() {
    return (
        <Section
            id="what-we-do"
            title="What we do"
            dek="Three directions. Different problems, same care."
        >
            <ol className="gr-row gr-kinds">
                {KINDS.map((kind, i) => (
                    <li
                        key={kind.title}
                        className="gr-kind"
                        data-reveal
                        style={{ "--i": i } as CSSProperties}
                    >
                        <Plate art={KIND_ART[i] ?? KIND_ART[0]!} />
                        <span className="gr-kind-n" aria-hidden="true">
                            1.{i + 1}
                        </span>
                        <h3>{kind.title}</h3>
                        <p>{kind.body}</p>
                    </li>
                ))}
            </ol>
            <p className="gr-more">
                <a href={ROUTES.projects}>
                    Projects <Icon node={ArrowUpRight} />
                </a>
            </p>
        </Section>
    );
}

function About() {
    const text = STORY[0] ?? "";
    const at = text.indexOf(STORY_MARK);
    return (
        <Section id="about" title="About" dek="It started with curiosity.">
            <div className="gr-row gr-story">
                <Plate art={ABOUT_ART} />
                <div className="gr-story-text" data-reveal>
                    <p className="gr-statement">
                        {at < 0 ? (
                            text
                        ) : (
                            <>
                                {text.slice(0, at)}
                                <mark>{STORY_MARK}</mark>
                                {text.slice(at + STORY_MARK.length)}
                            </>
                        )}
                    </p>
                    {STORY.slice(1).map((p) => (
                        <p key={p}>{p}</p>
                    ))}
                </div>
            </div>
            <dl className="gr-row gr-aims">
                <div data-reveal>
                    <dt>
                        <span className="gr-index">2.1</span> Mission
                    </dt>
                    <dd>{MISSION}</dd>
                </div>
                <div data-reveal style={{ "--i": 1 } as CSSProperties}>
                    <dt>
                        <span className="gr-index">2.2</span> Vision
                    </dt>
                    <dd>{VISION}</dd>
                </div>
            </dl>
            <p className="gr-more">
                <a href={ROUTES.about}>
                    More about Beamcove <Icon node={ArrowUpRight} />
                </a>
            </p>
        </Section>
    );
}

function Values() {
    return (
        <Section id="values" title="Values" dek="Three words we check our work against.">
            <dl className="gr-values">
                {VALUES.map((v, i) => (
                    <div key={v.id} className="gr-row gr-value" data-reveal>
                        <dt>
                            <span className="gr-index">3.{i + 1}</span>
                            <span className="gr-term">{v.title}</span>
                        </dt>
                        <dd>{v.body}</dd>
                    </div>
                ))}
            </dl>
        </Section>
    );
}

function Updates() {
    return (
        <Section id="updates" title="Updates" dek="The log, newest first.">
            <table className="gr-table" data-reveal>
                <caption className="visually-hidden">Recent updates</caption>
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Tag</th>
                        <th scope="col">Entry</th>
                    </tr>
                </thead>
                <tbody>
                    {LOGBOOK.map((entry) => (
                        <tr key={entry.title}>
                            <td className="gr-td-date">
                                {entry.date ? (
                                    <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                                ) : (
                                    "In progress"
                                )}
                            </td>
                            <td className="gr-td-tag">
                                <span className="gr-tag">{entry.tag}</span>
                            </td>
                            <td className="gr-td-entry">
                                <strong>{entry.title}</strong>
                                <span>{entry.body}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="gr-more">
                <a href={ROUTES.updates}>
                    All updates <Icon node={ArrowUpRight} />
                </a>
            </p>
        </Section>
    );
}

function Faq() {
    return (
        <Section id="faq" title="FAQ" dek="Asked and answered.">
            <ol className="gr-row gr-faq">
                {QUESTIONS.map((item, i) => (
                    <li key={item.q} data-reveal style={{ "--i": i % 2 } as CSSProperties}>
                        <span className="gr-index" aria-hidden="true">
                            5.{i + 1}
                        </span>
                        <div>
                            <h3>{item.q}</h3>
                            <p>{linkPrivacy(item.a)}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </Section>
    );
}

function Newsletter() {
    const { email, setEmail, error, done, submitting, submit } = useSubscribe();
    return (
        <Section id="newsletter" title="Newsletter" dek="Hear when we launch.">
            <div className="gr-row gr-signup">
                <p className="gr-signup-text" data-reveal>
                    A friendly email whenever there’s something worth telling you. Unsubscribe any
                    time, no hard feelings.
                </p>
                <div className="gr-signup-form" aria-live="polite">
                    {done ? (
                        <div className="gr-done">
                            <p className="gr-done-title">You’re subscribed.</p>
                            <p>We’ll write when there’s news.</p>
                        </div>
                    ) : (
                        <form onSubmit={submit} noValidate>
                            <label className="gr-label" htmlFor="gr-email">
                                Email address
                            </label>
                            <div className="gr-input-row">
                                <input
                                    id="gr-email"
                                    className="gr-input"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    disabled={submitting}
                                    aria-invalid={error ? true : undefined}
                                    aria-describedby={error ? "gr-email-error" : "gr-email-hint"}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="gr-btn gr-btn-red"
                                    disabled={submitting}
                                >
                                    {submitting ? "Subscribing…" : "Subscribe"}
                                </button>
                            </div>
                            {error ? (
                                <p className="gr-error" id="gr-email-error">
                                    {error}
                                </p>
                            ) : (
                                <p className="gr-hint" id="gr-email-hint">
                                    We only use it to send the newsletter.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </Section>
    );
}

function Contact() {
    return (
        <Section id="contact" title="Contact" dek="Say hello. A real person reads every message.">
            <div className="gr-row gr-contact">
                <div className="gr-contact-mail" data-reveal>
                    <p className="gr-index">7.1 Email</p>
                    <a className="gr-email" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                    </a>
                    <p>Best for anything that needs a proper reply.</p>
                </div>
                <address className="gr-address" data-reveal style={{ "--i": 1 } as CSSProperties}>
                    <span className="gr-index">7.2 Company</span>
                    <span>{SITE.legalName}</span>
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                    <a href={ROUTES.contact}>beamcove.com{ROUTES.contact}</a>
                </address>
                <div className="gr-socials" data-reveal style={{ "--i": 2 } as CSSProperties}>
                    <p className="gr-index">7.3 Elsewhere</p>
                    <ul>
                        {SOCIALS.map((s) => (
                            <li key={s.name}>
                                <a href={s.href} rel="noopener noreferrer">
                                    <BrandIcon name={s.name} />
                                    <span>{s.label}</span>
                                    <span className="gr-handle">{s.handle}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <Plate art={CONTACT_ART} />
            </div>
        </Section>
    );
}

function Footer() {
    return (
        <footer className="gr-footer">
            <div className="gr-wrap">
                <div className="gr-row gr-foot-top">
                    <div className="gr-foot-brand">
                        <a className="gr-wordmark" href="#top">
                            <span className="gr-mark" aria-hidden="true" />
                            {SITE.name}
                        </a>
                        <p>{SITE.summary}</p>
                    </div>
                    <nav className="gr-foot-nav" aria-label="Footer">
                        {FOOTER_GROUPS.map((group) => (
                            <div key={group.title}>
                                <p className="gr-foot-title">{group.title}</p>
                                <ul>
                                    {group.links.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href}>{link.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
                <div className="gr-row gr-foot-base">
                    <p>
                        © {new Date().getFullYear()} {SITE.legalName}
                    </p>
                    <p className="gr-foot-set">Set on a 12-column grid and an 8px baseline.</p>
                    <a href="#top">
                        Back to top <Icon node={ArrowUp} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

/** Lab version of the site: Grid, in the International Typographic Style. */
export function GridSite() {
    const [showGrid, setShowGrid] = useState(false);
    useReveal();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
            if (isField(e.target)) return;
            setShowGrid((v) => !v);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="grid">
            <a className="gr-skip" href="#main">
                Skip to content
            </a>
            <Header showGrid={showGrid} onGrid={() => setShowGrid((v) => !v)} />
            <main id="main">
                <Hero />
                <WhatWeDo />
                <About />
                <Values />
                <Updates />
                <Faq />
                <Newsletter />
                <Contact />
            </main>
            <Footer />
            {showGrid ? <GridOverlay /> : null}
            <LabBar current="grid" />
        </div>
    );
}
