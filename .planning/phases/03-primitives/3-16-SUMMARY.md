---
phase: 3
plan_id: 3-16
status: complete
completed: 2026-04-24
branch: phase/3-primitives
human_reviewed: true
---

# Plan 3-16 — Khmer clipping visual-diff (D-17)

## Outcome

`/test/khmer` page renders all 14 primitives under `<div lang="km">`, showcasing authentic Khmer government-tone strings with coeng subscripts (្ក ្ខ ្គ ្ឃ). Playwright full-page screenshot baseline committed. CI will fail on Khmer descender/coeng regression.

## Commits

1. `2979aef` — `feat(3-16): populate /test/khmer with all 14 primitives`
2. `<task-2>` — `test(3-16): khmer clipping visual-diff spec + baseline (human-reviewed)`

## Tasks

| Task | Status |
|------|--------|
| 1. /test/khmer harness (14 primitives, lang=km) | ✅ |
| 2. Playwright visual-diff spec + baseline (human-approved) | ✅ |

## Files

- `src/app/test/khmer/page.tsx` — 492 lines, all 14 primitives under lang=km, tooltip forced open
- `tests/e2e/khmer-clipping.spec.ts` — full-page screenshot, threshold 0.15, maxDiffPixelRatio 0.05
- `tests/e2e/khmer-clipping.spec.ts-snapshots/khmer-test-page-chromium-win32.png` — baseline ground truth

## Human review

Baseline PNG inspected for:
- Coeng subscript fidelity (្ក ្ខ ្គ ្ឃ) — all render without clipping
- Descender spacing under --leading-loose
- Tooltip dark surface visible + readable
- ScrollArea list rows don't crop diacritics
- Bilingual primitives show Khmer cleanly

Human approved baseline on 2026-04-24.

## Gates

- typecheck 0 errors
- pnpm build — /test/khmer prerendered
- playwright --grep khmer — 4/4 pass (baseline test + 3 inline lang-km tests)
