---
phase: 04-headers-navigation
plan: 03
status: complete
type: execute
wave: 1
completed: 2026-04-25
requirements: [R5.6, R10.1, R10.3]
---

# 04-03 — nav-row (registry:ui)

Ships `nav-row` — the workhorse 48px list row used across MiniApp surfaces.
Hybrid trailing slot (chevron / count built-in OR ReactNode escape hatch),
active state with `--nav-active-bg` tint + 3px brand stripe (full row height),
danger tone variant.

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/nav-row/nav-row.tsx` | 167 | CVA-based variants, dot-namespace exports |
| `registry/nav-row/registry-item.json` | 14 | dgc-theme + badge cascade |
| `src/app/preview/[item]/renderers/nav-row.tsx` | 38 | Renderer (barrel re-export deferred to 04-09) |
| `tests/a11y/nav-row.a11y.spec.ts` | 38 | light + dark + variant loop |
| `tests/e2e/nav-row.spec.ts` | 60 | 48px height + stripe binding + 3 trailing variants |

Plus root `registry.json` updated.

## CVA shape

```ts
navRowVariants(
  base: 'relative flex items-center gap-[var(--space-3)] min-h-[48px] …',
  variants: {
    active: { true: '+stripe before:pseudo', false: '' },
    tone:   { default: '', danger: 'text-destructive [&_svg]:text-destructive' },
  },
  defaults: { active: false, tone: 'default' },
)
```

## Exported namespace shape (D-03)

```ts
NavRow              // root (props: label?, caption?, leadingIcon?, active?, tone?, trailing?, trailingCount?)
NavRow.Leading      // dot-namespace child slot
NavRow.Body         // dot-namespace child slot
NavRow.Trailing     // dot-namespace child slot
```

## Trailing API (D-05 hybrid)

| Variant | Built-in | Slot |
|---|---|---|
| `'chevron'` | ✓ Lucide ChevronRight |  |
| `'count'` | ✓ Phase 3 Badge with bilingual aria-label |  |
| `'none'` |  | renders nothing |
| ReactNode (e.g. `<Switch/>`) |  | ✓ rendered verbatim |

## registryDependencies — resolved order (Pitfall 10)

```
1. https://registry.016910804.xyz/r/dgc-theme.json   ← theme-first
2. https://registry.016910804.xyz/r/badge.json
```

`dependencies: ["lucide-react"]`. **Switch is NOT a registryDep** — it goes
through the ReactNode trailing slot (D-05). **Tabs is NOT a registryDep** —
NavRow is independent of Tabs.

## Manifest entry — verbatim for 04-09 to copy-paste

```ts
{
  name: 'nav-row',
  title: 'NavRow',
  docsSlug: 'nav-row',
  registryUrl: `${REGISTRY_BASE}/r/nav-row.json`,
  description: '48px list row — leading chip + label/caption + chevron/count/switch trailing.',
  controls: [
    { kind: 'variant', name: 'trailing', label: 'Trailing', options: ['chevron', 'count', 'switch', 'none'] as const, default: 'chevron' },
    { kind: 'boolean', name: 'active', label: 'Active state', default: false },
    { kind: 'boolean', name: 'withCaption', label: 'Show caption', default: true },
    { kind: 'boolean', name: 'withLeadingIcon', label: 'Show leading icon', default: true },
  ] as const,
},
```

## Barrel re-export — verbatim for 04-09 to copy-paste

```ts
import { NavRowPreview } from './nav-row';
// + map entry: 'nav-row': NavRowPreview,
```

## Pitfall 6 closure (stripe binding)

`relative` is on the variants base classes, NOT on the consumer's wrapper.
Verified in code via grep: `relative flex items-center` × 1 in nav-row.tsx.
The e2e spec asserts `before` pseudo height matches row height (NOT consumer
anchor height) at post-04-09 wire-up.

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/nav-row.json` emitted |
| Cascade order | green | `registryDependencies[0]` ends `/dgc-theme.json`; `/badge.json` second; no `/switch.json`, no `/tabs.json` |
| `pnpm typecheck` | green | clean |
| Tokens consumed | verified | `--nav-active-bg`, `--nav-active-stripe` declared in theme.css L233-234 (light) + L295-296 (dark) |
| ISSUE-01 fix | honored | `registry/items.manifest.ts` and `src/app/preview/[item]/renderers/index.ts` NOT modified |

## Verification — deferred to 04-09 post-wire-up

- a11y axe (light, dark, active state across all 4 trailing variants)
- e2e: 48px min-height, stripe binding (Pitfall 6), chevron SVG, count badge, switch role
- visual-diff baseline (`pnpm test:visual -- --item nav-row`)

## Deviations + rationale

1. **Added `nav-row` to root `registry.json`** (recurring pattern noted in 04-02-SUMMARY).
2. **Skipped Task 2 manifest+barrel edits per ISSUE-01 BANNER** — those land in 04-09 atomically.
3. **Skipped the danger-tone test** per plan's `test.skip` comment — exercised through SideDrawer's "Sign out" row in Wave 4 (04-07).

## Commits

```
fb7d3da  feat(04-03): add nav-row registry:ui with hybrid trailing slot + active stripe
0eafd1e  test(04-03): add a11y + e2e specs for nav-row (full pass deferred to 04-09)
```

(Hashes captured from working tree state — exact SHAs in git log.)

## must_haves status

| Truth | Status | Where verified |
|---|---|---|
| User installs nav-row via shadcn CLI | unverified-this-plan | post-04-09 consumer smoke |
| 48px min-height row with leading + label + caption + trailing | code-verified | grep `min-h-[48px]`; e2e at post-04-09 |
| Active state: --nav-active-bg tint + 3px stripe full height | code-verified | grep `bg-[hsl(var(--nav-active-bg))]` + `before:w-[var(--nav-active-stripe)] before:bg-brand`; e2e at post-04-09 |
| chevron + count built-in; switch via slot | code-verified | switch case in NavRowTrailingSlot; ReactNode escape hatch |
| Presentational only (no `<a>`/`<button>`/`usePathname`) | code-verified | grep `<a `×0, `usePathname`×0 |
| Stripe stays bound to row root (Pitfall 6) | code-verified | `relative` on variant base class; e2e at post-04-09 |

Wave 1 complete (4 of 4 plans shipped: 04-00, 04-01, 04-02, 04-03). Wave 2 next: 04-04 segmented-tabs + 04-05 step-indicator.
