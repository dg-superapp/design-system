---
phase: 3
plan_id: 3-11
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-11 — Tooltip primitive (R4.11)

## Outcome

Radix Tooltip bundle with DGC `--gray-900` surface (deliberate token exception per UI-SPEC §2.11 — `--popover` maps to white card, wrong for tooltip). Named exports: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow. Hover + focus open, Escape closes, Portal-rendered.

## Commits

1. `<task-1>` — `feat(3-11): tooltip primitive via Radix + DGC tokens + unit tests`
2. `<task-2>` — `feat(3-11): register tooltip + renderer`
3. `<task-3>` — `test(3-11): tooltip e2e + a11y specs`

## Tasks

| Task | Status |
|------|--------|
| 1. tooltip.tsx + unit tests | ✅ (7 unit tests) |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 6/6 pass |

## Files

- `registry/tooltip/tooltip.tsx`
- `src/app/preview/[item]/renderers/tooltip.tsx`
- `tests/unit/tooltip.test.tsx`
- `tests/e2e/tooltip.spec.ts` (4 e2e)
- `tests/a11y/tooltip.a11y.spec.ts` (2 axe)

## Modified

- `registry.json` — append tooltip (@radix-ui/react-tooltip dep)
- `registry/items.manifest.ts` — append tooltip ManifestEntry (content/side controls)
- `src/app/preview/[item]/renderers/index.ts` — register `tooltip: TooltipPreview`

## Deviation

- **Unit test Content node selector.** Radix Tooltip renders BOTH a visually-hidden announcement span (role="tooltip") AND a styled Content node; the style assertions target the latter. Initial selector `[data-state=delayed-open]` matched wrong nodes (Trigger/Root also carry data-state). Fixed by filtering `document.querySelectorAll('*')` for the element whose className contains `bg-[hsl(var(--gray-900))]` — unambiguous since only the styled Content uses this token pair.

## Gates

- typecheck 0 errors
- test:unit green (111 total)
- shadcn build emits tooltip.json
- pnpm build → /preview/tooltip prerendered
- playwright --grep tooltip → 6/6 pass
