/** Copy for the Design page: the rules of Signal, Beamcove's design language. */

export const DESIGN_PRINCIPLES = [
    {
        title: "Show the machine.",
        body: "Glyphs, grids, prompts and cursors are the decoration. Nothing hides behind gloss, blur or gradients.",
    },
    {
        title: "One field per view.",
        body: "Each view gets one glyph splash. Everything else is canvas, text and a few rules.",
    },
    {
        title: "Slots, not colours.",
        body: "Art names ink slots A to E, never colours, so every theme re-inks the same print.",
    },
    {
        title: "Copy stays quiet.",
        body: "Text sits on the calm side of a field. Glyphs thin out behind it and never print over it.",
    },
    {
        title: "Motion is a signal.",
        body: "Fields shimmer, a beam sweeps, titles decode once. All of it stops when you ask for less motion.",
    },
];

export const TYPE_SPECIMENS = [
    { cls: "display", note: "Departure Mono 66", sample: "Signal" },
    { cls: "title-1", note: "JetBrains Mono 40 / 600", sample: "Section title." },
    { cls: "title-2", note: "JetBrains Mono 28 / 600", sample: "Sub-section title." },
    { cls: "title-3", note: "JetBrains Mono 20 / 600", sample: "Small heading." },
    { cls: "headline", note: "JetBrains Mono 15 / 600", sample: "Card and list titles" },
    {
        cls: "body-lg",
        note: "Onest 17",
        sample: "Lead paragraphs read in a calm sans, so long copy stays easy.",
    },
    { cls: "body", note: "Onest 15", sample: "Body copy sits beside titles and inside cards." },
    { cls: "label", note: "JetBrains Mono 13 / 500", sample: "Form label" },
    { cls: "mono", note: "JetBrains Mono 13", sample: "beamcove.com · Oct 27, 2026" },
    { cls: "caption", note: "JetBrains Mono 12", sample: "Captions and fine print" },
] as const;
