---
phase: 3
plan_id: 3-01
status: complete
completed: 2026-04-24
branch: phase/3-primitives
commits:
  - fbcf589
  - 2nd (registry + manifest + renderer)
  - 3rd (e2e + a11y)
---

# Plan 3-01 — Button primitive (R4.1)

## Outcome

Button primitive shipped. 4 variants × 2 sizes, CVA-driven, DGC-tokened, asChild Slot support. Playground at `/preview/button` operates all prop controls. Shadcn build emits `public/r/button.json`. All gates green (typecheck, 10 unit tests, 7 Playwright e2e+a11y tests).

## Commits

1. `fbcf589` — `feat(3-01): button primitive with CVA variants + DGC tokens + unit tests`
2. Task 2 commit — registry.json + items.manifest + renderer registry + PlaygroundShell dispatch
3. Task 3 commit — e2e + a11y specs + playwright testIgnore config

## Tasks

| Task | Status | Acceptance |
|------|--------|------------|
| 1. button.tsx + unit tests | ✅ | typecheck 0 errors; 9/9 button tests + 1 example test = 10/10 pass |
| 2. registry + manifest + renderer | ✅ | `npx shadcn build` emits `public/r/button.json`; `pnpm build` static-exports `/preview/button` |
| 3. e2e + a11y tests | ✅ | `playwright test --grep button` → 7/7 pass (5 e2e + 2 axe) |

## Files created

- `registry/button/button.tsx` (111 lines, CVA variants, Slot, forwardRef)
- `tests/unit/button.test.tsx` (9 tests)
- `tests/unit/setup.ts` (jest-dom/vitest import)
- `src/app/preview/[item]/renderers/button.tsx` (typed prop-state consumer)
- `src/app/preview/[item]/renderers/index.ts` (static renderer registry)
- `tests/e2e/button.spec.ts` (5 tests)
- `tests/a11y/button.a11y.spec.ts` (2 tests)

## Files modified

- `registry.json` — append button entry with `dgc-theme.json` registryDependency
- `registry/items.manifest.ts` — append button ManifestEntry with 5 controls (variant, size, disabled, loading, label=`ចុចនៅទីនេះ`)
- `src/app/preview/[item]/PlaygroundShell.tsx` — dispatch via `previewRenderers[entry.name]`, fallback placeholder preserved
- `vitest.config.ts` — add `@vitejs/plugin-react` plugin; move setup to `tests/unit/setup.ts`
- `playwright.config.ts` — `testIgnore: ['tests/unit/**']` to prevent Playwright loading vitest specs
- `package.json` + `pnpm-lock.yaml` — add `@vitejs/plugin-react` dev dep

## Deviations

1. **Vitest v4 TSX loader** — `@testing-library/react` tests needed `@vitejs/plugin-react` plugin. Plan 3-00 installed deps but did not pin this plugin. Added as devDep in this plan. Also required moving setup from raw `@testing-library/jest-dom` import to a local `tests/unit/setup.ts` that imports `@testing-library/jest-dom/vitest` — the vitest entry is what extends `expect` types so TypeScript picks up `toBeInTheDocument` / `toBeDisabled` / `toHaveAttribute`.

2. **Playwright `testIgnore`** — plan 3-00's playwright config set `testDir: 'tests'` without an ignore list. Playwright's test runner walked into `tests/unit/**` and failed to import vitest (CommonJS/ESM mismatch). Added `testIgnore: ['tests/unit/**']`. Non-breaking for plan 3-00's own smoke spec.

3. **asChild + loading interaction** — when `asChild: true`, Slot requires exactly one React child. Rendering `<>{spinner}{children}</>` breaks it. Resolution: when `asChild`, skip spinner and pass children through unchanged. Documented in component body. Loading with a custom trigger (e.g. `<a>`) is a caller responsibility.

4. **`aria-disabled` hook on utility classes** — added `aria-disabled:pointer-events-none aria-disabled:bg-[hsl(var(--bg-disabled))] aria-disabled:text-[hsl(var(--fg-on-disabled))]` in base so `loading` (which sets `aria-disabled` but leaves `disabled` attribute off when asChild) still visually disables. Not required by UI-SPEC; defensive.

## Known-issue carryover from 3-00

- `lucide-react` pinned `^1.9.0` in package.json. Current upstream major is `0.544.x`; `1.9.0` does not resolve to a real release. `button.tsx` does not import from it so this plan is unaffected, but the pin should be corrected before any primitive that uses icon slots (3-06 Select, 3-11 Form, 3-12 Tabs, etc.). Recommended: change to `^0.544.0` when those plans start, or right now as a cleanup.

## Gate status

- `pnpm typecheck` — 0 errors
- `pnpm test:unit` — 10/10 pass (button 9 + example 1), 622ms
- `npx shadcn build` — emits `dgc-theme`, `hello`, `button`
- `pnpm build` — static export succeeds, `/preview/button` prerendered
- `playwright test --grep button` — 7/7 pass

## What this unblocks

- Pattern for all Wave 1 primitives: CVA + Radix + DGC tokens + renderer registry slot.
- Renderer registry (`src/app/preview/[item]/renderers/index.ts`) is now the append target for 3-02..3-14.
- Vitest TSX + jest-dom types path proven; subsequent plans just write `*.test.tsx` and go.

## Acceptance criteria — plan verification

- [x] `grep "cva(" registry/button/button.tsx` — present
- [x] `grep "ghost-danger" registry/button/button.tsx` — present
- [x] `grep "var(--shadow-focus)" registry/button/button.tsx` — present (focus-visible)
- [x] `grep "var(--bg-disabled)" registry/button/button.tsx` — present
- [x] `grep "var(--brand)" registry/button/button.tsx` — present
- [x] `grep "dark:" registry/button/button.tsx` — NOT present (D-06)
- [x] `grep "opacity-50" registry/button/button.tsx` — NOT present (R4.1)
- [x] `grep "asChild" registry/button/button.tsx` — present
- [x] `registry.json` contains `"name": "button"` and `dgc-theme.json` registryDependency
- [x] `registry/items.manifest.ts` contains `name: 'button'`
- [x] `src/app/preview/[item]/renderers/button.tsx` exists
- [x] `npx shadcn build` produces `public/r/button.json`
- [x] `tests/e2e/button.spec.ts` exists, mentions `/preview/button`
- [x] `tests/a11y/button.a11y.spec.ts` uses `runAxe`
