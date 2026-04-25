---
phase: 3
plan_id: 3-04
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/select.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/select.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/select.tsx
autonomous: true
requirements: [R4.4]
must_haves:
  truths:
    - "Select Trigger height 48px, visual parity with Input."
    - "Dropdown opens on Space/Enter; arrow keys cycle; Escape closes."
    - "Selected item: --blue-050 bg + --brand text + --weight-medium."
    - "Trigger exposes --shadow-focus on :focus-visible."
    - "Bundled sub-parts (Trigger/Content/Item/Label/Separator/ScrollUpButton/ScrollDownButton) all from select.tsx per D-04."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx"
      provides: "Radix Select bundle"
      min_lines: 100
      exports: ["Select", "SelectTrigger", "SelectContent", "SelectItem", "SelectLabel", "SelectSeparator", "SelectScrollUpButton", "SelectScrollDownButton"]
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Select primitive (R4.4) using @radix-ui/react-select; bundle all sub-parts in one file per D-04/D-05.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.4 Select"
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack" (Radix versions)
4. D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--card, --input, --blue-050, --brand, --border, --shadow-2)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author select.tsx bundling all Radix sub-parts</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/select.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.4 Select
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3" + §"Standard Stack"
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - SelectTrigger: 48px height, 12px radius, 14px padding, trailing 16px chevron-down icon (Lucide ChevronDown) in --muted-foreground.
    - SelectContent: rounded --radius-md, border --border, shadow-[var(--shadow-2)], max-h 240px, bg --card.
    - SelectItem: h-[40px], px-[14px], hover bg --background, selected bg --blue-050 + text --brand + font-medium.
    - Keyboard: Radix handles Space/Enter/Arrow/Escape.
  </behavior>
  <action>
    Create select.tsx following shadcn canonical Select bundle pattern. Replace shadcn defaults with DGC tokens per UI-SPEC §2.4 table. Export all 8 sub-parts: Select, SelectGroup (from Radix passthrough), SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton.
    SelectTrigger classes: `flex h-[var(--input-h)] w-full items-center justify-between rounded-[var(--radius-md)] border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-[14px] text-base text-[hsl(var(--foreground))] hover:border-[hsl(var(--gray-400))] focus:outline-none data-[state=open]:border-[hsl(var(--blue-700))] data-[state=open]:shadow-[var(--shadow-focus)] focus-visible:border-[hsl(var(--blue-700))] focus-visible:shadow-[var(--shadow-focus)] aria-[invalid=true]:border-[hsl(var(--danger))] disabled:cursor-not-allowed disabled:bg-[hsl(var(--background))] data-[placeholder]:text-[hsl(var(--muted-foreground))]`.
    SelectContent classes: `z-50 max-h-[240px] min-w-[8rem] overflow-hidden rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow-2)]`.
    SelectItem classes: `relative flex h-[40px] cursor-default select-none items-center rounded-sm px-[14px] text-base outline-none focus:bg-[hsl(var(--background))] data-[state=checked]:bg-[hsl(var(--blue-050))] data-[state=checked]:text-[hsl(var(--brand))] data-[state=checked]:font-medium data-[disabled]:pointer-events-none data-[disabled]:opacity-50`.
    Unit test: renders Select with options, trigger has correct classes, content renders items.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx`
    - `grep -q "SelectTrigger\|SelectContent\|SelectItem" D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx`
    - `grep -q "@radix-ui/react-select" D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx`
    - `grep -q "--blue-050" D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx`
    - `pnpm test:unit -- select` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- select</automated></verify>
  <done>Select bundle compiles; unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register select in registry.json + manifest + renderer</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/select.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1" (dependencies must include @radix-ui/react-select, lucide-react)
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/select/select.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Append registry.json entry with dependencies ["@radix-ui/react-select","lucide-react"].
    Append manifest entry name="select" with controls: disabled, invalid, placeholder.
    Renderer: Select with 3-4 hardcoded SelectItem options including Khmer labels ("ខ្មែរ","English","中文").
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"select\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `grep -q "@radix-ui/react-select" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/select.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/select.json</automated></verify>
  <done>select.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/select</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/select.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/select.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.4 Visual Acceptance Test
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: click trigger, assert content appears; press ArrowDown then Enter, assert selected value; press Escape, assert content closed.
    a11y: runAxe with dropdown open (open the select first, then axe).
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep select && pnpm test:a11y --grep select` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep select && pnpm test:a11y --grep select</automated></verify>
  <done>Select playground + tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.04-01 | Tampering (supply chain) | @radix-ui/react-select, lucide-react | mitigate | Pinned versions; pnpm audit in CI. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- select && npx shadcn build && pnpm test:e2e --grep select && pnpm test:a11y --grep select</verification>

<success_criteria>Select installable; bundle exports all Radix sub-parts; keyboard navigation works.</success_criteria>

<output>Create .planning/phases/3-primitives/3-04-SUMMARY.md</output>
