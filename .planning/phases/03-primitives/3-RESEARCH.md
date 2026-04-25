# Phase 3: Primitives (14 items) — Research

**Researched:** 2026-04-24
**Domain:** shadcn registry:ui primitives — Radix, CVA, RHF+Zod, Playwright a11y, Khmer rendering
**Confidence:** HIGH (registry schema + token layer verified from live repo; Radix/CVA/RHF versions verified via npm registry search; shadcn CLI patterns confirmed from official docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01** CVA (`class-variance-authority`) for all variant surfaces — Button, Badge, Input/Textarea/Select state classes.
- **D-02** Variant tokens pulled from `dgc-theme` CSS vars — write Tailwind utilities reading `var(--)`, not raw hex.
- **D-03** `Form` ships as a single `registry:ui` item; `files` array includes `form.tsx` exporting `Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription`.
- **D-04** `Select` and `Tabs` bundle their Radix sub-parts into one file per parent item.
- **D-05** Every primitive is a single JSON artifact at `/r/<name>.json`; sub-parts are NOT separate `registry:ui` items.
- **D-06** Dark mode via `dgc-theme` CSS var flips under `.dark` only — NO `dark:*` Tailwind utilities in primitive source.
- **D-07** Khmer via global `:lang(km)` cascade — NO per-component `lang` branching in source.
- **D-08** Every primitive tested under `lang="km"` on `/test/khmer` page.
- **D-09** Docs at `app/docs/components/<item>/page.mdx`.
- **D-10** Each docs page includes: install command, props table, variants gallery, bilingual example, link to playground.
- **D-11** Dynamic route `app/preview/[item]/page.tsx` driven by `registry/items.manifest.ts`.
- **D-12** Playground controls: React state + typed prop controls. No runtime JSX eval.
- **D-13** Three global playground toggles: theme (light/dark), language (en/km), mobile viewport (375×812).
- **D-14** Each item's registry JSON: `type: "registry:ui"`, npm `dependencies`, `registryDependencies: ["https://registry.016910804.xyz/r/dgc-theme.json"]`.
- **D-15** Icon dependencies use `lucide-react`.
- **D-16** Playwright + `@axe-core/playwright` on CI — `pnpm test:a11y`.
- **D-17** `/test/khmer` page — Playwright visual-diff snapshot.
- **D-18** Focus-ring via `--shadow-focus` on `:focus-visible`.
- **D-19** Extend smoke consumer with `SMOKE_WITH_PRIMITIVES=1` mode.

### Claude's Discretion
- Exact file structure per item (match shadcn canonical layout).
- Props table generation mechanism (static preferred).
- CSS token naming — prefer semantic aliases (`--primary`, `--ring`) over scale tokens where both work.
- Whether to expose `asChild` (Radix `Slot`) on interactive primitives — yes by default.
- Test snapshot tool — `@playwright/test` built-in snapshots.
- Docs MDX layout component shape.

### Deferred Ideas (OUT OF SCOPE)
- Dialog, Sheet, Toast, Alert, Empty, Skeleton, Spinner (Phase 5).
- AppHeader, HeroBanner, SegmentedTabs, StepIndicator, NavRow, SideDrawer (Phase 4).
- Table, InfoRow, DocumentListRow, TimestampTag, ServiceTile, FileUploader, MinistryPicker, FormScreen, MobileFrame, ServiceGrid (Phase 6).
- Production DGC icon set (Lucide placeholder continues).
- Bearer-auth private registry, `/v1/` versioning (v2).
- npm package publishing.
- Props-table auto-generation pipeline (Phase 7).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| R4.1 | Button — 4 variants (primary, secondary, ghost, ghost-danger), sizes (default/sm), icon slot, disabled uses `--bg-disabled` + `--fg-on-disabled` | CVA pattern section; DGC token map; visual spec verified |
| R4.2 | Input (text, date) — 48px height, `--radius-md`, focus ring, required `*`, Khmer date placeholder | Input spec section; token map |
| R4.3 | Textarea — min-height 88px, resizable, same border/radius/focus rules | Input spec extended |
| R4.4 | Select — Radix primitive, same visual spec as Input | Radix `@radix-ui/react-select` version confirmed |
| R4.5 | Checkbox — Radix, 18px box, custom check glyph, `--accent` fill | Radix `@radix-ui/react-checkbox` version confirmed |
| R4.6 | Radio — Radix group, 999px circle, white dot on `--accent` | Radix `@radix-ui/react-radio-group` |
| R4.7 | Switch — Radix, track 40×24, thumb 18px, `--accent` track when on | Radix `@radix-ui/react-switch` version confirmed |
| R4.8 | Label — `--text-body-sm` + `--weight-medium`, required asterisk `--red-600` | No Radix dep; HTML `<label>` + CVA |
| R4.9 | Form — RHF + Zod wrapper, error styling `--danger` | RHF + `@hookform/resolvers` + Zod pattern |
| R4.10 | Badge — 4 tones (default, success, warning, danger) paired `*-bg` + fg | CVA tones section |
| R4.11 | Tooltip — Radix, `--gray-900` bg, `--radius-sm`, `--text-caption` | `@radix-ui/react-tooltip` |
| R4.12 | Tabs — Radix, static-specimen-compatible + optional active state | `@radix-ui/react-tabs` |
| R4.13 | Separator — Radix, `1px solid var(--border)` | `@radix-ui/react-separator` |
| R4.14 | ScrollArea — Radix, for drawer/sheet content | `@radix-ui/react-scroll-area` |
| R9.1 | MDX docs page per item — install cmd, props table, variants gallery, bilingual example | MDX pattern from Phase 2 docs |
| R9.4 | Install command copy-button on every item page | Phase 2 MDX layout already has copy-button pattern |
</phase_requirements>

---

## Summary

Phase 3 ships 14 `registry:ui` primitives on top of the Phase 2 `dgc-theme` token layer already live at `registry.016910804.xyz`. The technical foundation is solid: Next.js 15, Tailwind v4, shadcn CLI 4.4.0, React 19, and a verified token CSS pipeline (globals.css, HSL triplets, `.dark`, `:lang(km)`) are all in the target repo.

The canonical approach is to take each shadcn upstream component as a starting point and swap its default token classes (`bg-primary`, `text-primary-foreground`, etc.) for the DGC semantic aliases already registered in `@theme inline`. Because D-06 forbids `dark:*` utilities and D-07 forbids per-component `lang` branching, the components themselves are simpler than upstream — all theming is delegated to `dgc-theme`'s CSS var cascade. The main implementation work is (1) authoring 14 TSX files with correct DGC dimensions/tokens, (2) writing 14 registry JSON entries, (3) wiring the dynamic playground, (4) writing MDX docs pages, and (5) adding the a11y + Khmer CI gates.

**Primary recommendation:** Follow the shadcn canonical bundle exactly (same export names, same file conventions, same `asChild` Radix `Slot` on interactive primitives), then override only the token classes — this maximises downstream compatibility with shadcn tooling and keeps implementation decisions minimal.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `class-variance-authority` | 0.7.1 [VERIFIED: npm search] | Variant API for Button, Badge, Input states | shadcn canonical; D-01 locked |
| `@radix-ui/react-checkbox` | 1.3.3 [VERIFIED: npm search] | Checkbox primitive | D-04 mandate |
| `@radix-ui/react-radio-group` | latest (1.x) [ASSUMED] | Radio group primitive | D-04 mandate |
| `@radix-ui/react-switch` | 1.2.6 [VERIFIED: npm search] | Switch primitive | D-04 mandate |
| `@radix-ui/react-select` | 2.2.6 [VERIFIED: npm search] | Select primitive | D-04 mandate |
| `@radix-ui/react-tabs` | 1.1.13 [VERIFIED: npm search] | Tabs primitive | D-04 mandate |
| `@radix-ui/react-tooltip` | latest (1.x) [ASSUMED] | Tooltip primitive | D-04 mandate |
| `@radix-ui/react-separator` | latest (1.x) [ASSUMED] | Separator primitive | D-04 mandate |
| `@radix-ui/react-scroll-area` | 1.2.10 [VERIFIED: npm search] | ScrollArea primitive | D-04 mandate |
| `@radix-ui/react-label` | latest (2.x) [ASSUMED] | Label (used inside Form) | shadcn canonical |
| `@radix-ui/react-slot` | latest (1.x) [ASSUMED] | `asChild` pattern on Button, Tooltip.Trigger | shadcn canonical |
| `react-hook-form` | 7.x [ASSUMED, compat with React 19] | Form state management | D-03 locked |
| `@hookform/resolvers` | 5.2.2 [VERIFIED: npm search] | Zod bridge for RHF | D-03 locked |
| `zod` | 3.x [ASSUMED] | Schema validation | D-03 locked |
| `lucide-react` | latest [ASSUMED] | Icon slot dependency | D-15 locked |

### Supporting (dev/test only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@axe-core/playwright` | latest [ASSUMED] | Accessibility scan in CI | D-16 locked |
| `@playwright/test` | comes with playwright dep | a11y + visual diff test runner | D-16, D-17 |

### Installation (new deps to add to target repo)

```bash
cd D:/sources/dgc-miniapp-shadcn

# Runtime deps (will land in consumer via registry JSON dependencies field)
pnpm add class-variance-authority lucide-react react-hook-form zod @hookform/resolvers \
  @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch \
  @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-tooltip \
  @radix-ui/react-separator @radix-ui/react-scroll-area \
  @radix-ui/react-label @radix-ui/react-slot

# Dev deps (CI only, not shipped to consumer)
pnpm add -D @axe-core/playwright @playwright/test
```

**Version verification note:** Radix packages not explicitly confirmed via search above are tagged `[ASSUMED]`. Before writing registry JSON, run `npm view @radix-ui/react-<name> version` for each. The pattern is stable — all Radix packages follow `1.x` or `2.x` for select/label.

---

## Architecture Patterns

### Project Structure (new additions to target repo)

```
D:/sources/dgc-miniapp-shadcn/
├── registry/
│   ├── dgc-theme/          # Phase 2 (exists)
│   ├── hello/              # Phase 1 (exists)
│   ├── button/
│   │   └── button.tsx
│   ├── input/
│   │   └── input.tsx
│   ├── textarea/
│   │   └── textarea.tsx
│   ├── select/
│   │   └── select.tsx      # bundles SelectTrigger/Content/Item/etc.
│   ├── checkbox/
│   │   └── checkbox.tsx
│   ├── radio/
│   │   └── radio.tsx       # bundles RadioGroup + RadioGroupItem
│   ├── switch/
│   │   └── switch.tsx
│   ├── label/
│   │   └── label.tsx
│   ├── form/
│   │   └── form.tsx        # bundles Form/FormField/FormItem/FormLabel/FormControl/FormMessage/FormDescription
│   ├── badge/
│   │   └── badge.tsx
│   ├── tooltip/
│   │   └── tooltip.tsx     # bundles TooltipProvider/Tooltip/TooltipTrigger/TooltipContent
│   ├── tabs/
│   │   └── tabs.tsx        # bundles TabsList/TabsTrigger/TabsContent
│   ├── separator/
│   │   └── separator.tsx
│   └── scroll-area/
│       └── scroll-area.tsx
├── registry/
│   └── items.manifest.ts   # NEW — playground + docs routing
├── src/app/
│   ├── docs/
│   │   ├── foundations/    # Phase 2 (exists)
│   │   └── components/     # NEW
│   │       ├── button/page.mdx
│   │       ├── input/page.mdx
│   │       ├── ... (14 total)
│   ├── preview/
│   │   └── [item]/
│   │       └── page.tsx    # NEW dynamic route
│   └── test/
│       └── khmer/
│           └── page.tsx    # NEW Khmer visual diff page
├── playwright/
│   └── a11y.spec.ts        # NEW axe checks per /preview/<item>
```

### Pattern 1: Registry JSON for a Primitive

Every `registry:ui` item follows this shape. The `registryDependencies` URL installs `dgc-theme` automatically on first consumer add. The `dependencies` field lists the npm packages the CLI will install in the consumer project.

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "DGC-branded button with 4 variants, 2 sizes, icon slot, and WCAG AA disabled state.",
  "dependencies": ["class-variance-authority", "lucide-react", "@radix-ui/react-slot"],
  "registryDependencies": ["https://registry.016910804.xyz/r/dgc-theme.json"],
  "files": [
    {
      "path": "registry/button/button.tsx",
      "type": "registry:ui",
      "target": "components/ui/button.tsx"
    }
  ],
  "cssVars": {}
}
```

**Key schema rules** [VERIFIED: shadcn docs search]:
- `type` must be `"registry:ui"` for component items.
- `registryDependencies` accepts full HTTPS URLs to remote registry items — the CLI resolves them automatically.
- `target` is optional for `registry:ui` but recommended to explicitly land in `components/ui/<name>.tsx`.
- `cssVars` should be `{}` for primitives — they inherit all vars from `dgc-theme`; adding vars here would inject into consumer globals.css unnecessarily.
- The `$schema` URL for the **item** file is `https://ui.shadcn.com/schema/registry-item.json` (different from the root registry `https://ui.shadcn.com/schema/registry.json`).

