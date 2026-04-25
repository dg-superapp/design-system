---
phase: 3
plan_id: 3-07
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/switch.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/switch.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/switch.tsx
autonomous: true
requirements: [R4.7]
must_haves:
  truths:
    - "Switch track EXACTLY 40×24px (R4.7 authoritative, specimen 36×20 deprecated)."
    - "Thumb EXACTLY 18px, thumb-off left:2px top:2px, thumb-on translateX(20px) (40-18-2)."
    - "Off track: --gray-300; On track: --brand."
    - "Thumb slides with transition left --dur-fast --ease-standard."
    - "Space toggles; focus-visible shows --shadow-focus on track."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx"
      provides: "Radix Switch with exact DGC dimensions"
      min_lines: 25
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Switch primitive (R4.7) with exact 40×24 track / 18px thumb dimensions per R4.7 authoritative spec (overriding specimen 36×20).
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.7 Switch" (incl. Claude discretion note 40×24 authoritative)
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
4. D:/sources/dgc-miniapp-design-system/project/preview/selection.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--brand, --gray-300, --radius-pill, --dur-fast, --ease-standard, --shadow-focus)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author switch.tsx with 40×24 track / 18px thumb</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/switch.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.7 (exact dimensions, R4.7 authoritative)
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - Track: w-[40px] h-[24px] rounded-[var(--radius-pill)].
    - Thumb: 18×18px, starts left:2px top:2px, when checked translate-x-[20px].
    - Off track bg: --gray-300. On track bg: --brand. Disabled: --gray-200/--gray-300.
    - Transition: left var(--dur-fast) var(--ease-standard).
  </behavior>
  <action>
    Create switch.tsx:
    - `import * as SwitchPrimitive from "@radix-ui/react-switch";`
    - forwardRef wrapping SwitchPrimitive.Root with classes:
      `peer inline-flex h-[24px] w-[40px] shrink-0 cursor-pointer items-center rounded-[var(--radius-pill)] border-transparent transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[hsl(var(--brand))] data-[state=unchecked]:bg-[hsl(var(--gray-300))] data-[state=checked]:hover:bg-[hsl(var(--brand-hover))] data-[state=unchecked]:hover:bg-[hsl(var(--gray-400))]`.
    - SwitchPrimitive.Thumb with classes:
      `pointer-events-none block h-[18px] w-[18px] rounded-[var(--radius-pill)] bg-white shadow ring-0 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-standard)] data-[state=checked]:translate-x-[20px] data-[state=unchecked]:translate-x-[2px]`.
    - NO opacity fallback on tracking — explicit color tokens (NOT opacity-50 for state differentiation).
    Unit test: renders, aria-checked toggles, h=24, w=40.
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-switch" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - `grep -q "w-\[40px\]" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - `grep -q "h-\[24px\]" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - `grep -q "h-\[18px\]" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - `grep -q "translate-x-\[20px\]" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - `grep -q "var(--brand)" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx`
    - `pnpm test:unit -- switch` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- switch</automated></verify>
  <done>Switch source + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register switch</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/switch.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/registry/switch/switch.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry deps ["@radix-ui/react-switch"]. Manifest controls: checked (boolean), disabled, label (Khmer default "បើក"). Renderer: Switch with adjacent Label at gap --space-3.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"switch\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/switch.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/switch.json</automated></verify>
  <done>switch.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/switch (measure track dimensions)</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/switch.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/switch.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.7 Visual Acceptance (measure 40×24)
    - D:/sources/dgc-miniapp-design-system/project/preview/selection.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: navigate /preview/switch; assert getBoundingClientRect → width:40, height:24; click toggles aria-checked; Space toggles; thumb at left:2 when off, translated 20px when on; disabled ignores clicks.
    a11y: runAxe light+dark.
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep switch && pnpm test:a11y --grep switch` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep switch && pnpm test:a11y --grep switch</automated></verify>
  <done>Switch tests green, dimensions verified 40×24.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.07-01 | Tampering (supply chain) | @radix-ui/react-switch | mitigate | Pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- switch && npx shadcn build && pnpm test:e2e --grep switch && pnpm test:a11y --grep switch</verification>

<success_criteria>Switch installable; 40×24 track measured; thumb 18px; slides smoothly.</success_criteria>

<output>Create .planning/phases/3-primitives/3-07-SUMMARY.md</output>
