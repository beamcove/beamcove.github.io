# Architecture

The Beamcove website: a multi-page Vite + Preact + TypeScript static site (written
against React's API, run on `preact/compat`, every page prerendered) with
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

It is built on the Beamcove design system, **Signal** (a night sky, a lighthouse
and a field of glyphs: one dark theme, one dot grid through every page that
each section prints its own glyph scene onto, Departure Mono + JetBrains Mono + Onest). A copy lives in
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
│       └── utils/                subscribe.ts (the newsletter), motion.ts (reveals, scroll progress)
├── tests/setup.ts                Vitest setup (jest-dom, RTL cleanup, storage polyfill)
└── docs/                         You are here
```

## Pages

| URL          | Component             | First screen (scene)  | What's on it                                         |
| ------------ | --------------------- | --------------------- | ---------------------------------------------------- |
| `/`          | `pages/home.tsx`      | `hero`, with the beam | The whole company as one scroll, plus the newsletter |
| `/projects/` | `pages/projects.tsx`  | `projects`            | Empty state, what we do (`#what-we-do`), newsletter  |
| `/about/`    | `pages/about.tsx`     | `about`               | Story, mission and vision, values (`#values`), team  |
| `/updates/`  | `pages/updates.tsx`   | `log`                 | Every update by year, newsletter                     |
| `/contact/`  | `pages/contact.tsx`   | `hello`               | Email + social channels, full FAQ (`#questions`)     |
| `/brand/`    | `pages/brand.tsx`     | `brand`               | Boilerplate, mark and name, colours, type, voice     |
| `/design/`   | `pages/design.tsx`    | `design`              | Principles, colour, type, glyphs, grid, components   |
| `/privacy/`  | `pages/privacy.tsx`   | `legal` (`LegalPage`) | Privacy policy with contents sidebar                 |
| `/terms/`    | `pages/terms.tsx`     | `legal` (`LegalPage`) | Terms of use with contents sidebar                   |
| 404          | `pages/not-found.tsx` | `lost`                | Glyph “404”, “Off the map”                           |

### Adding a page

1. Add the route to `ROUTES` (and `NAV` / `FOOTER_GROUPS` if it should be
   linked) in [`src/content/site.ts`](../src/content/site.ts).
2. Write `src/pages/<name>.tsx` wrapping its content in `<SiteLayout>`.
3. Add `src/entries/<name>.tsx` (`mount(<NamePage />)`).
4. Add `<name>/index.html` (copy another page's; change title, description,
   canonical, og:url and the entry script), and add its URL to
   `public/sitemap.xml`.
5. Add `<name>` to `PAGES` in [`vite.config.ts`](../vite.config.ts), and its
   built file to `PRERENDER` in [`src/prerender.tsx`](../src/prerender.tsx)
   (the build fails without it).
6. Add it to the `PAGES` list in `src/pages/pages.test.tsx`. That test checks
   every page has one `<h1>` and that every internal link resolves;
   `src/site-files.test.ts` checks the sitemap and each page's preview tags.

## Wording

Titles, headings, nav labels and buttons say plainly what a page or section is
(“Our projects”, “Company updates”, “Contact us”). Nautical flavour (fleet,
voyage, crew) stays in places that don't carry meaning: the 404 screen and
the empty projects state. URLs follow the plain names too
(`/projects/`, `/updates/`, `/#newsletter`).

## Landing screens

The home page is the whole company as one scroll, one idea per screen, each
printing its own scene on the page grid. A chapter rail on wide screens shows
where you are.

| Screen     | File                 | Scene(s)            | What happens                                     |
| ---------- | -------------------- | ------------------- | ------------------------------------------------ |
| Hero       | `hero.tsx`           | `hero`              | The tagline alone, decoding in; the beam sweeps  |
| What we do | `what-we-do.tsx`     | `intro`, kinds      | An intro, then one screen per kind of work       |
| Story      | `story.tsx`          | `story`             | The story, its key phrase highlighted            |
| Mission    | `manifesto.tsx`      | `mission`, `vision` | Two statements that light up word by word        |
| Values     | `values.tsx`         | `values`            | One screen; the values rise in one after another |
| Updates    | `latest-updates.tsx` | `updates`           | The newest log entries                           |
| FAQ        | `questions.tsx`      | `faq`               | Top four questions (all of them on Contact)      |
| Newsletter | `dispatches.tsx`     | `contact`           | The sign-up form and the other ways to say hello |
| Footer     | `site-footer.tsx`    | —                   | Links, social marks, a glyph wordmark            |

Inner pages are for reading, so they put the content first. `PageHero` is a
compact band (a pixel kicker, the title, a lead) that prints the page's scene,
its ink blocks right of the copy. The rest of the page is `Section`s: as tall
as their content, a 2px rule on top, the heading in a sticky left column and
the content beside it (`stacked` for wide grids). Their scenes gather into the
side margins, so the art runs the length of the page without touching the
text. Only the home page uses full screens. Nothing pins the scroll: the art
always moves with the page, so you can see you are scrolling.

## Motion

- `public/boot.js` adds `motion` to `<html>` when IntersectionObserver exists and
  the visitor hasn't asked for reduced motion. **Every hidden starting state is
  scoped under `.motion`**, so without it the page is simply static and fully
  visible (this is also why tests see everything).
- **The page grid.** One 16px dot matrix is drawn once, by CSS, on `<html>`:
  centred horizontally (equal margins on any width) and anchored to the
  document top. `glyph/lattice.ts` gives any element its offset onto it, so
  every glyph lands exactly on a dot.
- **Section art.** Each `Screen` renders a `Field`: a canvas filling the section
  that prints its scene on the page grid (`glyph/painter.ts`, maths in
  `engine.ts`). It scrolls with the content. On the landing page only
  (`SceneTakeover` in `pages/home.tsx` → `Screen takeover`), as the next
  section's top moves from 90% to 20% of the screen, its scene takes over cell
  on a wave (a dense band of its glyphs, lit along the leading edge, sweeping
  up from the bottom of the screen; `flipAt` and `WAVE_BAND` in `painter.ts`), in
  both canvases, so the takeover runs across the edge; it follows scroll both
  ways. Reading pages keep each section's own scene. Fields shimmer while visible and
  light under the pointer; the hero sweeps the lighthouse beam. Glyphs thin out
  around `[data-quiet]` copy, and ink blocks print whole or not at all.
  The pointer light follows the mouse in screen space, so it stays under the
  cursor while the page scrolls. `LitLine` lights its words in turn when it
  comes into view. Without `.motion` every field
  prints one still frame.
- `useReveal()` ([utils/motion.ts](../src/app/utils/motion.ts)) adds `is-in`
  to `[data-reveal]` elements as they scroll into view; `data-reveal="fill"`
  only triggers child effects (the footer wordmark).
  Whatever is on screen when the page opens is revealed before the first paint,
  without the fade.
- Titles decode from scrambled glyphs once (`ScrambleText`): the real text
  holds the layout (and is what screen readers get) and the noise prints over
  it, so nothing around it moves.

## Performance

Measured on a production build (`npm run build && npm run preview`), on a
phone profile (slow 4G, 4× slower CPU) and on desktop. Keep these:

- **Every page is prerendered.** `npm run build` ends with
  [`scripts/prerender.mjs`](../scripts/prerender.mjs), which renders each page
  (listed in [`src/prerender.tsx`](../src/prerender.tsx)) into its HTML file and
  marks `<html data-prerendered>`; [`mount.tsx`](../src/app/mount.tsx) hydrates
  it. Text shows before any script runs (first paint about 0.45 s on the phone
  profile, against 1.3 s when the page was built in the browser). Components
  must render outside a browser: read `window` and `document` in effects or
  behind a guard. Reveals only hide below-the-fold content once the script is
  running (`html.ready`), so prerendered copy shows at once.
- **Preact, not React.** `preact-alias.ts` points React imports at
  `preact/compat` (about 9 KB against React's 60 KB, compressed).
- **A title already on screen stays as it is.** `ScrambleText` with
  `trigger="mount"` doesn't scramble a prerendered title; it only delayed the
  page.

- **Canvases are painted off the main thread.** Where the browser has
  OffscreenCanvas (Safari 16.4+, every current Chrome and Firefox), a `Field`
  hands its canvas to one shared worker (`glyph/field-worker.ts`, driven by
  `glyph/remote-painter.ts`). The page still measures the layout and sends
  each frame's scroll, pointer and wave state; the worker holds the scenes and
  paints. This halves the main thread's work per scroll frame on a phone.
  Elsewhere, or if the worker fails, the same painter runs on the main thread.
  So the painter (`glyph/painter.ts`) must never read the page: what it needs
  from styles comes in `PainterEnv`, read once by `readEnv`.
- **Canvases are lazy.** A `Field` lays out and holds pixels only within half a
  screen of the viewport, and gives them back further away (a canvas costs
  width × height × 4 bytes, at up to 1.5× device pixels). It redraws only the
  rows on screen, and only the cells whose glyph, ink or alpha changed since
  the last frame (`drawn` in `painter.ts`). Idle shimmer runs at 12fps; the
  beam, the pointer light and scrolling at up to 30/60fps.
- **Per-cell work is done once per layout.** How quiet the copy keeps each
  cell, which ink blocks print, and the fixed part of the wave's turnover are
  worked out when the layout changes (`painter.layout`), not every frame. Only
  fixed furniture (the chapter rail) is checked per frame (`FieldFrame.live`).
  Glyphs come from atlases pre-printed over the paper at each of the 16 alpha
  steps, shared by every field, so a changed cell is one image copy.
- **The takeover is the costliest effect** (about a quarter of a phone's
  scroll frame), then CSS motion (reveals, lit words). Measure before adding
  to either.
- **No layout reads while scrolling.** Positions are measured on layout
  changes (`onLayout` in `components/doc-layout.ts`) and scroll handlers work
  from them and `scrollY`. Measurements leave out reveal slides
  (`restingRect` in `glyph/lattice.ts`).
- **Nothing shifts.** Entrance animations start at 1% opacity (so the copy
  counts as painted at once), on-screen content isn't faded in, and
  `ScrambleText` never changes the layout.
- **The head is lean.** `fastHead` in `vite.config.ts` inlines `public/boot.js`
  and the stylesheet, and preloads both fonts (which are subset to the
  characters the site uses). Chunks are three layers: `preact` (rarely changes,
  stays cached), `site` (shared code) and one small chunk per page.

## Styling

[`mount.tsx`](../src/app/mount.tsx) imports `tokens.css`, then `components.css`, then
`page.css`. Later files build on earlier ones; keep that order.

- **Tokens, never hex.** `page.css` only uses `var(--…)` tokens.
- **One theme.** Signal is Midnight only: no picker, nothing stored on the device.
- **Typography** uses the token classes from `tokens.css` (`display`, `title-1`,
  `lead`-sized `body-lg`, `mono`, …) and `Kicker` (`01 —— What we do`) for chapter openers.

## Symbols and the mark

The design system's symbol set (`Shape`, `Mark`, `Face` in
`src/design-system/components/shape.tsx`) is seven universal shapes, ● ▲ ■ ♥ ✕ + and a
dash, drawn bold and round on one 16px cell. The mark, ● ▲ ■, sits before the name
in the header and footer, and the favicon stacks it ▲ over ● ■. Each kind of work in
`content/fleet.ts` wears its shape and ink (work ■ `a`, everyday life ● `b`, play ▲
`e`). The 404 shows a `Face` with ✕ ✕ eyes. Don't draw new symbols.

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
