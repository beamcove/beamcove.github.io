import "./cinema.css";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, Menu, X } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { Icon } from "@/app/components/icon";
import { useReveal } from "@/app/utils/motion";
import { useSubscribe } from "@/app/utils/subscribe";
import { QUESTIONS } from "@/content/faq";
import { KINDS } from "@/content/fleet";
import { LOGBOOK } from "@/content/logbook";
import { formatDate, ROUTES, SITE, SOCIALS } from "@/content/site";
import { MISSION, STORY, STORY_MARK, VALUES, VISION } from "@/content/values";
import { Badge, Button, Callout, motionAllowed, ScrambleText, TextField } from "@/design-system";
import { LabBar } from "@/lab/lab-bar";

import { SCENES, type SceneName } from "./cinema-scenes";
import { createPainter, quietRects } from "./cinema-stage";

const CHAPTERS = [
    { id: "top", label: "Start" },
    { id: "what-we-do", label: "What we do" },
    { id: "about", label: "About" },
    { id: "values", label: "Values" },
    { id: "updates", label: "Updates" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
];

const KIND_SCENES: SceneName[] = ["work", "live", "play"];

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

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * The fixed stage behind the whole page: one glyph field that dissolves from
 * scene to scene as each `[data-scene]` screen arrives, stays quiet behind
 * every `[data-quiet]` box, and sweeps the lighthouse beam in the hero. It
 * also writes scroll progress (`--p`, `data-step`) on `[data-progress]` pins.
 */
function Stage() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const root = canvas?.closest(".cinema");
        if (!canvas || !root) return;
        const painter = createPainter(canvas);
        if (!painter) return;
        const scenes = [...root.querySelectorAll<HTMLElement>("[data-scene]")];
        const pins = [...root.querySelectorAll<HTMLElement>("[data-progress]")];
        const seen = new Map<HTMLElement, string>();
        let width = 0;
        let height = 0;
        let frame = 0;
        let last = 0;

        const tick = (now: number) => {
            frame = requestAnimationFrame(tick);
            if (now - last < 33) return;
            last = now;
            const cw = canvas.clientWidth;
            const ch = canvas.clientHeight;
            // phones resize the viewport as the toolbar hides: only rebuild on real changes
            if (cw !== width || Math.abs(ch - height) > 120) {
                width = cw;
                height = ch;
                painter.resize(cw, ch, 1.5);
            }
            const vh = window.innerHeight;
            const tops = scenes.map((s) => s.getBoundingClientRect().top);
            // a scene takes over as its screen's top crosses from 75% to 25% of the viewport
            let at = 0;
            tops.forEach((top, i) => {
                if (top <= vh * 0.25) at = i;
            });
            const next = scenes[at + 1];
            const t = next ? clamp01((vh * 0.75 - tops[at + 1]!) / (vh * 0.5)) : 0;
            const nameA = (scenes[at]?.dataset.scene ?? "hero") as SceneName;
            const nameB = next && t > 0 ? (next.dataset.scene as SceneName) : null;

            for (const pin of pins) {
                const r = pin.getBoundingClientRect();
                const span = r.height - vh;
                const p = span > 40 ? clamp01(-r.top / span) : 1;
                const steps = Number(pin.dataset.progress) || 0;
                const key = p.toFixed(3);
                if (seen.get(pin) === key) continue;
                seen.set(pin, key);
                pin.style.setProperty("--p", key);
                if (steps) pin.dataset.step = String(Math.min(steps - 1, Math.floor(p * steps)));
            }

            painter.draw({
                a: SCENES[nameA],
                b: nameB ? SCENES[nameB] : null,
                t,
                quiet: quietRects(root, { left: 0, top: 0 }),
                time: now,
                animate: true,
                beam: (nameA === "hero" ? 1 - t : 0) + (nameB === "hero" ? t : 0),
            });
        };

        const start = () => {
            if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const onVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frame);
                frame = 0;
            } else start();
        };
        start();
        canvas.dataset.live = "";
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return <canvas ref={ref} className="cn-stage" aria-hidden="true" />;
}

