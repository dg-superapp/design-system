---
phase: 3
plan_id: 3-15
wave: 2
depends_on: [3-00, 3-01, 3-02, 3-03, 3-04, 3-05, 3-06, 3-07, 3-08, 3-09, 3-10, 3-11, 3-12, 3-13, 3-14]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/layout.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/button/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/input/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/textarea/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/select/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/checkbox/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/radio/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/switch/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/label/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/form/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/badge/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/tooltip/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/tabs/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/separator/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/components/scroll-area/page.mdx
  - D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/docs-pages.spec.ts
autonomous: true
requirements: [R9.1, R9.4]
must_haves:
  truths:
    - "14 MDX docs pages exist at /docs/components/<item> — one per primitive."
    - "Each page shows: install command with copy-button (R9.4), props table, variants gallery, bilingual usage example (Khmer + English), link to /preview/<item>."
    - "Install command copies via navigator.clipboard.writeText to `npx shadcn@latest add https://registry.016910804.xyz/r/<name>.json`."
    - "Form page includes explicit 'Client validation only — server MUST re-validate' callout (T-3.09-02 mitigation)."
    - "Government tone respected — no emoji, sentence case, no exclamations."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx"
      provides: "Reusable install-command copy button"
      min_lines: 25
    - path: "D:/sources/dgc-miniapp-shadcn/src/app/docs/components/button/page.mdx"
      provides: "Button docs page"
      min_lines: 40
  key_links:
    - from: "each page.mdx"
      to: "/preview/<item>"
      pattern: "/preview/"
---

