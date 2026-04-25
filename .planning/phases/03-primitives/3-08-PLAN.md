---
phase: 3
plan_id: 3-08
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/label.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/label.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/label.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/label.tsx
autonomous: true
requirements: [R4.8]
must_haves:
  truths:
    - "Label renders as HTML <label> with htmlFor."
    - "Font: --text-sm (14px), --weight-medium (500), color --foreground."
    - "Required prop renders asterisk span with color --red-600 and aria-hidden=true."
    - "--red-600 used ONLY in label asterisk (only usage in Phase 3 per UI-SPEC §1.2 note)."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx"
      provides: "Label primitive with required asterisk"
      min_lines: 25
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Label primitive (R4.8): 14px medium-weight label with htmlFor and optional required asterisk in --red-600.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.8 Label"
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack" (@radix-ui/react-label)
4. D:/sources/dgc-miniapp-design-system/project/preview/inputs.html (label styling)
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--red-600, --foreground, --text-sm, --weight-medium)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author label.tsx with required asterisk</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/label.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.8 (asterisk color --red-600, aria-hidden=true)
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - `<label>` element; forwardRef.
    - Classes: text-[0.875rem] font-medium text-[hsl(var(--foreground))] leading-normal.
    - `required` prop (boolean): renders `<span aria-hidden="true" className="ml-0.5 text-[hsl(var(--red-600))]">*</span>` after children.
  </behavior>
  <action>
    Create label.tsx:
    - `import * as LabelPrimitive from "@radix-ui/react-label";` (or use plain HTML `<label>` — LabelPrimitive is thin wrapper providing click-to-focus cascade; prefer LabelPrimitive.Root per shadcn canonical).
    - Export Label = forwardRef wrapping LabelPrimitive.Root with classes: `text-sm font-medium leading-none text-[hsl(var(--foreground))] peer-disabled:cursor-not-allowed peer-disabled:opacity-70`.
    - Props: `{ required?: boolean; children: React.ReactNode; } & ComponentProps<typeof LabelPrimitive.Root>`.
    - When required true, append `<span aria-hidden="true" className="ml-0.5 text-[hsl(var(--red-600))]">*</span>`.
    Unit test:
    - renders with text.
    - required renders aria-hidden asterisk with text-[hsl(var(--red-600))] class.
    - htmlFor passes through.
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-label\|<label" D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx`
    - `grep -q "var(--red-600)" D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx`
    - `grep -q "aria-hidden" D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx`
    - `grep -q "font-medium" D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx`
    - `pnpm test:unit -- label` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- label</automated></verify>
  <done>Label source + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register label</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/label.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry deps ["@radix-ui/react-label"]. Manifest controls: required (boolean), text (default "ឈ្មោះពេញ"). Renderer: Label + Input pair demonstrating htmlFor.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"label\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/label.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/label.json</automated></verify>
  <done>label.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/label</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/label.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/label.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.8 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: label font-size 14px, weight 500; required=true shows asterisk with color rgb(211,47,47)=--red-600; asterisk aria-hidden; clicking label focuses paired input (htmlFor cascade).
    a11y: runAxe light+dark.
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep label && pnpm test:a11y --grep label` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep label && pnpm test:a11y --grep label</automated></verify>
  <done>Label tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.08-01 | Tampering (supply chain) | @radix-ui/react-label (thin) | accept | Minimal footprint; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- label && npx shadcn build && pnpm test:e2e --grep label && pnpm test:a11y --grep label</verification>

<success_criteria>Label installable; required asterisk --red-600; htmlFor cascade works.</success_criteria>

<output>Create .planning/phases/3-primitives/3-08-SUMMARY.md</output>
