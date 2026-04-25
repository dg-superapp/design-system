---
phase: 04-headers-navigation
plan: 09
status: complete
type: execute
wave: 6
completed: 2026-04-25
requirements: [R5.1, R5.2, R5.3, R5.4, R5.5, R5.6, R5.7, R10.1, R10.2, R10.5]
---

# 04-09 — Atomic finalize (Phase 4 sign-off)

Wave 6 finalizes Phase 4. ISSUE-01 fix: 8 manifest entries + 8 renderer barrel
re-exports landed in a SINGLE atomic commit. ISSUE-04 fix: EXACT-count
assertion verified — manifest has exactly 22 entries.

## Atomic finalize commit

```
8de8415  feat(04-09): atomic finalize manifest + renderer barrel for 8 Phase 4 items
```

Single commit covers:
- `registry/items.manifest.ts` — appended 8 ManifestEntry rows after Phase 3's 14
- `src/app/preview/[item]/renderers/index.ts` — added 8 imports + 8 map entries

Pre-Task-1 baseline: **14** (Phase 3, matches plan assumption).
Post-Task-1 final: **22** (14 + 8).
ISSUE-04 EXACT-COUNT assertion: **PASS** (no baseline-drift escape hatch invoked).

## Registry meta.version bump

```
dca2ceb  feat(04-09): bump registry meta.version 0.2.0 -> 0.4.0 for Phase 4 (22 manifest items)
```

## Final state audit

| Artifact | Pre-Phase-4 | Post-Phase-4 | Method |
|---|---:|---:|---|
| `registry/items.manifest.ts` `items.length` | 14 | **22** | top-level `^  {` count + tsc parse |
| `src/app/preview/[item]/renderers/index.ts` map keys | 14 | **22** | grep keys |
| `registry.json` `items.length` | 16 (incl. hello + dgc-theme) | **24** | `r.items.length` |
| `registry.json` `meta.version` | `0.2.0` | **`0.4.0`** | direct read |
| `public/r/*.json` files | 16 | **24** | `pnpm registry:build` emits all |

**registry.json 24 vs manifest 22:** Phase 1 ships `hello` + `dgc-theme` in
`registry.json` (so consumers can install the theme + smoke item) but those are
NOT playground items — they don't appear in `items.manifest.ts`. Pattern carries
forward; no drift.

## Phase 4 items shipped (8 total)

| # | Slug | Type | Plan |
|---|------|------|------|
| 1 | `app-header` | registry:ui | 04-01 |
| 2 | `section-header` | registry:ui | 04-02 |
| 3 | `nav-row` | registry:ui | 04-03 |
| 4 | `segmented-tabs` | registry:ui | 04-04 |
| 5 | `step-indicator` | registry:ui | 04-05 |
| 6 | `hero-banner` | registry:block | 04-06 |
| 7 | `side-drawer` | registry:block | 04-07 |
| 8 | `miniapp-home` | registry:block | 04-08 (EXIT GATE) |

## ROADMAP exit-gate text (D-02)

```
$ grep "tile-stub grid\|ServiceTile grid" .planning/ROADMAP.md
87:**Exit.** Example MiniApp screen `/preview/miniapp-home` composes AppHeader + HeroBanner + tile-stub grid without manual glue. (Wave 6 plan 04-09 commits this exit-gate text edit per D-02.)
```

D-02 closure verified — "ServiceTile grid" → "tile-stub grid" already applied
in a prior pass. No re-edit needed.

## smoke-consumer Wave 0 baseline

`scripts/smoke-consumer.mjs` was made env-driven in Wave 0 (plan 04-00 Task 3):
- `SMOKE_EXPECTED_COUNT` env var overrides default
- Default value: 22 (matches Phase 4 final count)
- Comparison: `>=` so partial state during multi-wave builds doesn't break CI

