---
phase: 3
plan_id: 3-06
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/radio.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/radio.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/radio.tsx
autonomous: true
requirements: [R4.6]
must_haves:
  truths:
    - "Radio 20×20px --radius-pill circle, 1.5px --gray-300 border unselected."
    - "Selected: --brand border + 10×10px --brand inner dot on white --card bg."
    - "Arrow keys (Up/Down/Left/Right) cycle selection within RadioGroup."
    - "focus-visible shows --shadow-focus."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx"
      provides: "Radix RadioGroup bundle (RadioGroup + RadioGroupItem)"
      min_lines: 30
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Radio primitive (R4.6) bundling @radix-ui/react-radio-group's RadioGroup + RadioGroupItem in one file per D-04/D-05. Uses --brand dot on white card per UI-SPEC authoritative note (specimen > R4.6 text).
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.6 Radio" (incl. note on R4.6 --accent vs specimen)
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
4. D:/sources/dgc-miniapp-design-system/project/preview/selection.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--brand, --radius-pill, --gray-300, --card, --shadow-focus)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author radio.tsx bundle</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/radio.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.6 (incl. note: specimen authoritative, --brand dot on white)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - RadioGroup: display flex, vertical gap --space-3 (12px) default.
    - RadioGroupItem: 20×20px, rounded --radius-pill, border 1.5px --gray-300, bg --card.
    - data-[state=checked]: border --brand, inner 10×10 dot bg --brand.
    - focus-visible shadow --shadow-focus.
    - Arrow keys handled by Radix.
  </behavior>
  <action>
    Create radio.tsx:
    - `import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";`
    - Export RadioGroup = forwardRef wrapping RadioGroupPrimitive.Root with `grid gap-[var(--space-3)]`.
    - Export RadioGroupItem = forwardRef wrapping RadioGroupPrimitive.Item with:
      `aspect-square h-[20px] w-[20px] rounded-[var(--radius-pill)] border-[1.5px] border-[hsl(var(--gray-300))] bg-[hsl(var(--card))] hover:border-[hsl(var(--brand))] hover:bg-[hsl(var(--blue-050))] focus:outline-none focus-visible:shadow-[var(--shadow-focus)] data-[state=checked]:border-[hsl(var(--brand))] data-[state=checked]:bg-[hsl(var(--card))] disabled:cursor-not-allowed disabled:bg-[hsl(var(--gray-100))]`.
    - Inside item: `<RadioGroupPrimitive.Indicator className="flex items-center justify-center"><span className="h-[10px] w-[10px] rounded-[var(--radius-pill)] bg-[hsl(var(--brand))]" /></RadioGroupPrimitive.Indicator>`.
    Unit test: RadioGroup with 3 items, click changes data-state-checked.
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-radio-group" D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx`
    - `grep -q "var(--radius-pill)" D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx`
    - `grep -q "var(--brand)" D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx`
    - `grep -q "h-\[10px\]" D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx`
    - `pnpm test:unit -- radio` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- radio</automated></verify>
  <done>Radio bundle + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register radio</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/radio.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/registry/radio/radio.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry deps ["@radix-ui/react-radio-group"]. Manifest controls: disabled, selectedIndex (select 0/1/2). Renderer: RadioGroup with 3 items labeled Khmer ("ភ្នំពេញ","សៀមរាប","បាត់ដំបង").
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"radio\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/radio.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/radio.json</automated></verify>
  <done>radio.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/radio</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/radio.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/radio.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.6 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: 3 radio items; click second, data-state=checked; arrow-down cycles; focus ring visible.
    a11y: runAxe light+dark.
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep radio && pnpm test:a11y --grep radio` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep radio && pnpm test:a11y --grep radio</automated></verify>
  <done>Radio tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.06-01 | Tampering (supply chain) | @radix-ui/react-radio-group | mitigate | Pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- radio && npx shadcn build && pnpm test:e2e --grep radio && pnpm test:a11y --grep radio</verification>

<success_criteria>Radio installable; arrow-key cycling; --brand dot on white per specimen.</success_criteria>

<output>Create .planning/phases/3-primitives/3-06-SUMMARY.md</output>
