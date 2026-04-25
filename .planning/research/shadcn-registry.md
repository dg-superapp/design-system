# shadcn/ui Registry — Format & Authoring Workflow

**Researched:** 2026-04-24
**Confidence:** HIGH (official docs + community confirmation)
**Target audience:** DGC Mini-app Design System authors

---

## 1. What the Registry Is

A **registry** is a static JSON catalog of distributable code units (components, hooks, blocks, themes, pages) that the `shadcn` CLI can consume. The CLI fetches a JSON URL, resolves dependencies, and writes files into a consumer's project at the correct paths. It is **not** an npm package — source lives in the consumer repo after install, editable.

Shipping artefact = a folder of static `.json` files under `public/r/` on any static host.

---

## 2. `registry.json` — Registry Manifest

**Purpose:** Entry point that lists every item in the registry.

### Required fields

| Field | Type | Description |
|---|---|---|
| `$schema` | string | `https://ui.shadcn.com/schema/registry.json` |
| `name` | string | Registry name (used in data attributes/metadata) |
| `homepage` | string | Public URL of the registry's documentation site |
| `items` | array | List of `registry-item.json` objects |

### Example

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "dgc-miniapp",
  "homepage": "https://design.dgc.gov.kh",
  "items": [
    {
      "name": "dgc-theme",
      "type": "registry:theme",
      "title": "DGC Mini-app Theme",
      "description": "Khmer-first design tokens (light/dark).",
      "files": [
        { "path": "registry/dgc/theme.css", "type": "registry:theme" }
      ]
    }
  ]
}
```

---

## 3. `registry-item.json` — Per-Item Schema

Every entry in `items[]` (or a standalone hosted item) conforms to this.

### Fields

| Field | Required | Description |
|---|---|---|
| `$schema` | yes (standalone) | `https://ui.shadcn.com/schema/registry-item.json` |
| `name` | yes | Unique slug (kebab-case). Becomes `/r/<name>.json` |
| `type` | yes | See item types below |
| `title` | recommended | Human-readable short name |
| `description` | recommended | Longer marketing/docs blurb |
| `dependencies` | no | npm packages to install (e.g. `["zod", "clsx"]`) |
| `devDependencies` | no | npm dev packages |
| `registryDependencies` | no | Other registry items this one needs. URL or name. e.g. `["button", "https://acme.com/r/card.json"]` |
| `files` | yes (usually) | Array of source files — see below |
| `tailwind` | no | `{ config: { theme, plugins, content } }` — Tailwind extensions (colors, keyframes, animations) |
| `cssVars` | no | `{ theme: {...}, light: {...}, dark: {...} }` — CSS variables |
| `css` | no | Raw CSS snippets to inject (utilities, layers, keyframes) |
| `docs` | no | Message shown in CLI after install (post-install instructions) |
| `categories` | no | Tags for grouping (e.g. `["forms", "dashboard"]`) |
| `meta` | no | Free-form metadata object (version, author, etc.) |

### `type` values

| Type | Purpose | Default target |
|---|---|---|
| `registry:ui` | Reusable low-level UI (button, dialog) | `components/ui/` |
| `registry:component` | Higher-level composed components | `components/` |
| `registry:block` | Full blocks/sections (landing hero, sign-in card) | `components/` |
| `registry:hook` | React hooks | `hooks/` |
| `registry:lib` | Utilities (`cn`, formatters, adapters) | `lib/` |
| `registry:theme` | Design tokens (CSS vars + Tailwind config) | CSS vars injected into `globals.css` |
| `registry:style` | Base style (extends `new-york`/`default`) | base-level |
| `registry:page` | Full route (App Router `page.tsx`) | **`target` required** |
| `registry:file` | Arbitrary file (`.env`, `tsconfig.json`) | **`target` required** |

### `files[]` entry

```json
{
  "path": "registry/dgc/components/button.tsx",
  "type": "registry:ui",
  "target": "components/ui/button.tsx"  // optional for ui/component/hook/lib; required for page/file
}
```

- `path` — source location in *your* registry repo. Build script reads it.
- `type` — per-file type (can differ from parent item type).
- `target` — destination in *consumer* project. Omit for standard types (CLI infers from `components.json` aliases).

### Full example — a themed button item

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "dgc-button",
  "type": "registry:ui",
  "title": "DGC Button",
  "description": "Khmer-ready button with primary/secondary variants.",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["https://design.dgc.gov.kh/r/dgc-theme.json"],
  "files": [
    { "path": "registry/dgc/components/button.tsx", "type": "registry:ui" }
  ],
  "tailwind": {
    "config": {
      "theme": {
        "extend": {
          "colors": { "dgc-brand": "hsl(var(--dgc-brand))" }
        }
      }
    }
  },
  "cssVars": {
    "light": { "dgc-brand": "oklch(0.55 0.2 250)" },
    "dark":  { "dgc-brand": "oklch(0.72 0.15 250)" }
  },
  "docs": "Ensure globals.css imports the dgc-theme tokens.",
  "categories": ["buttons", "forms"],
  "meta": { "version": "0.1.0", "author": "DGC" }
}
```

---

## 4. Theme / Token Export Pattern

Ship design tokens as a `registry:theme` item. Three surfaces:

1. **Root CSS vars** via `cssVars.theme` (font stacks, radii) — emitted under `:root`.
2. **Light/dark palettes** via `cssVars.light` / `cssVars.dark` — emitted under `:root` and `.dark`.
3. **Tailwind extensions** via `tailwind.config.theme.extend` — colors, keyframes, animations.

For Tailwind v4, use the `@theme inline` block (docs recommend pairing CSS vars with `@theme inline --color-x: var(--x)`). CLI writes changes into consumer's `app/globals.css`.

---

## 5. Build Workflow

```bash
# in your registry repo (Next.js project)
npx shadcn build            # reads ./registry.json
# --> writes ./public/r/<name>.json for every item
# --> also writes ./public/r/registry.json (the index)

