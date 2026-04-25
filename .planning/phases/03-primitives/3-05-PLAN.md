---
phase: 3
plan_id: 3-05
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/checkbox.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/checkbox.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/checkbox.tsx
autonomous: true
requirements: [R4.5]
must_haves:
  truths:
    - "Checkbox 20×20px box, --radius-xs (4px), 1.5px --gray-300 border unchecked."
    - "Checked state: --brand fill + white Check icon."
    - "Space key toggles; focus-visible shows --shadow-focus."
    - "Touch target ≥ 44×44px via wrapper padding."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx"
      provides: "Radix Checkbox"
      min_lines: 30
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Checkbox primitive (R4.5) using @radix-ui/react-checkbox with 20×20px box, --brand check fill, Lucide Check glyph.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.5 Checkbox"
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
4. D:/sources/dgc-miniapp-design-system/project/preview/selection.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--brand, --radius-xs, --gray-300, --shadow-focus)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author checkbox.tsx</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/checkbox.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.5
    - .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - 20×20px box, border-[1.5px] hsl(--gray-300), rounded-[var(--radius-xs)].
    - data-[state=checked]: bg var(--brand), white Check icon from Lucide.
    - data-[state=indeterminate]: bg var(--brand), white Minus icon.
    - Disabled: bg --gray-100, border --gray-200.
    - focus-visible: shadow-[var(--shadow-focus)].
  </behavior>
  <action>
    Create `registry/checkbox/checkbox.tsx`:
    - `import * as CheckboxPrimitive from "@radix-ui/react-checkbox"; import { Check, Minus } from "lucide-react";`
    - `forwardRef` wrapping `<CheckboxPrimitive.Root>` with classes:
      `peer h-[20px] w-[20px] shrink-0 rounded-[var(--radius-xs)] border-[1.5px] border-[hsl(var(--gray-300))] bg-[hsl(var(--card))] hover:border-[hsl(var(--brand))] hover:bg-[hsl(var(--blue-050))] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] data-[state=checked]:bg-[hsl(var(--brand))] data-[state=checked]:border-[hsl(var(--brand))] data-[state=checked]:text-white data-[state=checked]:hover:bg-[hsl(var(--brand-hover))] data-[state=indeterminate]:bg-[hsl(var(--brand))] data-[state=indeterminate]:border-[hsl(var(--brand))] data-[state=indeterminate]:text-white disabled:cursor-not-allowed disabled:bg-[hsl(var(--gray-100))] disabled:border-[hsl(var(--gray-200))]`.
    - `<CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">` with `<Check className="h-[13px] w-[13px]" />` (or Minus for indeterminate).
    Unit test: renders, data-state toggles on click.
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-checkbox" D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx`
    - `grep -q "var(--radius-xs)" D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx`
    - `grep -q "var(--brand)" D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx`
    - `grep -q "h-\[20px\]" D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx`
    - `pnpm test:unit -- checkbox` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- checkbox</automated></verify>
  <done>Checkbox source + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register checkbox</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/checkbox.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/registry/checkbox/checkbox.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry: dependencies ["@radix-ui/react-checkbox","lucide-react"]. Manifest: controls checked (select: true/false/indeterminate), disabled, label (Khmer default "យល់ព្រម"). Renderer wraps checkbox with adjacent label at gap --space-2.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"checkbox\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/checkbox.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/checkbox.json</automated></verify>
  <done>checkbox.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/checkbox</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/checkbox.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/checkbox.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.5 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: box 20×20; click toggles data-state; Space toggles; focus ring appears; disabled ignores clicks.
    a11y: runAxe light+dark.
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep checkbox && pnpm test:a11y --grep checkbox` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep checkbox && pnpm test:a11y --grep checkbox</automated></verify>
  <done>Checkbox tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.05-01 | Tampering (supply chain) | @radix-ui/react-checkbox, lucide-react | mitigate | Pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- checkbox && npx shadcn build && pnpm test:e2e --grep checkbox && pnpm test:a11y --grep checkbox</verification>

<success_criteria>Checkbox installable; toggles via Space; focus ring; Khmer label renders.</success_criteria>

<output>Create .planning/phases/3-primitives/3-05-SUMMARY.md</output>
