---
phase: 3
plan_id: 3-04
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-04 — Select primitive (R4.4)

## Outcome

Radix Select bundled with DGC tokens. 5 named exports (Select, SelectTrigger, SelectValue, SelectContent, SelectItem). 48px trigger, Input-parity state matrix, `--blue-050` selected/hover item bg, `--shadow-focus` ring on trigger. Playground controls: placeholder/invalid/disabled. All gates green.

## Commits

1. `781dbbf` — `feat(3-04): select primitive via Radix + DGC tokens + unit tests`
2. `4b63233` — `feat(3-04): register select in registry + manifest + renderer`
3. `<task-3>` — `test(3-04): select e2e + a11y specs`

## Tasks

| Task | Status | Acceptance |
|------|--------|------------|
| 1. select.tsx + unit tests | ✅ | typecheck 0 errors; unit suite green |
| 2. registry + manifest + renderer | ✅ | `npx shadcn build` → `public/r/select.json`; `/preview/select` static-exported |
| 3. e2e + a11y tests | ✅ | `playwright --grep select` → 9/9 pass |

## Files

- `registry/select/select.tsx` — 5 Radix wrappers with DGC token styling
- `src/app/preview/[item]/renderers/select.tsx` — playground scaffold with label + error message
- `tests/unit/select.test.tsx`
- `tests/e2e/select.spec.ts` — 7 tests
- `tests/a11y/select.a11y.spec.ts` — 2 tests (light + dark)

## Modified

- `registry.json` — append select entry (@radix-ui/react-select dep)
- `registry/items.manifest.ts` — append select ManifestEntry
- `src/app/preview/[item]/renderers/index.ts` — register `select: SelectPreview`

## Notable choices

- **Trigger exposed via forwardRef** so Form (3-09) can attach RHF `field.ref`.
- **`aria-invalid` over `variant="error"`** — native ARIA flips border to `--danger` through utility class `aria-[invalid=true]:border-[hsl(var(--danger))]`.
- **ChevronDown icon** — used inline SVG instead of `lucide-react` because the lucide pin (`^1.9.0`) is wrong (see 3-01 SUMMARY known-issue). Scoped to trigger only.
- **`--blue-050` selected-item bg** — matches UI-SPEC §2.4 playground example, consistent with secondary Button variant.

## Gates

- `pnpm typecheck` — 0 errors
- `pnpm test:unit` — all pass (button + input + textarea + select + example)
- `npx shadcn build` — emits dgc-theme, hello, button, input, textarea, select
- `pnpm build` — `/preview/select` prerendered
- `playwright --grep select --project=chromium` — 9/9 pass (7 e2e + 2 a11y)

## What this unblocks

- **Radix bundling pattern proven** — 3-05 (Checkbox), 3-06 (Radio), 3-07 (Switch), 3-11 (Tooltip), 3-12 (Tabs) all follow the same Radix-as-named-exports + DGC-token pattern.
- **Inline-SVG fallback pattern proven** — subsequent plans that want icons can use inline SVG until `lucide-react` is repinned.
