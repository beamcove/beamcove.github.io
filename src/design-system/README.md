# Vendored design system

A copy of the Beamcove design system ("Ink & tide") from the sibling
`design-system` repository (branch `ink-drift-and-card-rings`, commit `f21010e`). Read that repo's README for
the rules: one printed splash per view, tokens never hex, sentence case, etc.

| file             | source                                   | edit here?                  |
| ---------------- | ---------------------------------------- | --------------------------- |
| `tokens.css`     | `tokens.css`                             | no — copy again on update   |
| `components.css` | `components/bundle.css`                  | no — copy again on update   |
| `fonts/`         | `fonts/` (Onest, JetBrains Mono)         | no                          |
| `components/`    | typed TSX port of `components/bundle.js` | yes, keep behaviour in sync |

Only the components the site uses are ported (Badge, Button, Callout, Card,
DotMeter, Splash, Stat, TextField). Port others from `bundle.js` when needed.

Differences from `bundle.js`: `Button` renders an `<a>` whenever it has an
`href`; `Splash` takes `titleAs` (`h1` for the page hero) and renders non-string
children as-is so it can hold a form, plus an `art` slot for extra layers;
`DotMeter` puts `--col` on each dot (for staggered fills); `TextField` uses
React's `useId`.
