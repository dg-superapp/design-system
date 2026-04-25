---
phase: 3
plan_id: 3-01
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/button.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/button.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/button.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/button.tsx
autonomous: true
requirements: [R4.1]
must_haves:
  truths:
    - "`npx shadcn@latest add https://registry.016910804.xyz/r/button.json` installs a working Button."
    - "Primary default renders --brand (#0D47A1) fill with --brand-foreground (white) text at 48px height."
    - "Disabled uses --bg-disabled + --fg-on-disabled (NOT opacity-50, NOT muted-foreground)."
    - "Tab to button shows 3px --shadow-focus ring on :focus-visible."
    - "Khmer label under lang=km renders at --leading-loose without clipping."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx"
      provides: "Button primitive source"
      min_lines: 50
    - path: "D:/sources/dgc-miniapp-shadcn/registry.json"
      provides: "Button registry entry"
      contains: "button"
    - path: "D:/sources/dgc-miniapp-shadcn/tests/e2e/button.spec.ts"
      provides: "E2E acceptance test"
  key_links:
    - from: "registry.json"
      to: "registry/dgc-theme.json"
      via: "registryDependencies URL"
      pattern: "dgc-theme.json"
    - from: "registry/items.manifest.ts"
      to: "src/app/preview/[item]/renderers/button.tsx"
      pattern: "button"
---

<objective>
Ship the Button primitive (R4.1): 4 variants × 2 sizes, CVA-driven, DGC-tokened, with asChild Slot support, registry JSON entry, playground renderer, and unit + e2e + a11y tests.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx (the file being created)
2. D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-UI-SPEC.md §"2.1 Button"
3. D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3: CVA with DGC Tokens" + §"Pattern 1: Registry JSON"
4. D:/sources/dgc-miniapp-design-system/project/preview/buttons-primary.html (primary variant specimen)
5. D:/sources/dgc-miniapp-design-system/project/preview/buttons-secondary.html (secondary/ghost/ghost-danger specimen)
6. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--brand, --brand-foreground, --brand-hover, --brand-press, --bg-disabled, --fg-on-disabled, --shadow-focus, --radius-md)
7. D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx (registry:ui reference shape)
</files_to_read>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author button.tsx with CVA variants + DGC tokens + asChild Slot</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx (create new)
    - D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-UI-SPEC.md §2.1 Button (state tokens per variant table)
    - D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3" (CVA shape example)
    - D:/sources/dgc-miniapp-design-system/project/preview/buttons-primary.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (confirm tokens exist)
  </read_first>
  <behavior>
    - Variant primary default: bg=--brand, text=--brand-foreground, hover=--brand-hover, active=--brand-press.
    - Variant secondary default: bg=--blue-050, text=--brand, hover=--blue-100.
    - Variant ghost: bg transparent, text=--brand, hover=--blue-050.
    - Variant ghost-danger: bg transparent, text=--danger, hover=--danger-bg.
    - Size default: 48px (--button-h), px-5 (20px horizontal), min-width 140px on primary+secondary, rounded-[var(--radius-md)] (12px).
    - Size sm: 40px height, px-[18px], --text-sm.
    - Disabled state (all variants): `bg-[var(--bg-disabled)] text-[var(--fg-on-disabled)]` — NOT opacity-50.
    - Focus-visible: `focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]`.
    - asChild prop: when true, render as Radix Slot (per D-15 Claude discretion — yes on Button).
    - Loading state: renders inline 16×16px spinner via CSS animation + `aria-disabled="true"` (per UI-SPEC Button ARIA note).
  </behavior>
  <action>
    Create `registry/button/button.tsx` per RESEARCH §"Pattern 3" template. Concrete requirements:
    - `import { cva, type VariantProps } from "class-variance-authority";`
    - `import { Slot } from "@radix-ui/react-slot";`
    - `import { forwardRef } from "react";`
    - `import { cn } from "@/lib/utils";` (use existing Phase 2 utils — if absent, create a 3-line cn = clsx+twMerge helper).
    - Export `buttonVariants = cva([base classes], { variants: { variant: {...}, size: {...} }, defaultVariants: { variant: "primary", size: "default" } })`.
    - Base classes: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-medium text-base transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none disabled:bg-[var(--bg-disabled)] disabled:text-[var(--fg-on-disabled)]`.
    - Variant primary: `bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand-hover))] active:bg-[hsl(var(--brand-press))]`.
    - Variant secondary: `bg-[hsl(var(--blue-050))] text-[hsl(var(--brand))] hover:bg-[hsl(var(--blue-100))]`.
    - Variant ghost: `bg-transparent text-[hsl(var(--brand))] hover:bg-[hsl(var(--blue-050))]`.
    - Variant ghost-danger: `bg-transparent text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger-bg))]`.
    - Size default: `h-[var(--button-h)] px-5 min-w-[140px]`.
    - Size sm: `h-[40px] px-[18px] text-sm`.
    - `export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; loading?: boolean; }`.
    - Default `type="button"` to prevent accidental form submission (per UI-SPEC interaction contract).
    - NO dark:* utilities (D-06). NO lang branching (D-07).
    Also create `tests/unit/button.test.tsx`:
    - Test renders default Button with children.
    - Test variant="primary" class includes `--brand` reference.
    - Test disabled prop applies disabled classes.
    - Test loading prop renders spinner + `aria-disabled="true"`.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx`
    - `grep -q "cva(" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx`
    - `grep -q "ghost-danger" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx`
    - `grep -q "var(--bg-disabled)" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx`
    - `grep -q "var(--brand)" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx` (D-06).
    - NOT `grep -q "opacity-50" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx` (R4.1).
    - `grep -q "asChild" D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx`
    - `pnpm test:unit -- button` passes.
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- button</automated>
  </verify>
  <done>Button source compiles; variant class strings contain correct DGC tokens; unit tests pass.</done>
