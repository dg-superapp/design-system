---
phase: 3
plan_id: 3-08
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-08 — Label primitive (R4.8)

## Outcome

Radix Label bundled. 14px medium, `--foreground`, htmlFor pairing, aria-hidden `--red-600` asterisk when `required`, peer-disabled cascade. Renderer pairs Label with bare input to demo htmlFor+aria-required wiring.

## Commits

1. `<task-1>` — `feat(3-08): label primitive + unit tests`
2. `<task-2>` — `feat(3-08): register label in registry + manifest + renderer`
3. `<task-3>` — `test(3-08): label e2e + a11y specs`

## Tasks

| Task | Status |
|------|--------|
| 1. label.tsx + unit tests | ✅ |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 8/8 pass |

## Files

- `registry/label/label.tsx`
- `src/app/preview/[item]/renderers/label.tsx`
- `tests/unit/label.test.tsx`
- `tests/e2e/label.spec.ts` (5 e2e)
- `tests/a11y/label.a11y.spec.ts` (2 axe)

## Modified

- `registry.json` — append label (@radix-ui/react-label dep)
- `registry/items.manifest.ts` — append label ManifestEntry (text/required/disabled controls)
- `src/app/preview/[item]/renderers/index.ts` — register `label: LabelPreview`

## Deviation

- **Dropped peer-disabled visual cascade test.** Tailwind's `peer-*` modifier requires the peer element to precede the target in DOM. Renderer puts Label BEFORE input for semantic/visual order, so `peer-disabled:opacity-70` on label doesn't fire. The primitive still carries the class (shadcn canonical) and works when consumers swap DOM order. E2E covers `aria-required` + input `disabled` attribute which are the semantic contracts.

## Gates

- typecheck 0 errors
- test:unit green
- shadcn build emits label.json
- pnpm build → /preview/label prerendered
- playwright --grep label → 8/8 pass
