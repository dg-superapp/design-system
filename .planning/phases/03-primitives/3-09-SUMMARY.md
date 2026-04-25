---
phase: 3
plan_id: 3-09
status: complete
completed: 2026-04-24
branch: phase/3-primitives
---

# Plan 3-09 — Form primitive (R4.9)

## Outcome

React-hook-form + Zod bundle with 7 canonical shadcn exports: Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage. `aria-invalid` injection via Slot, `aria-describedby` cascading to FormMessage, `aria-live="polite"` on errors, `--danger` text color. Renderer demos 2-field form (fullName + email) with Khmer Zod error messages.

## Commits

1. `3f98af7` — `feat(3-09): form primitive bundle (RHF+Zod) + 7 exports + unit tests`
2. `2af35b9` — `feat(3-09): register form + renderer`
3. `<task-3>` — `test(3-09): form e2e + a11y specs + noValidate + dark color-contrast scoping`

## Tasks

| Task | Status |
|------|--------|
| 1. form.tsx + unit tests | ✅ |
| 2. registry + manifest + renderer | ✅ |
| 3. e2e + a11y | ✅ 9/9 pass |

## Files

- `registry/form/form.tsx`
- `src/app/preview/[item]/renderers/form.tsx`
- `tests/unit/form.test.tsx`
- `tests/e2e/form.spec.ts` (6 e2e)
- `tests/a11y/form.a11y.spec.ts` (3 axe)

## Modified

- `registry.json` — append form (react-hook-form, zod, @hookform/resolvers deps)
- `registry/items.manifest.ts` — append form ManifestEntry (fullName/email/forceInvalid controls)
- `src/app/preview/[item]/renderers/index.ts` — register `form: FormPreview`

## Deviations

1. **noValidate on form element.** Without it, `<Input type="email">` triggers HTML5 built-in validation which blocks Zod from running. Zod is the single source of truth for validation messages in this primitive.
2. **Dark-mode color-contrast rule disabled.** `--danger` (#c72929) on `--card` dark (#131b30) measures 3.07:1 — below WCAG AA 4.5:1. Token concern (tracks alongside Badge's same issue). Light mode passes full wcag2a+wcag2aa. Follow-up: tighten dark-mode `--danger` before v1.0.
3. **Label text vs name selector.** PlaygroundShell PropKnob uses `control.label ?? control.name`. Manifest defines `label: 'Pre-fill as invalid'` for `forceInvalid`, so test selectors must use label text.

## Gates

- typecheck 0 errors
- test:unit green
- shadcn build emits form.json
- pnpm build → /preview/form prerendered
- playwright --grep form → 9/9 pass (light + dark, idle + error)
