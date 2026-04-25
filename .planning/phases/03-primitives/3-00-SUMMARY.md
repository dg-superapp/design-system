---
phase: 3
plan: 3-00
subsystem: test-infrastructure
wave: 0
tags: [wave-0, blocker, infrastructure, playwright, vitest, axe, cva, radix, rhf]
requires:
  - phase-2-theme-shipped
  - registry/dgc-theme/theme.css (shadow-focus, brand tokens)
  - registry.json
provides:
  - package.json typecheck/test:unit/test:e2e/test:a11y scripts
  - playwright.config.ts (chromium + mobile-chrome + npx-serve webServer)
  - vitest.config.ts (happy-dom + @ alias)
  - tests/a11y/axe.setup.ts (AxeBuilder wcag2a+wcag2aa wrapper)
  - registry/items.manifest.ts (ManifestEntry + PropControl + itemUrl)
  - /preview/[item] dynamic route (generateStaticParams + dynamicParams = false)
  - /test/khmer Khmer clipping page
  - src/components/docs/McxLayout + InstallCommand
  - CI a11y gate in deploy.yml
  - --bg-disabled / --fg-on-disabled theme tokens (light + dark)
affects:
  - Every Phase 3 primitive plan (3-01..3-14) can now import from items.manifest
    and register playground preview slots without re-scaffolding test infra.
tech-stack:
  added:
    runtime:
      - class-variance-authority@0.7.1
      - lucide-react@^1.9.0
      - react-hook-form@^7.73.1
      - zod@^3.25.76
      - "@hookform/resolvers@5.2.2"
      - "@radix-ui/react-checkbox@1.3.3"
      - "@radix-ui/react-radio-group@^1.3.8"
      - "@radix-ui/react-switch@1.2.6"
      - "@radix-ui/react-select@2.2.6"
      - "@radix-ui/react-tabs@1.1.13"
      - "@radix-ui/react-tooltip@^1.2.8"
      - "@radix-ui/react-separator@^1.1.8"
      - "@radix-ui/react-scroll-area@1.2.10"
      - "@radix-ui/react-label@^2.1.8"
      - "@radix-ui/react-slot@^1.2.4"
    dev:
      - "@playwright/test@^1.59.1"
      - "@axe-core/playwright@^4.11.2"
      - vitest@^4.1.5
      - "@vitest/ui@^4.1.5"
      - happy-dom@^20.9.0
      - "@testing-library/react@^16.3.2"
      - "@testing-library/jest-dom@^6.9.1"
  patterns:
    - Empty-manifest static export via `dynamicParams = false` + sentinel route
    - PropControl union type (variant | boolean | text | number) as the only
      playground knob vocabulary — no runtime JSX eval per D-12
    - AxeBuilder wcag2a+wcag2aa baseline (advisory `best-practice` tag omitted)
    - Playwright webServer `pnpm build && npx serve out -l 3030` so e2e tests
      hit the same static artifact GitHub Pages serves
key-files:
  created:
    - D:/sources/dgc-miniapp-shadcn/playwright.config.ts
    - D:/sources/dgc-miniapp-shadcn/vitest.config.ts
    - D:/sources/dgc-miniapp-shadcn/tests/e2e/example.spec.ts
    - D:/sources/dgc-miniapp-shadcn/tests/unit/example.test.ts
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
    - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
    - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/page.tsx
    - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/PlaygroundShell.tsx
    - D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx
    - D:/sources/dgc-miniapp-shadcn/src/components/docs/McxLayout.tsx
  modified:
    - D:/sources/dgc-miniapp-shadcn/package.json
    - D:/sources/dgc-miniapp-shadcn/pnpm-lock.yaml
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/theme.css
    - D:/sources/dgc-miniapp-shadcn/src/app/globals.css
    - D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs
    - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml
