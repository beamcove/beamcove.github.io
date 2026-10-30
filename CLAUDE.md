# CLAUDE.md

Beamcove website — a multi-page Vite + React 19 + TypeScript static site (one
HTML file per page, no client router), deployed to GitHub Pages (beamcove.com)
by GitHub Actions on push to `main`. The landing page is the abstract; full
content lives on inner pages.

Docs: [docs/architecture.md](docs/architecture.md) ·
[docs/development.md](docs/development.md) ·
[docs/deployment.md](docs/deployment.md)

## Commands

```sh
npm run dev            # dev server (HMR)
npm run build          # tsc -b + vite build → dist/
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
   `components.css` and `fonts/` are verbatim copies from the sibling
   `design-system` repo (prettier-ignored) — re-copy, don't hand-edit. Follow its
   rules: tokens never hex, one printed splash per view, sentence case.
   Riso art (`riso-compositions.ts`): shapes print in two different full inks (tints
   are for blooms), every overlap multiplies (no knockouts), and each card has
   its own ink pair. Shapes cross a little, never one inside another. White
   is an opaque ink printed first, under the rest. `riso-compositions.test.ts` checks it.
3. **Splashes carry `data-theme="light"`** — they print on paper in both themes.
4. **Motion is opt-in via `html.motion`** (set by `public/boot.js`). Scope every
   hidden/start state under `.motion` so content shows without JS or with
   reduced motion. Splash ink drifts (from the design system); never move the
   shapes or text. Don't advertise crew size or location outside the legal pages.
5. **A new page touches five places**: `ROUTES` in `src/content/site.ts`,
   `src/pages/`, `src/entries/`, `<name>/index.html`, and `PAGES` in
   `vite.config.ts` (+ the page list in `src/pages/pages.test.tsx` and a line in
   `public/sitemap.xml`). See
   docs/architecture.md → "Adding a page".
6. **`public/CNAME`** pins the custom domain into every deploy. Vite `base`
   stays `/` (asset URLs in markup are root-relative).

## Conventions

- TS strict + `noUncheckedIndexedAccess`; `@/*` → `src/*` alias (defined in
  tsconfig.app.json only; no `baseUrl` — TS 6 deprecates it).
- React named imports only (`import { useEffect } from "react"`); no
  `esModuleInterop`, so default-importing React fails type-check.
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
  legal-page) and sections (hero, story, manifesto, …), plus beam-dots
  (hero lighthouse canvas), icon (renders Lucide icon nodes), brand (social SVGs).
- `src/design-system/` — Ink & tide tokens, CSS, fonts, typed component port.
- `public/` — copied verbatim to dist (boot.js, CNAME, robots.txt, sitemap.xml,
  favicon, touch icon, social card). `scripts/` renders the two PNGs.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` (format check → tests → build →
deploy-pages). Pages source must be "GitHub Actions" in repo settings. Built
output is never committed. Details: docs/deployment.md.
