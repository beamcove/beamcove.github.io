# Development

Prerequisites: Node >= 22 (`.nvmrc`), npm. `npm install` also installs the
lefthook git hooks via the `prepare` script.

## Commands

| Command                             | What it does                                   |
| ----------------------------------- | ---------------------------------------------- |
| `npm run dev`                       | Vite dev server with HMR (localhost:5173)      |
| `npm run build`                     | `tsc -b` (type-check) + `vite build` → `dist/` |
| `npm run preview`                   | Serve the production build (localhost:4173)    |
| `npm test` / `npm run test:watch`   | Vitest, jsdom + Testing Library                |
| `npm run test:coverage`             | Coverage report (v8)                           |
| `npm run lint` / `npm run lint:fix` | ESLint                                         |
| `npm run format`                    | Prettier write + ESLint fix, whole repo        |
| `npm run format:check`              | CI-style check, no writes                      |
| `npm run size`                      | Bundle budget check (size-limit)               |

## Formatting & linting

- **Prettier** ([prettier.config.js](../prettier.config.js)): 4-space indent,
  100-char lines, double quotes, trailing commas. `public/` and lock files are
  ignored ([.prettierignore](../.prettierignore)).
- **ESLint** ([eslint.config.js](../eslint.config.js)): flat config — JS/TS
  recommended, react-hooks, jsx-a11y, react-refresh, with Prettier conflicts
  disabled.
- **Pre-commit hook** (lefthook, [lefthook.yml](../lefthook.yml)): runs
  `prettier --check` and `eslint` on staged files. It blocks commits that aren't
  formatted — run `npm run format` first. Bypass in emergencies with
  `LEFTHOOK=0 git commit ...`.

## Testing

- Unit/component tests are colocated (`*.test.tsx` next to the source).
- [tests/setup.ts](../tests/setup.ts) provides jest-dom matchers, RTL cleanup, and
  an in-memory localStorage/sessionStorage (Node 22's built-in localStorage
  shadows jsdom's).
- `describe`/`it`/`expect`/`vi` are ambient globals (configured in
  [vitest.config.ts](../vitest.config.ts) + the `types` array in
  [tsconfig.app.json](../tsconfig.app.json)).
- jsdom has no IntersectionObserver; the app's scroll-reveal effect detects that
  and reveals everything immediately, so tests don't need a polyfill.

## Bundle budget

`npm run size` (after a build) checks the main JS chunk against the 100 KB
gzipped budget in [package.json](../package.json). The page currently ships
~62 KB compressed (React 19 + 8 lucide icons + app code). If the budget trips,
check what got imported — the most common cause would be importing broadly from
`lucide` instead of registering individual icons in
[`src/app/utils/icons.ts`](../src/app/utils/icons.ts).

## Editor setup (VS Code)

[.vscode/settings.json](../.vscode/settings.json) enables format-on-save with
Prettier and ESLint autofix. Use the **workspace TypeScript version**
(`TypeScript: Select TypeScript Version…` → workspace) — the repo pins TS 5.x,
and VS Code's bundled 6.x reports deprecations the toolchain doesn't.
