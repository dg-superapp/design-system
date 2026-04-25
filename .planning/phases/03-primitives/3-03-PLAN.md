---
phase: 3
plan_id: 3-03
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/textarea.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/textarea.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/textarea.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/textarea.tsx
autonomous: true
requirements: [R4.3]
must_haves:
  truths:
    - "Min-height 88px; resize: vertical only."
    - "Same state matrix as Input (default/focus/error/disabled)."
    - "Khmer text does not clip descenders (coeng subscripts render freely under --leading-loose)."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx"
      provides: "Textarea primitive"
      min_lines: 30
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Textarea primitive (R4.3) with min-height 88px, vertical resize, Input-parity state matrix.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.3 Textarea"
3. .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3"
4. D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author textarea.tsx + unit tests</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/textarea.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.3 (min-height 88px, resize vertical)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3"
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - min-h-[88px]; padding 12px 14px; resize vertical only.
    - Same border/focus/error/disabled states as Input.
  </behavior>
  <action>
    Create textarea.tsx:
    - `forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>`.
    - Classes: `flex min-h-[88px] w-full rounded-[var(--radius-md)] border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-[14px] py-3 text-base resize-y placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:border-[hsl(var(--blue-700))] focus-visible:shadow-[var(--shadow-focus)] aria-[invalid=true]:border-[hsl(var(--danger))] disabled:cursor-not-allowed disabled:bg-[hsl(var(--background))] disabled:text-[hsl(var(--muted-foreground))]`.
    - NO dark:*, NO fixed height.
    Unit test: renders, resize style is "vertical", min-height 88.
  </action>
  <acceptance_criteria>
    - `grep -q "min-h-\[88px\]" D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx`
    - `grep -q "resize-y" D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx`
    - `grep -q "var(--radius-md)" D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx`
    - `pnpm test:unit -- textarea` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- textarea</automated></verify>
  <done>Textarea source + unit green.</done>
</task>

<task type="auto">
  <name>Task 2: Register textarea</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/textarea.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
    - D:/sources/dgc-miniapp-shadcn/registry/textarea/textarea.tsx
  </read_first>
  <action>
    Append item "textarea" to registry.json. Append manifest entry with controls: invalid, disabled, rows, placeholder. Create renderer wrapping Textarea.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"textarea\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/textarea.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/textarea.json</automated></verify>
  <done>textarea.json emitted.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y tests /preview/textarea</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/textarea.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/textarea.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.3 Visual Acceptance Test
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: min-height 88px; resize:vertical computed style; focus ring parity with Input.
    a11y: runAxe both themes.
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep textarea && pnpm test:a11y --grep textarea` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep textarea && pnpm test:a11y --grep textarea</automated></verify>
  <done>Textarea playground + tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.03-01 | Tampering (supply chain) | native HTML textarea | accept | No runtime deps. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- textarea && npx shadcn build && pnpm test:e2e --grep textarea && pnpm test:a11y --grep textarea</verification>

<success_criteria>Textarea installable; min-height 88px; resize vertical; Khmer renders without clipping.</success_criteria>

<output>Create .planning/phases/3-primitives/3-03-SUMMARY.md</output>
