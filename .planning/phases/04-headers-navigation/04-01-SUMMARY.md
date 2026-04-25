---
phase: 04-headers-navigation
plan: 01
status: complete
type: execute
wave: 1
completed: 2026-04-25
requirements: [R5.1, R10.1, R10.3]
---

# 04-01 — app-header (registry:ui)

Ships `app-header` as the foundation MiniApp top-bar primitive. 56px navy-gradient
bar with a `56px 1fr auto` 3-slot CSS grid, 44px icon-button hit targets with 22px
white glyphs, dot/count badges with 2px navy border, and a focus-visible white
ring (`--ring-on-navy`) that survives the navy gradient.

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/app-header/app-header.tsx` | 242 | Single file, dot-namespace exports per D-03 |
| `registry/app-header/registry-item.json` | 14 | shadcn registry-item declaration |
| `src/app/preview/[item]/renderers/app-header.tsx` | 65 | Playground renderer (barrel re-export deferred to 04-09) |
| `src/components/ui/badge.ts` | 13 | **Rule 3 auto-fix** — shim mirrors label.ts pattern from Phase 3 Plan 3-09 |
| `tests/a11y/app-header.a11y.spec.ts` | 38 | light + dark + 2-icon-cluster axe runs |
| `tests/e2e/app-header.spec.ts` | 49 | 44×44 hit area + 2-icon ≥96px + focus-visible white ring |
| `tests/e2e/khmer-clipping.spec.ts` | +14 | Appended app-header descender-fit assertion |

## Exported namespace shape (D-03)

```ts
AppHeader              // root component (props: title?, leading?, trailing?, ariaLabel?, as?)
AppHeader.Title        // dot-namespace child slot
AppHeader.Leading      // dot-namespace child slot
AppHeader.Trailing     // dot-namespace child slot
AppHeader.IconButton   // internal primitive exposed via dot-namespace (badge?: 'dot' | number)
```

## registryDependencies — resolved order (Pitfall 10)

```
1. https://registry.016910804.xyz/r/dgc-theme.json   ← MUST be first
2. https://registry.016910804.xyz/r/badge.json
```

`dependencies: ["lucide-react"]` (no Phase 3 Button registry-dep — AppHeader rolls
its own internal IconButton because navy-on-gradient styling diverges from Button's
CVA variants).

## Manifest entry — verbatim for 04-09 to copy-paste

Append this object inside the `items` array of `registry/items.manifest.ts`:

```ts
{
  name: 'app-header',
  title: 'AppHeader',
  docsSlug: 'app-header',
  registryUrl: `${REGISTRY_BASE}/r/app-header.json`,
  description: 'MiniApp top nav bar — navy gradient, 3-slot grid, 44px icon-buttons.',
  controls: [
    { kind: 'text', name: 'title', label: 'Title', default: 'ដាក់ពាក្យទិដ្ឋាការ', placeholder: 'Apply for visa' },
    { kind: 'variant', name: 'leadingIcon', label: 'Leading icon', options: ['menu', 'back', 'none'] as const, default: 'menu' },
    { kind: 'number', name: 'trailingCount', label: 'Trailing count', default: 0, min: 0, max: 9 },
    { kind: 'boolean', name: 'withBadge', label: 'Show badge cluster', default: false },
  ] as const,
},
```

## Barrel re-export — verbatim for 04-09 to copy-paste

In `src/app/preview/[item]/renderers/index.ts`, add the import alongside the
other 14 imports and the map entry alongside the other map entries:

```ts
import { AppHeaderPreview } from './app-header';
// …
'app-header': AppHeaderPreview,
```

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/app-header.json` emitted, theme-first cascade |
| Registry JSON validity | green | `name=app-header`, `type=registry:ui`, `registryDependencies[0]` ends with `/dgc-theme.json` |
| `pnpm typecheck` | green | clean after `@/components/ui/badge` shim |
| Acceptance grep checks (Task 1) | all green | `data-app-header-icon`×3, `min-h-[var(--app-header-h)]`×2, `grid-cols-[var(--app-header-icon)_1fr_auto]`×2, `bg-[image:var(--gradient-hero)]`×2, `Object.assign(AppHeaderRoot`×1, `border-[hsl(var(--blue-900))]`×1, `bg-[hsl(var(--red-700))]`×1, `var(--ring-on-navy)`×1, `dangerouslySetInnerHTML`×0, `dark:` only in comment doc, `usePathname` only in comment doc |
| ISSUE-01 fix | honored | `registry/items.manifest.ts` and `src/app/preview/[item]/renderers/index.ts` NOT modified — both reserved for 04-09 |