# override output dir:
npx shadcn build -o ./dist/r
```

Each item becomes a URL: `https://<host>/r/<name>.json`. The index itself is `https://<host>/r/registry.json`.

---

## 6. Consumer Installation

```bash
# Direct URL
npx shadcn@latest add https://design.dgc.gov.kh/r/dgc-button.json

# Namespaced (shadcn 3.0+, requires components.json registry config)
npx shadcn@latest add @dgc/dgc-button
```

The CLI:
1. Fetches the item JSON.
2. Resolves `registryDependencies` recursively.
3. `npm install`s `dependencies` / `devDependencies`.
4. Writes `files[]` to resolved `target` paths (uses consumer's `components.json` aliases).
5. Merges `cssVars` / `tailwind` into consumer's `globals.css` / Tailwind config.
6. Prints `docs` message.

---

## 7. Hosting

| Host | Notes |
|---|---|
| **Vercel** | Zero-config. Official `registry-template` targets Vercel. Preferred. |
| **Cloudflare Pages** | Works — static output fine. Free tier generous. |
| **Netlify** | Works — static output fine. |
| **GitHub Pages** | Works for *public* repos; static JSON only. |
| **Private / auth-gated** | Configure `components.json` → `registries.<name>.headers` with `"Authorization": "Bearer ${TOKEN}"`, `"X-API-Key": "${KEY}"`, or `params: { token: "${T}" }`. Tokens read from `.env.local`. Namespaced registries required. |

CORS: items are plain JSON fetched by the CLI (Node), not the browser — CORS generally not a concern.

---

## 8. File Target Resolution

CLI reads consumer's `components.json`:

```json
{
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "hooks": "@/hooks",
    "lib": "@/lib"
  }
}
```

- `registry:ui` files → `<ui alias>/<filename>`
- `registry:component` → `<components alias>/<filename>`
- `registry:hook` → `<hooks alias>/<filename>`
- `registry:lib` → `<lib alias>/<filename>`
- `registry:page` / `registry:file` — **must specify `target`** (e.g. `app/onboarding/page.tsx`).

---

## 9. Constraints & Gotchas

- **React + Tailwind only** officially. Components use `.tsx`. Svelte and Vue have separate forks (`shadcn-svelte`, `shadcn-vue`) with their own registries.
- **CSS vars expected in `globals.css`** (or the file set in `components.json → tailwind.css`).
- **Tailwind v4** changes the story: tokens live in `@theme inline` CSS blocks rather than `tailwind.config.ts`. Registry CLI v4 (March 2026) handles both but prefers CSS-var-first for v4 projects.
- **`target` required for `registry:page` and `registry:file`** — CLI has no sensible default.
- **`registryDependencies` accepts URLs** — cross-registry composition works (your item can depend on a vanilla shadcn `button`).
- **Review on install** — registries inject code into consumer projects. Community registries carry supply-chain risk; namespace isolation mitigates but does not eliminate.
- **No versioning primitive** — registries are HEAD-only. Use `meta.version` + git tags in the registry repo; consumers re-run `add` to upgrade. No `shadcn update` semver resolver.

---

## 10. Real-World References

| Registry | Focus | URL |
|---|---|---|
| **Magic UI** | Animated marketing/landing components | https://magicui.design |
| **Aceternity UI** | Framer Motion effects, spotlights, reveals | https://ui.aceternity.com |
| **Tweakcn** | Visual theme editor → exports `registry:theme` items | https://tweakcn.com |
| **Official template** | Starter repo | https://github.com/shadcn-ui/registry-template |
| **Community index** | Browsable directory | https://registry.directory |

---

## Sources

- [shadcn Registry — Introduction](https://ui.shadcn.com/docs/registry)
- [registry.json schema](https://ui.shadcn.com/docs/registry/registry-json)
- [registry-item.json schema](https://ui.shadcn.com/docs/registry/registry-item-json)
- [Getting Started](https://ui.shadcn.com/docs/registry/getting-started)
- [Examples](https://ui.shadcn.com/docs/registry/examples)
- [Authentication](https://ui.shadcn.com/docs/registry/authentication)
- [Namespaces](https://ui.shadcn.com/docs/registry/namespace)
- [CLI v4 changelog (March 2026)](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4)
- [Theming](https://ui.shadcn.com/docs/theming)
- [Official registry-template repo](https://github.com/shadcn-ui/registry-template)
- [Awesome shadcn registries](https://www.shadcn.io/awesome/registries)