/** The no-motion layout: each screen prints its own still field. */
function Still({ scene }: { scene: SceneName }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof ResizeObserver === "undefined") return;
        const painter = createPainter(canvas);
        if (!painter) return;
        const paint = () => {
            painter.resize(host.clientWidth, host.clientHeight, 1);
            painter.draw({
                a: SCENES[scene],
                b: null,
                t: 0,
                quiet: quietRects(host, host.getBoundingClientRect()),
                time: 0,
                animate: false,
                beam: 0,
            });
        };
        const ro = new ResizeObserver(paint);
        ro.observe(host);
        void document.fonts?.ready.then(paint);
        return () => ro.disconnect();
    }, [scene]);

    return <canvas ref={ref} className="cn-still" aria-hidden="true" />;
}

/** Which chapter sits under the top 40% of the viewport. */
function useActiveChapter() {
    const [active, setActive] = useState("top");
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            let current = "top";
            for (const { id } of CHAPTERS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);
    return active;
}

function Header({ active }: { active: string }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="cn-header" data-open={open || undefined}>
            <div className="cn-header-row">
                <a className="cn-wordmark" href="#top" onClick={() => setOpen(false)}>
                    Beamcove
                    <span className="bc-cursor" aria-hidden="true" />
                </a>
                <nav className="cn-nav" id="cn-nav" aria-label="Main">
                    <ul>
                        {CHAPTERS.slice(1).map((c) => (
                            <li key={c.id}>
                                <a
                                    href={`#${c.id}`}
                                    aria-current={active === c.id ? "location" : undefined}
                                    onClick={() => setOpen(false)}
                                >
                                    {c.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Button size="sm" variant="secondary" href="#newsletter" className="cn-subscribe">
                    Subscribe
                </Button>
                <button
                    type="button"
                    className="cn-menu"
                    aria-expanded={open}
                    aria-controls="cn-nav"
                    onClick={() => setOpen(!open)}
                >
                    <Icon node={open ? X : Menu} size={20} />
                    <span className="visually-hidden">Menu</span>
                </button>
            </div>
        </header>
    );
}

/** The chapter list on the right: where you are, and a way to jump. */
function Rail({ active }: { active: string }) {
    return (
        <nav className="cn-rail" aria-label="Chapters" data-quiet="soft">
            <ol>
                {CHAPTERS.map((c, i) => (
                    <li key={c.id}>
                        <a
                            href={`#${c.id}`}
                            aria-current={active === c.id ? "location" : undefined}
                        >
                            <span className="cn-rail-label">{c.label}</span>
                            <span className="cn-rail-n">{pad2(i)}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

function Kicker({ n, children }: { n: number; children: ReactNode }) {
    return (
        <p className="cn-kicker">
            <span className="cn-kicker-n">{pad2(n)}</span>
            {children}
        </p>
    );
}

/** A sentence whose words light up, one by one, as its pin scrolls. */
function LitLine({ text }: { text: string }) {
    const words = text.split(" ");
    return (
        <p className="cn-lit" style={{ "--n": words.length } as CSSProperties}>
            {words.map((word, i) => (
                <span key={i} style={{ "--i": i } as CSSProperties}>
                    {word}{" "}
                </span>
            ))}
        </p>
    );
}

function Newsletter() {
    const { email, setEmail, error, done, submitting, submit } = useSubscribe();
    return done ? (
        <Callout tone="success" title="You’re subscribed." className="cn-done">
            We’ll write when there’s news.
        </Callout>
    ) : (
        <form className="cn-form" onSubmit={submit} noValidate>
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
    );
}

/** Lab version of the site: Cinema. A scroll-driven story on one glyph stage. */
export function CinemaSite() {
    const [animate] = useState(motionAllowed);
    const active = useActiveChapter();
    useReveal();
    const still = (scene: SceneName) => (animate ? null : <Still scene={scene} />);
    const story = STORY[0] ?? "";
    const mark = story.indexOf(STORY_MARK);

    return (
        <div className="cinema" data-mode={animate ? "stage" : "still"}>
            <a className="cn-skip" href="#main">
                Skip to content
            </a>
            {animate && <Stage />}
            <Header active={active} />
            <Rail active={active} />

            <main id="main">
                <section
                    className="cn-screen cn-hero"
                    id="top"
                    data-scene="hero"
                    aria-labelledby="cn-title"
                >
                    {still("hero")}
                    <div className="cn-hero-copy">
                        <p className="cn-eyebrow" data-quiet>
                            Beamcove is a technology company
                        </p>
                        <h1 className="cn-h1" id="cn-title">
                            <span data-quiet>
                                <ScrambleText text={SITE.tagline} trigger="mount" duration={1400} />
                            </span>
                        </h1>
                        <p className="cn-lead">
                            <span data-quiet>
                                We take the craft seriously and still have fun doing it. What we’re
                                building is almost ready to meet you.
                            </span>
                        </p>
                        <div className="cn-actions" data-quiet>
                            <Button
                                size="lg"
                                href="#what-we-do"
                                iconRight={<Icon node={ArrowDown} />}
                            >
                                See what we do
                            </Button>
                            <Button size="lg" variant="secondary" href="#newsletter">
                                Get the newsletter
                            </Button>
                        </div>
                    </div>
                    <p className="cn-cue" aria-hidden="true" data-quiet>
                        Scroll
                    </p>
                </section>

                <section id="what-we-do" aria-labelledby="cn-wwd-title">
                    <div className="cn-screen" data-scene="intro">
                        {still("intro")}
                        <div className="cn-wrap">
                            <div className="cn-copy" data-quiet data-reveal>
                                <Kicker n={1}>What we do</Kicker>
                                <h2 className="cn-h2" id="cn-wwd-title">
                                    Three directions.
                                </h2>
                                <p className="cn-body-lg">
                                    Different problems, same care. Here’s where our work points.
                                </p>
                            </div>
                        </div>
                    </div>
                    {KINDS.map((kind, i) => (
                        <div
                            key={kind.title}
                            className="cn-screen cn-kind"
                            data-scene={KIND_SCENES[i] ?? "work"}
                        >
                            {still(KIND_SCENES[i] ?? "work")}
                            <div className="cn-wrap">
                                <div className="cn-copy" data-quiet data-reveal>
                                    <p className="cn-count">
                                        {pad2(i + 1)} <span>/ {pad2(KINDS.length)}</span>
                                    </p>
                                    <h3 className="cn-h3">{kind.title}</h3>
                                    <p className="cn-body-lg">{kind.body}</p>
                                    {i === KINDS.length - 1 && (
                                        <a className="cn-more" href={ROUTES.projects}>
                                            See our projects <Icon node={ArrowRight} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section id="about" aria-labelledby="cn-about-title">
                    <div className="cn-screen" data-scene="story">
                        {still("story")}
                        <div className="cn-wrap">
                            <div className="cn-copy cn-story" data-quiet data-reveal>
                                <Kicker n={2}>About</Kicker>
                                <h2 className="cn-h2" id="cn-about-title">
                                    It started with curiosity.
                                </h2>
                                <p className="cn-body-lg">
                                    {mark < 0 ? (
                                        story
                                    ) : (
                                        <>
                                            {story.slice(0, mark)}
                                            <em className="cn-em">{STORY_MARK}</em>
                                            {story.slice(mark + STORY_MARK.length)}
                                        </>
                                    )}
                                </p>
                                {STORY.slice(1).map((p) => (
                                    <p key={p} className="cn-body">
                                        {p}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="cn-pin" data-scene="mission" data-progress="0">
                        {still("mission")}
                        <div className="cn-pin-frame">
                            <div className="cn-copy cn-statement" data-quiet>
                                <h3 className="cn-label">Our mission</h3>
                                <LitLine text={MISSION} />
                            </div>
                        </div>
                    </div>
                    <div className="cn-pin" data-scene="vision" data-progress="0">
                        {still("vision")}
                        <div className="cn-pin-frame">
                            <div className="cn-copy cn-statement cn-statement-big" data-quiet>
                                <h3 className="cn-label">Our vision</h3>
                                <LitLine text={VISION} />
                                <p className="cn-body">
                                    That’s the whole plan. The rest is details, and we like details.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="values"
                    className="cn-pin cn-values"
                    data-scene="values"
                    data-progress={VALUES.length}
                    aria-labelledby="cn-values-title"
                >
                    {still("values")}
                    <div className="cn-pin-frame">
                        <div className="cn-wrap">
                            <div className="cn-copy cn-values-head" data-quiet data-reveal>
                                <Kicker n={3}>Values</Kicker>
                                <h2 className="cn-h2" id="cn-values-title">
                                    Three rules we keep.
                                </h2>
                                <p className="cn-body-lg">Three, because we can remember three.</p>
                            </div>
                            <ol className="cn-values-list">
                                {VALUES.map((value, i) => (
                                    <li key={value.id} className="cn-value" data-quiet>
                                        <span className="cn-value-n" aria-hidden="true">
                                            {pad2(i + 1)}
                                        </span>
                                        <h3 className="cn-value-title">{value.title}</h3>
                                        <p className="cn-body">{value.body}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                <section
                    id="updates"
                    className="cn-screen"
                    data-scene="updates"
                    aria-labelledby="cn-updates-title"
                >
                    {still("updates")}
                    <div className="cn-wrap">
                        <div className="cn-copy cn-updates" data-quiet data-reveal>
                            <Kicker n={4}>Updates</Kicker>
                            <h2 className="cn-h2" id="cn-updates-title">
                                Latest updates.
                            </h2>
                            <p className="cn-body-lg">
                                Newest first. Our first projects are in the works, so for now it’s
                                mostly the site.
                            </p>
                            <ol className="cn-log">
                                {LOGBOOK.map((entry) => (
                                    <li key={entry.title}>
                                        <article className="cn-entry">
                                            <p className="cn-entry-meta">
                                                {entry.date ? (
                                                    <time dateTime={entry.date}>
                                                        {formatDate(entry.date)}
                                                    </time>
                                                ) : (
                                                    <span>Now</span>
                                                )}
                                                <Badge>{entry.tag}</Badge>
                                            </p>
                                            <h3 className="cn-entry-title">{entry.title}</h3>
                                            <p className="cn-body">{entry.body}</p>
                                        </article>
                                    </li>
                                ))}
                            </ol>
                            <a className="cn-more" href={ROUTES.updates}>
                                All updates <Icon node={ArrowRight} />
                            </a>
                        </div>
                    </div>
                </section>

                <section
                    id="faq"
                    className="cn-screen cn-faq"
                    data-scene="faq"
                    aria-labelledby="cn-faq-title"
                >
                    {still("faq")}
                    <div className="cn-wrap cn-split">
                        <div className="cn-copy" data-quiet data-reveal>
                            <Kicker n={5}>FAQ</Kicker>
                            <h2 className="cn-h2" id="cn-faq-title">
                                Asked and answered.
                            </h2>
                            <p className="cn-body-lg">
                                Didn’t find yours? <a href={`mailto:${SITE.email}`}>Email us</a>. A
                                real person reads every message.
                            </p>
                        </div>
                        <div className="cn-faq-list" data-quiet data-reveal>
                            {QUESTIONS.map((item, i) => (
                                <details key={item.q} className="cn-qa" open={i === 0}>
                                    <summary>
                                        <h3 className="cn-q">{item.q}</h3>
                                    </summary>
                                    <p className="cn-body">{item.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="contact"
                    className="cn-screen cn-close"
                    data-scene="contact"
                    aria-labelledby="cn-news-title"
                >
                    {still("contact")}
                    <div className="cn-wrap">
                        <div className="cn-copy cn-news" id="newsletter" data-quiet data-reveal>
                            <Kicker n={6}>Contact</Kicker>
                            <h2 className="cn-h2" id="cn-news-title">
                                Hear when we launch.
                            </h2>
                            <p className="cn-body-lg">
                                A friendly email whenever there’s something worth telling you.
                                Unsubscribe any time, no hard feelings.
                            </p>
                            <Newsletter />
                        </div>
                        <div className="cn-hello" data-quiet data-reveal>
                            <h3 className="cn-label">Or say hello</h3>
                            <ul>
                                <li>
                                    <a href={`mailto:${SITE.email}`}>
                                        <Icon node={Mail} size={18} />
                                        {SITE.email}
                                    </a>
                                </li>
                                {SOCIALS.map((s) => (
                                    <li key={s.name}>
                                        <a href={s.href} rel="noopener noreferrer">
                                            <BrandIcon name={s.name} />
                                            {s.label}
                                            <span className="cn-handle">{s.handle}</span>
                                            <Icon node={ArrowUpRight} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="cn-footer">
                <div className="cn-wrap">
                    <div className="cn-foot-brand">
                        <a className="cn-wordmark" href="#top">
                            Beamcove
                        </a>
                        <p className="cn-body">{SITE.summary}</p>
                    </div>
                    <nav aria-label="Footer">
                        <ul className="cn-foot-links">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <p className="cn-legal">
                        © {new Date().getFullYear()} {SITE.legalName}
                    </p>
                </div>
            </footer>
            <LabBar current="cinema" />
        </div>
    );
}
