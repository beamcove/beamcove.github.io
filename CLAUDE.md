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

1. **CSS import order** in `src/main.tsx` (colors-and-type → ink → kit → page)
   is the legacy `<link>` cascade; reordering changes the rendered page.
   `colors-and-type.css` must stay first (it `@import`s Google Fonts).
2. **Lucide pattern** — icons are `<i data-lucide="...">` placeholders stamped
   by `createIcons()` after render (not `lucide-react`). A new `data-lucide`
   name also needs registering in `src/app/utils/icons.ts` or it renders
   nothing.
3. **`public/CNAME`** pins the custom domain into every deploy. Vite `base`
   stays `/` (asset URLs in markup are root-relative).

## Conventions

- TS strict + `noUncheckedIndexedAccess`; `@/*` → `src/*` alias (defined in
  tsconfig.app.json only; no `baseUrl` — TS 6 deprecates it).
- React named imports only (`import { useEffect } from "react"`); no
  `esModuleInterop`, so default-importing React fails type-check.
- Named exports; kebab-case filenames; tests colocated as `*.test.tsx`.
- Prettier: 4-space indent, 100 cols, double quotes. ESLint flat config.

## Structure (short version)

- `src/main.tsx` — CSS imports + mount. `src/app/app.tsx` — composition root
  (hero copy and ink preset are constants there).
- `src/app/components/` — sections.tsx (Nav/Hero/What/Fleet/Values/Crew/Footer),
  newsletter.tsx (posts to roster.beamcove.com), brand.tsx (inline social SVGs).
- `public/` — copied verbatim to dist (CNAME, favicon, logos).

## Deployment

Push to `main` → `.github/workflows/deploy.yml` (format check → tests → build →
deploy-pages). Pages source must be "GitHub Actions" in repo settings. Built
output is never committed. Details: docs/deployment.md.
