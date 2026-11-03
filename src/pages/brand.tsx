import { useState } from "react";
import { Check, Copy } from "lucide";

import { AsciiWord } from "@/app/components/ascii-word";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { Section } from "@/app/components/section";
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
            {
                name: "Night",
                token: "surface-page",
                use: "The page, and the dot grid printed on it.",
            },
            { name: "Rule", token: "rule", use: "The bold 2px line around controls and panels." },
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

/** A token's value, read from the stylesheet so it never drifts from the tokens. */
function TokenValue({ token }: { token: string }) {
    const [value] = useState(() =>
        getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim(),
    );
    return <span className="mono">{value ? `${value} · ${token}` : token}</span>;
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
            <PageHero scene="brand" eyebrow="Brand kit" title="Brand guidelines.">
                For press, partners and anyone writing about Beamcove. Use it freely; just don’t
                change it.
            </PageHero>

            <Section
                id="boilerplate"
                kicker="Boilerplate"
                title="Company descriptions."
                lead="Ready to copy for bios, press and app stores."
                stacked
            >
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
            </Section>

            <Section
                id="wordmark"
                kicker="Wordmark"
                title="Using the wordmark."
                lead="There’s no logo mark yet. Until there is, the name is the logo: Beamcove, set in Departure Mono and followed by a block cursor. For big moments, it can be drawn in glyphs."
                stacked
            >
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
                        "Use the text colour on the midnight canvas, or the glyph version for big moments.",
                        "Write it as one word with a capital B. The company’s legal name is Beamcove LLC.",
                    ]}
                    donts={[
                        "Draw a symbol or mark next to it.",
                        "Set it in two colours, or add a glow or a shadow.",
                        "Animate anything but the cursor.",
                    ]}
                />
            </Section>

            <Section
                id="color"
                kicker="Color"
                title="Brand colors."
                lead="Beamcove is a night sky lit by a lighthouse: a calm ink-blue canvas, warm text, one action ink and five quiet glyph inks for the art."
                stacked
            >
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
                        "Name ink slots in art, never colours.",
                    ]}
                    donts={[
                        "Put text over dense glyphs or an ink block.",
                        "Use glyph inks for text or status.",
                        "Use flare for warnings or errors.",
                    ]}
                />
            </Section>

            <Section
                id="type"
                kicker="Type"
                title="Typography."
                lead="One voice and one signal: Onest for everything you read, and Departure Mono for the small machine details around it."
                stacked
            >
                <div className="type-grid type-grid-two">
                    <Card variant="plain" data-reveal>
                        <p className="signal muted">Onest · everything you read</p>
                        <p className="type-specimen">Aa</p>
                        <p className="body-lg">{SITE.tagline}</p>
                        <p className="body-text">
                            Titles, navigation, buttons, forms and body copy, in weights 400, 500
                            and 600.
                        </p>
                    </Card>
                    <Card variant="plain" data-reveal>
                        <p className="signal muted">Departure Mono · signals</p>
                        <p className="type-specimen type-specimen-display">01</p>
                        <p className="signal">Oct 27, 2026 · beamcove.com · {SITE.email}</p>
                        <p className="body-text">
                            Kickers, dates, numbers, tags, captions and the wordmark. Only at these
                            sizes: 13px for labels, 22 and 44px for numbers.
                        </p>
                    </Card>
                </div>
            </Section>

            <Section
                id="voice"
                kicker="Voice"
                title="How we write."
                lead="Clear, warm and quietly confident: plain words first, and a little play where the ink is."
                stacked
            >
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
            </Section>
        </SiteLayout>
    );
}
