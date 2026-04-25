---
phase: 3
plan_id: 3-11
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/tooltip.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/tooltip.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/tooltip.tsx
autonomous: true
requirements: [R4.11]
must_haves:
  truths:
    - "Tooltip bg uses --gray-900 DIRECTLY (NOT --popover, NOT --card) per R4.11 + UI-SPEC §2.11."
    - "Foreground white; radius --radius-sm (8px); padding 6px 10px; --text-xs."
    - "Max-width 200px; --shadow-2."
    - "TooltipTrigger asChild (Radix Slot pattern)."
    - "Opens on hover + focus; closes on Escape + pointer-leave + blur."
    - "500ms open delay (Radix default)."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx"
      provides: "Radix Tooltip bundle with --gray-900 bg"
      min_lines: 40
      exports: ["TooltipProvider", "Tooltip", "TooltipTrigger", "TooltipContent", "TooltipArrow"]
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Tooltip primitive (R4.11) bundling Radix Tooltip with dark --gray-900 bg (deliberate exception to semantic aliasing per UI-SPEC §2.11).
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.11 Tooltip" (incl. --gray-900 rationale + dark-mode note)
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
4. D:/sources/dgc-miniapp-design-system/project/preview/elevation.html (shadow-2)
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--gray-900, --radius-sm, --shadow-2)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author tooltip.tsx bundle</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/tooltip.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.11 (NOT --popover, use --gray-900)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
    - D:/sources/dgc-miniapp-design-system/project/preview/elevation.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - TooltipProvider defaultDelayDuration=500, skipDelayDuration=100.
    - TooltipContent: bg --gray-900, text white, rounded --radius-sm, px-[10px] py-[6px], text-xs, max-w-[200px], shadow-[var(--shadow-2)].
    - TooltipArrow: 6×6 triangle, fill --gray-900.
  </behavior>
  <action>
    Create tooltip.tsx:
    - `import * as TooltipPrimitive from "@radix-ui/react-tooltip";`
    - Export TooltipProvider = TooltipPrimitive.Provider (direct passthrough with delayDuration={500}).
    - Export Tooltip = TooltipPrimitive.Root.
    - Export TooltipTrigger = TooltipPrimitive.Trigger (supports asChild natively).
    - Export TooltipContent = forwardRef wrapping TooltipPrimitive.Content with:
      `z-50 overflow-hidden rounded-[var(--radius-sm)] bg-[hsl(var(--gray-900))] px-[10px] py-[6px] text-xs text-white max-w-[200px] shadow-[var(--shadow-2)] animate-in fade-in-0 zoom-in-95`.
    - Export TooltipArrow = forwardRef wrapping TooltipPrimitive.Arrow with `fill-[hsl(var(--gray-900))]`.
    Unit test: hover trigger shows content after 500ms (use vi.useFakeTimers or just check role=tooltip appears on mouseenter).
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-tooltip" D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx`
    - `grep -q "var(--gray-900)" D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx`
    - `grep -q "var(--radius-sm)" D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx`
    - `grep -q "var(--shadow-2)" D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx`
    - `grep -q "max-w-\[200px\]" D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx`
    - NOT `grep -q "var(--popover)\|bg-popover\|var(--card)" D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx`
    - `pnpm test:unit -- tooltip` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- tooltip</automated></verify>
  <done>Tooltip bundle + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register tooltip</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/tooltip.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/elevation.html
    - D:/sources/dgc-miniapp-shadcn/registry/tooltip/tooltip.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry deps ["@radix-ui/react-tooltip"]. Manifest controls: side (select top/right/bottom/left), content (text default "ព័ត៌មានបន្ថែម"). Renderer: TooltipProvider wrapping a Button trigger + TooltipContent.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"tooltip\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/tooltip.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/tooltip.json</automated></verify>
  <done>tooltip.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/tooltip</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/tooltip.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/tooltip.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.11 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/elevation.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: hover trigger → after delay role=tooltip appears; computed bg is rgb(33,33,33)=--gray-900; Escape closes; focus trigger via keyboard also shows tooltip.
    a11y: runAxe with tooltip open (force via hover).
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep tooltip && pnpm test:a11y --grep tooltip` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep tooltip && pnpm test:a11y --grep tooltip</automated></verify>
  <done>Tooltip tests green; dark bg verified.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.11-01 | Tampering (supply chain) | @radix-ui/react-tooltip | mitigate | Pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- tooltip && npx shadcn build && pnpm test:e2e --grep tooltip && pnpm test:a11y --grep tooltip</verification>

<success_criteria>Tooltip installable; --gray-900 bg (NOT popover); 500ms delay; Escape closes.</success_criteria>

<output>Create .planning/phases/3-primitives/3-11-SUMMARY.md</output>
