# Deployment

The site deploys to GitHub Pages via GitHub Actions. `main` contains only source;
the built `dist/` is uploaded as a Pages artifact and never committed.

## Pipeline

Every push to `main` (or a manual run via _Actions → Deploy → Run workflow_)
triggers [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

```
npm ci → npm run format:check → npm test → npm run build → upload dist/ → deploy-pages
```

A failed format check or test stops the deploy. The `concurrency: pages` group
cancels superseded in-flight runs, so rapid pushes deploy only the latest commit.

## One-time repository configuration

- **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**
  (not "Deploy from a branch"). Without this, pushing the source tree to `main`
  would make Pages serve the raw repo and break the site.
- No other secrets or configuration are needed; the workflow's
  `pages: write` + `id-token: write` permissions cover the deployment.

## Custom domain

- DNS for `beamcove.com` points at GitHub Pages (configured outside this repo).
- [`public/CNAME`](../public/CNAME) is copied verbatim into `dist/` by Vite, so
  every deployment re-pins the domain. Don't delete it; if the domain ever
  changes, change it there _and_ in Settings → Pages.
- `.nojekyll` is unnecessary — the Actions deploy path serves the artifact
  directly and never runs Jekyll.
- Asset URLs in the markup are root-relative (e.g. `assets/logo-lockup.svg`),
  which assumes the site is served at the domain root. Keep Vite's `base` at the
  default `/`.

## Verifying a deploy

1. The _Deploy_ run is green in the Actions tab.
2. beamcove.com serves the new build (hard-refresh; HTML is cached briefly).
3. Spot-check: fonts (Hanken Grotesk / Outfit), ink background animation, lucide
   icons stamped, newsletter field renders.

## Rollback

Pages serves the last successful deployment. To roll back, revert the offending
commit on `main` (or `git revert` a range) and push — the workflow redeploys the
previous state. There is no manual rollback knob in Pages itself.

## Local equivalents

| CI step                | Local command                                        |
| ---------------------- | ---------------------------------------------------- |
| `npm run format:check` | same, or `npm run format` to fix                     |
| `npm test`             | same                                                 |
| `npm run build`        | same; output in `dist/`                              |
| deployed preview       | `npm run preview` (serves `dist/` at localhost:4173) |
