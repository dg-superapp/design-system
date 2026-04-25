# Phase 2: Theme + Tokens (`dgc-theme`) — Research

**Researched:** 2026-04-24
**Domain:** Tailwind v4 `@theme` + shadcn `registry:theme` + DGC token port (HEX → HSL)
**Confidence:** HIGH (shadcn v4 docs + Phase 1 scaffold research are 1 day old; token math deterministic)

## Summary

Phase 2 ships a single `registry:theme` item named `dgc-theme`. Consumer runs `npx shadcn@latest add http://registry.016910804.xyz/r/dgc-theme.json`; shadcn CLI v4 merges tokens into the consumer's `src/app/globals.css` (path auto-detected from `components.json > tailwind.css`), producing a rendered palette that matches `project/preview/colors-*.html`. The existing `builder/styles.css` is the working reference — it already maps DGC scale tokens → semantic aliases correctly, but uses `[data-theme="dark"]` which Phase 2 migrates to `.dark`.

**Three decisions locked by this research:**

- **Token format is HSL channel triplets** (`216 85% 34%`, not `hsl(...)` wrapper, not `#hex`, not `oklch()`). This matches shadcn's Tailwind v4 convention so `hsl(var(--primary) / <alpha-value>)` works inside `@theme inline` and in Radix state selectors like `data-[state=open]:bg-primary/90`.
- **Dual-layer token model** as laid out in `port-strategy.md:14` — DGC scale tokens (`--blue-900`, `--space-4`, `--radius-md`) live in `:root`; DGC semantic aliases (`--fg-1`, `--bg-page`, `--accent`) reference them; shadcn semantic aliases (`--primary`, `--background`, `--foreground`) reference the DGC layer. `@theme inline` then exposes selected DGC tokens as Tailwind utilities.
- **Font stack is bilingual at `--font-sans`**, not per-component. Khmer cascade via `:lang(km) { line-height: 1.6 }` shipped in the same CSS file.

## User Constraints (from PROJECT.md + REQUIREMENTS.md + ROADMAP.md — no CONTEXT.md exists yet)

### Locked Decisions
- **Item name:** `dgc-theme` (REQUIREMENTS.md R3.1; ROADMAP.md line 36)
- **Type:** `registry:theme`
- **Token source of truth:** `project/colors_and_type.css` (values) + `builder/styles.css` (alias mapping + dark mode reference)
- **HEX → HSL channel-triplet format** (REQUIREMENTS.md R3.2; port-strategy.md §2)
- **Dark mode trigger:** `.dark` class on `<html>`, NOT `[data-theme="dark"]` (REQUIREMENTS.md R3.4; port-strategy.md §3)
- **Bilingual fonts:** Inter → Noto Sans Khmer → Kantumruy Pro → Battambang → system-ui → sans-serif (REQUIREMENTS.md R3.3)
- **Khmer line-height rule:** `:lang(km) { line-height: 1.6 }` must ship with theme
- **Downstream contract:** every component item declares `registryDependencies: ["dgc-theme"]` (R3.5)
- **Tailwind v4 only** — `@theme inline` in CSS, no `tailwind.config.ts` for token definition (PROJECT.md:35, Phase-1-RESEARCH §Standard Stack)
- **Smoke target:** `npx shadcn@latest add http://registry.016910804.xyz/r/dgc-theme.json` in a Phase-1-style scratch Next.js 15 + Tailwind v4 app produces `globals.css` whose rendered palette matches `project/preview/colors-primary.html`, `colors-neutrals.html`, `colors-semantic.html`.

