---
phase: 3
plan_id: 3-15
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-15 — Docs pages (R9.1 + R9.4)

## Outcome

14 MDX docs pages at `/docs/components/<item>/`, shared `CopyInstallButton`, docs layout, and end-to-end spec. Every page: install command, props table, usage examples (Khmer + English), link to `/preview/<item>`. Form page includes client-validation-only callout (T-3.09-02).

## Commits

1. `d5c55a7` — `feat(3-15): shared CopyInstallButton + docs/components layout`
2. `b7e8ee5` — `feat(3-15): MDX docs pages for button, input, textarea, select (batch 1)`
3. `5f18521` — `feat(3-15): MDX docs pages for checkbox, radio, switch, label (batch 2)`
4. `<batch-3>` — `feat(3-15): MDX docs pages for form, badge, tooltip, tabs, separator, scroll-area (batch 3)`
5. `<test>` — `test(3-15): docs-pages e2e spec`

## Tasks

| Task | Status |
|------|--------|
| 1. CopyInstallButton + layout | ✅ |
| 2. Batch 1 docs (button/input/textarea/select) | ✅ |
| 3. Batch 2 docs (checkbox/radio/switch/label) | ✅ |
| 4. Batch 3 docs (form/badge/tooltip/tabs/separator/scroll-area) | ✅ |
| 5. docs-pages e2e (16 tests) | ✅ 16/16 pass |

## Files created

- `src/components/docs/CopyInstallButton.tsx`
- `src/app/docs/components/layout.tsx`
- `src/app/docs/components/<item>/page.mdx` × 14
- `tests/e2e/docs-pages.spec.ts`

## Gates

- typecheck 0 errors
- pnpm build — all 14 /docs/components/* prerendered
- playwright --grep docs → 16/16 pass

## Notes

- Gov tone respected — no emoji, sentence case, no exclamations.
- Form page includes bilingual (English + Khmer) client-validation-only security callout per T-3.09-02.
- Every page links back to its `/preview/<item>` playground route.
