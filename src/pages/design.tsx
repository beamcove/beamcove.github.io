import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Plus } from "lucide";

import { AsciiWord } from "@/app/components/ascii-word";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { Section } from "@/app/components/section";
import { SCENES, type SceneName } from "@/app/components/scenes";
import { SiteLayout } from "@/app/components/site-layout";
import { DESIGN_PRINCIPLES, TYPE_SPECIMENS } from "@/content/design";
import {
    Badge,
    Button,
    Callout,
    Card,
    Face,
    Frame,
    GLYPH_CHARS,
    GlyphField,
    LitLine,
    Mark,
    MARK,
    Meter,
    RAMPS,
    ScrambleText,
    SegmentedControl,
    Shape,
    SHAPE_CHARS,
    Stat,
    Switch,
    TextField,
    type GlyphComposition,
    type InkSlot,
    type FaceEyes,
    type RampName,
    type ShapeName,
} from "@/design-system";
import { drawGlyph } from "@/design-system/glyph/draw";

const TOC = [
    { id: "top", label: "Signal" },
    { id: "principles", label: "Principles" },
    { id: "color", label: "Colour" },
    { id: "type", label: "Type" },
    { id: "glyphs", label: "Glyphs" },
    { id: "symbols", label: "Symbols" },
    { id: "grid", label: "Grid" },
    { id: "components", label: "Components" },
    { id: "scenes", label: "Scenes" },
    { id: "together", label: "Together" },
];

const CORE_TOKENS = [
    "surface-page",
    "surface",
    "surface-raised",
    "surface-sunken",
    "line",
    "line-strong",
    "rule",
    "ink",
    "ink-muted",
    "ink-subtle",
    "beam",
    "flare",
    "success",
    "warning",
    "danger",
    "ink-a",
    "ink-b",
    "ink-c",
    "ink-d",
    "ink-e",
];

const SYMBOLS: ShapeName[] = ["disc", "tri", "square", "heart", "cross", "plus", "dash"];
const FACES: { eyes: FaceEyes; wink?: boolean; ink: InkSlot; label: string }[] = [
    { eyes: "disc", ink: "b", label: "Calm" },
    { eyes: "cross", ink: "c", label: "Lost" },
    { eyes: "plus", ink: "d", label: "Curious" },
    { eyes: "square", ink: "a", label: "Focused" },
    { eyes: "disc", wink: true, ink: "e", label: "Wink" },
];

/** A ramp's glyphs as the art draws them, one 24px cell each, with a gap between. */
function RampStrip({ ramp }: { ramp: RampName }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const glyphs = RAMPS[ramp];
    const CELL_PX = 24;
    const STEP = 40;
    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(glyphs.length * STEP * dpr);
        canvas.height = Math.round(CELL_PX * dpr);
        ctx.scale(dpr, dpr);
        const color = getComputedStyle(canvas).color;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        glyphs.forEach((id, i) => drawGlyph(ctx, id, i * STEP, 0, CELL_PX));
    }, [glyphs]);
    return (
        <canvas
            ref={ref}
            className="ramp-chars"
            style={{ width: glyphs.length * STEP, height: CELL_PX }}
            role="img"
            aria-label={glyphs.map((id) => GLYPH_CHARS[id]).join(" ")}
        />
    );
}

/** One component on its own: a pixel label over a quiet panel. */
function Specimen({ name, wide, children }: { name: string; wide?: boolean; children: ReactNode }) {
    return (
        <figure className={wide ? "specimen specimen-wide" : "specimen"}>
            <figcaption className="signal specimen-label">{name}</figcaption>
            <div className="specimen-body">{children}</div>
        </figure>
    );
}

/** A section of the page, stacked: the heading above, the specimens full width below. */
function DesignSection({
    id,
    eyebrow,
    title,
    lead,
    children,
}: {
    id: string;
    eyebrow: string;
    title: string;
    lead?: string;
    children: ReactNode;
}) {
    return (
        <Section id={id} kicker={eyebrow} title={title} lead={lead} stacked>
            {children}
        </Section>
    );
}

