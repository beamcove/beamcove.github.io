import "./bento.css";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Mail, Menu, Plus, X } from "lucide";

import { AsciiWord } from "@/app/components/ascii-word";
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
import {
    Badge,
    Button,
    Callout,
    GlyphField,
    TextField,
    type GlyphComposition,
} from "@/design-system";
import { LabBar } from "@/lab/lab-bar";

/*
 * Glyph art for the tiles. Every tile prints in its own pair of inks (no pair
 * repeats on the page); blocks only use those inks, cross a little, never nest.
 * Kinds, vision and the newsletter reuse the site's ART.
 */
const HERO: GlyphComposition = {
    seed: 211,
    inks: ["a", "c", "d"],
    ramp: "signal",
    density: 0.5,
    scale: 5,
    blocks: [
        { x: 0.56, y: 0.16, w: 0.14, h: 0.5, ink: "a" },
        { x: 0.66, y: 0.5, w: 0.2, h: 0.3, ink: "c" },
        { x: 0.16, y: 0.24, w: 0.08, h: 0.36, ink: "d" },
    ],
};
const VALUE_ART: Record<string, GlyphComposition> = {
    adventure: {
        seed: 307,
        inks: ["c", "e"],
        ramp: "marks",
        density: 0.5,
        blocks: [
            { x: 0.62, y: 0, w: 0.16, h: 0.6, ink: "e" },
            { x: 0.74, y: 0.5, w: 0.26, h: 0.5, ink: "c" },
        ],
    },
    integrity: {
        seed: 311,
        inks: ["a", "d"],
        ramp: "grid",
        density: 0.5,
        blocks: [
            { x: 0.7, y: 0, w: 0.3, h: 0.5, ink: "d" },
            { x: 0.62, y: 0.4, w: 0.14, h: 0.6, ink: "a" },
        ],
    },
    balance: {
        seed: 313,
        inks: ["b", "c"],
        ramp: "blocks",
        density: 0.5,
        blocks: [
            { x: 0.56, y: 0.3, w: 0.2, h: 0.7, ink: "b" },
            { x: 0.72, y: 0, w: 0.2, h: 0.4, ink: "c" },
        ],
    },
};
const UPDATES_ART: GlyphComposition = {
    seed: 331,
    inks: ["c", "d"],
    ramp: "signal",
    density: 0.5,
    blocks: [
        { x: 0, y: 0.6, w: 0.36, h: 0.4, ink: "d" },
        { x: 0.3, y: 0, w: 0.4, h: 0.66, ink: "c" },
    ],
};

