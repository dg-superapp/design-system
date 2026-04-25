# Phase 4: Headers + Navigation — Research

**Researched:** 2026-04-25
**Domain:** MiniApp navigation chrome (Radix Dialog + Tabs + composition patterns) on top of Phase 2 dgc-theme + Phase 3 primitives, distributed as 8 shadcn registry items (5 `registry:ui` + 3 `registry:block`).
**Confidence:** HIGH (all decisions locked in CONTEXT + UI-SPEC; this research operationalizes the *how*, not the *what*.)

## Summary

Phase 4 ships eight navigation items with a layout-heavy surface area where the prior playground (PropControl-only) is insufficient. The research confirms: (a) every Radix dependency the phase needs **except `@radix-ui/react-dialog`** is already installed (Tabs 1.1.13, ScrollArea 1.2.10, Tooltip ^1.2.8, Slot ^1.2.4); Dialog must be added to the `side-drawer` `dependencies` field and to root `package.json` for the dogfood route. (b) The dot-namespace export pattern, CVA-driven variants, single-file-per-parent, and `data-[state=*]` Tailwind v4 attribute selectors are established by Phase 3 and apply unchanged. (c) The two new mechanisms not seen in Phase 3 — Radix Dialog slide-left motion and the dual-API (`steps={[]}` + `<X.Step>`) compound pattern — have well-known implementations that fit Tailwind v4 + Radix without any new tooling. (d) The PlaygroundShell `PreviewSlot` already dispatches per-item via `previewRenderers[entry.name]`; layout-heavy items extend that registry with bespoke renderers driven by typed `PropControl` knobs (no JSX-eval needed, 3-CONTEXT D-12 holds).

**Primary recommendation:** Run six waves (Wave 0: tokens + Dialog dep + per-item renderer plumbing; Waves 1–5: per-item plans matching the dependency DAG in UI-SPEC §Item-by-item; Wave 6: manifest + visual-diff baseline + smoke-consumer regex bump + ROADMAP exit-gate edit). Use existing patterns verbatim — every Phase 4 item is a token consumer, not a token producer, except for the nine new tokens cataloged in UI-SPEC §Tokens which land in Wave 0. SegmentedTabs styles Radix Tabs *directly* (does not depend on the Phase 3 `tabs` registry item) to avoid CVA variant collisions. HeroBanner stays headless-controlled, no carousel library — a 30-line `useState`+`useEffect` consumer recipe in the docs page proves the deferred `useCarousel` is unnecessary for v1.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Item scope & split**

- **D-01:** Ship 8 registry items: 5 `registry:ui` (`app-header`, `section-header`, `segmented-tabs`, `step-indicator`, `nav-row`) + 3 `registry:block` (`hero-banner`, `side-drawer`, `miniapp-home`). HeroBanner promoted from `ui` → `block` because it composes pattern overlay + inner card + headless carousel + multi-slide content.
- **D-02:** ROADMAP exit-gate text shifts from "ServiceTile grid" → "tile-stub grid" because ServiceTile is Phase 6. Planner must request a one-line ROADMAP update before/with the phase plan.
- **D-03:** Each compound item ships as **one file per parent in `registry/<name>/<name>.tsx`** with dot-namespace exports (e.g., `app-header.tsx` exports `AppHeader, AppHeader.Title, AppHeader.Leading, AppHeader.Trailing`). Phase 3 D-03/04/05 pattern, no exceptions.
- **D-04:** HeroBanner's stippled-dot pattern, carousel-dot indicator, and inner-card variant ship inline in the block source — **no separate `carousel-dots` or `pattern-stipple` registry item**.
- **D-05:** NavRow trailing slot is **hybrid**: chevron + count-badge ship as built-in `trailing` variants (most common in legacy specimens); switch/toggle use the Phase 3 `switch` primitive via slot (`trailing={<Switch.../>}`). NavRow declares `registryDependencies` on `badge` for the count-badge variant.

**Composition API**

- **D-06:** Compound items use **hybrid composition**: top-level prop for the common case + dot-namespace child slots for full control. Example: `<AppHeader title="Apply for visa" leading={<Menu/>} trailing={<Bell/>}/>` is the 80% path; `<AppHeader leading={...}><AppHeader.Title><CustomLogo/></AppHeader.Title></AppHeader>` is the escape hatch when consumers need custom title rendering.
- **D-07:** AppHeader's right-slot auto-sizes from child count using CSS grid intrinsic sizing — 1 trailing icon → 56px column, 2+ → 96px column. Implemented via `grid-template-columns: 56px 1fr auto` (R5.1). No `trailingWidth` prop.
- **D-08:** StepIndicator and SegmentedTabs ship **both** APIs: compound parts (`<StepIndicator.Step>`, `<SegmentedTabs.Trigger>`) as the canonical surface AND a `steps={[]}` / `items={[]}` data-array prop that internally maps to compound. Document the array path as a thin wrapper to prevent API drift; tests cover both paths in parallel.
- **D-09:** SideDrawer block declares `registryDependencies: [".../r/app-header.json", ".../r/dgc-theme.json"]` (and `dependencies: ["@radix-ui/react-dialog", "lucide-react"]`). Internally renders `<SideDrawer.Header><AppHeader>...</AppHeader></SideDrawer.Header>` so installing SideDrawer auto-installs AppHeader (Phase 3 D-14 cascade pattern).

**HeroBanner carousel**

- **D-10:** Carousel is **headless-controlled**: `<HeroBanner activeIndex={i} onIndexChange={setI}>` props only. **No internal state, no auto-advance, no swipe handlers, no keyboard handlers** in this phase. Consumer drives index. A reusable `useCarousel` hook (auto-advance, swipe, ARIA roving tabindex) is deferred to Phase 6 if real consumer demand surfaces.
- **D-11:** Slide content accepts both compound (`<HeroBanner.Slide>...</HeroBanner.Slide>`) and a `slides={[{title, body, cta}]}` data-array prop (sugar for the title-body-cta common case). Array path renders compound internally.
- **D-12:** Stippled-dot pattern is implemented as **inline CSS** — token path in `dgc-theme/theme.css` (`--pattern-stipple`), consumed via `bg-[image:var(--pattern-stipple)]`. No SVG asset shipped. Visual-diff Playwright run vs legacy `hero-banner.html` confirms parity.
- **D-13:** Inner-card variant is opt-in via `<HeroBanner.Card>` slot inside a `<HeroBanner.Slide>`. When present, the card-on-pattern variant renders; when absent, slide content sits directly on the pattern. No `card` boolean.

**Icon & nav-routing**

- **D-14:** Icons are **ReactNode slot props** — every item that takes an icon accepts `icon?: ReactNode` (and `leading`/`trailing` already do). Defaults import a Lucide icon in registry source; consumers override by passing any element.
- **D-15:** Active state is **pure presentational** — NavRow accepts `active?: boolean`, SegmentedTabs accepts `value` + `onValueChange` (Radix Tabs underneath), StepIndicator accepts per-step `state: 'done' | 'active' | 'pending'`. **No `usePathname()` coupling** anywhere in registry source.
- **D-16:** Each registry JSON declares `dependencies: ["lucide-react"]` per Phase 3 D-15. SegmentedTabs adds `@radix-ui/react-tabs`; SideDrawer adds `@radix-ui/react-dialog`. NavRow + AppHeader chevron-badge variant additionally declares `registryDependencies` on `badge`.
- **D-17:** `miniapp-home` block ships an inline `<HomeTile>` placeholder component inside the block source (not a separate registry item).

### Claude's Discretion

- Exact CSS grid template values for AppHeader (within R5.1 spec — 56/1fr/56-or-96). [LOCKED in UI-SPEC §Tokens & §Spacing-exceptions: `grid-template-columns: 56px 1fr auto`.]
- StepIndicator connector-bar render strategy (pseudo-element vs separate span vs flex-grow divider). [LOCKED in UI-SPEC §Tokens "StepIndicator connector render strategy": absolutely-positioned `span` with `aria-hidden="true"`.]
- Stipple-pattern radial-gradient parameters. [LOCKED in UI-SPEC `--pattern-stipple` token row.]
- SegmentedTabs underline/pill animation: per-trigger background. [LOCKED in UI-SPEC §Motion.]
- Tooltip wiring on AppHeader icon buttons. **Open** — recommendation in §Architecture below.
- `useId()` vs explicit `id` props for label associations — go with shadcn convention.
- Playground rendering for layout-heavy items. **Open** — recommendation in §Architecture below.

### Deferred Ideas (OUT OF SCOPE)

