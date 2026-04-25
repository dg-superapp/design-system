---
phase: 04-headers-navigation
plan: "00"
subsystem: infrastructure
tags: [tokens, css, visual-diff, playwright, smoke-test, radix-dialog]
dependency_graph:
  requires: []
  provides:
    - "@radix-ui/react-dialog dep at ^1.1.15"
    - "9 Phase 4 CSS tokens in dgc-theme/theme.css (light + dark)"
    - "4 drawer/overlay @keyframes in dgc-theme/theme.css"
    - "scripts/visual-diff-components.mjs harness (ΔRGB ≤ 2)"
    - "pnpm test:visual script"
    - "env-driven SMOKE_EXPECTED_COUNT in smoke-consumer.mjs"
  affects:
    - "All Phase 4 component plans (04-01..04-08) consume these tokens"
    - "CI smoke gate now accepts partial manifest via >= semantics"
tech_stack:
  added:
    - "@radix-ui/react-dialog@^1.1.15"
    - "pngjs@^7.0.0 (devDependency, used by visual-diff harness)"
  patterns:
    - "Playwright chromium screenshot + pngjs per-pixel ΔRGB diff"
    - "HSL channel triplet convention (Phase 2 D2) for dark color tokens"
    - "Env-driven assertion with >= semantics (Pitfall 7 option 2)"
key_files:
  created:
    - scripts/visual-diff-components.mjs
  modified:
    - package.json
    - pnpm-lock.yaml
    - registry/dgc-theme/theme.css
    - scripts/smoke-consumer.mjs
decisions:
  - "pngjs installed as devDependency (not in plan) — required by visual-diff harness; Rule 3 auto-fix"
  - "Resolved @radix-ui/react-dialog at ^1.1.15 (matches 1.1.x train per RESEARCH)"
  - "smoke-consumer uses >= semantics so Phase 4 partial builds don't break CI"
metrics:
  duration: "~12 minutes"
  completed: "2026-04-25"
  tasks_completed: 3
  files_modified: 5
  files_created: 1
---

# Phase 4 Plan 00: Wave 0 Infrastructure Summary

Wave 0 infrastructure for Phase 4 — installs `@radix-ui/react-dialog`, appends 9 CSS tokens + 4 keyframes to dgc-theme, scaffolds the per-item ΔRGB visual-diff harness, and makes smoke-consumer's primitive count env-driven with `>=` semantics.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Install @radix-ui/react-dialog + test:visual script | `9afcc20` | package.json, pnpm-lock.yaml |
| 2 | Append 9 tokens + 4 keyframes to dgc-theme/theme.css | `323176a` | registry/dgc-theme/theme.css |
| 3 | Scaffold visual-diff-components.mjs + env-driven smoke count | `eeb8e0c` | scripts/visual-diff-components.mjs, scripts/smoke-consumer.mjs, package.json, pnpm-lock.yaml |

## Resolved Radix Dialog Version

`pnpm view @radix-ui/react-dialog version` returned `1.1.15`. Installed as `^1.1.15` — matches the `1.1.x` train already used by `@radix-ui/react-tabs@1.1.13`.

## Tokens Appended (9 tokens, both light + dark scopes)

| Token | Light value | Dark value |
|-------|-------------|------------|
| `--app-header-h` | `56px` | `56px` |
| `--app-header-icon` | `44px` | `44px` |
| `--app-header-glyph` | `22px` | `22px` |
| `--bg-surface-2` | `var(--gray-100)` | `224 41% 18%` (HSL triplet) |
| `--pattern-stipple` | `radial-gradient(... / 0.18 ...)` | `radial-gradient(... / 0.10 ...)` |
| `--drawer-overlay` | `hsl(0 0% 0% / 0.50)` | `hsl(0 0% 0% / 0.65)` |
| `--drawer-width` | `min(82vw, 340px)` | `min(82vw, 340px)` |
| `--ring-on-navy` | `0 0 0 3px hsl(0 0% 100% / 0.55)` | `0 0 0 3px hsl(0 0% 100% / 0.65)` |
| `--nav-active-stripe` | `3px` | `3px` |
| `--nav-active-bg` | `var(--blue-050)` | `221 46% 19%` (HSL triplet) |

Note: `--bg-surface-2` (dark) and `--nav-active-bg` (dark) ship as bare HSL triplets per Phase 2 D2 convention.

## Keyframes Appended (4, outside any @layer)

- `drawer-slide-in` — translateX(-100%) → translateX(0)
- `drawer-slide-out` — translateX(0) → translateX(-100%)
- `overlay-fade-in` — opacity 0 → 1
- `overlay-fade-out` — opacity 1 → 0

## Visual-Diff Harness Behavior

`node scripts/visual-diff-components.mjs --item hello` exits 0 with:
```
[SKIP] no legacy specimen for hello (looked at D:/sources/dgc-miniapp-design-system/project/preview/hello.html)
```

`node scripts/visual-diff-components.mjs` (no flag) exits 2 with `--item <slug> required`.

ΔRGB threshold defaults to 2 (`VISUAL_DIFF_THRESHOLD` env overrides). Diff images written to `tests/visual/__diff__/<item>.png` on failure.

## Smoke-Consumer Assertion Change

**Before (Phase 3 hard-coded):**
```js
if (names.length !== 14) {
  die(`SMOKE_WITH_PRIMITIVES=1 expected 14 primitives in manifest, found ${names.length}: ...`);
}
```

**After (env-driven, Phase 4 Pitfall 7 option 2):**
```js
const expected = Number(process.env.SMOKE_EXPECTED_COUNT ?? 22);
if (names.length < expected) {
  die(`SMOKE_WITH_PRIMITIVES=1 expected at least ${expected} primitives in manifest, found ${names.length}: ...`);
}
```

CI must export `SMOKE_EXPECTED_COUNT=14` during Phase 4 build until all 22 manifest entries land. After Wave 6, drop the env var.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocker] pngjs not installed**
- **Found during:** Task 3
- **Issue:** `pngjs` is a runtime dependency of `visual-diff-components.mjs` but was not listed in the plan's install step
- **Fix:** `pnpm add -D pngjs` before creating the script
- **Files modified:** package.json, pnpm-lock.yaml
- **Commit:** `eeb8e0c` (bundled with Task 3)

No other deviations — plan executed as written.

## Verification Results

- `pnpm typecheck` — passed (0 errors)
- `pnpm test:unit` — 15 files, 146 tests passed
- `pnpm test:visual -- --item hello` — exits 0, `[SKIP]` log correct
- `pnpm registry:build` — green, token present in `public/r/dgc-theme.json`
- `pnpm install --frozen-lockfile` — exits 0

## Self-Check: PASSED

- `scripts/visual-diff-components.mjs` — FOUND
- `registry/dgc-theme/theme.css` — FOUND (tokens + keyframes verified)
- `scripts/smoke-consumer.mjs` — FOUND (SMOKE_EXPECTED_COUNT present)
- Commits `9afcc20`, `323176a`, `eeb8e0c` — all present on main
