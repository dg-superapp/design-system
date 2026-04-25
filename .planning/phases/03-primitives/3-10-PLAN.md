---
phase: 3
plan_id: 3-10
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/badge.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/badge.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/badge.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/badge.tsx
autonomous: true
requirements: [R4.10]
must_haves:
  truths:
    - "Badge has EXACTLY 4 tones: default, success, warning, danger (no 5th, no info tone in Phase 3)."
    - "Default tone: bg --muted + text --foreground."
    - "Success: --success-bg + --success. Warning: --warning-bg + --warning. Danger: --danger-bg + --danger."
    - "Pill shape: --radius-pill (999px); height 22px; padding 2px 10px; font --text-xs + --weight-medium."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx"
      provides: "CVA Badge with 4 tones"
      min_lines: 25
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Badge primitive (R4.10) with exactly 4 tones via CVA, pill shape, optional leading icon.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.10 Badge"
3. .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3"
4. D:/sources/dgc-miniapp-design-system/project/preview/content-tone.html (tone examples)
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--muted, --success-bg, --success, --warning-bg, --warning, --danger-bg, --danger, --radius-pill)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author badge.tsx (CVA 4 tones)</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/badge.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.10 (4 tones table, pill shape, no info)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3"
    - D:/sources/dgc-miniapp-design-system/project/preview/content-tone.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - 22px height; padding 2px 10px; rounded --radius-pill; --text-xs font-medium; line-height 1.
    - CVA tone: default/success/warning/danger (exactly 4).
    - Optional leading icon slot: 12px from Lucide, inline-flex gap --space-1.
  </behavior>
  <action>
    Create badge.tsx:
    - `import { cva, type VariantProps } from "class-variance-authority";`
    - Base: `inline-flex items-center gap-[var(--space-1)] h-[22px] px-[10px] py-[2px] rounded-[var(--radius-pill)] text-xs font-medium leading-none`.
    - Variants.tone:
      - `default: "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"`
      - `success: "bg-[hsl(var(--success-bg))] text-[hsl(var(--success))]"`
      - `warning: "bg-[hsl(var(--warning-bg))] text-[hsl(var(--warning))]"`
      - `danger:  "bg-[hsl(var(--danger-bg))] text-[hsl(var(--danger))]"`
    - defaultVariants: { tone: "default" }.
    - Export Badge = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>> rendering `<span>`.
    Unit test: 4 tones render distinct bg/fg classes; no 5th tone type-checks fails (test via ts-expect-error comment).
  </action>
  <acceptance_criteria>
    - `grep -q "cva(" D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx`
    - `grep -q "var(--success-bg)" D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx`
    - `grep -q "var(--warning-bg)" D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx`
    - `grep -q "var(--danger-bg)" D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx`
    - `grep -q "var(--radius-pill)" D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx`
    - NOT `grep -q "info" D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx` (4 tones only)
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx`
    - `pnpm test:unit -- badge` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- badge</automated></verify>
  <done>Badge source + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register badge</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/badge.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/content-tone.html
    - D:/sources/dgc-miniapp-shadcn/registry/badge/badge.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry deps ["class-variance-authority","lucide-react"]. Manifest controls: tone (select 4 options), withIcon (boolean), label (Khmer default "ព័ត៌មាន"). Renderer: 4-tone gallery + icon toggle.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"badge\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/badge.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/badge.json</automated></verify>
  <done>badge.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/badge</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/badge.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/badge.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.10 Visual Acceptance
    - D:/sources/dgc-miniapp-design-system/project/preview/content-tone.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: all 4 tone variants visible; each renders distinct bg color (capture computed styles); border-radius 999px; height 22px.
    a11y: runAxe light+dark (contrast 4.5:1 per tone).
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep badge && pnpm test:a11y --grep badge` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep badge && pnpm test:a11y --grep badge</automated></verify>
  <done>Badge tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.10-01 | Tampering (supply chain) | class-variance-authority, lucide-react | mitigate | Pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- badge && npx shadcn build && pnpm test:e2e --grep badge && pnpm test:a11y --grep badge</verification>

<success_criteria>Badge installable; 4 tones; pill shape; WCAG AA contrast per tone.</success_criteria>

<output>Create .planning/phases/3-primitives/3-10-SUMMARY.md</output>
