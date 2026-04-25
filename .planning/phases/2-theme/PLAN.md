---
phase: 2-theme
plan: 01
type: execute
wave: 1
depends_on: [1-scaffold]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/scripts/hex-to-hsl.mjs
  - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/theme.css
  - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/registry-item.json
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/src/app/globals.css
  - D:/sources/dgc-miniapp-shadcn/src/app/page.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/docs/foundations/tokens/page.mdx
  - D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx
  - D:/sources/dgc-miniapp-shadcn/registry/hello/registry-item.json
  - D:/sources/dgc-miniapp-shadcn/scripts/visual-diff.mjs
  - D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs
  - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml
  - D:/sources/dgc-miniapp-shadcn/.github/workflows/pr-checks.yml
autonomous: false
requirements: [R3.1, R3.2, R3.3, R3.4, R3.5, R9.3]
user_setup: []

must_haves:
  truths:
    - "Running `npx shadcn@latest add http://registry.016910804.xyz/r/dgc-theme.json` in a scratch Next.js 15 + Tailwind v4 app rewrites `src/app/globals.css` with DGC tokens."
    - "Rendered palette in consumer app visually matches `project/preview/colors-primary.html`, `colors-neutrals.html`, `colors-semantic.html`."
    - "Toggling `<html class=\"dark\">` flips every semantic alias to its dark value (no `[data-theme=\"dark\"]` anywhere)."
    - "Text with `lang=\"km\"` renders in Noto Sans Khmer / Kantumruy Pro / Battambang cascade at `line-height: 1.6`."
    - "Every downstream registry component can declare `registryDependencies: [\"dgc-theme\"]` and inherit the full palette."
    - "The registry preview site itself (registry.016910804.xyz/) dogfoods the theme — landing page swatches match the HTML specimens 1:1."
    - "Existing `hello` component renders with `bg-brand text-brand-foreground` utilities resolving to DGC blue."
  artifacts:
    - path: D:/sources/dgc-miniapp-shadcn/scripts/hex-to-hsl.mjs
      provides: "HEX → HSL channel-triplet converter, zero deps"
      min_lines: 25
    - path: D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/theme.css
      provides: "Full DGC theme CSS (scale, semantic aliases, @theme inline, :root, .dark, @layer base)"
      contains: "@custom-variant dark (&:is(.dark *))"
      min_lines: 170
    - path: D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/registry-item.json
      provides: "registry:theme manifest with cssVars.theme/light/dark + files[]"
      contains: "\"type\": \"registry:theme\""
    - path: D:/sources/dgc-miniapp-shadcn/registry.json
      provides: "Root manifest listing dgc-theme item"
      contains: "dgc-theme"
    - path: D:/sources/dgc-miniapp-shadcn/src/app/globals.css
      provides: "Registry site dogfoods the theme — mirror of theme.css content"
      contains: "--brand"
    - path: D:/sources/dgc-miniapp-shadcn/src/app/page.tsx
      provides: "Landing page with palette + type + space + radius + shadow swatches"
      contains: "Noto Sans Khmer"
    - path: D:/sources/dgc-miniapp-shadcn/src/app/docs/foundations/tokens/page.mdx
      provides: "MDX docs page /docs/foundations/tokens (R9.3)"
    - path: D:/sources/dgc-miniapp-shadcn/scripts/visual-diff.mjs
      provides: "Automated pixel diff between rendered swatches and HTML specimens"
    - path: D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs
      provides: "Scratch-app install smoke test"
  key_links:
    - from: registry/dgc-theme/registry-item.json
      to: registry/dgc-theme/theme.css
      via: "files[0].path + files[0].type = registry:theme"
      pattern: "\"path\":\\s*\"registry/dgc-theme/theme.css\""
    - from: registry.json
      to: registry/dgc-theme/registry-item.json
      via: "items[] entry with name=dgc-theme"
      pattern: "\"name\":\\s*\"dgc-theme\""
    - from: src/app/globals.css
      to: registry/dgc-theme/theme.css
      via: "byte-for-byte copy (dogfood)"
      pattern: "--brand:\\s*var\\(--blue-900\\)"
    - from: registry/hello/registry-item.json
      to: dgc-theme
      via: "registryDependencies: [\"dgc-theme\"]"
      pattern: "\"registryDependencies\":\\s*\\[\\s*\"dgc-theme\"\\s*\\]"
    - from: scripts/hex-to-hsl.mjs
      to: project/colors_and_type.css
      via: "argv[2] input path"
      pattern: "readFileSync\\(argv\\[2\\]"
---

<objective>
Ship `dgc-theme` as a single `registry:theme` item consumable via `npx shadcn@latest add http://registry.016910804.xyz/r/dgc-theme.json`. The theme exports DGC scale tokens (`--blue-*`, `--gray-*`, `--space-*`, `--radius-*`, `--shadow-*`) plus shadcn semantic aliases (`--primary`, `--background`, `--foreground`, `--muted`, `--accent`, `--destructive`, `--ring`, `--border`, `--input`, `--sidebar-*`) for light + dark modes, bilingual font stack, and Khmer `:lang(km)` line-height rule. The registry site dogfoods the theme (its own `globals.css` = theme content). Every downstream item declares `registryDependencies: ["dgc-theme"]`.

Purpose: Phase 2 is the foundation for every Phase 3+ component. No brand color, type, spacing, or dark-mode behavior exists in any component JS — all of it flows from `dgc-theme` tokens. Without this phase, components have no design language.

Output: One registry item (`dgc-theme`), one converter script, two verification scripts, one docs page, an updated root manifest, updated landing page, and a migrated `hello` component. Target workspace `D:/sources/dgc-miniapp-shadcn/`, branch `phase/2-theme`, merged via PR after CI green + human approval.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@D:/sources/dgc-miniapp-design-system/.planning/PROJECT.md
@D:/sources/dgc-miniapp-design-system/.planning/ROADMAP.md
@D:/sources/dgc-miniapp-design-system/.planning/REQUIREMENTS.md
@D:/sources/dgc-miniapp-design-system/.planning/phases/2-theme/RESEARCH.md
@D:/sources/dgc-miniapp-design-system/.planning/phases/2-theme/CONTEXT.md
@D:/sources/dgc-miniapp-design-system/project/colors_and_type.css
@D:/sources/dgc-miniapp-design-system/project/preview/colors-primary.html
@D:/sources/dgc-miniapp-design-system/project/preview/colors-neutrals.html
@D:/sources/dgc-miniapp-design-system/project/preview/colors-semantic.html
@D:/sources/dgc-miniapp-design-system/project/preview/type-specimen.html
@D:/sources/dgc-miniapp-design-system/project/preview/spacing.html
@D:/sources/dgc-miniapp-design-system/project/preview/radii.html
@D:/sources/dgc-miniapp-design-system/project/preview/elevation.html
@D:/sources/dgc-miniapp-design-system/builder/styles.css
@D:/sources/dgc-miniapp-shadcn/src/app/globals.css
@D:/sources/dgc-miniapp-shadcn/registry.json
@D:/sources/dgc-miniapp-shadcn/components.json
@D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml
@D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx
@D:/sources/dgc-miniapp-shadcn/registry/hello/registry-item.json

<interfaces>
<!-- Key contracts executor will write/read. Embedded so no codebase scavenger hunt. -->

