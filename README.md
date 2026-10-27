# beamcove.github.io

The Beamcove website, served at [beamcove.com](https://beamcove.com) via GitHub Pages.

A multi-page Vite + React + TypeScript site built on the Beamcove design system
(Ink & tide), vendored in `src/design-system/`. Pages live in `src/pages/`, shared
copy in `src/content/`.

Deeper documentation lives in [docs/](docs/): [architecture](docs/architecture.md),
[development workflow](docs/development.md), and [deployment](docs/deployment.md).

## Development

Requires Node >= 22 (see `.nvmrc`).

```sh
npm install        # install dependencies (also installs lefthook git hooks)
npm run dev        # dev server with HMR
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Quality

```sh
npm run format         # prettier --write + eslint --fix
npm run format:check   # CI check: prettier + eslint, no writes
npm test               # vitest (jsdom + Testing Library)
npm run size           # bundle size budget (size-limit)
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which checks formatting, runs tests,
builds with Vite, and deploys `dist/` to GitHub Pages (Pages source must be set to
**GitHub Actions** in the repo settings). The custom domain is pinned by `public/CNAME`,
which Vite copies into the build output.
