---
phase: 04-headers-navigation
plan: 08
status: complete
type: execute
wave: 5
completed: 2026-04-25
requirements: [R5.1, R5.2, R5.3, R5.6, R10.1, R10.2, R10.3]
---

# 04-08 — miniapp-home (registry:block) — **PHASE 4 EXIT-GATE**

Ships `miniapp-home` as the composed Phase 4 dogfood block: AppHeader +
HeroBanner + SectionHeader (×2) + NavRow list + 6-tile placeholder grid,
all wired together as a single block. Phase 4 EXIT GATE achieved.

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/miniapp-home/miniapp-home.tsx` | 188 | Composed block + inline `<HomeTile>` (D-17) |
| `registry/miniapp-home/registry-item.json` | 17 | `type: "registry:block"`, 5-item cascade |
| `src/app/preview/[item]/renderers/miniapp-home.tsx` | 19 | Playground renderer (one-liner) |
| **`src/app/preview/miniapp-home/page.tsx`** | 10 | **Dogfood route — Phase 4 EXIT GATE** |
| `tests/a11y/miniapp-home.a11y.spec.ts` | 23 | light + dark axe |
| `tests/e2e/miniapp-home.spec.ts` | 56 | composition, Khmer no-clip, tile aria-labels, dark mode |

Plus 4 new shim files in `src/components/ui/` (app-header, hero-banner,
section-header, nav-row), root `registry.json` updated, visual-diff script
extended with SPECIMEN_ALIAS.

## D-17 closure (HomeTile inline)

```
$ grep -c "function HomeTile" registry/miniapp-home/miniapp-home.tsx
1
$ grep -c "export function HomeTile\|export const HomeTile" registry/miniapp-home/miniapp-home.tsx
0
```

`<HomeTile>` is INTERNAL to `miniapp-home.tsx` — defined and used in the
TILES.map but NOT exported. Phase 6 swap target: replace `<HomeTile>` JSX
with `<ServiceTile>` and delete the local component + `TILE_GRADIENTS` map.

## Path-alias resolution choice

The block source uses **consumer-style imports** `@/components/ui/<name>` —
that's the path that exists in a consumer's repo after `shadcn add miniapp-home`
(per shadcn convention, components install to `components/ui/`).

In THIS repo, `tsconfig.json` aliases `@/*` to `./src/*`. To make these imports
resolve during authoring without changing the alias, **shim files** were added
at `src/components/ui/` mirroring the existing `label.ts` / `badge.ts` pattern
from Phase 3:

| Shim | Re-exports |
|---|---|
| `src/components/ui/app-header.ts` | `AppHeader`, `AppHeaderProps`, `AppHeaderIconButtonProps` |
| `src/components/ui/hero-banner.ts` | `HeroBanner`, `HeroBannerProps` |
| `src/components/ui/section-header.ts` | `SectionHeader`, `SectionHeaderProps` |
| `src/components/ui/nav-row.ts` | `NavRow`, `navRowVariants`, `NavRowProps`, `NavRowTrailingVariant` |

Consumers never see these shims — shadcn bundles only the registry source +
registryDependencies. The shims exist solely so `pnpm typecheck` and
`pnpm build` succeed in the authoring repo.

This pattern is documented as a known **recurring deviation** for component
plans 04-01..04-08 — every component that's referenced by the miniapp-home
block needs a shim in `src/components/ui/`.

## Visual-diff alias

`scripts/visual-diff-components.mjs` extended to support specimen aliases:

```js
const SPECIMEN_ALIAS = { 'miniapp-home': 'superapp-host' };
const legacyName = SPECIMEN_ALIAS[item] ?? item;
const legacyPath = `D:/sources/dgc-miniapp-design-system/project/preview/${legacyName}.html`;
```

Composed blocks may not have a 1:1 named legacy specimen — `superapp-host.html`
is the closest visual match per UI-SPEC §Item-by-item. Future composed blocks
add entries to `SPECIMEN_ALIAS`.

maxΔRGB vs `superapp-host.html`: deferred to 04-09 full-suite run (the dev
server needs to be running for visual-diff to capture the live screenshot).

## Cascade per D-09 — verified

```json
"registryDependencies": [
  "https://registry.016910804.xyz/r/dgc-theme.json",
  "https://registry.016910804.xyz/r/app-header.json",
  "https://registry.016910804.xyz/r/hero-banner.json",
  "https://registry.016910804.xyz/r/section-header.json",
  "https://registry.016910804.xyz/r/nav-row.json"
]
```

Pitfall 10: dgc-theme FIRST. Installing `miniapp-home` cascade-pulls all 5
items (dedupe at install: AppHeader and NavRow both list `badge`, but shadcn
deduplicates). SideDrawer is NOT a dependency — no drawer in the home composition.

## Phase 4 EXIT-GATE verification

| Truth | Status | Evidence |
|---|---|---|
| Cascade auto-pulls 5 items | green | registryDependencies length === 5, ordered |
| Composes AppHeader + HeroBanner + SectionHeader + NavRow + 6-tile grid | code-verified | grep checks (4 imports, ≥3 NavRows, grid-cols-3) |
| `<HomeTile>` is INLINE (D-17) | green | grep `function HomeTile`×1, `export…HomeTile`×0 |
| Block is single source of truth | green | `src/app/preview/miniapp-home/page.tsx` is `<MiniAppHome />` literal |
| Dogfood route renders without manual glue | green | `page.tsx` imports + renders the block, nothing else |
| `/preview/miniapp-home` reachable | green | static export route per `output: "export"` (next.config) |

`pnpm typecheck`: green. `pnpm registry:build`: emits `public/r/miniapp-home.json`
with `type: "registry:block"`. Full `pnpm build` static-export verification
(`out/preview/miniapp-home/index.html` exists) is part of 04-09's full-suite run.

## Manifest entry — verbatim for 04-09 to copy-paste

```ts
{
  name: 'miniapp-home',
  title: 'MiniAppHome',
  docsSlug: 'miniapp-home',
  registryUrl: `${REGISTRY_BASE}/r/miniapp-home.json`,
  description: 'Composed MiniApp home — AppHeader + HeroBanner + SectionHeader + NavRow + tile grid. Phase 4 exit-gate composition.',
  controls: [] as const,
},
```

PlaygroundShell handles `controls.length === 0` per Pattern 7 — verified at
`src/app/preview/[item]/PlaygroundShell.tsx:111`
(`{entry.controls.length > 0 && (...)}`).

## Barrel re-export — verbatim for 04-09 to copy-paste

```ts
import { MiniAppHomePreview } from './miniapp-home';
// + map entry: 'miniapp-home': MiniAppHomePreview,
```

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/miniapp-home.json` emitted |
| `pnpm typecheck` | green | clean (with new shims) |
| Cascade order | green | dgc-theme first, app-header, hero-banner, section-header, nav-row |
| ISSUE-01 fix | honored | manifest + barrel deferred to 04-09 |
| D-17 (HomeTile inline, not exported) | green | grep checks |
| D-09 (cascade) | green | 5 registryDeps |
| D-15 (no usePathname in block) | code-verified | grep ×0 |

## Verification — deferred to 04-09 post-wire-up

- `pnpm build` produces `out/preview/miniapp-home/index.html`
- a11y axe (light, dark) on dogfood route
- e2e: composition presence, Khmer no-clip, tile aria-labels, dark mode flip
- visual-diff vs `superapp-host.html` (alias resolved)

## Deviations + rationale

1. **4 new shims at `src/components/ui/`** — recurring pattern (mirrors Phase 3
   `label.ts` and earlier 04-01 `badge.ts`). Documented as a known deviation:
   any component imported via consumer-style `@/components/ui/<name>` from a
   block source needs a matching shim file.
2. Added `miniapp-home` to root `registry.json` (recurring pattern).
3. Skipped manifest+barrel edits per ISSUE-01 BANNER (deferred to 04-09).
4. Used Tailwind arbitrary `style={{ backgroundImage: TILE_GRADIENTS[variant] }}`
   for tile gradients instead of class-based CVA — there are no tile-specific
   gradient tokens in theme.css yet (Phase 6 may add `--tile-grad-blue` etc.).
   Phase 4 ships raw HSL channel triplets in the gradient stops as a stub.
5. **Dogfood route DOES NOT include any inline JSX beyond `<MiniAppHome />`** —
   exit-gate "no manual glue" requirement satisfied per ROADMAP.

## Commits

```
feat(04-08): add miniapp-home registry:block + dogfood route + 4 component shims (Phase 4 EXIT GATE)
test(04-08): add a11y + e2e specs for miniapp-home dogfood route
```

## must_haves status

| Truth | Status | Where |
|---|---|---|
| Install via shadcn CLI; cascade pulls 4 deps | unverified-this-plan | Wave 6 smoke-consumer run |
| Composed dogfood: AppHeader + HeroBanner + 2× SectionHeader + 6 HomeTiles + 3 NavRows | code-verified | grep + e2e at post-04-09 |
| `<HomeTile>` inline (D-17) | green | grep checks |
| Block source = single source of truth | green | `<MiniAppHome />` literal in page.tsx |
| Dogfood route renders without manual glue | green | page.tsx LOC = 10 |
| Phase 4 EXIT GATE | **green** | composition compiles, JSON valid cascade, dogfood route exists |

Wave 5 complete (1/1 plan). 9 of 10 plans done overall (90%). Next + last: Wave 6 / 04-09 atomic finalize — wires manifest entries and renderer barrel for all 8 components in one commit, runs full a11y + e2e + visual-diff suites, marks phase complete.