### CONTEXT.md locked decisions (NON-NEGOTIABLE)
- **D1** — DGC `--accent` renamed to `--brand`. shadcn `--accent` stays for shadcn's subtle-surface role. DGC CTA uses `bg-brand text-brand-foreground`.
- **D2** — Dark-mode `--success-bg / --warning-bg / --danger-bg / --info-bg` auto-generated via `hsl(var(--success) / 0.15)` pattern. Light mode keeps solid tints.
- **D3** — Drop Moul from font stack. Keep Noto Sans Khmer + Kantumruy Pro + Battambang.
- **D4** — Include shadcn `--sidebar-*` tokens even though Phase 4 SideDrawer uses Radix Dialog (not shadcn Sidebar).

### RESEARCH.md HSL mapping table (spot checks)
- `#0D47A1` -> `216 85% 34%` (`--blue-900` -> `--primary`, `--ring`, `--brand`)
- `#0A2A6B` -> `220 83% 23%` (`--blue-950` -> dark `--primary-foreground`)
- `#42A5F5` -> `207 90% 61%` (`--blue-400` -> dark `--primary`, dark `--ring`)
- `#F5F7FA` -> `216 33% 97%` (`--gray-050` -> `--background`, `--muted`)
- `#212121` -> `0 0% 13%`   (`--gray-900` -> `--foreground`)
- `#C62828` -> `0 66% 47%`  (`--red-700`  -> `--destructive`)
- `#2E7D32` -> `123 46% 34%` (`--green-700` -> `--success`)
- `#F9A825` -> `37 95% 56%`  (`--amber-700` -> `--warning`)
- `#0288D1` -> `201 98% 41%` (`--info-600`  -> `--info`)

### registry-item.json contract (shadcn v4)
```ts
interface RegistryItem {
  name: string;                 // "dgc-theme"
  type: "registry:theme";
  title?: string;
  description?: string;
  dependencies: string[];       // [] — theme has no npm deps
  registryDependencies: string[]; // [] — theme is the root
  files: Array<{
    path: string;               // "registry/dgc-theme/theme.css"
    type: "registry:theme";
    target?: string;            // optional; CLI uses components.json > tailwind.css
  }>;
  cssVars: {
    theme: Record<string, string>;  // font-sans, font-mono, radius
    light: Record<string, string>;  // HSL triplets, no hsl() wrapper
    dark: Record<string, string>;
  };
  docs?: string;                // link to /docs/foundations/tokens
}
```

### theme.css file order (Pitfall 6)
`@import url(fonts)` -> `@import "tailwindcss"` -> `@custom-variant dark (&:is(.dark *))` -> `@theme inline { ... }` -> `:root { ... }` -> `.dark { ... }` -> `@layer base { ... }`.

### Downstream component contract (R3.5)
```jsonc
{
  "name": "hello",
  "type": "registry:ui",
  "registryDependencies": ["dgc-theme"],
  "files": [{ "path": "registry/hello/hello.tsx", "type": "registry:ui:component" }]
}
```

### Phase 1 existing state (D:/sources/dgc-miniapp-shadcn/)
- `components.json > tailwind.css = "src/app/globals.css"` — CLI will auto-target.
- `registry.json` currently has one `hello` item (Phase 1 placeholder).
- `src/app/globals.css` is the Phase 1 Tailwind v4 scaffold — Phase 2 overwrites with the DGC theme.
- Branch protection on `main` active — PRs only, CI green + 1 approval required.
</interfaces>
</context>

<tasks>

<!-- Wave 0 (branch + converter) -->

<task type="auto">
  <name>Task 1: Branch + HEX->HSL converter script</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/scripts/hex-to-hsl.mjs
    D:/sources/dgc-miniapp-shadcn/scripts/hex-to-hsl.spec.mjs
  </files>
  <action>
In `D:/sources/dgc-miniapp-shadcn/`:

1. `git checkout main && git pull && git checkout -b phase/2-theme`.
2. Create `scripts/hex-to-hsl.mjs` verbatim from RESEARCH.md §"HEX -> HSL Converter" (the ~40-line Node ESM script). Zero deps. Signature: `node scripts/hex-to-hsl.mjs <path-to-colors_and_type.css>` prints `  --token-name: H S% L%;  /* #HEX */` lines to stdout.
3. Add `--verify` flag: when invoked as `node scripts/hex-to-hsl.mjs --verify`, the script reads the committed `project/colors_and_type.css` AND a golden table (hardcoded inline at top of script) and exits 1 if any conversion drifts. Golden entries (exactly, from RESEARCH.md mapping table):
   - `blue-900` -> `216 85% 34%`
   - `blue-950` -> `220 83% 23%`
   - `blue-400` -> `207 90% 61%`
   - `gray-050` -> `216 33% 97%`
   - `gray-900` -> `0 0% 13%`
   - `red-700`  -> `0 66% 47%`
   - `green-700` -> `123 46% 34%`
   - `amber-700` -> `37 95% 56%`
   - `info-600`  -> `201 98% 41%`
4. Create sibling `scripts/hex-to-hsl.spec.mjs` — tiny self-contained test using `node:assert` that asserts `hexToHsl("#0D47A1") === "216 85% 34%"` and 4 other spot checks. Runnable via `node scripts/hex-to-hsl.spec.mjs`.
5. Addresses Pitfall 2 indirectly: the emitted output has NO `hsl(...)` wrapper.
6. Commit: `git add scripts/hex-to-hsl.mjs scripts/hex-to-hsl.spec.mjs && git commit -m "feat(2-theme): HEX->HSL converter with golden-table --verify"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && node scripts/hex-to-hsl.spec.mjs && node scripts/hex-to-hsl.mjs ../dgc-miniapp-design-system/project/colors_and_type.css | head -20 && node scripts/hex-to-hsl.mjs --verify</automated>
  </verify>
  <done>Spec asserts pass; `--verify` exits 0; converter output for `#0D47A1` line reads exactly `  --blue-900: 216 85% 34%;  /* #0D47A1 */`; commit present on `phase/2-theme`.</done>
</task>

<!-- Wave 1 (theme source + manifest) -->

<task type="auto">
  <name>Task 2: Author registry/dgc-theme/theme.css (full token export)</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/theme.css
  </files>
  <action>
Create `registry/dgc-theme/theme.css` as the canonical DGC theme CSS. Use RESEARCH.md §"registry/dgc-theme/theme.css (full content)" as the literal starting point, then apply all 4 CONTEXT.md decisions:

**File order (Pitfall 6 — do NOT deviate):**
1. `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kantumruy+Pro:wght@400;500;600;700&family=Noto+Sans+Khmer:wght@400;500;600;700&family=Battambang:wght@400;700&display=swap");`
2. `@import "tailwindcss";`
3. `@custom-variant dark (&:is(.dark *));`
4. `@theme inline { ... }` block
5. `:root { ... }` block
6. `.dark { ... }` block
7. `@layer base { ... }` block

**D1 (rename `--accent` -> `--brand`):**
- Add to `:root`: `--brand: var(--blue-900); --brand-foreground: 0 0% 100%; --brand-hover: 217 87% 30%; --brand-press: 217 88% 26%;`
- Add to `.dark`: `--brand: 207 90% 61%; --brand-foreground: 220 83% 23%;`
- Inside `@theme inline`, expose: `--color-brand: hsl(var(--brand)); --color-brand-foreground: hsl(var(--brand-foreground));`
- shadcn's own `--accent` KEEPS its subtle-surface role: `--accent: var(--gray-100); --accent-foreground: var(--gray-900);` (light) and `--accent: 221 46% 19%; --accent-foreground: 217 39% 94%;` (dark).
- Do NOT create `--accent-dgc` (rejected in favor of `--brand`).

