# CLAUDE.md

Beamcove landing page — a single-page Vite + React 19 + TypeScript static site,
deployed to GitHub Pages (beamcove.com) by GitHub Actions on push to `main`.

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
npm run size           # bundle budget (100 KB gzipped main chunk)
```

Node >= 22. A lefthook pre-commit hook blocks unformatted commits.

## Do not break these

1. **CSS import order** in `src/main.tsx`: `tokens.css` → `components.css` →
   `page.css`. Tokens declare the fonts; the page layer overrides components.
2. **Design system is vendored** in `src/design-system/`. `tokens.css`,
   `components.css` and `fonts/` are verbatim copies from the sibling
   `design-system` repo (prettier-ignored) — re-copy, don't hand-edit. Follow its
   rules: tokens never hex, one printed splash per view, sentence case.
3. **Splashes carry `data-theme="light"`** — they print on paper in both themes.
4. **Motion is opt-in via `html.motion`** (set in index.html). Scope every
   hidden/start state under `.motion` so content shows without JS or with
   reduced motion. Don't loop the splash ink.
5. **`public/CNAME`** pins the custom domain into every deploy. Vite `base`
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

- `src/main.tsx` — CSS imports + mount. `src/app/app.tsx` — composition root.
- `src/design-system/` — Ink & tide tokens, CSS, fonts, typed component port.
- `src/app/components/` — one file per section (site-header, hero, ticker,
  what-we-build, voyage, fleet, manifesto, principles, logbook, dispatches,
  site-footer) plus beam-dots (hero lighthouse canvas), icon (renders
  Lucide icon nodes), theme-toggle, brand (social SVGs).
- `public/` — copied verbatim to dist (CNAME, favicon).

## Deployment

Push to `main` → `.github/workflows/deploy.yml` (format check → tests → build →
deploy-pages). Pages source must be "GitHub Actions" in repo settings. Built
output is never committed. Details: docs/deployment.md.