const NAV = [
    { href: "#what-we-do", label: "What we do" },
    { href: "#values", label: "Values" },
    { href: "#updates", label: "Updates" },
    { href: "#about", label: "About" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
];

const STATS = [
    { n: "3", label: "Values", note: "Adventure, integrity, balance." },
    { n: "3", label: "Directions", note: "Work, everyday life and play." },
    { n: "0", label: "Tracking cookies", note: "No analytics, either." },
    { n: "1", label: "Newsletter", note: "Only when there’s news." },
];

const FOOTER = [
    {
        title: "Company",
        links: [
            { href: ROUTES.about, label: "About" },
            { href: ROUTES.projects, label: "Projects" },
            { href: ROUTES.updates, label: "Updates" },
            { href: ROUTES.contact, label: "Contact" },
        ],
    },
    {
        title: "Resources",
        links: [
            { href: ROUTES.brand, label: "Brand kit" },
            { href: ROUTES.design, label: "Design system" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: ROUTES.privacy, label: "Privacy" },
            { href: ROUTES.terms, label: "Terms" },
        ],
    },
];

/** Lab version of the site: Bento. A product-launch page built from tiles. */
export function BentoSite() {
    useReveal();
    return (
        <div className="bento">
            <a className="bento-skip" href="#main">
                Skip to content
            </a>
            <Header />
            <main id="main">
                <Hero />
                <Group
                    id="what-we-do"
                    index="01"
                    title="What we do"
                    lead="Three directions. Different problems, same care."
                    className="bento-g1"
                >
                    {KINDS.map((kind, i) => (
                        <Tile
                            key={kind.art}
                            i={i}
                            area={kind.art}
                            label={`0${i + 1}`}
                            kicker="Direction"
                            title={kind.title}
                            art={ART[kind.art]}
                            big={i === 0}
                        >
                            {kind.body}
                        </Tile>
                    ))}
                </Group>
                <Group
                    id="values"
                    index="02"
                    title="What we stand for"
                    lead="A mission, a vision and three values. Short on purpose."
                    className="bento-g2"
                >
                    <article
                        className="tile tile-dark tile-mission"
                        style={{ "--i": 0 } as CSSProperties}
                        data-reveal
                    >
                        <p className="tile-kicker">Our mission</p>
                        <h3 className="tile-statement">{MISSION}</h3>
                        <p className="tile-foot">Everything we make starts here.</p>
                    </article>
                    <article
                        className="tile tile-vision tile-split"
                        style={{ "--i": 2 } as CSSProperties}
                        data-reveal
                    >
                        <div className="tile-copy">
                            <p className="tile-kicker">Our vision</p>
                            <h3 className="tile-statement">{VISION}</h3>
                        </div>
                        <TileArt art={ART.vision} />
                    </article>
                    {VALUES.map((value, i) => (
                        <Tile
                            key={value.id}
                            i={i + 1}
                            area={value.id}
                            label={`V${i + 1}`}
                            kicker="Value"
                            title={value.title}
                            art={VALUE_ART[value.id]}
                            split={value.id === "balance"}
                        >
                            {value.body}
                        </Tile>
                    ))}
                    <Stats />
                </Group>
                <Group
                    id="keep-in-touch"
                    index="03"
                    title="Keep in touch"
                    lead="News when there’s news, and a real inbox when you want to talk."
                    className="bento-g3"
                >
                    <Updates />
                    <Newsletter />
                    <Contact />
                    <article
                        className="tile tile-brand"
                        style={{ "--i": 3 } as CSSProperties}
                        data-reveal
                    >
                        <div className="tile-copy">
                            <p className="tile-kicker">
                                <span className="bento-key">Kit</span>
                                Brand
                            </p>
                            <h3 className="tile-title">Writing about us?</h3>
                            <p className="tile-body">
                                Please do. The brand kit has everything you need.
                            </p>
                            <a className="tile-link" href={ROUTES.brand}>
                                Open the brand kit <Icon node={ArrowRight} />
                            </a>
                        </div>
                    </article>
                </Group>
                <Story />
                <Faq />
            </main>
            <Footer />
            <LabBar current="bento" />
        </div>
    );
}

function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const close = () => setOpen(false);
    return (
        <header
            className={`bento-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
        >
            <div className="bento-wrap bento-header-row">
                <a className="bento-mark" href="#top">
                    <span className="bento-mark-dot" aria-hidden="true" />
                    {SITE.name}
                </a>
                <nav className="bento-nav" aria-label="Main">
                    <ul>
                        {NAV.map((link) => (
                            <li key={link.href}>
                                <a href={link.href}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="bento-header-end">
                    <Button variant="secondary" size="sm" href="#newsletter">
                        Subscribe
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        iconOnly
                        className="bento-menu-toggle"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls="bento-menu"
                        onClick={() => setOpen((v) => !v)}
                    >
                        <Icon node={open ? X : Menu} />
                    </Button>
                </div>
            </div>
            <nav id="bento-menu" className="bento-menu" aria-label="Menu" hidden={!open}>
                <ul className="bento-wrap">
                    {NAV.map((link, i) => (
                        <li key={link.href}>
                            <a href={link.href} onClick={close}>
                                <span className="bento-menu-n">0{i + 1}</span>
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#newsletter" onClick={close}>
                            <span className="bento-menu-n">07</span>
                            Subscribe
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

function Hero() {
    return (
        <section className="bento-hero" id="top" aria-labelledby="hero-title">
            <div className="bento-wrap">
                <p className="bento-pill">
                    <span className="bento-pill-dot" aria-hidden="true" />
                    Technology company <span aria-hidden="true">·</span> Now building
                </p>
                <h1 className="bento-h1" id="hero-title">
                    {SITE.tagline}
                </h1>
                <p className="bento-lead">
                    {SITE.summary} We take the craft seriously and still have fun doing it.
                </p>
                <div className="bento-actions">
                    <Button size="lg" href="#newsletter" iconRight={<Icon node={ArrowRight} />}>
                        Get the newsletter
                    </Button>
                    <Button size="lg" variant="secondary" href="#what-we-do">
                        What we do
                    </Button>
                </div>
                <figure className="bento-shot">
                    <div className="bento-shot-frame bc-glyphs">
                        <GlyphField composition={HERO} beam quiet={false} />
                    </div>
                    <figcaption className="bento-shot-caption">
                        <span>
                            <span className="bento-key">Fig. 1</span> The beam, drawn in glyphs.
                        </span>
                        <span className="bento-ribs" aria-hidden="true" />
                        <span className="bento-shot-hint">Point at it. It looks back.</span>
                    </figcaption>
                </figure>
            </div>
        </section>
    );
}

function Group({
    id,
    index,
    title,
    lead,
    className,
    children,
}: {
    id: string;
    index: string;
    title: string;
    lead: string;
    className: string;
    children: ReactNode;
}) {
    return (
        <section className="bento-group" id={id} aria-labelledby={`${id}-title`}>
            <div className="bento-wrap">
                <div className="bento-group-head">
                    <span className="bento-key">{index}</span>
                    <h2 className="bento-h2" id={`${id}-title`}>
                        {title}
                    </h2>
                    <p>{lead}</p>
                </div>
                <div className={`bento-grid ${className}`}>{children}</div>
            </div>
        </section>
    );
}

function TileArt({ art }: { art: GlyphComposition }) {
    return (
        <div className="tile-art bc-glyphs">
            <GlyphField composition={art} quiet={false} />
        </div>
    );
}

function Tile({
    i,
    area,
    label,
    kicker,
    title,
    art,
    split,
    big,
    children,
}: {
    i: number;
    area: string;
    label: string;
    kicker: string;
    title: string;
    art?: GlyphComposition;
    split?: boolean;
    big?: boolean;
    children: ReactNode;
}) {
    const classes = ["tile", `tile-${area}`, split && "tile-split", big && "tile-big"];
    return (
        <article
            className={classes.filter(Boolean).join(" ")}
            style={{ "--i": i } as CSSProperties}
            data-reveal
        >
            <div className="tile-copy">
                <p className="tile-kicker">
                    <span className="bento-key">{label}</span>
                    {kicker}
                </p>
                <h3 className="tile-title">{title}</h3>
                <p className="tile-body">{children}</p>
            </div>
            {art && <TileArt art={art} />}
        </article>
    );
}

function Stats() {
    return (
        <article className="tile tile-stats" style={{ "--i": 4 } as CSSProperties} data-reveal>
            <h3 className="tile-kicker">By the numbers</h3>
            <dl className="stats">
                {STATS.map((stat) => (
                    <div key={stat.label} className="stat">
                        <dt>{stat.label}</dt>
                        <dd className="stat-n">{stat.n}</dd>
                        <dd className="stat-note">{stat.note}</dd>
                    </div>
                ))}
            </dl>
        </article>
    );
}

function Updates() {
    return (
        <article
            className="tile tile-updates"
            id="updates"
            style={{ "--i": 0 } as CSSProperties}
            data-reveal
        >
            <div className="tile-copy">
                <p className="tile-kicker">
                    <span className="bento-key">Log</span>
                    Updates
                </p>
                <h3 className="tile-title">Latest from the cove</h3>
                <ol className="log">
                    {LOGBOOK.map((entry) => (
                        <li key={entry.title}>
                            <p className="log-meta">
                                {entry.date ? (
                                    <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                                ) : (
                                    <span>In progress</span>
                                )}
                                <Badge tone="beam">{entry.tag}</Badge>
                            </p>
                            <p className="log-title">{entry.title}</p>
                            <p className="tile-body">{entry.body}</p>
                        </li>
                    ))}
                </ol>
                <a className="tile-link" href={ROUTES.updates}>
                    All updates <Icon node={ArrowRight} />
                </a>
            </div>
            <TileArt art={UPDATES_ART} />
        </article>
    );
}

function Newsletter() {
    const { email, setEmail, error, done, submitting, submit } = useSubscribe();
    return (
        <article
            className="tile tile-news"
            id="newsletter"
            aria-labelledby="newsletter-title"
            style={{ "--i": 1 } as CSSProperties}
            data-reveal
        >
            <TileArt art={ART.newsletter} />
            <div className="tile-copy">
                <p className="tile-kicker">
                    <span className="bento-key">
                        <Icon node={Mail} size={12} />
                    </span>
                    Newsletter
                </p>
                <h3 className="tile-title" id="newsletter-title">
                    Hear when we launch.
                </h3>
                <p className="tile-body">
                    A friendly email whenever there’s something worth telling you. Unsubscribe any
                    time, no hard feelings.
                </p>
                {done ? (
                    <Callout tone="success" title="You’re subscribed." className="news-done">
                        We’ll write when there’s news.
                    </Callout>
                ) : (
                    <form className="news-form" onSubmit={submit} noValidate>
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
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Subscribing…" : "Subscribe"}
                        </Button>
                    </form>
                )}
            </div>
        </article>
    );
}

function Contact() {
    return (
        <article
            className="tile tile-contact"
            id="contact"
            style={{ "--i": 2 } as CSSProperties}
            data-reveal
        >
            <div className="tile-copy">
                <p className="tile-kicker">
                    <span className="bento-key">@</span>
                    Contact
                </p>
                <h3 className="tile-title">Say hello.</h3>
                <a className="contact-mail" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                </a>
            </div>
            <ul className="contact-socials">
                {SOCIALS.map((social) => (
                    <li key={social.name}>
                        <a href={social.href} rel="me">
                            <BrandIcon name={social.name} />
                            <span>
                                <span className="visually-hidden">{social.label}: </span>
                                {social.handle}
                            </span>
                            <Icon node={ArrowUpRight} size={14} />
                        </a>
                    </li>
                ))}
            </ul>
        </article>
    );
}

function Story() {
    const text = STORY[0] ?? "";
    const at = text.indexOf(STORY_MARK);
    return (
        <section className="bento-story" id="about" aria-labelledby="about-title">
            <div className="bento-wrap bento-column" data-reveal>
                <p className="bento-eyebrow">
                    <span className="bento-key">04</span> About
                </p>
                <h2 className="bento-h2" id="about-title">
                    It started with curiosity.
                </h2>
                <p className="story-lead">
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
                {STORY.slice(1).map((para) => (
                    <p key={para} className="story-p">
                        {para}
                    </p>
                ))}
                <a className="tile-link" href={ROUTES.about}>
                    More about Beamcove <Icon node={ArrowRight} />
                </a>
            </div>
        </section>
    );
}

/** The privacy answer names the policy's path; make it a link. */
function answer(text: string) {
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

function Faq() {
    return (
        <section className="bento-faq" id="faq" aria-labelledby="faq-title">
            <div className="bento-wrap bento-column">
                <p className="bento-eyebrow">
                    <span className="bento-key">05</span> FAQ
                </p>
                <h2 className="bento-h2" id="faq-title">
                    Asked and answered.
                </h2>
                <div className="faq">
                    {QUESTIONS.map((item, i) => (
                        <details key={item.q} className="faq-item" open={i === 0}>
                            <summary>
                                <span>{item.q}</span>
                                <span className="faq-icon" aria-hidden="true">
                                    <Icon node={Plus} />
                                </span>
                            </summary>
                            <p>{answer(item.a)}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bento-footer">
            <div className="bento-wrap">
                <AsciiWord text="Beamcove" className="bento-footer-word" seed={9} />
                <div className="bento-footer-grid">
                    <div className="bento-footer-about">
                        <a className="bento-mark" href="#top">
                            <span className="bento-mark-dot" aria-hidden="true" />
                            {SITE.name}
                        </a>
                        <p>{SITE.tagline}</p>
                    </div>
                    {FOOTER.map((group) => (
                        <nav key={group.title} aria-label={group.title}>
                            <h2 className="bento-footer-title">{group.title}</h2>
                            <ul>
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href}>{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>
                <div className="bento-footer-base">
                    <p>
                        © {new Date().getFullYear()} {SITE.legalName}
                    </p>
                    <span className="bento-ribs" aria-hidden="true" />
                    <a href="#top">Back to top</a>
                </div>
            </div>
        </footer>
    );
}