const PAIRS: { value: string; label: string; inks: InkSlot[] }[] = [
    { value: "ab", label: "A+B", inks: ["a", "b"] },
    { value: "cd", label: "C+D", inks: ["c", "d"] },
    { value: "ea", label: "E+A", inks: ["e", "a"] },
    { value: "bce", label: "B+C+E", inks: ["b", "c", "e"] },
];
const DENSITY = { sparse: 0.32, medium: 0.52, dense: 0.74 } as const;

/** A live glyph field with the design system's own controls. */
function Playground() {
    const [ramp, setRamp] = useState<RampName>("signal");
    const [pair, setPair] = useState("ab");
    const [density, setDensity] = useState<keyof typeof DENSITY>("medium");
    const [beam, setBeam] = useState(true);
    const [blocks, setBlocks] = useState(true);
    const [seed, setSeed] = useState(17);

    const composition = useMemo<GlyphComposition>(() => {
        const inks: InkSlot[] = PAIRS.find((p) => p.value === pair)?.inks ?? ["a", "b"];
        return {
            seed,
            inks,
            ramp,
            density: DENSITY[density],
            blocks: blocks
                ? [
                      { x: 0.62, y: 0, w: 0.2, h: 0.46, ink: inks[0]! },
                      { x: 0.74, y: 0.38, w: 0.26, h: 0.4, ink: inks[1]! },
                  ]
                : [],
        };
    }, [seed, pair, ramp, density, blocks]);

    return (
        <div className="playground">
            <div className="playground-stage bc-glyphs">
                <GlyphField composition={composition} beam={beam} quiet={false} />
            </div>
            <div className="playground-controls">
                <div className="control">
                    <span className="caption muted">Ramp</span>
                    <SegmentedControl
                        label="Ramp"
                        value={ramp}
                        onChange={setRamp}
                        options={Object.keys(RAMPS) as RampName[]}
                    />
                </div>
                <div className="control">
                    <span className="caption muted">Inks</span>
                    <SegmentedControl
                        label="Inks"
                        value={pair}
                        onChange={setPair}
                        options={PAIRS}
                    />
                </div>
                <div className="control">
                    <span className="caption muted">Density</span>
                    <SegmentedControl
                        label="Density"
                        value={density}
                        onChange={setDensity}
                        options={Object.keys(DENSITY) as (keyof typeof DENSITY)[]}
                    />
                </div>
                <div className="control control-row">
                    <Switch label="Beam" checked={beam} onChange={setBeam} />
                    <Switch label="Ink blocks" checked={blocks} onChange={setBlocks} />
                    <Button variant="secondary" size="sm" onClick={() => setSeed((s) => s + 1)}>
                        Reseed
                    </Button>
                    <span className="mono muted">seed {seed}</span>
                </div>
            </div>
        </div>
    );
}

function ScrambleDemo() {
    const [run, setRun] = useState(0);
    return (
        <div className="stack">
            <p className="title-2">
                <ScrambleText key={run} text="Charting new horizons." trigger="mount" />
            </p>
            <div>
                <Button variant="ghost" size="sm" onClick={() => setRun((r) => r + 1)}>
                    Replay
                </Button>
            </div>
        </div>
    );
}

function SignupPanel() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    return (
        <Card variant="splash" className="together-panel">
            <GlyphField composition={SCENES.contact} quiet={false} />
            <div className="together-panel-body">
                <p className="bc-eyebrow">Example · early access</p>
                <p className="title-2">Join the waitlist.</p>
                <Meter value={68} label="Spots taken" valueText="68 / 100" />
                {sent ? (
                    <Callout tone="success" title="You’re on the list.">
                        This is a demo, so nothing was sent.
                    </Callout>
                ) : (
                    <form
                        className="together-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSent(true);
                        }}
                    >
                        <TextField
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            hint="Demo only: nothing leaves this page."
                        />
                        <Button type="submit">Join</Button>
                    </form>
                )}
            </div>
        </Card>
    );
}

