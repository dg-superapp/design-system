---
phase: 3
slug: primitives
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `3-RESEARCH.md` § "Validation Architecture"

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.48+ with `@axe-core/playwright`; vitest 2.x (unit); `tsc --noEmit` (type-check) |
| **Config file** | `playwright.config.ts` (to be added Wave 0); `vitest.config.ts` (Wave 0) |
| **Quick run command** | `pnpm typecheck && pnpm test:unit` (~20s) |
| **Full suite command** | `pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:e2e && pnpm test:a11y && SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` |
| **Estimated runtime** | ~4-6 min full suite; ~20s quick |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm test:unit`
- **After every plan wave:** Run full `pnpm test:e2e && pnpm test:a11y` against `pnpm build && npx serve out`
- **Before `/gsd-verify-work`:** Full suite green, including smoke consumer with all 14 items
- **Max feedback latency:** 20s on task commits

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3-00-01 | 00 | 0 | — | — | N/A | infra | `pnpm install` | ❌ W0 | ⬜ pending |
| 3-00-02 | 00 | 0 | — | — | N/A | infra | `test -f playwright.config.ts` | ❌ W0 | ⬜ pending |
| 3-00-03 | 00 | 0 | — | — | N/A | infra | `test -f vitest.config.ts` | ❌ W0 | ⬜ pending |
| 3-01-01 | 01 | 1 | R4.1 | — | Focus ring via `--shadow-focus` | e2e+a11y | `pnpm test:e2e --grep button && pnpm test:a11y --grep button` | ❌ W0 | ⬜ pending |
| 3-02-01 | 02 | 1 | R4.2 | — | `--shadow-focus`, invalid state | e2e+a11y | `pnpm test:e2e --grep input && pnpm test:a11y --grep input` | ❌ W0 | ⬜ pending |
| 3-03-01 | 03 | 1 | R4.3 | — | Same focus rules | e2e+a11y | `pnpm test:e2e --grep textarea && pnpm test:a11y --grep textarea` | ❌ W0 | ⬜ pending |
| 3-04-01 | 04 | 1 | R4.4 | — | Radix Select keyboard nav | e2e+a11y | `pnpm test:e2e --grep select && pnpm test:a11y --grep select` | ❌ W0 | ⬜ pending |
| 3-05-01 | 05 | 1 | R4.5 | — | Checkbox 20px touch-accessible | e2e+a11y | `pnpm test:e2e --grep checkbox && pnpm test:a11y --grep checkbox` | ❌ W0 | ⬜ pending |
| 3-06-01 | 06 | 1 | R4.6 | — | Radio group keyboard arrows | e2e+a11y | `pnpm test:e2e --grep radio && pnpm test:a11y --grep radio` | ❌ W0 | ⬜ pending |
| 3-07-01 | 07 | 1 | R4.7 | — | Switch 40×24 track, 44×44 touch | e2e+a11y | `pnpm test:e2e --grep switch && pnpm test:a11y --grep switch` | ❌ W0 | ⬜ pending |
| 3-08-01 | 08 | 1 | R4.8 | — | Required asterisk color | unit+e2e | `pnpm test:unit --grep label && pnpm test:e2e --grep label` | ❌ W0 | ⬜ pending |
| 3-09-01 | 09 | 2 | R4.9 | — | Zod error → `--danger` styling | e2e+a11y | `pnpm test:e2e --grep form && pnpm test:a11y --grep form` | ❌ W0 | ⬜ pending |
| 3-10-01 | 10 | 1 | R4.10 | — | 4 tones contrast | e2e+a11y | `pnpm test:e2e --grep badge && pnpm test:a11y --grep badge` | ❌ W0 | ⬜ pending |
| 3-11-01 | 11 | 1 | R4.11 | — | Tooltip ARIA role | e2e+a11y | `pnpm test:e2e --grep tooltip && pnpm test:a11y --grep tooltip` | ❌ W0 | ⬜ pending |
| 3-12-01 | 12 | 1 | R4.12 | — | Tabs arrow keyboard | e2e+a11y | `pnpm test:e2e --grep tabs && pnpm test:a11y --grep tabs` | ❌ W0 | ⬜ pending |
| 3-13-01 | 13 | 1 | R4.13 | — | Separator ARIA | unit+e2e | `pnpm test:unit --grep separator && pnpm test:e2e --grep separator` | ❌ W0 | ⬜ pending |
| 3-14-01 | 14 | 1 | R4.14 | — | ScrollArea keyboard scroll | e2e+a11y | `pnpm test:e2e --grep scroll-area && pnpm test:a11y --grep scroll-area` | ❌ W0 | ⬜ pending |
| 3-15-01 | 15 | 2 | R9.1 | — | MDX docs render per item | e2e | `pnpm test:e2e --grep docs-pages` | ❌ W0 | ⬜ pending |
| 3-15-02 | 15 | 2 | R9.4 | — | Copy-button on install command | e2e | `pnpm test:e2e --grep copy-install` | ❌ W0 | ⬜ pending |
| 3-16-01 | 16 | 2 | exit.khmer | — | `/test/khmer` renders all 14 w/o clipping | visual-diff | `pnpm test:e2e --grep khmer-clipping` | ❌ W0 | ⬜ pending |
| 3-17-01 | 17 | 3 | exit.install | — | All 14 installable via `npx shadcn add` | smoke | `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` | ❌ W0 | ⬜ pending |
| 3-17-02 | 17 | 3 | exit.a11y | — | axe passes on all 14 `/preview/[item]` routes | a11y | `pnpm test:a11y` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*All entries marked `❌ W0` — Wave 0 installs the test infrastructure listed below.*

---

## Wave 0 Requirements

- [ ] `package.json` — add devDeps: `@playwright/test`, `@axe-core/playwright`, `vitest`, `@vitest/ui`, `happy-dom`, `@testing-library/react`, `@testing-library/jest-dom`, `class-variance-authority`, `lucide-react`, `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-switch`, `@radix-ui/react-select`, `@radix-ui/react-tooltip`, `@radix-ui/react-tabs`, `@radix-ui/react-separator`, `@radix-ui/react-scroll-area`, `@radix-ui/react-label`, `@radix-ui/react-slot`, `react-hook-form`, `@hookform/resolvers`, `zod@^3`
- [ ] `playwright.config.ts` — projects: `chromium` + `mobile-chrome (Pixel 5)`, baseURL from `npx serve out` on port 3030, screenshot on failure, visual-diff enabled
- [ ] `vitest.config.ts` — happy-dom env, `@testing-library/jest-dom` globals
- [ ] `tests/e2e/` — empty dir with one smoke test `example.spec.ts` proving Playwright boots
- [ ] `tests/unit/` — empty dir with one smoke test proving vitest boots
- [ ] `tests/a11y/` — axe helper `axe.setup.ts` wiring `@axe-core/playwright` into every e2e test
- [ ] `package.json` scripts: `test:unit`, `test:e2e`, `test:a11y`, `typecheck`, `smoke:consumer` (extend existing to support `SMOKE_WITH_PRIMITIVES=1`)
- [ ] `app/preview/[item]/page.tsx` — dynamic route with `generateStaticParams` from manifest (required for `pnpm build` to enumerate routes before Playwright runs)
- [ ] `app/test/khmer/page.tsx` — single page rendering every primitive under `<html lang="km">` for clipping checks
- [ ] `registry/items.manifest.ts` — TS map of 14 entries with `{ name, docsSlug, previewMeta }` shape (per RESEARCH §7)
- [ ] `.github/workflows/deploy.yml` — add `test:a11y` gate before deploy step

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Khmer subscript rendering visual quality | constraint | Font rendering nuance (Noto Sans Khmer vs Kantumruy Pro fallback) requires human eye | Visit `/test/khmer`, confirm no glyph clipping on Tooltip/Badge/Chip with `coeng ្ក ្ខ ្គ ្ឃ` subscripts |
| Government-tone docs examples | constraint | Semantic judgment | Reviewer scans each `app/docs/components/<item>/page.mdx` usage example — no emoji, sentence case, no exclamations |
| Dark-mode perceptual contrast | constraint | Manual visual check per primitive | Toggle `.dark` on `/preview/<item>`; confirm no color-vision-deficient friendly palette regressions |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s on task commits
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
