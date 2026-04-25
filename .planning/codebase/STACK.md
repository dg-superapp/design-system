# Technology Stack

**Analysis Date:** 2026-04-24

## Languages

**Primary:**
- HTML5 — prototype previews (`project/preview/*.html`, ~40 files), builder shell (`builder/index.html`), UI kit host (`project/ui_kits/miniapp/index.html`)
- CSS3 — design tokens (`project/colors_and_type.css`), preview shared styles (`project/preview/_card.css`), builder styles (`builder/styles.css`, 32 KB), UI-kit styles (`project/ui_kits/miniapp/kit.css`)
- JavaScript (vanilla, ES modules, browser-native, no build step) — `builder/app.js` (45 KB), Playwright specs `builder/tests/smoke.mjs`, `builder/tests/full.mjs`
- JSX (React 18) — `project/ui_kits/miniapp/{app,components,tiles}.jsx`, transpiled in-browser via Babel Standalone (no bundler)

**Secondary / Docs:**
- Markdown — `README.md`, `project/README.md`, `project/SKILL.md`, `project/SUPERAPP_HOST.md`, `project/ICONOGRAPHY.md`, `project/ui_kits/miniapp/README.md`
- SVG assets — `project/assets/flag-kh.svg`, `project/assets/superapp-logo.svg`, `project/uploads/Flag_of_Cambodia*.svg`
- PNG reference imagery — `project/assets/superapp-home-reference.png`, `project/screenshots/*.png` (5 files), `project/uploads/pasted-*.png` (~15 files), `.playwright-cli/page-*.png`

## File Inventory (excluding node_modules)

| Type | Count (approx) | Location |
|------|---------------:|----------|
| HTML | ~43 | `project/preview/` (40), `builder/` (1), `project/ui_kits/miniapp/` (1), misc |
| CSS  | 5  | `project/colors_and_type.css`, `project/fonts/fonts.css`, `project/preview/_card.css`, `builder/styles.css`, `project/ui_kits/miniapp/kit.css` |
| JS   | 2  | `builder/app.js`, `builder/tests/smoke.mjs`, `builder/tests/full.mjs` (`.mjs`) |
| JSX  | 3  | `project/ui_kits/miniapp/{app,components,tiles}.jsx` |
| MD   | 6  | root + project docs |
| SVG  | 4  | `project/assets/`, `project/uploads/` |
| PNG  | ~22 | `project/screenshots/`, `project/uploads/`, `project/assets/`, `.playwright-cli/` |
| PDF  | 0  | none detected |

## Runtime

**Environment:** Browser only. No server runtime. Static files opened locally or served via any static host.

**Node.js:** Required **only** for Playwright smoke tests under `builder/tests/` (ESM, `"type": "module"`).

## Package Managers / Manifests

- **No `package.json` at the repo root.** No workspace manifest.
- Single manifest: `builder/tests/package.json` — name `builder-smoke`, private, ESM.
- Lockfile: `builder/tests/package-lock.json` present (npm).

## Frameworks & Libraries

**UI kit (`project/ui_kits/miniapp/`):**
- React 18.3.1 (UMD dev build, loaded via `<script>` from unpkg — `project/ui_kits/miniapp/index.html:12`)
- ReactDOM 18.3.1 (UMD dev — `index.html:13`)
- Babel Standalone 7.29.0 (in-browser JSX transform — `index.html:14`)

**Builder app (`builder/`):** vanilla JS — no framework. Lucide icons initialized in `builder/app.js` (55 `data-lucide` / `lucide.*` references).

**Icons:** Lucide (UMD) via `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js` — referenced in `builder/index.html:10` and ~13 preview files.

**Testing:** Playwright `^1.59.1` — `builder/tests/package.json:10`. Chromium is the implied browser (Playwright default; downloaded artifacts visible in `.playwright-cli/`).

## Build / Dev Tooling

- **No bundler** (no Vite / Webpack / Rollup / esbuild / Parcel).
- **No TypeScript** — no `tsconfig.json`, no `.ts`/`.tsx` files.
- **No linter/formatter config** — no `.eslintrc*`, `.prettierrc*`, `biome.json`.
- **No CI config** — no `.github/workflows/`, no `.gitlab-ci.yml`, no `circleci`.
- **No deployment target** — no `vercel.json`, `netlify.toml`, `wrangler.toml`, Dockerfile.
- **No environment files** — no `.env*` present.

## Scripts

Only one npm script, in `builder/tests/package.json:7`:
```
"test": "node smoke.mjs"
```

## Configuration

- Design tokens defined in CSS custom properties at `project/colors_and_type.css:9` (`:root { --blue-950, --blue-900, ... }`).
- Font loading centralized in `project/fonts/fonts.css` (re-imported by `colors_and_type.css:7`).
- Builder persists user edits via `localStorage` (vanilla JS, no backend).

## Platform Requirements

**Development:** any modern browser + Node.js (for Playwright tests only).

**Production:** n/a — this is a design-system handoff bundle, not a deployed app. Intended consumption: coding agents reading the source directly (per root `README.md`).

---

*Stack analysis: 2026-04-24*