const DASHBOARD = [
    {
        name: "Example A",
        status: "Live",
        tone: "success",
        value: "99.9",
        unit: "%",
        series: [4, 6, 5, 7, 8, 7, 9, 9],
    },
    {
        name: "Example B",
        status: "Building",
        tone: "beam",
        value: "142",
        unit: "ms",
        series: [9, 7, 8, 6, 5, 6, 4, 3],
    },
    {
        name: "Example C",
        status: "Paused",
        tone: "warning",
        value: "12",
        unit: "tasks",
        series: [3, 3, 5, 4, 6, 5, 5, 6],
    },
] as const;

function Dashboard() {
    const [range, setRange] = useState("7d");
    return (
        <div className="dashboard">
            <div className="dashboard-bar">
                <p className="headline">Sample dashboard</p>
                <SegmentedControl
                    label="Range"
                    value={range}
                    onChange={setRange}
                    options={["24h", "7d", "30d"]}
                />
            </div>
            <div className="dashboard-grid">
                {DASHBOARD.map((item) => (
                    <Card key={item.name} variant="framed" className="dashboard-card">
                        <div className="dashboard-card-head">
                            <span className="mono">{item.name}</span>
                            <Badge tone={item.tone} dot>
                                {item.status}
                            </Badge>
                        </div>
                        <Stat
                            value={item.value}
                            unit={item.unit}
                            series={[...item.series]}
                            caption={`last ${range}`}
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function DesignPage() {
    return (
        <SiteLayout chapters={TOC}>
            <PageHero scene="design" eyebrow="Design system" title="Signal.">
                Beamcove’s design language: a night sky, a lighthouse and a field of glyphs. Every
                piece on its own, then all of them together.
            </PageHero>

            <DesignSection id="principles" eyebrow="Principles" title="Six rules.">
                <ol className="principles">
                    {DESIGN_PRINCIPLES.map((p, i) => (
                        <li key={p.title} data-reveal>
                            <Card variant="framed">
                                <span className="principle-n">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 className="headline">{p.title}</h3>
                                <p className="muted">{p.body}</p>
                            </Card>
                        </li>
                    ))}
                </ol>
            </DesignSection>

            <DesignSection
                id="color"
                eyebrow="Colour"
                title="One night, five inks."
                lead="Signal has one theme: an ink-blue night with warm text, a beam for actions, a flare for the one highlight, and five quiet inks that only ever print glyph art."
            >
                <ul className="token-grid">
                    {CORE_TOKENS.map((token) => (
                        <li key={token}>
                            <span
                                className="token-chip"
                                style={{ background: `var(--${token})` }}
                                aria-hidden="true"
                            />
                            <span className="mono">{token}</span>
                        </li>
                    ))}
                </ul>
            </DesignSection>

            <DesignSection
                id="grid"
                eyebrow="Grid"
                title="The page is the grid."
                lead="One 16px dot matrix runs through the whole page, centred so both margins match on any screen. Every scene prints onto it: a section’s glyphs sit exactly over the page’s dots, and as the next section moves up the screen, its scene sweeps up over it on a wave, bottom first, following your scroll. Copy stays quiet, ink blocks print whole or not at all."
            >
                <div className="grid-demo">
                    {(["hero", "mission", "values"] as SceneName[]).map((name) => (
                        <figure key={name} className="grid-frame">
                            <div className="grid-frame-art bc-glyphs">
                                <GlyphField composition={SCENES[name]} quiet={false} />
                            </div>
                            <figcaption className="signal">{name}</figcaption>
                        </figure>
                    ))}
                </div>
                <div className="lit-demo">
                    <p className="signal">LitLine</p>
                    <LitLine text="Make things people are glad exist." />
                </div>
            </DesignSection>

            <DesignSection
                id="type"
                eyebrow="Type"
                title="Two faces."
                lead="Onest for everything you read. Departure Mono only for signals: kickers, dates, numbers, tags and the wordmark, at 13px for labels and 22 or 44px for numbers. Each block switches face at most once."
            >
                <ul className="type-scale">
                    {TYPE_SPECIMENS.map((t) => (
                        <li key={t.cls}>
                            <span className="mono muted type-scale-meta">
                                .{t.cls}
                                <br />
                                {t.note}
                            </span>
                            <span className={t.cls}>{t.sample}</span>
                        </li>
                    ))}
                </ul>
            </DesignSection>

            <DesignSection
                id="glyphs"
                eyebrow="Glyphs"
                title="The alphabet."
                lead="Five ramps run light to dense. Values from layered noise pick the glyph; solid ink blocks cut through."
            >
                <ul className="ramps">
                    {(Object.keys(RAMPS) as RampName[]).map((name) => (
                        <li key={name}>
                            <span className="mono muted">{name}</span>
                            <RampStrip ramp={name} />
                        </li>
                    ))}
                </ul>
                <Playground />
            </DesignSection>

            <DesignSection
                id="symbols"
                eyebrow="Symbols"
                title="Shapes everyone knows."
                lead="Seven symbols, drawn bold and round on one 16px cell, the same shapes the glyph art prints. ● ▲ ■ are the mark and the three kinds of work; ♥ is for the things we love; ✕, + and the dash make faces and status. No new symbols: if a shape needs explaining, it isn’t one of ours."
            >
                <ul className="symbol-grid">
                    {SYMBOLS.map((name) => (
                        <li key={name}>
                            <Shape name={name} size={48} />
                            <span className="signal muted">
                                {SHAPE_CHARS[name]} {name}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="symbol-row">
                    <figure className="symbol-figure">
                        <Mark size={32} label="The Beamcove mark" />
                        <figcaption className="signal muted">The mark</figcaption>
                    </figure>
                    <ul className="symbol-kinds">
                        {MARK.map((m) => (
                            <li key={m.name}>
                                <Shape name={m.name} ink={m.ink} />
                                <span>For {m.kind}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <ul className="face-grid">
                    {FACES.map((f) => (
                        <li key={f.label}>
                            <Face eyes={f.eyes} wink={f.wink} ink={f.ink} size={16} />
                            <span className="signal muted">{f.label}</span>
                        </li>
                    ))}
                </ul>
            </DesignSection>

            <DesignSection
                id="components"
                eyebrow="Components"
                title="Every piece."
                lead="Solid keys, quiet panels, one voice. Each one alone, in every state."
            >
                <div className="specimens">
                    <Specimen name="Button" wide>
                        <div className="bc-row">
                            <Button iconRight={<Icon node={ArrowRight} />}>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="tonal" iconLeft={<Icon node={Plus} />}>
                                Tonal
                            </Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Delete</Button>
                        </div>
                        <div className="bc-row">
                            <Button size="lg">Large</Button>
                            <Button size="sm" variant="secondary">
                                Small
                            </Button>
                            <Button variant="secondary" iconOnly aria-label="Add">
                                <Icon node={Plus} />
                            </Button>
                            <Button disabled>Disabled</Button>
                        </div>
                    </Specimen>
                    <Specimen name="Badge">
                        <div className="bc-row">
                            <Badge>Neutral</Badge>
                            <Badge tone="beam" dot>
                                Beam
                            </Badge>
                            <Badge tone="success">Success</Badge>
                            <Badge tone="warning">Warning</Badge>
                            <Badge tone="danger">Danger</Badge>
                            <Badge tone="flare">Now</Badge>
                        </div>
                    </Specimen>
                    <Specimen name="Switch">
                        <div className="bc-row">
                            <Switch label="On" defaultChecked />
                            <Switch label="Off" />
                            <Switch label="Disabled" disabled />
                        </div>
                    </Specimen>
                    <Specimen name="Text field" wide>
                        <div className="field-grid">
                            <TextField label="Default" placeholder="you@example.com" />
                            <TextField
                                label="With a hint"
                                hint="We only use it to send the newsletter."
                            />
                            <TextField
                                label="With an error"
                                defaultValue="you@"
                                error="That email doesn’t look right."
                            />
                            <TextField label="Disabled" disabled placeholder="Not now" />
                        </div>
                    </Specimen>
                    <Specimen name="Segmented control">
                        <SegmentedControl label="View" options={["Grid", "List", "Board"]} />
                    </Specimen>
                    <Specimen name="Cursor and keys">
                        <div className="bc-row">
                            <span className="mono">
                                ready
                                <span className="bc-cursor" aria-hidden="true" />
                            </span>
                            <span className="bc-kbd">⌘</span>
                            <span className="bc-kbd">K</span>
                        </div>
                    </Specimen>
                    <Specimen name="Callout" wide>
                        <div className="callout-grid">
                            <Callout tone="info" title="Info">
                                Something worth knowing.
                            </Callout>
                            <Callout tone="success" title="Success">
                                It worked.
                            </Callout>
                            <Callout tone="warning" title="Warning">
                                Check this first.
                            </Callout>
                            <Callout tone="danger" title="Danger">
                                This can’t be undone.
                            </Callout>
                        </div>
                    </Specimen>
                    <Specimen name="Stat">
                        <div className="bc-row stat-row">
                            <Stat
                                label="Uptime"
                                value="99.9"
                                unit="%"
                                delta="0.2%"
                                trend="up"
                                series={[3, 4, 4, 6, 5, 7, 8]}
                            />
                            <Stat
                                label="Latency"
                                value="142"
                                unit="ms"
                                delta="8ms"
                                trend="down"
                                series={[8, 7, 7, 5, 6, 4, 4]}
                            />
                        </div>
                    </Specimen>
                    <Specimen name="Meter">
                        <div className="stack">
                            <Meter value={64} label="Build" />
                            <Meter value={37} label="Upload" size="lg" columns={18} />
                        </div>
                    </Specimen>
                    <Specimen name="Card" wide>
                        <div className="card-grid">
                            <Card variant="plain" eyebrow="Plain" title="A filled panel">
                                For one idea.
                            </Card>
                            <Card variant="framed" eyebrow="Framed" title="An open frame">
                                Corner ticks, no fill.
                            </Card>
                            <Card
                                variant="art"
                                media={<GlyphField composition={SCENES.play} quiet={false} />}
                                title="With art"
                                interactive
                            >
                                A glyph strip on top. Hover me.
                            </Card>
                        </div>
                    </Specimen>
                    <Specimen name="Frame">
                        <Frame label="status" className="frame-demo">
                            <span className="mono">┌ all systems nominal ┐</span>
                        </Frame>
                    </Specimen>
                    <Specimen name="Scramble text">
                        <ScrambleDemo />
                    </Specimen>
                    <Specimen name="Glyph wordmark" wide>
                        <AsciiWord text="Beamcove" seed={3} />
                    </Specimen>
                </div>
            </DesignSection>

            <DesignSection
                id="scenes"
                eyebrow="Scenes"
                title="Every scene on the site."
                lead="Each names two or three ink slots and keeps its blocks near the edges, clear of the copy."
            >
                <ul className="composition-grid">
                    {(Object.keys(SCENES) as SceneName[]).map((name) => (
                        <li key={name}>
                            <div className="composition-stage bc-glyphs">
                                <GlyphField composition={SCENES[name]} quiet={false} pointer />
                            </div>
                            <div className="composition-meta">
                                <span className="mono">{name}</span>
                                <span
                                    className="composition-inks"
                                    aria-label={`Inks ${SCENES[name].inks.join(", ")}`}
                                >
                                    {SCENES[name].inks.map((ink) => (
                                        <i
                                            key={ink}
                                            style={{ background: `var(--ink-${ink})` }}
                                            title={ink}
                                        />
                                    ))}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </DesignSection>

            <DesignSection
                id="together"
                eyebrow="Together"
                title="All at once."
                lead="The pieces composed into the kind of screens they’re for. Sample data only."
            >
                <div className="together">
                    <SignupPanel />
                    <Dashboard />
                </div>
            </DesignSection>
        </SiteLayout>
    );
}
