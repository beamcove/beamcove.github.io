import { useEffect, useState } from "react";
import { Check, Copy } from "lucide";

import { AsciiWord } from "@/app/components/ascii-word";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { SITE } from "@/content/site";
import { Button, Card } from "@/design-system";

/**
 * The marketing face of Signal. The rules here follow the design-system
 * repo (beamcove/design-system); the copy follows the company's About page.
 */
const BOILERPLATE = [
    { label: "Tagline", text: SITE.tagline },
    { label: "Short", text: SITE.summary },
    {
        label: "Long",
        text: [
            "Beamcove is a technology company that turns curiosity into useful things, for work, everyday life and play. It began as a handful of personal experiments and grew into a company that follows good questions wherever they lead.",
            "It works by three values: adventure (try new things), integrity (keep your word) and balance (weigh every decision well). It brings professional care and a sense of fun to everything it makes.",
        ].join("\n\n"),
    },
];

const SWATCHES: { group: string; items: { name: string; token: string; use: string }[] }[] = [
    {
        group: "Interface",
        items: [
            { name: "Desk", token: "surface-page", use: "The page the windows sit on." },
            { name: "Rule", token: "rule", use: "The bold 2px line around windows and controls." },
            { name: "Text", token: "ink", use: "Text and the wordmark." },
            {
                name: "Beam",
                token: "beam",
                use: "The action ink: primary buttons, the cursor, links.",
            },
            { name: "Flare", token: "flare", use: "The accent, once per view. Never a status." },
        ],
    },
    {
        group: "Glyph inks",
        items: [
            { name: "Ink A", token: "ink-a", use: "Glyph art only. The hero’s main ink." },
            { name: "Ink B", token: "ink-b", use: "Glyph art only." },
            { name: "Ink C", token: "ink-c", use: "Glyph art only." },
            { name: "Ink D", token: "ink-d", use: "Glyph art only." },
            { name: "Ink E", token: "ink-e", use: "Glyph art only." },
        ],
    },
];

/** A token's value in the current theme, read live so it follows the theme picker. */
function TokenValue({ token }: { token: string }) {
    const [value, setValue] = useState("");
    useEffect(() => {
        const read = () =>
            setValue(
                getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim(),
            );
        read();
        window.addEventListener("bc-theme", read);
        return () => window.removeEventListener("bc-theme", read);
    }, [token]);
    return <span className="mono muted">{value ? `${value} · ${token}` : token}</span>;
}

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
            <PageHero art="brand" eyebrow="Brand kit" title="Brand guidelines.">
                For press, partners and anyone writing about Beamcove. Use it freely; just don’t
                change it.
            </PageHero>

            <section className="section section-tight" aria-labelledby="boilerplate-title">
                <div className="container">
                    <SectionHead
                        id="boilerplate"
                        eyebrow="Boilerplate"
                        title="Company descriptions."
                    >
                        Ready to copy for bios, press and app stores.
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
                    <SectionHead id="wordmark" eyebrow="Wordmark" title="Using the wordmark.">
                        There’s no logo mark yet. Until there is, the name is the logo: Beamcove,
                        set in Departure Mono and followed by a block cursor. For big moments, it
                        can be drawn in glyphs.
                    </SectionHead>
                    <div className="wordmark-grid">
                        <figure className="wordmark-sample" data-reveal>
                            <span className="wordmark-big">
                                Beamcove
                                <span className="bc-cursor" aria-hidden="true" />
                            </span>
                            <figcaption className="caption muted">Set in Departure Mono</figcaption>
                        </figure>
                        <figure className="wordmark-sample wordmark-sample-glyphs" data-reveal>
                            <AsciiWord text="Beamcove" seed={9} />
                            <figcaption className="caption muted">Drawn in glyphs</figcaption>
                        </figure>
                    </div>
                    <DoDont
                        dos={[
                            "Set it in Departure Mono, with the block cursor in the beam ink.",
                            "Use the theme’s text colour on its canvas, or the glyph version for big moments.",
                            "Write it as one word with a capital B. The company’s legal name is Beamcove LLC.",
                        ]}
                        donts={[
                            "Draw a symbol or mark next to it.",
                            "Set it in two colours, or add a glow or a shadow.",
                            "Animate anything but the cursor.",
                        ]}
                    />
                </div>
            </section>

            <section className="section" aria-labelledby="color-title">
                <div className="container">
                    <SectionHead id="color" eyebrow="Color" title="Brand colors.">
                        Beamcove looks like the first desktop computers, built today: paper, a bold
                        black rule, one action ink and five glyph inks. Pick a theme in the header
                        and every colour here changes with it.
                    </SectionHead>
                    {SWATCHES.map((group) => (
                        <div key={group.group} className="swatch-group">
                            <p className="caption muted swatch-group-title">{group.group}</p>
                            <ul className="swatch-grid">
                                {group.items.map((swatch) => (
                                    <li key={swatch.name} data-reveal>
                                        <span
                                            className="swatch-chip"
                                            style={{ background: `var(--${swatch.token})` }}
                                            aria-hidden="true"
                                        />
                                        <p className="headline">{swatch.name}</p>
                                        <TokenValue token={swatch.token} />
                                        <p className="body-sm muted">{swatch.use}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <DoDont
                        dos={[
                            "Give each view one glyph splash, and keep the rest canvas and text.",
                            "Keep text on the quiet side of a glyph field.",
                            "Name ink slots in art, never colours, so every theme re-inks it.",
                        ]}
                        donts={[
                            "Put text over dense glyphs or an ink block.",
                            "Use glyph inks for text or status.",
                            "Use flare for warnings or errors.",
                        ]}
                    />
                </div>
            </section>

            <section className="section" aria-labelledby="type-title">
                <div className="container">
                    <SectionHead id="type" eyebrow="Type" title="Typography.">
                        Departure Mono for display, JetBrains Mono for the interface and data, and
                        Onest for reading.
                    </SectionHead>
                    <div className="type-grid">
                        <Card variant="plain" data-reveal>
                            <p className="caption muted">Departure Mono · display</p>
                            <p className="type-specimen type-specimen-display">Aa</p>
                            <p className="mono">Sizes in steps of 11px: 22, 33, 44, 66.</p>
                        </Card>
                        <Card variant="plain" data-reveal>
                            <p className="caption muted">JetBrains Mono · interface and data</p>
                            <p className="type-specimen type-specimen-mono">01</p>
                            <p className="mono">beamcove.com · {SITE.email}</p>
                        </Card>
                        <Card variant="plain" data-reveal>
                            <p className="caption muted">Onest · reading</p>
                            <p className="type-specimen">Aa</p>
                            <p className="body-lg">{SITE.tagline}</p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="voice-title">
                <div className="container">
                    <SectionHead id="voice" eyebrow="Voice" title="How we write.">
                        Clear, warm and quietly confident: plain words first, and a little play
                        where the ink is.
                    </SectionHead>
                    <DoDont
                        dos={[
                            "Say “we” for Beamcove and “you” for the reader.",
                            "Write in sentence case.",
                            "Save nautical words like voyage, fleet and crew for brand moments.",
                            "Allow one light touch per page. Keep the rest plain.",
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