- `useCarousel` hook (auto-advance, swipe, keyboard, ARIA roving tabindex) — Phase 6 if real consumer demand emerges. Phase 4 ships headless-controlled only.
- Real ServiceTile + 6 gradient variants (R7.5) — Phase 6.
- ServiceGrid layout block — Phase 6 (composes ServiceTile).
- TimestampTag, DocumentListRow, InfoRow, Table (R7) — Phase 6.
- FileUploader, MinistryPicker, FormScreen, MobileFrame (R8) — Phase 6.
- Dialog, Sheet/BottomSheet, Toast, Empty, Skeleton, Spinner, Alert (R6) — Phase 5. NOTE: SideDrawer uses `@radix-ui/react-dialog` directly; a *generic* `dialog` registry item is Phase 5 and SideDrawer does NOT depend on it (it embeds Radix directly).
- Production DGC icon set swap — v1.1.
- `<NavRow.Link href>` Next.js adapter — Phase 7 docs polish.
- Bearer-auth private registry, `/v1/` versioning — v2.
- npm package publishing — out of scope (REQUIREMENTS §Out of scope).
- RTL support — out of scope (Khmer is LTR; PROJECT).
- Roadmap regex compatibility fix — tooling todo, not phase scope.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| R5.1 | AppHeader — 56px navy gradient, 3-slot grid (56 / 1fr / 56-or-96), 44px touch icon-buttons with 22px white glyphs, dot/count badges with navy border | §Architecture Pattern 1 (CSS Grid intrinsic sizing) + §Code Examples (AppHeader skeleton) + §Pitfalls (badge contrast on navy). UI-SPEC §Tokens supplies `--app-header-h/-icon/-glyph` and `--ring-on-navy`. |
| R5.2 | HeroBanner — `--radius-lg`, stipple overlay, optional inner card, 3-dot carousel (active = white 18px pill) | §Architecture Pattern 2 (token-driven `bg-[image:var(--pattern-stipple)]`) + §Code Examples (HeroBanner skeleton with controlled index). UI-SPEC `--pattern-stipple` token row supplies the gradient. |
| R5.3 | SectionHeader — title + optional accent action-link | §Code Examples (SectionHeader). Trivial; no Radix. |
| R5.4 | SegmentedTabs — pill group, `--bg-surface-2` track, accent-fill active | §Architecture Pattern 4 (Radix Tabs reuse decision). UI-SPEC §Variants & States Matrix supplies the pill state styles. |
| R5.5 | StepIndicator — 28px numbered circles, 2px connector bars, 3 states | §Architecture Pattern 3 (compound + array dual API). UI-SPEC §Tokens "connector render strategy" supplies the pseudo-element approach. |
| R5.6 | NavRow — 48px row, 24px leading chip, trailing variants, active-state stripe | §Code Examples (NavRow). UI-SPEC §Variants & States Matrix supplies the `before:` pseudo-stripe pattern with `--nav-active-bg` + `--nav-active-stripe`. |
| R5.7 | SideDrawer — Radix Dialog slide-left, `min(82vw, 340px)`, AppHeader header reuse, scrollable list, legal footer | §Architecture Pattern 5 (Radix Dialog slide motion via `data-[state]:animate-*` + `@keyframes` in theme.css). UI-SPEC §Tokens supplies `--drawer-overlay`, `--drawer-width`. |
| R10.1 | axe-core CI a11y gate | §Validation Architecture (per-item axe specs, mirror `tests/a11y/tabs.a11y.spec.ts` shape). |
| R10.2 | Smoke consumer install of each item | §Validation Architecture (extend `SMOKE_WITH_PRIMITIVES` count from 14 → 22; rename env var or add a sibling). |
| R10.3 | Keyboard navigation for every interactive surface | §Architecture Pattern 5 (Radix defaults: focus trap, ESC, ArrowLeft/Right on Tabs). |
| R10.4 | Prettier + ESLint clean | Existing CI enforces — no new research needed. |
| R10.5 | README + CONTRIBUTING (already shipped) | No-op for this phase; visual-diff ΔRGB ≤ 2 is the *implicit* gate inherited from Phase 2 precedent. |

</phase_requirements>

## Project Constraints (from CLAUDE.md)

`./CLAUDE.md` does **not exist** in the project root (verified via init JSON `agents_installed: true` + repo glob). The user's global `~/.claude/CLAUDE.md` defines `/graphify` (irrelevant to this phase) and a current-date marker (2026-04-25). No project-specific CLAUDE.md directives override this research. **`.claude/skills/` and `.agents/skills/` are absent** (verified via `Glob` no-match). Phase guidance therefore derives entirely from `.planning/` and `04-CONTEXT.md` / `04-UI-SPEC.md`.

## Standard Stack

### Core (already installed in `package.json` — verified)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@radix-ui/react-dialog` | **NOT YET INSTALLED — add `^1.1.x`** | SideDrawer foundation: focus trap, ESC, portal, `data-state` attributes for slide-in motion. | [VERIFIED: package.json] Phase 3 did not need it; SideDrawer is the first consumer. The shadcn-canonical Sheet/Drawer/Dialog all build on this primitive. |
| `@radix-ui/react-tabs` | 1.1.13 | SegmentedTabs underlying ARIA tablist (existing Phase 3 dep). | [VERIFIED: package.json] Already used by `registry/tabs/tabs.tsx`. SegmentedTabs renders Radix Tabs directly (see §Architecture Pattern 4). |
| `@radix-ui/react-scroll-area` | 1.2.10 | SideDrawer scrollable nav list. | [VERIFIED: package.json] Phase 3 R4.14 (already shipped as `registry/scroll-area`). SideDrawer reuses the registry item via `registryDependencies`. |
| `@radix-ui/react-tooltip` | ^1.2.8 | Optional AppHeader icon-button hint. | [VERIFIED: package.json] Phase 3 R4.11 (already shipped as `registry/tooltip`). See §Architecture for opt-in recommendation. |
| `@radix-ui/react-slot` | ^1.2.4 | `asChild` pattern (Phase 3 D-03 carry-forward) — used wherever the consumer needs to swap the inner element. | [VERIFIED: package.json] |
| `class-variance-authority` | 0.7.1 | CVA variant compiler (Phase 3 D-02 carry-forward). | [VERIFIED: package.json] |
| `clsx` + `tailwind-merge` | ^2.1.1 / ^2.6.1 | The `cn()` helper at `@/lib/utils` (Phase 3). | [VERIFIED: package.json] |
| `lucide-react` | ^1.9.0 | Icon set placeholder per STATE (D-14 keeps swap path clean). | [VERIFIED: package.json] **CONFIRMED** lucide-react is the only icon dependency. |
| `tailwindcss` | ^4 | Tailwind v4 — `@theme inline`, `@custom-variant dark`, `data-[state=*]:` attribute selectors. | [VERIFIED: package.json] |
| `next` | 15.5.15 | App Router. `output: 'export'` requires `generateStaticParams` for `[item]` route. | [VERIFIED: package.json] |
| `react` / `react-dom` | 19.1.0 | React 19. Children APIs used for compound dot-namespace pattern. | [VERIFIED: package.json] |

### Supporting / dev (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@playwright/test` | ^1.59.1 | E2E + a11y harness (existing per-item specs in `tests/e2e/*` and `tests/a11y/*`). | Phase 4 adds 8 e2e + 8 a11y specs (one per item). |
| `@axe-core/playwright` | ^4.11.2 | Wrapped by `tests/a11y/axe.setup.ts` `runAxe(page)` helper. | Required by R10.1 — every item needs an a11y spec mirroring `tests/a11y/tabs.a11y.spec.ts`. |
| `playwright` | ^1.59.1 | Underlying browser. | `chromium` only (per `package.json` `test:e2e` script). |
| `vitest` | ^4.1.5 | Unit tests for compound→array adapter (`steps={[...]}` round-trips to `<X.Step>`). | Phase 3 has no Phase-4-relevant unit tests; this phase adds maybe two adapter tests. |
| `wait-on` | ^9.0.5 | Smoke-consumer waits for the registry to be reachable before invoking shadcn CLI. | Already wired into `pnpm smoke:consumer`. |
| `shadcn` | ^4.4.0 | `shadcn build` compiles `registry.json` + per-item folders into `public/r/<name>.json`. | Each plan adds a `registry/<name>/` folder + per-item JSON; root `registry.json` gets 8 new `items[]` entries. |
| `@mdx-js/loader` + `@next/mdx` | ^3.1.1 / ^16.2.4 | Docs MDX pipeline. | Each item ships an MDX docs page mirroring Phase 3 docs (R9.1 — out of phase scope but planner should confirm). |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Headless carousel with consumer-controlled index | `embla-carousel-react` (the shadcn-canonical Carousel item uses this) | [CITED: ui.shadcn.com/docs/components/carousel] Embla adds ~9 KB gz + a `useEmblaCarousel` hook surface. **Rejected** — D-10 explicitly defers swipe/auto-advance to Phase 6. Phase 4 only needs visual dots + presentational slide stack; embla would be over-engineered. |
| Reuse Phase 3 `tabs` registry item for SegmentedTabs | Add `registryDependencies: [".../r/tabs.json"]` to `segmented-tabs.json` | [VERIFIED: registry/tabs/tabs.tsx] **Rejected** — Phase 3 `tabs.tsx` exports CVA variants `underline` + `pill` already. Cascading SegmentedTabs through `tabs` would either (a) force SegmentedTabs to *re-style* a third variant on the same exported `Tabs/TabsList/TabsTrigger` (variant collision), or (b) reduce to importing `Tabs` and ignoring its CVA, which means the consumer sees both items in `components/ui/`. SegmentedTabs depends on `@radix-ui/react-tabs` directly, ships its own tiny CVA, and lives at `components/ui/segmented-tabs.tsx`. UI-SPEC §Item-by-item table reflects this (`registryDependencies: dgc-theme, tabs`) — but the **`tabs`** entry there means "Phase 3 already provides Radix-Tabs JS dep", not "import Phase 3 Tabs"; the planner should re-read this as `dependencies: ["@radix-ui/react-tabs"]` and drop `tabs` from `registryDependencies`. *Flag for discuss confirmation.* [ASSUMED — pending planner sign-off.] |
| Custom drawer animation hook | Tailwind v4 `data-[state=open]:animate-in` utilities | [CITED: tailwindcss-animate / shadcn Sheet pattern] **Rejected for v1** — `tailwindcss-animate` plugin is *not* in `package.json`. Hand-roll keyframes in `theme.css` (already the pattern for `--shadow-focus` and the reduced-motion override). See §Architecture Pattern 5. |

**Installation:**
```bash
pnpm add @radix-ui/react-dialog
```
Versioning: **`^1.1.x`** (matches Radix family; @radix-ui/react-tabs 1.1.13 and @radix-ui/react-scroll-area 1.2.10 are already on this train). [ASSUMED — exact 1.1.x patch should be checked at plan time via `pnpm view @radix-ui/react-dialog version`.]

**Version verification (pre-plan):** Before Wave 1 ships, run:
```bash
pnpm view @radix-ui/react-dialog version
pnpm view lucide-react version
```
Document the verified versions in the Wave 0 plan header. Training-data versions can drift.

## Architecture Patterns

### Recommended Project Structure

