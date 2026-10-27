# Architecture

The Beamcove website: a multi-page Vite + React 19 + TypeScript static site with
no client-side router, no backend of its own, and one external API call
(newsletter signup). Each page is its own HTML file, built to `dist/` and served
by GitHub Pages at [beamcove.com](https://beamcove.com).

The landing page is the abstract: every section is a short summary that links
to the page holding the full story (fleet, about, values, logbook, contact).

No project is listed publicly yet: the fleet page is an empty shipyard, and a
test fails if a project code or name shows up on any page. Company facts and copy
(boilerplate, mission, vision, values, story) come from the company's About page
in Notion; keep `src/content/` in step with it.

It is built on the Beamcove design system, **Ink & tide** (riso paper, blue and
red overprint splashes, the fitted dot grid, Onest + JetBrains Mono). A copy lives
in [`src/design-system/`](../src/design-system/README.md).

For the day-to-day commands, see the [README](../README.md). For how the site gets
to production, see [deployment.md](deployment.md).

## Repository layout

```
├── index.html, 404.html          Landing page and the Pages 404
├── fleet/ about/ values/ logbook/ contact/ brand/ privacy/ terms/
│                                 One index.html per page (title, description, canonical)
├── public/                       Copied verbatim into dist/
│   ├── boot.js                   Theme + motion flags before first paint (every page)
│   ├── CNAME                     Pins the custom domain in every Pages deployment
│   └── assets/favicon.svg
├── src/
│   ├── entries/                  One tiny module per page: mount(<XPage />)
│   ├── pages/                    Page components (home, fleet, about, …, not-found)
│   ├── content/                  Copy and data shared by pages: site (routes, nav,
│   │                             socials, email, legal name), fleet (kinds of
│   │                             ventures), logbook, values (+ mission, vision, story), faq
│   ├── design-system/            Vendored Ink & tide (see its README)
│   └── app/
│       ├── mount.tsx             CSS imports (in order) + React mount
│       ├── components/           Layout (site-layout/header/footer, page-hero,
│       │                         legal-page) and sections (hero, story, manifesto, …)
│       ├── styles/page.css       Page layout + motion on top of the design system
│       └── utils/                theme.ts (light/dark), motion.ts (reveals, scroll progress)
├── tests/setup.ts                Vitest setup (jest-dom, RTL cleanup, storage polyfill)
└── docs/                         You are here
```

## Pages

| URL         | Component             | Header                  | What's on it                                        |
| ----------- | --------------------- | ----------------------- | --------------------------------------------------- |
| `/`         | `pages/home.tsx`      | Overprint splash (hero) | The abstract: one summary per page, plus dispatches |
| `/fleet/`   | `pages/fleet.tsx`     | Overprint splash        | Empty shipyard (no ships yet), kinds of ships       |
| `/about/`   | `pages/about.tsx`     | Tide splash             | Story, company facts, mission and vision, crew      |
| `/values/`  | `pages/values.tsx`    | Flare splash            | The three values, vision band                       |
| `/logbook/` | `pages/logbook.tsx`   | Plain, overprint band   | Every log entry by year                             |
| `/contact/` | `pages/contact.tsx`   | Plain, tide band        | Email + social channels, full FAQ                   |
| `/brand/`   | `pages/brand.tsx`     | Plain, flare band       | Boilerplate, wordmark rules, colours, type          |
| `/privacy/` | `pages/privacy.tsx`   | Plain (`LegalPage`)     | Privacy policy with contents sidebar                |
| `/terms/`   | `pages/terms.tsx`     | Plain (`LegalPage`)     | Terms of use with contents sidebar                  |
| 404         | `pages/not-found.tsx` | Tide splash             | “Off the map”                                       |

### Adding a page

1. Add the route to `ROUTES` (and `NAV` / `FOOTER_GROUPS` if it should be
   linked) in [`src/content/site.ts`](../src/content/site.ts).
2. Write `src/pages/<name>.tsx` wrapping its content in `<SiteLayout>`.
3. Add `src/entries/<name>.tsx` (`mount(<NamePage />)`).
4. Add `<name>/index.html` (copy another page's; change title, description,
   canonical and the entry script).
5. Add `<name>` to `PAGES` in [`vite.config.ts`](../vite.config.ts).
6. Add it to the `PAGES` list in `src/pages/pages.test.tsx`. That test checks
   every page has one `<h1>` and that every internal link resolves.

## Landing sections

| Section       | File                        | Design-system pieces and motion                                        |
| ------------- | --------------------------- | ---------------------------------------------------------------------- |
| Header        | `site-header.tsx`           | Wordmark, ghost theme toggle, secondary Button; hairline once scrolled |
| Hero          | `hero.tsx`, `beam-dots.tsx` | Overprint `Splash` + glass `Card` (latest log entry); lighthouse dots  |
| Ticker        | `ticker.tsx`                | Mono studio lines with beacon dots, slow marquee                       |
| What we build | `what-we-build.tsx`         | Band `Card`s (band tone = kind of venture), staggered reveal           |
| Our story     | `story.tsx`                 | Section head + `Stat` row (founded, home port, crew)                   |
| Vision        | `manifesto.tsx`             | Night `Splash`; the vision inks in word by word with scroll            |
| Principles    | `principles.tsx`            | Sunken well with the `.bc-dots` paper grid                             |
| Logbook + Qs  | `logbook.tsx`               | Dated log (real dates from git history), `details` accordion           |
| Dispatches    | `dispatches.tsx`            | Tide `Splash`, `TextField`, `Button`, `Callout`                        |
| Footer        | `site-footer.tsx`           | Links, social marks, giant wordmark whose letters set in one by one    |

## Motion

- `public/boot.js` adds `motion` to `<html>` when IntersectionObserver exists and
  the visitor hasn't asked for reduced motion. **Every hidden starting state is
  scoped under `.motion`**, so without it the page is simply static and fully
  visible (this is also why tests see everything).
- `useReveal()` ([utils/motion.ts](../src/app/utils/motion.ts)) adds `is-in`
  to `[data-reveal]` elements as they scroll into view. Plain `data-reveal`
  fades and rises (stagger with `--d`); `data-reveal="fill"` only triggers
  child effects (the footer letters).
- `useScrollProgress()` writes `--p` (0 → 1) for scroll-linked effects (the
  manifesto line).
- `BeamDots` draws on a canvas laid exactly over a splash's fitted dot grid:
  a beam sweeps across every ~7 s and dots light under the mouse. Dots under the
  text stay dim. It only sweeps under `.motion` and while visible.
- Ink rule: the design system says not to animate the ink. Splash gradients
  never move; the hero's triangle and bar print in once on load, like two
  passes through the press, and then stay put.

## Styling

[`mount.tsx`](../src/app/mount.tsx) imports `tokens.css`, then `components.css`, then
`page.css`. Later files build on earlier ones; keep that order.

- **Tokens, never hex.** `page.css` only uses `var(--…)` tokens.
- **Splashes print on paper in both themes.** The design system's tokens flip
  under `[data-theme="dark"]`, so each `Splash` carries `data-theme="light"` to
  keep its form fields, callouts and error text on light-theme tokens.
- **Typography** uses the token classes from `tokens.css` (`title-1`, `body-lg`,
  `mono`, …) and `.bc-eyebrow` for the red beacon-dot eyebrow.

## Theme

The design system themes by `data-theme` on `<html>`. Light is the default. A
small script, [`public/boot.js`](../public/boot.js), loaded in every page's
`<head>`, restores a saved dark
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
| One HTML file per page, no client-side router             | Real URLs and a real 404 on GitHub Pages, each page indexable, no SPA fallback hacks              |
| Content in `src/content/`, not inline in sections         | The landing abstract and the full pages show the same facts, so they share one source             |