<objective>
Author 14 MDX docs pages (R9.1) + shared copy-install button (R9.4) for the entire primitive roster. Depends on all 14 primitive plans being complete (source + registry + playground).
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/src/app/docs/foundations/tokens/page.mdx (Phase 2 layout reference)
2. .planning/phases/3-primitives/3-CONTEXT.md §D-09, D-10
3. .planning/phases/3-primitives/3-UI-SPEC.md (all §2.x — extract prop tables)
4. D:/sources/dgc-miniapp-design-system/project/preview/content-tone.html (government tone)
5. D:/sources/dgc-miniapp-design-system/project/preview/type-bilingual.html (bilingual pairing rule)
6. D:/sources/dgc-miniapp-shadcn/src/components/docs/McxLayout.tsx (Plan 00 layout)
7. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto">
  <name>Task 1: Author CopyInstallButton + docs/components layout</name>
  <files>D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/layout.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx (new)
    - .planning/phases/3-primitives/3-CONTEXT.md §D-10 (install, props, variants, bilingual, playground link)
    - D:/sources/dgc-miniapp-shadcn/src/components/docs/McxLayout.tsx
    - D:/sources/dgc-miniapp-design-system/project/preview/content-tone.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Create `src/components/docs/CopyInstallButton.tsx`:
    - Client component (`"use client"`).
    - Props: `{ name: string }`.
    - Renders `<code>` block showing `npx shadcn@latest add https://registry.016910804.xyz/r/{name}.json` + a Copy button (using Button ghost variant from /components/ui/button).
    - onClick: `navigator.clipboard.writeText(command)` + temporary visual feedback ("Copied" for 1500ms via useState).
    - Uses `<Check>` / `<Copy>` Lucide icons swap on copied state.
    - Style: rounded --radius-md bg --muted padding 12px 14px; code text-xs font-mono.
    Create `src/app/docs/components/layout.tsx`:
    - Nav sidebar listing 14 primitives as links to `/docs/components/<item>`.
    - Main content area renders `{children}`.
    - Preserves existing `/docs/foundations` top-level nav (re-use Phase 2 top nav pattern).
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx`
    - `grep -q "navigator.clipboard" D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx`
    - `grep -q "registry.016910804.xyz/r/" D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx`
    - `test -f D:/sources/dgc-miniapp-shadcn/src/app/docs/components/layout.tsx`
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck</automated></verify>
  <done>Copy button + layout exist and typecheck.</done>
</task>

<task type="auto">
  <name>Task 2: Author 14 MDX docs pages</name>
  <files>D:/sources/dgc-miniapp-shadcn/src/app/docs/components/button/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/input/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/textarea/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/select/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/checkbox/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/radio/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/switch/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/label/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/form/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/badge/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/tooltip/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/tabs/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/separator/page.mdx, D:/sources/dgc-miniapp-shadcn/src/app/docs/components/scroll-area/page.mdx</files>
  <read_first>
    - .planning/phases/3-primitives/3-UI-SPEC.md (ALL §2.x — each page pulls its own sub-section)
    - .planning/phases/3-primitives/3-CONTEXT.md §D-10
    - D:/sources/dgc-miniapp-design-system/project/preview/content-tone.html (tone)
    - D:/sources/dgc-miniapp-design-system/project/preview/type-bilingual.html (Khmer + English side-by-side)
    - D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Create 14 MDX pages at `src/app/docs/components/<item>/page.mdx`. Each page structure (per D-10):
    ```
    # <Title>
    <Brief 1-2 sentence description>

    ## Installation
    <CopyInstallButton name="<item>" />

    ## Props
    | Prop | Type | Default | Description |
    |------|------|---------|-------------|
    ... (hand-written, extract from UI-SPEC §2.x)

    ## Variants
    <gallery of variant examples — import the registered primitive directly from @/registry/<item>/<item> and render inline>

    ## Usage
    ### Khmer / ភាសាខ្មែរ
    ```tsx
    <primitive with Khmer label>
    ```

    ### English
    ```tsx
    <same primitive with English label>
    ```

    ## Playground
    [Open playground →](/preview/<item>)
    ```
    For Form (R4.9) page: add explicit callout after Installation:
    > **Security:** Client validation via Zod is for UX only. Your server MUST re-validate every submission. Never trust a form whose validation happened only in the browser.
    Government tone rules: sentence case, no emoji, no exclamations, no marketing voice.
  </action>
  <acceptance_criteria>
    - All 14 MDX files exist: `for p in button input textarea select checkbox radio switch label form badge tooltip tabs separator scroll-area; do test -f D:/sources/dgc-miniapp-shadcn/src/app/docs/components/$p/page.mdx || exit 1; done`
    - Each contains `CopyInstallButton name="<item>"` and a link `/preview/<item>`.
    - Form page contains the security callout: `grep -q "server MUST re-validate" D:/sources/dgc-miniapp-shadcn/src/app/docs/components/form/page.mdx`.
    - `pnpm build` compiles all MDX routes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm build</automated></verify>
  <done>14 docs pages build; install-command copies; bilingual examples present.</done>
</task>

<task type="auto">
  <name>Task 3: E2E test for docs pages</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/docs-pages.spec.ts</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/src/components/docs/CopyInstallButton.tsx
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
    - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
  </read_first>
  <action>
    Create docs-pages.spec.ts iterating all 14 primitive names:
    - Navigate `/docs/components/<item>`; assert 200 + contains `<item>` title.
    - Assert CopyInstallButton renders (locate text "npx shadcn@latest add").
    - Click Copy button → check navigator.clipboard (use Playwright's `context.grantPermissions(['clipboard-read','clipboard-write'])` then read clipboard content → matches expected URL).
    - Assert link to `/preview/<item>` present.
    Separately test name="copy-install" for `--grep copy-install` matching (include in test description string).
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/tests/e2e/docs-pages.spec.ts`
    - `pnpm test:e2e --grep docs-pages` passes.
    - `pnpm test:e2e --grep copy-install` passes.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep "docs-pages|copy-install"</automated></verify>
  <done>All 14 docs pages reachable and install-copy works.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.15-01 | Tampering (supply chain) | MDX @next/mdx | mitigate | Phase 2 already pinned; pnpm audit. |
</threat_model>

<verification>pnpm typecheck && pnpm build && pnpm test:e2e --grep "docs-pages|copy-install"</verification>

<success_criteria>14 docs pages live; copy-install works clipboard-writes; Form docs includes server-validation callout.</success_criteria>

<output>Create .planning/phases/3-primitives/3-15-SUMMARY.md</output>
