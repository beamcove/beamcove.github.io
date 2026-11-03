import { useEffect, useState } from "react";
import { Menu, X } from "lucide";

import { Icon } from "@/app/components/icon";
import { NAV, ROUTES } from "@/content/site";
import { Button } from "@/design-system";

function isCurrent(href: string) {
    return typeof window !== "undefined" && window.location.pathname === href;
}

export function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    return (
        <header className={menuOpen ? "site-header is-open" : "site-header"}>
            <div className="site-header-row">
                <a className="wordmark" href={ROUTES.home}>
                    Beamcove
                    <span className="bc-cursor" aria-hidden="true" />
                </a>
                <nav aria-label="Main" className="site-nav">
                    <ul>
                        {NAV.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    aria-current={isCurrent(link.href) ? "page" : undefined}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Button variant="secondary" size="sm" href="/#newsletter" className="header-cta">
                    Subscribe
                </Button>
                <button
                    type="button"
                    className="menu-toggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <Icon node={menuOpen ? X : Menu} size={20} />
                </button>
            </div>
            <nav id="mobile-menu" className="mobile-menu" aria-label="Menu" hidden={!menuOpen}>
                <ul>
                    {NAV.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                aria-current={isCurrent(link.href) ? "page" : undefined}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="/#newsletter" onClick={() => setMenuOpen(false)}>
                            Subscribe
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
