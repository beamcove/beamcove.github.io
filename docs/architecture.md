# Architecture

The Beamcove website: a multi-page Vite + React 19 + TypeScript static site with
no client-side router, no backend of its own, and one external API call
(newsletter signup). Each page is its own HTML file, built to `dist/` and served
by GitHub Pages at [beamcove.com](https://beamcove.com).

The landing page is the abstract: every section is a short summary that links
to the page holding the full story (projects, about, contact). Values live on
the About page (`/about/#values`).

No project is listed publicly yet: the projects page is empty, and a
test fails if a project code or name shows up on any page. Company facts and copy
(boilerplate, mission, vision, values, story) come from the company's About page
in Notion; keep `src/content/` in step with it.

It is built on the Beamcove design system, **Signal** (a terminal printed in
neon: glyph fields cut by ink blocks, five colour themes, Departure Mono +
JetBrains Mono + Onest). A copy lives in
[`src/design-system/`](../src/design-system/README.md), and `/design/` shows every
piece of it.

For the day-to-day commands, see the [README](../README.md). For how the site gets
to production, see [deployment.md](deployment.md).

## Repository layout

```
├── index.html, 404.html          Landing page and the Pages 404
├── projects/ about/ updates/ contact/ brand/ design/ privacy/ terms/
│                                 One index.html per page (title, description, canonical)
├── public/                       Copied verbatim into dist/
│   ├── boot.js                   Theme + motion flags before first paint (every page)
│   ├── CNAME                     Pins the custom domain in every Pages deployment
│   ├── robots.txt, sitemap.xml   For search engines (sitemap lists every route;
│   │                             robots.txt shuts out the Internet Archive's crawlers)
│   └── assets/                   favicon.svg, apple-touch-icon.png, social-card.png
├── scripts/                      HTML sources for the two PNGs + render-images.sh
│                                 (npm run social-card, with the dev server running)
├── src/
│   ├── entries/                  One tiny module per page: mount(<XPage />)
│   ├── pages/                    Page components (home, projects, about, …, not-found)
│   ├── content/                  Copy and data shared by pages: site (routes, nav,
│   │                             socials, email, legal name), fleet (kinds of
│   │                             ventures), logbook, values (+ mission, vision, story), faq
│   ├── design-system/            Vendored Signal + typed port + glyph engine (see its README)
│   └── app/
│       ├── mount.tsx             CSS imports (in order) + React mount
│       ├── components/           Layout (site-layout/header/footer, page-hero,
│       │                         legal-page) and sections (hero, story, manifesto, …)
│       ├── styles/page.css       Page layout + motion on top of the design system
│       └── utils/                theme.ts (colour themes), motion.ts (reveals, scroll progress)
├── tests/setup.ts                Vitest setup (jest-dom, RTL cleanup, storage polyfill)
└── docs/                         You are here
```

## Pages

| URL          | Component             | Header                      | What's on it                                            |
| ------------ | --------------------- | --------------------------- | ------------------------------------------------------- |
| `/`          | `pages/home.tsx`      | `hero` field + beam         | The abstract: one summary per page, plus the newsletter |
| `/projects/` | `pages/projects.tsx`  | `projects` field            | Empty state, what we do (`#what-we-do`)                 |
| `/about/`    | `pages/about.tsx`     | `about` field               | Story, mission and vision, values (`#values`), team     |
| `/updates/`  | `pages/updates.tsx`   | `updates` field             | Every update by year                                    |
| `/contact/`  | `pages/contact.tsx`   | `contact` field             | Email + social channels, full FAQ                       |
| `/brand/`    | `pages/brand.tsx`     | `brand` field               | Boilerplate, wordmark rules, colours, type              |
| `/design/`   | `pages/design.tsx`    | `design` field              | Principles, themes, type, glyphs, every component       |
| `/privacy/`  | `pages/privacy.tsx`   | `legal` field (`LegalPage`) | Privacy policy with contents sidebar                    |
| `/terms/`    | `pages/terms.tsx`     | `legal` field (`LegalPage`) | Terms of use with contents sidebar                      |
| 404          | `pages/not-found.tsx` | `lost` field                | Glyph “404”, “Off the map”                              |

### Adding a page

1. Add the route to `ROUTES` (and `NAV` / `FOOTER_GROUPS` if it should be
   linked) in [`src/content/site.ts`](../src/content/site.ts).
2. Write `src/pages/<name>.tsx` wrapping its content in `<SiteLayout>`.
3. Add `src/entries/<name>.tsx` (`mount(<NamePage />)`).
4. Add `<name>/index.html` (copy another page's; change title, description,
   canonical, og:url and the entry script), and add its URL to
   `public/sitemap.xml`.
5. Add `<name>` to `PAGES` in [`vite.config.ts`](../vite.config.ts).
6. Add it to the `PAGES` list in `src/pages/pages.test.tsx`. That test checks
   every page has one `<h1>` and that every internal link resolves;
   `src/site-files.test.ts` checks the sitemap and each page's preview tags.

## Wording

Titles, headings, nav labels and buttons say plainly what a page or section is
(“Our projects”, “Company updates”, “Contact us”). Nautical flavour (fleet,
voyage, crew) stays in places that don't carry meaning: the ticker, the 404
splash, the empty projects state. URLs follow the plain names too
(`/projects/`, `/updates/`, `/#newsletter`).

## Landing sections

| Section    | File              | Design-system pieces and motion                                            |
| ---------- | ----------------- | -------------------------------------------------------------------------- |
| Header     | `site-header.tsx` | Wordmark + cursor, nav as slash tabs (current page inverts), `ThemePicker` |
| Hero       | `hero.tsx`        | `Splash` with the `hero` field and the lighthouse beam; title decodes      |
| Ticker     | `ticker.tsx`      | A `> status` line, slow marquee                                            |
| What we do | `what-we-do.tsx`  | `KindGrid`: `art` cards, each with its own two-ink glyph strip             |
| Our story  | `story.tsx`       | Large mono statement; its key phrase inverted like a selection             |
| Vision     | `manifesto.tsx`   | `vision` field; the line lights up word by word                            |
| Questions  | `questions.tsx`   | Top four FAQ `details`, `[+]` toggles                                      |
| Dispatches | `dispatches.tsx`  | `newsletter` field, `TextField`, `Button`, `Callout`                       |
| Footer     | `site-footer.tsx` | Links, social marks, a glyph wordmark that lights left to right            |

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
- `GlyphField` ([design-system/components/glyph-field.tsx](../src/design-system/components/glyph-field.tsx))
  draws a composition from [glyph-compositions.ts](../src/app/components/glyph-compositions.ts)
  on a canvas: glyphs shimmer, light up under the pointer, and on the hero a
  beam sweeps across every 8 s. Glyphs thin out and ink blocks are trimmed
  behind the copy. It pauses off-screen, redraws on theme change, and draws one
  still frame without `.motion`. The maths lives in `design-system/glyph/engine.ts`.
- Page titles decode from scrambled glyphs once (`ScrambleText`); screen
  readers get the real text straight away.
- Big numerals (values, the year rail) use `.ink-figure`: Departure Mono.

## Styling

[`mount.tsx`](../src/app/mount.tsx) imports `tokens.css`, then `components.css`, then
`page.css`. Later files build on earlier ones; keep that order.

- **Tokens, never hex.** `page.css` only uses `var(--…)` tokens.
- **Splashes follow the theme.** Every theme defines all tokens, so splashes,
  fields and form controls re-ink together. `[data-theme]` on any element
  previews another theme for that subtree (the Design page and theme picker use it).
- **Typography** uses the token classes from `tokens.css` (`title-1`, `body-lg`,
  `mono`, …) and `.bc-eyebrow` for the `///` mono eyebrow.

## Theme

The design system themes by `data-theme` on `<html>`: `signal` (default),
`phosphor`, `amber`, `ultraviolet` and `paper`. A small script,
[`public/boot.js`](../public/boot.js), loaded in every page's `<head>`, restores
the saved choice (`localStorage["bc-theme"]`, with old `light`/`dark` values
mapped to `paper`/`signal`) before first paint; the header's `ThemePicker` sets
and saves it, and the Design page's `ThemeGrid` does the same.

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
