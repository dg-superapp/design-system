# Codebase Structure

**Analysis Date:** 2026-04-24

## Directory Layout

```
dgc-miniapp-design-system/
├── README.md                    # Repo overview: two-surface design system
├── image-prompt.txt             # Prompt used to generate brand reference imagery
├── .planning/
│   └── codebase/                # GSD mapping docs (this folder)
├── project/                     # STATIC GUIDELINE — source of truth
│   ├── README.md                # Human-readable design-system guide
│   ├── SKILL.md                 # Claude skill describing when/how to use the system
│   ├── SUPERAPP_HOST.md         # Rules for MiniApp embedding in the SuperApp host
│   ├── ICONOGRAPHY.md           # Icon usage + lucide mapping
│   ├── colors_and_type.css      # CANONICAL design tokens on :root
│   ├── _card.css                # Shared card specimen styles used by previews
│   ├── assets/                  # Brand SVGs (logo, flag) + reference PNGs
│   ├── fonts/
│   │   └── fonts.css            # @font-face declarations for Latin + Khmer faces
│   ├── preview/                 # 36 per-component HTML specimens (see below)
│   ├── screenshots/             # Visual audit captures (drawer, header, modal)
│   ├── ui_kits/
│   │   └── miniapp/             # React/JSX MiniApp UI kit
│   │       ├── index.html       # Kit showcase shell
│   │       ├── app.jsx          # Kit entry composition
│   │       ├── components.jsx   # Reusable component set
│   │       ├── tiles.jsx        # Service-tile components
│   │       ├── kit.css          # Kit-specific styles, reads project tokens
│   │       └── README.md        # Kit usage notes
│   └── uploads/                 # Raw pasted references + flag variants
└── builder/                     # INTERACTIVE EDITOR — reads project/ read-only
    ├── index.html               # Editor shell: 7 tab panels + 6 preview modes
    ├── styles.css               # Editor chrome + all component specimen styles
    ├── app.js                   # Seed → apply tokens → renderStage dispatcher
    └── tests/
        ├── package.json         # Playwright + claude-in-chrome deps
        ├── smoke.mjs            # Fast boot / token-apply sanity check
        └── (full.mjs)           # Deeper MCP-driven visual coverage
```

## Directory Purposes

**`project/`:**
- Purpose: canonical design-system artifacts.
- Contains: token CSS, narrative docs, per-component HTML previews, React/JSX UI kit, brand + font assets.
- Key files: `project/colors_and_type.css`, `project/README.md`, `project/ui_kits/miniapp/components.jsx`.
- Mutability: treat as read-only from any tooling. Edits here flow **out** to consumers.

**`project/preview/`:**
- Purpose: one self-contained HTML file per component / token category.
- Contains: 36 specimen pages — e.g. `alerts.html`, `app-header.html`, `buttons-primary.html`, `buttons-secondary.html`, `colors-neutrals.html`, `colors-primary.html`, `colors-semantic.html`, `content-tone.html`, `doc-viewer.html`, `document-list-row.html`, `elevation.html`, `empty-state.html`, `file-list.html`, `file-uploader.html`, `flag-brand.html`, `hero-banner.html`, `iconography.html`, `inputs.html`, `list-rows.html`, `ministry-picker.html`, `modal.html`, `nav-row.html`, `radii.html`, `section-header.html`, `segmented-tabs.html`, `selection.html`, `service-grid.html`, `side-drawer.html`, `spacing.html`, `step-indicator.html`, `superapp-host.html`, `superapp-logo.html`, `tabs.html`, `timestamp-tags.html`, `type-bilingual.html`, `type-khmer.html`, `type-latin.html`.
- Loads tokens via relative link to `../colors_and_type.css`.

**`project/ui_kits/miniapp/`:**
- Purpose: ready-to-embed React MiniApp UI kit.
- Key files: `app.jsx` (composition root), `components.jsx` (buttons, inputs, cards, lists, modals), `tiles.jsx` (service grid), `kit.css` (token-driven styles).

**`project/assets/`:**
- Purpose: brand SVGs and the `superapp-home-reference.png` composition reference.
- Notable: `superapp-logo.svg`, `flag-kh.svg`, `superapp-home-reference.png`.

**`project/fonts/`:**
- Purpose: Latin + Khmer font declarations (`fonts.css`) consumed by both `project/` and `builder/`.

**`project/uploads/`:**
- Purpose: raw pasted design references (flag, PNG grabs). Historical input material, not a runtime dependency.

**`project/screenshots/`:**
- Purpose: visual audit snapshots taken during design reviews.

**`builder/`:**
- Purpose: interactive token editor and live preview.
- Key files: `index.html`, `styles.css`, `app.js`.
- Mutability: edits freely; never writes to `project/`.