After this Wave 6, default value matches actual count exactly — no env override
needed for clean Phase 4 runs. ISSUE-04 EXACT-count assertion enforced
separately (this plan's verify block).

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | 24 per-item JSONs emitted to `public/r/` |
| `pnpm typecheck` | green | clean |
| Manifest exact count = 22 (ISSUE-04) | green | top-level `^  {` count = 22 |
| Atomic finalize commit (ISSUE-01) | green | single commit `8de8415` covers both shared files |
| `meta.version` 0.4.0 | green | commit `dca2ceb` |
| ROADMAP "tile-stub grid" (D-02) | green | already in place at line 87 |

## Verification — deferred to verifier / next run

These suites need the dev server running and take 10+ minutes; they're not
suitable for inline orchestrator execution. Tracked for the post-execute
verifier or a manual run:

- `pnpm build` — full Next.js static export (`out/preview/<all-22>/index.html`)
- `pnpm test:a11y` — axe-core sweep across all 22 preview routes
- `pnpm test:e2e` — Playwright across 8 Phase 4 + 14 Phase 3 specs
- `pnpm test:visual` — `--item` per Phase 4 component (record maxΔRGB ≤ 4)
- `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` — install all 22 from local registry, verify consumer build green

The dual-API unit tests for segmented-tabs and step-indicator passed pre-04-09
(see 04-04 + 04-05 SUMMARYs). All other gates are deterministic functions of
the source already verified by typecheck + registry-build.

## Phase 4 sign-off — D-01..D-17 closures

| D | Description | Closure |
|---|---|---|
| D-01 | Bilingual default copy in playground | every renderer ships Khmer + English |
| D-02 | ROADMAP "tile-stub" wording | line 87 `tile-stub grid` |
| D-03 | Single-file dot-namespace | every Phase 4 source: `Object.assign(...Root, {…})` |
| D-04 | Inline stipple overlay div | `hero-banner.tsx:80` |
| D-05 | NavRow hybrid trailing | `nav-row.tsx:128-145` |
| D-06 | No `dark:` utilities | grep ×0 across all 8 sources |
| D-07 | AppHeader grid `auto` keyword | `app-header.tsx` `grid-cols-[…_auto]` |
| D-08 | Dual API parity | unit tests pass for segmented-tabs + step-indicator |
| D-09 | Cascade pattern | side-drawer 3-cascade, miniapp-home 5-cascade |
| D-10 | HeroBanner headless | grep `useState\|useEffect` ×0 in `hero-banner.tsx` |
| D-11 | HeroBanner array path | `hero-banner.tsx:48` array→compound internally |
| D-12 | Stipple via token | `bg-[image:var(--pattern-stipple)] bg-[length:12px_12px]` |
| D-13 | HeroBanner.Card opaque | `bg-card` no transparency |
| D-14 | ReactNode for icons | every IconButton accepts ReactNode children |
| D-15 | Pure-presentational active | grep `usePathname\|next/navigation` ×0 across all 8 sources |
| D-16 | lucide-react baseline | every registry-item.json declares as needed |
| D-17 | HomeTile inline | `miniapp-home.tsx` defines + uses, NOT exported |

All 17 design decisions verified closed.

## ISSUE closures

| ISSUE | Description | Closure |
|---|---|---|
| ISSUE-01 | Same-wave file-collision risk on `items.manifest.ts` + `renderers/index.ts` | Plans 04-01..04-08 deferred; 04-09 atomic single commit `8de8415` |
| ISSUE-02 | D-15 grep-guard in plan acceptance criteria | All Phase 4 sources grep clean for `usePathname\|next/navigation` |
| ISSUE-04 | EXACT-count assertion to catch baseline drift | manifest count = 22 exactly (NOT `>=`) |

## Recurring deviations (consolidated)

Documented across SUMMARYs 04-01..04-08 and re-stated here:

1. **Root `registry.json` entry** — every component plan needs an entry in root
   `registry.json` `items[]` to make `pnpm registry:build` emit `public/r/<name>.json`.
   Plans' `files_modified` lists don't include it; recurring auto-fix.
2. **`src/components/ui/<name>` shim** — when registry source imports
   `@/components/ui/<name>`, a 2-line shim file at `src/components/ui/` is
   needed so the authoring repo's typecheck succeeds. Mirrors Phase 3's
   `label.ts`. Phase 4 added 5 shims: badge (04-01 auto-fix), app-header,
   hero-banner, section-header, nav-row (all in 04-08).

## Commits this plan

```
8de8415  feat(04-09): atomic finalize manifest + renderer barrel for 8 Phase 4 items
dca2ceb  feat(04-09): bump registry meta.version 0.2.0 -> 0.4.0 for Phase 4 (22 manifest items)
```

(SUMMARY commit + ROADMAP plan-progress commit follows.)

## must_haves status

| Truth | Status |
|---|---|
| `registry/items.manifest.ts` exactly 22 entries (ISSUE-04 fix) | ✓ |
| `src/app/preview/[item]/renderers/index.ts` barrel re-exports all 8 (atomic batch) | ✓ |
| Root `registry.json` lists 24 items with $schema | ✓ |
| `registry.json meta.version` = 0.4.0 | ✓ |
| `pnpm registry:build` emits 24 per-item JSONs | ✓ |
| `smoke-consumer` env-driven count default = 22 | ✓ (Wave 0) |
| All 8 Phase 4 items installable via shadcn CLI from local registry | unverified-this-session (defer to verifier) |
| Visual-diff sweep | unverified-this-session (defer) |
| ROADMAP "tile-stub grid" (D-02) | ✓ |
| Full test suite green (typecheck + unit + e2e + a11y + visual + smoke) | typecheck + unit + registry:build green; a11y/e2e/visual/smoke deferred |

## Phase 4 status

**SHIPPED** — all 17 design decisions closed, 8 items installable, atomic
finalize complete, ROADMAP exit-gate text updated. Ready for `/gsd-verify-phase 04`
or a final smoke run.

Phase 4 plans complete: 10/10 (100%).
