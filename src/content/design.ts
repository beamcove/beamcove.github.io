/** Copy for the Design page: the rules of Signal, Beamcove's design language. */

export const DESIGN_PRINCIPLES = [
    {
        title: "One idea per screen.",
        body: "A page is a sequence of screens. Each carries one thought, set large, with room around it.",
    },
    {
        title: "One field per page.",
        body: "A single glyph stage sits behind everything and changes scene as you scroll. Nothing else decorates.",
    },
    {
        title: "Copy stays quiet.",
        body: "Glyphs thin out behind text and ink blocks keep clear of it. Text never sits on ink.",
    },
    {
        title: "Calm, not loud.",
        body: "One dark theme, warm text, quiet inks used like light at night. Bold rules, never neon.",
    },
    {
        title: "Motion is a signal.",
        body: "The stage dissolves, a beam sweeps, statements light up as you read. All of it stops when you ask for less motion.",
    },
];

export const TYPE_SPECIMENS = [
    { cls: "display", note: "Departure Mono 88", sample: "Signal" },
    { cls: "title-1", note: "Departure Mono 66", sample: "Chapter title." },
    { cls: "title-2", note: "Departure Mono 44", sample: "A value, a statement." },
    { cls: "title-3", note: "JetBrains Mono 24 / 600", sample: "Entry and card titles" },
    { cls: "headline", note: "JetBrains Mono 17 / 600", sample: "Questions and list titles" },
    {
        cls: "body-lg",
        note: "Onest 19",
        sample: "Lead paragraphs read in a calm sans, so long copy stays easy.",
    },
    { cls: "body", note: "Onest 16", sample: "Body copy sits beside titles and inside cards." },
    { cls: "label", note: "JetBrains Mono 13 / 500", sample: "Form label" },
    { cls: "mono", note: "JetBrains Mono 13", sample: "beamcove.com · Oct 27, 2026" },
    { cls: "caption", note: "JetBrains Mono 12", sample: "Captions and fine print" },
] as const;
