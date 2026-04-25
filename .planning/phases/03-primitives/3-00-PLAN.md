---
phase: 3
plan_id: 3-00
wave: 0
depends_on: []
files_modified:
  - D:/sources/dgc-miniapp-shadcn/package.json
  - D:/sources/dgc-miniapp-shadcn/pnpm-lock.yaml
  - D:/sources/dgc-miniapp-shadcn/playwright.config.ts
  - D:/sources/dgc-miniapp-shadcn/vitest.config.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/example.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/example.test.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/page.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/PlaygroundShell.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/src/components/docs/McxLayout.tsx
  - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml
autonomous: true
requirements: []
must_haves:
  truths:
    - "Playwright + vitest installed; `pnpm typecheck`, `pnpm test:unit`, `pnpm test:e2e`, `pnpm test:a11y` scripts resolve."
    - "Dynamic route /preview/[item] compiles with empty manifest and supports generateStaticParams."
    - "/test/khmer page compiles with html lang=km wrapper."
    - "registry/items.manifest.ts exports a typed `items: ManifestEntry[]` (length 0 initially)."
    - "CI workflow runs pnpm test:a11y before deploy step."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/playwright.config.ts"
      provides: "Playwright runner config"
    - path: "D:/sources/dgc-miniapp-shadcn/vitest.config.ts"
      provides: "Unit test runner config"
    - path: "D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts"
      provides: "Playground + docs routing manifest"
    - path: "D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/page.tsx"
      provides: "Dynamic playground route with generateStaticParams"
    - path: "D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx"
      provides: "Khmer clipping smoke page (lang=km)"
  key_links:
    - from: "pnpm scripts"
      to: "playwright.config.ts, vitest.config.ts"
      pattern: "test:unit|test:e2e|test:a11y"
    - from: "app/preview/[item]/page.tsx"
      to: "registry/items.manifest.ts"
      pattern: "from .*items.manifest"
---

<objective>
Install and configure all test infrastructure (Playwright + axe + vitest), scaffold the dynamic playground route, create the Khmer clipping page, author the central `items.manifest.ts`, and extend the CI deploy workflow with an a11y gate. This plan is the Wave 0 blocker for every subsequent primitive plan.
</objective>

