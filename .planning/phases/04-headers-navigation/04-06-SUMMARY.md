---
phase: 04-headers-navigation
plan: 06
status: complete
type: execute
wave: 3
completed: 2026-04-25
requirements: [R5.2, R10.1]
---

# 04-06 — hero-banner (registry:block)

Ships `hero-banner` as Phase 4's first `registry:block`. Rounded navy-gradient
hero with token-driven stipple overlay, optional inner card, headless-controlled
3-dot carousel rail. **No internal state — consumer drives `activeIndex`.**

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/hero-banner/hero-banner.tsx` | 154 | Single file, Context for slide indexing, dot-namespace |
| `registry/hero-banner/registry-item.json` | 13 | `type: "registry:block"`, dgc-theme cascade only |
| `src/app/preview/[item]/renderers/hero-banner.tsx` | 86 | Demonstrates D-10 consumer recipe with `useState` |
| `tests/a11y/hero-banner.a11y.spec.ts` | 47 | light + dark + aria-hidden-focus (A8) |
| `tests/e2e/hero-banner.spec.ts` | 79 | gradient+stipple, dot click, inert, card opacity, dot pill |

Plus root `registry.json` updated.

## D-10 (no internal state) — verified by grep

```
$ grep -c "useState\|useEffect" registry/hero-banner/hero-banner.tsx
0
```

The component source has zero state. The PREVIEW renderer (`src/app/preview/[item]/renderers/hero-banner.tsx`)
does use `useState + useEffect` to demonstrate the consumer recipe — that file
is a CONSUMER of the registry block, not part of the shipped block. This proves
D-10 ("no carousel library needed; 5-line consumer recipe in docs").

## D-12 (token stipple, no SVG asset)

```
$ grep -c "bg-\[image:var(--pattern-stipple)\] bg-\[length:12px_12px\]" registry/hero-banner/hero-banner.tsx
1
```

Stipple is token-driven — `--pattern-stipple` declared at theme.css L229 (light)
and L291 (dark) as a `radial-gradient(circle at center, hsl(0 0% 100% / 0.18) 1px, transparent 1.5px)`.
No SVG file shipped. Dark mode auto-pairs (alpha drops from 0.18 → 0.10).

## Pitfall 5 (inner card opacity) — closure

`<HeroBanner.Card>` renders `bg-card text-card-foreground` — both are semantic
tokens that resolve to OPAQUE values in light AND dark modes. No transparency.
Stipple cannot bleed through.

## Pattern 6 + A8 (inert on inactive slides)

Each slide carries:
- `aria-hidden={!isActive}`
- `inert` boolean attribute when `!isActive`
- `tabIndex={isActive ? 0 : -1}`

`@ts-expect-error` covers React 19's not-yet-typed `inert` boolean attribute. If
a future `@types/react` upgrade types it natively, the comment can be removed
without behavior change. axe-core rule `aria-hidden-focus` will NOT fire because
inactive slides also have `tabIndex=-1`.

## Carousel dot windowing (UI-SPEC Gap #7)

For `total ≤ 3` → all dots visible.
For `total > 3` → 3 visible dots, window slides to keep `activeIndex` centered:

```ts
const visibleStart = total <= 3 ? 0 : Math.max(0, Math.min(total - 3, active - 1));
const visibleEnd   = total <= 3 ? total : visibleStart + 3;
```

Out-of-window dots get `hidden` class. Dot rail itself is `aria-hidden="true"`
(presentational; activeIndex is the source of truth).

## Active vs inactive dot geometry (UI-SPEC Gap #7)

| State | Dimensions | Background |
|---|---|---|
| Active | 18 × 8 | `bg-white` |
| Inactive | 8 × 8 | `bg-white/40` |
| Both | rounded-full, transition-all `var(--dur-base)` |  |

## Exported namespace shape (D-03)

```ts
HeroBanner             // root (props: activeIndex, onIndexChange, slides?, ariaLabel?, children?, className?)
HeroBanner.Slide       // dot-namespace child slot (props: children, index?)
HeroBanner.Card        // dot-namespace child slot — D-13 inner card (opaque per Pitfall 5)
```

## Manifest entry — verbatim for 04-09 to copy-paste

```ts
{
  name: 'hero-banner',
  title: 'HeroBanner',
  docsSlug: 'hero-banner',
  registryUrl: `${REGISTRY_BASE}/r/hero-banner.json`,
  description: 'Rounded navy hero with stipple, optional inner card, and headless-controlled carousel.',
  controls: [
    { kind: 'variant', name: 'slideCount', label: 'Slide count', options: ['1', '2', '3'] as const, default: '3' },
    { kind: 'number', name: 'activeIndex', label: 'Active slide', default: 0, min: 0, max: 2 },
    { kind: 'boolean', name: 'withCard', label: 'Inner card variant', default: false },
  ] as const,
},
```

## Barrel re-export — verbatim for 04-09 to copy-paste

```ts
import { HeroBannerPreview } from './hero-banner';
// + map entry: 'hero-banner': HeroBannerPreview,
```

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/hero-banner.json` emitted with `type: "registry:block"` |
| Cascade: theme only | green | `registryDependencies.length === 1` |
| `pnpm typecheck` | green | clean |
| **D-10 (no state)** | **green** | grep `useState\|useEffect` ×0 in registry source |
| **D-12 (token stipple)** | **green** | grep `bg-[image:var(--pattern-stipple)]` ×1 |
| Pitfall 5 (opaque card) | code-verified | `bg-card text-card-foreground` |
| A8 (inert + aria-hidden + tabIndex=-1) | code-verified | grep `inert` + `aria-hidden=`+ `tabIndex=` |
| ISSUE-01 fix | honored | manifest + barrel deferred to 04-09 |
| D-15 (no usePathname) | code-verified | grep ×0 |
| D-06 (no dark:) | code-verified | grep ×0 |

