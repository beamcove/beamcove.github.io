import type { CSSProperties } from "react";

import { BrandIcon, type BrandName } from "@/app/components/brand";
import { SECTIONS } from "@/app/links";

const SOCIALS: { name: BrandName; href: string; label: string }[] = [
    { name: "github", href: "https://github.com/beamcove", label: "GitHub" },
    { name: "x", href: "https://x.com/beamcove", label: "X" },
    { name: "reddit", href: "https://reddit.com/u/beamcove", label: "Reddit" },
    { name: "discord", href: "https://discord.gg/beamcove", label: "Discord" },
];

export function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-top">
                    <div>
                        <a className="wordmark" href="#top">
                            Beamcove
                        </a>
                        <p className="muted footer-tag">
                            Charting new horizons in the digital sea.
                        </p>
                    </div>
                    <div className="footer-cols">
                        <nav aria-label="Footer">
                            <h2 className="footer-heading">Explore</h2>
                            <ul>
                                {SECTIONS.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href}>{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div>
                            <h2 className="footer-heading">Elsewhere</h2>
                            <ul>
                                {SOCIALS.map((s) => (
                                    <li key={s.name}>
                                        <a href={s.href} rel="noopener noreferrer">
                                            <BrandIcon name={s.name} />
                                            {s.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <p className="footer-wordmark" aria-hidden="true" data-reveal="fill">
                    {[..."Beamcove"].map((letter, i) => (
                        <span key={i} style={{ "--i": i } as CSSProperties}>
                            {letter}
                        </span>
                    ))}
                </p>
                <div className="footer-bottom">
                    <span className="caption muted">© {new Date().getFullYear()} Beamcove</span>
                    <span className="mono muted">beamcove.com</span>
                </div>
            </div>
        </footer>
    );
}
