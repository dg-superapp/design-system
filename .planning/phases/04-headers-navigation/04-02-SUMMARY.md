---
phase: 04-headers-navigation
plan: 02
status: complete
type: execute
wave: 1
completed: 2026-04-25
requirements: [R5.3]
---

# 04-02 — section-header (registry:ui)

Ships `section-header` as the simplest Phase 4 primitive — a horizontal title +
optional right-aligned accent action-link. No Radix dependency.

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/section-header/section-header.tsx` | 96 | Single file, dot-namespace exports per D-03 |
| `registry/section-header/registry-item.json` | 13 | shadcn registry-item, dgc-theme cascade only |
| `src/app/preview/[item]/renderers/section-header.tsx` | 30 | Playground renderer (barrel re-export deferred to 04-09) |
| `tests/a11y/section-header.a11y.spec.ts` | 24 | light + dark axe runs |
| `tests/e2e/section-header.spec.ts` | 50 | h2 render + brand color + focus ring + hover underline |

Plus root `registry.json` updated with `section-header` entry between `app-header` and `form`.

## Exported namespace shape (D-03)

```ts
SectionHeader              // root (props: title?, action?, as?)
SectionHeader.Title        // dot-namespace child slot
SectionHeader.Action       // dot-namespace child slot (presentational <a> per D-15)
```

## registryDependencies — resolved order (Pitfall 10)

```
1. https://registry.016910804.xyz/r/dgc-theme.json   ← theme-first
```

`dependencies: []` — no npm packages.

## Manifest entry — verbatim for 04-09 to copy-paste

```ts
{
  name: 'section-header',
  title: 'SectionHeader',
  docsSlug: 'section-header',
  registryUrl: `${REGISTRY_BASE}/r/section-header.json`,
  description: 'Section title + optional accent action link.',
  controls: [
    { kind: 'text', name: 'title', label: 'Title', default: 'សេវាថ្មីៗ', placeholder: 'Recent services' },
    { kind: 'boolean', name: 'withAction', label: 'Show action link', default: true },
    { kind: 'text', name: 'actionLabel', label: 'Action label', default: 'មើលទាំងអស់', placeholder: 'View all' },
  ] as const,
},
```

## Barrel re-export — verbatim for 04-09 to copy-paste

```ts
import { SectionHeaderPreview } from './section-header';
// + map entry: 'section-header': SectionHeaderPreview,
```

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/section-header.json` emitted |
| Registry JSON validity | green | `name=section-header`, `type=registry:ui`, `registryDependencies[0]` ends with `/dgc-theme.json` |
| `pnpm typecheck` | green | clean |
| `text-brand` utility resolves | green | Tailwind v4 `@theme` declares `--color-brand: hsl(var(--brand))` in `registry/dgc-theme/theme.css` line 38, so `text-brand` is auto-generated |
| ISSUE-01 fix | honored | `registry/items.manifest.ts` and `src/app/preview/[item]/renderers/index.ts` NOT modified |

## Verification — deferred to 04-09 post-wire-up

Per plan §verify, full a11y + e2e green-gate runs after 04-09 wires the
manifest + barrel re-export. Spec FILES committed in this wave.

- a11y axe (light, dark)
- e2e: h2 render, action-link brand color, focus ring, hover underline
- visual-diff baseline (`pnpm test:visual -- --item section-header`)

## Deviations + rationale

1. **Added `section-header` entry to root `registry.json`** in addition to the
   per-item `registry-item.json` declared in `files_modified`.
   - Why: the registry build script enumerates the root `registry.json` items
     array — without an entry, `pnpm registry:build` does not emit
     `public/r/section-header.json`, blocking acceptance criteria.
   - Decision: This is the same pattern app-header used (Task 1 commit `b206866`).
     The `files_modified` list in plans 04-01..04-08 is incomplete on this point;
     each component plan must touch root `registry.json` plus `registry/<item>/*`.
     Documented here so Wave 6 plan 04-09 doesn't think this is novel work.
   - Impact: none — both shadcn registry-item.json and root registry.json declare
     identical metadata; build emits the same JSON.

## Commits

```
6e00c62  feat(04-02): add section-header registry:ui with title + accent action-link
71ee0b6  test(04-02): add a11y + e2e specs for section-header (full pass deferred to 04-09)
```

## must_haves status

| Truth | Status | Where verified |
|---|---|---|
| User installs section-header via shadcn CLI | unverified-this-plan | post-04-09 consumer smoke |
| Renders h2 title + optional accent action-link | code-verified | grep + e2e at post-04-09 |
| Action-link uses --brand color, hover underlines, focus shows --shadow-focus | code-verified | grep `text-brand`, `hover:underline`, `var(--shadow-focus)`; e2e at post-04-09 |
| Title uses --text-base 16px font-semibold | code-verified | `text-base font-semibold` class on TitleEl |

Phase 4 Wave 1 / 04-02 complete. Wave 1 / 04-03 (nav-row) is next.
