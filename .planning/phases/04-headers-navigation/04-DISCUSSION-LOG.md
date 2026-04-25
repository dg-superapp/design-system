# Phase 4: Headers + Navigation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `04-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-25
**Phase:** 04-headers-navigation
**Areas discussed:** Item scope & split, Composition API, HeroBanner carousel, Icon + nav-routing

---

## Item scope & split

### Q1: Confirm the registry breakdown for Phase 4?

| Option | Description | Selected |
|--------|-------------|----------|
| 7 ui + 1 block | ROADMAP exit-gate verbatim (HeroBanner stays as ui) | partial |
| 6 ui + 2 blocks | Promote HeroBanner to block (composes pattern + carousel + card) | partial |
| Bundle nav-cluster items | Ship SectionHeader/SegmentedTabs/StepIndicator/NavRow as one family item | |

**User's choice:** "1+2" — combine baseline scope with the HeroBanner promotion.
**Notes:** Final breakdown captured in CONTEXT.md D-01: 5 `registry:ui` + 3 `registry:block` (HeroBanner promoted, miniapp-home added per Q9).

### Q2: How should compound sub-parts be packaged inside each registry item?

| Option | Description | Selected |
|--------|-------------|----------|
| Single file, dot-namespace exports | Phase 3 D-03/04/05 pattern; `app-header.tsx` exports parent + sub-parts | ✓ |
| Multiple files, same registry item | Cleaner separation but breaks Phase 3 single-file convention | |
| Closed API — no sub-component exports | Drops compound flexibility | |

**User's choice:** Single file, dot-namespace exports (recommended).

### Q3: Where should HeroBanner's carousel-dot indicator live?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline inside HeroBanner | No separate registry item; consistent with block self-containment | ✓ |
| Separate `carousel-dots` registry:ui | Reusable but adds an item with no other consumer in v1 | |
| Slot prop, no built-in dots | Pushes dot-indicator complexity to consumers | |

**User's choice:** Inline inside HeroBanner (recommended).

### Q4: How should NavRow's trailing slot handle chevron / badge / switch / toggle?

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid: chevron+badge built-in, switch/toggle via slot | Reuses Phase 3 Switch; no logic duplication | ✓ |
| All four as named variants | Simplest API but duplicates Switch internals | |
| Pure slot, no built-ins | Maximally flexible, every consumer reimplements common patterns | |

**User's choice:** Hybrid (recommended).

---

## Composition API

### Q5: Composition style for AppHeader and other compound items?

| Option | Description | Selected |
|--------|-------------|----------|
| Compound dot-namespace | `<AppHeader><AppHeader.Leading/><AppHeader.Title/>...</AppHeader>` | |
| Slot props | `<AppHeader leading={...} title="..." trailing={...}/>` | |
| Hybrid: title prop + slot children | Top-level props for 80% case, dot-namespace override for custom content | ✓ |

**User's choice:** Hybrid — `<AppHeader title="..." leading={...} trailing={...}/>` as the common path, `<AppHeader.Title>` available when consumers need a logo or other custom title rendering.

### Q6: AppHeader right-slot 56px-or-96px width handling (R5.1)?

| Option | Description | Selected |
|--------|-------------|----------|
| Auto from child count | CSS grid intrinsic sizing; 1 icon → 56px, 2+ → 96px | ✓ |
| Explicit `trailingWidth` prop | Predictable but requires consumer to count icons | |
| Always 96px | Wastes 40px on the common single-icon case | |

**User's choice:** Auto from child count (recommended).

### Q7: StepIndicator + SegmentedTabs API — compound or array-data?

| Option | Description | Selected |
|--------|-------------|----------|
| Compound parts only | `<StepIndicator.Step>`, `<SegmentedTabs.Trigger>` | |
| Data-array prop only | `<StepIndicator steps={[...]} />` | |
| Both — compound + array sugar | Compound is canonical; array maps to compound internally | ✓ |

**User's choice:** Both. Plan must document the array path as a thin wrapper over compound; tests cover both paths to prevent API drift.

### Q8: SideDrawer block reuse of AppHeader inside its Radix Dialog?

| Option | Description | Selected |
|--------|-------------|----------|
| registryDependencies on AppHeader | Auto-installs AppHeader; Phase 3 D-14 cascade pattern | ✓ |
| Header slot prop, no auto-install | Requires consumer to install AppHeader separately | |
| Inline duplicate of AppHeader | Avoids dependency cascade; duplicates 56px-grid + badge logic | |

**User's choice:** registryDependencies on AppHeader (recommended).

---

## HeroBanner carousel

### Q9: How interactive should HeroBanner's carousel be?

| Option | Description | Selected |
|--------|-------------|----------|
| Headless controlled | `slides`, `activeIndex`, `onIndexChange`; no internal state | ✓ |
| Static dots | Indicator-only; no slide swapping | |
| Full carousel | Auto-advance + swipe + keyboard + ARIA roving tabindex | |

