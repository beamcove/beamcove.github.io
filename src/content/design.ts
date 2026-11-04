/** Copy for the Design page: the rules of Signal, Beamcove's design language. */

export const DESIGN_PRINCIPLES = [
    {
        title: "The page is the grid.",
        body: "One dot matrix runs through every page, centred on any screen. Every glyph and ink block prints onto it.",
    },
    {
        title: "Art belongs to its section.",
        body: "Each section prints its own scene and it scrolls with the content, like ink on paper. As the next section moves up the screen, its scene sweeps over it on a wave.",
    },
    {
        title: "Copy stays quiet.",
        body: "Glyphs thin out behind text; ink blocks print whole, or not at all if they'd touch it. On reading pages the art lives in the margins.",
    },
    {
        title: "One voice, one signal.",
        body: "Onest for everything you read. Bitcount Grid Double only for the small machine details: kickers, dates, numbers.",
    },
    {
        title: "Shapes everyone knows.",
        body: "Glyphs are chunky: bold strokes, round ends, soft corners. Symbols are only shapes you already know: ● ▲ ■ ♥ ✕ + and a dash.",
    },
    {
        title: "Solid and calm.",
        body: "Keys are solid fills, panels are quiet, one dark theme with five soft inks. Nothing shouts.",
    },
];

export const TYPE_SPECIMENS = [
    { cls: "display", note: "Onest 72 / 600", sample: "Signal" },
    { cls: "title-1", note: "Onest 48 / 600", sample: "Page title." },
    { cls: "title-2", note: "Onest 32 / 600", sample: "Section title." },
    { cls: "title-3", note: "Onest 22 / 600", sample: "Entry and card titles" },
    { cls: "headline", note: "Onest 17 / 600", sample: "Questions and list titles" },
    {
        cls: "body-lg",
        note: "Onest 19",
        sample: "Lead paragraphs read in a calm sans, so long copy stays easy.",
    },
    { cls: "body", note: "Onest 16", sample: "Body copy sits beside titles and inside cards." },
    { cls: "label", note: "Onest 14 / 500", sample: "Form label" },
    { cls: "signal", note: "Bitcount Grid Double 13", sample: "01 · What we do · Oct 27, 2026" },
    { cls: "signal-lg", note: "Bitcount Grid Double 22", sample: "01 / 03" },
    { cls: "signal-xl", note: "Bitcount Grid Double 44", sample: "99.9" },
] as const;
