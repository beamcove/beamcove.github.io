import "./poster.css";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, Scissors, X } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { Icon } from "@/app/components/icon";
import { useSubscribe } from "@/app/utils/subscribe";
import { QUESTIONS } from "@/content/faq";
import { KINDS } from "@/content/fleet";
import { LOGBOOK } from "@/content/logbook";
import { formatDate, ROUTES, SITE, SOCIALS } from "@/content/site";
import { MISSION, STORY, STORY_MARK, VALUES, VISION } from "@/content/values";
import { Badge, Button, Callout, motionAllowed, TextField, type InkSlot } from "@/design-system";
import { LabBar } from "@/lab/lab-bar";
import { Halftone } from "@/lab/poster/halftone";

const SECTIONS = [
    { id: "what-we-do", label: "What we do" },
    { id: "about", label: "About" },
    { id: "values", label: "Values" },
    { id: "updates", label: "Updates" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
];

const STUDIO_LINES = [
    "Now building",
    "The shipyard is open",
    "Shipping when it’s ready, not before",
    "Built with craft and a little fun",
    "Dispatched from the cove",
    "Lighthouse not to scale",
];

const FOOTER_LINKS = [
    { href: ROUTES.about, label: "About" },
    { href: ROUTES.projects, label: "Projects" },
    { href: ROUTES.updates, label: "Updates" },
    { href: ROUTES.contact, label: "Contact" },
    { href: ROUTES.brand, label: "Brand kit" },
    { href: ROUTES.design, label: "Design system" },
    { href: ROUTES.privacy, label: "Privacy" },
    { href: ROUTES.terms, label: "Terms" },
];

/** Glyph inks per halftone, kept stable so the canvases don't redraw on render. */
const TONE: Record<string, InkSlot[]> = { a: ["a"], b: ["b"], c: ["c"], e: ["e"] };

/** Each sheet of the triptych prints in its own ink pair: a halftone numeral and a block. */
const SHEETS: { n: string; tone: InkSlot; block: InkSlot; seed: number }[] = [
    { n: "1", tone: "a", block: "c", seed: 11 },
    { n: "2", tone: "b", block: "d", seed: 23 },
    { n: "3", tone: "e", block: "a", seed: 37 },
];

const STAMPS: InkSlot[] = ["b", "a", "c"];

interface Block {
    ink: InkSlot;
    x: number;
    y: number;
    w: number;
    h: number;
    /** Parallax depth in px. */
    d?: number;
}

/** Flat ink blocks (positions in % of the parent) that overprint where they cross. */
function Inks({ blocks }: { blocks: Block[] }) {
    return blocks.map((b, i) => (
        <span
            key={i}
            className={`pst-ink pst-wipe pst-k-${b.ink}`}
            aria-hidden="true"
            style={
                {
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.w}%`,
                    height: `${b.h}%`,
                    "--d": b.d ?? 6,
                    "--pass": i,
                } as CSSProperties
            }
        />
    ));
}

/** The poster's margin: its number and a line of type set sideways. */
function Poster({
    id,
    n,
    rail,
    className,
    children,
}: {
    id: string;
    n: number;
    rail: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            id={id}
            className={["pst-poster", className].filter(Boolean).join(" ")}
            aria-labelledby={`${id}-title`}
        >
            <div className="pst-rail" aria-hidden="true">
                <div className="pst-rail-in">
                    <span className="pst-rail-n">{String(n).padStart(2, "0")}</span>
                    <span className="pst-rail-label">{rail}</span>
                </div>
            </div>
            <div className="pst-body">{children}</div>
        </section>
    );
}

function Head({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
    return (
        <div className="pst-head">
            <h2 id={`${id}-title`} className="pst-h2 pst-wipe">
                {title}
            </h2>
            {children && <p className="pst-sub">{children}</p>}
        </div>
    );
}

function Header() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="pst-header">
            <div className="pst-header-in">
                <a className="pst-word" href="#top">
                    <span className="pst-word-mark" aria-hidden="true">
                        <span />
                        <span />
                    </span>
                    {SITE.name}
                </a>
                <nav
                    className={open ? "pst-nav is-open" : "pst-nav"}
                    id="pst-nav"
                    aria-label="Sections"
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
                </nav>
                <Button size="sm" variant="secondary" href="#newsletter" className="pst-cta">
                    Subscribe
                </Button>
                <button
                    type="button"
                    className="pst-menu"
                    aria-expanded={open}
                    aria-controls="pst-nav"
                    onClick={() => setOpen((v) => !v)}
                >
                    <Icon node={open ? X : Menu} size={18} />
                    <span>{open ? "Close" : "Menu"}</span>
                </button>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section id="top" className="pst-poster pst-hero" aria-labelledby="top-title">
            <div className="pst-rail" aria-hidden="true">
                <div className="pst-rail-in">
                    <span className="pst-rail-n">01</span>
                    <span className="pst-rail-label">Hello from Beamcove</span>
                </div>
            </div>
            <div className="pst-body pst-hero-body">
                <p className="pst-kicker">A technology company</p>
                <h1 id="top-title" className="pst-h1">
                    {SITE.tagline}
                </h1>
                <div className="pst-hero-copy">
                    <p className="pst-lead">
                        {SITE.summary} We take the craft seriously and still have fun doing it.
                    </p>
                    <div className="pst-actions">
                        <Button size="lg" href="#newsletter" iconRight={<Icon node={ArrowRight} />}>
                            Hear when we launch
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            href="#what-we-do"
                            iconRight={<Icon node={ArrowDown} />}
                        >
                            What we do
                        </Button>
                    </div>
                </div>
                <div className="pst-hero-art">
                    <Inks
                        blocks={[
                            { ink: "b", x: 4, y: 0, w: 46, h: 46, d: 12 },
                            { ink: "e", x: 0, y: 60, w: 36, h: 15, d: 5 },
                        ]}
                    />
                    <Halftone
                        shape="circle"
                        inks={TONE.a!}
                        seed={7}
                        cell={16}
                        className="pst-wipe pst-hero-tone"
                    />
                    <p className="pst-sticker">
                        <span>Now</span> building
                    </p>
                </div>
            </div>
            <div className="pst-marquee">
                <div className="pst-marquee-track">
                    {[0, 1].map((copy) => (
                        <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
                            {STUDIO_LINES.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhatWeDo() {
    return (
        <Poster id="what-we-do" n={2} rail="What we do, in three sheets">
            <Head id="what-we-do" title="What we do">
                Three directions. Different problems, same care.
            </Head>
            <ol className="pst-trip">
                {KINDS.map((kind, i) => {
                    const sheet = SHEETS[i] ?? SHEETS[0]!;
                    return (
                        <li key={kind.title} className="pst-sheet">
                            <div className="pst-sheet-art">
                                <Halftone
                                    shape={sheet.n}
                                    inks={TONE[sheet.tone]!}
                                    seed={sheet.seed}
                                    cell={12}
                                    className="pst-wipe pst-sheet-tone"
                                />
                                <Inks
                                    blocks={[
                                        { ink: sheet.block, x: 52, y: 34, w: 34, h: 48, d: 8 },
                                    ]}
                                />
                            </div>
                            <div className="pst-sheet-copy">
                                <h3>{kind.title}</h3>
                                <p>{kind.body}</p>
                            </div>
                            <p className="pst-sheet-foot" aria-hidden="true">
                                <span>Sheet {i + 1} of 3</span>
                                <span className="pst-swatches">
                                    <span className={`pst-k-${sheet.tone}`} />
                                    <span className={`pst-k-${sheet.block}`} />
                                </span>
                            </p>
                        </li>
                    );
                })}
            </ol>
            <a className="pst-more" href={ROUTES.projects}>
                See our projects <Icon node={ArrowUpRight} />
            </a>
        </Poster>
    );
}

function About() {
    const [first = "", ...rest] = STORY;
    const at = first.indexOf(STORY_MARK);
    return (
        <Poster id="about" n={3} rail="About Beamcove, mission and vision">
            <div className="pst-about">
                <div className="pst-story">
                    <Head id="about" title="About Beamcove" />
                    <p className="pst-story-lead">
                        {at < 0 ? (
                            first
                        ) : (
                            <>
                                {first.slice(0, at)}
                                <em className="pst-story-mark">{STORY_MARK}</em>
                                {first.slice(at + STORY_MARK.length)}
                            </>
                        )}
                    </p>
                    {rest.map((p) => (
                        <p key={p} className="pst-text">
                            {p}
                        </p>
                    ))}
                </div>
                <div className="pst-about-art">
                    <Halftone
                        shape="?"
                        inks={TONE.c!}
                        seed={53}
                        cell={12}
                        className="pst-wipe pst-about-tone"
                    />
                    <Inks blocks={[{ ink: "e", x: 44, y: 58, w: 50, h: 26, d: 9 }]} />
                </div>
            </div>
            <div className="pst-split">
                <div className="pst-split-col">
                    <h3>Our mission</h3>
                    <p>{MISSION}</p>
                </div>
                <div className="pst-split-ink">
                    <Inks
                        blocks={[
                            { ink: "a", x: 0, y: 0, w: 64, h: 68, d: 6 },
                            { ink: "b", x: 36, y: 34, w: 64, h: 66, d: -6 },
                        ]}
                    />
                </div>
                <div className="pst-split-col">
                    <h3>Our vision</h3>
                    <p>{VISION}</p>
                    <p className="pst-note">
                        That’s the whole plan. The rest is details, and we like details.
                    </p>
                </div>
            </div>
            <a className="pst-more" href={ROUTES.about}>
                More about Beamcove <Icon node={ArrowUpRight} />
            </a>
        </Poster>
    );
}

function Values() {
    return (
        <Poster id="values" n={4} rail="Values, three of them">
            <Head id="values" title="Values">
                Three rules we keep.
            </Head>
            <ul className="pst-stamps">
                {VALUES.map((v, i) => (
                    <li
                        key={v.id}
                        className={`pst-stamp pst-k-${STAMPS[i] ?? "d"}`}
                        style={{ "--i": i } as CSSProperties}
                    >
                        <span className="pst-stamp-top" aria-hidden="true">
                            <span>No. {i + 1}</span>
                            <span className="pst-seal" />
                        </span>
                        <h3>{v.title}</h3>
                        <p>{v.body}</p>
                    </li>
                ))}
            </ul>
        </Poster>
    );
}

function Updates() {
    return (
        <Poster id="updates" n={5} rail="Updates, posted newest first" className="pst-updates">
            <h2 id="updates-title" className="pst-h2 pst-vert pst-wipe">
                Updates
            </h2>
            <div className="pst-flyer-wrap">
                <div className="pst-flyer">
                    <span className="pst-tape pst-k-e" aria-hidden="true" />
                    <span className="pst-tape pst-k-a" aria-hidden="true" />
                    <p className="pst-flyer-top">
                        <span>Newest first</span>
                        <span>
                            {LOGBOOK.length === 1 ? "1 entry" : `${LOGBOOK.length} entries`}
                        </span>
                    </p>
                    <ol className="pst-log">
                        {LOGBOOK.map((entry) => (
                            <li key={entry.title}>
                                <p className="pst-log-date">
                                    {entry.date ? (
                                        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                                    ) : (
                                        "Now"
                                    )}
                                </p>
                                <div>
                                    <Badge>{entry.tag}</Badge>
                                    <h3>{entry.title}</h3>
                                    <p>{entry.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <a className="pst-more" href={ROUTES.updates}>
                        All updates <Icon node={ArrowUpRight} />
                    </a>
                </div>
                <p className="pst-aside">
                    Nothing has launched yet, so the list starts with this website. More soon,
                    pinned right here.
                </p>
            </div>
        </Poster>
    );
}

function Faq() {
    return (
        <Poster id="faq" n={6} rail="Frequently asked questions" className="pst-faq-poster">
            <div className="pst-faq-head">
                <Head id="faq" title="Questions">
                    Asked and answered.
                </Head>
                <div className="pst-faq-art">
                    <Inks
                        blocks={[
                            { ink: "c", x: 10, y: 0, w: 52, h: 74, d: 8 },
                            { ink: "a", x: 46, y: 46, w: 54, h: 54, d: -5 },
                        ]}
                    />
                </div>
            </div>
            <ol className="pst-faq">
                {QUESTIONS.map((item, i) => (
                    <li key={item.q}>
                        <span className="pst-faq-n" aria-hidden="true">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                            <h3>{item.q}</h3>
                            <p>{item.a}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </Poster>
    );
}

function Newsletter() {
    const { email, setEmail, error, done, submitting, submit } = useSubscribe();
    return (
        <Poster id="newsletter" n={7} rail="Newsletter, tear along the line">
            <div className="pst-tear">
                <span className="pst-cut" aria-hidden="true">
                    <Icon node={Scissors} size={20} />
                </span>
                <div className="pst-tear-main">
                    <div>
                        <Head id="newsletter" title="Newsletter">
                            Hear when we launch.
                        </Head>
                        <p className="pst-text">
                            A friendly email whenever there’s something worth telling you.
                            Unsubscribe any time, no hard feelings.
                        </p>
                    </div>
                    {done ? (
                        <Callout tone="success" title="You’re subscribed." className="pst-done">
                            We’ll write when there’s news.
                        </Callout>
                    ) : (
                        <form className="pst-form" onSubmit={submit} noValidate>
                            <TextField
                                label="Email address"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                error={error || undefined}
                                hint="We only use it to send the newsletter."
                                disabled={submitting}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button type="submit" size="lg" disabled={submitting}>
                                {submitting ? "Subscribing…" : "Subscribe"}
                            </Button>
                        </form>
                    )}
                </div>
                <div className="pst-tabs" aria-hidden="true">
                    {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} className={i === 3 || i === 7 ? "is-torn" : undefined}>
                            beamcove.com
                        </span>
                    ))}
                </div>
            </div>
        </Poster>
    );
}

function Contact() {
    const [user, domain] = SITE.email.split("@");
    return (
        <Poster id="contact" n={8} rail="Contact, write any time" className="pst-contact">
            <div className="pst-contact-top">
                <div>
                    <Head id="contact" title="Contact">
                        Say hello. Questions, press or anything else: write any time.
                    </Head>
                    <ul className="pst-socials">
                        {SOCIALS.map((s) => (
                            <li key={s.name}>
                                <a href={s.href} rel="me">
                                    <BrandIcon name={s.name} />
                                    <span>{s.label}</span>
                                    <span className="pst-handle">{s.handle}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="pst-contact-art">
                    <Halftone
                        shape="@"
                        inks={TONE.a!}
                        seed={79}
                        cell={12}
                        className="pst-wipe pst-contact-tone"
                    />
                    <Inks blocks={[{ ink: "b", x: 0, y: 46, w: 42, h: 40, d: 10 }]} />
                </div>
            </div>
            <a className="pst-mail" href={`mailto:${SITE.email}`}>
                {user}@<wbr />
                {domain}
            </a>
        </Poster>
    );
}

function Footer() {
    return (
        <footer className="pst-foot">
            <p className="pst-foot-word" aria-hidden="true">
                {SITE.name}
            </p>
            <nav aria-label="Site pages">
                <ul className="pst-foot-links">
                    {FOOTER_LINKS.map((link) => (
                        <li key={link.href}>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            <p className="pst-legal">
                © {new Date().getFullYear()} {SITE.legalName}. Printed on screen, in five inks.
                <span className="pst-swatches" aria-hidden="true">
                    {(["a", "b", "c", "d", "e"] as const).map((k) => (
                        <span key={k} className={`pst-k-${k}`} />
                    ))}
                </span>
            </p>
        </footer>
    );
}

/** Lab version of the site: Poster. A series of screen prints, one per section. */
export function PosterSite() {
    const ref = useRef<HTMLDivElement>(null);

    // each poster prints (wipes on) as its top edge comes up the screen
    useEffect(() => {
        const root = ref.current;
        if (!root || !motionAllowed() || typeof IntersectionObserver === "undefined") return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -15% 0px" },
        );
        root.querySelectorAll(".pst-poster").forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    // ink blocks drift a few px with the pointer, like a loose registration
    useEffect(() => {
        const root = ref.current;
        if (!root || !motionAllowed() || typeof window.matchMedia !== "function") return;
        if (!window.matchMedia("(hover: hover)").matches) return;
        let frame = 0;
        let x = 0;
        let y = 0;
        const apply = () => {
            frame = 0;
            root.style.setProperty("--px", x.toFixed(3));
            root.style.setProperty("--py", y.toFixed(3));
        };
        const onMove = (e: PointerEvent) => {
            x = (e.clientX / window.innerWidth) * 2 - 1;
            y = (e.clientY / window.innerHeight) * 2 - 1;
            if (!frame) frame = requestAnimationFrame(apply);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onMove);
        };
    }, []);

    return (
        <div className="poster" ref={ref}>
            <a className="pst-skip" href="#main">
                Skip to content
            </a>
            <Header />
            <main id="main" className="pst-page">
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
            <LabBar current="poster" />
        </div>
    );
}
