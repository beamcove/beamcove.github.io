# CLAUDE.md

Beamcove website — a multi-page Vite + Preact + TypeScript static site (one
HTML file per page, no client router), written against React's API and run on
Preact (`preact/compat`, aliased in `preact-alias.ts`), every page prerendered
to HTML at build time and hydrated in the browser. Deployed to GitHub Pages (beamcove.com)
by GitHub Actions on push to `main`. The landing page is the abstract; full
content lives on inner pages.

Docs: [docs/architecture.md](docs/architecture.md) ·
[docs/development.md](docs/development.md) ·
[docs/deployment.md](docs/deployment.md)

## Commands

```sh
npm run dev            # dev server (HMR)
npm run build          # tsc -b + vite build + prerender every page → dist/ (production)
npm run build:debug    # the same as a debug build: includes the debug-only /design/ page
npm test               # vitest (jsdom + Testing Library)
npm run format         # prettier --write + eslint --fix (run before committing)
npm run format:check   # CI check — the pre-commit hook and CI both enforce this
npm run size           # bundle budget (100 KB for all page scripts)
```

Node >= 22. A lefthook pre-commit hook blocks unformatted commits.

## Do not break these

1. **CSS import order** in `src/app/mount.tsx`: `tokens.css` → `components.css` →
   `page.css`. Tokens declare the fonts; the page layer overrides components.
2. **Design system is vendored** in `src/design-system/`. `tokens.css`,
   `components.css` and `fonts/` (subset to the characters the site uses; see
   the design-system README to add one) are verbatim copies from the sibling
   `design-system` repo (prettier-ignored) — re-copy, don't hand-edit. Follow its
   rules: tokens never hex, sentence case, one theme (Midnight, no picker,
   nothing stored on the device). **Two faces only:** Onest for everything you
   read; Bitcount Grid Double, pinned at Light 300 (never heavier), only for
   signals (dates, numbers, the wordmark) at 16px for small details, 22 or 44px
   for big numbers. Labels (kickers, eyebrows, tags) read in Onest 500: the
   dotted face is too faint at small sizes (see the readability block at the
   end of `page.css`). The glyph wordmark copies its letterforms. Buttons and controls are solid, never outlined.
   Glyphs are chunky (bold, round); symbols are only universal shapes (`Shape`:
   ● ▲ ■ ♥ ✕ + —). The mark is ● ▲ ■ in inks b, e, a; never draw new symbols.
3. **The page is the grid.** One 16px dot matrix, drawn once on `<html>`,
   centred horizontally and anchored to the document top. Every glyph field
   snaps to it (`glyph/lattice.ts`); never draw a second dot grid on the page.
   Each section owns its art: a `Scene` (a design-system `Screen` bound to a
   scene in `src/app/components/scenes.ts`) prints its scene behind its copy and
   scrolls with it. Only the home page (and the 404) uses full screens; nothing pins the scroll;
   reading pages use a compact `PageHero` and `Section`s (`size="fit"`, margin
   scenes, so art lives in the side margins). Put `data-quiet` on copy: glyphs
   thin out and ink blocks print whole or not at all, so text never sits on
   ink. Scenes name ink **slots** (`a`–`e`), never colours: two or three
   different inks, blocks only in those inks, crossing a little but never
   nested, same-ink blocks never overlapping, margin scenes' blocks in the outer
   4%, each kind of work its own pair. `scenes.test.ts` checks it.
4. **Motion is opt-in via `html.motion`** (set by `public/boot.js`). Scope every
   hidden/start state under `.motion` so content shows without JS or with
   reduced motion. The scene takeover (home page only), shimmer, word lighting, the beam and title decoding
   only run under it; otherwise each section prints one still frame.
   Don't advertise crew size or location outside the legal pages.
5. **A new page touches six places**: `ROUTES` in `src/content/site.ts`,
   `src/pages/`, `src/entries/`, `<name>/index.html`, `PAGES` in
   `vite.config.ts`, and `PRERENDER` in `src/prerender.tsx` (+ the page list in
   `src/pages/pages.test.tsx` and a line in `public/sitemap.xml`). The build
   fails if a page has no prerender entry. Pages render outside a browser at
   build time: touch `window`/`document` only in effects or behind a guard. See
   docs/architecture.md → "Adding a page".
6. **`public/CNAME`** pins the custom domain into every deploy. Vite `base`
   stays `/` (asset URLs in markup are root-relative).

## Performance

Lazy canvases (pixels only near the screen, only changed cells redrawn), no
layout reads while scrolling, no layout shift. See docs/architecture.md →
"Performance" before touching `Field`, the painter or the scroll hooks.

## Conventions

- TS strict + `noUncheckedIndexedAccess`; `@/*` → `src/*` alias (defined in
  tsconfig.app.json only; no `baseUrl` — TS 6 deprecates it).
- React named imports only (`import { useEffect } from "react"`); no
  `esModuleInterop`, so default-importing React fails type-check. They resolve
  to Preact; tests run on Preact too (`@testing-library/react` is aliased to
  `@testing-library/preact`).
- Named exports; kebab-case filenames; tests colocated as `*.test.tsx`.
- Icons: `import { Compass } from "lucide"` + `<Icon node={Compass} />`.
- Prettier: 4-space indent, 100 cols, double quotes. ESLint flat config.

## Structure (short version)

- `index.html`, `404.html`, `<page>/index.html` — one HTML file per page.
- `src/entries/` — `mount(<XPage />)` per page. `src/app/mount.tsx` — CSS + mount.
- `src/pages/` — page components. `src/content/` — shared copy and data
  (routes, nav, fleet, logbook, values, faq). Edit facts there, not in sections.
  No project is public yet: don't list one (a test guards this).
- `src/app/components/` — layout (site-layout/header/footer, page-hero,
  section, legal-page, scene, chapter-head), home screens (hero, what-we-do,
  story, manifesto, values, latest-updates, questions, dispatches), reading-page
  pieces (kind-cards, statements, value-list), plus scenes (every
  screen's glyph art), ascii-word (glyph wordmark), icon (renders Lucide icon
  nodes), brand (social SVGs).
- `src/design-system/` — Signal tokens, CSS, fonts (Onest, Bitcount Grid Double),
  typed component port (Screen, Field, LitLine, ChapterRail, …) and the glyph
  engine, page lattice and painter (`glyph/`). `/design/` shows every piece: it's
  debug-only (`DEBUG_ROUTES`, the dev server and `build:debug`), and production
  builds don't build, link or list it.
- `public/` — copied verbatim to dist (boot.js, CNAME, robots.txt, sitemap.xml,
  favicon, touch icon, social card). `scripts/` renders the two PNGs.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` (format check → tests → build →
deploy-pages). Pages source must be "GitHub Actions" in repo settings. Built
output is never committed. Details: docs/deployment.md.
