# Phase 4: Headers + Navigation - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship MiniApp navigation chrome as **8 registry items**: 5 `registry:ui` (AppHeader, SectionHeader, SegmentedTabs, StepIndicator, NavRow) + 3 `registry:block` (HeroBanner, SideDrawer, miniapp-home). Exit gate: `/preview/miniapp-home` route composes `AppHeader + HeroBanner + NavRow + tile-stub grid` installed end-to-end via the shadcn CLI, with the dogfood route at `src/app/preview/miniapp-home/page.tsx` importing the block source directly.

Scope intentionally excludes ServiceTile, ServiceGrid, FileUploader, MinistryPicker, FormScreen, MobileFrame (all Phase 6) and Dialog/Sheet/Toast/Empty/Skeleton/Spinner/Alert (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Item scope & split
- **D-01:** Ship 8 registry items: 5 `registry:ui` (`app-header`, `section-header`, `segmented-tabs`, `step-indicator`, `nav-row`) + 3 `registry:block` (`hero-banner`, `side-drawer`, `miniapp-home`). HeroBanner promoted from `ui` → `block` because it composes pattern overlay + inner card + headless carousel + multi-slide content.
- **D-02:** ROADMAP exit-gate text shifts from "ServiceTile grid" → "tile-stub grid" because ServiceTile is Phase 6. Planner must request a one-line ROADMAP update before/with the phase plan.
- **D-03:** Each compound item ships as **one file per parent in `registry/<name>/<name>.tsx`** with dot-namespace exports (e.g., `app-header.tsx` exports `AppHeader, AppHeader.Title, AppHeader.Leading, AppHeader.Trailing`). Phase 3 D-03/04/05 pattern, no exceptions.
- **D-04:** HeroBanner's stippled-dot pattern, carousel-dot indicator, and inner-card variant ship inline in the block source — **no separate `carousel-dots` or `pattern-stipple` registry item**.
- **D-05:** NavRow trailing slot is **hybrid**: chevron + count-badge ship as built-in `trailing` variants (most common in legacy specimens); switch/toggle use the Phase 3 `switch` primitive via slot (`trailing={<Switch.../>}`). NavRow declares `registryDependencies` on `badge` for the count-badge variant.

### Composition API
- **D-06:** Compound items use **hybrid composition**: top-level prop for the common case + dot-namespace child slots for full control. Example: `<AppHeader title="Apply for visa" leading={<Menu/>} trailing={<Bell/>}/>` is the 80% path; `<AppHeader leading={...}><AppHeader.Title><CustomLogo/></AppHeader.Title></AppHeader>` is the escape hatch when consumers need custom title rendering.
- **D-07:** AppHeader's right-slot auto-sizes from child count using CSS grid intrinsic sizing — 1 trailing icon → 56px column, 2+ → 96px column. Implemented via `grid-template-columns: 56px 1fr auto` (R5.1). No `trailingWidth` prop.
- **D-08:** StepIndicator and SegmentedTabs ship **both** APIs: compound parts (`<StepIndicator.Step>`, `<SegmentedTabs.Trigger>`) as the canonical surface AND a `steps={[]}` / `items={[]}` data-array prop that internally maps to compound. Document the array path as a thin wrapper to prevent API drift; tests cover both paths in parallel.
- **D-09:** SideDrawer block declares `registryDependencies: [".../r/app-header.json", ".../r/dgc-theme.json"]` (and `dependencies: ["@radix-ui/react-dialog", "lucide-react"]`). Internally renders `<SideDrawer.Header><AppHeader>...</AppHeader></SideDrawer.Header>` so installing SideDrawer auto-installs AppHeader (Phase 3 D-14 cascade pattern).

### HeroBanner carousel
- **D-10:** Carousel is **headless-controlled**: `<HeroBanner activeIndex={i} onIndexChange={setI}>` props only. **No internal state, no auto-advance, no swipe handlers, no keyboard handlers** in this phase. Consumer drives index. A reusable `useCarousel` hook (auto-advance, swipe, ARIA roving tabindex) is deferred to Phase 6 if real consumer demand surfaces.
- **D-11:** Slide content accepts both compound (`<HeroBanner.Slide>...</HeroBanner.Slide>`) and a `slides={[{title, body, cta}]}` data-array prop (sugar for the title-body-cta common case). Array path renders compound internally.
- **D-12:** Stippled-dot pattern is implemented as **inline CSS** — either a `bg-[radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)]` Tailwind arbitrary value with `--bg-image-size` from a token, OR a `--pattern-stipple: ...` token added to `dgc-theme/theme.css` and consumed via `bg-[image:var(--pattern-stipple)]`. Researcher picks one; both keep dark-mode aware via existing tokens. **No SVG asset shipped**. Visual-diff Playwright run vs legacy `hero-banner.html` confirms parity (max ΔRGB threshold per Phase 2 precedent).
- **D-13:** Inner-card variant is opt-in via `<HeroBanner.Card>` slot inside a `<HeroBanner.Slide>`. When present, the card-on-pattern variant renders; when absent, slide content sits directly on the pattern. No `card` boolean.

### Icon & nav-routing
- **D-14:** Icons are **ReactNode slot props** — every item that takes an icon accepts `icon?: ReactNode` (and `leading`/`trailing` already do). Defaults import a Lucide icon in registry source; consumers override by passing any element. Prepares clean DGC-icon swap when production set arrives (PROJECT constraint).
- **D-15:** Active state is **pure presentational** — NavRow accepts `active?: boolean`, SegmentedTabs accepts `value` + `onValueChange` (Radix Tabs underneath), StepIndicator accepts per-step `state: 'done' | 'active' | 'pending'`. **No `usePathname()` coupling** anywhere in registry source — preserves R10 portability beyond Next.js. Docs page ships a 5-line `usePathname()` recipe for Next.js consumers.
- **D-16:** Each registry JSON declares `dependencies: ["lucide-react"]` per Phase 3 D-15. shadcn CLI dedupes at install time. SegmentedTabs adds `@radix-ui/react-tabs` (Phase 3 already does); SideDrawer adds `@radix-ui/react-dialog`. NavRow + AppHeader chevron-badge variant additionally declares `registryDependencies` on `badge` (Phase 3 item).
- **D-17:** `miniapp-home` block ships an inline `<HomeTile>` placeholder component inside the block source (not a separate registry item). 6-tile mock grid uses gradient + label per legacy `superapp-host.html`. Phase 6 deliverable: swap `<HomeTile>` for real `<ServiceTile>` via consumer codemod or doc-page instruction.

### Claude's Discretion
- Exact CSS grid template values for AppHeader (within R5.1 spec — 56/1fr/56-or-96).
- StepIndicator connector-bar render strategy (pseudo-element vs separate span vs flex-grow divider).
- Stipple-pattern radial-gradient parameters — researcher picks values that match legacy ΔRGB ≤ 2.
- SegmentedTabs underline/pill animation: `transition-transform` on a sliding indicator vs per-trigger background. Either works as long as visual-diff matches.
- Tooltip wiring on AppHeader icon buttons (use Phase 3 `tooltip` or skip for v1).
- `useId()` vs explicit `id` props for label associations — go with shadcn convention.
- Playground rendering for layout-heavy items: extend `PlaygroundShell` with a "demo" mode for items where `controls` alone don't capture the surface, OR ship a per-item `<Demo>` component rendered when controls are empty.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase inputs (in target repo `D:/sources/dgc-miniapp-shadcn/`)
- `.planning/ROADMAP.md` §"Phase 4 — Headers + navigation" — goal, scope, exit gate
- `.planning/REQUIREMENTS.md` §R5 — acceptance criteria R5.1–R5.7
- `.planning/PROJECT.md` §Constraints, §"Success criteria", §"Decisions on record" (via STATE.md)
- `.planning/STATE.md` §"Decisions on record" — stack, distribution, dark-mode, icon-placeholder

### Visual source of truth (read before implementing each item)
- `D:/sources/dgc-miniapp-design-system/project/preview/app-header.html` — 56px navy, 3-slot grid, dot/count badges
- `D:/sources/dgc-miniapp-design-system/project/preview/hero-banner.html` — radius, stipple, inner card, carousel dots
- `D:/sources/dgc-miniapp-design-system/project/preview/section-header.html` — title + accent link action
- `D:/sources/dgc-miniapp-design-system/project/preview/segmented-tabs.html` — pill group, surface-2 track, accent fill active
- `D:/sources/dgc-miniapp-design-system/project/preview/step-indicator.html` — numbered 28px circles, connector bars, 3 states
- `D:/sources/dgc-miniapp-design-system/project/preview/nav-row.html` — 48px min-height, leading 24px chip, trailing variants, active state stripe
- `D:/sources/dgc-miniapp-design-system/project/preview/side-drawer.html` — Radix Dialog slide-left, profile block, scroll list, legal footer
- `D:/sources/dgc-miniapp-design-system/project/preview/superapp-host.html` — composed home view (target for `/preview/miniapp-home`)

### Phase 2 outputs (upstream dependencies — in target repo)
- `D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/theme.css` — semantic tokens (`--accent`, `--bg-surface-2`, `--blue-050`, `--gradient-hero`, `--radius-lg`, etc.) — components consume these only
- `D:/sources/dgc-miniapp-shadcn/tailwind.config.ts` — Tailwind v4 utility ↔ token mapping

### Phase 3 outputs (upstream dependencies — in target repo, will be reused)
- `D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx` — icon-button variants used inside AppHeader leading/trailing slots
- `D:/sources/dgc-miniapp-shadcn/registry/badge/` — count badges in NavRow + AppHeader (Phase 3 R4.X — confirm exact filename when planning)
- `D:/sources/dgc-miniapp-shadcn/registry/switch/` — NavRow trailing switch slot
- `D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx` — SegmentedTabs renders as a styled wrapper around Radix Tabs (existing primitive); confirm via plan whether SegmentedTabs is a new registry item or a variant on Tabs
- `D:/sources/dgc-miniapp-shadcn/registry/scroll-area/` — SideDrawer scrollable nav list
- `D:/sources/dgc-miniapp-shadcn/registry/tooltip/` — optional for AppHeader icon-button hints
- `D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts` — append 8 new entries; respects `ManifestEntry` + `PropControl` shape (Phase 3 D-11/12)
- `D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/PlaygroundShell.tsx` — playground harness; may need a "demo mode" extension for layout items
- `D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/page.tsx` — `generateStaticParams` enumerates manifest entries

### Phase 3 CONTEXT (carries forward in full)
- `.planning/phases/03-primitives/3-CONTEXT.md` §Implementation Decisions — all 15 decisions apply unchanged. Highlights: D-01/02 (CVA + tokens), D-03/04/05 (single-file compound bundling), D-06 (no `dark:*` utilities), D-08/09 (Khmer + RTL via `lang="km"` + bilingual font stack), D-11/12 (manifest pattern), D-14/15 (registryDependencies cascade + lucide-react)

### Research refs (in target repo `.planning/`)
- `.planning/research/shadcn-registry.md` — registry JSON schema rules
- `.planning/research/port-strategy.md` — migration patterns (HEX → token, legacy specimen → registry item)
- `.planning/codebase/CONVENTIONS.md` — code conventions (read first)
- `.planning/codebase/STRUCTURE.md` — repo layout
- `.planning/codebase/STACK.md` — stack confirmation
- `.planning/codebase/TESTING.md` — Playwright + axe + smoke-consumer patterns

### External specs (fetch via WebFetch / MCP context7)
- https://ui.shadcn.com/docs/registry — shadcn registry JSON schema
- https://ui.shadcn.com/docs/components — canonical component baselines (where they exist)
- https://www.radix-ui.com/primitives/docs/components/dialog — SideDrawer foundation (slide-left, focus management, ESC, portal)
- https://www.radix-ui.com/primitives/docs/components/tabs — SegmentedTabs foundation (Phase 3 already integrated)
- https://lucide.dev/icons — Lucide icon set (placeholder per STATE)
- https://github.com/dequelabs/axe-core/tree/develop/packages/playwright — `@axe-core/playwright` for the CI a11y gate

### Non-functional gates (R10 — apply to every item)
- Khmer (`lang="km"`) renders correctly with bilingual font stack
- `.dark` class theme switch works without style breakage
- Touch targets ≥ 44px for AppHeader icon buttons (R5.1)
- A11y: roles + ARIA confirmed via `axe-core` Playwright run
- RTL not required this phase (PROJECT — Khmer is LTR), but no LTR-only `margin-left`/`right` patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets (Phase 1-3 outputs in target repo)
- `dgc-theme` tokens — every Phase 4 item consumes via Tailwind utilities; no raw hex
- Phase 3 `button` — used inside AppHeader/SideDrawer for icon-buttons; `variant="ghost"` + `size="icon"`
- Phase 3 `badge` — count badges in NavRow trailing + AppHeader notifications (registryDependencies)
- Phase 3 `switch` — NavRow trailing switch slot (consumer composes via `<NavRow trailing={<Switch.../>}/>`)
- Phase 3 `tabs` — SegmentedTabs likely renders Radix Tabs underneath with DGC styling (decide in plan: separate item vs Tabs variant)
- Phase 3 `scroll-area` — SideDrawer scrollable nav list
- Phase 3 `tooltip` — optional AppHeader icon-button hints
- `registry/items.manifest.ts` — append 8 entries with `ManifestEntry` shape
- `src/app/preview/[item]/{page.tsx, PlaygroundShell.tsx, renderers/}` — playground harness; extend renderers for layout items
- `scripts/visual-diff.mjs` — Playwright visual-diff vs legacy specimens (Phase 2 precedent: ΔRGB ≤ 2)
- `scripts/smoke-consumer.mjs` — `SMOKE_WITH_PRIMITIVES=1` walks the manifest; extend the regex Phase 3 commit `5b4ebdc` scoped to top-level entries

### Established patterns (continue applying)
- **Token pipeline:** Tailwind v4 `@theme` block; components use `bg-primary`, `text-foreground`, `bg-[var(--bg-surface-2)]` — never raw hex
- **Registry build:** `npx shadcn build` compiles `registry.json` + `registry/<item>/*` → `public/r/<name>.json`. 8 new entries → 8 new `registry/<item>/` folders + 8 `registry-item.json` updates + root `registry.json` bump
- **Item layout:** `registry/<name>/<name>.tsx` (single file with dot-namespace exports) + `registry/<name>/registry-item.json` (per-item metadata)
- **Manifest registration:** every plan appends one `ManifestEntry` to `registry/items.manifest.ts`
- **Docs page:** MDX at `/docs/components/<docs-slug>` with copy-pastable `npx shadcn add` command
- **Playground:** `/preview/<item-slug>` rendered via `PlaygroundShell` — controls drive prop knobs; layout items may need a Demo escape hatch
- **CI deploy:** push `main` → GitHub Actions → GitHub Pages at `registry.016910804.xyz`. CI gates: typecheck, unit, build, drift-check, a11y, smoke-consumer

### Integration points
- Append entries to `registry/items.manifest.ts` (Phase 3 D-11)
- Append item objects to root `registry.json` and bump version (Phase 2/3 precedent: minor bump per phase — likely `0.4.0`)
- Add 8 new files to `scripts/visual-diff.mjs` baseline list (one per item)
- New dogfood route at `src/app/preview/miniapp-home/page.tsx` (sibling to `[item]/`)
- ROADMAP.md exit-gate text update (one line) per D-02

</code_context>

<specifics>
## Specific Ideas

- Hybrid `title` prop + `<X.Title>` slot is the API pattern users care about — keeps the 80% case terse, never blocks customization. Apply this to **every** Phase 4 compound item, not just AppHeader.
- Headless carousel: prove the `useEffect` auto-advance recipe in the docs page so consumers know exactly how to wire it. Five lines, with cleanup. Demonstrates the deferred `useCarousel` is unnecessary for v1.
- Tile-stub naming: prefer `HomeTile` (descriptive, no "stub" suffix in user-visible exports). The stub-vs-real swap is documented but the type name doesn't telegraph "temporary".
- Government tone in default props: every example uses sentence case ("Apply for visa", not "Apply for Visa"), no exclamation marks, no emoji. Phase 5 will codify; Phase 4 sets the precedent.
- ROADMAP exit-gate update: open as a one-line edit in the same plan that ships `miniapp-home`, not as a separate roadmap-edit phase.

</specifics>

<deferred>
## Deferred Ideas

- **`useCarousel` hook** (auto-advance, swipe, keyboard, ARIA roving tabindex) — Phase 6 if real consumer demand emerges. Phase 4 ships headless-controlled only.
- **Real ServiceTile + 6 gradient variants** (R7.5) — Phase 6
- **ServiceGrid layout block** — Phase 6 (composes ServiceTile)
- **TimestampTag, DocumentListRow, InfoRow, Table** (R7) — Phase 6
- **FileUploader, MinistryPicker, FormScreen, MobileFrame** (R8) — Phase 6
- **Dialog, Sheet/BottomSheet, Toast, Empty, Skeleton, Spinner, Alert** (R6) — Phase 5
- **Production DGC icon set swap** — v1.1 / when DGC icons delivered (PROJECT constraint)
- **`<NavRow.Link href>` Next.js adapter** — possible Phase 7 docs polish add-on, not registry item
- **Bearer-auth private registry, `/v1/` versioning** — v2 (STATE decision)
- **npm package publishing** — explicitly out of scope (REQUIREMENTS §Out of scope)
- **RTL support** — out of scope (Khmer is LTR; PROJECT)
- **Roadmap regex compatibility fix** — gsd-tools `getRoadmapPhaseInternal` requires `## Phase N:` with literal colon, but ROADMAP.md uses em-dash. Phase 4 worked around via empty phase directory; durable fix is a one-line ROADMAP heading edit (add colons to all 7 phase headings) so future `phase-op` lookups don't depend on directory existence. Capture as a tooling todo, not phase scope.

### Reviewed Todos (not folded)
- None — `gsd-tools todo match-phase 4` returned 0 matches.

</deferred>

---

*Phase: 04-headers-navigation*
*Context gathered: 2026-04-25*
