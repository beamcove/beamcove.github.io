import "./lab-index.css";

import { useEffect, useRef } from "react";

import { ART } from "@/app/components/glyph-compositions";
import { ROUTES } from "@/content/site";
import { Button, GlyphField, ScrambleText, Window } from "@/design-system";
import { LAB_SITES } from "@/lab/sites";

/** A live, non-interactive preview of a site at 1280×800, scaled to fit its box. */
function LivePreview({ href, name }: { href: string; name: string }) {
    const box = useRef<HTMLAnchorElement>(null);
    useEffect(() => {
        const el = box.current;
        if (!el || typeof ResizeObserver === "undefined") return;
        const fit = () => el.style.setProperty("--k", String(el.clientWidth / 1280));
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return (
        <a className="lab-card-preview" href={href} tabIndex={-1} aria-hidden="true" ref={box}>
            <iframe src={href} title={`${name} preview`} loading="lazy" tabIndex={-1} />
        </a>
    );
}

/**
 * The lab's front page: five versions of the website, each a live preview in
 * a window. Every version runs from this same build and design system.
 */
export function LabIndexPage() {
    return (
        <div className="lab-index">
            <header className="lab-index-head">
                <div className="lab-index-field bc-glyphs" aria-hidden="true">
                    <GlyphField composition={ART.design} quiet={false} />
                </div>
                <div className="lab-index-copy">
                    <p className="bc-eyebrow">Beamcove lab</p>
                    <h1 className="lab-index-title">
                        <ScrambleText text="One site, five directions." trigger="mount" />
                    </h1>
                    <p className="lab-index-lead">
                        Five versions of the Beamcove website, each taking Signal in its own
                        direction. Same words, same design system, five different answers.
                    </p>
                    <div className="lab-index-actions">
                        <Button href={LAB_SITES[0].href}>Start the tour</Button>
                        <Button variant="secondary" href={ROUTES.design}>
                            The design system
                        </Button>
                    </div>
                </div>
            </header>

            <ol className="lab-index-grid">
                {LAB_SITES.map((site, i) => (
                    <li key={site.slug}>
                        <Window
                            title={`${String(i + 1).padStart(2, "0")} ${site.name}`}
                            titleAs="p"
                            className="lab-card"
                            bodyClassName="lab-card-body"
                        >
                            <LivePreview href={site.href} name={site.name} />
                            <div className="lab-card-copy">
                                <h2 className="lab-card-name">{site.name}</h2>
                                <p className="lab-card-line">{site.line}</p>
                                <Button size="sm" variant="secondary" href={site.href}>
                                    Open {site.name}
                                </Button>
                            </div>
                        </Window>
                    </li>
                ))}
            </ol>
        </div>
    );
}
