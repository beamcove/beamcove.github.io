import { useEffect, useState } from "react";

import { ThemeToggle } from "@/app/components/theme-toggle";
import { NAV_LINKS } from "@/app/links";
import { Button } from "@/design-system";

export function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
            <div className="container site-header-inner">
                <a className="wordmark" href="#top" aria-label="Beamcove, back to top">
                    Beamcove
                </a>
                <nav aria-label="Main" className="site-nav">
                    <ul>
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a href={link.href}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="site-header-actions">
                    <ThemeToggle />
                    <Button variant="secondary" size="sm" href="#dispatches">
                        Get dispatches
                    </Button>
                </div>
            </div>
        </header>
    );
}