```
registry/
├── app-header/
│   ├── app-header.tsx           # Compound exports: AppHeader, .Title, .Leading, .Trailing
│   └── registry-item.json       # type: registry:ui, deps: [lucide-react], registryDeps: [dgc-theme, button, badge]
├── section-header/
│   ├── section-header.tsx       # Exports: SectionHeader, .Title, .Action
│   └── registry-item.json
├── segmented-tabs/
│   ├── segmented-tabs.tsx       # Re-styled Radix Tabs (NOT a wrapper around Phase 3 tabs)
│   └── registry-item.json       # deps: [@radix-ui/react-tabs, lucide-react], registryDeps: [dgc-theme]
├── step-indicator/
│   ├── step-indicator.tsx       # Compound + steps={[]} dual API
│   └── registry-item.json
├── nav-row/
│   ├── nav-row.tsx              # Compound + trailing={chevron|count|ReactNode}
│   └── registry-item.json       # registryDeps: [dgc-theme, badge]
├── hero-banner/                 # registry:block
│   ├── hero-banner.tsx          # Headless-controlled carousel + slides + inline pattern + dots
│   └── registry-item.json
├── side-drawer/                 # registry:block
│   ├── side-drawer.tsx          # Radix Dialog wrapper, AppHeader reuse
│   └── registry-item.json       # deps: [@radix-ui/react-dialog, lucide-react], registryDeps: [dgc-theme, app-header, scroll-area]
├── miniapp-home/                # registry:block — the dogfood composition
│   ├── miniapp-home.tsx         # Inline <HomeTile> + AppHeader + HeroBanner + NavRow grid
│   └── registry-item.json       # registryDeps: [dgc-theme, app-header, hero-banner, nav-row]
└── items.manifest.ts            # Append 8 ManifestEntry rows
src/app/preview/
├── [item]/
│   ├── page.tsx                 # Existing — auto-enumerates new manifest entries
│   ├── PlaygroundShell.tsx      # Existing — extend `PreviewSlot` registry; add demo-mode for layout items
│   └── renderers/
│       ├── app-header.tsx       # NEW per-item renderer driven by typed PropControl knobs
│       ├── section-header.tsx
│       ├── segmented-tabs.tsx
│       ├── step-indicator.tsx
│       ├── nav-row.tsx
│       ├── hero-banner.tsx
│       ├── side-drawer.tsx
│       └── miniapp-home.tsx
└── miniapp-home/
    └── page.tsx                 # NEW dogfood route — imports registry block source directly per Phase 3 D-14
```

### Pattern 1 — AppHeader 3-slot grid with intrinsic right-column sizing (D-07, R5.1)

**What:** Use CSS Grid `grid-template-columns: 56px 1fr auto` so the right column auto-sizes to its trailing content. With one icon (44px hit + 8px right inset = ~52px) the column collapses below 56px; with two icons (8 + 44 + 8 + 44 + 8 = 112px) it expands. UI-SPEC §Tokens explicitly notes this is intrinsic sizing — `auto` honors content width and `56px or 96px` is a *minimum hint*, not a clamp.

**When to use:** Any compound header where left is a fixed-icon slot, center is title (truncatable), right is variable.

**Example:**
```tsx
// Source: 04-UI-SPEC.md §Tokens "AppHeader 2-trailing-icon layout (closes Gap #8)"
// Verified pattern from existing Phase 3 button.tsx + UI-SPEC token catalog.
<header
  className={cn(
    "app-header relative",
    "h-[var(--app-header-h)]",
    "grid grid-cols-[var(--app-header-icon)_1fr_auto] items-center",
    "bg-[image:var(--gradient-hero)] text-white",
  )}
>
  <div className="flex items-center justify-center">{leading}</div>
  <h1 className="truncate px-[var(--space-2)] text-base font-semibold">{title}</h1>
  <div className="flex items-center justify-end gap-[var(--space-2)] pr-[var(--space-2)]">
    {trailing}
  </div>
</header>
```

**Edge cases:**
- 3+ trailing icons: `auto` keeps growing; UI-SPEC does not cap. **Recommendation:** add a Storybook/playground entry that proves 3 icons render without title truncation collapse, but no runtime guard.
- Icon + chip combination: `flex justify-end gap-2` handles arbitrary ReactNode children.
- Empty trailing: `auto` collapses to 0; the title gets the extra space. Acceptable.

### Pattern 2 — Stipple-pattern radial-gradient via token (D-12, R5.2)

**What:** UI-SPEC §Tokens locks the implementation: `--pattern-stipple: radial-gradient(circle at center, hsl(0 0% 100% / 0.18) 1px, transparent 1.5px)` with `background-size: 12px 12px`. Tailwind v4 supports `bg-[image:var(--pattern-stipple)]` arbitrary value; `background-size` ships as a separate utility `bg-[length:12px_12px]`.

**When to use:** HeroBanner background overlay only. The token automatically pairs dark mode (UI-SPEC supplies the dark value with 0.10 alpha).

**Example:**
```tsx
// Source: 04-UI-SPEC.md §Color "Stipple-pattern overlay opacity"
<div
  className={cn(
    "relative rounded-[var(--radius-lg)] overflow-hidden",
    "bg-[image:var(--gradient-hero)]",
  )}
>
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[image:var(--pattern-stipple)] bg-[length:12px_12px]"
  />
  {/* slide content sits at z-index above this div */}
</div>
```

**Browser support note:** `bg-[image:var(--token)]` compiles to `background-image: var(--token)` in Tailwind v4. CSS custom properties holding `radial-gradient()` are supported in all Phase-1-supported browsers (Chrome/Edge/Safari ≥ Safari 15) — no fallback needed. [CITED: tailwindcss.com v4 arbitrary values; caniuse.com background-image: var().] [VERIFIED via existing `bg-[image:var(--gradient-hero)]` precedent in UI-SPEC §Spacing Scale + theme.css `--gradient-hero` consumption pattern.]

**Visual-diff threshold:** Phase 2 precedent in `scripts/visual-diff.mjs` uses ΔRGB ≤ 3 (env-overrideable) — UI-SPEC says ≤ 2 for Phase 4. The planner should pass `VISUAL_DIFF_THRESHOLD=2` to the per-item visual-diff invocation, OR keep the default 3 and document the deviation. [ASSUMED — Phase 2 used 3, UI-SPEC says 2 for "max ΔRGB threshold per Phase 2 precedent." Reconcile in Wave 6.]

### Pattern 3 — Compound `<X.Subpart>` + array-data dual API (D-08, D-11)

**What:** StepIndicator and SegmentedTabs (and HeroBanner.Slide) accept *both* a `steps={[...]}` data array *and* nested `<X.Step>` children. The data path is a thin wrapper that maps to compound:

```tsx
// Source: 04-CONTEXT.md D-08 "Document the array path as a thin wrapper to prevent API drift"
type StepData = { label: string; state: 'done' | 'active' | 'pending' };

interface StepIndicatorProps {
  steps?: ReadonlyArray<StepData>;        // array path (sugar)
  children?: React.ReactNode;             // compound path (canonical)
  ariaLabel?: string;
}

function StepIndicatorRoot({ steps, children, ariaLabel }: StepIndicatorProps) {
  // Array path renders compound internally so only one render path exists.
  const content = steps
    ? steps.map((s, i) => <StepIndicatorStep key={i} {...s} index={i + 1} />)
    : children;
  return <ol aria-label={ariaLabel}>{content}</ol>;
}

// Compound child — uses Context to read total steps + active index for connector logic
function StepIndicatorStep(props: StepData & { index: number }) { /* … */ }

export const StepIndicator = Object.assign(StepIndicatorRoot, { Step: StepIndicatorStep });
```

