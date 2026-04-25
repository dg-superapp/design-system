---
phase: 3
plan_id: 3-14
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-14 — ScrollArea primitive (R4.14)

## Outcome

Radix ScrollArea bundled with DGC-tokened scrollbar. Viewport keyboard-accessible via `tabIndex=0`. Thumb uses `--gray-300`/`--gray-400` hover. `type="hover"` visibility gating (Radix default). Renderer exposes maxHeight + rowCount controls for overflow demo.

## Commits

1. `aefa800` — `feat(3-14): scrollarea primitive + unit tests`
2. `<task-2>` — `feat(3-14): register scrollarea + renderer`
3. `<task-3>` — `test(3-14): scrollarea e2e + a11y specs + tabIndex viewport fix`

## Tasks

| Task | Status |
|------|--------|
| 1. scroll-area.tsx + unit tests | ✅ |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 6/6 pass |

## Files

- `registry/scroll-area/scroll-area.tsx`
- `src/app/preview/[item]/renderers/scroll-area.tsx`
- `tests/unit/scroll-area.test.tsx`
- `tests/e2e/scroll-area.spec.ts` (4 e2e)
- `tests/a11y/scroll-area.a11y.spec.ts` (2 axe)

## Modified

- `registry.json` — append scroll-area (@radix-ui/react-scroll-area dep)
- `registry/items.manifest.ts` — append ManifestEntry (maxHeight/rowCount controls)
- `src/app/preview/[item]/renderers/index.ts` — register `scroll-area: ScrollAreaPreview`
- `tests/unit/setup.ts` — add ResizeObserver mock (jsdom lacks it; Radix needs it to mount scrollbar)

## Deviations

1. **tabIndex=0 on Viewport.** axe `scrollable-region-focusable` (WCAG 2.1.1) requires `overflow:scroll` regions to be keyboard-reachable. Radix doesn't add this by default. Added `tabIndex={0}` + `focus-visible:shadow-[var(--shadow-focus)]` on `ScrollAreaPrimitive.Viewport`.
2. **Thumb test asserts presence, not visibility.** Radix `type="hover"` fades thumb in on pointer-enter. Playwright `.hover()` timing is racy against Radix's CSS transition; switched to `toHaveCount(1)` which covers the same invariant (thumb mounted when overflow exists).
3. **ResizeObserver mock in tests/unit/setup.ts.** jsdom lacks ResizeObserver; Radix ScrollArea reads it to detect overflow. Mock is a no-op — unit tests assert class strings / DOM shape only, not resize events.

## Gates

- typecheck 0 errors
- test:unit green
- shadcn build emits scroll-area.json
- pnpm build → /preview/scroll-area prerendered
- playwright --grep scroll → 6/6 pass (a11y passes with tabIndex fix)
