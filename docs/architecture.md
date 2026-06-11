# Architecture

The Beamcove landing page: a single-page Vite + React 19 + TypeScript site with no
router, no backend of its own, and one external API call (newsletter signup). It is
built to `dist/` and served as static files by GitHub Pages at
[beamcove.com](https://beamcove.com).

For the day-to-day commands, see the [README](../README.md). For how the site gets
to production, see [deployment.md](deployment.md).

## Repository layout

```
├── index.html                  Vite entry HTML (head metadata + #root + module script)
├── public/                     Copied verbatim into dist/
│   ├── CNAME                   Pins the custom domain in every Pages deployment
│   └── assets/                 favicon + logo SVGs, referenced by absolute URL
├── src/
│   ├── main.tsx                Entry: CSS imports (cascade order!) + React mount
│   ├── app/
│   │   ├── app.tsx             Root component: section composition
│   │   ├── app.test.tsx        Smoke test
│   │   ├── components/
│   │   │   ├── sections.tsx    Nav, Hero, What, Fleet, Values, Crew, Footer
│   │   │   ├── newsletter.tsx  Email signup form (posts to roster.beamcove.com)
│   │   │   └── brand.tsx       BrandIcon — inline SVG paths for social marks
│   │   ├── styles/             The four stylesheets (see "CSS cascade" below)
│   │   └── utils/icons.ts      Lucide icon registry + refreshIcons()
├── tests/setup.ts              Vitest setup (jest-dom, RTL cleanup, polyfills)
└── docs/                       You are here
```

## How a page render works

1. [`index.html`](../index.html) loads `/src/main.tsx` as a module.
2. [`main.tsx`](../src/main.tsx) imports the four stylesheets **in cascade order**,
   then mounts `<App />` into `#root` under `StrictMode`.
3. [`app.tsx`](../src/app/app.tsx) composes the sections; hero copy and the ink
   preset are constants passed down as props.
4. Two effects run after every render:
    - **Icon re-stamp** — `refreshIcons()` replaces `<i data-lucide="...">`
      placeholders with inline SVGs (see "Lucide icons" below).
    - **Scroll reveals** — an IntersectionObserver adds `.in` to `.lp-reveal`
      elements as they enter the viewport, with two fallbacks: environments
      without IntersectionObserver reveal everything immediately, and a 1.4 s
      timeout reveals anything still hidden.

## CSS cascade (load order matters)

The old static site loaded four `<link>` tags in a specific order; the bundle must
preserve it. [`main.tsx`](../src/main.tsx) imports them in that exact order and Vite
concatenates them in import order into one stylesheet:

1. `colors-and-type.css` — design tokens, typography (also `@import`s Google Fonts;
   it must stay the _first_ import so the `@import` lands at the top of the bundle,
   where CSS requires it)
2. `ink.css` — animated ink-blob background system (`.ink-bg`, presets)
3. `kit.css` — component kit (`bc-*` buttons, cards, badges, inputs)
4. `page.css` — landing-page layout and overrides (`lp-*` classes)

Later files intentionally override earlier ones. Don't reorder the imports and
don't move the Google Fonts `@import` out of first position.

## Lucide icons

The markup uses the CDN-era convention: `<i data-lucide="chevron-down"></i>`
placeholders that `lucide.createIcons()` replaces with SVGs after render. The
refactor kept this pattern (instead of switching to `lucide-react`) so the rendered
DOM stayed identical.

[`src/app/utils/icons.ts`](../src/app/utils/icons.ts) imports **only the icons the
markup uses** and registers them with `createIcons`. If you add a new
`data-lucide="..."` placeholder anywhere, you must also add the matching icon to
the `ICONS` map in that file — otherwise it silently renders nothing.

Brand/social glyphs (GitHub, X, LinkedIn, Reddit, Discord) are not Lucide; they are
inline SVG paths in [`brand.tsx`](../src/app/components/brand.tsx) because Lucide
dropped most brand icons.

## TypeScript & module conventions

- Strict mode plus `noUncheckedIndexedAccess` and `noImplicitReturns`
  ([tsconfig.app.json](../tsconfig.app.json)). No `baseUrl` — `paths` resolves
  relative to the tsconfig (TS 6 deprecates `baseUrl`).
- `@/*` aliases `src/*`. The alias is defined once in `tsconfig.app.json`;
  `vite-tsconfig-paths` makes Vite and Vitest honor it.
- Named exports everywhere except the `App` root component (default export).
- React named imports (`import { useEffect } from "react"`); there is no
  `esModuleInterop`, so `import React from "react"` will not type-check.

## Key decisions

| Decision                                                       | Rationale                                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Vite + GitHub Actions deploy instead of committing built files | Keeps `main` source-only; Pages serves the workflow artifact (see [deployment.md](deployment.md)) |
| `lucide` npm package with `createIcons`, not `lucide-react`    | Byte-identical DOM to the old CDN setup; no rewrite of the re-stamp logic                         |
| Single CSS bundle in import order, no CSS modules              | Preserves the legacy cascade exactly; stylesheets are page-global by design                       |
| No router / state library / data layer                         | One static page; the only state is the newsletter form                                            |
