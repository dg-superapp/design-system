---
phase: 3
plan_id: 3-13
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-13 — Separator primitive (R4.13)

## Outcome

Radix Separator wrapped with `--border` token. 1px line, horizontal default with full-width, vertical with full-height. `decorative` prop toggles role="none" vs role="separator". data-orientation attribute used for size utilities (Tailwind arbitrary `data-[orientation=*]:`).

## Commits

1. `c4d49d8` — `feat(3-13): separator primitive + unit tests`
2. `87ee54e` — `feat(3-13): register separator + renderer`
3. `<task-3>` — `test(3-13): separator e2e + a11y specs`

## Tasks

| Task | Status |
|------|--------|
| 1. separator.tsx + unit tests | ✅ |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 8/8 pass |

## Files

- `registry/separator/separator.tsx`
- `src/app/preview/[item]/renderers/separator.tsx`
- `tests/unit/separator.test.tsx`
- `tests/e2e/separator.spec.ts` (6 e2e)
- `tests/a11y/separator.a11y.spec.ts` (2 axe)

## Modified

- `registry.json` — append separator (@radix-ui/react-separator dep)
- `registry/items.manifest.ts` — append separator ManifestEntry (orientation/decorative controls)
- `src/app/preview/[item]/renderers/index.ts` — register `separator: SeparatorPreview`

## Deviation

- **aria-orientation assertion.** Radix Separator omits `aria-orientation="horizontal"` because horizontal is the ARIA default. Only `aria-orientation="vertical"` is emitted when orientation=vertical + decorative=false. Test adjusted accordingly.

## Gates

- typecheck 0 errors
- test:unit green
- shadcn build emits separator.json
- pnpm build → /preview/separator prerendered
- playwright --grep separator → 8/8 pass