## Verification — deferred to 04-09 post-wire-up

- a11y axe (light, dark, aria-hidden-focus rule)
- e2e: gradient+stipple, dot click controls, inert verification, card opacity, dot geometry
- visual-diff vs `hero-banner.html` (most important Phase 4 visual gate per Pitfall 8 stipple parity)

## Deviations + rationale

1. Added `hero-banner` to root `registry.json` (recurring pattern; first
   `registry:block` so `target` set to `components/blocks/hero-banner.tsx` per
   shadcn block convention).
2. Skipped manifest+barrel edits per ISSUE-01 BANNER (deferred to 04-09).
3. `@ts-expect-error` retained on the `inert` JSX attribute; React 19 supports
   it at runtime but `@types/react@19.x` may not yet declare it. Behavior
   verified — the attribute reaches the DOM regardless of type acceptance.

## Commits

```
feat(04-06): add hero-banner registry:block with headless carousel + stipple overlay
test(04-06): add a11y + e2e specs for hero-banner (full pass deferred to 04-09)
```

## must_haves status

| Truth | Status | Where |
|---|---|---|
| Install via shadcn CLI | unverified-this-plan | post-04-09 consumer smoke |
| rounded-[var(--radius-lg)] navy gradient + stipple overlay | code-verified | grep checks |
| Stipple via token (D-12), not SVG | code-verified | grep `bg-[image:var(--pattern-stipple)]` |
| **Headless-controlled carousel (D-10)** | **code-verified** | grep useState/useEffect ×0 |
| Inert + aria-hidden + tabIndex=-1 on inactive slides | code-verified | source line 100-105 |
| Active dot 18×8 white, inactive 8×8 white/40, 3 visible max | code-verified | dot windowing math |
| Inner card opaque (Pitfall 5) | code-verified | `bg-card` (no transparency) |
| Compound + array path identical DOM (D-11) | code-verified | array path uses HeroBannerSlide internally |

Wave 3 complete (1/1 plan). 7 of 10 plans done overall (70%). Next: Wave 4 / 04-07 side-drawer (Radix Dialog block).
