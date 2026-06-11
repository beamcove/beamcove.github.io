/* Beamcove landing — section components.
   Stateless & presentational; copy comes in via props from app.tsx so the
   Tweaks panel can edit hero text live. Each section is self-contained so
   adding/removing one is a single line in app.tsx's render. */

import { useEffect, useState } from "react";

import { BrandIcon, type BrandName } from "@/app/components/brand";

const NAV_LINKS = [
    { href: "#what", label: "What we do" },
    { href: "#fleet", label: "The fleet" },
    { href: "#crew", label: "The crew" },
    { href: "#dispatches", label: "Dispatches" },
];

export function Nav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <header className={"lp-nav" + (scrolled ? " is-scrolled" : "")}>
            <div className="lp-container lp-nav__inner">
                <a className="lp-brand" href="#top" aria-label="Beamcove home">
                    <img src="assets/logo-lockup.svg" alt="Beamcove" />
                </a>
                <nav className="lp-nav__links">
                    {NAV_LINKS.map((l) => (
                        <a key={l.href} className="lp-navlink" href={l.href}>
                            {l.label}
                        </a>
                    ))}
                </nav>
                <div className="lp-nav__actions">
                    <a className="bc-btn bc-btn--primary" href="#dispatches">
                        Get notified
                    </a>
                </div>
            </div>
        </header>
    );
}

export function Hero({
    inkPreset,
    eyebrow,
    headline,
    subhead,
}: {
    inkPreset: string;
    eyebrow: string;
    headline: string;
    subhead: string;
}) {
    return (
        <section id="top" className={"lp-hero ink-bg ink-bg--" + inkPreset}>
            <span className="ink-blob ink-blob--a"></span>
            <span className="ink-blob ink-blob--b"></span>
            <div className="ink-bg__content">
                <div className="lp-hero__inner lp-reveal">
                    <span className="lp-status">
                        <span className="pulse">
                            <i></i>
                            <i></i>
                        </span>
                        Hoisting our sails — fleet in development
                    </span>
                    <p className="eyebrow">{eyebrow}</p>
                    <h1>{headline}</h1>
                    <p className="lead">{subhead}</p>
                    <div className="lp-hero__cta">
                        <a className="bc-btn bc-btn--primary bc-btn--lg" href="#dispatches">
                            Get notified
                        </a>
                        <a className="bc-btn bc-btn--outline bc-btn--lg" href="#fleet">
                            See the fleet
                        </a>
                    </div>
                    <a className="lp-scrollcue" href="#what" aria-label="Scroll to explore">
                        <span>Explore</span>
                        <i data-lucide="chevron-down"></i>
                    </a>
                </div>
            </div>
        </section>
    );
}

const FEATURES = [
    {
        icon: "compass",
        title: "Apps to navigate daily life",
        body: "Mobile apps that help you find your way through the everyday — calm, useful, and a pleasure to keep on hand.",
    },
    {
        icon: "gem",
        title: "Tools that get things done",
        body: "Software built to make work lighter — smart, dependable tools that clear the busywork and keep you moving toward a clear horizon.",
    },
    {
        icon: "sparkles",
        title: "Other digital bounties",
        body: "Experimental ventures and curiosities we chart as we go.",
    },
];

