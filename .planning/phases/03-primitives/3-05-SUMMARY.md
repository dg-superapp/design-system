---
phase: 3
plan_id: 3-05
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-05 — Checkbox primitive (R4.5)

## Outcome

Radix Checkbox bundled with DGC tokens. 20×20px box, brand fill when checked, inline SVG check glyph, indeterminate support, `--shadow-focus` ring on focus-visible, `--bg-disabled`/`--fg-on-disabled` on disabled. No opacity-50. 12 unit tests + 7 e2e + 2 a11y.

## Commits

1. `5722dbd` — `feat(3-05): checkbox primitive via Radix + DGC tokens + unit tests`
2. `b1fb183` — `feat(3-05): register checkbox in registry + manifest + renderer`
3. `054e9eb` — `test(3-05): checkbox e2e + a11y specs`

## Tasks

| Task | Status | Acceptance |
|------|--------|------------|
| 1. checkbox.tsx + 12 unit tests | ✅ | typecheck 0 errors; state matrix + ref + exports covered |
| 2. registry + manifest + renderer | ✅ | `npx shadcn build` → `public/r/checkbox.json`; `/preview/checkbox` static-exported |
| 3. e2e + a11y | ✅ | 9/9 pass on chromium @ localhost:3030 |

## Files created

- `registry/checkbox/checkbox.tsx` (123 lines — Radix Root + Indicator + inline Check SVG)
- `tests/unit/checkbox.test.tsx` (130 lines, 12 tests)
- `tests/e2e/checkbox.spec.ts` (106 lines, 6 e2e)
- `tests/a11y/checkbox.a11y.spec.ts` (33 lines, 2 axe passes)

## Modified

- `registry.json` — append checkbox entry (@radix-ui/react-checkbox dep)
- `registry/items.manifest.ts` — append checkbox ManifestEntry
- `src/app/preview/[item]/renderers/index.ts` — register `checkbox: CheckboxPreview`
- `src/app/preview/[item]/renderers/checkbox.tsx` — typed state consumer

## Notable choices

- **Inline SVG check glyph** — `lucide-react` pin (`^1.9.0`) unresolvable; same inline-SVG approach as Select chevron.
- **Hover border = --brand** — matches UI-SPEC §2.5 hover treatment; brand fill only flips in on `data-state="checked"`.
- **Indeterminate** — uses Radix `data-state="indeterminate"` with a horizontal-bar SVG instead of the check glyph.

## Gates

- `pnpm typecheck` — 0 errors
- `pnpm test:unit` — button + input + textarea + select + checkbox (+ example) green
- `npx shadcn build` — emits checkbox.json
- `pnpm build` — /preview/checkbox prerendered
- `playwright --grep checkbox` — 9/9 pass
