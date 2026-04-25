---
phase: 4
slug: headers-navigation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-25
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `04-RESEARCH.md §Validation Architecture` is the authoritative test mapping. This file is the executable view.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (unit), Playwright (visual-diff + a11y), shadcn CLI (smoke-consumer) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` (Phase 3 Wave 0) |
| **Quick run command** | `pnpm typecheck && pnpm test:unit` |
| **Full suite command** | `pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:a11y && SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` |
| **Estimated runtime** | ~280s (build 30s + a11y 60s + smoke ~190s for 22 items) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm test:unit`
- **After every plan wave:** Run `pnpm typecheck && pnpm test:unit && pnpm build`
- **After Wave 6 (final):** Full suite including visual-diff, a11y, smoke-consumer
- **Before `/gsd-verify-work`:** Full suite must be green; visual-diff ΔRGB ≤ 2 vs legacy specimens
- **Max feedback latency:** 30s for typecheck+unit (per-task), 280s for full suite (per-wave)

---

## Per-Task Verification Map

> Filled in by the planner per plan/task. Source mappings come from RESEARCH §Validation Architecture (R5.1–R5.7 → component test type → command).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 4-00-XX | 00 | 0 | R5 infra | — | N/A | unit | `pnpm test:unit -- registry/` | ❌ W0 | ⬜ pending |
| 4-01-XX | 01 | 1 | R5.1 | — | 44px touch target, navy contrast | a11y + visual-diff | `pnpm test:a11y -- app-header && pnpm test:visual -- app-header` | ❌ W0 | ⬜ pending |
| 4-02-XX | 02 | 1 | R5.3 | — | accent link contrast | visual-diff | `pnpm test:visual -- section-header` | ❌ W0 | ⬜ pending |
| 4-03-XX | 03 | 1 | R5.6 | — | 48px min-height, 3px stripe, ARIA chip-decorative | a11y + visual-diff | `pnpm test:a11y -- nav-row && pnpm test:visual -- nav-row` | ❌ W0 | ⬜ pending |
| 4-04-XX | 04 | 2 | R5.4 | — | Radix Tabs ARIA, accent on surface-2 contrast | a11y + visual-diff | `pnpm test:a11y -- segmented-tabs && pnpm test:visual -- segmented-tabs` | ❌ W0 | ⬜ pending |
| 4-05-XX | 05 | 2 | R5.5 | — | done/active/pending bar tokens, focus ring | a11y + visual-diff | `pnpm test:a11y -- step-indicator && pnpm test:visual -- step-indicator` | ❌ W0 | ⬜ pending |
| 4-06-XX | 06 | 3 | R5.2 | — | stipple-pattern dark+light, headless `activeIndex` controls slide | unit + visual-diff | `pnpm test:unit -- hero-banner && pnpm test:visual -- hero-banner` | ❌ W0 | ⬜ pending |
| 4-07-XX | 07 | 4 | R5.7 | — | Radix Dialog focus trap + ESC close + slide motion | a11y + visual-diff + unit | `pnpm test:a11y -- side-drawer && pnpm test:visual -- side-drawer && pnpm test:unit -- side-drawer` | ❌ W0 | ⬜ pending |
| 4-08-XX | 08 | 5 | R5 + R10 | — | Composed page renders + ARIA landmark + Khmer | a11y + visual-diff + smoke | `pnpm test:a11y -- miniapp-home && pnpm test:visual -- miniapp-home && SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` | ❌ W0 | ⬜ pending |
| 4-09-XX | 09 | 6 | R10 + smoke | — | Manifest + smoke walks 8 new items | smoke-consumer | `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

> Planner expands one row per task during plan generation; this table is the per-task summary view.

---

## Wave 0 Requirements

- [ ] `pnpm add @radix-ui/react-dialog` — only new package (RESEARCH §Wave-0)
- [ ] Append 9 tokens (`--app-header-h/icon/glyph`, `--bg-surface-2`, `--pattern-stipple` light+dark, `--drawer-overlay`, `--drawer-width`, `--ring-on-navy`, `--nav-active-stripe`, `--nav-active-bg`) to `registry/dgc-theme/theme.css` for both `.dark` and root scopes per UI-SPEC §Tokens
- [ ] Append 4 `@keyframes` to `registry/dgc-theme/theme.css` for SideDrawer slide-left motion
- [ ] `scripts/visual-diff-components.mjs` — Playwright harness with `VISUAL_DIFF_THRESHOLD=2` (UI-SPEC R10.5)
- [ ] `pnpm test:visual` script in `package.json` — wraps the new harness
- [ ] `pnpm test:a11y` script extension — covers 8 new items via existing axe-core harness
- [ ] PlaygroundShell `previewRenderers` plumbing — append per-item renderer modules under `src/app/preview/[item]/renderers/<slug>.tsx`

*If Wave 0 is skipped, all subsequent waves fail Dimension 8 — these are blocking prerequisites.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Khmer rendering on navy gradient (AppHeader title `lang="km"`) | R10.1, R5.1 | Sub-pixel font rendering varies per OS — automated diff would flake | Open `/preview/app-header` in Chrome + Firefox + Safari with `lang="km"` toggle. Verify Noto Sans Khmer characters render cleanly on `--gradient-hero` without anti-alias artifacts. |
| HeroBanner stipple-pattern visual-diff edge cases | R5.2, R10.5 | Browser GPU rasterization of radial-gradient differs across machines — keep ΔRGB ≤ 2 enforced in CI but eyeball local Chrome vs production deploy once before tagging | Compare `/preview/hero-banner` in dev vs deployed `https://registry.016910804.xyz/preview/hero-banner` once before phase verification. |
| SideDrawer focus-trap ergonomics | R10.4, R5.7 | axe-core verifies ARIA but doesn't simulate "Tab cycling stays inside drawer" UX | Open SideDrawer, Tab through 5+ focusable elements, verify focus returns to drawer trigger after Esc. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (9 tokens, 4 keyframes, Dialog dep, visual-diff harness, renderer plumbing)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s per-task, < 280s per-wave
- [ ] `nyquist_compliant: true` set in frontmatter (planner flips after final task verifies in-place)

**Approval:** pending
