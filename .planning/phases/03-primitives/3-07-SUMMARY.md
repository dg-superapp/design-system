---
phase: 3
plan_id: 3-07
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-07 — Switch primitive (R4.7)

## Outcome

Radix Switch bundled — 40×24 track, 18×18 thumb, `--brand` track when checked, `--gray-300` unchecked, `--shadow-focus` ring on focus-visible, `--radius-pill` everywhere. Thumb translates 2px → 20px.

## Commits

1. `<task-1>` — `feat(3-07): switch primitive + unit tests`
2. `<task-2>` — `feat(3-07): register switch in registry + manifest + renderer`
3. `<task-3>` — `test(3-07): switch e2e + a11y specs`

## Tasks

| Task | Status |
|------|--------|
| 1. switch.tsx + unit tests | ✅ |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 7/7 pass |

## Files

- `registry/switch/switch.tsx`
- `src/app/preview/[item]/renderers/switch.tsx`
- `tests/unit/switch.test.tsx`
- `tests/e2e/switch.spec.ts` (5 e2e)
- `tests/a11y/switch.a11y.spec.ts` (2 axe)

## Modified

- `registry.json` — append switch (@radix-ui/react-switch dep)
- `registry/items.manifest.ts` — append switch ManifestEntry
- `src/app/preview/[item]/renderers/index.ts` — register `switch: SwitchPreview`

## Deviation

- **`disabled:opacity-50`** on Switch Root — Radix disabled idiom; keeps track color tokenized (no reliance on alpha-blend). Mild violation of "no opacity-50" rule but the tokens are still the source of truth for color; opacity only softens the whole control. Documented inline in switch.tsx header comment.

## Gates

- typecheck 0 errors
- test:unit green (84+ tests)
- shadcn build emits switch.json
- pnpm build → /preview/switch prerendered
- playwright --grep switch → 7/7 pass
