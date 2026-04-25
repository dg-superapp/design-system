---
status: complete
phase: 3-primitives
started: 2026-04-24T18:30:00Z
updated: 2026-04-24T18:45:00Z
---

## Current Test

All tests complete.

## Tests

### 1. Live registry — all 14 endpoints return 200
expected: `curl https://registry.016910804.xyz/r/{name}.json` returns HTTP 200 + valid JSON for all 14 primitives + dgc-theme.
result: pass — all 15 endpoints return 200, valid JSON (button spot-check: name=button, type=registry:ui, files=1, deps=3, regDeps=1).

### 2. Live consumer install — happy path
expected: In a fresh Next.js 15 app, `npx shadcn@latest add https://registry.016910804.xyz/r/button.json --yes` installs without error and `components/ui/button.tsx` appears with DGC tokens.
result: pass — scratch Next.js 15 consumer installed button.tsx with --brand, --bg-disabled, --shadow-focus tokens + ghost-danger variant. Deps: @radix-ui/react-slot ^1.2.4, class-variance-authority ^0.7.1, lucide-react ^1.11.0. components/theme.css cascade succeeded.

### 3. Cross-primitive install — form pulls Label + Input + theme
expected: `npx shadcn@latest add https://registry.016910804.xyz/r/form.json --yes` installs Form AND Label AND Input AND dgc-theme via registryDependencies cascade. No relative-path import errors.
result: pass — form.tsx + label.tsx + input.tsx all installed in one call. form.tsx imports `@/components/ui/label` (alias, not relative). Consumer pnpm build compiled cleanly. Deps: react-hook-form ^7.73.1, zod ^4.3.6, @hookform/resolvers ^5.2.2.

### 4. Khmer clipping — visual eyeball
expected: Open https://registry.016910804.xyz/test/khmer/ — coeng subscripts (្ក ្ខ ្គ ្ឃ) render without clipping; Tooltip shows; ScrollArea list rows don't crop diacritics.
result: pass — human-approved during plan 3-16 baseline review; live URL renders identically.

### 5. Playground — spot-check 3 primitives end-to-end
expected: Open https://registry.016910804.xyz/preview/button/, /preview/select/, /preview/form/ — all controls operate, theme/lang toggles work, primitives render correctly.
result: pass — user confirmed button/select/form playgrounds render + control.

### 6. Docs pages — install command + preview link
expected: Open https://registry.016910804.xyz/docs/components/button/ — install command shows correct URL, copy button works, link to /preview/button/ resolves.
result: pass — HTML scrape confirms literal install cmd + /preview/button href + CopyInstallButton markup. Playwright e2e (docs-pages.spec.ts) validates clipboard button click at build time.

### 7. axe a11y — CI gate green
expected: GitHub Actions latest main run succeeded; a11y step + smoke step both green.
result: pass — run 24915977990 green. a11y step: success. Consumer smoke (14 primitives): success.

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

None. All exit criteria met:
- All 14 items installable via shadcn CLI ✓
- axe check passes (with documented color-contrast scoping for badge + dark-form) ✓
- Khmer lang=km test page renders without clipping ✓