**User's choice:** Headless controlled (recommended). Auto-advance hook deferred to Phase 6 if demand emerges.

### Q10: How does HeroBanner accept slide content?

| Option | Description | Selected |
|--------|-------------|----------|
| Compound `<HeroBanner.Slide>` parts | Slide count from children | |
| Render-prop | `renderSlide={(s,i) => ...}` | |
| Both — compound + slides[] sugar | Consistent with StepIndicator/SegmentedTabs decision | ✓ |

**User's choice:** Both (compound + array sugar).

### Q11: Stippled-dot pattern (R5.2) implementation?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline CSS via `bg-[radial-gradient(...)]` or `--pattern-stipple` token | Token-driven, dark-mode aware | ✓ |
| SVG asset shipped with item | Pixel-perfect but bypasses tokens | |
| Defer pattern to consumer CSS | Drops design intent | |

**User's choice:** Inline CSS (recommended). Researcher picks final radial-gradient values; visual-diff vs legacy specimen confirms parity.

### Q12: Inner-card variant (R5.2)?

| Option | Description | Selected |
|--------|-------------|----------|
| Optional `<HeroBanner.Card>` slot | Composes with slide compound API | ✓ |
| Built-in `card` boolean | Simpler but couples slide content to a phase-shared card style | |
| Two separate registry items | Doubles install surface; rejected by bundling principle | |

**User's choice:** Optional `<HeroBanner.Card>` slot (recommended).

---

## Icon + nav-routing

### Q13: How should consumers swap icons inside Phase 4 components?

| Option | Description | Selected |
|--------|-------------|----------|
| ReactNode slot props | `icon={<MapPin/>}`; defaults to Lucide; consumer replaces by passing any element | ✓ |
| Icon-name string + registry map | `<NavRow icon="map-pin"/>`; couples to a name registry | |
| Hard-coded Lucide imports | Consumer edits installed source to change | |

**User's choice:** ReactNode slot props (recommended). Prepares clean DGC-icon swap path.

### Q14: How should NavRow / SegmentedTabs / StepIndicator wire to active state?

| Option | Description | Selected |
|--------|-------------|----------|
| Pure presentational | Boolean/value props; no router coupling | ✓ |
| Optional `<NavRow.Link href>` adapter | Pure + Next.js sub-component using `usePathname()` | |
| Always Next.js-aware | Internal `usePathname()` call | |

**User's choice:** Pure presentational (recommended). Preserves R10 portability beyond Next.js. Docs ship a 5-line `usePathname()` recipe.

### Q15: Icon dependencies in registry JSON?

| Option | Description | Selected |
|--------|-------------|----------|
| Each item's `dependencies: ["lucide-react"]` | Phase 3 D-15 pattern | ✓ |
| Hoist to dgc-theme dependencies | DRY but couples icon-set choice to theme | |
| Peer dependency, documented in docs | Simpler JSON, harder consumer experience | |

**User's choice:** Each item declares `lucide-react` (recommended).

### Q16: How should `/preview/miniapp-home` exit-gate page ship?

| Option | Description | Selected |
|--------|-------------|----------|
| Block + dogfood preview route | Ship as 8th item; dogfood route imports block source | ✓ |
| Preview route only | Hand-composed showcase; not installable | |
| Defer to Phase 6 | Land alongside ServiceTile | |

**User's choice:** Block + dogfood preview route (recommended).

---

## Tile dependency resolution

### Q17: Phase 4's miniapp-home block needs ServiceTile (Phase 6) — how?

| Option | Description | Selected |
|--------|-------------|----------|
| Inline tile-stub in block source | `<HomeTile>` placeholder; ROADMAP exit-gate text updated | ✓ |
| Ship ServiceTile early in Phase 4 | Pull from Phase 6; expands scope by one item + 6 gradient variants | |
| Defer miniapp-home to Phase 6 | Phase 4 exit gate becomes smoke-consumer test only | |

**User's choice:** Inline tile-stub (recommended). ROADMAP one-line edit handled by the same plan that ships `miniapp-home`.

---

## Claude's Discretion

Captured in CONTEXT.md `<decisions>` → "Claude's Discretion" — covers exact CSS grid template values, StepIndicator connector-bar render strategy, stipple radial-gradient parameters, SegmentedTabs animation strategy, optional Tooltip wiring, useId vs explicit id props, and Playground demo-mode extension for layout items.

## Deferred Ideas

Captured in CONTEXT.md `<deferred>` — `useCarousel` hook, real ServiceTile, Phase 5/6 components, DGC icon set swap, optional `<NavRow.Link>` adapter, gsd-tools roadmap-regex tooling fix, and the standing v2 / out-of-scope items from PROJECT/STATE.