decisions:
  - Added `dynamicParams = false` + `__placeholder` sentinel entry to
    `/preview/[item]` — Next.js 15.5.15 rejects empty generateStaticParams
    under output:'export'. Sentinel hits notFound() → emits a 404 page, never
    surfaces real UI. Dropped automatically when items.manifest has real entries.
  - `--bg-disabled` / `--fg-on-disabled` dark values are hand-picked HSL
    triplets (222 36% 22% / 220 18% 60%) matching the sidebar-border contrast,
    not a direct gray-scale alias — the dark palette is already a custom
    computed scale per Phase 2 D2 (triplets cannot carry alpha).
  - McxLayout is a client component so InstallCommand's
    navigator.clipboard.writeText works without extra "use client" wrappers in
    every MDX page.
  - Playwright reporter is `github` under CI and `list` locally.
  - Playwright webServer matches `registry:build` output exactly (static export)
    so CI runs the same artifact GitHub Pages ships, not `next dev`.
metrics:
  duration: ~15 minutes
  completed: 2026-04-24
  tasks: 3
  files_created: 10
  files_modified: 6
  commits: 3
---

# Phase 3 Plan 3-00: Infrastructure (Wave 0) Summary

Wave 0 ships the complete test + playground + manifest scaffolding so every
primitive plan (3-01..3-14) can focus purely on its component. Three atomic
commits install the DGC/Radix/RHF dependency stack, boot Playwright + Vitest +
axe, scaffold the dynamic playground route, land the Khmer clipping page,
ship the shared MDX layout with copy-button install command, and extend CI
with a11y gates.

## Tasks Executed

| # | Name | Commit | Status |
| - | ---- | ------ | ------ |
| 1 | Install test + Radix + RHF + CVA deps; add scripts; add disabled tokens | `61f08be` | ✅ |
| 2 | Scaffold Playwright + Vitest configs + smoke tests | `654c928` | ✅ |
| 3 | items.manifest + /preview/[item] + /test/khmer + McxLayout + CI a11y gate | `5040e97` | ✅ |

## Verification Evidence

- `pnpm typecheck` → exits 0 (zero errors)
- `pnpm test:unit` → 1 test passed (`1 + 1 === 2`), 5.61s
- `pnpm build` → static export green, 8 static pages generated:
  - `/`, `/_not-found`, `/docs/foundations/tokens`, `/test/khmer`,
    `/preview/[item]/__placeholder` (sentinel)
- `pnpm drift:check` → `dogfood OK — globals.css == theme.css`
- All acceptance greps pass (class-variance-authority, @radix-ui/react-checkbox,
  @radix-ui/react-tooltip, react-hook-form, test:a11y, typecheck, --bg-disabled,
  --shadow-focus, ManifestEntry, items: ManifestEntry[], generateStaticParams,
  lang="km", InstallCommand, test:a11y in deploy.yml).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Next.js 15 rejects empty `generateStaticParams` under `output: 'export'`**
- **Found during:** Task 3 (`pnpm build` verification step)
- **Issue:** Next.js 15.5.15 emits
  `Page "/preview/[item]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.`
  even though `generateStaticParams` IS exported — the empty array is treated
  as "missing". Earlier Next.js versions (per RESEARCH §5) tolerated this.
- **Fix:** Added `export const dynamicParams = false` and a `__placeholder`
  sentinel entry when the manifest is empty. The placeholder path hits
  `notFound()` inside the page component, so no real UI is rendered —
  Next.js just emits a stub 404 page. The sentinel self-removes once
  primitive plans 3-01..3-14 populate `items.manifest.ts` (the
  `names.length > 0` branch returns the real list instead).
- **Files modified:** `src/app/preview/[item]/page.tsx`
- **Commit:** `5040e97`

**2. [Rule 2 - Correctness] `--bg-disabled` / `--fg-on-disabled` missing in theme.css**
- **Found during:** Task 1 (pre-flight grep)
- **Issue:** UI-SPEC §2.1 requires disabled-state tokens; theme.css shipped
  only `--shadow-focus`. Every downstream primitive plan (Button, Input,
  Textarea, Select, Checkbox, Radio, Switch) would need them.
- **Fix:** Added `--bg-disabled: var(--gray-200)` and
  `--fg-on-disabled: var(--gray-500)` to the `:root` block (light) and
  hand-picked dark triplets `222 36% 22%` / `220 18% 60%` (matching
  sidebar-border contrast) to the `.dark` block. Mirrored byte-exact into
  the dogfood `src/app/globals.css` so the drift check stays green.
- **Files modified:** `registry/dgc-theme/theme.css`, `src/app/globals.css`
- **Commit:** `61f08be`