<files_to_read>
MUST read in order before touching code:
1. D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-CONTEXT.md (decisions D-11, D-12, D-13, D-16, D-17, D-19)
2. D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-RESEARCH.md §7 (items.manifest.ts shape), §5 (playground route), §8 (CI + smoke tips)
3. D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-VALIDATION.md §"Wave 0 Requirements"
4. D:/sources/dgc-miniapp-shadcn/package.json (existing scripts and deps — do not clobber Phase 1/2 scripts)
5. D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml (extend, don't replace)
6. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (confirm --bg-disabled, --fg-on-disabled, --shadow-focus present)
7. D:/sources/dgc-miniapp-shadcn/src/app/globals.css (Phase 2 dogfood copy — same token inventory)
</files_to_read>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<tasks>

<task type="auto">
  <name>Task 1: Install test + Radix + RHF + CVA dependencies and add package.json scripts</name>
  <files>D:/sources/dgc-miniapp-shadcn/package.json</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/package.json (current deps and scripts)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack" (pinned versions)
    - .planning/phases/3-primitives/3-VALIDATION.md §"Wave 0 Requirements"
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (confirm --bg-disabled, --fg-on-disabled, --shadow-focus declared)
    - Visual specimen: D:/sources/dgc-miniapp-design-system/project/preview/elevation.html (--shadow-focus visual)
  </read_first>
  <action>
    Run `pnpm add` for runtime deps (exact versions from RESEARCH §"Standard Stack"):
    `class-variance-authority@0.7.1 lucide-react react-hook-form zod@^3 @hookform/resolvers@5.2.2 @radix-ui/react-checkbox@1.3.3 @radix-ui/react-radio-group @radix-ui/react-switch@1.2.6 @radix-ui/react-select@2.2.6 @radix-ui/react-tabs@1.1.13 @radix-ui/react-tooltip @radix-ui/react-separator @radix-ui/react-scroll-area@1.2.10 @radix-ui/react-label @radix-ui/react-slot`.
    Run `pnpm add -D @playwright/test @axe-core/playwright vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom`.
    Run `pnpm exec playwright install chromium` to fetch the browser.
    Add scripts to package.json (preserve existing Phase 1/2 scripts):
    - `"typecheck": "tsc --noEmit"`
    - `"test:unit": "vitest run"`
    - `"test:e2e": "playwright test --project=chromium"`
    - `"test:a11y": "playwright test --project=chromium --grep a11y"`
    Extend existing `smoke:consumer` script to accept `SMOKE_WITH_PRIMITIVES=1` env var flag (do not remove `SMOKE_WITH_HELLO=1` branch). Token-referenced semantics: `--bg-disabled`, `--fg-on-disabled`, `--shadow-focus` MUST already exist in globals.css (verify via grep — if missing, add to registry/dgc-theme/globals.css under `@theme inline` / light+dark blocks — fall back to --gray-200 / --gray-500 values per UI-SPEC §2.1 disabled row).
  </action>
  <acceptance_criteria>
    - `grep -q '"class-variance-authority"' D:/sources/dgc-miniapp-shadcn/package.json`
    - `grep -q '"@radix-ui/react-checkbox"' D:/sources/dgc-miniapp-shadcn/package.json`
    - `grep -q '"@radix-ui/react-tooltip"' D:/sources/dgc-miniapp-shadcn/package.json`
    - `grep -q '"react-hook-form"' D:/sources/dgc-miniapp-shadcn/package.json`
    - `grep -q '"test:a11y"' D:/sources/dgc-miniapp-shadcn/package.json`
    - `grep -q '"typecheck"' D:/sources/dgc-miniapp-shadcn/package.json`
    - `grep -q -- '--bg-disabled' D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css`
    - `grep -q -- '--shadow-focus' D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css`
    - `pnpm typecheck` exits 0.
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck</automated>
  </verify>
  <done>All deps installed, scripts wired, typecheck passes, token vars confirmed.</done>
</task>

<task type="auto">
  <name>Task 2: Scaffold Playwright + Vitest configs and smoke tests</name>
  <files>D:/sources/dgc-miniapp-shadcn/playwright.config.ts, D:/sources/dgc-miniapp-shadcn/vitest.config.ts, D:/sources/dgc-miniapp-shadcn/tests/e2e/example.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/unit/example.test.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 7" (axe + Playwright)
    - .planning/phases/3-primitives/3-VALIDATION.md §"Wave 0 Requirements"
    - D:/sources/dgc-miniapp-shadcn/package.json (built scripts confirm port 3030 or infer from existing dev script)
  </read_first>
  <action>
    Create `playwright.config.ts`:
    - `projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }, { name: 'mobile-chrome', use: devices['Pixel 5'] }]`
    - `use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3030' }`
    - `webServer: { command: 'pnpm build && npx serve out -l 3030', url: 'http://localhost:3030', reuseExistingServer: !process.env.CI, timeout: 180_000 }`
    - `expect: { toHaveScreenshot: { threshold: 0.15 } }`
    - `testDir: 'tests'`
    - `screenshot: 'only-on-failure'`
    Create `vitest.config.ts`:
    - `test: { environment: 'happy-dom', globals: true, setupFiles: ['@testing-library/jest-dom'] }`
    - `resolve.alias: { '@': path.resolve(__dirname, './src') }`
    Create `tests/e2e/example.spec.ts` — one test that navigates to `/` and expects status 200, proving Playwright boots.
    Create `tests/unit/example.test.ts` — one `expect(1+1).toBe(2)` test proving vitest boots.
    Create `tests/a11y/axe.setup.ts` — export helper `export async function runAxe(page) { return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze(); }`.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/playwright.config.ts`
    - `test -f D:/sources/dgc-miniapp-shadcn/vitest.config.ts`
    - `test -f D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts`
    - `grep -q "AxeBuilder" D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts`
    - `grep -q "happy-dom" D:/sources/dgc-miniapp-shadcn/vitest.config.ts`
    - `pnpm test:unit` passes (1+1=2 smoke).
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:unit</automated>
  </verify>
  <done>Playwright + vitest boot successfully; example tests green.</done>
</task>

<task type="auto">
  <name>Task 3: Scaffold items.manifest.ts, /preview/[item], /test/khmer, McxLayout, CI a11y gate</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/page.tsx, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/PlaygroundShell.tsx, D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx, D:/sources/dgc-miniapp-shadcn/src/components/docs/McxLayout.tsx, D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml</files>
  <read_first>
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 4" (manifest shape) and §"Pattern 5" (dynamic route)
    - .planning/phases/3-primitives/3-CONTEXT.md D-11, D-12, D-13
    - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml (existing steps)
    - D:/sources/dgc-miniapp-shadcn/src/app/docs/foundations/tokens/page.mdx (Phase 2 MDX layout reference)
    - Visual specimen: D:/sources/dgc-miniapp-design-system/project/preview/type-bilingual.html (bilingual layout)
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Create `registry/items.manifest.ts` exporting `ManifestEntry` type + `PropControl` union (matches RESEARCH §7 shape) + empty `items: ManifestEntry[] = []` — later plans append. Type must include `{ name, title, docsSlug, controls }`.
    Create `src/app/preview/[item]/page.tsx`:
    - `export function generateStaticParams() { return items.map(i => ({ item: i.name })); }` — required for static export (RESEARCH §5 critical note).
    - Default export: receives `{ params: { item: string } }`, calls `notFound()` if entry not in manifest, otherwise renders `<PlaygroundShell entry={entry} />`.
    Create `src/app/preview/[item]/PlaygroundShell.tsx`:
    - Client component with three toggles (per D-13): theme (light/dark via `document.documentElement.classList`), language (en/km via `lang` attr on `<div className="playground-frame">`), mobile viewport (375×812 wrapped in `max-width: 375px` CSS constraint).
    - Renders typed prop controls based on `entry.controls`; uses React state; NO runtime JSX eval (D-12).
    - Shell renders a placeholder "Preview not implemented" component slot — individual primitive plans register their preview render function.
    Create `src/app/test/khmer/page.tsx`:
    - Renders a heading and grid stub with `<html lang="km">` context (use `<div lang="km" className="space-y-4">`); individual primitive plans will import and slot their component here.
    Create `src/components/docs/McxLayout.tsx`:
    - MDX layout component wrapping `{children}` with docs nav + ToC sidebar; re-uses Phase 2 `app/docs/foundations/tokens/page.mdx` layout pattern.
    - Exports a `<InstallCommand name={name} />` helper that emits the shadcn install command string `npx shadcn@latest add https://registry.016910804.xyz/r/{name}.json` with a copy button (R9.4) using `navigator.clipboard.writeText`.
    Extend `.github/workflows/deploy.yml`:
    - Before deploy step, add: `- name: Run a11y tests` with `run: pnpm test:a11y`.
    - After deploy, add `run: pnpm typecheck && pnpm test:unit` as a gate (non-blocking alias). Preserve all existing steps.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts`
    - `grep -q "ManifestEntry" D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts`
    - `grep -q "items: ManifestEntry\[\]" D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts`
    - `grep -q "generateStaticParams" D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/page.tsx`
    - `test -f D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx`
    - `grep -q 'lang="km"' D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx`
    - `grep -q "InstallCommand" D:/sources/dgc-miniapp-shadcn/src/components/docs/McxLayout.tsx`
    - `grep -q "test:a11y" D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml`
    - `pnpm build` succeeds (static export must enumerate dynamic route even with empty manifest — generateStaticParams returns [], so the route is just not emitted, build still succeeds).
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm build</automated>
  </verify>
  <done>All infrastructure files exist; pnpm build succeeds; CI gate wired.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| consumer→registry CDN | static JSON served over HTTPS |
| CI→npm registry | pnpm install pulls deps during build |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.00-01 | Tampering (supply chain) | package.json dev deps | mitigate | Pin exact versions from RESEARCH (0.7.1, 1.3.3, etc.); CI runs `pnpm audit --prod` with high-severity fail threshold before build. |
</threat_model>

<verification>
- `pnpm typecheck && pnpm test:unit && pnpm build` all exit 0.
- `playwright test tests/e2e/example.spec.ts` passes (smoke).
- Dynamic route `/preview/[item]` compiles and `generateStaticParams` returns empty list without error.
</verification>

<success_criteria>
Wave 0 complete when:
- All test infra installed and boot-tested.
- items.manifest.ts exported (empty).
- Playground + Khmer test routes compile.
- CI a11y gate wired.
- Every downstream plan (01–17) can now assume these files exist.
</success_criteria>

<output>
After completion, create `.planning/phases/3-primitives/3-00-SUMMARY.md` with: installed deps list, scripts added, artifacts created, any discrepancies with --bg-disabled / --fg-on-disabled token availability in globals.css.
</output>