**D2 (dark-mode alert backgrounds):**
- Light `:root`: `--success-bg: var(--green-100); --warning-bg: var(--amber-100); --danger-bg: var(--red-100); --info-bg: var(--info-100);` (triplets).
- `.dark` override: since triplets cannot carry alpha, ship pre-computed dark-tinted HSL triplets derived from the semantic fg with the `color-mix(in hsl, ..., hsl(var(--background)))` at 15% pattern, approximated as:
  - dark `--success-bg: 123 30% 14%;`
  - dark `--warning-bg: 37 35% 14%;`
  - dark `--danger-bg:  0 35% 16%;`
  - dark `--info-bg:   201 35% 15%;`
  Ship these triplets. Revisit Phase 5 if Alert contrast fails.

**D3 (drop Moul):**
- `--font-khmer: "Noto Sans Khmer", "Kantumruy Pro", "Battambang", system-ui, sans-serif;`
- `--font-latin: "Inter", "Roboto", system-ui, -apple-system, sans-serif;`
- `--font-sans: var(--font-latin), var(--font-khmer), system-ui, sans-serif;`
- Font `@import url(...)` must NOT include `Moul`.

**D4 (include `--sidebar-*`):**
In `:root`:
```
--sidebar: var(--gray-050);
--sidebar-foreground: var(--gray-900);
--sidebar-primary: var(--blue-900);
--sidebar-primary-foreground: 0 0% 100%;
--sidebar-accent: var(--gray-100);
--sidebar-accent-foreground: var(--gray-900);
--sidebar-border: var(--gray-200);
--sidebar-ring: var(--blue-900);
```
In `.dark`, mirror dark surfaces: `--sidebar: 226 49% 8%; --sidebar-foreground: 217 39% 94%; --sidebar-primary: 207 90% 61%; --sidebar-primary-foreground: 220 83% 23%; --sidebar-accent: 221 46% 19%; --sidebar-accent-foreground: 217 39% 94%; --sidebar-border: 222 36% 22%; --sidebar-ring: 207 90% 61%;`
Expose inside `@theme inline`: `--color-sidebar: hsl(var(--sidebar));` plus all 7 siblings.

**Pitfall 2 — no `hsl()` wrappers in CSS-var values.** Every color value in `:root` and `.dark` is a bare HSL triplet like `216 85% 34%` OR `var(--blue-900)`. NEVER `hsl(216 85% 34%)`.

**Pitfall 3 — no `@tailwind base;` / `@tailwind components;` / `@tailwind utilities;` directives.** Only `@import "tailwindcss";`.

**Pitfall 4 — `--radius: 0.75rem;` is mandatory in `:root`.** Derived `--radius-xs: 4px; --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-pill: 999px;` ship alongside.

**Pitfall 5 — dark selector is `.dark`, never `[data-theme="dark"]`.**

**`@layer base` must include:**
- `* { @apply border-border outline-ring/50; }`
- `html, body` font + color + background setup
- `:lang(km), [lang="km"], .khmer { font-family: var(--font-khmer); line-height: var(--leading-loose); }` (R3.3 Khmer cascade — REQUIRED)
- `:where(button, a, input, select, textarea):focus-visible { outline: none; box-shadow: var(--shadow-focus); border-radius: var(--radius-sm); }`
- `@media (prefers-reduced-motion: reduce) { ... animation-duration: 0ms !important; }`

**Full DGC scale** (all 30 tokens) lives in `:root` per RESEARCH.md mapping table. Include type scale (`--text-*`), weights (`--weight-*`), line heights (`--leading-*`), spacing (`--space-1` through `--space-8`), screen/gutter, shadows (`--shadow-0` through `--shadow-3` plus `--shadow-focus`), motion (`--ease-standard`, `--dur-*`), touch targets (`--touch-min: 44px; --button-h: 48px; --input-h: 48px;`), and gradients (`--gradient-hero`, `--bg-overlay`).

Expected final file length: 170-220 lines.

Commit: `git add registry/dgc-theme/theme.css && git commit -m "feat(2-theme): author dgc-theme.css with HSL triplets + .dark + :lang(km)"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && test -f registry/dgc-theme/theme.css && node -e "const s=require('fs').readFileSync('registry/dgc-theme/theme.css','utf8');const fail=[];if(!s.includes('--brand:'))fail.push('missing --brand');if(!s.includes('@custom-variant dark'))fail.push('missing @custom-variant');if(s.includes('[data-theme'))fail.push('has [data-theme] — must use .dark');if(s.match(/--\w+:\s*hsl\(/))fail.push('hsl() wrapper in var value');if(!s.includes('--radius: 0.75rem'))fail.push('missing --radius');if(!s.includes(':lang(km)'))fail.push('missing :lang(km)');if(s.includes('Moul'))fail.push('Moul present — D3 drop');if(!s.includes('--sidebar:'))fail.push('missing --sidebar (D4)');if(fail.length){console.error('FAIL:',fail);process.exit(1)}console.log('theme.css OK:',s.split('\n').length,'lines')"</automated>
  </verify>
  <done>All 8 assertions pass (brand, no [data-theme], no hsl() wrapper, --radius, :lang(km), no Moul, sidebar present, @custom-variant dark). File 170+ lines. Commit present.</done>
</task>

<task type="auto">
  <name>Task 3: Create registry-item.json + update root registry.json</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/registry-item.json
    D:/sources/dgc-miniapp-shadcn/registry.json
  </files>
  <action>
1. Create `registry/dgc-theme/registry-item.json` per RESEARCH.md §"registry-item.json fragment", extended for D1 and D4:
```jsonc
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "dgc-theme",
  "type": "registry:theme",
  "title": "DGC MiniApp Theme",
  "description": "Khmer-first DGC design tokens — color, type, spacing, radius, shadow — for Tailwind v4 + shadcn.",
  "dependencies": [],
  "registryDependencies": [],
  "files": [
    { "path": "registry/dgc-theme/theme.css", "type": "registry:theme" }
  ],
  "cssVars": {
    "theme": {
      "font-sans": "var(--font-latin), var(--font-khmer), system-ui, sans-serif",
      "font-mono": "'JetBrains Mono', 'Roboto Mono', ui-monospace, monospace",
      "radius": "0.75rem"
    },
    "light": { /* all 18 shadcn aliases + --brand + --brand-foreground + 8 --sidebar-* — HSL triplets */ },
    "dark":  { /* same keys, dark values */ }
  },
  "docs": "https://registry.016910804.xyz/docs/foundations/tokens"
}
```
Populate `cssVars.light` and `cssVars.dark` with all keys listed in RESEARCH.md §"shadcn aliases" + D1 `brand`/`brand-foreground` + D4 `sidebar`/`sidebar-foreground`/`sidebar-primary`/`sidebar-primary-foreground`/`sidebar-accent`/`sidebar-accent-foreground`/`sidebar-border`/`sidebar-ring`. Do NOT wrap values in `hsl(...)` (Pitfall 2). Do NOT include `target` in `files[]` entry (RESEARCH.md §file layout — CLI auto-detects via components.json).

2. Edit `registry.json` at repo root. Read current file first. Add a `dgc-theme` entry to `items[]` ABOVE the existing `hello` entry. Keep `hello` (will be migrated in Task 7). Bump `meta.version` to `"0.2.0"`. If Phase 1's `registry.json` uses per-item `"$ref": "./registry/<name>/registry-item.json"` pattern, follow the same pattern for `dgc-theme`. If it inlines full item JSON, inline the full item. Preserve Phase 1's convention byte-for-byte.

3. Run `pnpm dlx shadcn@latest build` to emit `public/r/dgc-theme.json`. Must exit 0.

4. Commit: `git add registry/dgc-theme/registry-item.json registry.json && git commit -m "feat(2-theme): register dgc-theme in root manifest, bump meta.version 0.2.0"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm dlx shadcn@latest build && test -f public/r/dgc-theme.json && node -e "const j=JSON.parse(require('fs').readFileSync('public/r/dgc-theme.json','utf8'));const fail=[];if(j.type!=='registry:theme')fail.push('type');if(!j.cssVars?.light?.primary)fail.push('light.primary');if(!j.cssVars?.dark?.primary)fail.push('dark.primary');if(!j.cssVars?.light?.brand)fail.push('light.brand (D1)');if(!j.cssVars?.light?.['sidebar-primary'])fail.push('sidebar-primary (D4)');if(j.cssVars.light.primary.includes('hsl('))fail.push('hsl() wrapper in value (Pitfall 2)');if(j.cssVars.light.primary!=='216 85% 34%')fail.push('primary HSL mismatch: got '+j.cssVars.light.primary);if(!j.files?.[0]?.path?.includes('theme.css'))fail.push('files[0]');if(fail.length){console.error('FAIL:',fail);process.exit(1)}console.log('dgc-theme.json OK')"</automated>
  </verify>
  <done>`shadcn build` exits 0; `public/r/dgc-theme.json` exists and schema-valid; primary = `216 85% 34%`; brand + sidebar-* present; no `hsl()` wrappers in values; commit present.</done>
