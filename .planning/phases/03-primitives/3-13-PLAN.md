---
phase: 3
plan_id: 3-13
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/separator.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/separator.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/separator.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/separator.tsx
autonomous: true
requirements: [R4.13]
must_haves:
  truths:
    - "Separator is 1px solid var(--border) — NOT border-muted, NOT hardcoded #E0E0E0."
    - "Horizontal: width 100%, border-top 1px solid var(--border)."
    - "Vertical: height 100%, border-left 1px solid var(--border)."
    - "role=separator + aria-orientation set by Radix."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx"
      provides: "Radix Separator"
      min_lines: 15
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Separator primitive (R4.13): 1px var(--border) line, horizontal or vertical, ARIA-correct.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.13 Separator"
3. .planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack"
4. D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--border)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author separator.tsx</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/separator.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.13 (var(--border), 1px, horizontal/vertical)
    - D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - orientation="horizontal" (default): full width, 1px border-top var(--border).
    - orientation="vertical": full height, 1px border-left var(--border).
    - decorative prop pass-through (Radix aria-semantic control).
  </behavior>
  <action>
    Create separator.tsx:
    - `import * as SeparatorPrimitive from "@radix-ui/react-separator";`
    - forwardRef wrapping Root with classes:
      `shrink-0 bg-[hsl(var(--border))] data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px]`.
    - Pass through orientation + decorative props; Radix handles role/aria-orientation.
    Unit test: horizontal renders h=1px w=full; vertical renders w=1px h=full; bg color resolves to var(--border).
  </action>
  <acceptance_criteria>
    - `grep -q "@radix-ui/react-separator" D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx`
    - `grep -q "var(--border)" D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx`
    - NOT `grep -q "border-muted\|#E0E0E0" D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx`
    - `pnpm test:unit -- separator` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- separator</automated></verify>
  <done>Separator source + unit green.</done>
</task>

<task type="auto">
  <name>Task 2: Register separator</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/separator.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
    - D:/sources/dgc-miniapp-shadcn/registry/separator/separator.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry deps ["@radix-ui/react-separator"]. Manifest controls: orientation (select horizontal/vertical). Renderer: two text blocks divided by horizontal + vertical examples.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"separator\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/separator.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/separator.json</automated></verify>
  <done>separator.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/separator</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/separator.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/separator.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.13 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: horizontal separator 1px height, full width; vertical 1px width; computed bg color rgb(224,224,224)=--border; role=separator; aria-orientation reflects horizontal/vertical.
    a11y: runAxe.
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep separator && pnpm test:a11y --grep separator` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep separator && pnpm test:a11y --grep separator</automated></verify>
  <done>Separator tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.13-01 | Tampering (supply chain) | @radix-ui/react-separator | accept | Thin; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- separator && npx shadcn build && pnpm test:e2e --grep separator && pnpm test:a11y --grep separator</verification>

<success_criteria>Separator installable; 1px --border; orientation ARIA correct.</success_criteria>

<output>Create .planning/phases/3-primitives/3-13-SUMMARY.md</output>
