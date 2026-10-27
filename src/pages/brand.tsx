import { useState } from "react";
import { Check, Copy } from "lucide";

import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { SITE } from "@/content/site";
import { Button, Card } from "@/design-system";

/**
 * The marketing face of Ink & tide. The rules here follow the design-system
 * repo (beamcove/design-system); the copy follows the company's About page.
 */
const BOILERPLATE = [
    { label: "Tagline", text: SITE.tagline },
    { label: "Short", text: SITE.summary },
    {
        label: "Long",
        text: [
            "Beamcove is an innovation company charting new horizons in the digital sea. It explores new possibilities through software, challenges familiar approaches, and turns original ideas into useful digital products. Its ambition is to set trends and open up better ways for people to work, live, and play.",
            "Its approach combines professional care with curiosity, adventure, and fun. Adventure means trying new things and leaving room for discovery. Integrity means keeping commitments and earning trust through actions that leave a lasting mark. Balance means doing meaningful work at a sustainable pace, with room for life and creativity.",
            "At its heart, Beamcove is a place for innovation. It aims to become a trusted, well-regarded brand and a coveted place for people who want to shape what comes next.",
        ].join("\n\n"),
    },
];

const SWATCHES = [
    {
        name: "Paper",
        token: "surface",
        hex: "#F7F6F2",
        use: "The page. Every print starts here.",
    },
    {
        name: "Ink",
        token: "ink",
        hex: "#1C2554",
        use: "Text and the wordmark. A deep navy, never black.",
    },
    {
        name: "Riso blue",
        token: "print-blue",
        hex: "#0A6CBD",
        use: "The action ink: buttons, links and focus.",
    },
    {
        name: "Fluorescent red",
        token: "print-red",
        hex: "#FF4A3D",
        use: "The second ink: the beacon dot, blooms and the bar. Never a status.",
    },
    {
        name: "Overprint",
        token: "overprint",
        hex: "#2A3A8C",
        use: "The navy where blue prints over red.",
    },
];

function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
    return (
        <div className="do-dont" data-reveal>
            <div>
                <p className="headline">Do</p>
                <ul className="tick-list">
                    {dos.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
            <div>
                <p className="headline">Don’t</p>
                <ul className="cross-list">
                    {donts.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

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
                For press, partners and anyone writing about Beamcove. It follows Ink & tide, our
                design system. Everything here is free to use as long as it stays as it is.
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
                        There’s no logo mark yet. Until there is, the name is the logo: Beamcove,
                        set in Onest at weight 600 with tight tracking.
                    </SectionHead>
                    <div className="wordmark-grid">
                        <figure className="wordmark-sample" data-theme="light" data-reveal>
                            <span className="wordmark-big">Beamcove</span>
                            <figcaption className="caption muted">Ink on paper</figcaption>
                        </figure>
                        <figure className="wordmark-sample wordmark-sample-overprint" data-reveal>
                            <span className="wordmark-big">Beamcove</span>
                            <figcaption className="caption">Paper on overprint</figcaption>
                        </figure>
                    </div>
                    <DoDont
                        dos={[
                            "Set it in Onest 600 with −0.045em tracking.",
                            "Use ink on paper, and paper on a solid overprint block.",
                            "Write it as one word with a capital B. The company’s legal name is Beamcove LLC.",
                        ]}
                        donts={[
                            "Draw a symbol or mark next to it.",
                            "Print it in two colors or offset a shadow in a second ink.",
                            "Set it in black. Ink is a deep navy.",
                        ]}
                    />
                </div>
            </section>

            <section className="section" aria-labelledby="color-title">
                <div className="container">
                    <SectionHead id="color" eyebrow="Color" title="Two inks on paper.">
                        Beamcove is printed like a riso poster: paper, riso blue, fluorescent red
                        and the navy where they overprint, with real grain in the color.
                    </SectionHead>
                    <ul className="swatch-grid" data-theme="light">
                        {SWATCHES.map((swatch) => (
                            <li key={swatch.name} data-reveal>
                                <span
                                    className="swatch-chip"
                                    style={{ background: `var(--${swatch.token})` }}
                                    aria-hidden="true"
                                />
                                <p className="headline">{swatch.name}</p>
                                <p className="mono muted">{swatch.hex}</p>
                                <p className="body-sm muted">{swatch.use}</p>
                            </li>
                        ))}
                    </ul>
                    <DoDont
                        dos={[
                            "Give each piece one printed moment, and keep the rest paper and navy.",
                            "Keep text on paper, with the ink on the right or the bottom edge.",
                            "Keep corners soft.",
                        ]}
                        donts={[
                            "Put text on dense ink or under a shape.",
                            "Overprint anything but the two inks.",
                            "Use red for warnings or errors.",
                        ]}
                    />
                </div>
            </section>

            <section className="section" aria-labelledby="type-title">
                <div className="container">
                    <SectionHead id="type" eyebrow="Type" title="Two typefaces, three weights.">
                        Onest for everything, JetBrains Mono for codes and data, in weights 400, 500
                        and 600.
                    </SectionHead>
                    <div className="type-grid">
                        <Card variant="plain" data-reveal>
                            <p className="caption muted">Onest · everything</p>
                            <p className="type-specimen">Aa</p>
                            <p className="body-lg">{SITE.tagline}</p>
                        </Card>
                        <Card variant="plain" data-reveal>
                            <p className="caption muted">JetBrains Mono · codes and data</p>
                            <p className="type-specimen type-specimen-mono">01</p>
                            <p className="mono">Est. 2026 · beamcove.com</p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="voice-title">
                <div className="container">
                    <SectionHead id="voice" eyebrow="Voice" title="Clear, warm, quietly confident.">
                        Plain words first, and a little play where the ink is.
                    </SectionHead>
                    <DoDont
                        dos={[
                            "Say “we” for Beamcove and “you” for the reader.",
                            "Write in sentence case.",
                            "Save nautical words like voyage, fleet and crew for brand moments.",
                        ]}
                        donts={[
                            "Use all-caps labels.",
                            "Use emoji.",
                            "Use nautical words in instructions, errors or settings.",
                        ]}
                    />
                </div>
            </section>
        </SiteLayout>
    );
}
