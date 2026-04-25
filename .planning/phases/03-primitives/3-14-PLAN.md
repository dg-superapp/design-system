---
phase: 3
plan_id: 3-14
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/scroll-area.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/scroll-area.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/scroll-area.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/scroll-area.tsx
autonomous: true
requirements: [R4.14]
must_haves:
  truths:
    - "Scrollbar thumb: 8px, --gray-300, --radius-pill; hover: --gray-400."
    - "Custom scrollbar replaces native; appears on hover (Radix type='hover')."
    - "Keyboard-scrollable content (Tab reaches inner focusable items)."
    - "Consumer must set explicit height/max-height — component doesn't self-constrain."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx"
      provides: "Radix ScrollArea bundle"
      min_lines: 40
      exports: ["ScrollArea", "ScrollBar"]
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship ScrollArea primitive (R4.14) using @radix-ui/react-scroll-area with custom DGC-tokened scrollbar.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.14 ScrollArea"
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
4. D:/sources/dgc-miniapp-design-system/project/preview/spacing.html (scrollable lists ref)
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--gray-300, --gray-400, --radius-pill, --dur-fast)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author scroll-area.tsx bundle</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/scroll-area.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.14
    - .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
    - D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - ScrollArea: Root + Viewport + Scrollbar + Thumb + Corner (bundled).
    - Thumb: 8px wide, bg --gray-300 rounded --radius-pill; hover bg --gray-400.
    - type="hover" on Root (Radix): scrollbar visible only on hover/focus.
    - Transition opacity with --dur-fast.
  </behavior>
  <action>
    Create scroll-area.tsx:
    - `import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";`
    - Export ScrollArea = forwardRef wrapping:
      `<ScrollAreaPrimitive.Root className={cn("relative overflow-hidden", className)} type="hover" {...props}>
         <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
         <ScrollBar />
         <ScrollAreaPrimitive.Corner />
       </ScrollAreaPrimitive.Root>`.
    - Export ScrollBar = forwardRef wrapping ScrollAreaPrimitive.ScrollAreaScrollbar with classes:
      `flex touch-none select-none transition-colors data-[orientation=vertical]:w-[8px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:h-[8px] data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-col p-[1px]`
      with Thumb `<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-[var(--radius-pill)] bg-[hsl(var(--gray-300))] hover:bg-[hsl(var(--gray-400))]" />`.
    Unit test: renders wrapper, thumb element exists, classes correct.
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-scroll-area" D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx`
    - `grep -q "var(--gray-300)" D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx`
    - `grep -q "var(--gray-400)" D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx`
    - `grep -q "var(--radius-pill)" D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx`
    - `grep -q 'type="hover"' D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx`
    - `pnpm test:unit -- scroll-area` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- scroll-area</automated></verify>
  <done>ScrollArea bundle + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register scroll-area</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/scroll-area.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
    - D:/sources/dgc-miniapp-shadcn/registry/scroll-area/scroll-area.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry name="scroll-area" (kebab-case per shadcn convention; target components/ui/scroll-area.tsx). Deps ["@radix-ui/react-scroll-area"]. Manifest controls: maxHeight (text default "240px"). Renderer: ScrollArea h-[240px] w-full containing 30 sample list rows (Khmer + Latin).
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"scroll-area\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/scroll-area.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/scroll-area.json</automated></verify>
  <done>scroll-area.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/scroll-area</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/scroll-area.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/scroll-area.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.14 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: ScrollArea height=240px; hover container → scrollbar thumb visible; compute thumb bg color rgb(189,189,189)=--gray-300; mousewheel scrolls viewport.
    a11y: runAxe (scroll region has aria-label).
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep scroll-area && pnpm test:a11y --grep scroll-area` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep scroll-area && pnpm test:a11y --grep scroll-area</automated></verify>
  <done>ScrollArea tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.14-01 | Tampering (supply chain) | @radix-ui/react-scroll-area | mitigate | Pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- scroll-area && npx shadcn build && pnpm test:e2e --grep scroll-area && pnpm test:a11y --grep scroll-area</verification>

<success_criteria>ScrollArea installable; 8px thumb; fades in on hover; keyboard scrollable.</success_criteria>

<output>Create .planning/phases/3-primitives/3-14-SUMMARY.md</output>
