# Architecture

The Beamcove landing page: a single-page Vite + React 19 + TypeScript site with no
router, no backend of its own, and one external API call (newsletter signup). It is
built to `dist/` and served as static files by GitHub Pages at
[beamcove.com](https://beamcove.com).

It is built on the Beamcove design system, **Ink & tide** (riso paper, blue and
red overprint splashes, the fitted dot grid, Onest + JetBrains Mono). A copy lives
in [`src/design-system/`](../src/design-system/README.md).

For the day-to-day commands, see the [README](../README.md). For how the site gets
to production, see [deployment.md](deployment.md).

## Repository layout

```
├── index.html                    Head metadata, theme boot script, #root
├── public/                       Copied verbatim into dist/
│   ├── CNAME                     Pins the custom domain in every Pages deployment
│   └── assets/favicon.svg
├── src/
│   ├── main.tsx                  Entry: CSS imports + React mount
│   ├── design-system/            Vendored Ink & tide (see its README)
│   │   ├── tokens.css            Colour, type, space, radius, splash tokens + @font-face
│   │   ├── components.css        Component CSS (bc-* classes), grain images
│   │   ├── fonts/                Onest, JetBrains Mono (variable woff2)
│   │   ├── components/           Typed TSX port of the component bundle
│   │   └── index.ts              Badge, Button, Callout, Card, DotMeter, Splash, TextField
│   └── app/
│       ├── app.tsx               Composition root
│       ├── links.ts              In-page nav links (header + footer)
│       ├── components/           One file per section, plus icon / theme toggle / brand
│       ├── styles/page.css       Page layout + motion on top of the design system
│       └── utils/theme.ts        Light/dark theme read + apply + persist
├── tests/setup.ts                Vitest setup (jest-dom, RTL cleanup, storage polyfill)
└── docs/                         You are here
```

## Page structure

| Section       | File                        | Design-system pieces and motion                                          |
| ------------- | --------------------------- | ------------------------------------------------------------------------ |
| Header        | `site-header.tsx`           | Wordmark, ghost theme toggle, secondary Button; hairline once scrolled   |
| Hero          | `hero.tsx`, `beam-dots.tsx` | Overprint `Splash` + glass `Card`; shapes print in once; lighthouse dots |
| Ticker        | `ticker.tsx`                | Mono fleet news with beacon dots, slow marquee                           |
| What we build | `what-we-build.tsx`         | Band `Card`s (band tone = kind of venture), staggered reveal             |
| How we work   | `voyage.tsx`                | Four stages; the dotted route draws and each port lights up              |
| Fleet         | `fleet.tsx`                 | Band + plain `Card`s, `Badge`, `DotMeter` that fills in view             |
| Our bearing   | `manifesto.tsx`             | Night `Splash`; the line inks in word by word with scroll                |
| Principles    | `principles.tsx`            | Sunken well with the `.bc-dots` paper grid                               |
| Logbook + Qs  | `logbook.tsx`               | Dated log (real dates from git history), `details` accordion             |
| Dispatches    | `dispatches.tsx`            | Tide `Splash`, `TextField`, `Button`, `Callout`                          |
| Footer        | `site-footer.tsx`           | Links, social marks, giant wordmark whose letters set in one by one      |

## Motion

- `index.html` adds `motion` to `<html>` when IntersectionObserver exists and
  the visitor hasn't asked for reduced motion. **Every hidden starting state is
  scoped under `.motion`**, so without it the page is simply static and fully
  visible (this is also why tests see everything).
- `useReveal()` ([utils/motion.ts](../src/app/utils/motion.ts)) adds `is-in`
  to `[data-reveal]` elements as they scroll into view. Plain `data-reveal`
  fades and rises (stagger with `--d`); `data-reveal="fill"` only triggers
  child effects (meter fills, the voyage route, footer letters).
- `useScrollProgress()` writes `--p` (0 → 1) for scroll-linked effects (the
  manifesto line).
- `BeamDots` draws on a canvas laid exactly over a splash's fitted dot grid:
  a beam sweeps across every ~7 s and dots light under the mouse. Dots under the
  text stay dim. It only sweeps under `.motion` and while visible.
- Ink rule: the design system says not to animate the ink. Splash gradients
  never move; the hero's triangle and bar print in once on load, like two
  passes through the press, and then stay put.

## Styling

[`main.tsx`](../src/main.tsx) imports `tokens.css`, then `components.css`, then
`page.css`. Later files build on earlier ones; keep that order.

- **Tokens, never hex.** `page.css` only uses `var(--…)` tokens.
- **Splashes print on paper in both themes.** The design system's tokens flip
  under `[data-theme="dark"]`, so each `Splash` carries `data-theme="light"` to
  keep its form fields, callouts and error text on light-theme tokens.
- **Typography** uses the token classes from `tokens.css` (`title-1`, `body-lg`,
  `mono`, …) and `.bc-eyebrow` for the red beacon-dot eyebrow.

## Theme

The design system themes by `data-theme` on `<html>`. Light is the default. A
small inline script in [`index.html`](../index.html) restores a saved dark
choice (`localStorage["bc-theme"]`) before first paint; the header's
`ThemeToggle` flips and saves it.

## Icons

Lucide is the design system's stand-in icon set. [`icon.tsx`](../src/app/components/icon.tsx)
renders a Lucide icon node (`import { Compass } from "lucide"`) as an inline SVG
with the system's 1.75px stroke. Only imported icons end up in the bundle. Social
glyphs live in [`brand.tsx`](../src/app/components/brand.tsx) because Lucide
dropped most brand icons.

## Newsletter

`Dispatches` posts `{ email }` to `https://roster.beamcove.com/subscribers`.
It validates locally first, shows a success `Callout` on a 2xx, and an error with
a next step otherwise.

## TypeScript & module conventions

- Strict mode plus `noUncheckedIndexedAccess` and `noImplicitReturns`
  ([tsconfig.app.json](../tsconfig.app.json)). No `baseUrl` — `paths` resolves
  relative to the tsconfig (TS 6 deprecates `baseUrl`).
- `@/*` aliases `src/*`. The alias is defined once in `tsconfig.app.json`;
  `vite-tsconfig-paths` makes Vite and Vitest honor it.
- Named exports everywhere.
- React named imports (`import { useState } from "react"`); there is no
  `esModuleInterop`, so `import React from "react"` will not type-check.

## Key decisions

| Decision                                                  | Rationale                                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Vite + GitHub Actions deploy instead of committing builds | Keeps `main` source-only; Pages serves the workflow artifact (see [deployment.md](deployment.md)) |
| Vendor the design system instead of linking to it         | The design-system repo is separate; CI needs everything in this repo                              |
| Port the components to TSX instead of loading bundle.js   | `bundle.js` expects a global `React` and has no types; the port is typed and tree-shaken          |
| Self-hosted fonts                                         | Comes with the design system; no third-party font requests                                        |
| No router / state library / data layer                    | One static page; the only state is the newsletter form and the theme                              |