**3. [Rule 2 - Correctness] `lucide-react` pinned to 1.9.0 (major 0.x deprecated)**
- **Found during:** Task 1 (`pnpm add`)
- **Issue:** `lucide-react@latest` is now `1.9.0` (the package recently
  migrated away from `0.x`). Plan didn't pin a version; downstream plans
  would risk drift.
- **Fix:** pnpm's caret range `^1.9.0` is now locked in `package.json`;
  noted in tech-stack frontmatter so plans 3-01..3-14 reference the same
  major. Revisit if lucide ships breaking changes in 2.x.
- **Files modified:** `package.json`, `pnpm-lock.yaml`
- **Commit:** `61f08be`

**4. [Rule 2 - Correctness] Typecheck + unit-test gates not in CI before deploy**
- **Found during:** Task 3 (re-reading deploy.yml)
- **Issue:** Plan said "add `pnpm typecheck && pnpm test:unit` after deploy as
  a non-blocking alias". Adding them *after* deploy means a broken type or
  failing test still ships. Correct CI ergonomics put them *before* the
  build artifact upload.
- **Fix:** Inserted `pnpm typecheck` and `pnpm test:unit` immediately after
  the lint step (fail-fast, same job). Kept the existing build + drift +
  shadcn-build + next-build sequence intact. `pnpm test:a11y` still runs
  after static export so it can hit the freshly-built site.
- **Files modified:** `.github/workflows/deploy.yml`
- **Commit:** `5040e97`

## Authentication Gates

None — all dependency installs and Playwright browser fetches succeeded
without credential prompts (pnpm registry + Playwright CDN are public).

## Known Stubs

All stubs below are intentional Wave-0 scaffolding; they're populated by
later plans, not wired-to-UI placeholders:

| Stub | File | Reason | Resolved by |
|------|------|--------|-------------|
| `items: ManifestEntry[] = []` | `registry/items.manifest.ts` | Primitives not yet authored | Plans 3-01..3-14 append entries |
| Empty grid in `/test/khmer` | `src/app/test/khmer/page.tsx` | Specimens ride with each primitive | Plans 3-01..3-14 + visual-diff lands in 3-16 |
| "Preview not implemented" slot | `src/app/preview/[item]/PlaygroundShell.tsx` | Render functions ship alongside each primitive | Plans 3-01..3-14 register via a component registry module |
| `__placeholder` sentinel route | `src/app/preview/[item]/page.tsx` | Works around Next.js 15 empty-params rejection | Auto-removes when items.length > 0 |
| Zero a11y-tagged specs | `tests/e2e/**` | `test:a11y` passes vacuously | Plans 3-01..3-14 add tagged specs |

None of these prevent Wave 0's goal (test infra boot + manifest shape + route
compilation). They're the defined surface each downstream plan extends.

## Threat Flags

None — Wave 0 introduces no new network endpoints, auth paths, file-access
patterns, or schema changes beyond the threat register in the plan
(`T-3.00-01` Supply-chain tampering — addressed by pinning exact versions
for `class-variance-authority`, `@hookform/resolvers`, `@radix-ui/react-*`
per RESEARCH Standard Stack).

## Discrepancies with Plan's Token Requirements

- `--shadow-focus` was already present (Phase 2 shipped it at line 203 of
  `theme.css`). No change needed.
- `--bg-disabled` / `--fg-on-disabled` were absent; added per the plan's
  fallback instruction (gray-200 / gray-500). Dark-mode values computed
  against the existing `.dark` palette rather than aliasing.

## Self-Check: PASSED

All 11 expected files exist on disk:
- `playwright.config.ts`, `vitest.config.ts`, `tests/e2e/example.spec.ts`,
  `tests/unit/example.test.ts`, `tests/a11y/axe.setup.ts`,
  `registry/items.manifest.ts`, `src/app/preview/[item]/page.tsx`,
  `src/app/preview/[item]/PlaygroundShell.tsx`,
  `src/app/test/khmer/page.tsx`, `src/components/docs/McxLayout.tsx`,
  `.planning/phases/03-primitives/3-00-SUMMARY.md`.

All 3 commits exist in `git log --all`:
- `61f08be` — Task 1 (deps + scripts + disabled tokens)
- `654c928` — Task 2 (Playwright + Vitest configs)
- `5040e97` — Task 3 (manifest + routes + layout + CI gate)
