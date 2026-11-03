# Vendored design system

A copy of the Beamcove design system ("Signal") from the sibling
`design-system` repository. Read that repo's README for the rules: one glyph
splash per view, tokens never hex, ink slots in art, sentence case, etc.

| file             | source                                           | edit here?                      |
| ---------------- | ------------------------------------------------ | ------------------------------- |
| `tokens.css`     | `tokens.css` (built from `tokens.json`)          | no — copy again on update       |
| `components.css` | `components/bundle.css`                          | no — copy again on update       |
| `fonts/`         | `fonts/` (Departure Mono, JetBrains Mono, Onest) | no                              |
| `components/`    | typed TSX port                                   | yes — the source of `bundle.js` |
| `glyph/`         | the glyph engine (noise, ramps, drawing)         | yes — the source of `bundle.js` |

The TSX port is now the source of the design system's `components/bundle.js`:
after changing it, regenerate the bundle (see the design-system README →
"Building").

Differences from the old port: `Splash` takes a glyph `field` (and `beam`)
instead of a tone; `Card` variants are `plain`, `framed`, `art` (with `media`)
and `splash`; `DotMeter` is now `Meter` (a `█▓▒░` bar; the old name still
works); new `Frame`, `Switch`, `SegmentedControl`, `GlyphField` and
`ScrambleText`.
