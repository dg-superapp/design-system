---
phase: 3
plan_id: 3-12
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/tabs.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/tabs.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/tabs.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/tabs.tsx
autonomous: true
requirements: [R4.12]
must_haves:
  truths:
    - "Two variants supported: underline (default) + pill."
    - "Underline: active tab has 2px --brand bottom border + --weight-semibold."
    - "Pill: active tab has --card (white) bg + --shadow-1."
    - "Supports controlled (value+onValueChange) AND uncontrolled (defaultValue) per static-specimen-compatible spec."
    - "Arrow keys cycle tabs; Home/End jump to first/last (Radix handled)."
    - "Tab labels use --font-khmer for Khmer, numeric count badges always --font-latin."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx"
      provides: "Radix Tabs bundle with CVA variants"
      min_lines: 80
      exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"]
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Tabs primitive (R4.12) bundling Radix Tabs with underline + pill variants via CVA; supports both controlled + uncontrolled modes.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.12 Tabs" (variants table, count badge spec)
3. .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3"
4. D:/sources/dgc-miniapp-design-system/project/preview/tabs.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--brand, --muted-foreground, --card, --background, --border, --shadow-1, --shadow-focus, --radius-md, --radius-sm, --radius-pill)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author tabs.tsx bundle with CVA variants</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/tabs.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.12 (underline + pill tables)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack" + §"Pattern 3"
    - D:/sources/dgc-miniapp-design-system/project/preview/tabs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - Tabs = Radix Root passthrough (accepts value/defaultValue — controlled + uncontrolled).
    - TabsList underline: flex bg --card rounded --radius-md border 1px --border; 44px tab height.
    - TabsList pill: bg --background border 1px --border padding 4px gap 2px rounded --radius-md; 36px tab height.
    - TabsTrigger underline active: text --brand + font-semibold + 2px --brand bottom underline.
    - TabsTrigger pill active: bg --card + text --brand + shadow-[var(--shadow-1)] + rounded --radius-sm.
    - All triggers: focus-visible shadow --shadow-focus.
  </behavior>
  <action>
    Create tabs.tsx:
    - `import * as TabsPrimitive from "@radix-ui/react-tabs";`
    - `import { cva, type VariantProps } from "class-variance-authority";`
    - Export Tabs = TabsPrimitive.Root passthrough (supports value, defaultValue, onValueChange).
    - Create `tabsListVariants = cva(...)` and `tabsTriggerVariants = cva(...)` with variant="underline"|"pill".
    - Underline TabsList base: `relative flex w-full bg-[hsl(var(--card))] rounded-[var(--radius-md)] border border-[hsl(var(--border))] overflow-hidden`.
    - Underline TabsTrigger: `relative flex-1 h-[44px] px-[var(--space-2)] text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--brand))] data-[state=active]:font-semibold data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-[var(--space-2)] data-[state=active]:after:right-[var(--space-2)] data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[hsl(var(--brand))] data-[state=active]:after:rounded-t-[2px] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed`.
    - Pill TabsList: `inline-flex bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-[4px] gap-[2px] rounded-[var(--radius-md)]`.
    - Pill TabsTrigger: `h-[36px] px-[var(--space-3)] rounded-[var(--radius-sm)] text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] data-[state=active]:bg-[hsl(var(--card))] data-[state=active]:text-[hsl(var(--brand))] data-[state=active]:shadow-[var(--shadow-1)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]`.
    - TabsContent passthrough with mt-[var(--space-3)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)].
    - Props: TabsList + TabsTrigger accept `variant?: "underline"|"pill"` (default underline). Use a context provider to sync variant between List and Trigger (CVA + context).
    Unit test: controlled Tabs switches on click; defaultValue uncontrolled works; underline active shows ::after pseudo-element (snapshot classNames).
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-tabs" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - `grep -q "cva(" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - `grep -q "underline\|pill" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - `grep -q "var(--brand)" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - `grep -q "var(--shadow-1)" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - `grep -q "h-\[44px\]" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx`
    - `pnpm test:unit -- tabs` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- tabs</automated></verify>
  <done>Tabs bundle + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register tabs</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/tabs.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/tabs.html
    - D:/sources/dgc-miniapp-shadcn/registry/tabs/tabs.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry deps ["@radix-ui/react-tabs","class-variance-authority"]. Manifest controls: variant (select underline/pill), withBadges (boolean). Renderer: 3-tab underline demo ("ព័ត៌មាន", "ឯកសារ", "កំណត់"); pill variant gallery.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"tabs\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/tabs.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/tabs.json</automated></verify>
  <done>tabs.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/tabs</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/tabs.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/tabs.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.12 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/tabs.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: click tab switches content; arrow-right cycles to next trigger; Home/End jump; underline variant active has 2px ::after; pill variant active has box-shadow matching --shadow-1.
    a11y: runAxe both variants, both themes.
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep tabs && pnpm test:a11y --grep tabs` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep tabs && pnpm test:a11y --grep tabs</automated></verify>
  <done>Tabs tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.12-01 | Tampering (supply chain) | @radix-ui/react-tabs, CVA | mitigate | Pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- tabs && npx shadcn build && pnpm test:e2e --grep tabs && pnpm test:a11y --grep tabs</verification>

<success_criteria>Tabs installable; underline + pill variants; controlled/uncontrolled; keyboard nav.</success_criteria>

<output>Create .planning/phases/3-primitives/3-12-SUMMARY.md</output>