### Pattern 2: Root registry.json entry

Append each primitive to the `items` array in `registry.json`:

```json
{
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "...",
  "dependencies": ["class-variance-authority", "lucide-react", "@radix-ui/react-slot"],
  "registryDependencies": ["https://registry.016910804.xyz/r/dgc-theme.json"],
  "files": [
    { "path": "registry/button/button.tsx", "type": "registry:ui", "target": "components/ui/button.tsx" }
  ],
  "cssVars": {}
}
```

The root `registry.json` entry and `registry/<item>/registry-item.json` (if used) must stay in sync. With shadcn CLI 4.x, the single `registry.json` is sufficient; a per-item `registry-item.json` is optional and only needed if the item needs its own `$schema` declaration.

### Pattern 3: CVA with DGC Tokens

```typescript
// Source: shadcn canonical + DGC token overlay
// D-06: NO dark: utilities. D-02: use semantic var utilities only.
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  // base
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--radius-md)] font-medium text-base",
    "h-[var(--button-h)]",                // 48px (--button-h from dgc-theme)
    "px-5",
    "transition-colors duration-[var(--dur-fast)]",
    "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
    "disabled:pointer-events-none disabled:bg-[var(--bg-disabled)] disabled:text-[var(--fg-on-disabled)]",
    // D-18: focus ring via --shadow-focus (not ring-* utilities)
  ],
  {
    variants: {
      variant: {
        primary:      "bg-brand text-brand-foreground hover:bg-brand-hover active:bg-brand-press",
        secondary:    "bg-[var(--blue-050)] text-brand hover:bg-[var(--blue-100)]",
        ghost:        "bg-transparent text-brand hover:bg-[var(--blue-050)]",
        "ghost-danger": "bg-transparent text-danger hover:bg-danger-bg",
      },
      size: {
        default: "h-[var(--button-h)] px-5 text-base",
        sm:      "h-[44px] px-[18px] text-sm rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

**Token classes used** (all resolve via `@theme inline` in globals.css):
- `bg-brand` → `hsl(var(--brand))` → `--blue-900` (light) / `--blue-400` (dark)
- `text-brand-foreground`, `hover:bg-brand-hover`, `active:bg-brand-press`
- `bg-danger-bg`, `text-danger` — from DGC semantic vars
- `disabled:bg-[var(--bg-disabled)]` — raw CSS var; `--bg-disabled` is NOT in `@theme inline`, so use `bg-[var(--bg-disabled)]` not `bg-disabled`

**Critical note on `--bg-disabled`:** The Phase 2 globals.css does NOT expose `--bg-disabled` via `@theme inline` (only shadcn semantic aliases + DGC status colors are in `@theme inline`). Use `bg-[var(--bg-disabled)]` and `text-[var(--fg-on-disabled)]` (bracket notation) for the disabled state. Verify this is declared in `globals.css` before relying on it — it is in `colors_and_type.css` source but may not have carried through to `globals.css`. [ASSUMED — needs grep confirmation of `--bg-disabled` in `src/app/globals.css`].

### Pattern 4: items.manifest.ts Shape

```typescript
// registry/items.manifest.ts
export type PropControl =
  | { type: "select"; label: string; options: string[]; default: string }
  | { type: "boolean"; label: string; default: boolean }
  | { type: "text"; label: string; default: string };

