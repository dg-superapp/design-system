---
phase: 3
plan_id: 3-02
wave: 1
depends_on: [3-00]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/input.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/input.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/input.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/input.tsx
autonomous: true
requirements: [R4.2]
must_haves:
  truths:
    - "Default input renders 48px height, --radius-md (12px), 1px --input border."
    - "Focus border changes to --blue-700 (#1565C0) with --shadow-focus ring."
    - "Error state uses --danger border; aria-invalid=true; error message in --danger color."
    - "Date input with lang=km shows Khmer placeholder ថ្ងៃ/ខែ/ឆ្នាំ."
    - "Disabled uses --muted background and --muted-foreground text; cursor: not-allowed."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx"
      provides: "Input primitive with text+date modes"
      min_lines: 40
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Input primitive (R4.2): 48px text/date input with DGC tokens, required asterisk hook, Khmer date placeholder, full state matrix, registry entry, playground, tests.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx (create)
2. D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-UI-SPEC.md §"2.2 Input"
3. D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-RESEARCH.md §"Standard Stack" and §"Pattern 3"
4. D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
5. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--input, --blue-700, --danger, --muted, --muted-foreground, --shadow-focus, --radius-md, --input-h)
</files_to_read>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author input.tsx with state matrix and Khmer date placeholder</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/input.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.2 (dimensions, states, date placeholder)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 3"
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - h-[var(--input-h)] (48px), rounded-[var(--radius-md)] (12px), px-[14px].
    - Default: border 1px solid hsl(var(--input)); bg=var(--card); text=var(--foreground).
    - Focus: border hsl(var(--blue-700)) with shadow-[var(--shadow-focus)].
    - aria-invalid=true: border hsl(var(--danger)).
    - Disabled: bg var(--background); cursor: not-allowed; muted-foreground text.
    - type=date + lang=km → renders Khmer placeholder ថ្ងៃ/ខែ/ឆ្នាំ (via aria-placeholder attribute + CSS :lang(km) ::before content override).
  </behavior>
  <action>
    Create `registry/input/input.tsx`:
    - `forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>` named Input.
    - Apply base classes: `flex h-[var(--input-h)] w-full rounded-[var(--radius-md)] border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-[14px] text-base text-[hsl(var(--foreground))] transition-colors placeholder:text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--gray-400))] focus-visible:outline-none focus-visible:border-[hsl(var(--blue-700))] focus-visible:shadow-[var(--shadow-focus)] aria-[invalid=true]:border-[hsl(var(--danger))] disabled:cursor-not-allowed disabled:bg-[hsl(var(--background))] disabled:text-[hsl(var(--muted-foreground))]`.
    - NO dark:* (D-06). NO lang branching inside component (D-07); handle Khmer date placeholder via a `data-khmer-date` attribute + add a CSS rule at the bottom of input.tsx using a tagged CSS helper OR rely on a global `:lang(km) input[type="date"]::before { content: "ថ្ងៃ/ខែ/ឆ្នាំ"; }` — preferred: add this rule to `registry/dgc-theme/globals.css` in a Khmer-cascade block (amend Plan 00 output). If globals.css amendment out of scope for this plan, put a minimal `<style jsx global>` block in the renderer (playground only) and document the need in SUMMARY.md.
    Create `tests/unit/input.test.tsx`:
    - Renders with default state.
    - aria-invalid applies danger border class.
    - Disabled applies cursor-not-allowed.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx`
    - `grep -q "var(--input-h)" D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx`
    - `grep -q "var(--radius-md)" D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx`
    - `grep -q "var(--shadow-focus)" D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx`
    - `grep -q "blue-700\|--blue-700" D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx`
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx`
    - `pnpm test:unit -- input` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- input</automated></verify>
  <done>Input source + unit tests green.</done>
</task>

<task type="auto">
  <name>Task 2: Register input in registry.json + manifest + playground renderer</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/input.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1"
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Append to registry.json: item "input", type "registry:ui", dependencies empty (pure HTML), registryDependencies [dgc-theme.json], files mapping to components/ui/input.tsx.
    Append to items.manifest.ts: entry name="input", controls: type (select text/date/email), invalid (boolean), disabled (boolean), placeholder (text default "បញ្ចូលអត្ថបទ").
    Create renderers/input.tsx wrapping Input with state from shell.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"input\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `grep -q "dgc-theme.json" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `grep -q "name: \"input\"" D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/input.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && npx shadcn build && test -f public/r/input.json</automated></verify>
  <done>Registry emits input.json; playground wired.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y tests for /preview/input (incl. Khmer date)</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/input.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/input.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.2 Visual Acceptance Test
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: assert input 48px height; focus-visible border-color matches #1565C0 (resolved --blue-700); aria-invalid=true flips border to danger; type=date with lang=km shows Khmer placeholder text (grep computed :before content or aria-placeholder attribute).
    a11y: runAxe on /preview/input (light + dark).
  </action>
  <acceptance_criteria>
    - `grep -q "/preview/input" D:/sources/dgc-miniapp-shadcn/tests/e2e/input.spec.ts`
    - `pnpm test:e2e --grep input && pnpm test:a11y --grep input` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep input && pnpm test:a11y --grep input</automated></verify>
  <done>Input playground + tests green.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.02-01 | Tampering (supply chain) | native HTML input, no external deps | accept | Zero runtime deps; supply-chain surface minimal. |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- input && npx shadcn build && pnpm test:e2e --grep input && pnpm test:a11y --grep input</verification>

<success_criteria>Input primitive installable; state matrix verified; Khmer date placeholder visible.</success_criteria>

<output>Create .planning/phases/3-primitives/3-02-SUMMARY.md</output>
