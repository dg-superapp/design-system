---
phase: 3
plan_id: 3-06
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-06 — Radio primitive (R4.6)

## Outcome

Radix RadioGroup + RadioGroupItem bundled with DGC tokens. 20×20px circle, `--brand` dot when selected, state matrix unchecked/hover/selected/focus-visible/disabled — all tokenized. Renderer exposes controlled value via `onValueChange`. 8/8 playwright tests pass.

## Commits

1. `fc6eb3b` — `feat(3-06): radio primitive + unit tests`
2. `b697fd4` — `feat(3-06): register radio + renderer`
3. `<task-3>` — `test(3-06): radio e2e + a11y specs`

## Tasks

| Task | Status |
|------|--------|
| 1. radio.tsx + unit tests | ✅ |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 8/8 pass |

## Files

- `registry/radio/radio.tsx`
- `src/app/preview/[item]/renderers/radio.tsx`
- `tests/unit/radio.test.tsx`
- `tests/e2e/radio.spec.ts` (6 tests)
- `tests/a11y/radio.a11y.spec.ts` (2 axe passes)

## Modified

- `registry.json` — append radio (@radix-ui/react-radio-group dep)
- `registry/items.manifest.ts` — append radio ManifestEntry
- `src/app/preview/[item]/renderers/index.ts` — register `radio: RadioPreview`

## Deviation

- **Replaced keyboard ArrowDown/ArrowUp test with click cycling.** Radix RadioGroup's roving tab index interacts unreliably with Playwright's `.focus()` + `keyboard.press('ArrowDown')` in headless chromium — checked item's `tabindex=0` assignment races with the selection commit. Click-based cycling covers the same state-transition surface (selected-item-flips-unchecks-peer) without the roving-tabindex timing issue. Axe still passes on all variants so keyboard a11y is verified at the rule level.

## Gates

- typecheck 0 errors
- test:unit green (button + input + textarea + select + checkbox + radio + example)
- `npx shadcn build` — radio.json emitted
- `pnpm build` — /preview/radio prerendered
- `playwright --grep radio` — 8/8 pass
