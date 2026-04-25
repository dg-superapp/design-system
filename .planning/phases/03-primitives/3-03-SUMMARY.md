---
phase: 3
plan_id: 3-03
status: complete
completed: 2026-04-24
branch: phase/3-primitives
requirements: [R4.3]
---

# Plan 3-03 — Textarea primitive (R4.3)

## Outcome

Textarea primitive shipped — `min-height: 88px`, vertical-only resize, and Input-parity state matrix (default / hover / focus / aria-invalid / disabled) under DGC tokens. Khmer coeng descenders render freely via the `:lang(km)` `--leading-loose` cascade with no per-component branching. Registry JSON + manifest + preview renderer + unit + e2e + a11y tests all green.

## Commits

1. `08b4052` — `feat(3-03): textarea primitive + unit tests`
2. `993e72c` — `feat(3-03): register textarea + renderer`
3. `0677ad8` — `test(3-03): textarea e2e + a11y specs`

## Tasks

| Task | Status | Acceptance |
|------|--------|------------|
| 1. textarea.tsx + unit tests | done | typecheck 0 errors; 11 unit tests green (32/32 total) |
| 2. registry + manifest + renderer | done | `npx shadcn build` emits `public/r/textarea.json`; `/preview/textarea` static-exported |
| 3. e2e + a11y tests | done | `playwright --grep textarea` → 8/8 pass (6 e2e + 2 a11y) |

## Files created

- `registry/textarea/textarea.tsx` (62 lines; forwardRef, `min-h-[88px]`, `resize-y`, no dark: utilities)
- `src/app/preview/[item]/renderers/textarea.tsx` (typed state consumer; placeholder/rows/invalid/disabled)
- `tests/unit/textarea.test.tsx` (11 tests: dims, tokens, resize axis, aria-invalid, disabled, ref, className merge)
- `tests/e2e/textarea.spec.ts` (6 specs: min-height 88px, resize vertical, focus ring, aria-invalid border, disabled opacity, Khmer coeng)
- `tests/a11y/textarea.a11y.spec.ts` (2 specs: light + dark runAxe)

## Files modified

- `registry.json` — append textarea entry with `dgc-theme` registryDependency
- `registry/items.manifest.ts` — append textarea ManifestEntry (placeholder text, rows number 1..12, invalid/disabled booleans)
- `src/app/preview/[item]/renderers/index.ts` — register `textarea: TextareaPreview`

## Notable choices

- **Clone of Input state matrix, not abstraction.** UI-SPEC §2.3 explicitly says "same token mapping as Input (§ 2.2)". No shared base component — each primitive owns its className list. Keeps registry items installable standalone via shadcn CLI (D-19) with zero cross-component imports.
- **`py-3` instead of fixed height.** Textarea is height-variable (user resize + content growth), so vertical rhythm comes from padding, not `h-[var(--input-h)]`.
- **Khmer descender safety is theme-layer, not component-layer.** D-07 compliance — `:lang(km) { line-height: var(--leading-loose) }` cascade from dgc-theme handles coeng glyphs. The textarea's `py-3` gives enough vertical breathing room that descenders never clip inside the 88px min-box; the e2e spec asserts `scrollHeight ≤ clientHeight+1` with coeng content.
- **No `resize-both` / `resize-x`.** UI-SPEC §2.3 mandates vertical only. `resize-y` is the single resize utility; unit test asserts `.not.toContain("resize-x")` to prevent future regressions.
- **Rows control defaults to 3, clamped 1..12.** Avoids pathological playground values while still letting designers stress-test the resize behavior.
- **No CVA.** Textarea has no variants (just states via data-attributes and aria-*), matching Input's CVA-free pattern.

## Gates

- `pnpm typecheck` — 0 errors
- `pnpm test:unit` — 32/32 pass (button + input + textarea + example)
- `npx shadcn build` — emits `dgc-theme`, `hello`, `button`, `input`, `textarea`
- `pnpm build` — `/preview/textarea` static-exported (3 routes under `/preview/[item]`)
- `playwright --grep textarea --project=chromium` — 8/8 pass

## Deviations from Plan

**1. [Rule 1 - Bug] JSDOM returns string for `HTMLTextAreaElement.rows`**
- **Found during:** Task 1 unit tests (`expect(el.rows).toBe(5)` failed — received `"5"`)
- **Root cause:** JSDOM reflects the `rows` attribute as a string where WHATWG spec requires a number. `el.rows` in a real browser is a `number`; JSDOM diverges.
- **Fix:** Assert via `toHaveAttribute("rows", "5")` instead of the reflected IDL property. Semantically equivalent, jsdom-portable.
- **Files modified:** `tests/unit/textarea.test.tsx`
- **Commit:** rolled into `08b4052` before push

No other deviations — plan executed as written.

## What this unblocks

- **3-04 Select** can reuse Input's 48px state-matrix pattern for the trigger; textarea's CVA-free approach confirms we don't need variant plumbing until 3-11 Form.
- **3-11 Form** can wire Textarea + Label via react-hook-form using the same `htmlFor`/`id` + `aria-describedby` pattern the Input + Textarea renderers already demonstrate.
