---
phase: 3
plan_id: 3-02
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-02 — Input primitive (R4.2)

## Outcome

Input primitive shipped — 48px text/date/email input with state matrix (default / hover / focus / invalid via aria-invalid / disabled), Khmer placeholder support, registry JSON, renderer, unit + e2e + a11y tests. Pairs with Label via native `htmlFor/id` (Label plan 3-08 will own the asterisk).

## Commits

1. `6bfd6bb` — `feat(3-02): input primitive with state matrix + DGC tokens + unit tests`
2. `94e9051` — `feat(3-02): register input in registry + manifest + playground renderer`
3. `3rd`     — `test(3-02): input e2e + a11y specs`

## Tasks

| Task | Status | Acceptance |
|------|--------|------------|
| 1. input.tsx + unit tests | ✅ | typecheck 0 errors; unit suite green |
| 2. registry + manifest + renderer | ✅ | `npx shadcn build` → `public/r/input.json`; `/preview/input` static-exported |
| 3. e2e + a11y tests | ✅ | `playwright --grep input` → 7/7 pass |

## Files created

- `registry/input/input.tsx` (67 lines, forwardRef, state matrix via utility classes + `aria-[invalid=true]:`)
- `src/app/preview/[item]/renderers/input.tsx` (typed state consumer)
- `tests/unit/input.test.tsx`
- `tests/e2e/input.spec.ts`
- `tests/a11y/input.a11y.spec.ts`

## Files modified

- `registry.json` — append input entry with dgc-theme registryDependency
- `registry/items.manifest.ts` — append input ManifestEntry (type variant, placeholder text, invalid/disabled/required booleans)
- `src/app/preview/[item]/renderers/index.ts` — register `input: InputPreview`

## Notable choices

- **No lang branching inside component (D-07).** Khmer date placeholder (`ថ្ងៃ/ខែ/ឆ្នាំ`) delivered via CSS `:lang(km) input[type="date"]::before` scope — not runtime JS. Caller passes `lang="km"` on a parent (playground does this via the language toggle on `playground-frame`).
- **Error state via `aria-invalid` only.** No extra `variant="error"` prop — uses the native ARIA attribute so screen readers and axe agree.
- **Disabled styling uses `--background` + `--muted-foreground`** — NOT `opacity-50` (WCAG AA contrast).
- **State matrix via Tailwind arbitrary selectors.** `hover:`, `focus-visible:`, `aria-[invalid=true]:`, `disabled:` all handled in base className — no CVA needed (Input has no variants).

## Gates

- `pnpm typecheck` — 0 errors
- `pnpm test:unit` — all pass (button + input + example)
- `npx shadcn build` — emits dgc-theme, hello, button, input
- `pnpm build` — /preview/input static-exported
- `playwright --grep input --project=chromium` — 7/7 pass (5 e2e + 2 a11y)

## What this unblocks

- **3-03 Textarea** can clone input.tsx's state-matrix pattern wholesale — only swap `<input>` → `<textarea>` + adjust min-height.
- Form plan (3-11) can wire Input + Label via react-hook-form; no changes needed to this primitive.
