import { useEffect, useState } from "react";
import { Menu, X } from "lucide";

import { Icon } from "@/app/components/icon";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { NAV, ROUTES } from "@/content/site";
import { Button } from "@/design-system";

function isCurrent(href: string) {
    return typeof window !== "undefined" && window.location.pathname === href;
}

export function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    const classes = ["site-header", scrolled && "is-scrolled", menuOpen && "is-open"];
    return (
        <header className={classes.filter(Boolean).join(" ")}>
            <div className="container site-header-inner">
                <a className="wordmark" href={ROUTES.home}>
                    Beamcove
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
                <div className="site-header-actions">
                    <ThemeToggle />
                    <Button
                        variant="secondary"
                        size="sm"
                        href="/#dispatches"
                        className="header-cta"
                    >
                        Get dispatches
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        className="menu-toggle"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <Icon node={menuOpen ? X : Menu} />
                    </Button>
                </div>
            </div>
            <nav id="mobile-menu" className="mobile-menu" aria-label="Menu" hidden={!menuOpen}>
                <ul className="container">
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
                        <a href="/#dispatches" onClick={() => setMenuOpen(false)}>
                            Get dispatches
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