</task>

<task type="auto">
  <name>Task 2: Register button in registry.json + items.manifest.ts + playground renderer</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/button.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json (current items array, schema url)
    - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts (added empty by Plan 00)
    - D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1" and §"Pattern 2"
    - D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-UI-SPEC.md §2.1 (playground acceptance)
    - D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx (from Task 1)
  </read_first>
  <action>
    Append to `registry.json` `items` array:
    ```
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "DGC-branded button with 4 variants, 2 sizes, icon slot, and WCAG AA disabled state.",
      "dependencies": ["class-variance-authority", "lucide-react", "@radix-ui/react-slot"],
      "registryDependencies": ["https://registry.016910804.xyz/r/dgc-theme.json"],
      "files": [{ "path": "registry/button/button.tsx", "type": "registry:ui", "target": "components/ui/button.tsx" }],
      "cssVars": {}
    }
    ```
    Append to `registry/items.manifest.ts` `items` array a `ManifestEntry` for button with controls: variant (select), size (select), disabled (boolean), loading (boolean), label (text default "ចុចនៅទីនេះ").
    Create `src/app/preview/[item]/renderers/button.tsx` — a React component that receives `state` from PlaygroundShell and renders `<Button variant={state.variant} size={state.size} disabled={state.disabled} loading={state.loading}>{state.label}</Button>`. Import the renderer into PlaygroundShell's switch-on-entry-name map.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"button\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `grep -q "dgc-theme.json" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `grep -q "name: \"button\"" D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts`
    - `test -f D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/button.tsx`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build` produces `public/r/button.json` with valid schema.
    - `test -f D:/sources/dgc-miniapp-shadcn/public/r/button.json`
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && npx shadcn build && test -f public/r/button.json</automated>
  </verify>
  <done>Registry JSON emits button.json; manifest includes entry; playground renderer wired.</done>
</task>

<task type="auto">
  <name>Task 3: Write e2e + a11y tests for /preview/button</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/button.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/button.a11y.spec.ts</files>
  <read_first>
    - D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-UI-SPEC.md §2.1 Visual Acceptance Test
    - D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-RESEARCH.md §"Pattern 7" (axe/playwright)
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
    - D:/sources/dgc-miniapp-design-system/project/preview/buttons-primary.html
  </read_first>
  <action>
    Create `tests/e2e/button.spec.ts` — Playwright tests navigating to `/preview/button`:
    - Test: primary default renders with 48px height (use page.locator('button').first() and getBoundingClientRect).
    - Test: Tab key focuses button; computed box-shadow equals `var(--shadow-focus)` resolved value.
    - Test: set disabled control → button has `disabled` attribute + `cursor: not-allowed`.
    - Test: set language=km via playground toggle → button text is rendered; getBoundingClientRect height remains ≤ 50px (no clipping expansion).
    Create `tests/a11y/button.a11y.spec.ts`:
    - Test `a11y: /preview/button` — navigate, run `runAxe(page)` from axe.setup, expect `results.violations.length === 0`.
    - Run in both light mode and dark mode (toggle theme control).
    Test names must include "button" so `--grep button` selects them.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/tests/e2e/button.spec.ts`
    - `test -f D:/sources/dgc-miniapp-shadcn/tests/a11y/button.a11y.spec.ts`
    - `grep -q "/preview/button" D:/sources/dgc-miniapp-shadcn/tests/e2e/button.spec.ts`
    - `grep -q "AxeBuilder\|runAxe" D:/sources/dgc-miniapp-shadcn/tests/a11y/button.a11y.spec.ts`
    - `pnpm test:e2e --grep button && pnpm test:a11y --grep button` both pass.
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep button && pnpm test:a11y --grep button</automated>
  </verify>
  <done>E2E + axe tests green for /preview/button.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.01-01 | Tampering (supply chain) | class-variance-authority, @radix-ui/react-slot | mitigate | Exact versions pinned in package.json (Plan 00); `pnpm audit --prod` in CI. |
</threat_model>

<verification>
`pnpm typecheck && pnpm test:unit -- button && pnpm build && pnpm test:e2e --grep button && pnpm test:a11y --grep button` all exit 0.
</verification>

<success_criteria>
- Button source exists, variants correct, tokens correct, no dark:* utilities.
- registry.json entry valid; `npx shadcn build` emits `public/r/button.json`.
- /preview/button playground renders.
- e2e + a11y green.
</success_criteria>

<output>
After completion, create `.planning/phases/3-primitives/3-01-SUMMARY.md`.
</output>