export interface ManifestEntry {
  name: string;           // "button"
  title: string;          // "Button"
  docsSlug: string;       // "components/button"
  controls: PropControl[];
}

export const items: ManifestEntry[] = [
  {
    name: "button",
    title: "Button",
    docsSlug: "components/button",
    controls: [
      { type: "select", label: "Variant", options: ["primary","secondary","ghost","ghost-danger"], default: "primary" },
      { type: "select", label: "Size", options: ["default","sm"], default: "default" },
      { type: "boolean", label: "Disabled", default: false },
      { type: "text", label: "Label", default: "ចុចនៅទីនេះ" },
    ],
  },
  // ... 13 more entries
];
```

### Pattern 5: Dynamic Playground Page

```typescript
// src/app/preview/[item]/page.tsx
import { items } from "@/registry/items.manifest";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return items.map((i) => ({ item: i.name }));
}

export default function PreviewPage({ params }: { params: { item: string } }) {
  const entry = items.find((i) => i.name === params.item);
  if (!entry) notFound();
  // render PlaygroundShell with entry
}
```

`generateStaticParams` is required for Next.js 15 App Router static export. Without it, the dynamic route cannot be pre-rendered and `npx shadcn build` (which runs `next build`) will fail in static export mode.

### Pattern 6: Form (RHF + Zod) Bundle

The shadcn `Form` exports `Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription` — all from one `form.tsx`. Key pattern [VERIFIED: shadcn docs]:

```typescript
// FormField uses react-hook-form Controller as render prop
import { Controller, useFormContext } from "react-hook-form";

const FormField = ({ name, control, render }) => (
  <Controller name={name} control={control} render={render} />
);

// FormMessage renders errors styled with --danger
const FormMessage = ({ children, ...props }) => {
  const { error } = useFormFieldContext();
  const body = error ? String(error.message) : children;
  if (!body) return null;
  return (
    <p
      className="text-[length:var(--text-caption)] font-medium text-danger"
      {...props}
    >
      {body}
    </p>
  );
};
```

Error color `text-danger` resolves to `hsl(var(--danger))` = `--red-700` (#C62828). This is correct — R4.9 specifies `--danger`.

The consumer usage pattern:
```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({ username: z.string().min(2) });
const form = useForm({ resolver: zodResolver(formSchema) });
```

### Pattern 7: Axe-Core/Playwright A11y Test

```typescript
// playwright/a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { items } from "../registry/items.manifest";

