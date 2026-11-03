import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Plus } from "lucide";

import { AsciiWord } from "@/app/components/ascii-word";
import { ChapterHead } from "@/app/components/chapter-head";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { Scene } from "@/app/components/scene";
import { SCENES, type SceneName } from "@/app/components/scenes";
import { SiteLayout } from "@/app/components/site-layout";
import { DESIGN_PRINCIPLES, TYPE_SPECIMENS } from "@/content/design";
import {
    Badge,
    Button,
    Callout,
    Card,
    Frame,
    GLYPH_CHARS,
    GlyphField,
    LitLine,
    Meter,
    RAMPS,
    ScrambleText,
    SegmentedControl,
    Stat,
    Switch,
    TextField,
    Window,
    type GlyphComposition,
    type InkSlot,
    type RampName,
} from "@/design-system";

const TOC = [
    { id: "top", label: "Signal" },
    { id: "principles", label: "Principles" },
    { id: "color", label: "Colour" },
    { id: "type", label: "Type" },
    { id: "glyphs", label: "Glyphs" },
    { id: "stage", label: "Stage" },
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

/** One component on its own, in a window of its own. */
function Specimen({ name, wide, children }: { name: string; wide?: boolean; children: ReactNode }) {
    return (
        <Window
            title={name}
            className={wide ? "specimen specimen-wide" : "specimen"}
            bodyClassName="specimen-body"
        >
            {children}
        </Window>
    );
}

function Section({
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
        <section className="design-section" id={id} aria-labelledby={`${id}-title`}>
            <ChapterHead id={id} kicker={eyebrow} title={title}>
                {lead}
            </ChapterHead>
            {children}
        </section>
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

            <Scene name="reading" className="design">
                <div className="wrap">
                    <div className="design-body" data-quiet>
                        <Section id="principles" eyebrow="Principles" title="Five rules.">
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
                        </Section>

                        <Section
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
                        </Section>

                        <Section
                            id="stage"
                            eyebrow="Stage"
                            title="One field per page."
                            lead="Every page has one glyph Stage behind it. Each Screen names a scene, and the stage dissolves to it as the screen arrives, cell by cell, from the bottom up. Glyphs thin out behind anything marked quiet, and ink blocks keep clear of it. Pinned screens hold still while a sentence lights up, word by word."
                        >
                            <div className="stage-demo">
                                {(["hero", "mission", "values"] as SceneName[]).map((name) => (
                                    <figure key={name} className="stage-frame">
                                        <div className="stage-frame-art bc-glyphs">
                                            <GlyphField composition={SCENES[name]} quiet={false} />
                                        </div>
                                        <figcaption className="caption">{name}</figcaption>
                                    </figure>
                                ))}
                            </div>
                            <div className="lit-demo">
                                <p className="kicker-plain">LitLine</p>
                                <LitLine text="Make things people are glad exist." />
                            </div>
                        </Section>

                        <Section
                            id="type"
                            eyebrow="Type"
                            title="Three faces."
                            lead="Departure Mono for display, JetBrains Mono for the interface, Onest for reading."
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
                        </Section>

                        <Section
                            id="glyphs"
                            eyebrow="Glyphs"
                            title="The alphabet."
                            lead="Four ramps run light to dense. Values from layered noise pick the glyph; solid ink blocks cut through."
                        >
                            <ul className="ramps">
                                {(Object.keys(RAMPS) as RampName[]).map((name) => (
                                    <li key={name}>
                                        <span className="mono muted">{name}</span>
                                        <span className="ramp-chars" aria-hidden="true">
                                            {RAMPS[name].map((id) => GLYPH_CHARS[id]).join(" ")}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Playground />
                        </Section>

                        <Section
                            id="components"
                            eyebrow="Components"
                            title="Every piece."
                            lead="Bold rules, rounded keys, square windows. Each one alone, in every state."
                        >
                            <div className="specimens">
                                <Specimen name="Button" wide>
                                    <div className="bc-row">
                                        <Button iconRight={<Icon node={ArrowRight} />}>
                                            Primary
                                        </Button>
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
                                        <TextField
                                            label="Disabled"
                                            disabled
                                            placeholder="Not now"
                                        />
                                    </div>
                                </Specimen>
                                <Specimen name="Segmented control">
                                    <SegmentedControl
                                        label="View"
                                        options={["Grid", "List", "Board"]}
                                    />
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
                                        <Card
                                            variant="plain"
                                            eyebrow="Plain"
                                            title="A filled panel"
                                        >
                                            For one idea.
                                        </Card>
                                        <Card
                                            variant="framed"
                                            eyebrow="Framed"
                                            title="An open frame"
                                        >
                                            Corner ticks, no fill.
                                        </Card>
                                        <Card
                                            variant="art"
                                            media={
                                                <GlyphField
                                                    composition={SCENES.play}
                                                    quiet={false}
                                                />
                                            }
                                            title="With art"
                                            interactive
                                        >
                                            A glyph strip on top. Hover me.
                                        </Card>
                                    </div>
                                </Specimen>
                                <Specimen name="Window">
                                    <Window title="Untitled" meta="2 items" onClose={() => {}}>
                                        <p className="muted">
                                            A system window: a bold rule, a 2px drop and a striped
                                            bar.
                                        </p>
                                    </Window>
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
                        </Section>

                        <Section
                            id="scenes"
                            eyebrow="Scenes"
                            title="Every scene on the site."
                            lead="Each names two or three ink slots and keeps its blocks near the edges, clear of the copy."
                        >
                            <ul className="composition-grid">
                                {(Object.keys(SCENES) as SceneName[]).map((name) => (
                                    <li key={name}>
                                        <div className="composition-stage bc-glyphs">
                                            <GlyphField
                                                composition={SCENES[name]}
                                                quiet={false}
                                                pointer
                                            />
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
                        </Section>

                        <Section
                            id="together"
                            eyebrow="Together"
                            title="All at once."
                            lead="The pieces composed into the kind of screens they’re for. Sample data only."
                        >
                            <div className="together">
                                <SignupPanel />
                                <Dashboard />
                            </div>
                        </Section>
                    </div>
                </div>
            </Scene>
        </SiteLayout>
    );
}
