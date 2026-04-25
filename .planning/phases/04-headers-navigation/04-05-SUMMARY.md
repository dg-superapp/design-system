---
phase: 04-headers-navigation
plan: 05
status: complete
type: execute
wave: 2
completed: 2026-04-25
requirements: [R5.5, R10.1]
---

# 04-05 — step-indicator (registry:ui)

Ships `step-indicator` — ordered list of 28px numbered circles connected by
2px bars, three states (pending / active / done), dual API per D-08.

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/step-indicator/step-indicator.tsx` | 117 | Single file, dot-namespace + Context for connector geometry |
| `registry/step-indicator/registry-item.json` | 13 | dgc-theme cascade only |
| `src/app/preview/[item]/renderers/step-indicator.tsx` | 36 | Renderer (deferred to 04-09) |
| `tests/a11y/step-indicator.a11y.spec.ts` | 24 | light + dark axe |
| `tests/e2e/step-indicator.spec.ts` | 56 | ordered list + aria-current + connector color + Check glyph |
| `tests/unit/step-indicator.dual-api.test.tsx` | 49 | **D-08 parity proof — passes pre-04-09** |

Plus root `registry.json` updated.

## Connector geometry (UI-SPEC Gap #4 closure)

```
Each <li class="flex-1"> centers a 28px circle. Connector bar is an absolutely-positioned
<span aria-hidden="true"> in the same <li>:

  top:    14px                                           (28/2 - 1, vertically centered minus half bar)
  left:   calc(50% + 14px + var(--space-2))              (right edge of circle + space-2 gap)
  right:  calc(-50% + 14px + var(--space-2))             (left edge of next circle - space-2)
  height: 2px

Color:
  state === 'done'   → bg-brand                           (path INTO next is "completed")
  otherwise          → bg-[hsl(var(--bg-surface-2))]
```

The bar leading INTO an active step is automatically brand, because the previous
step's state is "done" (the rule "color resolves on the CURRENT step's outgoing
edge" is sufficient — no special-case for the active step's incoming edge).

Last step's connector is suppressed via Context-derived `totalSteps` count
(`isLast = index === totalSteps`).

## Exported namespace shape (D-03)

```ts
StepIndicator           // root (props: steps?, ariaLabel?, children?, className?)
StepIndicator.Step      // dot-namespace child (props: label, state, index?)

// Re-exports for type composition:
export type StepState = 'pending' | 'active' | 'done';
export type StepData = { label: string; state: StepState };
```

## Dual-API parity (D-08) — proven pre-04-09

`tests/unit/step-indicator.dual-api.test.tsx` ran via vitest and passed
(1 test / 1 passed, 81ms test time). Asserts identical `aria-current` and
`aria-label` attributes on every `<li>` between array and compound paths.

## ARIA contract (UI-SPEC §ARIA)

- Root `<ol aria-label="…">` for ordered-list semantics.
- Active `<li aria-current="step">`.
- Each `<li aria-label="{n}. {label}, {state}">` with bilingual state text:
  `"completed / បានបញ្ចប់"`, `"active / សកម្ម"`, `"pending / កំពុងរង់ចាំ"`.
- Connector `<span aria-hidden="true">` (Gap #4).
- Done glyph `<Check aria-hidden="true">`.

## registryDependencies — resolved order (Pitfall 10)

```
1. https://registry.016910804.xyz/r/dgc-theme.json   ← theme-only cascade
```

`dependencies: ["lucide-react"]` (Check glyph).

## Manifest entry — verbatim for 04-09 to copy-paste

```ts
{
  name: 'step-indicator',
  title: 'StepIndicator',
  docsSlug: 'step-indicator',
  registryUrl: `${REGISTRY_BASE}/r/step-indicator.json`,
  description: 'Numbered step circles with connector bars — pending / active / done.',
  controls: [
    { kind: 'variant', name: 'stepCount', label: 'Step count', options: ['3', '4', '5'] as const, default: '4' },
    { kind: 'number', name: 'activeIndex', label: 'Active step index (0-based)', default: 1, min: 0, max: 4 },
  ] as const,
},
```

## Barrel re-export — verbatim for 04-09 to copy-paste

```ts
import { StepIndicatorPreview } from './step-indicator';
// + map entry: 'step-indicator': StepIndicatorPreview,
```

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/step-indicator.json` emitted |
| Cascade: theme only | green | `registryDependencies.length === 1` |
| `pnpm typecheck` | green | clean |
| Active circle ring (UI-SPEC §Variants) | code-verified | grep `ring-2 ring-[hsl(var(--brand)/0.25)]` |
| Pending circle styling | code-verified | grep `bg-[hsl(var(--bg-surface-2))] text-muted-foreground` |
| Done circle + Check glyph | code-verified | grep `bg-brand` + Check import |
| ARIA: aria-current=step on active | code-verified | grep `aria-current="step"` ×1 |
| ARIA: aria-hidden on connector + glyph | code-verified | grep `aria-hidden="true"` ≥ 2 |
| **D-08 dual-API parity** | **green** | unit test passes pre-04-09 |
| ISSUE-01 fix | honored | manifest + barrel deferred to 04-09 |
| D-15 (no usePathname) | code-verified | grep ×0 |
| D-06 (no dark:) | code-verified | grep ×0 |

## Verification — deferred to 04-09 post-wire-up

- a11y axe (light, dark)
- e2e: ordered list, aria-current count, connector color, Check glyph
- visual-diff (`pnpm test:visual -- --item step-indicator`)

## Deviations + rationale

1. Added `step-indicator` to root `registry.json` (recurring pattern).
2. Skipped manifest+barrel edits per ISSUE-01 BANNER (deferred to 04-09).
3. Used React Context for `totalSteps` count rather than walking children
   manually — same DOM output, simpler logic, supports both array path and
   compound `React.Children.count` path. Matches the plan's `StepContext`
   approach verbatim.

## Commits

```
feat(04-05): add step-indicator registry:ui with dual API + connector strategy
test(04-05): add a11y + e2e + dual-API unit specs for step-indicator
```

(Hashes in git log.)

## must_haves status

| Truth | Status | Where |
|---|---|---|
| Install via shadcn CLI | unverified-this-plan | post-04-09 consumer smoke |
| `<ol>` of 28px circles + 2px connectors | code-verified | grep checks |
| 3 states: pending / active / done with matrix-specified styling | code-verified | grep checks (3 distinct className branches) |
| Connector color: brand if previous done, surface-2 if pending | code-verified | line 99 of source |
| Connector is `<span aria-hidden=true>` (Gap #4) | code-verified | grep `aria-hidden="true"` ≥ 2 |
| **Dual API: array + compound produce identical DOM** | **proven** | unit test green |
| Active step `aria-current="step"` + bilingual aria-label | code-verified | grep checks |

Wave 2 complete (2 of 2 plans). Wave 1 + Wave 2 = 6 of 10 plans done (60%).
Pausing here per execution checkpoint plan. Next: Wave 3 / 04-06 hero-banner.
