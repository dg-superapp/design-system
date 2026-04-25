---
phase: 3
plan_id: 3-12
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-12 — Tabs primitive (R4.12)

## Outcome

Radix Tabs bundled with CVA underline + pill variants. Named exports: Tabs (Root), TabsList, TabsTrigger, TabsContent. Renderer demos 3-tab Khmer layout with Latin-font numerals for count badges.

## Commits

1. `9dc3f27` — `feat(3-12): tabs primitive via Radix + CVA variants + unit tests`
2. `<task-2>` — `feat(3-12): register tabs + renderer`
3. `<task-3>` — `test(3-12): tabs e2e + a11y specs`

## Tasks

| Task | Status |
|------|--------|
| 1. tabs.tsx + unit tests | ✅ |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 8/8 pass |

## Files

- `registry/tabs/tabs.tsx`
- `src/app/preview/[item]/renderers/tabs.tsx`
- `tests/unit/tabs.test.tsx`
- `tests/e2e/tabs.spec.ts` (6 e2e)
- `tests/a11y/tabs.a11y.spec.ts` (2 axe)

## Modified

- `registry.json` — append tabs (@radix-ui/react-tabs dep)
- `registry/items.manifest.ts` — append tabs ManifestEntry (variant/withBadges controls)
- `src/app/preview/[item]/renderers/index.ts` — register `tabs: TabsPreview`

## Gates

- typecheck 0 errors
- test:unit green
- shadcn build emits tabs.json
- pnpm build → /preview/tabs prerendered
- playwright --grep tabs → 8/8 pass