**TypeScript note:** `Object.assign(Root, { Step: Sub })` preserves both call signatures; `as const` arrays narrow to literal types automatically. No `forwardRef` is needed for the namespace export pattern (Phase 3 button.tsx uses `forwardRef` only because Button is a single forwarding component; compound parents like AppHeader don't need it for the root wrapper, only for inner button-like leaves).

**When to use:** Any compound where the 80% case is "list of N homogeneous items." Apply to: StepIndicator, SegmentedTabs, HeroBanner. Do NOT apply to AppHeader (the slots are heterogeneous by name) or NavRow (single row, not a list).

**Test strategy:** Unit test the adapter — render the same fixture once via `steps={[…]}` and once via `<StepIndicator><Step …/>…</StepIndicator>`, snapshot both, assert structural equality. Catches API drift if the compound branch evolves and the array branch is forgotten.

### Pattern 4 — SegmentedTabs styles Radix Tabs directly (resolves D-06 hybrid + UI-SPEC table footnote)

**What:** SegmentedTabs imports `@radix-ui/react-tabs` directly and applies its own DGC-pill CVA. It does **not** depend on the Phase 3 `registry/tabs/` item via `registryDependencies`. UI-SPEC §Item-by-item lists `tabs` as a registryDependency — re-read this as "Phase 3 ships the JS dep `@radix-ui/react-tabs`, the Phase 4 plan declares it in `dependencies: []`, no item-level cascade is needed." Otherwise consumers end up with both `components/ui/tabs.tsx` and `components/ui/segmented-tabs.tsx` with conflicting CVA exports.

**Why this is safe:** Radix Tabs is a low-level tablist primitive; styling it twice (once for Phase 3 underline/pill and once for Phase 4 segmented-pill) is the canonical shadcn pattern — different visual contracts compose at the consumer level, not at the primitive level.

**Implementation reference:** Mirror `registry/tabs/tabs.tsx` shape — `tabsListVariants` + `tabsTriggerVariants` CVA pair, `TabsVariantContext` for List→Trigger propagation. The Phase 4 `segmented-tabs` CVA only ships **one** variant by default (the segmented pill from `segmented-tabs.html`), with `--bg-surface-2` track and active = `bg-brand text-brand-foreground`.

### Pattern 5 — Radix Dialog slide-left motion via `data-state` + `@keyframes` (D-09, R5.7)

**What:** Radix Dialog applies `data-state="open"` / `data-state="closed"` to both the `Overlay` and `Content` elements during the open/close transition. Tailwind v4's `data-[state=open]:` and `data-[state=closed]:` attribute selectors hook into these. Keyframes live in `dgc-theme/theme.css` (the same file already hosts `@layer base { @media (prefers-reduced-motion: reduce) { … } }`).

**Why not `tailwindcss-animate`:** That plugin is not in `package.json` and adding it would be a separate dependency. The four keyframes Phase 4 needs (slide-in-left, slide-out-left, fade-in, fade-out) are 12 lines total in `theme.css` — well below the threshold for adding a plugin.

**Example (consolidated from UI-SPEC §Motion + Radix Dialog docs):**
```css
/* Add to registry/dgc-theme/theme.css under @layer base, after the
   reduced-motion override block. */
@keyframes drawer-slide-in {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}
@keyframes drawer-slide-out {
  from { transform: translateX(0); }
  to   { transform: translateX(-100%); }
}
@keyframes overlay-fade-in {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes overlay-fade-out {
  from { opacity: 1; } to { opacity: 0; }
}
```

```tsx
// Source: side-drawer.tsx — pattern derived from radix-ui.com/primitives/docs/components/dialog
// + 04-UI-SPEC.md §Motion (durations + easing tokens)
import * as DialogPrimitive from "@radix-ui/react-dialog";

<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-[var(--drawer-overlay)]",
        "data-[state=open]:animate-[overlay-fade-in_var(--dur-slow)_var(--ease-standard)]",
        "data-[state=closed]:animate-[overlay-fade-out_var(--dur-base)_var(--ease-standard)]",
      )}
    />
    <DialogPrimitive.Content
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-[var(--drawer-width)]",
        "bg-card text-card-foreground shadow-[var(--shadow-3)]",
        "data-[state=open]:animate-[drawer-slide-in_var(--dur-slow)_var(--ease-standard)]",
        "data-[state=closed]:animate-[drawer-slide-out_var(--dur-base)_var(--ease-standard)]",
        "focus:outline-none",
      )}
    >
      <DialogPrimitive.Title className="sr-only">{ariaTitle}</DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
```

**Reduced-motion:** The existing `@media (prefers-reduced-motion: reduce)` rule in `theme.css` (lines 303–311) zeros all `animation-duration` to 0ms. Drawer snaps open/closed instantly. No per-component override needed (UI-SPEC §Motion confirms this).

**Focus management:** Radix Dialog auto-traps focus inside `Content`, returns focus to the trigger on close, handles `Esc`. No additional code needed for R10.3.

**`a11y`:** Radix already wires `role="dialog" aria-modal="true"`; the visually-hidden `<DialogPrimitive.Title>` satisfies axe's `aria-required-attr` rule. UI-SPEC §ARIA confirms.

### Pattern 6 — Headless-controlled carousel with no library (D-10)

**What:** HeroBanner accepts `activeIndex: number` + `onIndexChange: (i: number) => void`. Internal state is zero. Slides render side-by-side in a `flex` row with `transform: translateX(-100% * activeIndex)` driving the slide; the dot rail reads `activeIndex` to apply the active-pill style. Consumer wires `useState` + optional `useEffect` for auto-advance.

**Docs page recipe (5-line consumer wiring):**
```tsx
// Recipe to ship at /docs/components/hero-banner
const [i, setI] = useState(0);
useEffect(() => {
  const id = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
  return () => clearInterval(id);
}, [slides.length]);
return <HeroBanner activeIndex={i} onIndexChange={setI} slides={slides} />;
```

This proves D-10's claim that `useCarousel` is unnecessary for v1.

**Slide rendering:** Always render all slides in the DOM (transform-driven, not display:none) so the visual transition is smooth. Mark non-active slides `inert` (React 19 supports the boolean attribute) and `aria-hidden="true"` so screen readers and keyboard tab order skip them.

### Pattern 7 — PlaygroundShell extension for layout-heavy items (Discretion item)

**Recommendation:** **Use the existing per-item renderer dispatch** (`previewRenderers[entry.name]` in `PlaygroundShell.tsx` line 225). It already supports arbitrarily complex JSX per item — the `tabs.tsx` renderer composes a 3-tab Khmer fixture; nothing prevents an `app-header.tsx` renderer from composing a 56px nav bar with two icon buttons + a count badge.

**No new "demo mode" field on `ManifestEntry` is needed.** ManifestEntry stays type-only (3-CONTEXT D-12 holds — no JSX in the manifest). Per-item renderers are the demo. Each Phase 4 plan adds:
1. One typed `PropControl` array entry in `items.manifest.ts` (the *settable* knobs — title text, leading-icon present yes/no, trailing count number, etc.).
2. One renderer at `src/app/preview/[item]/renderers/<name>.tsx` that reads `state` and renders the item using *fixed* default content for the parts that aren't knobs (Khmer body copy, icon glyphs, etc.).
3. One entry in `src/app/preview/[item]/renderers/index.ts` mapping `<name>` to the renderer.

**Why this is the right call:** It preserves Phase 3 D-12 (no runtime JSX eval), it scales per-item (any item can hand-author its renderer), and it keeps the playground type-safe. The alternative — adding a `demo: () => JSX` field to `ManifestEntry` — would force the manifest to become a `.tsx` file (it's currently `.ts`), break the `as const` narrowing pattern Phase 3 uses, and gain nothing the renderer registry doesn't already provide.

**Per-item PropControl recommendations:**

| Item | Knobs | Notes |
|------|-------|-------|
| `app-header` | `title: text` (default Khmer), `leadingIcon: variant<menu/back/none>`, `trailingCount: number` (0–9), `withBadge: boolean` (dot vs count) | Two-icon trailing rendered when `withBadge` is true (notification + menu cluster). |
| `section-header` | `title: text`, `withAction: boolean`, `actionLabel: text` | Trivial. |
| `segmented-tabs` | `tabCount: variant<2/3/4>`, `defaultIndex: variant<0/1/2/3>` | Khmer labels picked from a fixture array. |
| `step-indicator` | `stepCount: variant<3/4/5>`, `activeIndex: number` | Renders both array-prop and compound variants in two side-by-side blocks for visual parity check (Pattern 3). |
| `nav-row` | `trailing: variant<chevron/count/switch/none>`, `active: boolean`, `withCaption: boolean`, `withLeadingIcon: boolean` | Maps directly to D-05 hybrid trailing slot. |
| `hero-banner` | `slideCount: variant<1/2/3>`, `activeIndex: number`, `withCard: boolean` | Stipple always on; `withCard` toggles `<HeroBanner.Card>` slot. |
| `side-drawer` | `withProfile: boolean`, `navItemCount: variant<3/5/7>`, `withFooter: boolean`, `defaultOpen: boolean` | Defaults `defaultOpen=true` so playground shows the panel without needing a click; production consumers control via `open`/`onOpenChange`. |
| `miniapp-home` | (none — block ships fixed dogfood layout) | Renderer composes the entire home view as a single fixture. The `controls` array is `[] as const`. PlaygroundShell already handles empty-controls case (line 111: `entry.controls.length > 0 && …`). |

### Anti-Patterns to Avoid

- **`dark:*` Tailwind utilities.** Phase 3 D-06 carry-forward. Dark mode flips at the token layer; never branch in components. UI-SPEC §Style hard rules confirms.
- **Raw hex.** Always token (`bg-[hsl(var(--blue-050))]`) or semantic (`bg-card`). Phase 3 D-02.
- **`useState` for `activeIndex` inside HeroBanner.** D-10 forbids. Headless controlled only.
- **Inline JSX in `items.manifest.ts`.** 3-CONTEXT D-12 forbids. Use renderer registry.
- **`registryDependencies` on the Phase 3 `tabs` item from `segmented-tabs`.** See Pattern 4 — Radix is the dep, not the Phase 3 item.
- **`<a>` or `<button>` wrappers inside NavRow root.** D-15 — NavRow is presentational. Consumers wrap.
- **`usePathname()` in any registry source file.** D-15. Reserved for the `/docs/` page recipe.
- **`opacity-50` for disabled state.** Use `--bg-disabled` + `--fg-on-disabled` (Phase 3 button.tsx pattern).
- **`bg-[length:12px_12px]` confused with `background-size`.** Tailwind v4 supports both `bg-size-*` and arbitrary `bg-[length:…]`; use the arbitrary form for token-driven values.
- **Missing `@radix-ui/react-dialog` in `dependencies`.** SideDrawer must declare it; cascade alone won't pull a JS dep.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drawer focus trap + ESC-to-close + portal | Custom `useEffect`-based focus management | `@radix-ui/react-dialog` | Edge cases: nested portals, focus return on async open, `inert` background, scroll-lock — Radix handles all of them. |
| Tablist keyboard cycling (ArrowLeft/Right, Home/End) | Custom keydown handler | `@radix-ui/react-tabs` | Already a Phase 3 dep; Radix handles `roving tabindex` per WAI-ARIA. |
| Swipe / drag carousel gestures | Custom pointer-event handler | (Deferred to Phase 6) | D-10 explicitly defers; v1 ships dots-only. |
| Icon set | Author 30 SVG icons | `lucide-react` (existing dep) | STATE-locked placeholder. D-14 keeps swap path clean for production DGC icons. |
| Class-merge utility | Custom string concat | `cn()` from `@/lib/utils` (uses `clsx` + `tailwind-merge`) | Phase 3 pattern. |
| Variant compiler | Manual `if (variant === 'a')` chains | `cva()` from `class-variance-authority` | Phase 3 D-02. |
| `data-state` motion driver | JS-driven `setTimeout` for animation lifecycle | Tailwind v4 `data-[state=*]:animate-*` + `@keyframes` in theme.css | Radix Dialog drives `data-state` automatically; CSS handles the rest. |
| Visual-diff harness | Custom Playwright screenshot diff | Existing `scripts/visual-diff.mjs` (extend with new tokens/swatches) OR per-item element-level comparison | Phase 2 precedent. |
| Smoke-consumer harness | Re-write consumer install logic | Existing `scripts/smoke-consumer.mjs` with `SMOKE_WITH_PRIMITIVES=1` (bump count from 14 → 22) | Phase 3 D-19 + commit `5b4ebdc` regex scope. |
| Reduced-motion handling | Per-component media queries | Global `@layer base { @media (prefers-reduced-motion: reduce) { … } }` in theme.css | Already in place (theme.css lines 303–311). |

**Key insight:** Phase 4 has zero new utility-layer code. Every "Don't Hand-Roll" item is satisfied by an existing Phase 2 / Phase 3 / Radix dependency. The phase's complexity is entirely in *composition* (compound APIs, CSS Grid layout, motion choreography), not in primitive plumbing.

## Common Pitfalls

### Pitfall 1: Count badge invisible on navy gradient

**What goes wrong:** Using `bg-brand` (or `bg-[hsl(var(--brand))]`) for the AppHeader notification count badge. On the navy gradient (`--gradient-hero`) this paints navy-on-navy and the badge vanishes.

**Why it happens:** Mechanical "use the brand color for emphasis" reasoning. The navy gradient *is* the brand surface, so the badge needs to invert.

**How to avoid:** UI-SPEC §Color rule 7 locks this — count badge fill is `--red-700` (light) for high contrast, with a 2px `--blue-900` (navy) border for visual lift. Dot-only variant uses `--red-600` 8px circle with the same 2px navy border.

**Warning signs:** Visual-diff fails with `missing-on-target` for the badge swatch, or axe-core flags `color-contrast` violation on the AppHeader.

### Pitfall 2: SideDrawer slide animation jumps on first open

**What goes wrong:** First open of the drawer skips the slide-in keyframe — the panel appears in place at `translateX(0)` without animating from `-100%`.

**Why it happens:** Radix renders `Content` with `data-state="open"` immediately on mount. If the `@keyframes drawer-slide-in` isn't *applied* before the state change, the browser doesn't animate.

**How to avoid:** Make sure the `data-[state=open]:animate-[…]` Tailwind class is on the `Content` element from initial render (not toggled in JS). Tailwind v4 compiles the class statically — present at mount time. The `data-state` attribute change is what triggers the animation. Radix portal-mounting + initial state are the right combination; just don't conditionally apply the class.

**Warning signs:** Manual QA shows the first open as instant, second open as animated.

### Pitfall 3: Khmer line-height clipping in 56px AppHeader

**What goes wrong:** AppHeader title set in Khmer (`lang="km"`) at `text-base` (16px) inherits `line-height: 1.6` (var `--leading-loose`). 16 × 1.6 = 25.6px, which fits the 56px bar — but if the consumer adds vertical padding, the title clips above/below.

**Why it happens:** The `:lang(km)` cascade rule in `theme.css` (line 290–295) globally bumps line-height. AppHeader's flex/grid alignment defaults to `items-center`, so vertical padding cuts into the title.

**How to avoid:** Use `min-h-[var(--app-header-h)]` instead of `h-[var(--app-header-h)]` on the bar root, and avoid vertical padding on the title slot. UI-SPEC §Typography "Khmer line-height contract" lists this exact item: "AppHeader title … must all reserve enough vertical room (use `min-h` via the spacing tokens above, not fixed `h-`)."

**Warning signs:** `/test/khmer` page shows clipped descenders on the title; visual-diff doesn't catch this because both reference and target clip identically.

### Pitfall 4: SegmentedTabs CVA name collision with Phase 3 `tabs`

**What goes wrong:** Both `registry/tabs/tabs.tsx` and `registry/segmented-tabs/segmented-tabs.tsx` export `tabsListVariants`. Consumer installs both → duplicate-export error at consumer build time.

**Why it happens:** Pattern 4 (above) addresses this — but if the planner mistakenly cascades Phase 3 `tabs` via `registryDependencies`, the consumer ends up with both files in `components/ui/`.

**How to avoid:** SegmentedTabs ships its own CVAs named `segmentedTabsListVariants` / `segmentedTabsTriggerVariants` and imports `@radix-ui/react-tabs` directly. No registry dep on Phase 3 `tabs`. See Alternatives Considered.

**Warning signs:** Smoke-consumer fails at `pnpm build` with TS error `Cannot redeclare exported variable 'tabsListVariants'`.

### Pitfall 5: HeroBanner stipple bleeds into inner card on dark mode

**What goes wrong:** Inner card (`<HeroBanner.Card>`) renders semi-transparent in dark mode, letting the stipple gradient bleed through.

**Why it happens:** The card uses `bg-card` which is opaque in light mode but consumers may inadvertently override with `bg-card/80`.

**How to avoid:** UI-SPEC §Color "HeroBanner.Slide content" locks `bg-white text-foreground` (light) / `bg-card text-card-foreground` (dark). Don't ship a `cardOpacity` prop. Document that the card is opaque-by-design.

**Warning signs:** Dark-mode visual-diff at the inner-card region exceeds ΔRGB ≤ 2.

### Pitfall 6: NavRow stripe overshoots row when wrapped in `<a>`/`<button>`

**What goes wrong:** Consumer wraps `<NavRow active>` in an `<a>` for routing. The `before:absolute before:inset-y-0 before:left-0` stripe is positioned relative to the *anchor*, not the row, so it stretches to the anchor's box (which may add focus ring + outline).

**Why it happens:** Position-relative ancestor inheritance. The `<a>` is the closest positioned ancestor when the consumer adds `position: relative` (Tailwind `relative`).

**How to avoid:** NavRow root sets `relative` itself. The `<a>` wrap doesn't add positioning. Document in MDX that the consumer's wrapping `<a>` should NOT add `position: relative`.

**Warning signs:** Visual diff shows the stripe extending below or above the 48px row. Browser devtools show `before:` element bound to the anchor's box.

### Pitfall 7: Smoke-consumer fails with primitive-count assertion

**What goes wrong:** Phase 3 line 229 of `scripts/smoke-consumer.mjs` hard-codes `expected 14 primitives in manifest, found ${names.length}`. Phase 4 adds 8 → manifest has 22 → smoke-consumer fails.

**Why it happens:** The guard exists to catch a half-populated manifest mid-Phase-3.

**How to avoid:** Wave 6 plan must update the assertion. Two options:
1. Bump the literal `14` to `22`.
2. Replace the literal with a config-driven expectation (e.g., `process.env.SMOKE_EXPECTED_COUNT ?? 22`) so future phases don't need a code edit.

UI-SPEC §Item-by-item lists all 8; the regex from commit `5b4ebdc` already scopes to top-level entries (`\{\s*name:`), so no regex change is needed — only the count.

**Warning signs:** CI smoke-consumer fails with `expected 14 primitives in manifest, found 22`.

### Pitfall 8: Visual-diff baseline list doesn't include navigation items

**What goes wrong:** `scripts/visual-diff.mjs` (lines 19–23) hard-codes three reference HTMLs (`colors-primary.html`, `colors-neutrals.html`, `colors-semantic.html`). Phase 4 wants per-item visual parity vs `app-header.html`, `hero-banner.html`, etc. — but the existing harness is a *swatch* diff, not a *component* diff.

**Why it happens:** The harness was scoped to Phase 2 token verification, not Phase 4 component parity.

**How to avoid:** Wave 6 adds a sibling script `scripts/visual-diff-components.mjs` that:
1. Loads each legacy specimen at `D:/sources/dgc-miniapp-design-system/project/preview/<name>.html` as a static fixture in Playwright.
2. Loads `/preview/<item>` from the dev server.
3. Computes a per-element ΔRGB on the rendered component bounding box.

The existing `visual-diff.mjs` stays as the Phase 2 token verifier. Per-item diff is a new harness — Phase 2 precedent is the *threshold and reporting structure*, not the script itself. See §Validation Architecture.

**Warning signs:** Phase 4 plans assume `pnpm visual:diff` covers components; CI passes despite visual regression.

### Pitfall 9: AppHeader focus ring vanishes on navy

**What goes wrong:** Default focus ring uses `--shadow-focus: 0 0 0 3px hsl(var(--ring) / 0.4)` where `--ring` is the brand navy. On the navy gradient this is invisible.

**Why it happens:** The base `:focus-visible` rule in `@layer base` (theme.css line 297) applies `--shadow-focus` globally to buttons.

**How to avoid:** UI-SPEC §Tokens locks the override — `--ring-on-navy: 0 0 0 3px hsl(0 0% 100% / 0.55)` and the `app-header [data-app-header-icon]:focus-visible` selector in `app-header.tsx` source. Apply `data-app-header-icon` to every icon button inside AppHeader.

**Warning signs:** Keyboard-nav demo fails to show a visible focus indicator on AppHeader buttons; axe-core may pass (rule is `focus-order-semantics`, not `focus-visible-style`) but manual review fails R10.3.

### Pitfall 10: Block items skip `cssVars` cascade

**What goes wrong:** A `registry:block` item (HeroBanner, SideDrawer, miniapp-home) declares `registryDependencies: [".../r/dgc-theme.json"]` but on install, the consumer's `globals.css` doesn't pick up the new tokens.

**Why it happens:** shadcn CLI cascade installs components *first*, then themes. If the block lists components before the theme, the theme is installed last but the consumer's generated CSS is committed with the partial set. This is a timing edge case in shadcn 4.4.0. [ASSUMED — needs verification at plan time. The smoke-consumer test (`SMOKE_WITH_PRIMITIVES=1`) catches this if it does happen.]

**How to avoid:** Always list `dgc-theme` as the **first** entry in `registryDependencies`. UI-SPEC §Item-by-item already does this.

**Warning signs:** Smoke-consumer's globals.css assertion `--brand token present` passes but the rendered preview is unstyled.

## Runtime State Inventory

This is a greenfield phase (new files, no rename / refactor / migration). The Runtime State Inventory section is **omitted** per the GSD playbook (only required for rename/refactor/migration). Items added to existing files are tracked in §Architecture's "Recommended Project Structure" instead.

**Existing files this phase modifies:**

| File | Change | Rationale |
|------|--------|-----------|
| `registry/dgc-theme/theme.css` | Append 9 new tokens (UI-SPEC §Tokens) + 4 `@keyframes` rules (drawer + overlay motion) | Token producer cannot be swapped at runtime; theme.css is the single source. |
| `registry/items.manifest.ts` | Append 8 `ManifestEntry` rows | Phase 3 D-11 pattern. |
| `registry.json` (root) | Append 8 `items[]` entries; bump `meta.version` `0.2.0` → `0.4.0` | shadcn build pipeline. |
| `scripts/smoke-consumer.mjs` | Bump primitive-count assertion 14 → 22 (or env-driven) | Pitfall 7. |
| `src/app/preview/[item]/renderers/index.ts` | Add 8 renderer registrations | PlaygroundShell dispatch. |
| `.planning/ROADMAP.md` | Phase 4 exit-gate text "ServiceTile grid" → "tile-stub grid" | D-02. |
| `tests/a11y/` | Add 8 new specs (one per item) | R10.1. |
| `tests/e2e/` | Add 8 new specs (one per item) | Phase 3 precedent (one e2e per primitive). |
| `package.json` | Add `@radix-ui/react-dialog: ^1.1.x` to `dependencies` | New dep. |

**New files this phase creates:**
- `registry/<each item>/<each item>.tsx` × 8
- `registry/<each item>/registry-item.json` × 8
- `src/app/preview/[item]/renderers/<each item>.tsx` × 8
- `src/app/preview/miniapp-home/page.tsx` (dogfood route)
- `scripts/visual-diff-components.mjs` (per-item visual diff harness; Pitfall 8)
- `tests/a11y/<each item>.a11y.spec.ts` × 8
- `tests/e2e/<each item>.spec.ts` × 8

## Code Examples

### NavRow root with active stripe (R5.6, Pitfall 6)

```tsx
// Source: 04-UI-SPEC.md §Variants & States Matrix "NavRow row" + §Tokens
// "--nav-active-bg / --nav-active-stripe"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const navRowVariants = cva(
  [
    "relative flex items-center gap-[var(--space-3)]",
    "min-h-[48px] px-[var(--space-4)] bg-card text-foreground",
    "transition-colors duration-[var(--dur-fast)]",
    "hover:bg-[hsl(var(--blue-050)/0.5)]",
    "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
  ].join(" "),
  {
    variants: {
      active: {
        true: [
          "bg-[hsl(var(--nav-active-bg))]",
          "before:absolute before:inset-y-0 before:left-0",
          "before:w-[var(--nav-active-stripe)] before:bg-brand before:content-['']",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: { active: false },
  },
);
```

### HeroBanner root with controlled index (R5.2, D-10)

```tsx
// Source: derived from 04-UI-SPEC.md §Item-by-item + 04-CONTEXT.md D-10/D-11/D-12/D-13
"use client";
import { cn } from "@/lib/utils";

export interface HeroBannerProps {
  activeIndex: number;                                   // controlled (D-10)
  onIndexChange: (i: number) => void;
  slides?: ReadonlyArray<{ title: string; body?: string; cta?: React.ReactNode }>;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export function HeroBanner({ activeIndex, onIndexChange, slides, ariaLabel, children }: HeroBannerProps) {
  const items = slides
    ? slides.map((s, i) => <HeroBanner.Slide key={i}>{/* render s.title/body/cta */}</HeroBanner.Slide>)
    : children;
  const total = React.Children.count(items);
  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className="relative rounded-[var(--radius-lg)] overflow-hidden bg-[image:var(--gradient-hero)] text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[image:var(--pattern-stipple)] bg-[length:12px_12px]" />
      <div
        className="relative flex transition-transform duration-[var(--dur-base)]"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items}
      </div>
      <Dots total={total} active={activeIndex} onSelect={onIndexChange} />
    </section>
  );
}

function Dots({ total, active, onSelect }: { total: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div
      aria-hidden="true"
      className="absolute bottom-[var(--space-4)] left-1/2 -translate-x-1/2 flex gap-[var(--space-2)]"
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "h-[8px] rounded-full transition-all duration-[var(--dur-base)]",
            i === active ? "w-[18px] bg-white" : "w-[8px] bg-white/40",
          )}
        />
      ))}
    </div>
  );
}
```

### SideDrawer wrapper using Radix Dialog (R5.7, Pattern 5)

```tsx
// Source: 04-UI-SPEC.md §Motion + §ARIA + Radix Dialog docs
"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/ui/app-header";  // reuse via cascade

export interface SideDrawerProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export function SideDrawer({ open, onOpenChange, title = "Menu", children }: SideDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-[var(--drawer-overlay)]",
            "data-[state=open]:animate-[overlay-fade-in_var(--dur-slow)_var(--ease-standard)]",
            "data-[state=closed]:animate-[overlay-fade-out_var(--dur-base)_var(--ease-standard)]",
          )}
        />
        <DialogPrimitive.Content
          aria-label={title}
          className={cn(
            "fixed inset-y-0 left-0 z-50",
            "w-[var(--drawer-width)] bg-card text-card-foreground shadow-[var(--shadow-3)]",
            "data-[state=open]:animate-[drawer-slide-in_var(--dur-slow)_var(--ease-standard)]",
            "data-[state=closed]:animate-[drawer-slide-out_var(--dur-base)_var(--ease-standard)]",
            "focus:outline-none flex flex-col",
          )}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

SideDrawer.Header = function SideDrawerHeader(props: React.PropsWithChildren) {
  // Reuses AppHeader inside the drawer. The X-close button uses Radix's
  // <DialogPrimitive.Close asChild> so consumer controls the rendered button.
  return <div className="border-b border-border">{props.children}</div>;
};
SideDrawer.Body = function SideDrawerBody(props: React.PropsWithChildren) {
  // ScrollArea sits here, imported from @/components/ui/scroll-area (Phase 3)
  return <div className="flex-1 min-h-0">{props.children}</div>;
};
SideDrawer.Footer = function SideDrawerFooter(props: React.PropsWithChildren) {
  return <div className="border-t border-border p-[var(--space-4)] text-sm text-muted-foreground">{props.children}</div>;
};
```

### registry-item.json shape for SideDrawer (D-09)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "side-drawer",
  "type": "registry:block",
  "title": "SideDrawer",
  "description": "Radix Dialog left-edge drawer with AppHeader reuse, scrollable nav list, and legal footer.",
  "dependencies": ["@radix-ui/react-dialog", "lucide-react"],
  "registryDependencies": [
    "https://registry.016910804.xyz/r/dgc-theme.json",
    "https://registry.016910804.xyz/r/app-header.json",
    "https://registry.016910804.xyz/r/scroll-area.json"
  ],
  "files": [
    { "path": "registry/side-drawer/side-drawer.tsx", "type": "registry:block" }
  ]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 with `@layer` directives + `tailwindcss-animate` plugin | Tailwind v4 `@theme inline` + `data-[state=*]:animate-[name_dur_easing]` direct keyframes in CSS | Tailwind v4 GA (2024) | Phase 4 doesn't need `tailwindcss-animate`. Hand-author 4 keyframes in `theme.css`. |
| `@radix-ui/react-dialog 1.0.x` | `@radix-ui/react-dialog 1.1.x` | Radix 1.1 (2024) | API stable; same `Root/Portal/Overlay/Content/Title/Close` surface. [ASSUMED — confirm exact version at install.] |
| HEX-based design tokens | HSL-channel triplets (Tailwind v4 + shadcn semantic alias requirement) | Phase 2 of this project (R3.2) | Phase 4 follows; no raw HEX. |
| `usePathname()` coupling for active nav state | Pure `active?: boolean` prop with consumer wiring | D-15 | Preserves R10 portability beyond Next.js. |
| Carousel libraries (embla, swiper) | Headless-controlled `activeIndex` + 5-line consumer recipe | D-10 | Saves ~9KB gz; `useCarousel` deferred to Phase 6. |
| `forwardRef` everywhere | `forwardRef` only on terminal interactive leaves | React 19 | Compound parents (AppHeader, SideDrawer roots) don't need it; child slots that wrap `<button>` do. |

**Deprecated/outdated:**
- `next/legacy/router` → `next/navigation` (already on `next/navigation` per Next 15.5).
- HEX in component source → token-only. Phase 2 closed this. Phase 4 inherits.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@radix-ui/react-dialog ^1.1.x` is current and API-compatible with Tabs 1.1.13 / ScrollArea 1.2.10 | Standard Stack | If 2.x is current, `Root/Portal/Overlay/Content` API may shift. Mitigation: `pnpm view @radix-ui/react-dialog version` at Wave 0. |
| A2 | Phase 4 visual-diff threshold is ΔRGB ≤ 2 (UI-SPEC) but `scripts/visual-diff.mjs` defaults to ≤ 3 (Phase 2). Need to reconcile. | §Architecture Pattern 2, §Validation Architecture | If Wave 6 doesn't pass `VISUAL_DIFF_THRESHOLD=2`, regressions slip through. |
| A3 | Block items installed via shadcn CLI cascade `registryDependencies` correctly even when the chain is `block → block → ui → theme` (e.g., miniapp-home → hero-banner → dgc-theme) | §Pitfall 10 | If shadcn 4.4.0 has a depth-2 cascade bug, miniapp-home install would partial-install. Mitigation: smoke-consumer with `SMOKE_WITH_PRIMITIVES=1` covers this. |
| A4 | UI-SPEC §Item-by-item "tabs" listed under registryDependencies for `segmented-tabs` is a typo; correct read is "@radix-ui/react-tabs in dependencies" | §Architecture Pattern 4, §Pitfall 4 | If planner takes UI-SPEC literally, consumer ends up with both `tabs.tsx` and `segmented-tabs.tsx` and CVA name collision. Surface to discuss-phase or planner sign-off. |
| A5 | Renderer registry pattern is sufficient for layout-heavy items; no `demo: () => JSX` field on `ManifestEntry` is needed | §Architecture Pattern 7 | If a future item needs runtime-evaluable demo content (e.g., live-edit JSX), the renderer registry forces a code change. Acceptable for v1. |
| A6 | `inert` HTML attribute on non-active HeroBanner slides is supported in React 19 + the project's browser baseline | §Architecture Pattern 6 | If unsupported, fall back to `aria-hidden="true"` + `pointerEvents: 'none'` inline style. Verify at plan time. |
| A7 | Phase 6 visual-diff harness (`scripts/visual-diff-components.mjs`) is in scope for Wave 6 of this phase, not deferred | §Pitfall 8, §Validation Architecture | If deferred, R10.5 ΔRGB ≤ 2 gate cannot be machine-verified; manual review only. |
| A8 | The Radix `inert` + `aria-hidden` pattern on inactive carousel slides handles screen-reader accessibility cleanly | §Architecture Pattern 6 | If slide content is rendered but readable by SR even when `aria-hidden`, R10.1 axe pass may surface a `aria-hidden-focus` warning. Mitigation: also set `tabIndex={-1}` on focusable descendants. |

## Open Questions (RESOLVED)

All five open questions below carry an explicit **RESOLVED:** answer cited by Phase 4 plans (04-00..04-09). Per Dimension 11 (Open Questions Closure), each question has a one-line resolution mirroring the planner-selected answer.


1. **Tooltip wiring on AppHeader icon buttons** (UI-SPEC §Item-by-item lists tooltip as "optional")
   - What we know: Phase 3 ships `registry/tooltip/`. AppHeader leading/trailing icon buttons could trigger tooltips on hover/focus.
   - What's unclear: Tooltip on a 56px navy bar may visually clash with the gradient. Touch devices don't have hover.
   - Recommendation: **Skip for v1.** Add a docs-page recipe showing how a consumer wraps the icon button with `<TooltipProvider><Tooltip>...`. Tooltips are decorative; AppHeader buttons already have `aria-label`, satisfying R10.1.
   - **RESOLVED:** Skip tooltip wiring for v1. Plan 04-01 (AppHeader) Task 1 explicitly excludes tooltip from registryDependencies (note: "Do NOT add tooltip — deferred to docs recipe per Open Question 1"). Consumed by: 04-01.

2. **Visual-diff threshold mismatch** (Pitfall 8 + A2)
   - What we know: Phase 2's `visual-diff.mjs` defaults to ≤ 3; UI-SPEC says ≤ 2.
   - What's unclear: Is ≤ 2 a tightening for Phase 4 specifically, or a typo of "ΔRGB ≤ 3"?
   - Recommendation: Wave 6 plan invokes the new component-diff harness with `VISUAL_DIFF_THRESHOLD=2` to honor UI-SPEC literally. Token-diff (`visual-diff.mjs`) keeps default ≤ 3 since it's checking the same swatches Phase 2 already certified.
   - **RESOLVED:** Per-item delta-RGB <= 2 honored literally via VISUAL_DIFF_THRESHOLD=2 env in the new component-diff harness; legacy token-diff keeps <= 3. Plan 04-00 Task 3 ships the harness with this default. Consumed by: 04-00, 04-09.

3. **Segmented-tabs vs Phase 3 tabs registryDependency** (A4 + Pattern 4)
   - What we know: UI-SPEC §Item-by-item lists `tabs` in registryDependencies; CVA collision argues against.
   - What's unclear: Is the UI-SPEC reading "consumers may already have `tabs` installed, so reuse" or "we cascade-install `tabs`"?
   - Recommendation: **Drop `tabs` from segmented-tabs registryDependencies.** SegmentedTabs depends on `@radix-ui/react-tabs` in `dependencies` only. Surface to planner; if discuss-phase says "must cascade tabs," fall back to renaming SegmentedTabs CVA exports (`segmentedTabsListVariants`) to dodge collision.
   - **RESOLVED:** Drop `tabs` from segmented-tabs registryDependencies AND rename CVA exports to `segmentedTabsListVariants` / `segmentedTabsTriggerVariants` (BOTH safeguards applied as defense in depth against Pitfall 4). Plan 04-04 Task 1 enforces via grep acceptance criteria. Consumed by: 04-04.

4. **Where to put new `@keyframes`** (Pattern 5)
   - What we know: `theme.css` already hosts `@layer base` + `@media (prefers-reduced-motion)`. Keyframes live at root scope.
   - What's unclear: Should keyframes ship in `dgc-theme/theme.css` (cascade-installed via theme dep) or in a separate `motion.css` registry asset?
   - Recommendation: Add to `dgc-theme/theme.css` directly (Wave 0). Keyframes are tiny (~12 lines), tied to the token system, and already need to ship in lockstep with `--dur-*` and `--ease-standard`. A separate motion file would split the source-of-truth.
   - **RESOLVED:** Ship 4 keyframes (drawer-slide-in/out, overlay-fade-in/out) directly in `registry/dgc-theme/theme.css`, outside any `@layer`. Plan 04-00 Task 2 appends them; Plan 04-07 (SideDrawer) consumes via `data-[state=*]:animate-[<keyframe>_<duration>_<easing>]` utilities. Consumed by: 04-00, 04-07.

5. **PreviewSlot import path for new renderers** (Pattern 7)
   - What we know: Existing renderers at `src/app/preview/[item]/renderers/<name>.tsx` import from `../../../../../registry/<name>/<name>` (5-level relative).
   - What's unclear: Will the same path work when `<name>` includes a hyphen (`app-header`, `side-drawer`, `nav-row`, `step-indicator`, `section-header`, `segmented-tabs`, `hero-banner`, `miniapp-home`)?
   - Recommendation: Yes — Phase 3 `scroll-area` already has a hyphen. Mirror that path verbatim.
   - **RESOLVED:** Use 5-level relative imports (`../../../../../registry/<name>/<name>`) verbatim, mirroring Phase 3 `scroll-area` precedent. Hyphenated names work identically. Consumed by: 04-01..04-08 renderer files.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js (pnpm) | Build pipeline | ✓ | (per `package.json` engines or repo workflow) | — |
| pnpm | Smoke-consumer + dev | ✓ | (CI uses `--use-pnpm`) | — |
| Playwright Chromium | E2E + a11y + visual-diff | ✓ | ^1.59.1 | — |
| `@axe-core/playwright` | a11y CI gate | ✓ | ^4.11.2 | — |
| Legacy specimens at `D:/sources/dgc-miniapp-design-system/project/preview/*.html` | Visual-diff baseline | ✓ | (already used by `visual-diff.mjs` for Phase 2 swatches) | If absent for any item, skip diff for that item with explicit `[SKIP]` log line in the new component-diff harness. |
| `@radix-ui/react-dialog` | SideDrawer | **✗ NOT INSTALLED** | n/a | **No fallback.** Wave 0 must `pnpm add @radix-ui/react-dialog`. Without it, side-drawer.tsx won't compile. |
| `lucide-react` | All 8 items (icon defaults) | ✓ | ^1.9.0 | D-14 ReactNode slot pattern lets consumer override; no fallback needed for default rendering. |
| Local registry server (`localhost:3000/r/*.json`) | Smoke-consumer + dev preview install | ✓ (started by `pnpm dev` or `pnpm start`) | — | `wait-on` already gates the smoke step. |

**Missing dependencies with no fallback:**
- `@radix-ui/react-dialog` — Wave 0 install task is mandatory.

**Missing dependencies with fallback:**
- None — every other dep is already installed.

## Validation Architecture

`workflow.nyquist_validation` is not explicitly disabled in `.planning/config.json` (file presumed absent or default), so this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | `vitest@^4.1.5` (unit), `@playwright/test@^1.59.1` (e2e + a11y), `@axe-core/playwright@^4.11.2` (a11y gate), bespoke Node scripts (visual-diff, smoke-consumer) |
| Config files | `playwright.config.ts` (existing), `vitest.config.ts` (existing), `tests/a11y/axe.setup.ts` (existing helper `runAxe(page)`) |
| Quick run command | `pnpm test:a11y -- --grep "<item>"` (per-item axe spec, < 30s) |
| Full suite command | `pnpm typecheck && pnpm test:unit && pnpm test:e2e && pnpm test:a11y && pnpm visual:diff && pnpm smoke:consumer` (matches CI gates per 04-CONTEXT §code_context) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| R5.1 (AppHeader) | 56px navy bar, 3-slot grid renders with 1 + 2 trailing icons | unit | `pnpm test:unit -- app-header` | ❌ Wave 0 (new spec needed) |
| R5.1 (touch target) | Icon buttons measure ≥ 44 × 44px | e2e | `pnpm test:e2e -- --grep app-header.touch-target` | ❌ Wave 1 |
| R5.1 (Khmer) | Title `lang="km"` doesn't clip in 56px bar | e2e | `pnpm test:e2e -- khmer-clipping` (extend existing) | partial — `tests/e2e/khmer-clipping.spec.ts` exists; extend with the 8 new items |
| R5.1 (a11y) | axe-core zero violations on `/preview/app-header` (light + dark) | a11y | `pnpm test:a11y -- --grep "a11y app-header"` | ❌ Wave 1 (mirror `tests/a11y/tabs.a11y.spec.ts`) |
| R5.1 (visual) | ΔRGB ≤ 2 vs `app-header.html` | visual-diff | `pnpm visual:diff:components -- --item app-header` | ❌ Wave 6 (new harness) |
| R5.2 (HeroBanner) | Stipple pattern paints; carousel dot active = 18px white pill; controlled `activeIndex` prop drives slide transform | unit + e2e | `pnpm test:unit -- hero-banner` + `pnpm test:e2e -- hero-banner.controlled-index` | ❌ Wave 3 |
| R5.2 (visual) | ΔRGB ≤ 2 vs `hero-banner.html` (dark mode included) | visual-diff | `pnpm visual:diff:components -- --item hero-banner` | ❌ Wave 6 |
| R5.3 (SectionHeader) | Title + accent action-link render | unit + e2e | `pnpm test:unit -- section-header` + `pnpm test:e2e -- section-header` | ❌ Wave 1 |
| R5.4 (SegmentedTabs) | Radix Tabs ARIA passes; arrow-key cycling works; active = `bg-brand` | a11y + e2e | `pnpm test:a11y -- segmented-tabs` + `pnpm test:e2e -- segmented-tabs.arrow-keys` | ❌ Wave 2 |
| R5.5 (StepIndicator) | `steps={[]}` and `<X.Step>` produce identical DOM | unit | `pnpm test:unit -- step-indicator.dual-api` | ❌ Wave 2 |
| R5.5 (StepIndicator) | Connector bar paints brand for done segments, surface-2 for pending | e2e | `pnpm test:e2e -- step-indicator.connector-state` | ❌ Wave 2 |
| R5.6 (NavRow) | 48px min-height; active stripe paints at `before:left-0 w-3px`; trailing variants render | unit + e2e | `pnpm test:unit -- nav-row` + `pnpm test:e2e -- nav-row.trailing-variants` | ❌ Wave 1 |
| R5.6 (touch) | Row has tap target ≥ 44px tall (48px min-height satisfies) | e2e | `pnpm test:e2e -- --grep nav-row.touch-target` | ❌ Wave 1 |
| R5.7 (SideDrawer) | Radix Dialog opens on `open=true`; ESC closes; focus traps inside; first focus on close button | a11y + e2e | `pnpm test:a11y -- side-drawer` + `pnpm test:e2e -- side-drawer.focus-management` | ❌ Wave 4 |
| R5.7 (motion) | `data-state="open"` triggers slide-in keyframe; `prefers-reduced-motion` zeros the animation | e2e | `pnpm test:e2e -- side-drawer.reduced-motion` | ❌ Wave 4 |
| R10.1 | axe-core zero violations across all 8 items, light + dark | a11y | `pnpm test:a11y` (full suite) | partial — extend with 8 new specs |
| R10.2 | Smoke-consumer installs all 22 manifest entries cleanly | smoke | `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` | ✅ existing harness; bump count assertion |
| R10.3 | Tab cycle, ESC, ArrowLeft/Right behaviors per item | e2e | per-item e2e specs (cover above) | ❌ Wave 1–4 |
| R10.4 | ESLint + Prettier clean | lint | `pnpm lint && pnpm format --check` | ✅ existing CI |
| R10.5 (visual) | Per-item ΔRGB ≤ 2 vs legacy specimens | visual-diff | `pnpm visual:diff:components` | ❌ Wave 6 (new harness) |

### Sampling Rate

- **Per task commit:** `pnpm typecheck && pnpm test:unit -- <item-slug> && pnpm test:a11y -- --grep <item-slug>` (~30s budget per item)
- **Per wave merge:** `pnpm typecheck && pnpm test:unit && pnpm test:e2e && pnpm test:a11y` (~3-5min)
- **Phase gate (`/gsd-verify-work`):** Full suite green: typecheck + unit + e2e + a11y + visual:diff + visual:diff:components + smoke:consumer with `SMOKE_WITH_PRIMITIVES=1`

### Wave 0 Gaps

- [ ] `tests/a11y/<each-of-8>.a11y.spec.ts` — covers R10.1 per item (Wave 1–4 plans add)
- [ ] `tests/e2e/<each-of-8>.spec.ts` — covers behavioral R5.* per item (Wave 1–4 plans add)
- [ ] `tests/unit/step-indicator.dual-api.test.ts` — covers D-08 array-vs-compound parity (Wave 2 plan adds)
- [ ] `tests/e2e/khmer-clipping.spec.ts` — extend with 8 new selectors (Wave 1 plan)
- [ ] `scripts/visual-diff-components.mjs` — new per-element ΔRGB harness (Wave 6 plan adds)
- [ ] `package.json` `scripts.visual:diff:components` — new entry pointing at the new harness (Wave 6)
- [ ] `package.json` `dependencies.@radix-ui/react-dialog` — `pnpm add @radix-ui/react-dialog` (Wave 0)
- [ ] `registry/dgc-theme/theme.css` — append 9 new tokens + 4 keyframes (Wave 0)
- [ ] `registry.json` — bump `meta.version` to `0.4.0` (Wave 6)
- [ ] `scripts/smoke-consumer.mjs` — bump `expected 14` to `expected 22` (Wave 6)
- [ ] `src/app/preview/[item]/renderers/index.ts` — add 8 renderer registrations (one per Wave 1–5 plan)
- [ ] `src/app/preview/miniapp-home/page.tsx` — new dogfood route (Wave 5)
- [ ] `.planning/ROADMAP.md` — exit-gate text edit (Wave 6, per D-02)

## Security Domain

> `security_enforcement` flag default-on. This section confirms the security surface for Phase 4 navigation chrome.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | This phase ships UI chrome only. No auth state lives in registry source. SideDrawer "Sign out" is presentational; the actual sign-out flow is Phase 5+. |
| V3 Session Management | no | Same — no session state in registry components. |
| V4 Access Control | no | No server endpoints introduced. |
| V5 Input Validation | partial | Only inputs in this phase are: AppHeader title (consumer-supplied string, rendered via React — auto-escaped), HeroBanner slide title/body (same), SideDrawer profile name. **Standard control:** React's default JSX-text escaping. NEVER use `dangerouslySetInnerHTML` in any registry source file. |
| V6 Cryptography | no | No crypto operations. |
| V11 Business Logic | no | Presentational only. |
| V14 Configuration | partial | `dgc-theme/theme.css` and `registry.json` ship URLs to `registry.016910804.xyz`. **Standard control:** the URL is project-controlled (DGC repo). No third-party registry. |

### Known Threat Patterns for {Tailwind v4 + Radix + shadcn registry}

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via consumer-supplied title / body / icon ReactNode | Tampering | React JSX auto-escapes strings. Icon slot accepts `ReactNode`, not `dangerouslySetInnerHTML`. |
| Supply-chain compromise of `lucide-react` or `@radix-ui/*` | Tampering / Elevation | `pnpm-lock.yaml` pins exact versions. CI installs from lockfile only. No `^` in `dependencies` for production-critical Radix packages — but project uses `^` for Radix family today; flag for security review at plan time. [ASSUMED — current convention uses `^`.] |
| Cross-origin registry redirect / cache poisoning | Tampering | First-party host (`registry.016910804.xyz`); GitHub Pages serves with HTTPS + immutable JSON. No third-party registry installed. |
| Click-jacking via SideDrawer overlay | Tampering / Spoofing | Radix Dialog renders to a portal at the body root; `Overlay` is opaque-enough (`hsl(0 0% 0% / 0.5)` light, `0.65` dark). Consumer pages should still ship `X-Frame-Options: DENY` server-side (out of phase scope). |

**No new attack surface introduced beyond what Phase 3 primitives already ship.** SideDrawer adds the first Radix Dialog usage; Phase 5 will add Dialog/Sheet/Toast which are higher-risk overlay surfaces.

## Sources

### Primary (HIGH confidence)

- `.planning/phases/04-headers-navigation/04-CONTEXT.md` — 17 locked decisions D-01..D-17 + canonical refs + deferred items.
- `.planning/phases/04-headers-navigation/04-UI-SPEC.md` — token catalog, motion specs, state matrices, ARIA contracts, item-by-item visual inventory.
- `registry/dgc-theme/theme.css` — verified token catalog (lines 73–223 light, 225–273 dark, 275–313 base layer).
- `registry/items.manifest.ts` — verified `ManifestEntry` + `PropControl` types and 14 Phase 3 entries.
- `registry/button/button.tsx` — verified CVA pattern + asChild + disabled token usage.
- `registry/tabs/tabs.tsx` — verified Radix Tabs CVA pattern + `data-[state=active]:` selectors.
- `scripts/visual-diff.mjs` — verified Phase 2 visual-diff harness (swatch-level, ΔRGB ≤ 3 default).
- `scripts/smoke-consumer.mjs` — verified `SMOKE_WITH_PRIMITIVES` regex, count-14 assertion (line 229), regex `\{\s*name:\s*…` (line 222) from commit `5b4ebdc`.
- `src/app/preview/[item]/PlaygroundShell.tsx` — verified renderer dispatch via `previewRenderers[entry.name]` (line 225).
- `src/app/preview/[item]/page.tsx` — verified `dynamicParams = false` + `generateStaticParams` from manifest.
- `src/app/preview/[item]/renderers/tabs.tsx` — verified per-item renderer pattern.
- `tests/a11y/tabs.a11y.spec.ts` — verified Playwright + `@axe-core/playwright` shape (light + dark).
- `package.json` — verified all dependency versions; `@radix-ui/react-dialog` confirmed absent.
- `components.json` — verified shadcn config (style="new-york", baseColor=neutral, registries `@dgc → http://localhost:3000/r/{name}.json`).
- `registry.json` — verified `meta.version: 0.2.0`, `cssVars` shape for `dgc-theme`.
- `.planning/REQUIREMENTS.md` (lines 45–53) — R5.1–R5.7 + R10 acceptance criteria.

### Secondary (MEDIUM confidence)

- Radix UI Dialog docs (general API knowledge: `Root/Portal/Overlay/Content/Title/Close`, `data-state` attribute, focus trap behavior). [CITED: radix-ui.com/primitives/docs/components/dialog]
- shadcn registry schema (general: `registry-item.json` shape, cascade install via `registryDependencies`). [CITED: ui.shadcn.com/docs/registry]
- Tailwind v4 arbitrary value syntax (`bg-[image:var(...)]`, `data-[state=*]:animate-[name_dur_easing]`). [CITED: tailwindcss.com v4 docs]
- React 19 `inert` boolean attribute support (used in Pattern 6).

### Tertiary (LOW confidence — flag for validation)

- Exact patch version of `@radix-ui/react-dialog` to install (Pattern 5). Resolve via `pnpm view`.
- `tailwindcss-animate` plugin not needed (training data; verify via "is the plugin in package.json" — VERIFIED absent, so this is now MEDIUM).
- shadcn 4.4.0 `block → block → ui → theme` cascade behavior (Pitfall 10). Smoke-consumer covers this; otherwise unverified.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every dep verified against `package.json` except `@radix-ui/react-dialog` which is confirmed absent + needs install.
- Architecture patterns: HIGH — all seven patterns derive from existing Phase 3 source + locked UI-SPEC tokens; no novel research required.
- Pitfalls: MEDIUM-HIGH — eight of ten are derived from inspecting Phase 3 + UI-SPEC; two (Pitfall 7 smoke count, Pitfall 10 cascade) are HIGH because they're directly readable in code.
- Security: HIGH — surface is presentational, no new attack vectors.
- Validation: HIGH — patterns mirror Phase 3 a11y/e2e specs verbatim; one new harness (component visual-diff) is the only build-out.

**Research date:** 2026-04-25
**Valid until:** 2026-05-25 (30 days; stack is stable, only pins worth re-checking are `@radix-ui/react-dialog` and `lucide-react` patch versions at plan time).
