---
phase: 3
plan_id: 3-09
wave: 2
depends_on: [3-00, 3-02, 3-08]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/form.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/form.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/unit/form.test.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/form.tsx
autonomous: true
requirements: [R4.9]
must_haves:
  truths:
    - "Single registry:ui item 'form' exporting Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription (D-03)."
    - "FormMessage renders errors using text-[hsl(var(--danger))] (NOT text-red-500, NOT --destructive)."
    - "FormMessage uses aria-live='polite' for screen reader announcement."
    - "FormControl passes aria-invalid=true + aria-describedby to child control on error."
    - "zodResolver integration — consumer can useForm({ resolver: zodResolver(schema) })."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx"
      provides: "RHF + Zod form bundle"
      min_lines: 120
      exports: ["Form", "FormField", "FormItem", "FormLabel", "FormControl", "FormMessage", "FormDescription"]
  key_links:
    - from: "registry.json"
      to: "dgc-theme.json + label.json + input.json"
      pattern: "dgc-theme.json"
---

<objective>
Ship Form primitive (R4.9) bundling RHF + Zod with 7 canonical shadcn exports. D-03 locked: single file, not multiple registry items.
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx (create)
2. .planning/phases/3-primitives/3-UI-SPEC.md §"2.9 Form" + §"2.8 Label" (FormLabel inherits Label spec)
3. .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 6: Form (RHF + Zod) Bundle"
4. D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx (FormLabel built on Label)
5. D:/sources/dgc-miniapp-shadcn/registry/input/input.tsx (FormControl wraps children with aria-invalid)
6. D:/sources/dgc-miniapp-design-system/project/preview/inputs.html (error styling)
7. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (--danger, --muted-foreground, --space-1)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Author form.tsx bundle (7 sub-parts)</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx, D:/sources/dgc-miniapp-shadcn/tests/unit/form.test.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx (new)
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.9 (all 7 exports, FormMessage --danger, aria-live)
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 6"
    - D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <behavior>
    - Form = aliased FormProvider from RHF.
    - FormField = typed Controller render prop wrapper.
    - FormItem = div stack, gap --space-1 (4px), provides itemId context.
    - FormLabel = styled Label; connects to FormControl via htmlFor=itemId.
    - FormControl = Slot wrapper that injects aria-invalid + aria-describedby to child Input/Select/Textarea.
    - FormDescription = <p> --text-xs --muted-foreground.
    - FormMessage = <p> with aria-live="polite", text-[hsl(var(--danger))] --text-xs; renders only when error present.
  </behavior>
  <action>
    Create form.tsx following shadcn canonical Form bundle (see RESEARCH §"Pattern 6"):
    - `import { Controller, FormProvider, useFormContext, useForm } from "react-hook-form";`
    - `import { Slot } from "@radix-ui/react-slot";`
    - `import { Label } from "@/components/ui/label";` (consumer path after install) — for registry source, use relative `../label/label` — document in SUMMARY that install-time `target` rewrites this import.
    - Define FormFieldContext + FormItemContext (React contexts for id generation).
    - useFormField hook that reads both contexts + formState.
    - Export:
      - `const Form = FormProvider`.
      - `FormField = ({ ...props }: ControllerProps<TFieldValues, TName>) => <FormFieldContext.Provider value={{ name: props.name }}><Controller {...props} /></FormFieldContext.Provider>`.
      - `FormItem = forwardRef<HTMLDivElement>` — div with `space-y-[var(--space-1)]` + provides id context.
      - `FormLabel = forwardRef` — wraps Label with htmlFor={formItemId} + data-error attribute when error.
      - `FormControl = forwardRef` — Slot that spreads aria-describedby (formDescriptionId + formMessageId when error) + aria-invalid={!!error} onto child.
      - `FormDescription` — `<p id={formDescriptionId} className="text-xs text-[hsl(var(--muted-foreground))]">`.
      - `FormMessage` — `<p id={formMessageId} aria-live="polite" className="text-xs font-medium text-[hsl(var(--danger))]">{body}</p>`. Returns null when no error and no children.
    Unit test:
    - Renders Form with a single FormField.
    - Submit empty required field → FormMessage appears with text-[hsl(var(--danger))] class.
    - Submit valid → FormMessage absent.
  </action>
  <acceptance_criteria>
    - `grep -q "react-hook-form" D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx`
    - `grep -q "FormField\|FormItem\|FormLabel\|FormControl\|FormMessage\|FormDescription" D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx`
    - `grep -q "var(--danger)" D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx`
    - `grep -q "aria-live" D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx`
    - `grep -q "aria-invalid" D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx`
    - NOT `grep -q "text-red-500\|var(--destructive)" D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx` (must be --danger, not --destructive per UI-SPEC §2.9)
    - NOT `grep -q "dark:" D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx`
    - `pnpm test:unit -- form` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit -- form</automated></verify>
  <done>Form bundle exports all 7; error styling --danger; aria-live wired.</done>
</task>

<task type="auto">
  <name>Task 2: Register form</name>
  <files>D:/sources/dgc-miniapp-shadcn/registry.json, D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts, D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/form.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry.json
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 1" + §"Pattern 6"
    - D:/sources/dgc-miniapp-shadcn/registry/form/form.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Registry entry: dependencies ["react-hook-form","zod","@hookform/resolvers","@radix-ui/react-slot","@radix-ui/react-label"]. registryDependencies [dgc-theme.json, label.json, input.json] so consumer gets all deps via cascade.
    Manifest: controls for sample form — fullName (text default "លី សុផាត"), email, country (select). Renderer builds a live Form with zod schema requiring fullName min 2 chars and email format.
  </action>
  <acceptance_criteria>
    - `grep -q "\"name\": \"form\"" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `grep -q "react-hook-form" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `grep -q "label.json\|input.json" D:/sources/dgc-miniapp-shadcn/registry.json`
    - `cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/form.json`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && npx shadcn build && test -f public/r/form.json</automated></verify>
  <done>form.json emitted with cascading registryDependencies.</done>
</task>

<task type="auto">
  <name>Task 3: E2E + a11y /preview/form (validation flow)</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/form.spec.ts, D:/sources/dgc-miniapp-shadcn/tests/a11y/form.a11y.spec.ts</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md §2.9 Visual Acceptance
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 6"
    - D:/sources/dgc-miniapp-design-system/project/preview/inputs.html
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
  </read_first>
  <action>
    e2e: submit with empty fields → FormMessage visible with color rgb(198,40,40) (=--danger --red-700); Input aria-invalid=true; Input border color matches --danger; fill valid values and submit → no errors.
    a11y: runAxe with form in error state (tests aria-live region).
  </action>
  <acceptance_criteria>
    - `pnpm test:e2e --grep form && pnpm test:a11y --grep form` both pass.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep form && pnpm test:a11y --grep form</automated></verify>
  <done>Form tests green; error styling verified.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.09-01 | Tampering (supply chain) | react-hook-form, zod, @hookform/resolvers | mitigate | Pinned versions; pnpm audit. |
| T-3.09-02 | Repudiation (validation bypass) | zod schema client-only | accept | Docs page MUST include explicit "Client validation only — server MUST re-validate" callout (added in Plan 15 form MDX). |
</threat_model>

<verification>pnpm typecheck && pnpm test:unit -- form && npx shadcn build && pnpm test:e2e --grep form && pnpm test:a11y --grep form</verification>

<success_criteria>Form installable; 7 exports; Zod resolver works; error message uses --danger; aria-live wired.</success_criteria>

<output>Create .planning/phases/3-primitives/3-09-SUMMARY.md</output>
