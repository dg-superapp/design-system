# Phase 3: Primitives (14 items) - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Mode:** `--auto` (recommended options auto-selected; log in DISCUSSION-LOG.md)

<domain>
## Phase Boundary

Ship 14 `registry:ui` primitives to the dgc-miniapp-shadcn registry so consumer MiniApps can `npx shadcn@latest add https://registry.016910804.xyz/r/<item>.json` and receive editable DGC-styled TSX.

**In scope:** Button, Input, Textarea, Select, Checkbox, Radio, Switch, Label, Form, Badge, Tooltip, Tabs, Separator, ScrollArea. Each ships: (1) registry JSON entry, (2) component source(s) installed into consumer `components/ui/`, (3) MDX docs page at `app/docs/components/<item>/page.mdx`, (4) playground route `/preview/<item>`.

**Exit proof (from ROADMAP):** all 14 installable end-to-end; axe check passes on every playground route; `/test/khmer` page renders every primitive with Khmer labels/placeholders without clipping.

**Not this phase:** Dialog/Sheet/Toast/Alert/Empty/Skeleton/Spinner (Phase 5), AppHeader/SegmentedTabs/NavRow (Phase 4), Table/InfoRow/blocks (Phase 6), docs-site polish beyond per-item pages (Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Variant API
- **D-01:** Use **CVA (`class-variance-authority`)** for all variant surfaces (Button variants + sizes, Badge tones, Input/Textarea/Select/Switch state classes). shadcn canonical; no custom utility layer.
- **D-02:** Variant tokens are pulled from `dgc-theme` CSS vars — components write Tailwind utilities that read `var(--*)`, not raw hex.

### Component composition
- **D-03:** `Form` (R4.9) ships as a single `registry:ui` item whose `files` array includes `form.tsx` exporting `Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription` (shadcn canonical bundle). Keeps phase at exactly 14 items.
- **D-04:** `Select` (R4.4) and `Tabs` (R4.12) similarly bundle their Radix sub-parts (Trigger/Content/Item, List/Trigger/Content) into one file per parent item.
- **D-05:** Every primitive is a single JSON artifact served at `/r/<name>.json`; sub-parts are NOT separate `registry:ui` items.

### Dark mode
- **D-06:** Dark mode is handled **entirely by `dgc-theme` CSS var flips under `.dark`** (already shipped Phase 2). Primitives MUST NOT contain `dark:*` Tailwind utilities or conditional class logic — they read semantic vars only.

### Khmer rendering
- **D-07:** Khmer handling is **global `:lang(km)` cascade** on `html[lang="km"]` set via dgc-theme globals (line-height: 1.6, font-family Khmer stack). Primitives are Khmer-agnostic at source level — no per-component `lang` branching.
- **D-08:** Each primitive MUST be tested rendered under `lang="km"` on a dedicated `/test/khmer` page (see Testing).

### Docs pages (R9.1, R9.4)
- **D-09:** Docs live at `app/docs/components/<item>/page.mdx` in the registry host repo (`D:/sources/dgc-miniapp-shadcn/`). One page per primitive. Central layout provides nav + ToC.
- **D-10:** Each docs page includes: (a) install command with copy-button (R9.4), (b) props table (auto-extracted or hand-written TSX prop types), (c) variants gallery, (d) bilingual usage example (Khmer + English side-by-side), (e) link to playground.

### Playground (R9.2)
- **D-11:** Dynamic route `app/preview/[item]/page.tsx` driven by a `registry/items.manifest.ts` map. Adding future primitives requires only registering the manifest entry — no new route.
- **D-12:** Playground controls use **React state + typed prop controls** (radio groups, toggles, text inputs). **No runtime JSX eval, no react-live, no sandpack.**
- **D-13:** Playground provides three global toggles: theme (light/dark) via ThemeProvider context, language (en/km) via `lang` attribute on playground frame, mobile viewport (375×812) via CSS constraint wrapper.

### Registry entries
- **D-14:** Each item's registry JSON uses `type: "registry:ui"`, `dependencies` for npm packages (e.g., `@radix-ui/react-select`), `registryDependencies: ["https://registry.016910804.xyz/r/dgc-theme.json"]` so theme cascade installs automatically on first primitive install.
- **D-15:** Icon dependencies use `lucide-react` (Lucide placeholder per STATE decision); `package.json` `dependencies` declares it.

### Accessibility + testing
- **D-16:** Accessibility tests run via **Playwright + `@axe-core/playwright`** against every `/preview/<item>` route. CI job `pnpm test:a11y` runs headless in the GitHub Actions deploy workflow.
- **D-17:** Khmer clipping check — dedicated `/test/khmer` page renders every primitive with Khmer labels/placeholders; Playwright visual-diff snapshot committed to repo; CI fails on diff.
- **D-18:** Focus-ring contract: all interactive primitives implement `--shadow-focus` on `:focus-visible`; unit-covered via Playwright keyboard-tab traversal per item.

### Smoke consumer (R1.4 extension)
- **D-19:** Extend the existing scratch consumer smoke test (`SMOKE_WITH_HELLO=1 pnpm smoke:consumer`) with a new mode `SMOKE_WITH_PRIMITIVES=1` that installs all 14 primitives sequentially and compiles a page importing each. Phase exit blocked until green.

### Claude's Discretion
- Exact file structure per item (e.g., `form.tsx` vs `form/index.tsx`) — match shadcn canonical layout.
- Props table generation mechanism (static hand-written vs. `@microsoft/api-extractor` vs. `react-docgen`) — Claude picks; prefer static if drift risk > automation savings.
- CSS token naming in components — Claude picks between semantic aliases (`--primary`, `--ring`) and DGC scale tokens (`--blue-600`) where both work; preference: semantic aliases for consumer editability.
- Whether to expose `asChild` (Radix `Slot`) on all interactive primitives — default yes where Radix supports it (Button, Tooltip.Trigger, etc.).
- Test snapshot tool — Playwright visual-diff built-in vs `@playwright/test` snapshots — Claude picks.
- Docs MDX layout component shape.

### Folded Todos
None — todo match returned 0.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase inputs
- `.planning/ROADMAP.md` §Phase 3 — scope, exit criteria, depends on Phase 2
- `.planning/REQUIREMENTS.md` §R4 (R4.1–R4.14), §R9.1, §R9.4 — per-primitive spec, docs rules
- `.planning/PROJECT.md` §Scope (in), §Constraints — Radix mandate, Tailwind v4, React 19, Khmer-first, WCAG AA, government tone
- `.planning/STATE.md` §Decisions on record — target repo, stack, HSL convention, `.dark` class, Lucide placeholder

### Visual source of truth (read before implementing each primitive)
- `project/colors_and_type.css` — raw DGC tokens (HEX) + type scale — reference; Phase 2 already converted to HSL
- `project/preview/buttons-primary.html` — Button primary variant spec (R4.1)
- `project/preview/buttons-secondary.html` — Button secondary/ghost/ghost-danger spec (R4.1)
- `project/preview/inputs.html` — Input + Textarea + Select visual spec (R4.2, R4.3, R4.4)
- `project/preview/selection.html` — Checkbox + Radio + Switch spec (R4.5–R4.7)
- `project/preview/tabs.html` — Tabs spec (R4.12)
- `project/preview/elevation.html` — `--shadow-*` tokens (focus ring, hover)
- `project/preview/radii.html` — `--radius-*` tokens
- `project/preview/spacing.html` — `--space-*` tokens
- `project/preview/content-tone.html` — government tone for docs examples
- `project/preview/type-khmer.html`, `project/preview/type-bilingual.html`, `project/preview/type-latin.html` — Khmer + bilingual rendering rules
- `project/README.md` — brand rules
- `project/ICONOGRAPHY.md` — Lucide icon substitution policy
- `project/SUPERAPP_HOST.md` — host context (informs touch targets + safe areas)

### Phase 2 outputs (upstream dependencies — in target repo)
- `D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css` — semantic token aliases (`--primary`, `--background`, `--foreground`, `--muted`, `--accent`, `--destructive`, `--ring`, `--border`, `--input`) + DGC scale tokens — components consume these
- `D:/sources/dgc-miniapp-shadcn/tailwind.config.ts` — Tailwind v4 preset mapping utilities to CSS vars
- `D:/sources/dgc-miniapp-shadcn/registry.json` — existing schema; append primitive entries
- `D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml` — extend with `pnpm test:a11y` gate

### Research refs
- `.planning/research/shadcn-registry.md` — registry schema rules
- `.planning/research/port-strategy.md` — migration patterns
- `.planning/codebase/CONVENTIONS.md` — existing conventions (read first)
- `.planning/codebase/STRUCTURE.md` — existing structure
- `.planning/codebase/STACK.md` — existing stack confirmation
- `.planning/codebase/TESTING.md` — existing test patterns

### External specs (fetch via WebFetch / docs)
- https://ui.shadcn.com/docs/registry — shadcn registry JSON schema (current version)
- https://ui.shadcn.com/docs/components — shadcn canonical primitive source per item (Button, Input, …) — use as starting point then apply DGC tokens
- https://www.radix-ui.com/primitives/docs — Radix primitive APIs for Select, Checkbox, Radio, Switch, Tooltip, Tabs, ScrollArea
- https://react-hook-form.com/docs — RHF API for Form (R4.9)
- https://zod.dev — zod schema API for Form (R4.9)
- https://lucide.dev/icons — Lucide icon set (placeholder per STATE)
- https://github.com/dequelabs/axe-core/tree/develop/packages/playwright — `@axe-core/playwright` usage

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets (from Phase 1 + 2 in target repo `D:/sources/dgc-miniapp-shadcn/`)
- `registry/dgc-theme/` — semantic + scale CSS vars, dark mode flip under `.dark`, Khmer font cascade under `:lang(km)` — every primitive inherits these
- `registry/hello/` — reference shape for `registry:ui` item structure
- `registry.json` — root registry listing; append 14 entries
- `pnpm` workspace — add dev deps (@radix-ui/react-*, react-hook-form, zod, class-variance-authority, @axe-core/playwright, @playwright/test, lucide-react)
- `app/docs/foundations/tokens/page.mdx` — MDX pattern (Phase 2) — reuse layout for component docs
- `.github/workflows/deploy.yml` — existing pipeline (pnpm → build → shadcn build → deploy-pages); extend with a11y + Khmer gates before deploy

### Established patterns
- **Token pipeline:** Tailwind v4 CSS-first `@theme` block; `tailwind.config.ts` maps utilities; components use `bg-primary`, `text-foreground`, etc. — NOT raw hex.
- **Registry build:** `npx shadcn build` compiles `registry.json` + `registry/<item>/*` → `public/r/<name>.json`. 14 new entries require 14 new `registry/<item>/` folders.
- **MDX docs:** Next.js App Router MDX handler already configured Phase 2 at `/docs/foundations/tokens`.
- **CI deploy:** Push `main` → GitHub Actions → GitHub Pages at `registry.016910804.xyz`.

### Integration points
- **Consumer install path:** `registry:ui` items land in consumer `components/ui/<name>.tsx` — naming and import paths must match shadcn convention (`@/components/ui/button`).
- **`registryDependencies`:** every primitive JSON references `…/r/dgc-theme.json` so cascade installs on first add.
- **Playground routes:** live under `app/preview/[item]/page.tsx`; registered in `registry/items.manifest.ts`.
- **Docs routes:** live under `app/docs/components/<item>/page.mdx`; nav entry in docs layout.
- **Smoke consumer:** `scripts/smoke-consumer.sh` (existing) — extend with primitive batch mode.

</code_context>

<specifics>
## Specific Ideas

- **Button disabled state** — must use `--bg-disabled` + `--fg-on-disabled` (R4.1) — NOT `opacity-50` or `text-muted-foreground`.
- **Input date placeholder** — the literal Khmer string `ថ្ងៃ/ខែ/ឆ្នាំ` (R4.2) must render on `<input lang="km" type="date">` placeholder.
- **Form error styling** — messages use `--danger` semantic var (R4.9) — not `text-red-500`.
- **Tooltip bg** — exact `--gray-900` (R4.11) — not `bg-popover`.
- **Label required asterisk** — color `--red-600` (R4.8).
- **Switch dimensions** — track 40×24, thumb 18px exactly (R4.7).
- **Checkbox** — 18px box, custom check glyph (R4.5).
- **Radio** — 999px circle with white dot on `--accent` (R4.6).
- **Badge** — 4 tones pair a `*-bg` token with semantic foreground (R4.10); must not use a 5th tone.
- **Tabs** — "static-specimen-compatible with optional active state" (R4.12) — i.e., can render without Radix state for docs/static examples (controlled mode optional).
- **Separator** — `1px solid var(--border)` (R4.13) — NOT `border-muted`.

</specifics>

<deferred>
## Deferred Ideas

- **Dialog, Sheet/BottomSheet, Toast, Empty, Skeleton, Spinner, Alert** — Phase 5 (Feedback + overlays)
- **AppHeader, HeroBanner, SegmentedTabs, StepIndicator, NavRow, SideDrawer, SectionHeader** — Phase 4 (Headers + navigation)
- **Table, InfoRow, DocumentListRow, TimestampTag, ServiceTile, FileUploader, MinistryPicker, FormScreen, MobileFrame, ServiceGrid** — Phase 6 (Data + blocks)
- **Production DGC icon set** — stays on Lucide placeholder until DGC set delivered (PROJECT constraint)
- **Bearer-auth private registry, `/v1/` versioning** — v2 (STATE decision)
- **npm package publishing** — explicitly out of scope (REQUIREMENTS §Out of scope)
- **Props-table auto-generation pipeline** — if static docs drift, revisit in Phase 7 (docs polish)

### Reviewed Todos (not folded)
None — `todo match-phase 3` returned 0 matches.

</deferred>

---

*Phase: 3-primitives*
*Context gathered: 2026-04-24 (auto mode)*