export function What() {
    return (
        <section id="what" className="lp-section">
            <div className="lp-container">
                <div className="lp-head lp-reveal">
                    <p className="eyebrow">What we do</p>
                    <h2>One cove, a fleet of creative ventures.</h2>
                    <p className="lead">
                        Beamcove builds delightful digital experiences with a little nautical charm.
                        Here's the kind of thing we set out to make.
                    </p>
                </div>
                <div className="lp-grid-3">
                    {FEATURES.map((f, i) => (
                        <article
                            key={f.title}
                            className="bc-card lp-feature lp-reveal"
                            style={{ transitionDelay: i * 70 + "ms" }}
                        >
                            <span className="lp-feature__icon">
                                <i data-lucide={f.icon}></i>
                            </span>
                            <h3>{f.title}</h3>
                            <p>{f.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── THE FLEET — a single featured venture, "coming soon" spotlight.
   When you have more than one, switch back to a grid of these. ── */
const FEATURED = {
    icon: "sailboat",
    status: "On the horizon",
    kicker: "First venture",
    name: "Caskade",
    blurb: "Our first ship is nearly ready to leave the harbor — a tool built to make everyday work lighter. We're putting the final coat of paint on the hull now.",
};

export function Fleet() {
    return (
        <section id="fleet" className="lp-section" style={{ background: "var(--secondary)" }}>
            <div className="lp-container">
                <div className="lp-head lp-reveal">
                    <p className="eyebrow">The fleet</p>
                    <h2>Something's on the horizon.</h2>
                    <p className="lead">
                        No vessels have set sail just yet — but our first one is close. Want word
                        the moment it launches?
                    </p>
                </div>

                <article className="lp-spotlight lp-reveal">
                    <div className="lp-spotlight__plate ink-bg ink-bg--reef">
                        <span className="ink-blob ink-blob--a"></span>
                        <span className="ink-blob ink-blob--b"></span>
                    </div>
                    <div className="lp-spotlight__body">
                        <p className="eyebrow">{FEATURED.kicker}</p>
                        <span className="bc-badge bc-badge--secondary">
                            <span className="dot lp-pulse"></span>
                            {FEATURED.status}
                        </span>
                        <h3>{FEATURED.name}</h3>
                        <p>{FEATURED.blurb}</p>
                        <div className="lp-spotlight__foot">
                            <a className="bc-btn bc-btn--primary" href="#dispatches">
                                Notify me at launch
                            </a>
                            <span className="lp-spotlight__hint">
                                <i data-lucide="clock"></i>Setting sail soon
                            </span>
                        </div>
                    </div>
                </article>

                <p className="lp-fleet-note lp-reveal">
                    <i data-lucide="telescope"></i>
                    More ventures are being charted. Keep a lookout.
                </p>
            </div>
        </section>
    );
}

const VALUES = [
    {
        n: "01",
        title: "Adventure",
        body: "We chase the uncharted. New waters are where the good ideas live — so we keep sailing past the edge of the map.",
    },
    {
        n: "02",
        title: "Integrity",
        body: "Quality craftsmanship and honest work. It's the mark stamped on every Beamcove project, seen or unseen.",
    },
    {
        n: "03",
        title: "Balance",
        body: "Steady hands on the wheel. We build at a sustainable, seaworthy pace — for our crew and for the long voyage.",
    },
];

export function Values() {
    return (
        <section id="values" className="lp-section lp-section--tight">
            <div className="lp-container">
                <div className="lp-head lp-reveal">
                    <p className="eyebrow">What we value</p>
                    <h2>The compass we steer by.</h2>
                </div>
                <div className="lp-values">
                    {VALUES.map((v, i) => (
                        <div
                            key={v.title}
                            className="lp-value lp-reveal"
                            style={{ transitionDelay: i * 70 + "ms" }}
                        >
                            <span className="lp-value__n">{v.n}</span>
                            <h3>{v.title}</h3>
                            <p>{v.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── THE CREW — placeholder people. Swap initials/name/role/blurb for the
   real crew when ready; the open seat links to the dispatches form. ── */
interface CrewMember {
    initials: string;
    name: string;
    role: string;
    blurb: string;
    links: [BrandName, string][];
}

const CREW: CrewMember[] = [
    {
        initials: "YD",
        name: "Y. Dubuc",
        role: "Captain",
        blurb: "Sets the course and keeps the horizon in view.",
        links: [
            ["github", "https://github.com/ydubuc"],
            ["linkedin", "https://www.linkedin.com/in/ydubuc"],
            ["x", "https://x.com/yoandubuc"],
        ],
    },
    // { initials: "RK", name: "R. Kestrel", role: "Navigator", blurb: "Charts the routes and reads the digital tides.", links: [["github", "#"], ["linkedin", "#"]] },
    // { initials: "JT", name: "J. Tern", role: "Lookout", blurb: "First to spot the next venture on the horizon.", links: [["linkedin", "#"], ["x", "#"]] },
];

export function Crew() {
    return (
        <section id="crew" className="lp-section" style={{ background: "var(--secondary)" }}>
            <div className="lp-container">
                <div className="lp-head lp-reveal">
                    <p className="eyebrow">Who's aboard</p>
                    <h2>A small crew with a big map.</h2>
                    <p className="lead">
                        The hands steering Beamcove through uncharted waters. We're still growing —
                        there may be a berth for you.
                    </p>
                </div>
                <div className="lp-crew-grid">
                    {CREW.map((m, i) => (
                        <article
                            key={m.name}
                            className="bc-card lp-crew-card lp-reveal"
                            style={{ transitionDelay: i * 60 + "ms" }}
                        >
                            <span className="bc-avatar">{m.initials}</span>
                            <h3>{m.name}</h3>
                            <span className="role">{m.role}</span>
                            <p>{m.blurb}</p>
                            <div className="lp-crew-card__links">
                                {m.links.map(([icon, href]) => (
                                    <a
                                        key={icon}
                                        href={href}
                                        aria-label={m.name + " on " + icon}
                                        title={icon}
                                    >
                                        <BrandIcon name={icon} />
                                    </a>
                                ))}
                            </div>
                        </article>
                    ))}
                    <a
                        className="bc-card lp-crew-card lp-crew-open lp-reveal"
                        href="#dispatches"
                        style={{ transitionDelay: "180ms" }}
                    >
                        <span className="seat">
                            <i data-lucide="plus"></i>
                        </span>
                        <h3>Join the crew</h3>
                        <span className="role">Open berth</span>
                        <p>Like the sound of the voyage? We'd love to hear from you.</p>
                    </a>
                </div>
            </div>
        </section>
    );
}

const FOOT_COLS: { h: string; links: [string, string][] }[] = [
    {
        h: "Explore",
        links: [
            ["The fleet", "#fleet"],
            ["What we do", "#what"],
            ["The crew", "#crew"],
            ["Dispatches", "#dispatches"],
        ],
    },
    {
        h: "Company",
        links: [
            ["About", "#what"],
            ["Values", "#values"],
            ["Careers", "#crew"],
        ],
    },
    {
        h: "Connect",
        links: [
            ["Contact", "#dispatches"],
            ["Privacy", "#"],
            ["Terms", "#"],
        ],
    },
];

const SOCIALS: { name: BrandName; href: string; label: string }[] = [
    { name: "github", href: "https://github.com/beamcove", label: "GitHub" },
    { name: "x", href: "https://x.com/beamcove", label: "X" },
    { name: "reddit", href: "https://reddit.com/u/beamcove", label: "Reddit" },
    { name: "discord", href: "https://discord.gg/beamcove", label: "Discord" },
];

export function Footer() {
    return (
        <footer className="lp-footer">
            <div className="lp-container">
                <div className="lp-footer__top">
                    <div className="lp-footer__brand">
                        <img src="assets/logo-lockup.svg" alt="Beamcove" />
                        <p>
                            A playful umbrella for a fleet of creative digital ventures, charting
                            new horizons in the digital sea.
                        </p>
                    </div>
                    {FOOT_COLS.map((c) => (
                        <div key={c.h} className="lp-footcol">
                            <h4>{c.h}</h4>
                            <ul>
                                {c.links.map(([label, href]) => (
                                    <li key={label}>
                                        <a href={href}>{label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="lp-footer__bar">
                    <span className="small">
                        © {new Date().getFullYear()} Beamcove
                        <span className="tag">·&nbsp;&nbsp;All rights reserved.</span>
                    </span>
                    <div className="lp-social">
                        {SOCIALS.map((s) => (
                            <a key={s.name} href={s.href} aria-label={s.label} title={s.label}>
                                <BrandIcon name={s.name} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
