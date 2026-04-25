# Phase 3: Primitives (14 items) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 3-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 3-primitives
**Mode:** `--auto` (every gray area auto-resolved with the recommended option)
**Areas discussed:** Variant API, Form composition, Docs page location, Playground route, Playground live-edit, Khmer rendering strategy, Axe harness, Registry sub-part boundary, Dark mode variant surface, Khmer test fixture

---

## Variant API

| Option | Description | Selected |
|--------|-------------|----------|
| CVA (`class-variance-authority`) | shadcn canonical; documented; zero custom infra | ✓ (recommended) |
| Data-attributes + Tailwind | `data-variant="primary"` with attribute selectors | |
| Custom utility layer | Tailwind plugin defining `.btn-primary` etc. | |

**User's choice:** CVA
**Notes:** CVA is shadcn canonical — downstream agents will import `cva` and define `buttonVariants({ variant, size })` in every primitive that has variants.

---

## Form composition (R4.9)

| Option | Description | Selected |
|--------|-------------|----------|
| Single `Form` registry item bundling all sub-parts | One `form.tsx` exporting Form/FormField/FormItem/FormLabel/FormControl/FormMessage/FormDescription | ✓ (recommended) |
| Split sub-parts into separate `registry:ui` items | 7 separate items, each installable alone | |

**User's choice:** Single Form item
**Notes:** Keeps the phase at exactly 14 items as ROADMAP specifies. Matches shadcn canonical bundling.

---

## Docs page location

| Option | Description | Selected |
|--------|-------------|----------|
| Central `app/docs/components/<item>/page.mdx` | shadcn.com pattern; MDX + App Router; shared layout | ✓ (recommended) |
| Co-located `registry/<item>/docs.mdx` | Docs live next to component source | |

**User's choice:** Central app route
**Notes:** Aligns with Phase 2 `/docs/foundations/tokens` pattern; docs nav can be centrally managed.

---

## Playground route

| Option | Description | Selected |
|--------|-------------|----------|
| Dynamic `/preview/[item]` + manifest | Single route driven by `registry/items.manifest.ts` | ✓ (recommended) |
| Static per-item routes | 14 hand-written `/preview/<item>/page.tsx` | |

**User's choice:** Dynamic route
**Notes:** Adding future primitives (Phase 4/5/6) requires only a manifest entry, no route file.

---

## Playground live-edit (R9.2)

| Option | Description | Selected |
|--------|-------------|----------|
| Props controls (React state) | Typed UI for each prop; no JSX eval | ✓ (recommended) |
| `react-live` | Live JSX editor with runtime eval | |
| `sandpack` iframe | Full sandbox iframe | |
| Defer to Phase 7 | Ship docs only, skip playground | |

**User's choice:** Props controls (React state)
**Notes:** No runtime JSX eval → safer + lighter. Theme + language toggles via context providers.

---

## Khmer rendering strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Global `:lang(km)` CSS cascade | Single rule in dgc-theme globals; primitives Khmer-agnostic | ✓ (recommended) |
| Per-component conditional logic | Each primitive reads `useContext(Language)` and adjusts | |

**User's choice:** Global cascade
**Notes:** Already shipped in Phase 2. Primitives need zero Khmer-aware code. Verified at the `/test/khmer` page instead.

---

## Axe harness (Phase 3 exit requirement)

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright + `@axe-core/playwright` on each `/preview/<item>` | Full-render a11y scan; runs in CI | ✓ (recommended) |
| Manual `axe` npm script | Developer runs locally; no CI gate | |
| Unit-level `jest-axe` | Test each component in isolation | |

**User's choice:** Playwright + axe
**Notes:** Full render catches context-dependent a11y issues (focus ring vs background). CI gate blocks deploy on failure.

---

## Registry sub-part boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Sub-parts bundled in parent `files[]` | Single JSON per primitive; consumer gets one file with all sub-parts | ✓ (recommended) |
| Sub-parts as separate `registry:ui` | Each sub-part (FormField, SelectItem, TabsList) its own registry item | |

**User's choice:** Bundled in parent
**Notes:** Fewer JSON artifacts; shadcn canonical; keeps phase at 14 items.

---

## Dark mode variant surface

| Option | Description | Selected |
|--------|-------------|----------|
| CSS vars only (via `.dark` class on dgc-theme) | Components read semantic vars; no `dark:*` utilities | ✓ (recommended) |
| Variant class per component | Every primitive has `dark:bg-*` utilities | |

**User's choice:** CSS vars only
**Notes:** Phase 2 already shipped dual-mode tokens. Primitives stay theme-agnostic.

---

## Khmer test fixture

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated `/test/khmer` page (all primitives) | One page renders every primitive with Khmer labels + placeholders; Playwright visual diff | ✓ (recommended) |
| Per-item bilingual playground tab | Each `/preview/<item>` adds a `lang=km` mode | |

**User's choice:** Dedicated `/test/khmer` page
**Notes:** Single Playwright snapshot covers Phase 3 exit proof ("Khmer test page renders without clipping"). Per-item playgrounds still provide a language toggle for manual inspection.

---

## Claude's Discretion

Items the user deferred to Claude:
- Exact file structure per item (`form.tsx` vs `form/index.tsx`) — match shadcn canonical
- Props-table generation mechanism (static MDX vs tooling) — prefer static
- Token layer in component source (semantic aliases vs scale tokens) — prefer semantic aliases for consumer editability
- `asChild` surface on interactive primitives — default yes where Radix supports it
- Playwright snapshot tool choice
- Docs MDX layout component shape

## Deferred Ideas

- Dialog/Sheet/Toast/Alert/Empty/Skeleton/Spinner → Phase 5
- AppHeader/HeroBanner/SegmentedTabs/StepIndicator/NavRow/SideDrawer/SectionHeader → Phase 4
- Table/InfoRow/DocumentListRow/TimestampTag/ServiceTile/FileUploader/MinistryPicker/FormScreen/MobileFrame/ServiceGrid → Phase 6
- DGC production icon set → stays on Lucide until delivered
- Bearer-auth private registry, `/v1/` versioning, npm publishing → v2
- Props-table auto-generation pipeline → revisit Phase 7 if drift observed