## Verification — deferred to 04-09 post-wire-up

Per plan §verify, the following depend on `/preview/app-header` resolving via the
manifest+barrel that 04-09 atomically wires for all 8 Phase 4 components:

- a11y axe runs (light, dark, 2-icon cluster)
- e2e: 44×44 touch target, 2-icon ≥96px right column, focus-visible white ring
- e2e: Khmer descender-fit
- visual-diff baseline (`pnpm test:visual -- --item app-header`)

Spec FILES committed in this plan; CI green-gate runs after 04-09.

## Deviations + rationale

1. **Created `src/components/ui/badge.ts` shim** (not listed in plan's `files_modified`).
   - Why: AppHeader source imports `@/components/ui/badge` (consumer-resolution
     path per the registry pattern). The repo's `@/*` alias maps to `./src/*`, so
     authoring-time typecheck failed without a shim. Mirrors the label shim from
     Phase 3 Plan 3-09 (commit `1410d9c`).
   - Decision: Auto-fix — same pattern, same precedent, blocks no decisions.
   - Acceptance: `pnpm typecheck` green; consumers never see this file (shadcn
     bundles only the registry source + registryDependencies).

2. **Recovered partial work from a prior interrupted executor pass.**
   - Two `gsd-executor` subagent attempts terminated mid-task before commit.
     The first wrote `app-header.tsx` + `registry-item.json` + the `registry.json`
     entry; the second only `git add`'d. Switched to interactive mode (orchestrator
     executes inline) — verified the recovered files against the plan's acceptance
     criteria (all grep checks pass; line count 242 ≥ 80), then committed Task 1.

3. **Visual-diff baseline not captured here** — deferred to 04-09 (same reason as
   a11y/e2e: harness needs `/preview/app-header` reachable).

## Commits

```
b206866  feat(04-01): add app-header registry:ui with hybrid composition + badge shim
4f6775b  feat(04-01): add app-header playground renderer (barrel re-export deferred to 04-09)
84dc450  test(04-01): add a11y + e2e specs and Khmer-clip extension for app-header
```

## must_haves status

| Truth | Status | Where verified |
|---|---|---|
| User installs app-header via shadcn CLI and gets a working AppHeader | unverified-this-plan | post-04-09 consumer smoke test |
| 56px navy gradient bar with 3-slot CSS grid | code-verified | grep checks; e2e at post-04-09 |
| Icon buttons 44×44 with 22px white glyphs | code-verified | grep `--app-header-icon` + `--app-header-glyph`; e2e at post-04-09 |
| Count badge red pill with 2px navy border (not navy fill) | code-verified | grep `bg-[hsl(var(--red-700))]` + `border-[hsl(var(--blue-900))]` |
| Focus-visible white ring on navy | code-verified | grep `--ring-on-navy`; e2e at post-04-09 |
| Khmer title does not clip in 56px bar | code-verified | `min-h-[var(--app-header-h)]` (not `h-[…]`); e2e at post-04-09 |
| Two trailing icons auto-resolve right column ≥96px | code-verified | `grid-cols-[var(--app-header-icon)_1fr_auto]`; e2e at post-04-09 |

Phase 4 Wave 1 / 04-01 complete. Wave 1 / 04-02 (section-header) is next; Wave 6 / 04-09 atomically finalizes manifest + renderer barrels for all 8 Phase 4 components.
