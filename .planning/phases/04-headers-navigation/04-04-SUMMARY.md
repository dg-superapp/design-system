---
phase: 04-headers-navigation
plan: 04
status: complete
type: execute
wave: 2
completed: 2026-04-25
requirements: [R5.4, R10.1, R10.3]
---

# 04-04 — segmented-tabs (registry:ui)

Ships `segmented-tabs` as a pill-group tab navigation built on Radix Tabs
DIRECTLY (NOT via Phase 3 `registry/tabs/`). Surface-2 track, brand-fill
active trigger, 120ms color transition.

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/segmented-tabs/segmented-tabs.tsx` | 121 | Radix-direct + dual API per D-08 |
| `registry/segmented-tabs/registry-item.json` | 14 | dgc-theme cascade only (Pitfall 4) |
| `src/app/preview/[item]/renderers/segmented-tabs.tsx` | 31 | Renderer (deferred to 04-09) |
| `tests/a11y/segmented-tabs.a11y.spec.ts` | 27 | light + dark axe |
| `tests/e2e/segmented-tabs.spec.ts` | 50 | tablist + ArrowRight + brand color + track token |
| `tests/unit/segmented-tabs.dual-api.test.tsx` | 56 | **D-08 parity proof — passes pre-04-09** |

Plus root `registry.json` updated with segmented-tabs entry.

## Radix version + CVA exports

- Radix Tabs: `@radix-ui/react-tabs` ^1.1.13 (already in dependencies — no new install)
- CVA exports — DELIBERATELY namespaced (Pitfall 4):
  - `segmentedTabsListVariants`
  - `segmentedTabsTriggerVariants`
- These names DO NOT collide with Phase 3 `tabsListVariants` / `tabsTriggerVariants`,
  so consumers can install BOTH `tabs` and `segmented-tabs` without conflict.

## Exported namespace shape (D-03)

```ts
SegmentedTabs               // root (props: items?, ariaLabel?, defaultValue?, value?, onValueChange?, …)
SegmentedTabs.List          // forwardRef wrapping RadixTabs.List with segmentedTabsListVariants()
SegmentedTabs.Trigger       // forwardRef wrapping RadixTabs.Trigger with segmentedTabsTriggerVariants()
SegmentedTabs.Content       // forwardRef wrapping RadixTabs.Content
```

## Dual-API parity (D-08) — proven pre-04-09

`tests/unit/segmented-tabs.dual-api.test.tsx` ran via `pnpm vitest run …` and
passed (1 test / 1 passed, 26ms test time, 10.27s total including environment
setup). Asserts `items={[…]}` array path produces identical role + textContent
+ data-state attributes to the canonical compound `<SegmentedTabs.List>` path.
Per D-08 the array path renders compound internally, so this is a regression
guard: any future divergence in either path will fail this test.

## registryDependencies — resolved order (Pitfall 10 + Pitfall 4)

```
1. https://registry.016910804.xyz/r/dgc-theme.json   ← theme-only cascade
```

`dependencies: ["@radix-ui/react-tabs", "lucide-react"]`. **No `tabs.json` cascade.**
This is the Pitfall 4 closure: different visual contracts compose at consumer
level (both items installable side-by-side), not via registry cascade.

## D-15 grep-guard (ISSUE-02 fix)

```
$ grep -c "usePathname\|next/navigation" registry/segmented-tabs/segmented-tabs.tsx
0
```

Active state is driven entirely by Radix Tabs `data-state="active"` attribute
managed from the root `value`/`defaultValue` prop. Routing-aware variants are
the consumer's responsibility.

## D-06 hover-token reconciliation

The plan's draft mentioned a `dark:hover:bg-white/5` violation that needed
removal. The final source uses `hover:bg-[hsl(var(--bg-surface-2)/0.6)]`
exclusively — token-driven hover that adapts via the `--bg-surface-2` value
declared in `.dark` (theme.css L295+). No `dark:` utility present.

```
$ grep -E "dark:" registry/segmented-tabs/segmented-tabs.tsx
(no matches)
```

## Manifest entry — verbatim for 04-09 to copy-paste

```ts
{
  name: 'segmented-tabs',
  title: 'SegmentedTabs',
  docsSlug: 'segmented-tabs',
  registryUrl: `${REGISTRY_BASE}/r/segmented-tabs.json`,
  description: 'Pill-group tabs — surface-2 track, brand-fill active.',
  controls: [
    { kind: 'variant', name: 'tabCount', label: 'Tab count', options: ['2', '3', '4'] as const, default: '3' },
    { kind: 'variant', name: 'defaultIndex', label: 'Default tab', options: ['0', '1', '2', '3'] as const, default: '0' },
  ] as const,
},
```

## Barrel re-export — verbatim for 04-09 to copy-paste

```ts
import { SegmentedTabsPreview } from './segmented-tabs';
// + map entry: 'segmented-tabs': SegmentedTabsPreview,
```

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/segmented-tabs.json` emitted |
| Cascade: theme only | green | `registryDependencies.length === 1`, ends `/dgc-theme.json` |
| `pnpm typecheck` | green | clean |
| Pitfall 4 closure | green | grep `tabsListVariants\|tabsTriggerVariants`×0 (Phase 3 names absent); `segmentedTabsListVariants`+`segmentedTabsTriggerVariants` present |
| ISSUE-02 (D-15) | green | grep `usePathname\|next/navigation`×0 |
| D-06 (no dark:) | green | grep `dark:`×0 |
| **D-08 dual-API parity** | **green** | unit test passes pre-04-09 |
| ISSUE-01 fix | honored | `registry/items.manifest.ts` and renderer index NOT modified |

## Verification — deferred to 04-09 post-wire-up

- a11y axe (light, dark)
- e2e: tablist semantics, ArrowRight focus, brand-color active, track surface-2
- visual-diff (`pnpm test:visual -- --item segmented-tabs`)

## Deviations + rationale

1. Added `segmented-tabs` to root `registry.json` (recurring pattern).
2. Skipped manifest+barrel edits per ISSUE-01 BANNER (deferred to 04-09).
3. Used `textContent` + `role` + `data-state` for dual-API parity instead of
   the plan's `value`/`data-value` attribute comparison — Radix Tabs doesn't
   expose `value` as a DOM attribute; visible label is the canonical surface.
   Equivalent guarantee, accurate to actual Radix DOM output.

## Commits

```
feat(04-04): add segmented-tabs registry:ui via Radix Tabs direct (Pitfall 4 closed)
test(04-04): add a11y + e2e + dual-API unit specs for segmented-tabs
```

(Hashes in git log.)

## must_haves status

| Truth | Status | Where |
|---|---|---|
| Install via shadcn CLI | unverified-this-plan | post-04-09 consumer smoke |
| Radix Tabs + DGC pill styling (surface-2 track, brand active) | code-verified | grep `bg-[hsl(var(--bg-surface-2))]`, `data-[state=active]:bg-brand` |
| Arrow-Left/Right cycles (Radix default) | code-verified | Radix-direct import; e2e at post-04-09 |
| 120ms color transition (UI-SPEC §Motion Gap #3) | code-verified | grep `duration-[var(--dur-fast)]` + `transition-colors` |
| CVA names DON'T collide with Phase 3 tabs | code-verified | namespaced exports + grep guard |
| Cascade has dgc-theme ONLY (no tabs cascade) | code-verified | registryDependencies.length === 1 |
| Pure-presentational (no usePathname / next/navigation) | code-verified | grep guard ×0 |

Wave 2 in progress (1 of 2 plans done). Next: 04-05 step-indicator.
