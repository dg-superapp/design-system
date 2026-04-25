# External Integrations

**Analysis Date:** 2026-04-24

## Summary

This is a **static design-system bundle**. There are **no backend APIs, no auth providers, no databases, no webhooks**. All external dependencies are **CDN-hosted web assets** (fonts, icons, React UMD) fetched at page load, plus **Playwright's Chromium download** for tests.

## CDN Dependencies

### Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`)

Canonical loader: `project/fonts/fonts.css:1` — imports Inter, Kantumruy Pro, Noto Sans Khmer (weights 400/500/600/700).

Extended family set (`builder/index.html:9`) also loads:
- **Inter** (400/500/600/700) — primary Latin UI
- **Noto Sans Khmer** (400/500/600/700) — primary Khmer UI
- **Kantumruy Pro** (400/500/600/700) — Khmer display alternate
- **Battambang** (400/700) — Khmer serif/accent
- **Moul** (400) — Khmer decorative (brand)
- **IBM Plex Sans** (400/500/600/700) — alt sans for builder previews
- **Roboto** (400/500/700) — alt sans for builder previews
- **JetBrains Mono** (400/500) — monospace for token/code panels

Preview HTML files each load a **subset** of the above per-page (see `project/preview/*.html` line 4; e.g., `inputs.html` loads Inter + Noto Sans Khmer, `iconography.html` loads Inter 500 only).

UI kit (`project/ui_kits/miniapp/index.html:9`) loads Inter, Kantumruy Pro, Noto Sans Khmer, Battambang.

**Preconnect hints** present: `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `builder/index.html:7-8` and UI kit host.

### Lucide Icons (`unpkg.com/lucide@latest`)

- UMD bundle: `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js` — `builder/index.html:10`, `project/ui_kits/miniapp/index.html:11`
- Preview pages use the shorthand `https://unpkg.com/lucide@latest` (~13 files under `project/preview/`: `alerts.html`, `document-list-row.html`, `empty-state.html`, `iconography.html`, `list-rows.html`, `modal.html`, `section-header.html`, `segmented-tabs.html`, `service-grid.html`, etc.)
- `@latest` tag is **unpinned** — every load fetches the current Lucide release.
- Documented SSR alternative (unused at runtime): `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/<name>.svg` — `project/ICONOGRAPHY.md:56`.

### React 18 UMD (`unpkg.com`)

Loaded **only** by the in-browser JSX UI kit (`project/ui_kits/miniapp/index.html`):
- `https://unpkg.com/react@18.3.1/umd/react.development.js` (line 12, SRI hash pinned)
- `https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js` (line 13, SRI hash pinned)
- `https://unpkg.com/@babel/standalone@7.29.0/babel.min.js` (line 14, SRI hash pinned) — transpiles the sibling `.jsx` files at runtime.

Version pinning + `integrity="sha384-…"` + `crossorigin="anonymous"` are set on all three.

### Playwright (`cdn.playwright.dev`)

Used only during test setup to download Chromium binaries (referenced inside `builder/tests/node_modules/playwright-core/lib/server/registry/index.js`). Not a runtime dependency of the design system.

## External APIs

**None.** No HTTP clients, no `fetch()` against third-party APIs, no SDK imports (Stripe, Supabase, AWS, Firebase, etc.).

## Data Storage

- **Databases:** none.
- **Client-side persistence:** `localStorage` in `builder/app.js` (user-edited design tokens).
- **File storage:** local filesystem only.
- **Caching:** none.

## Authentication & Identity

None. No auth provider, no session handling, no tokens.

## Monitoring & Observability

- **Error tracking:** none (no Sentry / Datadog / Rollbar).
- **Analytics:** none.
- **Logs:** `console.log` only.

## CI/CD & Deployment

- **Hosting:** not configured.
- **CI pipeline:** none (no `.github/workflows/`).
- **Containerization:** none (no Dockerfile).

## Environment Configuration

- **Required env vars:** none.
- **`.env*` files:** none present.
- **Secrets:** none managed in repo.

## Webhooks & Callbacks

**Incoming:** none. **Outgoing:** none.

## Test Integrations

- **Playwright 1.59.1** drives Chromium against the local `builder/index.html` via `builder/tests/smoke.mjs` and `builder/tests/full.mjs`.
- Artifacts land in `builder/tests/screenshots/`, `builder/tests/screenshots-full/`, `builder/tests/downloads/`, and `.playwright-cli/`.

## Risks / Notes

- **Unpinned Lucide `@latest`** across builder and ~13 preview files — any breaking Lucide release affects visuals/icons at next page load.
- **Offline previews will break** — every HTML file hard-depends on Google Fonts + unpkg CDNs; there is no local fallback for fonts, React, or icons.
- **unpkg availability** is a single-vendor risk for the JSX UI kit (React + ReactDOM + Babel all sourced from unpkg).

---

*Integration audit: 2026-04-24*