</task>

<!-- Wave 2 (dogfood + migrate hello) -->

<task type="auto">
  <name>Task 4: Overwrite src/app/globals.css (registry site dogfoods the theme)</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/src/app/globals.css
    D:/sources/dgc-miniapp-shadcn/scripts/check-dogfood.mjs
  </files>
  <action>
Replace the entire contents of `src/app/globals.css` with a byte-for-byte copy of `registry/dgc-theme/theme.css`. Rationale: the registry preview site at registry.016910804.xyz/ renders its own theme exactly as a consumer would see it after install. This is the smoke test you see every time you load the site.

Implementation:
```bash
cp registry/dgc-theme/theme.css src/app/globals.css
```

Add a single leading comment line to make the dogfood explicit:
```css
/* DGC registry dogfood — this file MUST stay byte-identical to registry/dgc-theme/theme.css. */
```

Also create `scripts/check-dogfood.mjs` — a 10-line Node script that reads both files, strips the dogfood comment from `globals.css`, and compares the rest. Exits 1 on drift. Used by CI in Task 10.

Commit: `git add src/app/globals.css scripts/check-dogfood.mjs && git commit -m "feat(2-theme): dogfood dgc-theme in registry site globals.css + drift check"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && node scripts/check-dogfood.mjs && pnpm build</automated>
  </verify>
  <done>`scripts/check-dogfood.mjs` exits 0; `pnpm build` completes without Tailwind v4 errors; commit present.</done>
</task>

<task type="auto">
  <name>Task 5: Rewrite src/app/page.tsx as token reference page</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/src/app/page.tsx
    D:/sources/dgc-miniapp-shadcn/src/components/docs/Swatch.tsx
    D:/sources/dgc-miniapp-shadcn/src/components/docs/TokenTable.tsx
  </files>
  <action>
Overwrite `src/app/page.tsx` with a landing page that renders the DGC token reference. This page serves 3 purposes: (a) public landing for registry.016910804.xyz, (b) smoke test — if the theme is broken, this page is obviously broken, (c) visual parity baseline for Task 8 diff script.

Extract two reusable components first so Task 6 MDX can share them:
- `src/components/docs/Swatch.tsx` — props `{ token: string; hslTriplet: string; hex?: string; shadcnAlias?: string }`. Renders a tile with `style={{ background: \`hsl(var(--\${token}))\` }}` plus a label below. Sets `data-token={token}` for Task 8 selectors.
- `src/components/docs/TokenTable.tsx` — takes an array of swatch defs and renders them in a grid.

Sections in `src/app/page.tsx` (in order, each with an h2 heading):

1. **Hero** — "DGC MiniApp Design System" + install command `npx shadcn@latest add http://registry.016910804.xyz/r/dgc-theme.json` in a copy-paste `<code>` block. Subtitle mentions "Khmer-first". Use `bg-brand text-brand-foreground` for the hero CTA button (D1 verification).
2. **Primary palette** — Swatch grid mirroring `project/preview/colors-primary.html`. One swatch per blue-* token (`--blue-050` through `--blue-950`). Mirror layout 1:1 with the HTML specimen.
3. **Neutrals** — Same pattern for `--white`, `--gray-050` through `--gray-950`. Mirror `colors-neutrals.html`.
4. **Semantic palette** — Swatches for `--success`, `--success-bg`, `--warning`, `--warning-bg`, `--danger`, `--danger-bg`, `--info`, `--info-bg`. Mirror `colors-semantic.html`.
5. **Type scale** — Each `--text-*` token rendered as a paragraph at that size, labeled. Include one Latin specimen (`The quick brown fox jumps over the lazy dog`) and one Khmer specimen (`កម្ពុជា អក្សរខ្មែរ សាកល្បង`) per scale to verify `:lang(km)` cascade. Khmer paragraphs wrapped in `<p lang="km">`.
6. **Spacing** — Grid showing `--space-1` through `--space-8` as visible blocks. Mirror `spacing.html`.
7. **Radii** — Squares demonstrating `--radius-xs` / `sm` / `md` / `lg` / `pill`. Mirror `radii.html`.
8. **Shadows / Elevation** — Cards with `--shadow-0` through `--shadow-3` + `--shadow-focus`. Mirror `elevation.html`.
9. **Dark mode toggle** — A client-side button (use `"use client"` on a small client island) that toggles `document.documentElement.classList.toggle('dark')`. No `next-themes` dep required.
10. **Hello component preview** — Render `<Hello>` (from Task 7) once to show it uses `bg-brand text-brand-foreground`.

Every swatch MUST have a stable `data-token="blue-900"` attribute so Task 8's visual-diff script can locate them.

Commit: `git add src/app/page.tsx src/components/docs/ && git commit -m "feat(2-theme): token reference landing page with dark toggle + reusable Swatch/TokenTable"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm build && pnpm tsc --noEmit && grep -q "data-token=\"blue-900\"" src/app/page.tsx src/components/docs/Swatch.tsx && grep -q "bg-brand" src/app/page.tsx && grep -q "lang=\"km\"" src/app/page.tsx</automated>
  </verify>
  <done>`pnpm build` + `tsc --noEmit` succeed; `data-token="blue-900"`, `bg-brand`, and `lang="km"` markers present; commit present.</done>
</task>

<task type="auto">
  <name>Task 6: MDX docs page /docs/foundations/tokens (R9.3)</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/src/app/docs/foundations/tokens/page.mdx
    D:/sources/dgc-miniapp-shadcn/next.config.mjs
    D:/sources/dgc-miniapp-shadcn/package.json
  </files>
  <action>
REQUIREMENTS.md R9.3 and ROADMAP.md Phase 2 Scope both cite `/docs/foundations/tokens`. This task delivers it.

1. Install MDX support if not already present:
   ```bash
   pnpm add -D @next/mdx @mdx-js/react @mdx-js/loader
   ```
   Update `next.config.mjs` per Next 15 docs: `import withMDX from '@next/mdx'; export default withMDX()({ pageExtensions: ['ts','tsx','md','mdx'] });`. Preserve any existing `output: 'export'` setting (Phase 1 deploys to Pages — static export required).

2. Create `src/app/docs/foundations/tokens/page.mdx` with sections:
   - Heading: "Design Tokens"
   - Install command: `npx shadcn@latest add http://registry.016910804.xyz/r/dgc-theme.json`
   - Color palette tables (one per family: Primary, Neutral, Semantic). Each row: token name, swatch JSX (import from `src/components/docs/Swatch.tsx` from Task 5), HSL triplet, hex source, shadcn alias (if any).
   - Type scale table
   - Spacing / radius / shadow tables
   - Dark mode section: how to toggle (`<html class="dark">`), what changes.
   - Khmer section: how `:lang(km)` works, sample rendered text with + without lang, copy note about setting lang at `<html>` level (Pitfall 8).
   - D1 callout: "DGC legacy `--accent` is now `--brand`. Use `bg-brand` utilities for CTA."

3. Ensure route `/docs/foundations/tokens` renders via `pnpm dev` and in `pnpm build` output.

Commit: `git add -A && git commit -m "feat(2-theme): MDX docs page /docs/foundations/tokens (R9.3)"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm build && test -f src/app/docs/foundations/tokens/page.mdx && (ls out/docs/foundations/tokens/index.html 2>/dev/null || ls .next/server/app/docs/foundations/tokens 2>/dev/null)</automated>
  </verify>
  <done>Static export (or `next build`) produces an HTML file at `/docs/foundations/tokens`; MDX file exists; commit present.</done>
</task>

<task type="auto">
  <name>Task 7: Port Hello to theme tokens + declare registryDependencies</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx
    D:/sources/dgc-miniapp-shadcn/registry/hello/registry-item.json
  </files>
  <action>
1. Edit `registry/hello/hello.tsx`. Replace whatever Phase-1 placeholder styling it uses with `bg-brand text-brand-foreground` on the primary button/badge. Also swap any hardcoded colors to semantic utilities (`bg-background text-foreground`, `border-border`). Confirms D1 works end-to-end.

2. Edit `registry/hello/registry-item.json`:
   - Add `"registryDependencies": ["dgc-theme"]` (R3.5).
   - Keep `type: "registry:ui"` and file list unchanged.

3. Re-run `pnpm dlx shadcn@latest build`. Verify `public/r/hello.json` now lists `dgc-theme` in `registryDependencies`.

4. Commit: `git add registry/hello/hello.tsx registry/hello/registry-item.json && git commit -m "feat(2-theme): port hello to bg-brand + registryDependencies[dgc-theme] (R3.5)"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm dlx shadcn@latest build && node -e "const j=JSON.parse(require('fs').readFileSync('public/r/hello.json','utf8'));if(!j.registryDependencies?.includes('dgc-theme')){console.error('hello missing dgc-theme dep');process.exit(1)}console.log('hello deps OK')" && grep -q "bg-brand" registry/hello/hello.tsx</automated>
  </verify>
  <done>`hello.json` contains `"registryDependencies":["dgc-theme"]`; `hello.tsx` uses `bg-brand`; commit present.</done>
</task>

<!-- Wave 3 (verification scripts + CI + PR) -->

<task type="auto">
  <name>Task 8: Visual-diff script (automated palette parity check)</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/scripts/visual-diff.mjs
    D:/sources/dgc-miniapp-shadcn/package.json
  </files>
  <action>
Implement automated palette parity between the registry site's rendered swatches and the HTML specimens in `D:/sources/dgc-miniapp-design-system/project/preview/colors-*.html`. Purpose: catch any HSL drift (ROADMAP Phase 2 exit criterion: "visually matches colors-*.html").

1. Install Playwright if not already present:
   ```bash
   pnpm add -D @playwright/test
   pnpm dlx playwright install chromium
   ```

2. Create `scripts/visual-diff.mjs` that:
   a. Assumes `pnpm start` is already serving the registry site at `http://localhost:3000` (script prints a helpful error if not; CI starts server before running).
   b. Opens Playwright, loads `http://localhost:3000/`.
   c. For each `data-token="..."` swatch element on the page, reads the computed `background-color` via `getComputedStyle`.
   d. Loads each `project/preview/colors-{primary,neutrals,semantic}.html` as `file://` URLs. Inspect the HTML files first to determine swatch selectors (class names, inline styles, or data attributes); do not guess.
   e. For each matched pair, compute Euclidean distance on sRGB channels. Threshold: `|deltaR| + |deltaG| + |deltaB| <= 3` per channel (accounts for rounding in HSL->RGB browser math).
   f. Print a table of token / specimen-rgb / rendered-rgb / delta / PASS|FAIL.
   g. Exit 1 if any token fails.

3. Wire into `package.json` scripts: `"test:visual": "node scripts/visual-diff.mjs"`.

4. Commit: `git add scripts/visual-diff.mjs package.json pnpm-lock.yaml && git commit -m "feat(2-theme): visual-diff script for palette parity (deltaRGB <= 3)"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm build && (pnpm start > /tmp/server.log 2>&1 &) && sleep 6 && pnpm test:visual; EXIT=$?; pkill -f "pnpm start" 2>/dev/null; exit $EXIT</automated>
  </verify>
  <done>Script executes without throwing; every swatch reports PASS; exit code 0; commit present.</done>
</task>

<task type="auto">
  <name>Task 9: Scratch-consumer smoke-install script</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs
    D:/sources/dgc-miniapp-shadcn/package.json
  </files>
  <action>
Implement the R3 phase gate: prove that a fresh consumer can install `dgc-theme` via the CLI and end up with a working globals.css.

Create `scripts/smoke-consumer.mjs` that:

1. Creates a temp dir via `fs.mkdtempSync(path.join(os.tmpdir(), 'dgc-smoke-'))`.
2. Runs `pnpm create next-app@15 .` there with flags `--ts --tailwind --eslint --app --src-dir --import-alias "@/*"` non-interactively. Fall back to `npx create-next-app@15` if `pnpm create` doesn't accept flags cleanly.
3. Runs `pnpm dlx shadcn@latest init -y -d` (default style).
4. Runs `pnpm dlx shadcn@latest add http://localhost:3000/r/dgc-theme.json` (requires the registry repo's `pnpm start` running — script header documents this).
5. Reads the scratch app's `src/app/globals.css` AFTER install. Asserts:
   - Contains `--brand` (D1 marker)
   - Contains `--sidebar-primary` (D4 marker)
   - Contains `.dark {` (Pitfall 5)
   - Contains `:lang(km)` (R3.3)
   - Does NOT contain `[data-theme="dark"]` (Pitfall 5)
   - Does NOT contain `@tailwind base` (Pitfall 3)
   - Does NOT contain `hsl(hsl(` (Pitfall 2 — no double-wrap)
   - Does NOT contain `Moul` (D3)
6. Runs `pnpm build` in the scratch app. Must exit 0.
7. Cleans up temp dir on success. On failure, leaves temp dir and prints its path for inspection.

Add `"test:smoke": "node scripts/smoke-consumer.mjs"` to `package.json`.

Commit: `git add scripts/smoke-consumer.mjs package.json && git commit -m "feat(2-theme): scratch-consumer smoke-install verifier"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm build && (pnpm start > /tmp/server.log 2>&1 &) && sleep 6 && pnpm test:smoke; EXIT=$?; pkill -f "pnpm start" 2>/dev/null; exit $EXIT</automated>
  </verify>
  <done>Smoke script exits 0; all 8 grep assertions pass; scratch app `pnpm build` succeeds; commit present.</done>
</task>

<task type="auto">
  <name>Task 10: Extend CI with pr-checks.yml (lint + verify + visual-diff + smoke)</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/.github/workflows/pr-checks.yml
    D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml
  </files>
  <action>
1. Read current `.github/workflows/deploy.yml` (Phase 1 scaffold). Leave it responsible for push-to-main deploys — only add a lint step if missing.

2. Create NEW `.github/workflows/pr-checks.yml` triggered on `pull_request` to `main`:
   ```yaml
   name: pr-checks
   on:
     pull_request:
       branches: [main]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with: { version: 10 }
         - uses: actions/setup-node@v4
           with: { node-version: 20, cache: pnpm }
         - run: pnpm install --frozen-lockfile
         - run: pnpm lint
         - run: node scripts/hex-to-hsl.spec.mjs
         - run: node scripts/hex-to-hsl.mjs --verify
         - run: pnpm dlx shadcn@latest build
         - run: node scripts/check-dogfood.mjs
         - run: pnpm build
         - run: pnpm dlx playwright install --with-deps chromium
         - name: Start server
           run: pnpm start & npx wait-on http://localhost:3000
         - run: pnpm test:visual
         - run: pnpm test:smoke
   ```

3. Add `npx wait-on` to devDeps if not present: `pnpm add -D wait-on`.

4. Flag to user (in human-actions section): branch protection on `main` must require `pr-checks / build` status before merge — configure in GitHub UI if not already set.

5. Commit: `git add .github/workflows/pr-checks.yml package.json && git commit -m "ci(2-theme): add pr-checks workflow with lint + visual-diff + smoke-consumer"`.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && test -f .github/workflows/pr-checks.yml && grep -q "test:visual" .github/workflows/pr-checks.yml && grep -q "hex-to-hsl.spec" .github/workflows/pr-checks.yml && grep -q "test:smoke" .github/workflows/pr-checks.yml && grep -q "check-dogfood" .github/workflows/pr-checks.yml</automated>
  </verify>
  <done>`pr-checks.yml` exists with all 5 verification steps (lint, spec, --verify, dogfood, visual, smoke); commit present; ready to trigger on PR open.</done>
</task>

<task type="auto">
  <name>Task 11: Open PR phase/2-theme -> main via gh</name>
  <files>(none — meta task)</files>
  <action>
1. Push the branch: `git push -u origin phase/2-theme`.

2. Open PR via `gh`:
```bash
gh pr create --base main --head phase/2-theme --title "Phase 2: ship dgc-theme registry item" --body "$(cat <<'EOF'
## Summary
- Ships `dgc-theme` as a single `registry:theme` item with HSL-triplet tokens, bilingual font stack, `.dark` toggle, and `:lang(km)` cascade.
- Migrates `hello` to declare `registryDependencies: ["dgc-theme"]` (R3.5).
- Registry site dogfoods its own theme (src/app/globals.css = theme.css byte-for-byte).
- Adds HEX->HSL converter (golden-table --verify), visual-diff script, scratch-consumer smoke install.
- Adds MDX docs page `/docs/foundations/tokens` (R9.3).
- CI: new `pr-checks.yml` runs lint + converter spec + schema validate + dogfood drift check + visual-diff + smoke-consumer.

## Decisions honored (CONTEXT.md)
- D1 — DGC `--accent` renamed to `--brand`; shadcn `--accent` keeps subtle-surface role.
- D2 — Dark-mode alert backgrounds auto-generated via dark-tinted HSL triplets.
- D3 — Moul dropped from Phase 2 font stack.
- D4 — shadcn `--sidebar-*` tokens included.

## Requirements closed
- R3.1, R3.2, R3.3, R3.4, R3.5, R9.3

## Test plan
- [x] `node scripts/hex-to-hsl.spec.mjs` passes
- [x] `node scripts/hex-to-hsl.mjs --verify` passes (golden HSL triplets)
- [x] `pnpm dlx shadcn@latest build` emits valid `public/r/dgc-theme.json`
- [x] `pnpm build` succeeds
- [x] `pnpm test:visual` — rendered swatches match `project/preview/colors-*.html` (deltaRGB <= 3)
- [x] `pnpm test:smoke` — scratch consumer install + build succeeds
- [ ] Human: visit preview URL; toggle dark mode; verify Khmer line-height; review theme.css diff; approve + merge.

## Exit criterion (ROADMAP Phase 2)
`npx shadcn@latest add https://registry.016910804.xyz/r/dgc-theme.json` in scratch app produces globals.css matching specimens — verified by `scripts/smoke-consumer.mjs` + `scripts/visual-diff.mjs`.
EOF
)"
```

3. Wait for CI. If `pr-checks` fails, fix the failing step locally, commit, push — the PR re-runs automatically. Do NOT force-push.

4. Print the PR URL for the user. Hand off to Task 12 human checkpoint.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && gh pr view --json state,url,statusCheckRollup --jq '{state, url, checks: [.statusCheckRollup[] | {name, conclusion}]}' | tee /tmp/pr-state.json && test "$(jq -r .state /tmp/pr-state.json)" = "OPEN" && jq -e '.checks | all(.conclusion == "SUCCESS" or .conclusion == null or .conclusion == "PENDING")' /tmp/pr-state.json</automated>
  </verify>
  <done>PR open; all CI checks either SUCCESS or still running (none FAILED); PR URL printed.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 12: Human review + merge PR (branch protection)</name>
  <what-built>
Complete `dgc-theme` registry item:
- `registry/dgc-theme/theme.css` (full DGC theme — scale + aliases + `:lang(km)` + `.dark`)
- `registry/dgc-theme/registry-item.json` + updated root `registry.json` (meta.version 0.2.0)
- Registry site dogfoods theme (src/app/globals.css = theme.css)
- Updated landing page `src/app/page.tsx` with palette / type / space / radius / shadow swatches + dark-mode toggle
- MDX docs page `/docs/foundations/tokens`
- Migrated `hello` component using `bg-brand text-brand-foreground` with `registryDependencies: ["dgc-theme"]`
- Three new scripts: `hex-to-hsl.mjs` (converter + --verify), `visual-diff.mjs` (palette parity), `smoke-consumer.mjs` (scratch-install)
- New CI workflow `.github/workflows/pr-checks.yml` running all of the above on every PR
  </what-built>
  <how-to-verify>
1. **Visit the PR preview deployment** (Vercel / Netlify / Pages preview URL from PR comments, or deploy locally with `pnpm dev`):
   - Open `/` — palette swatches render, colors match `project/preview/colors-primary.html`, `colors-neutrals.html`, `colors-semantic.html` side-by-side in browser.
   - Toggle dark mode via the on-page button. Every semantic surface flips to the dark palette (background shifts to `226 49% 8%`, primary shifts to `207 90% 61%`, etc.).
   - Find the Khmer specimen paragraph — confirm line-height visibly looser (1.6) vs Latin (1.5).
   - Find the "Hello" component — confirm its button is DGC blue (`bg-brand`), not shadcn default gray.
   - Visit `/docs/foundations/tokens` — MDX docs render with tables + swatches.

2. **Review CI status on the PR page** — every check (`lint`, `build`, `visual-diff`, `smoke-consumer`) must show green.

3. **Spot-check the diff** of `registry/dgc-theme/theme.css`:
   - `--primary: var(--blue-900);` + `--blue-900: 216 85% 34%;`
   - `.dark { --primary: 207 90% 61%; ... }` (uses `.dark`, NOT `[data-theme=...]`)
   - `:lang(km)` rule in `@layer base`
   - No `Moul` string anywhere
   - No `hsl(hsl(` or `hsl(` wrapper in `--*:` values
   - `--brand` + `--sidebar-*` present

4. **If all checks pass:** click "Approve" then merge (squash or merge-commit per team preference). Branch protection requires >=1 approval + all checks green.

5. **If anything fails:** comment on the PR with specifics and request fixes. The executor (next Claude session) reads PR comments, fixes, and pushes new commits.
  </how-to-verify>
  <resume-signal>Type "merged" once PR is merged to `main` and deploy workflow has completed. Type "changes-needed: &lt;description&gt;" to request revisions.</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Google Fonts CDN -> consumer app | Theme CSS `@import url(fonts.googleapis.com)` pulls font CSS from external origin. If CDN compromised, every DGC consumer loads malicious CSS. |
| Registry repo -> consumer CLI -> consumer app `globals.css` | `shadcn add` merges untrusted remote CSS into consumer's bundle. Any commit on `phase/2-theme` that lands in `main` ships to every consumer on next install. |
| Converter script -> committed theme.css values | Build-time HEX->HSL conversion; if converter has a bug, every downstream color is wrong (availability of correct brand). |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-2-01 | Tampering | `registry/dgc-theme/theme.css` shipped via `shadcn add` | mitigate | Branch protection on `main`: PRs only, >=1 approval, all CI green required (inherited Phase 1). CODEOWNERS entry `registry/dgc-theme/ @user` added in Task 10 CI commit. |
| T-2-02 | Tampering | Google Fonts CDN in `@import url(...)` | accept | Low risk — Google operational; shadcn ecosystem norm. Documented in MDX docs so consumers needing air-gapped deploys can substitute `next/font`. |
| T-2-03 | Information Disclosure | Committed `registry-item.json` / `theme.css` containing secrets | mitigate | Task 3 verify uses JSON.parse + schema validate; no secrets fields in registry-item schema. Task 12 human review checks diff. |
| T-2-04 | Denial of Service | Malformed CSS breaks consumer build after upgrade | mitigate | `scripts/smoke-consumer.mjs` runs on every PR in `pr-checks.yml` — broken theme blocks merge. `meta.version` bump (`0.2.0`) lets consumers pin. |
| T-2-05 | Elevation of Privilege | Theme CSS executes JS via `expression()` or `url(javascript:...)` | mitigate | Theme CSS is static, reviewed. `pr-checks.yml` adds grep assertion `! grep -E "expression\(|javascript:" registry/dgc-theme/theme.css`. |
| T-2-06 | Tampering | Dogfood drift between `src/app/globals.css` and `registry/dgc-theme/theme.css` | mitigate | Task 10 CI runs `scripts/check-dogfood.mjs` — PR fails on drift. |
| T-2-07 | Spoofing | Consumer installs tampered registry from DNS-hijacked `registry.016910804.xyz` | accept | HTTPS via GitHub Pages TLS; users trust `016910804.xyz` DNS. Same trust model as Phase 1. |
</threat_model>

<verification>
**Full phase gate (run before final PR merge, in `D:/sources/dgc-miniapp-shadcn/`):**

```bash
# 1. Converter sanity
node scripts/hex-to-hsl.spec.mjs
node scripts/hex-to-hsl.mjs --verify

# 2. Build
pnpm lint
pnpm dlx shadcn@latest build
pnpm build

# 3. Dogfood drift
node scripts/check-dogfood.mjs

# 4. Theme.css invariants (zero output means no violation)
! grep -n "\[data-theme" registry/dgc-theme/theme.css
! grep -nE "hsl\(hsl\(|--\w+:\s*hsl\(" registry/dgc-theme/theme.css
! grep -n "@tailwind " registry/dgc-theme/theme.css
! grep -n "Moul" registry/dgc-theme/theme.css
grep -n "--brand:" registry/dgc-theme/theme.css
grep -n "--sidebar:" registry/dgc-theme/theme.css
grep -n ":lang(km)" registry/dgc-theme/theme.css
grep -n "@custom-variant dark" registry/dgc-theme/theme.css
grep -n "^\\.dark " registry/dgc-theme/theme.css
grep -n "--radius: 0.75rem" registry/dgc-theme/theme.css

# 5. Emitted JSON integrity
node -e "const j=JSON.parse(require('fs').readFileSync('public/r/dgc-theme.json','utf8'));console.assert(j.type==='registry:theme');console.assert(j.cssVars.light.primary==='216 85% 34%');console.assert(j.cssVars.dark.primary==='207 90% 61%');console.assert(j.cssVars.light.brand);console.assert(j.cssVars.light['sidebar-primary']);console.log('OK')"

# 6. Hello downstream contract
node -e "const j=JSON.parse(require('fs').readFileSync('public/r/hello.json','utf8'));console.assert(j.registryDependencies.includes('dgc-theme'));console.log('OK')"

# 7. Visual parity (start server: pnpm start)
pnpm test:visual    # all swatches deltaRGB <= 3

# 8. Smoke install (start server: pnpm start)
pnpm test:smoke     # scratch consumer install + build succeeds

# 9. Production endpoint (after merge + deploy — any shell)
curl -sSL https://registry.016910804.xyz/r/dgc-theme.json | jq '.type, .cssVars.light.primary, .cssVars.dark.primary'
# Expect: "registry:theme", "216 85% 34%", "207 90% 61%"
```
</verification>

<success_criteria>
Phase 2 complete when ALL of:

- [ ] `registry/dgc-theme/theme.css` committed, >=170 lines, passes all grep invariants (§verification step 4).
- [ ] `registry/dgc-theme/registry-item.json` committed with `type: registry:theme`, full `cssVars.theme/light/dark`.
- [ ] Root `registry.json` lists `dgc-theme` above `hello`; `meta.version: "0.2.0"`.
- [ ] `pnpm dlx shadcn@latest build` exits 0; emits valid `public/r/dgc-theme.json` matching schema.
- [ ] `src/app/globals.css` byte-matches `registry/dgc-theme/theme.css` (dogfood CI check green).
- [ ] `src/app/page.tsx` renders palette + type + space + radius + shadow swatches + dark toggle; TypeScript + build clean.
- [ ] `/docs/foundations/tokens` MDX page renders in build output.
- [ ] `registry/hello/registry-item.json` declares `registryDependencies: ["dgc-theme"]`; `hello.tsx` uses `bg-brand`.
- [ ] `scripts/hex-to-hsl.spec.mjs` passes; `--verify` golden table passes.
- [ ] `scripts/visual-diff.mjs` reports all swatches PASS (deltaRGB <= 3) against `project/preview/colors-*.html`.
- [ ] `scripts/smoke-consumer.mjs` exits 0 — scratch Next.js 15 app successfully installs theme via `shadcn add` and builds.
- [ ] `.github/workflows/pr-checks.yml` present and green on the Phase 2 PR.
- [ ] PR `phase/2-theme` -> `main` approved by human reviewer and merged.
- [ ] Post-merge: `https://registry.016910804.xyz/r/dgc-theme.json` returns valid JSON with `cssVars.light.primary === "216 85% 34%"`.

**ROADMAP Phase 2 exit criterion (primary gate):**
> `npx shadcn add .../r/dgc-theme.json` in scratch app produces a `globals.css` that visually matches `project/preview/colors-*.html`.

Satisfied by Task 9 (smoke-consumer) + Task 8 (visual-diff) + Task 12 (human sign-off on preview URL).
</success_criteria>

<dependency_graph>
```
Task 1 (converter)
   |
   v
Task 2 (theme.css) ---> Task 3 (registry-item.json + registry.json)
                   |                |
                   +--> Task 4 (dogfood globals.css)
                                    |
                              Task 5 (page.tsx + Swatch/TokenTable)
                                    |
                              Task 6 (MDX docs)
                                    |
                              Task 7 (hello port)
                                    |
                           +--------+--------+
                           v                 v
                   Task 8 (visual-diff)  Task 9 (smoke)
                           |                 |
                           +--------+--------+
                                    v
                             Task 10 (CI pr-checks.yml)
                                    |
                                    v
                             Task 11 (gh PR)
                                    |
                                    v
                             Task 12 (human checkpoint)
```

All tasks are sequential in practice — each depends on artifacts from the previous. Parallelism between Tasks 5/6/7 and between Tasks 8/9 is possible but low-value given single-executor execution.
</dependency_graph>

<risks>
Lifted from RESEARCH.md §Pitfalls + CONTEXT.md decision footguns. Each has a mitigation baked into a specific task.

1. **DGC `--accent` vs shadcn `--accent` collision (Pitfall 1, D1).**
   Mitigation: renamed to `--brand`. Task 2 adds `--brand` in `:root` + `.dark`. Task 7 verifies `hello.tsx` uses `bg-brand`. CI greps for `--brand:` in theme.css (Task 10).

2. **`hsl()` wrapper in CSS-var value (Pitfall 2).**
   Mitigation: Task 2 verify asserts no `--\w+:\s*hsl\(`. Task 3 verify asserts emitted JSON has no `hsl(` in values. Converter (Task 1) emits bare triplets only.

3. **Tailwind v3 `@tailwind` directives leaking into merged CSS (Pitfall 3).**
   Mitigation: theme.css has no such directives (Task 2 verify). Smoke script (Task 9) asserts consumer globals.css has none after install.

4. **Missing `--radius` breaks every rounded component (Pitfall 4).**
   Mitigation: Task 2 verify asserts `--radius: 0.75rem` present. Task 3 verify asserts `cssVars.theme.radius` present.

5. **`[data-theme="dark"]` regression (Pitfall 5, R3.4).**
   Mitigation: Task 2 verify asserts NO `[data-theme` in theme.css. Smoke (Task 9) asserts same in consumer CSS. Visual-diff (Task 8) implicitly verifies by toggling `.dark` and expecting palette flip.

6. **`@theme inline` block before `:root` — build-order misfire (Pitfall 6).**
   Mitigation: Task 2 action specifies exact file order. Task 4 dogfood + `pnpm build` surfaces any build-time failure.

7. **Dark-mode alert backgrounds look wrong (RESEARCH Open Q3, D2).**
   Mitigation: D2 locks dark-tinted HSL triplets. Revisit Phase 5 Alert component. Flagged non-blocking for Phase 2.

8. **`next/font` + `@import url()` double font loading (Pitfall 7).**
   Mitigation: MDX docs (Task 6) documents the trade-off. Registry keeps `@import` for portability; consumers using `next/font` can opt out.

9. **`:lang(km)` doesn't cascade into Radix portals (Pitfall 8).**
   Mitigation: MDX docs (Task 6) documents "set `lang` on `<html>`, not deep wrappers". Flagged Phase 3 verification target. Does not block Phase 2.

10. **HSL triplet pass-through assumption (RESEARCH A1).**
    Mitigation: Task 9 smoke-consumer verifies end-to-end by inspecting merged globals.css. If shadcn CLI wraps values in `hsl(...)` at merge time, `! grep "hsl(hsl(" globals.css` catches it.

11. **Branch protection blocks direct merge.**
    Mitigation: Task 11 opens PR; Task 12 checkpoint awaits human approval + merge. Workflow expectation, not a technical risk.
</risks>

<human_actions>
Actions NOT automatable by Claude (minimal set):

1. **Task 12 — Review + approve + merge PR** (branch protection requires >=1 human approval).
2. **First-time only — Configure branch protection on `main`** to require `pr-checks / build` status (GitHub UI: Settings -> Branches -> main -> Branch protection rules -> Require status checks). Flag if not already configured.
3. **First-time only — Enable GitHub Actions write permission to Pages** (Settings -> Actions -> General -> Workflow permissions: Read and write). Should already be set from Phase 1.

Everything else (creating branch, committing, pushing, running CI, building, testing, opening PR via `gh`) is automated.
</human_actions>

<open_questions>
1. **Does `registry.json` at root use per-item `$ref` pointers or inline item JSON?** Task 3 instructs executor to preserve Phase 1 convention after reading the current file. Planner assumes either works.

2. **Does Phase 1 `hello.tsx` expose a button to receive `bg-brand`?** If it is a div-only placeholder, Task 7 adds a small button inside it. Executor adapts based on what exists.

3. **Does Phase 1 `next.config.mjs` set `output: 'export'`?** Task 6 preserves the setting when wiring MDX. Verify path test accommodates both `out/` (static export) and `.next/server/app/` (default).

4. **Is `meta.version` accepted by the current shadcn registry schema?** Task 3 sets `"meta": { "version": "0.2.0" }`. If `shadcn build` rejects it, move to a top-level `version` or comment-only marker.

5. **Is `wait-on` needed in CI, or does GitHub Actions `curl --retry` suffice?** Task 10 uses `npx wait-on` for readability. Swap if lockfile bloat is undesirable.
</open_questions>

<output>
After completion, create `D:/sources/dgc-miniapp-design-system/.planning/phases/2-theme/2-theme-01-SUMMARY.md` following `$HOME/.claude/get-shit-done/templates/summary.md`, covering:
- What shipped (files created/modified with links)
- Decisions honored (D1-D4 with evidence)
- Requirements closed (R3.1-R3.5, R9.3 with verification commands)
- Pitfalls avoided (all 8 with concrete code location)
- CI pipeline state (pr-checks.yml + deploy.yml green)
- Exit criterion status (smoke-consumer + visual-diff output)
- Hand-off to Phase 3 (how Phase 3 primitive components will consume `dgc-theme`)
</output>