**`builder/tests/`:**
- Purpose: end-to-end checks using Playwright + `claude-in-chrome` MCP.
- Key files: `smoke.mjs` (boot + minimal interaction), `full.mjs` (broader coverage).
- `node_modules/` is large; treat as vendored.

## Notable Top-Level Files

- `project/README.md` — primary human documentation for the design system.
- `project/colors_and_type.css` — single authoritative token file (colors, typography, spacing, radii, shadows, z-indices) on `:root`.
- `project/SKILL.md` — Claude-facing skill metadata describing when the system applies.
- `project/SUPERAPP_HOST.md` — constraints MiniApps must honor when embedded.
- `project/ICONOGRAPHY.md` — lucide-based icon mapping.
- `builder/index.html` — editor shell; declares the 7 editor panels (`[data-panel]`) and 6 preview modes (`[data-view]`).
- `builder/styles.css` — all styling for editor + every component specimen; consumes `var(--space-N)`, `var(--radius-*)`, `var(--text-*)`, `var(--color-*)`, `var(--shadow-*)`.
- `builder/app.js` — seeds token arrays, wires input handlers → `apply()` → `document.documentElement.style.setProperty`, dispatches `stageRenderers[currentView]()` on every change.
- `builder/tests/smoke.mjs` — fastest confidence check; used in CI-style loops.
- `builder/tests/full.mjs` — thorough run (Playwright + MCP).

## Cross-Surface Linking

`builder/` references `project/` only through **relative HTTP paths** at render time, never via filesystem writes:

- `<img src="../project/assets/superapp-logo.svg">` in `builder/index.html` (light + dark logo defaults).
- Token defaults in `builder/app.js` mirror values in `project/colors_and_type.css` — they are copies, kept in sync manually.
- Fonts are loaded from Google Fonts CDN in `builder/index.html` (mirroring faces declared in `project/fonts/fonts.css`).

This guarantees that running the builder never produces writes into `project/`; all mutation is in-memory or exported via clipboard/download.

## Naming Conventions

**Files:**
- Component specimens: `kebab-case.html` (e.g. `section-header.html`, `file-uploader.html`).
- Docs: `UPPERCASE.md` (e.g. `README.md`, `SKILL.md`, `SUPERAPP_HOST.md`, `ICONOGRAPHY.md`).
- JSX modules: `lowercase.jsx` (e.g. `components.jsx`, `tiles.jsx`).
- Tests: `<scope>.mjs` (e.g. `smoke.mjs`).

**Directories:**
- All lower-case, singular or short plural (`assets`, `fonts`, `preview`, `screenshots`, `uploads`, `ui_kits/miniapp`).

**CSS tokens:**
- `--color-*`, `--text-*`, `--space-N` (numeric step on 4pt scale), `--radius-*`, `--shadow-*`, `--font-latin`, `--font-khmer`.

## Where to Add New Code

**New component specimen:**
- Static preview: `project/preview/<name>.html` — self-contained, reads `../colors_and_type.css`.
- Kit version: add to `project/ui_kits/miniapp/components.jsx` + styles into `kit.css`.
- Builder showcase: append a `<section class="card">` block inside `stageRenderers.components()` in `builder/app.js`, reference the preview filename in the category heading, and add any new styles to `builder/styles.css` using existing token variables.

**New token:**
- Declare in `project/colors_and_type.css` on `:root`.
- Mirror the default value into the corresponding seed array (`COLORS` / `TYPE` / `SPACES` / `RADII` / `SHADOWS`) in `builder/app.js`.
- Consume via `var(--your-token)` anywhere in `builder/styles.css` or component specimens.

**New preview stage in builder:**
- Add a `<button class="mode" data-view="newview">` in `builder/index.html`.
- Add a `newview(){ $('#stage').innerHTML = ... }` entry to the `stageRenderers` object in `builder/app.js`.
- No other wiring needed — the existing click handler routes automatically.

**New test:**
- Place alongside `builder/tests/smoke.mjs`; follow its Playwright + `claude-in-chrome` MCP pattern.

**Never add under:**
- `project/` from builder tooling — that directory is the immutable source of truth.
- `builder/tests/node_modules/` — vendored dependency tree.

## Special Directories

**`project/uploads/`** — historical reference imagery; not imported at runtime. Committed.

**`project/screenshots/`** — visual audit artifacts. Committed.

**`builder/tests/node_modules/`** — Playwright + playwright-core install; generated. Typically gitignored in real checkouts even if present locally.

**`.planning/codebase/`** — GSD mapping documents (these files). Generated by the mapper; consumed by planners/executors.

---

*Structure analysis: 2026-04-24*
