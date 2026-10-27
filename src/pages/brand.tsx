import { useState } from "react";
import { Check, Copy } from "lucide";

import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { SITE } from "@/content/site";
import { Button, Card } from "@/design-system";

/** Approved boilerplate, from the company's About page. */
const BOILERPLATE = [
    { label: "Short", text: SITE.summary },
    {
        label: "Long",
        text: [
            "Beamcove is a home for promising projects to grow into thoughtful digital products. Founded as a safe harbor for ideas ready to become more than personal experiments, it gives each project a place within something bigger.",
            "Its approach combines professional care with curiosity, adventure, and fun. Adventure means trying new things and leaving room for discovery. Integrity means keeping commitments and earning trust through actions that leave a lasting mark. Balance means doing meaningful work at a sustainable pace, with room for life and creativity.",
            "At its heart, Beamcove is a cozy place to express ideas and grow. Its ambition is to become a trusted, well-regarded brand and a coveted place to be.",
        ].join("\n\n"),
    },
];

const SWATCHES = [
    {
        name: "Paper",
        token: "--surface",
        hex: "#F7F6F2",
        use: "The page. Every print starts here.",
    },
    { name: "Ink", token: "--ink", hex: "#1C2554", use: "Text and the wordmark. Never black." },
    { name: "Riso blue", token: "--print-blue", hex: "#0A6CBD", use: "The action ink." },
    {
        name: "Fluorescent red",
        token: "--print-red",
        hex: "#FF4A3D",
        use: "The second ink and the beacon.",
    },
    { name: "Overprint", token: "--overprint", hex: "#2A3A8C", use: "Where blue prints over red." },
];

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <Button
            variant="secondary"
            size="sm"
            iconLeft={<Icon node={copied ? Check : Copy} />}
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                } catch {
                    // clipboard blocked: the text is still selectable on the page
                }
            }}
        >
            {copied ? "Copied" : "Copy text"}
        </Button>
    );
}

export function BrandPage() {
    return (
        <SiteLayout>
            <PageHero band="flare" eyebrow="Brand kit" title="Printing Beamcove.">
                For press, partners and anyone writing about us. Everything here is free to use as
                long as it stays as it is.
            </PageHero>

            <section className="section section-tight" aria-labelledby="boilerplate-title">
                <div className="container">
                    <SectionHead
                        id="boilerplate"
                        eyebrow="Boilerplate"
                        title="Beamcove in a few words."
                    >
                        For bios, press and app stores.
                    </SectionHead>
                    <div className="boilerplate-list">
                        {BOILERPLATE.map((item) => (
                            <Card
                                key={item.label}
                                variant="plain"
                                eyebrow={item.label}
                                className="boilerplate"
                                data-reveal
                            >
                                {item.text.split("\n\n").map((paragraph, i) => (
                                    <p key={paragraph} className={i === 0 ? "body-lg" : "muted"}>
                                        {paragraph}
                                    </p>
                                ))}
                                <div className="boilerplate-actions">
                                    <CopyButton text={item.text} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="wordmark-title">
                <div className="container">
                    <SectionHead id="wordmark" eyebrow="Wordmark" title="Set in type, not drawn.">
                        We don’t have a logo mark yet, and we’d rather you didn’t make one for us.
                        The name is set in Onest at weight 600 with tight tracking.
                    </SectionHead>
                    <div className="wordmark-grid">
                        <figure className="wordmark-sample" data-theme="light" data-reveal>
                            <span className="wordmark-big">Beamcove</span>
                            <figcaption className="caption muted">Ink on paper</figcaption>
                        </figure>
                        <figure className="wordmark-sample wordmark-sample-night" data-reveal>
                            <span className="wordmark-big">Beamcove</span>
                            <figcaption className="caption">Paper on night</figcaption>
                        </figure>
                    </div>
                    <div className="do-dont" data-reveal>
                        <div>
                            <p className="headline">Do</p>
                            <ul className="tick-list">
                                <li>Write it as one word with a capital B.</li>
                                <li>Use ink on light backgrounds and paper on dark ones.</li>
                                <li>Give it room: at least the height of the “B” on every side.</li>
                            </ul>
                        </div>
                        <div>
                            <p className="headline">Don’t</p>
                            <ul className="cross-list">
                                <li>Draw a symbol, ship or wave next to it.</li>
                                <li>Print it in two colors or add shadows and outlines.</li>
                                <li>Stretch, skew or re-space the letters.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="color-title">
                <div className="container">
                    <SectionHead id="color" eyebrow="Color" title="Two inks on paper.">
                        Ink & tide is printed like a riso poster: paper, a blue ink, a fluorescent
                        red, and the navy you get where they overlap.
                    </SectionHead>
                    <ul className="swatch-grid" data-theme="light">
                        {SWATCHES.map((swatch) => (
                            <li key={swatch.name} data-reveal>
                                <span
                                    className="swatch-chip"
                                    style={{ background: `var(${swatch.token})` }}
                                    aria-hidden="true"
                                />
                                <p className="headline">{swatch.name}</p>
                                <p className="mono muted">{swatch.hex}</p>
                                <p className="body-sm muted">{swatch.use}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section" aria-labelledby="type-title">
                <div className="container">
                    <SectionHead id="type" eyebrow="Type" title="Two typefaces, three weights." />
                    <div className="type-grid">
                        <Card variant="plain" data-reveal>
                            <p className="caption muted">Onest · everything</p>
                            <p className="type-specimen">Aa</p>
                            <p className="body-lg">Charting new horizons in the digital sea.</p>
                        </Card>
                        <Card variant="plain" data-reveal>
                            <p className="caption muted">JetBrains Mono · codes and data</p>
                            <p className="type-specimen type-specimen-mono">01</p>
                            <p className="mono">Est. 2026 · beamcove.com</p>
                        </Card>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