for (const item of items) {
  test(`a11y: /preview/${item.name}`, async ({ page }) => {
    await page.goto(`/preview/${item.name}`);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

**Next.js App Router gotcha with axe CI:** The `shadcn build && next build` produces a static export (`out/`). Playwright must serve the `out/` directory (not hit `localhost:3000` dev server) in CI. Use `npx serve out` or configure `playwright.config.ts` with `webServer: { command: "npx serve out -p 3001", url: "http://localhost:3001" }`. The `generateStaticParams` in the dynamic preview route is required — without it, Next.js static export will NOT generate `/preview/button`, `/preview/input`, etc.

### Anti-Patterns to Avoid

- **`dark:*` utilities in component source** — D-06 forbids; all dark mode is in `dgc-theme` `.dark` CSS vars.
- **Hardcoded hex colors** — D-02; use `bg-brand`, `text-foreground`, `bg-[var(--bg-disabled)]` etc.
- **`opacity-50` for disabled state** — R4.1 mandates `--bg-disabled` + `--fg-on-disabled`.
- **`bg-popover` for Tooltip bg** — R4.11 mandates `bg-[var(--gray-900)]` specifically.
- **`border-muted` for Separator** — R4.13 mandates `bg-[var(--border)]` (1px solid).
- **Separate registry items for sub-parts** — D-05; Select trigger/content/item all in one `select.tsx`.
- **`text-red-500` for form errors** — R4.9 mandates `text-danger`.
- **Missing `generateStaticParams`** on dynamic preview route — breaks `next build` static export.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trapping in Select | Custom focus trap | `@radix-ui/react-select` | Radix handles keyboard nav, ARIA roles, portal |
| Keyboard traversal in Tabs | Manual `onKeyDown` | `@radix-ui/react-tabs` | Roving tabindex, arrow keys, disabled state |
| Checkbox indeterminate state | `ref.indeterminate = true` | `@radix-ui/react-checkbox` | Radix surfaces `data-state="indeterminate"` |
| Form validation errors | Manual state | RHF + Zod resolver | Async validation, field-level errors, dirty tracking |
| Scroll area custom scrollbar | CSS `::-webkit-scrollbar` | `@radix-ui/react-scroll-area` | Cross-browser, accessible, RTL-safe |
| Variant class logic | `className` ternary soup | CVA `cva()` | Type-safe VariantProps, compound variants, defaultVariants |
| Tooltip portal + position | `position: absolute` calc | `@radix-ui/react-tooltip` | Viewport collision detection, ARIA tooltip role |
| Accessible radio group | `name` + `onChange` | `@radix-ui/react-radio-group` | Roving focus, keyboard selection, ARIA radiogroup |

**Key insight:** Radix handles all ARIA roles, keyboard interactions, and portal rendering. Never reimplement what Radix gives for free.

---

## Primitive-by-Primitive Implementation Digest

### R4.1 — Button

**Shadcn canonical:** `@radix-ui/react-slot` for `asChild`. CVA `buttonVariants`.
**Registry deps:** `["class-variance-authority", "@radix-ui/react-slot", "lucide-react"]`
**DGC token mapping:**

| shadcn default | DGC replacement | Token |
|----------------|-----------------|-------|
| `bg-primary` | `bg-brand` | `--brand` → `--blue-900` |
| `text-primary-foreground` | `text-brand-foreground` | `--brand-foreground` |
| `bg-secondary` | `bg-[var(--blue-050)]` | `--blue-050` (not in @theme inline) |
| `text-secondary-foreground` | `text-brand` | resolves to `--brand` |
| disabled | `bg-[var(--bg-disabled)] text-[var(--fg-on-disabled)]` | #E0E0E0 + #757575 |

**Variants (4):** `primary`, `secondary`, `ghost`, `ghost-danger`
**Sizes (2):** `default` (48px h, `px-5`, `rounded-[var(--radius-md)]` = 12px), `sm` (44px h, `px-[18px]`, `rounded-[10px]`)
**Icon slot:** wrap children with Lucide icon — render as sibling, `gap-2` handles spacing.
**Visual spec source:** `project/preview/buttons-primary.html` + `buttons-secondary.html`

### R4.2 — Input

**No Radix dep.** Plain `<input>` with forwarded ref.
**Registry deps:** `[]` (no extra npm deps beyond dgc-theme)
**DGC token mapping:**

| Property | Token | Value |
|----------|-------|-------|
| height | `h-[var(--input-h)]` | 48px |
| border-radius | `rounded-[var(--radius-md)]` | 12px |
| border | `border border-[hsl(var(--border))]` | --gray-200 |
| focus border | `focus-visible:border-[hsl(var(--ring))]` | --blue-900 |
| focus ring | `focus-visible:shadow-[var(--shadow-focus)]` | 0 0 0 3px rgba(21,101,192,.25) |
| error border | `aria-invalid:border-danger` | --red-700 |
| disabled bg | `disabled:bg-[var(--gray-050)]` | #F5F7FA |
| disabled text | `disabled:text-[hsl(var(--muted-foreground))]` | --gray-400 |

**Khmer date placeholder:** `<input lang="km" type="date" placeholder="ថ្ងៃ/ខែ/ឆ្នាំ">`. Note: native `<input type="date">` renders browser-native date picker. The placeholder text "ថ្ងៃ/ខែ/ឆ្នាំ" appears in the spec (R4.2) but native date inputs suppress custom placeholders in most browsers. Implement as a standard `text` input or a controlled date input with a displayed placeholder until a value is selected. [ASSUMED — browser behaviour varies; safest is `type="text"` with `inputmode="numeric"` and `pattern` for the Khmer placeholder to show.]
**Required `*` indicator:** Handled by `Label` (R4.8), not by the Input itself.

### R4.3 — Textarea

**No Radix dep.**
**Registry deps:** `[]`
**Delta from Input:**
- `min-h-[88px]` (spec: 88px min)
- `resize-y` (user-resizable vertically)
- `py-3` (vertical padding for multi-line)
- Same border, radius, focus, error, disabled token classes as Input.

### R4.4 — Select

**Radix:** `@radix-ui/react-select` v2.2.6 [VERIFIED]
**Registry deps:** `["@radix-ui/react-select", "lucide-react"]`
**Bundled sub-parts** (D-04) in `select.tsx`: `Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton`
**DGC token mapping for trigger:**
- Height: `h-[var(--input-h)]` (48px)
- Radius: `rounded-[var(--radius-md)]`
- Border/focus: same as Input
- Content (dropdown): `bg-popover text-popover-foreground rounded-[var(--radius-md)] shadow-[var(--shadow-2)]`
- Selected item: `bg-[var(--blue-050)] text-brand` (matches nav-row active style from spec)

**Chevron icon:** `lucide-react` `ChevronDown`, positioned with `ml-auto`.

### R4.5 — Checkbox

**Radix:** `@radix-ui/react-checkbox` v1.3.3 [VERIFIED]
**Registry deps:** `["@radix-ui/react-checkbox"]`
**DGC spec (R4.5):**
- Box size: `size-[18px]` (spec says 18px; selection.html shows 20px — use 18px per R4.5)
- Unchecked: `border-1.5 border-[hsl(var(--border))] bg-white rounded-[4px]`
- Checked: `bg-brand border-brand` (--accent → --blue-900 = brand)
- Check glyph: Radix renders `<Checkbox.Indicator>` — use Lucide `Check` icon at 12px.
- `data-state="checked"` → apply bg-brand; `data-state="unchecked"` → border style

```typescript
<CheckboxPrimitive.Root
  className={cn(
    "size-[18px] shrink-0 rounded-[4px] border-[1.5px] border-[hsl(var(--border))]",
    "data-[state=checked]:bg-brand data-[state=checked]:border-brand data-[state=checked]:text-brand-foreground",
    "focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
>
  <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
    <Check className="size-3" />
  </CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
```

### R4.6 — Radio

**Radix:** `@radix-ui/react-radio-group`
**Registry deps:** `["@radix-ui/react-radio-group"]`
**Bundled sub-parts:** `RadioGroup, RadioGroupItem` in `radio.tsx`
**DGC spec (R4.6):**
- Circle: `size-[18px] rounded-full border-[1.5px]` (selection.html uses 20px; R4.6 says 999px circle — use `rounded-full`)
- Unchecked: `border-[hsl(var(--border))]`
- Checked: `border-brand` + inner dot via `RadioGroupPrimitive.Indicator`:
  ```
  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
    <Circle className="size-2.5 fill-brand text-brand" />
  </RadioGroupPrimitive.Indicator>
  ```
  This produces white dot on brand bg via: outer circle = brand border, inner fill-brand circle. The spec shows a white dot on `--accent` fill — achieve by: outer `data-[state=checked]:bg-brand data-[state=checked]:border-brand`, inner dot `fill-white`.

### R4.7 — Switch

**Radix:** `@radix-ui/react-switch` v1.2.6 [VERIFIED]
**Registry deps:** `["@radix-ui/react-switch"]`
**DGC spec (R4.7) — exact dimensions:**
- Track: `w-10 h-6` = 40×24px
- Thumb: `size-[18px]` = 18px (positioned within 24px track = 3px margin each side)
- Off track bg: `bg-[hsl(var(--border))]` (--gray-200 = #BDBDBD shown in spec)
- On track bg: `data-[state=checked]:bg-brand`
- Thumb: `bg-white rounded-full` with `translate-x-[2px]` off → `translate-x-[18px]` on (40-18-4=18px travel)

```typescript
<SwitchPrimitive.Root
  className={cn(
    "peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full",
    "border-2 border-transparent",
    "bg-[hsl(var(--input))] transition-colors",
    "data-[state=checked]:bg-brand",
    "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
>
  <SwitchPrimitive.Thumb
    className={cn(
      "pointer-events-none block size-[18px] rounded-full bg-white shadow-sm",
      "transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[1px]",
    )}
  />
</SwitchPrimitive.Root>
```

### R4.8 — Label

**Radix:** `@radix-ui/react-label`
**Registry deps:** `["@radix-ui/react-label"]`
**DGC spec (R4.8):**
- `text-sm font-medium` → maps to `--text-body-sm` (14px) + `--weight-medium` (500)
- Required asterisk: sibling `<span aria-hidden="true" className="text-[hsl(var(--red-600))] ml-0.5">*</span>`
- `--red-600` = `0 65% 51%` (from globals.css) → `text-[hsl(var(--red-600))]`
- Disabled peer: `peer-disabled:cursor-not-allowed peer-disabled:opacity-70`

**Note:** `--red-600` is defined in globals.css as a scale token (not in @theme inline). Use bracket notation.

### R4.9 — Form

**Registry deps:** `["react-hook-form", "zod", "@hookform/resolvers", "@radix-ui/react-label"]`
**Single file:** `form.tsx` exporting all 7 named exports (D-03).
**RHF + Zod integration pattern** [VERIFIED: shadcn official docs]:

```typescript
// form.tsx — key exports
export { useFormField } from "./use-form-field"; // internal context hook
export { Form }          // wrapper around FormProvider
export { FormField }     // Controller wrapper
export { FormItem }      // div with FormFieldContext
export { FormLabel }     // Label with error state coloring
export { FormControl }   // passes id/aria-invalid/aria-describedby to child
export { FormDescription } // helper text
export { FormMessage }   // error message with text-danger styling
```

**FormControl** passes `aria-invalid` → Input will apply `aria-invalid:border-danger` automatically.
**FormMessage** error color: `text-danger` = `hsl(var(--danger))` = --red-700.
**zodResolver import:** `import { zodResolver } from "@hookform/resolvers/zod"` — package is `@hookform/resolvers` v5.2.2 [VERIFIED].

### R4.10 — Badge

**No Radix dep.**
**Registry deps:** `["class-variance-authority"]`
**CVA tones (4)** — D-10 specifies exactly 4, no 5th tone:

```typescript
export const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-xs)] px-2 py-0.5 text-[length:var(--text-caption)] font-medium",
  {
    variants: {
      tone: {
        default: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
        success: "bg-success-bg text-success",
        warning: "bg-warning-bg text-warning",
        danger:  "bg-danger-bg text-danger",
      },
    },
    defaultVariants: { tone: "default" },
  }
);
```

**Token pairs:**
- `default`: `bg-muted` + `text-muted-foreground` (gray-100 bg + gray-600 text)
- `success`: `bg-success-bg` + `text-success` (green-100 bg + green-700 text) [both in @theme inline ✓]
- `warning`: `bg-warning-bg` + `text-warning`
- `danger`: `bg-danger-bg` + `text-danger`

### R4.11 — Tooltip

**Radix:** `@radix-ui/react-tooltip`
**Registry deps:** `["@radix-ui/react-tooltip"]`
**Bundled sub-parts:** `TooltipProvider, Tooltip, TooltipTrigger, TooltipContent` in `tooltip.tsx`
**DGC spec (R4.11) — exact tokens:**
- Content bg: `bg-[var(--gray-900)]` (NOT `bg-popover` — R4.11 is explicit)
  `--gray-900` = `0 0% 13%` in globals.css. Use `bg-[hsl(var(--gray-900))]`.
- Text: `text-[length:var(--text-caption)] text-white` (white on dark gray bg)
- Radius: `rounded-[var(--radius-sm)]` = 8px
- Padding: `px-3 py-1.5`
- Arrow: Radix `TooltipPrimitive.Arrow` with `fill-[hsl(var(--gray-900))]`

**Khmer clipping risk in Tooltip:** Khmer characters have tall stacking vowels. At `--text-caption` (12px) with default line-height 1, Khmer subscripts clip. Mitigation: the `:lang(km)` cascade sets `line-height: var(--leading-loose)` = 1.6 globally. The Tooltip content must have `py-1.5` minimum padding (not `py-0.5`) — verified from spec showing visible Khmer in tooltip. Do NOT use `overflow-hidden` on TooltipContent.

### R4.12 — Tabs

**Radix:** `@radix-ui/react-tabs` v1.1.13 [VERIFIED]
**Registry deps:** `["@radix-ui/react-tabs"]`
**Bundled sub-parts:** `Tabs, TabsList, TabsTrigger, TabsContent` in `tabs.tsx`
**DGC spec (R4.12) — two variants from tabs.html:**

1. **Underline** (default): `TabsList` = flex row, `border border-[hsl(var(--border))] rounded-[var(--radius-md)] bg-white overflow-hidden`. `TabsTrigger` = `flex-1 h-11` (44px). Active state: bottom 2px `--accent` border via `data-[state=active]::after` pseudo (or `relative` + `after:` utilities).
2. **Pill** (segmented): `TabsList` = `bg-[hsl(var(--background))] p-1 gap-0.5 rounded-[var(--radius-md)] border`. `TabsTrigger` = `rounded-[var(--radius-sm)] h-9`. Active: `data-[state=active]:bg-white data-[state=active]:shadow-[var(--shadow-1)]`.

**Static-specimen-compatible** (R4.12): Radix Tabs requires a `value` prop for controlled mode. For docs/static specimens, pass `defaultValue` — Radix handles display without requiring `onValueChange`.

**Active underline implementation:** `TabsTrigger` with `after:` Tailwind approach:

```typescript
"relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-t-sm",
"after:bg-transparent data-[state=active]:after:bg-brand",
"data-[state=active]:text-brand data-[state=active]:font-semibold",
"text-[hsl(var(--muted-foreground))] hover:text-foreground",
```

### R4.13 — Separator

**Radix:** `@radix-ui/react-separator`
**Registry deps:** `["@radix-ui/react-separator"]`
**DGC spec (R4.13):** `1px solid var(--border)`.

```typescript
<SeparatorPrimitive.Root
  className={cn(
    "shrink-0 bg-[hsl(var(--border))]",
    orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
    className
  )}
/>
```

No `border-muted` — must use `bg-[hsl(var(--border))]` with `h-px` (height approach, not border approach) per spec.

### R4.14 — ScrollArea

**Radix:** `@radix-ui/react-scroll-area` v1.2.10 [VERIFIED]
**Registry deps:** `["@radix-ui/react-scroll-area"]`
**Bundled sub-parts:** `ScrollArea, ScrollBar` in `scroll-area.tsx`
**DGC token mapping:**
- Scrollbar thumb: `bg-[hsl(var(--border))] rounded-full` (neutral gray-200)
- Track: transparent
- Hover thumb: `hover:bg-[hsl(var(--muted-foreground))]`
- This matches shadcn canonical closely — minimal changes needed.

---

## Common Pitfalls

### Pitfall 1: `--bg-disabled` Not in `@theme inline`

**What goes wrong:** Writing `disabled:bg-disabled` (Tailwind utility shorthand) — class does not exist because `--bg-disabled` was not registered in the `@theme inline` block.
**Why it happens:** Only shadcn semantic aliases + DGC status colors are in `@theme inline`. Raw semantic vars like `--bg-disabled`, `--fg-on-disabled`, `--blue-050`, `--blue-100`, `--gray-050` are in `:root` only.
**How to avoid:** Use bracket notation: `disabled:bg-[var(--bg-disabled)]`, `disabled:text-[var(--fg-on-disabled)]`, `bg-[var(--blue-050)]`.
**Warning signs:** Tailwind class not appearing in output CSS despite being in source.

### Pitfall 2: `dark:*` Utilities Bypass dgc-theme

**What goes wrong:** Adding `dark:bg-secondary` to a primitive — in dark mode, this reads the shadcn default dark value, not the DGC dark mapping.
**Why it happens:** `dark:*` utilities apply inline at the component level, overriding CSS var cascade.
**How to avoid:** D-06 — never write `dark:*` in any primitive. All dark state is in `.dark { ... }` block in `globals.css`.
**Warning signs:** Code review flags any `dark:` prefix in `registry/**/*.tsx`.

### Pitfall 3: Dynamic Preview Route Missing `generateStaticParams`

**What goes wrong:** `next build` fails with "Page could not be rendered statically" on `/preview/[item]`.
**Why it happens:** Static export mode (GitHub Pages) requires all dynamic routes to enumerate their params at build time.
**How to avoid:** Always include `export function generateStaticParams()` returning `items.map(i => ({ item: i.name }))`.
**Warning signs:** Build error mentioning dynamic route or `useSearchParams`.

### Pitfall 4: Select/Tooltip Portal Conflicts with Static Export

**What goes wrong:** Radix `Select.Content` and `Tooltip.Content` render in a `document.body` portal — in SSR/static export, initial render has no portal target.
**Why it happens:** Next.js App Router renders server-side; portals only exist client-side.
**How to avoid:** Wrap in `"use client"` at the top of each Radix-dependent component file. All 14 primitives that use Radix should have `"use client"`.
**Warning signs:** Hydration mismatch errors in browser console.

### Pitfall 5: Khmer Text Clipping in Small Components

**What goes wrong:** Khmer vowel marks clip at top/bottom in Badge, Tooltip, small Tabs.
**Why it happens:** Noto Sans Khmer has tall ascenders for stacking vowels. At 12px (`--text-caption`) with tight line-height (1 or 1.25), the glyphs render but the containing box clips them.
**How to avoid:**
- Minimum vertical padding: `py-1` (4px) for Badge, `py-1.5` for Tooltip.
- Do NOT use `overflow-hidden` or `line-clamp` inside Tooltip/Badge content.
- The `:lang(km)` cascade sets `line-height: 1.6` globally — this helps but padding is the real fix.
- Test: `/test/khmer` page with Khmer text in every component, validated via Playwright visual diff.
**Warning signs:** Khmer characters look cut off at top in screenshots.

### Pitfall 6: Axe Failing on Radix Tooltip (missing accessible name)

**What goes wrong:** `@axe-core/playwright` reports violation `aria-required-attr: missing required attribute 'aria-label'` or `button-name` on Tooltip trigger if the trigger button has no text.
**Why it happens:** Radix `TooltipTrigger` renders a `<button>` — if only an icon is inside, axe flags it as having no accessible name.
**How to avoid:** Always include a `<span className="sr-only">` inside icon-only triggers. Document this in the MDX docs page.

### Pitfall 7: RHF + React 19 Server Component Conflict

**What goes wrong:** `react-hook-form` `useForm` is a client hook — attempting to use Form in a Server Component throws.
**Why it happens:** RHF relies on `useState`/`useRef` internally.
**How to avoid:** All `Form`-using pages must be `"use client"` or wrap the form in a client component. Docs page should show the `"use client"` directive in the usage example.

### Pitfall 8: Registry JSON `cssVars` Adding Unwanted `:root` Declarations

**What goes wrong:** If a primitive's registry JSON has `cssVars.light: { "something": "..." }`, the shadcn CLI injects those into the consumer's `globals.css` `:root` block — even if the primitive doesn't need them.
**Why it happens:** shadcn CLI merges `cssVars` from all installed items.
**How to avoid:** Keep `"cssVars": {}` in all 14 primitive registry JSON entries. Token vars are provided by `dgc-theme` (the `registryDependency`).

### Pitfall 9: `shadcn build` Version Drift (shadcn CLI 4.4.0)

**What goes wrong:** The `registry-item.json` schema may differ between shadcn CLI 4.x and the live docs at `ui.shadcn.com`.
**Why it happens:** shadcn has been evolving the registry schema rapidly through 2025-2026.
**How to avoid:** The target repo locks `shadcn@^4.4.0` in `devDependencies`. Verify the `$schema` URL matches what `shadcn build` validates against. Current: `https://ui.shadcn.com/schema/registry.json` for root, `https://ui.shadcn.com/schema/registry-item.json` for items [VERIFIED: search].

---

## Registry JSON Schema — Full Specification (2025-2026)

[VERIFIED: shadcn official docs search + existing repo pattern]

**Root `registry.json`:**
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "dgc-miniapp",
  "homepage": "https://registry.016910804.xyz",
  "items": [ ...14 primitive entries + dgc-theme + hello... ]
}
```

**Per-item shape in `items[]`:**
```json
{
  "name": "button",           // kebab-case, no spaces
  "type": "registry:ui",      // locked for primitives
  "title": "Button",
  "description": "...",
  "dependencies": ["class-variance-authority", "@radix-ui/react-slot", "lucide-react"],
  "devDependencies": [],      // optional; empty for all 14
  "registryDependencies": ["https://registry.016910804.xyz/r/dgc-theme.json"],
  "files": [
    {
      "path": "registry/button/button.tsx",
      "type": "registry:ui",
      "target": "components/ui/button.tsx"
    }
  ],
  "cssVars": {},              // empty — all vars from dgc-theme
  "docs": "https://registry.016910804.xyz/docs/components/button"
}
```

**`registryDependencies` URL rule:** Full HTTPS URL pointing to the live registry JSON. The CLI fetches this URL and installs it if not already present. [VERIFIED: shadcn docs + hello.tsx in existing repo uses this pattern].

**`target` field:** Required when `type` is `registry:ui` to specify where the file lands in the consumer. Format: `components/ui/<name>.tsx` (relative to consumer `src/` or root, depending on consumer's shadcn config).

---

## Playground + Docs Route Patterns

### Docs MDX Page Template (R9.1, R9.4)

```mdx
export const metadata = {
  title: "Button — DGC MiniApp Design System",
  description: "...",
};

# Button

## Install

```bash
npx shadcn@latest add https://registry.016910804.xyz/r/button.json
```

[Copy button rendered by MDX layout — R9.4]

## Variants

[variants gallery — render actual components]

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `primary \| secondary \| ghost \| ghost-danger` | `primary` | Visual style |
| size | `default \| sm` | `default` | Height/padding |
| asChild | `boolean` | `false` | Render as child element |
| disabled | `boolean` | `false` | Disables interaction |

## Usage

### English

```tsx
import { Button } from "@/components/ui/button";
<Button variant="primary">Submit application</Button>
```

### Khmer

```tsx
<Button variant="primary" lang="km">ដាក់ពាក្យ</Button>
```
```

**Copy-button (R9.4):** The existing MDX layout + `TokenTable` pattern from Phase 2 shows how copy buttons are implemented. Replicate using the same `<CopyButton>` component from `@/components/docs/`.

### Playground Frame

```typescript
// src/components/playground/PlaygroundShell.tsx — "use client"
// Props: entry: ManifestEntry
// State: controlValues (derived from entry.controls[].default)
// Renders: 3 global toggles (theme, lang, viewport) + per-control panel + preview frame
```

The preview frame is a `<div>` with:
- `data-theme="dark"` or class `.dark` toggle for theme (D-13)
- `lang="en"` / `lang="km"` attribute toggle for language (D-13)
- `max-w-[375px] min-h-[812px]` constraint for mobile viewport toggle (D-13)

---

## Smoke Consumer Extension (D-19)

Extend `scripts/smoke-consumer.mjs` with a new branch:

```javascript
if (process.env.SMOKE_WITH_PRIMITIVES === '1') {
  const PRIMITIVES = [
    'button','input','textarea','select','checkbox','radio',
    'switch','label','form','badge','tooltip','tabs','separator','scroll-area'
  ];
  const BASE = 'http://localhost:3000/r/';
  for (const name of PRIMITIVES) {
    const rc = run('pnpm', [
      'dlx', 'shadcn@latest', 'add',
      `${BASE}${name}.json`,
      '--yes', '--overwrite'
    ], { cwd: consumer });
    if (rc !== 0) die(`shadcn add ${name} failed`);
  }
  // Verify all components landed
  for (const name of PRIMITIVES) {
    const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const p = join(consumer, `src/components/ui/${name}.tsx`);
    if (!existsSync(p)) die(`${name}.tsx not found at ${p}`);
    log(`[PASS] ${name}.tsx present`);
  }
  // Next.js build verifies compile
  const buildRc = run('pnpm', ['build'], { cwd: consumer });
  if (buildRc !== 0) die('consumer build with primitives failed');
}
```

**Key:** `--yes` + `--overwrite` flags suppress all interactive prompts [VERIFIED: shadcn CLI docs search]. No `stdin` injection needed.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | `@playwright/test` (already in `devDependencies` as `playwright ^1.59.1` — add `@playwright/test` for test runner) |
| A11y lib | `@axe-core/playwright` (new dep) |
| Config file | `playwright.config.ts` (create in Wave 0) |
| Quick run | `pnpm test:a11y --reporter=line` |
| Full suite | `pnpm test:a11y && pnpm test:khmer` |
| CI command | added to `.github/workflows/deploy.yml` before deploy step |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| R4.1 | Button renders 4 variants + 2 sizes + disabled state | Visual (Playwright screenshot) | `pnpm test:a11y -- --grep button` | ❌ Wave 0 |
| R4.1 | Disabled button uses --bg-disabled (WCAG AA) | Axe + Playwright color check | `pnpm test:a11y` | ❌ Wave 0 |
| R4.2 | Input 48px height, focus ring visible | Playwright screenshot | `/preview/input` visual diff | ❌ Wave 0 |
| R4.2 | Khmer date placeholder renders | Visual diff `/test/khmer` | `pnpm test:khmer` | ❌ Wave 0 |
| R4.3 | Textarea min-height 88px | Playwright `evaluate` bounding box | unit inside a11y spec | ❌ Wave 0 |
| R4.4 | Select keyboard navigation (arrow keys) | Playwright keyboard | `page.keyboard.press('ArrowDown')` | ❌ Wave 0 |
| R4.5 | Checkbox indeterminate + checked states | Playwright click + state check | axe + screenshot | ❌ Wave 0 |
| R4.6 | Radio group keyboard traversal | Playwright keyboard Tab/Arrow | axe spec | ❌ Wave 0 |
| R4.7 | Switch track 40×24, thumb 18px | Playwright `boundingBox()` | geometry spec | ❌ Wave 0 |
| R4.8 | Label required asterisk is --red-600 | Playwright `getComputedStyle` | color spec | ❌ Wave 0 |
| R4.9 | Form error message uses --danger color | Playwright trigger validation + color check | axe + color spec | ❌ Wave 0 |
| R4.10 | Badge 4 tones render correct bg/text pairs | Playwright screenshot comparison | visual diff | ❌ Wave 0 |
| R4.11 | Tooltip bg is --gray-900 | Playwright `getComputedStyle` on tooltip content | color spec | ❌ Wave 0 |
| R4.12 | Tabs active underline visible + keyboard nav | Playwright click + screenshot | axe + visual | ❌ Wave 0 |
| R4.13 | Separator is 1px, bg-border color | Playwright `boundingBox` + style check | geometry spec | ❌ Wave 0 |
| R4.14 | ScrollArea scrolls without native scrollbar | Playwright scroll + screenshot | visual diff | ❌ Wave 0 |
| R9.1 | Each MDX docs page renders (200 response) | Playwright page.goto + expect 200 | `pnpm test:docs` | ❌ Wave 0 |
| R9.4 | Copy button present on every docs page | Playwright selector check | docs spec | ❌ Wave 0 |
| D-16 | axe passes on every /preview/<item> | @axe-core/playwright | `pnpm test:a11y` | ❌ Wave 0 |
| D-17 | /test/khmer visual diff passes | Playwright snapshot | `pnpm test:khmer` | ❌ Wave 0 |
| D-18 | Focus ring visible on Tab through all interactive | Playwright keyboard Tab + screenshot | focus spec | ❌ Wave 0 |
| D-19 | SMOKE_WITH_PRIMITIVES=1 batch install compiles | smoke-consumer.mjs extension | `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm build` (registry build + next build — catches broken TSX/JSON immediately)
- **Per wave merge:** `pnpm test:a11y` (axe on all /preview routes) + `pnpm test:khmer` (visual diff)
- **Phase gate:** All tests green + `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` passes before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `playwright.config.ts` — static server config pointing at `out/` dir
- [ ] `playwright/a11y.spec.ts` — axe loop over all 14 /preview routes
- [ ] `playwright/khmer.spec.ts` — visual diff of `/test/khmer` page
- [ ] `playwright/docs.spec.ts` — 200 check + copy-button presence for all 14 /docs/components/<item>
- [ ] `playwright/focus.spec.ts` — keyboard Tab traversal for all interactive primitives
- [ ] `src/app/test/khmer/page.tsx` — Khmer test harness page
- [ ] `registry/items.manifest.ts` — must exist before any spec imports it

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `dark:*` Tailwind per-component | CSS var cascade under `.dark` | shadcn 2024+ | Simpler components; D-06 enforces |
| `@radix-ui/react-*` individual packages | `radix-ui` meta-package | 2024 | Can use `import { Checkbox } from "radix-ui"` but per-package still works fine; stick with per-package for explicit dep control |
| shadcn `components.json` `--accent` as CTA | `--brand` alias (DGC D-01) | Phase 2 | All DGC CTA buttons use `bg-brand` not `bg-primary` or `bg-accent` |
| RHF `register()` API | `Controller`/`useController` pattern | RHF v7+ | shadcn Form uses `Controller` via `FormField`; do not use `register()` in Form bundle |
| Zod v3 | Zod v3.x (v4 in beta, not stable) | 2026-04 | Use v3 — `@hookform/resolvers` v5.2.2 targets Zod v3; Zod v4 resolver support is in progress [ASSUMED — verify before pin] |

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All scripts | ✓ | (Windows, confirmed by Phase 1/2) | — |
| pnpm | Package manager | ✓ | (confirmed by existing pnpm-lock.yaml) | — |
| `shadcn` CLI | Registry build | ✓ | 4.4.0 (package.json devDependencies) | — |
| Next.js 15 | Registry host + static export | ✓ | 15.5.15 (package.json) | — |
| React 19 | All components | ✓ | 19.1.0 (package.json) | — |
| `playwright` | CI a11y + visual diff | ✓ | ^1.59.1 (package.json devDependencies) | — |
| `@playwright/test` | Typed test runner | ✗ | — | Add `pnpm add -D @playwright/test` in Wave 0 |
| `@axe-core/playwright` | a11y CI (D-16) | ✗ | — | Add in Wave 0 — no fallback (D-16 locked) |
| GitHub Actions | CI deploy | ✓ | (deploy.yml exists, Phase 1 green) | — |
| Google Fonts CDN | Khmer font rendering | ✓ (network) | — | Self-host via `@fontsource-variable/noto-sans-khmer` if CDN blocked |

**Missing dependencies with no fallback:**
- `@axe-core/playwright` — D-16 requires it; must be installed in Wave 0

**Missing dependencies with fallback:**
- `@playwright/test` — currently `playwright` (raw) is installed; `@playwright/test` adds the typed test runner. Fallback: write tests as raw Playwright scripts (like builder/tests/), but typed runner is strongly preferred.

---

## Security Domain

Phase 3 is a UI component library with no auth, no data storage, no API calls. ASVS security controls are minimal.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | Partial | Zod schema in Form (R4.9) — validates consumer-provided schemas, not DGC data |
| V6 Cryptography | No | — |

**Known threat patterns for this stack:**

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via dangerouslySetInnerHTML | Tampering | Never use `dangerouslySetInnerHTML` in any primitive; use React children |
| Token/credential exposure in MDX | Info disclosure | No secrets in docs pages; all examples use placeholder values |
| Dependency supply chain | Tampering | Radix + RHF are well-maintained; pin via pnpm lockfile |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@radix-ui/react-radio-group`, `@radix-ui/react-tooltip`, `@radix-ui/react-separator`, `@radix-ui/react-label`, `@radix-ui/react-slot` versions assumed to be current 1.x | Standard Stack | Wrong version string in registry JSON — cosmetic; CLI will install latest anyway |
| A2 | `--bg-disabled`, `--fg-on-disabled`, `--blue-050`, `--blue-100`, `--gray-050`, `--gray-900`, `--red-600` are in `globals.css` `:root` but NOT in `@theme inline` | Pitfall 1, multiple token mappings | If some are in @theme inline, bracket notation still works; no breakage |
| A3 | Zod v3 is correct (not v4) for `@hookform/resolvers` v5.2.2 | Standard Stack | If Zod v4 stable + resolver updated, upgrade path is straightforward |
| A4 | `<input type="date">` with Khmer placeholder requires `type="text"` workaround | R4.2 | If browsers support Khmer placeholder on date input, no workaround needed |
| A5 | `generateStaticParams` is required for Next.js 15 App Router static export on dynamic routes | Architecture | If Next 15 changed behavior, build error surfaced immediately |
| A6 | `tailwind.config.ts` follows Tailwind v4 CSS-first pattern (no JS config file needed) | Standard Stack | Target repo confirmed Tailwind v4 + `@import "tailwindcss"` in globals.css — HIGH confidence |

---

## Open Questions

1. **`--bg-disabled` in `@theme inline`?**
   - What we know: `globals.css` `@theme inline` block was read — it contains shadcn semantics + DGC status colors.
   - What's unclear: whether `--bg-disabled`, `--fg-on-disabled`, `--blue-050`, `--bg-hover` etc. were added to `@theme inline` during Phase 2.
   - Recommendation: `grep "@theme inline" -A 100 src/app/globals.css | grep "bg-disabled"` before Task 1. If absent, use bracket notation throughout.

2. **Radix `radix-ui` meta-package vs individual packages?**
   - What we know: npm shows a `radix-ui` v1.4.3 meta-package that bundles all primitives.
   - What's unclear: whether using `radix-ui` as a single dep in registry JSON is simpler than listing 9 individual `@radix-ui/react-*` packages.
   - Recommendation: Use individual packages — explicit, auditable, and matches how Phase 2's `hello.tsx` was structured. Consumer only installs what they need.

3. **`tailwind.config.ts` existence?**
   - What we know: The bash `ls` showed it's not found at the root (got a file-not-found). Tailwind v4 uses CSS-first config — `tailwind.config.ts` may not exist.
   - What's unclear: Whether there's a `postcss.config.mjs` or an `@config` directive in `globals.css`.
   - Recommendation: Confirm before any Tailwind utility additions. Phase 2 confirmed Tailwind v4 CSS-first with `@import "tailwindcss"` in globals.css.

---

## Sources

### Primary (HIGH confidence)
- `D:/sources/dgc-miniapp-shadcn/src/app/globals.css` — Phase 2 token layer, exact CSS vars, @theme inline block
- `D:/sources/dgc-miniapp-shadcn/registry.json` — existing registry schema, hello item pattern
- `D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx` — reference TSX pattern for registry:ui
- `D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs` — existing smoke test, extension pattern
- `D:/sources/dgc-miniapp-design-system/project/colors_and_type.css` — DGC source tokens
- `D:/sources/dgc-miniapp-design-system/project/preview/buttons-primary.html` — Button visual spec
- `D:/sources/dgc-miniapp-design-system/project/preview/buttons-secondary.html` — Secondary/Ghost spec
- `D:/sources/dgc-miniapp-design-system/project/preview/inputs.html` — Input visual spec
- `D:/sources/dgc-miniapp-design-system/project/preview/selection.html` — Checkbox/Radio/Switch spec
- `D:/sources/dgc-miniapp-design-system/project/preview/tabs.html` — Tabs visual spec
- [shadcn registry docs](https://ui.shadcn.com/docs/registry/registry-item-json) — schema fields [VERIFIED via search]
- [shadcn CLI docs](https://ui.shadcn.com/docs/cli) — `--yes`, `--overwrite` flags [VERIFIED via search]

### Secondary (MEDIUM confidence)
- npm registry search results — `@radix-ui/react-checkbox` 1.3.3, `@radix-ui/react-switch` 1.2.6, `@radix-ui/react-tabs` 1.1.13, `@radix-ui/react-select` 2.2.6, `@radix-ui/react-scroll-area` 1.2.10, `@hookform/resolvers` 5.2.2, `class-variance-authority` 0.7.1
- [shadcn Form docs](https://ui.shadcn.com/docs/forms/react-hook-form) — RHF+Zod integration [VERIFIED via search]
- [Playwright accessibility docs](https://playwright.dev/docs/accessibility-testing) — axe-core setup

### Tertiary (LOW confidence)
- Training knowledge for: CVA compound variant patterns, Radix Switch thumb positioning math, Khmer font clipping mitigations (no authoritative source found — based on general Khmer typographic knowledge)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified via npm, lockfile confirms React 19 + Next 15 + shadcn 4.4
- Architecture: HIGH — existing repo patterns (hello.tsx, smoke-consumer.mjs, globals.css) confirm all patterns
- Pitfalls: HIGH for token-related (verified from globals.css source); MEDIUM for Khmer clipping (no official source)
- Validation architecture: HIGH — pattern established in Phase 2 with Playwright

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (Radix versions stable; shadcn CLI minor releases possible)

---

## RESEARCH COMPLETE

**Phase:** 3 — Primitives (14 items)
**Confidence:** HIGH

### Key Findings

1. **Token layer is ready.** `globals.css` has all DGC semantic vars (`--brand`, `--danger`, `--success-bg`, etc.) in `@theme inline`. Primitives consume these via Tailwind utilities (`bg-brand`, `text-danger`) — no `dark:*` utilities needed.

2. **Registry schema confirmed.** `registryDependencies: ["https://registry.016910804.xyz/r/dgc-theme.json"]` is the correct format (full URL, not name) — verified from `hello.tsx` which already uses this pattern successfully in production.

3. **`--bg-disabled` is NOT in `@theme inline`** — needs bracket notation `bg-[var(--bg-disabled)]` throughout. Verify by grep before implementing.

4. **Smoke consumer extension** is straightforward — `--yes --overwrite` flags handle all prompts; batch loop adds ~30 lines to existing script.

5. **Next.js App Router static export** requires `generateStaticParams` on the `[item]` dynamic route and `"use client"` on all Radix components; CI axe tests need a static server (`npx serve out`) not `localhost:3000`.

### Files Created
`D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | Versions verified via npm search; existing repo confirms React 19 + Next 15 + shadcn 4.4 |
| Architecture | HIGH | hello.tsx + smoke-consumer.mjs + globals.css all confirm patterns |
| Token Mapping | HIGH | globals.css read directly; DGC preview HTML specs read directly |
| Pitfalls | MEDIUM-HIGH | Token pitfalls verified; Khmer clipping from training knowledge |
| Validation | HIGH | @playwright/test + @axe-core/playwright standard pattern |

### Open Questions for Planner
- Confirm `--bg-disabled` presence in `@theme inline` (affects disabled state utility choice)
- Confirm `tailwind.config.ts` absence (Tailwind v4 CSS-first — probably correct)
- Zod v3 vs v4 — pin explicitly in task

### Ready for Planning
Research complete. Planner can now create PLAN.md.