### Claude's Discretion
- `@theme inline` scope — which DGC tokens expose as Tailwind utilities vs which stay plain CSS vars (recommendation below).
- Exact HSL rounding (to 0 decimals vs 1 decimal — choose 0, shadcn convention).
- Whether to ship a separate `fonts.css` asset or inline `@import` Google Fonts in the theme CSS (recommend inline — single-file install).
- Whether to expose spacing / radius as Tailwind utilities (`p-space-4`) or only as CSS vars (recommend CSS vars only; Tailwind v4's default 0.25rem scale is already in use).
- HSL conversion script location + exec frequency (recommend `scripts/hex-to-hsl.mjs`, run once, commit output).

### Deferred Ideas (OUT OF SCOPE)
- Registering Tailwind color utilities for every `--blue-*` scale token (Phase 3 components use semantic aliases, not scale tokens — no utility needed).
- A separate `registry:font` item (port-strategy.md §5 proposed this; Phase 2 inlines font `@import` into `dgc-theme` to keep install single-command).
- A `registry:lib` with `cn()` helper (Phase 1's `shadcn init` already wrote `src/lib/utils.ts` into the registry repo; consumers get it when installing a component, not the theme).
- Docs page `/docs/foundations/tokens` — ROADMAP.md lists it in Phase 2 scope but the registry-item shipment is the gate; docs page is a Phase 7 consolidation. This phase writes the tokens, not the docs renderer.
- Moul typeface — referenced in PROJECT.md:32 but not used in `colors_and_type.css`; drop from stack. Revisit if a heading component requires it.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| R3.1 | `dgc-theme` item ships `cssVars.theme/light/dark` + `tailwind.config` extensions | §4 `registry-item.json` sample |
| R3.2 | HEX → HSL channel-triplet conversion | §3 converter script; §5 full mapping table |
| R3.3 | Bilingual font stack at `fontFamily.sans` | §6 fonts |
| R3.4 | `.dark` class replaces `[data-theme="dark"]` | §5 dark column; §7 `globals.css` snippet |
| R3.5 | Downstream items pull via `registryDependencies: ["dgc-theme"]` | §9 |

## Standard Stack

### Core

| Package / concept | Version | Purpose | Why Standard |
|---|---|---|---|
| `shadcn` CLI | **4.4.0** | Emits `public/r/dgc-theme.json`; consumer CLI merges into `globals.css` | Verified Phase 1, same CLI. For `registry:theme`, CLI writes `cssVars` into consumer CSS; no component file to copy. [CITED: ui.shadcn.com/docs/registry/registry-item-json] |
| `tailwindcss` + `@tailwindcss/postcss` | **4.x** | `@theme inline` block consumes tokens as utility generators | Locked by Phase 1. [CITED: tailwindcss.com v4 install] |
| `colord` OR plain JS `rgb_to_hsl` | none (inline script) | Build-time HEX → HSL conversion | port-strategy.md §2 explicitly rejects runtime color libs. Hand-rolled 15-line function is simpler than a dep. [CITED: port-strategy.md §2] |
| `next/font/google` (optional) | Next 15 built-in | Optimized Google Fonts loading | Consumer's choice — theme file keeps `@import url(...)` as the portable fallback. Do NOT require `next/font` in theme — other consumers may use Vite. |

### Supporting
| Thing | Why |
|---|---|
| `registry-item.json` `files: []` with `type: "registry:theme"` path | Points at a committed `registry/dgc-theme/theme.css`; CLI inlines this into the emitted JSON's `files[].content` at build time |
| `cssVars` object in the item JSON | shadcn v4 CLI uses this for Tailwind v4 projects: keys become CSS var names, values are HSL triplets without `hsl()` wrapper |
| `@custom-variant dark (&:is(.dark *))` | Tailwind v4's equivalent of `darkMode: 'class'`; must be in the injected CSS |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| HSL triplets | `oklch()` (Tailwind v4 default) | shadcn's own Tailwind-v4 example globals.css ships `oklch` for the default neutral theme, BUT for custom brand palettes with designer-approved HEX values (our case), converting HEX → OKLCH loses fidelity on the P3 gamut at the edges of the Cambodian blues. HSL is lossless round-trip for sRGB hex. [ASSUMED — based on OKLCH vs sRGB gamut mapping; verify spot-check in task] |
| HSL triplets | Raw `#hex` | shadcn CLI v4 accepts both but raw hex breaks alpha-at-callsite (`bg-primary/90`), which Radix relies on. REJECT. [CITED: port-strategy.md §2 "alpha-at-callsite"] |
| Two files (`theme.css` + `tokens.css`) | One file | Single file = one shadcn CLI merge operation = one shot at the consumer's globals.css. REJECT split. |
| Separate `registry:font` item | Inline `@import` in theme | Separate item = two `shadcn add` commands. Violates R3.5 spirit. REJECT. |
| Moul Khmer typeface in stack | Drop Moul | Not present in `colors_and_type.css`; adding it would break visual parity with specimens. DROP. |

## HEX → HSL Converter (Node, self-contained)

Commit this as `scripts/hex-to-hsl.mjs`. Run once per token change; output goes into `registry/dgc-theme/theme.css`. Deterministic — no runtime dep.

```js
// scripts/hex-to-hsl.mjs — reads source CSS, emits HSL triplet table
// Usage: node scripts/hex-to-hsl.mjs <path-to-colors_and_type.css>
import { readFileSync } from "node:fs";
import { argv } from "node:process";

const src = readFileSync(argv[2] ?? "project/colors_and_type.css", "utf8");

function hexToHsl(hex) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? [...h].map(c => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0, hDeg = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hDeg = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hDeg = (b - r) / d + 2; break;
      case b: hDeg = (r - g) / d + 4; break;
    }
    hDeg *= 60;
  }
  return `${Math.round(hDeg)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Match lines like: `  --blue-900: #0D47A1;`
const rx = /--([a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{3,6})\s*;/g;
let m; const rows = [];
while ((m = rx.exec(src)) !== null) rows.push([m[1], m[2], hexToHsl(m[2])]);

for (const [name, hex, hsl] of rows) {
  console.log(`  --${name}: ${hsl};  /* ${hex} */`);
}
```

Round-trip sanity: `#0D47A1 → 216 85% 34%` (matches existing `port-strategy.md:24` expectation).

## Full Mapping Table — DGC scale → DGC alias → shadcn alias → HSL (light + dark)

Legend:
- **DGC scale token** — source of truth, owned by `colors_and_type.css`, keeps original hex as comment
- **DGC semantic alias** — from `colors_and_type.css` `:root`, used by DGC components directly (`--accent`, `--fg-1`, `--bg-page`)
- **shadcn semantic alias** — expected by `components/ui/*` (`--primary`, `--background`, `--foreground`, etc.)
- **HSL (light)** — committed value; computed by converter
- **HSL (dark)** — from `builder/styles.css` `[data-theme="dark"]` block, converted to HSL triplet

### Primary (Cambodia blues)

| DGC scale | hex | HSL | DGC alias | shadcn alias | shadcn HSL (light) | shadcn HSL (dark) |
|---|---|---|---|---|---|---|
| `--blue-950` | `#0A2A6B` | `220 83% 23%` | — | — | — | — |
| `--blue-900` | `#0D47A1` | `216 85% 34%` | `--accent` | `--primary`, `--ring`, `--accent`, `--sidebar-primary` | `216 85% 34%` | `207 90% 61%` (= `--blue-400` for dark CTA contrast) |
| `--blue-800` | `#1E4FB0` | `220 71% 40%` | `--border-focus`, `--fg-link` | — | — | — |
| `--blue-700` | `#1565C0` | `212 80% 42%` | — | — | — | — |
| `--blue-600` | `#1E88E5` | `208 79% 51%` | — | — | — | — |
| `--blue-500` | `#2196F3` | `207 90% 54%` | — | — | — | — |
| `--blue-400` | `#42A5F5` | `207 90% 61%` | — | (dark `--primary`) | — | `207 90% 61%` |
| `--blue-100` | `#E3F2FD` | `205 87% 94%` | `--bg-selected` | — | — | — |
| `--blue-050` | `#EEF4FB` | `212 62% 96%` | `--bg-hover` | — | — | — |
| derived `#0A3D8F` | `#0A3D8F` | `217 87% 30%` | `--accent-hover` | — | — | — |
| derived `#08347B` | `#08347B` | `217 88% 26%` | `--accent-press` | — | — | — |
| derived `#E3EAF3` | `#E3EAF3` | `214 40% 92%` | `--bg-press` | — | — | — |

### Neutrals

| DGC scale | hex | HSL | DGC alias | shadcn alias | HSL (light) | HSL (dark) |
|---|---|---|---|---|---|---|
| `--white` | `#FFFFFF` | `0 0% 100%` | `--bg-surface`, `--fg-on-primary` | `--background`, `--card`, `--popover`, `--primary-foreground`, `--destructive-foreground`, `--sidebar-primary-foreground` | `0 0% 100%` | `223 44% 13%` (`--dk-bg-surface`) |
| `--gray-050` | `#F5F7FA` | `216 33% 97%` | `--bg-page` | `--muted`, `--sidebar` | `216 33% 97%` | `226 49% 8%` (`--dk-bg-page`) |
| `--gray-100` | `#EEEEEE` | `0 0% 93%` | `--bg-surface-2` | `--secondary`, `--accent` (surface variant — careful: DGC `--accent` ≠ shadcn `--accent`; see §Pitfalls) | `0 0% 93%` | `224 41% 18%` |
| `--gray-200` | `#E0E0E0` | `0 0% 88%` | `--border`, `--bg-disabled` | `--border`, `--input` | `0 0% 88%` | `222 36% 22%` (`--dk-border`) |
| `--gray-300` | `#BDBDBD` | `0 0% 74%` | `--bg-disabled-strong` | — | — | — |
| `--gray-400` | `#9E9E9E` | `0 0% 62%` | `--fg-3`, `--border-strong` | `--muted-foreground` (partial) | `0 0% 62%` | `220 18% 71%` (`--dk-fg-2`) |
| `--gray-500` | `#757575` | `0 0% 46%` | `--fg-on-disabled` | — | — | — |
| `--gray-600` | `#616161` | `0 0% 38%` | `--fg-2` | `--muted-foreground` | `0 0% 38%` | `220 18% 71%` |
| `--gray-700` | `#424242` | `0 0% 26%` | — | — | — | — |
| `--gray-900` | `#212121` | `0 0% 13%` | `--fg-1` | `--foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--accent-foreground`, `--sidebar-foreground` | `0 0% 13%` | `217 39% 94%` (`--dk-fg-1`) |
| `--gray-950` | `#121417` | `216 12% 8%` | — | — | — | — |

### Semantic accents

| DGC scale | hex | HSL | DGC alias | shadcn alias | HSL (light) | HSL (dark) |
|---|---|---|---|---|---|---|
| `--green-700` | `#2E7D32` | `123 46% 34%` | `--success` | — (no shadcn alias; exposed as `--success`) | `123 46% 34%` | `123 46% 34%` |
| `--green-100` | `#E8F5E9` | `125 39% 94%` | `--success-bg` | — | `125 39% 94%` | `123 46% 34%` + alpha, or dark-tint TBD (see Open Q3) |
| `--amber-700` | `#F9A825` | `37 95% 56%` | `--warning` | — | `37 95% 56%` | same |
| `--amber-100` | `#FFF8E1` | `46 100% 94%` | `--warning-bg` | — | `46 100% 94%` | see Open Q3 |
| `--red-700` | `#C62828` | `0 66% 47%` | `--danger` | `--destructive` | `0 66% 47%` | `0 66% 47%` |
| `--red-600` | `#D32F2F` | `0 65% 51%` | (Cambodia red) | — | `0 65% 51%` | same |
| `--red-100` | `#FFEBEE` | `351 100% 96%` | `--danger-bg` | — | `351 100% 96%` | see Open Q3 |
| `--info-600` | `#0288D1` | `201 98% 41%` | `--info` | — | `201 98% 41%` | same |
| `--info-100` | `#E1F5FE` | `199 94% 94%` | `--info-bg` | — | `199 94% 94%` | see Open Q3 |

### shadcn aliases not mapped from a DGC scale (need a value)

| shadcn alias | Light | Dark | Rationale |
|---|---|---|---|
| `--primary-foreground` | `0 0% 100%` (white) | `220 83% 23%` (`--blue-950`) | Light text on blue CTA; dark mode = dark text on light-blue CTA |
| `--secondary-foreground` | `0 0% 13%` (`--gray-900`) | `217 39% 94%` | Dark text on gray-100 surface |
| `--muted-foreground` | `0 0% 38%` (`--gray-600`) | `220 18% 71%` | = DGC `--fg-2` |
| `--accent-foreground` (shadcn sense = fg on shadcn-accent surface) | `0 0% 13%` | `217 39% 94%` | Dark text on gray-100 |
| `--destructive-foreground` | `0 0% 100%` | `0 0% 100%` | White on red |
| `--radius` | `0.75rem` (12px, = `--radius-md`) | same | shadcn single-radius anchor; `--radius-sm/lg` derived via Tailwind `calc(var(--radius) - 2px)` style |
| `--ring` | `216 85% 34%` (`--blue-900`) | `207 90% 61%` | Focus ring; dark mode lightens for contrast |
| `--input` | `0 0% 88%` (`--gray-200`) | `222 36% 22%` | Matches border |
| `--sidebar` family (v4 additions) | Mirror `--background` / `--primary` / `--border` | Mirror dark variants | shadcn CLI v4 writes these; include them even if unused today to avoid future merge conflicts |

### Dark-mode surface overrides (from `builder/styles.css` lines 106-117)

| CSS var | Light HSL | Dark HSL | hex (dark) |
|---|---|---|---|
| `--bg-page` | `216 33% 97%` | `226 49% 8%` | `#0B1020` |
| `--bg-surface` | `0 0% 100%` | `223 44% 13%` | `#121A2E` |
| `--bg-surface-2` | `0 0% 93%` | `224 41% 18%` | `#1B2540` |
| `--bg-hover` | `212 62% 96%` | `221 46% 19%` | `#1A2847` |
| `--bg-selected` | `205 87% 94%` | `221 55% 26%` | `#1E3566` |
| `--fg-1` | `0 0% 13%` | `217 39% 94%` | `#E8EDF5` |
| `--fg-2` | `0 0% 38%` | `220 18% 71%` | `#A7B0C2` |
| `--fg-3` | `0 0% 62%` | `224 12% 48%` | `#6B7389` |
| `--border` | `0 0% 88%` | `222 36% 22%` | `#24304D` |
| `--border-strong` | `0 0% 62%` | `223 33% 34%` | `#3A4A72` |

## Tailwind v4 `@theme` block — what and where

shadcn's current Tailwind-v4 pattern (Phase-1-RESEARCH §globals.css):

```css
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Expose CSS vars as Tailwind utility generators */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  /* ...etc for all shadcn semantic aliases... */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

:root { /* HSL triplets for --primary, --background, etc. */ }
.dark { /* overrides */ }
```

- **`@theme inline`** is Tailwind v4's hook that turns CSS vars into utility classes (`bg-primary`, `text-foreground`). The `inline` keyword means "resolve `var()` at build time" — required when the value contains `var(--...)` from the same file.
- **shadcn aliases go in `@theme inline`** so `bg-primary` works.
- **DGC scale tokens (`--blue-900`, `--space-4`, `--shadow-1`) do NOT need to be in `@theme inline`** — they are plain CSS vars consumed by component code via `var(--blue-900)` or by shadcn aliases above. Exposing all 30 would pollute IntelliSense and produce unused utilities.
- **Exception:** `--font-sans`, `--font-mono`, `--radius` MUST be in `@theme inline` — Tailwind utilities and shadcn components read them.

## Sample `registry/dgc-theme/` layout

```
registry/
└── dgc-theme/
    └── theme.css          ← single file, committed
```

The `theme.css` content is the canonical snippet. `shadcn build` reads it, inlines it into `public/r/dgc-theme.json` under `files[].content`, and the consumer CLI merges the `cssVars` object + writes any file-content overrides into the consumer's `src/app/globals.css`.

### `registry-item.json` fragment (goes in root `registry.json` `items[]`)

```jsonc
{
  "name": "dgc-theme",
  "type": "registry:theme",
  "title": "DGC MiniApp Theme",
  "description": "Khmer-first DGC design tokens — color, type, spacing, radius, shadow — for Tailwind v4 + shadcn.",
  "dependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/dgc-theme/theme.css",
      "type": "registry:theme",
      "target": "src/app/globals.css"
    }
  ],
  "cssVars": {
    "theme": {
      "font-sans": "var(--font-latin), var(--font-khmer), system-ui, sans-serif",
      "font-mono": "'JetBrains Mono', 'Roboto Mono', ui-monospace, monospace",
      "radius": "0.75rem"
    },
    "light": {
      "background": "216 33% 97%",
      "foreground": "0 0% 13%",
      "card": "0 0% 100%",
      "card-foreground": "0 0% 13%",
      "popover": "0 0% 100%",
      "popover-foreground": "0 0% 13%",
      "primary": "216 85% 34%",
      "primary-foreground": "0 0% 100%",
      "secondary": "0 0% 93%",
      "secondary-foreground": "0 0% 13%",
      "muted": "0 0% 93%",
      "muted-foreground": "0 0% 38%",
      "accent": "0 0% 93%",
      "accent-foreground": "0 0% 13%",
      "destructive": "0 66% 47%",
      "destructive-foreground": "0 0% 100%",
      "border": "0 0% 88%",
      "input": "0 0% 88%",
      "ring": "216 85% 34%"
    },
    "dark": {
      "background": "226 49% 8%",
      "foreground": "217 39% 94%",
      "card": "223 44% 13%",
      "card-foreground": "217 39% 94%",
      "popover": "223 44% 13%",
      "popover-foreground": "217 39% 94%",
      "primary": "207 90% 61%",
      "primary-foreground": "220 83% 23%",
      "secondary": "224 41% 18%",
      "secondary-foreground": "217 39% 94%",
      "muted": "224 41% 18%",
      "muted-foreground": "220 18% 71%",
      "accent": "221 46% 19%",
      "accent-foreground": "217 39% 94%",
      "destructive": "0 66% 47%",
      "destructive-foreground": "0 0% 100%",
      "border": "222 36% 22%",
      "input": "222 36% 22%",
      "ring": "207 90% 61%"
    }
  }
}
```

### `registry/dgc-theme/theme.css` (full content — this is what consumer's `globals.css` becomes after install)

```css
/* DGC MiniApp Theme — injected by shadcn CLI */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kantumruy+Pro:wght@400;500;600;700&family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap");
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

/* Tailwind v4 @theme — exposes tokens as utilities */
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;
  --font-sans: var(--font-latin), var(--font-khmer), system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Roboto Mono", ui-monospace, monospace;
}

:root {
  /* === DGC scale — source of truth (HSL triplets + hex comments) === */
  --blue-950: 220 83% 23%;  /* #0A2A6B */
  --blue-900: 216 85% 34%;  /* #0D47A1 */
  --blue-800: 220 71% 40%;  /* #1E4FB0 */
  --blue-700: 212 80% 42%;  /* #1565C0 */
  --blue-600: 208 79% 51%;  /* #1E88E5 */
  --blue-500: 207 90% 54%;  /* #2196F3 */
  --blue-400: 207 90% 61%;  /* #42A5F5 */
  --blue-100: 205 87% 94%;  /* #E3F2FD */
  --blue-050: 212 62% 96%;  /* #EEF4FB */
  --red-700:  0 66% 47%;    /* #C62828 */
  --red-600:  0 65% 51%;    /* #D32F2F */
  --red-100:  351 100% 96%; /* #FFEBEE */
  --gray-950: 216 12% 8%;
  --gray-900: 0 0% 13%;
  --gray-700: 0 0% 26%;
  --gray-600: 0 0% 38%;
  --gray-500: 0 0% 46%;
  --gray-400: 0 0% 62%;
  --gray-300: 0 0% 74%;
  --gray-200: 0 0% 88%;
  --gray-100: 0 0% 93%;
  --gray-050: 216 33% 97%;
  --green-700: 123 46% 34%;
  --green-100: 125 39% 94%;
  --amber-700: 37 95% 56%;
  --amber-100: 46 100% 94%;
  --info-600:  201 98% 41%;
  --info-100:  199 94% 94%;

  /* === DGC semantic aliases — HSL triplets, referenced via hsl(var(--x)) === */
  --fg-1: var(--gray-900);
  --fg-2: var(--gray-600);
  --fg-3: var(--gray-400);
  --fg-on-primary: 0 0% 100%;
  --fg-link: var(--blue-800);
  --bg-page: var(--gray-050);
  --bg-surface: 0 0% 100%;
  --bg-surface-2: var(--gray-100);
  --bg-hover: var(--blue-050);
  --bg-selected: var(--blue-100);
  --bg-disabled: var(--gray-200);
  --fg-on-disabled: var(--gray-500);
  --border-dgc: var(--gray-200);         /* renamed to avoid collision with shadcn --border */
  --border-strong: var(--gray-400);
  --border-focus: var(--blue-800);
  --accent-dgc: var(--blue-900);         /* renamed to avoid collision */
  --accent-hover: 217 87% 30%;
  --accent-press: 217 88% 26%;
  --success: var(--green-700);    --success-bg: var(--green-100);
  --warning: var(--amber-700);    --warning-bg: var(--amber-100);
  --danger:  var(--red-700);      --danger-bg:  var(--red-100);
  --info:    var(--info-600);     --info-bg:    var(--info-100);

  /* === shadcn semantic aliases — HSL triplets === */
  --background: var(--gray-050);
  --foreground: var(--gray-900);
  --card: 0 0% 100%;
  --card-foreground: var(--gray-900);
  --popover: 0 0% 100%;
  --popover-foreground: var(--gray-900);
  --primary: var(--blue-900);
  --primary-foreground: 0 0% 100%;
  --secondary: var(--gray-100);
  --secondary-foreground: var(--gray-900);
  --muted: var(--gray-100);
  --muted-foreground: var(--gray-600);
  --accent: var(--gray-100);               /* shadcn "surface hover/subtle" — NOT DGC --accent-dgc */
  --accent-foreground: var(--gray-900);
  --destructive: var(--red-700);
  --destructive-foreground: 0 0% 100%;
  --border: var(--gray-200);
  --input: var(--gray-200);
  --ring: var(--blue-900);
  --radius: 0.75rem;

  /* === Type / space / shadow / motion (raw, not HSL) === */
  --font-khmer: "Noto Sans Khmer", "Kantumruy Pro", "Battambang", system-ui, sans-serif;
  --font-latin: "Inter", "Roboto", system-ui, -apple-system, sans-serif;
  --text-caption: 12px; --text-body-sm: 14px; --text-body: 16px;
  --text-section: 18px; --text-title: 20px; --text-title-lg: 24px; --text-display: 28px;
  --weight-regular: 400; --weight-medium: 500; --weight-semibold: 600;
  --leading-tight: 1.3; --leading-normal: 1.5; --leading-loose: 1.6;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --screen-margin: 16px; --gutter: 12px;
  --shadow-0: none;
  --shadow-1: 0 1px 2px rgba(16,24,40,0.05);
  --shadow-2: 0 2px 8px rgba(16,24,40,0.08);
  --shadow-3: 0 12px 24px rgba(16,24,40,0.12);
  --shadow-focus: 0 0 0 3px hsl(var(--blue-700) / 0.25);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 150ms; --dur-base: 200ms; --dur-slow: 300ms;
  --touch-min: 44px; --button-h: 48px; --input-h: 48px;
  --gradient-hero: linear-gradient(180deg, hsl(var(--blue-950)) 0%, hsl(var(--blue-800)) 100%);
  --bg-overlay: rgba(16, 24, 40, 0.48);
}

.dark {
  /* DGC dark surfaces */
  --bg-page: 226 49% 8%;
  --bg-surface: 223 44% 13%;
  --bg-surface-2: 224 41% 18%;
  --bg-hover: 221 46% 19%;
  --bg-selected: 221 55% 26%;
  --fg-1: 217 39% 94%;
  --fg-2: 220 18% 71%;
  --fg-3: 224 12% 48%;
  --border-dgc: 222 36% 22%;
  --border-strong: 223 33% 34%;

  /* shadcn dark */
  --background: 226 49% 8%;
  --foreground: 217 39% 94%;
  --card: 223 44% 13%;
  --card-foreground: 217 39% 94%;
  --popover: 223 44% 13%;
  --popover-foreground: 217 39% 94%;
  --primary: 207 90% 61%;
  --primary-foreground: 220 83% 23%;
  --secondary: 224 41% 18%;
  --secondary-foreground: 217 39% 94%;
  --muted: 224 41% 18%;
  --muted-foreground: 220 18% 71%;
  --accent: 221 46% 19%;
  --accent-foreground: 217 39% 94%;
  --destructive: 0 66% 47%;
  --destructive-foreground: 0 0% 100%;
  --border: 222 36% 22%;
  --input: 222 36% 22%;
  --ring: 207 90% 61%;
}

@layer base {
  * { @apply border-border outline-ring/50; }
  html, body {
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: var(--leading-normal);
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
  }
  /* Khmer bilingual cascade — required by R3.3 */
  :lang(km), [lang="km"], .khmer {
    font-family: var(--font-khmer);
    line-height: var(--leading-loose);  /* 1.6 for coeng/subscripts */
  }
  :where(button, a, input, select, textarea):focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
    border-radius: var(--radius-sm);
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0ms !important;
      transition-duration: 0ms !important;
    }
  }
}
```

## File layout in consumer app

shadcn CLI v4 reads `components.json > tailwind.css` to find the target globals.css. Phase 1 RESEARCH line 253 confirmed the scratch consumer has `components.json > tailwind.css = "src/app/globals.css"`. The `files[0].target` in the registry item matches. No detection ambiguity — CLI writes into whatever `components.json` says.

If a downstream consumer picked `app/globals.css` (no `src/`) during their own `shadcn init`, their `components.json` will reflect that, and the CLI auto-targets correctly. `files[0].target` in `dgc-theme` can be **omitted** for `registry:theme`; the CLI always uses `components.json > tailwind.css`. The sample above includes `target` for clarity but it is optional.

## `registryDependencies` for downstream components (R3.5)

Every Phase-3+ component item MUST declare:

```jsonc
{
  "name": "button",
  "type": "registry:ui",
  "registryDependencies": ["dgc-theme"],   // name only — same registry
  "files": [...]
}
```

If the consumer hasn't installed `dgc-theme` yet, the CLI fetches `https://<host>/r/dgc-theme.json` and merges it first. Accepted formats (from `shadcn-registry.md`):
- `"dgc-theme"` — same-registry name lookup (preferred)
- `"https://registry.016910804.xyz/r/dgc-theme.json"` — absolute URL (use for cross-registry deps like `"https://ui.shadcn.com/r/styles/new-york/button.json"` to inherit base shadcn button, if ever needed)

## Verification plan

Spot-check visual parity between installed theme and `project/preview/colors-*.html`:

### Automated (runs in CI Phase 2 gate)

1. **Build:** `pnpm dlx shadcn@latest build` — emits `public/r/dgc-theme.json`; fails if schema invalid.
2. **Schema lint:** JSON Schema validate against `https://ui.shadcn.com/schema/registry-item.json`.
3. **Token count assertion:** Node script reads emitted JSON, asserts all 18 shadcn aliases + all 30 DGC scale tokens are present in `cssVars` / file content. Fails on omission.
4. **Smoke install in scratch app:** spin up a `create-next-app@15 --tailwind` in temp dir, `shadcn add http://localhost:3000/r/dgc-theme.json`, `pnpm build`. Zero errors = pass.

### Manual (once per phase merge)

5. **Preview page:** Add `src/app/preview/tokens/page.tsx` to the registry repo that renders ALL DGC scale tokens as swatches, ALL semantic aliases as labeled boxes, bilingual type specimen, spacing/radius/shadow samples. Structure copies `project/preview/colors-primary.html` layout 1:1.
6. **Screenshot diff:** Open `/preview/tokens` in Chrome at 1280×720, take PNG. Open each `project/preview/colors-*.html` as baseline. Side-by-side eyeball diff — no pixel tool needed at this phase; visual parity or spot-mismatch only. If a future wave adds Playwright, use `page.screenshot` + image comparison threshold 5%.
7. **Dark mode toggle:** Same page, add `<html class="dark">` via a toggle, compare against `builder/styles.css` `[data-theme="dark"]` rendering.
8. **Khmer cascade:** Render sample Khmer text with `lang="km"` on a paragraph; confirm line-height jumps to 1.6 (vs 1.5 for latin).

## Pitfalls

### Pitfall 1: DGC `--accent` ≠ shadcn `--accent`
**What goes wrong:** DGC convention (from `colors_and_type.css:76`) defines `--accent: var(--blue-900)` — i.e. the brand CTA color. shadcn convention defines `--accent` as a **subtle surface color** (think hover state on a button-ghost, NOT the brand). If both aliases coexist unprefixed, the last one wins and components misrender.
**How to avoid:** Rename DGC's to `--accent-dgc` (or `--brand`) in the theme CSS. All DGC component code that referenced `var(--accent)` must be updated in Phase 3+ when those components are ported — but since Phase 3 components are authored fresh as shadcn components, they will naturally use shadcn's `--primary` (brand) and `--accent` (subtle). DGC's `builder/styles.css` uses `var(--accent)` freely; that file is the reference implementation, not shipped. Fresh components reference shadcn aliases.
**Warning signs:** Installing `dgc-theme` then a shadcn `button` and finding Ghost Button backgrounds are blue instead of light-gray.

### Pitfall 2: `hsl()` wrapper in CSS var value
**What goes wrong:** `--primary: hsl(216 85% 34%);` — then `background: hsl(var(--primary) / 0.9);` renders as `hsl(hsl(216 85% 34%) / 0.9)` → invalid, falls back to default.
**How to avoid:** Always store bare triplets. `--primary: 216 85% 34%;`. Wrap only at use: `hsl(var(--primary))`.
**Warning signs:** Radix state variants like `data-[state=open]:bg-primary/90` silently transparent.

### Pitfall 3: Leaving Tailwind v3 `@tailwind` directives in the merged globals.css
**What goes wrong:** Phase 1 scratch consumer's `globals.css` starts with `@import "tailwindcss";` (v4). If the shadcn CLI merge accidentally preserves an upstream `@tailwind base;` line, v4 + v3 directives coexist → base styles applied twice, cascade breaks.
**How to avoid:** Phase 1 RESEARCH Pitfall 2 already covered this for scaffold. For Phase 2, the theme.css in this research does NOT include `@tailwind` directives — only `@import "tailwindcss";`. Consumer runs phase-1-scaffolded app so v3 directives aren't present by construction. Include a CI check that greps for `@tailwind ` in any output globals.css.
**Warning signs:** Double-applied body styles, duplicate reset.

### Pitfall 4: Missing `--radius` breaks every shadcn component's `rounded-md`
**What goes wrong:** If `--radius` is omitted, shadcn's generated classes `rounded-md` compute to `calc(var(--radius) - 2px)` → `calc(-2px)` → clamped to `0` → all buttons/inputs become sharp rectangles.
**How to avoid:** `--radius: 0.75rem;` is mandatory in `:root`. Value corresponds to DGC `--radius-md = 12px`. Include in schema assertion (verification step 3).
**Warning signs:** Visual regression on first install — buttons look like plain divs.

### Pitfall 5: Dark-mode rule uses `[data-theme="dark"]`
**What goes wrong:** `builder/styles.css:106` uses `[data-theme="dark"]`. Copy-paste into the shadcn theme → Radix's `.dark` toggle (expected by `next-themes` and `@custom-variant dark`) doesn't match → dark palette never applies.
**How to avoid:** The `theme.css` above uses `.dark`. Port-strategy.md §3 locked this decision. Do NOT regress.
**Warning signs:** Dark toggle flips class but nothing changes visually.

### Pitfall 6: `@theme inline` block references a var that doesn't exist yet
**What goes wrong:** Tailwind v4 resolves `@theme inline` at build time. If `--color-primary: hsl(var(--primary))` but `:root` block is written after `@theme inline`, v4 may still resolve correctly (CSS cascade is declarative), but the Tailwind preprocessor parses top-to-bottom. Some v4 alpha versions misfire.
**How to avoid:** Keep current shadcn-recommended order: `@import`, `@custom-variant`, `@theme inline`, `:root`, `.dark`, `@layer base`. Matches Phase 1 RESEARCH globals.css.
**Warning signs:** `bg-primary` utility emits empty color at build.

### Pitfall 7: Khmer font not loaded in `next/font` consumer
**What goes wrong:** Consumer using `next/font/google` for Inter assumes all fonts come through `next/font`. The `@import url(...googleapis)` in our theme then adds ANOTHER font-loading mechanism — two sources for Inter, potential FOUT.
**How to avoid:** Document that consumers using `next/font` should either (a) add Noto Sans Khmer / Kantumruy Pro to their `next/font/google` call and remove our `@import url(...)` line, OR (b) leave the `@import` and skip `next/font` for fonts we already ship. For Phase 2, ship `@import url()` — consumer can override. Add note to `docs` field of the registry item (post-install message).
**Warning signs:** Khmer text renders in system fallback (fall-back fonts like Battambang or Siem Reap) instead of Noto Sans Khmer.

### Pitfall 8: `:lang(km)` doesn't cascade into Radix portals
**What goes wrong:** Radix Dialog/Popover portals render content at `body` root, not under `<html lang="km">`. The `:lang(km)` selector DOES cascade correctly (lang is inherited and `:lang()` matches ancestors' lang), but if someone sets `lang="km"` only on an inner element (not `<html>`), portal children won't match.
**How to avoid:** Document in the theme's install notes: "set `lang="km"` on `<html>` or `<body>`, not on a deep wrapper." Port-strategy.md §Research-flags already flagged this for Phase 3.
**Warning signs:** Khmer text inside a dialog renders with `line-height: 1.5` instead of 1.6.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | shadcn CLI v4 accepts HSL triplets in `cssVars.light/dark` values and injects them as-is | §4 sample | MEDIUM — if CLI expects `hsl(...)` wrapped values, the merged globals.css will have `background: hsl(hsl(…))`. Verify in Wave 0 task: install dgc-theme into scratch app, inspect merged globals.css. |
| A2 | `@theme inline --color-*: hsl(var(--*))` is the current shadcn pattern (vs `--color-*: var(--*)` which relies on browser evaluating `hsl()` dynamically) | §Tailwind v4 block | LOW — both patterns work for utility generation; verified by inspecting a fresh `shadcn init` output |
| A3 | OKLCH would lose fidelity for brand blues | §Alternatives | LOW — decision rationale; HSL round-trips sRGB hex perfectly regardless |
| A4 | `files[0].target` is optional for `registry:theme` | §consumer layout | LOW — `registry-item.json` docs say CLI uses `components.json` aliases; `target` is required only for `page`/`file` types |
| A5 | `@import url(…googleapis…)` in injected CSS does not conflict with CSS-in-JS or `next/font` | §Pitfall 7 | MEDIUM — may produce duplicate font downloads; mitigation is the docs-note |
| A6 | DGC dark-mode HSL values computed from `builder/styles.css` hex literals are correct | §Mapping | LOW — arithmetic; spot-check one value by hand |
| A7 | Dark-mode `--primary = --blue-400` (`207 90% 61%`) provides adequate contrast for `--primary-foreground = --blue-950` (dark text on light blue) | §Mapping | MEDIUM — WCAG contrast not formally checked. 61% L on 23% L delta is ~30 points; should pass AA for body (4.5:1) but verify with axe during Phase 2. |
| A8 | `--success-bg`, `--warning-bg`, `--danger-bg`, `--info-bg` do not need dark-mode variants because the backgrounds are mid-saturation tints that also work on dark surfaces | §Mapping Open Q3 | HIGH — visual spot-check against dark Alert component is mandatory. Possibly need darker-tinted versions for dark mode. Flag in Open Questions. |
| A9 | Consumer `components.json` always has `tailwind.css` pointing at an existing file | §consumer layout | LOW — shadcn init always creates it |

## Open Questions

1. **Should DGC's `--accent` be renamed to `--brand` instead of `--accent-dgc`?**
   - What we know: Rename is required to avoid shadcn collision.
   - What's unclear: Naming convention preference. `--brand` is shorter and more semantic (maps to "Cambodia blue"), `--accent-dgc` is mechanical.
   - Recommendation: Use `--brand` in the final theme. Update before Phase 3 — Phase 3 components will reference whichever we ship. Flag to planner for lock-in.

2. **Expose spacing / radius as Tailwind utilities via `@theme inline`?**
   - What we know: Tailwind v4 default spacing is `0.25rem * n`. DGC spacing is `4px * n` for n=1, then `8, 12, 16, 24, 32, 48, 64` — not a linear multiple.
   - What's unclear: Whether DGC-specific `p-space-4` utilities add value over shadcn components using inline `var(--space-4)`.
   - Recommendation: **Do NOT** expose DGC spacing as utilities. Components that need DGC spacing use `padding: var(--space-4)` inline in their TSX via the Tailwind `p-[var(--space-4)]` arbitrary-value escape hatch, OR components stick to Tailwind's default 4/8/12/16 utilities which happen to match. Revisit if Phase 3 components need it frequently.

3. **Dark-mode variants for `--success-bg`, `--warning-bg`, `--danger-bg`, `--info-bg`?**
   - What we know: Current light tints (`--green-100`, `--amber-100`, `--red-100`, `--info-100`) are very light, designed for light-mode surfaces. On dark surfaces they produce stark high-contrast blocks that feel wrong.
   - What's unclear: Whether DGC has dark-mode variants designed, or whether Alert components should use low-alpha overlay of the fg color instead.
   - Recommendation: Flag to user. Suggested fix: in `.dark` block, override `--success-bg: 123 46% 34% / 0.15` using Tailwind v4 modern alpha (requires `hsl(var(--success-bg))` change). Needs user sign-off on dark-mode Alert look.

4. **Moul typeface — include in stack or drop?**
   - What we know: PROJECT.md:32 references Moul; `colors_and_type.css` does not.
   - What's unclear: Whether Moul is intended for ceremonial headings (DGC branding) or was aspirational.
   - Recommendation: Drop for Phase 2. Flag to user. If headings need Moul, add a `--font-khmer-display` variable in a future phase.

5. **Include `--sidebar-*` tokens even though Phase 4 SideDrawer uses them differently?**
   - What we know: shadcn CLI v4 writes 6 `--sidebar-*` tokens into fresh `init`; Phase 4 `SideDrawer` is a Radix Dialog slide-left, not shadcn's `Sidebar` block.
   - What's unclear: Whether omitting these causes merge conflicts on later component installs that pull shadcn's `sidebar` as a peer.
   - Recommendation: Include them mirroring `--background`/`--primary`/`--border` for safety. Low cost, prevents future merge drift.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---|---|---|
| Node 20 + pnpm 10 | Run converter script | Assumed (Phase 1) | — | — |
| Phase-1-scaffolded registry repo | `shadcn build` pipeline | Phase 1 dependency | — | Blocks Phase 2 until Phase 1 merged |
| Scratch Next.js 15 + Tailwind v4 consumer dir | R3 smoke test | Create locally (sibling dir) | — | — |
| Internet / Google Fonts CDN | Font rendering | Yes | — | If offline, fallback to system-ui — Khmer renders via OS-installed Noto fallback if available |

**No blocking gaps.** Phase 2 is all authoring + configuration work on top of Phase 1 infra.

## Validation Architecture

### Test Framework

| Property | Value |
|---|---|
| Framework | None installed yet (consistent with Phase 1). Add `vitest` optionally for the HSL converter unit tests, OR ship as pure script with a CI assertion step |
| Config file | none |
| Quick run command | `pnpm lint && node scripts/hex-to-hsl.mjs project/colors_and_type.css > /tmp/out && pnpm dlx shadcn@latest build` |
| Full suite command | above + smoke-install in sibling scratch Next.js app + visual preview at `/preview/tokens` |
| Phase gate | `public/r/dgc-theme.json` present; smoke install succeeds; manual visual diff signed off |

### Phase Requirements → Test Map

| Req | Behavior | Test type | Automated Command | File Exists? |
|---|---|---|---|---|
| R3.1 | `dgc-theme.json` schema-valid | integration | `pnpm dlx shadcn build` exits 0 | Wave 0 creates registry-item |
| R3.2 | All HEX → HSL conversions correct | unit | `node scripts/hex-to-hsl.mjs --verify` (compares output against committed values) | Wave 0 creates script |
| R3.3 | Font stack includes Noto Sans Khmer | file check | grep `Noto Sans Khmer` in merged consumer globals.css after smoke install | manual-only |
| R3.4 | `.dark` class (not `[data-theme]`) | file check | grep `^\.dark ` in theme.css | ad-hoc |
| R3.5 | Downstream dep example works | integration | deferred to Phase 3 first component install |  — |
| Visual parity with `project/preview/colors-*.html` | Visual diff | manual | Render `/preview/tokens` + eyeball compare | manual-only |

### Wave 0 Gaps

- [ ] `scripts/hex-to-hsl.mjs` — the converter script above, committed
- [ ] `registry/dgc-theme/theme.css` — the full theme CSS above, committed
- [ ] `registry.json` updated: replace Phase-1 `hello` item (or keep alongside) with `dgc-theme` item; remove `hello` if no longer needed (confirm with planner)
- [ ] `src/app/preview/tokens/page.tsx` — the verification preview page
- [ ] Remove Phase-1 placeholder CSS from `src/app/globals.css` so the registry repo's OWN globals.css matches what a consumer would get after installing `dgc-theme` (self-host eats own dogfood)

*(No existing test framework to extend — Phase 2 adds none.)*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---|---|
| V5 Input Validation | low | Converter script reads trusted local file; no user input |
| V10 Malicious Code | yes | Theme CSS ships into consumer globals.css — supply-chain vector for `@import` URL hijack |
| V14 Configuration | yes | `@import url(fonts.googleapis.com)` — subresource integrity not applicable to CSS `@import` |

### Known Threat Patterns

| Pattern | STRIDE | Mitigation |
|---|---|---|
| Malicious CSS injected via theme update replaces fonts or adds trackers | Tampering | CODEOWNERS on `registry/dgc-theme/` + branch protection (inherited from Phase 1) |
| Google Fonts CDN compromised, serves malicious CSS | Tampering | Low risk (Google operational); mitigation = optional `next/font/google` for consumers who need to self-host |
| Consumer CLI auto-approves and merges theme CSS without review | Elevation | Out of scope — shadcn architecture makes this explicit; consumers always run `shadcn add` deliberately |

### Phase 2 Security Checklist

- [ ] Theme CSS contains no `expression()`, `url(javascript:…)`, or `@import` to untrusted origins
- [ ] HSL converter script has no network calls (pure function over local file)
- [ ] No secrets, API keys, or tracking snippets in `theme.css`
- [ ] `registry.json` item has stable `meta.version` (e.g. `0.2.0` for Phase 2) so consumers can detect upgrades

## Sources

### Primary (HIGH confidence)

- Existing project files read in full — `project/colors_and_type.css`, `builder/styles.css`, `project/fonts/fonts.css`
- `.planning/research/shadcn-registry.md` — registry-item schema, cssVars shape, registryDependencies
- `.planning/research/port-strategy.md` — HSL vs OKLCH decision, dual-layer token model, `.dark` vs `[data-theme]` migration
- `.planning/phases/1-scaffold/RESEARCH.md` — Tailwind v4 `@theme inline` pattern, CLI v4 behavior, `components.json` wiring, OIDC CI deploy
- PROJECT.md, REQUIREMENTS.md, ROADMAP.md — locked constraints

### Secondary (MEDIUM confidence)

- HSL values computed deterministically via `rgb_to_hls` from Python stdlib — round-tripped against hex
- shadcn CLI v4 behavior inherited from Phase 1 research (same `shadcn@4.4.0` version)

### Tertiary (flagged for Wave 0 verification)

- A1: HSL triplet pass-through in `cssVars` — verify by installing into scratch app and inspecting merged CSS
- A5: font `@import` / `next/font` interaction — verify during Phase 3 first component install

## Metadata

**Confidence breakdown:**
- Token format (HSL triplet): HIGH — settled in port-strategy.md and Phase 1
- Dual-layer mapping: HIGH — existing `builder/styles.css` already demonstrates the layering
- `@theme inline` block: HIGH — Phase 1 shipped this pattern
- Dark-mode HSL values: HIGH — arithmetic over committed hex literals
- Dark-mode tinted-backgrounds (Open Q3): MEDIUM — design call needed
- `:lang(km)` cascade through Radix portals: MEDIUM — flagged as Phase 3 verification

**Research date:** 2026-04-24
**Valid until:** 2026-05-24
