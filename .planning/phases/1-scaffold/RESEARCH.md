# Phase 1: Scaffold & Publish Pipeline — Research

**Researched:** 2026-04-24
**Domain:** Next.js 15 + Tailwind v4 + shadcn CLI v4 + GitHub Pages static export
**Confidence:** HIGH (versions VERIFIED via npm registry 2026-04-24; patterns CITED from shadcn + Next.js docs; specific edge cases ASSUMED where marked)

## Summary

Phase 1 scaffolds a Next.js 15 App Router project that doubles as preview site and static shadcn registry host, deployable to GitHub Pages at `registry.dg-superapp.com` via GitHub Actions. Every piece of this stack reached maturity in early 2026: shadcn CLI v4 (March 2026) natively supports Tailwind v4 and empty `tailwind` field in `components.json`; Next.js 15 static export is well-documented; GitHub Pages + custom domain via `actions/deploy-pages@v4` is standard. The phase validates the pipeline end-to-end with one placeholder `hello` item (`registry:ui`) installable from the live URL.

**Primary recommendation:** Bootstrap with `pnpm create next-app@latest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`, then run `pnpm dlx shadcn@latest init` (answer "New project / registry"), add `registry.json` + `registry/hello/hello.tsx`, configure `output: 'export'`, and ship the Actions workflow. Node 20 + pnpm 10 in CI.

## User Constraints (from PROJECT.md + REQUIREMENTS.md — no CONTEXT.md exists yet)

### Locked Decisions (from PROJECT.md / REQUIREMENTS.md / config.json)
- **Framework:** Next.js 15 App Router (PROJECT.md:36 "React 19 + Next.js 15"). Next.js 16 shipped April 2026 but is OUT OF SCOPE — stick to 15.x.
- **Styling:** Tailwind v4 CSS-first config, `@theme` block (PROJECT.md:35). Do NOT use v3 as starting point; v3 migration path only documented, not shipped.
- **Language:** TypeScript (config.json `ts: true`).
- **Package manager:** pnpm (config.json `package_manager: "pnpm"`).
- **Registry host:** Static export → GitHub Pages at `registry.dg-superapp.com` (PROJECT.md:12, ROADMAP.md:12–13).
- **Repo target:** `dg-superapp/design-system` (or `dg-superapp/ui` — open question, confirm in kickoff; ROADMAP.md:135).
- **Placeholder item:** One `hello` `registry:ui` for pipeline validation (ROADMAP.md:13).
- **Custom domain:** `registry.dg-superapp.com` via `CNAME` file + DNS (REQUIREMENTS.md R2.3).
- **CI trigger:** `push: branches: [main]` + `workflow_dispatch` (REQUIREMENTS.md R2.1).
- **Broken build fails CI:** R2.4.

### Claude's Discretion
- Exact ESLint + Prettier config (R10.4 requires they exist; specifics up to Claude).
- Node.js major version in CI (constraint: ≥ 20; Phase 1 pins 20 LTS).
- pnpm major version (constraint: latest stable; Phase 1 pins 10.x).
- Whether `public/r/` is gitignored or committed (recommendation below).
- Internal layout of `registry/` subfolders.
- `components.json` style (`new-york` vs `default`).

### Deferred Ideas (OUT OF SCOPE for Phase 1)
- Real components (buttons, inputs, etc.) — Phase 3.
- DGC theme tokens — Phase 2.
- MDX docs, Playwright consumer tests, axe checks — Phases 7 / 10.
- `/v1/` versioned paths, bearer-auth registries (PROJECT.md:22–23).
- Builder port (PROJECT.md:24).
- npm package publishing (REQUIREMENTS.md:95).

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| R1.1 | Scaffold Next.js 15 + Tailwind v4 + TS + shadcn CLI + pnpm | §1 Bootstrap, §3 Tailwind v4 |
| R1.2 | Root `registry.json` with `$schema` set | §5 registry.json stub |
| R1.3 | `npx shadcn build` emits JSON per item into `public/r/` | §6 Build command |
| R1.4 | Scratch consumer can `shadcn@latest add http://localhost:3000/r/hello.json` | §9 Smoke test |
| R2.1 | Actions workflow: install → build → shadcn build → deploy-pages | §7 Workflow YAML |
| R2.2 | Preview site + `/r/*.json` served at same origin | §2 Static export config |
| R2.3 | Custom domain via `CNAME` + DNS | §8 CNAME + repo settings |
| R2.4 | Broken `shadcn build` fails CI | §7 Workflow YAML (step ordering) |
| R10.4 | Prettier + ESLint, CI fails on lint | §10 Linting |
| R10.5 | README.md + CONTRIBUTING.md stubs | §11 Directory layout / this phase |

## Standard Stack

### Core (VERIFIED via `npm view <pkg> version` on 2026-04-24)

| Package | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | **15.x** (pin to latest 15.x, not 16) | React framework / static export | PROJECT.md locks React 19 + Next 15. `next@latest` currently resolves to 16.2.4 — use `next@^15.0.0` in `package.json`. [VERIFIED: npm registry returns next@16.2.4 latest; 15.x line still maintained] |
| `react`, `react-dom` | **19.x** | UI runtime | PROJECT.md locks React 19. `react@latest` = 19.2.5. [VERIFIED] |
| `typescript` | **5.x** (latest) | Types | Required by Next 15 App Router |
| `tailwindcss` | **4.x** (latest = 4.2.4) | Utility CSS + CSS-first `@theme` | PROJECT.md locks v4. Ships via `@tailwindcss/postcss`. [VERIFIED] |
| `@tailwindcss/postcss` | **4.x** (match tailwindcss) | PostCSS plugin Tailwind v4 requires | Tailwind v4 no longer autoloads; you must list this plugin in `postcss.config.mjs`. [CITED: tailwindcss.com v4 install docs] |
| `shadcn` | **4.x** (latest = 4.4.0) | CLI: `init`, `add`, `build` | March 2026 v4 adds first-class Tailwind v4 + registry + namespaces. [VERIFIED: npm show shadcn@4.4.0; CITED: ui.shadcn.com/docs/changelog/2026-03-cli-v4] |
| `pnpm` | **10.x** (latest = 10.33.2) | Package manager | config.json locks pnpm. [VERIFIED] |
| Node.js | **20 LTS** in CI | Runtime | Next 15 minimum is Node 18.18; 20 is current LTS and default in GitHub Actions examples. Node 22 LTS works too but pin one. [CITED: nextjs.org installation docs] |

### Supporting

| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `eslint` | 9.x | Lint | Next 15 ships `eslint-config-next`; use flat config (`eslint.config.mjs`) |
| `eslint-config-next` | match next (15.x) | Next rules preset | Auto-installed by `create-next-app --eslint` |
| `prettier` | 3.x | Formatting | Required by R10.4 |
| `prettier-plugin-tailwindcss` | 0.6.x | Class sorting | Tailwind v4 compatible since 0.6.0 |
| `lucide-react` | latest | Icons (future phases) | Not installed in Phase 1 — deferred to Phase 3 |
| `clsx` + `tailwind-merge` | latest | `cn()` util | shadcn init installs these. Phase 1 needs `cn()` if `hello.tsx` uses it |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js 15 | Next.js 16 | v16 shipped April 2026, works with static export. Rejected: PROJECT.md explicitly pins 15, and early adopters report shadcn CLI edge cases. Re-evaluate for v1.1. [ASSUMED] |
| pnpm | npm or bun | pnpm has fewest hoisting issues with Next + shadcn-injected deps. Locked by config.json. |
| GitHub Pages | Vercel / Cloudflare Pages | Pages is locked by PROJECT.md (`registry.dg-superapp.com`, government asset, single-repo simplicity). Vercel would actually be easier, but GH Pages meets the constraint. |
| `new-york` shadcn style | `default` | Irrelevant for Phase 1 (no shadcn components installed yet). Pick `new-york` — it matches DGC visual spec's thinner borders. |

### Installation Command (copy-pastable)

```bash
# 1. Bootstrap Next.js 15 project (force next@15 even though 16 is latest)
pnpm create next-app@latest dgc-miniapp-shadcn \
  --typescript --tailwind --eslint --app --src-dir --turbopack \
  --import-alias "@/*" --use-pnpm

# If create-next-app@latest scaffolds Next 16, downgrade:
cd dgc-miniapp-shadcn
pnpm add next@^15.0.0 react@^19 react-dom@^19
pnpm add -D @types/react@^19 @types/react-dom@^19

# 2. Install shadcn CLI + Prettier (ESLint already installed by create-next-app)
pnpm add -D shadcn@latest prettier prettier-plugin-tailwindcss

# 3. Initialize shadcn (answer prompts: style=new-york, RSC=yes, css=src/app/globals.css, baseColor=neutral, cssVariables=yes, tailwind.config=(leave blank for v4))
pnpm dlx shadcn@latest init

# 4. Verify Tailwind v4 is installed (not v3)
pnpm list tailwindcss   # should show 4.x; if 3.x, upgrade: pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest
```

**Version verification:** Run `pnpm list next react tailwindcss shadcn pnpm` after bootstrap; fail the task if any is wrong.

## Architecture Patterns

### Recommended Project Structure

```
dgc-miniapp-shadcn/                # repo root (sibling folder to source design system)
├── registry.json                  # ROOT manifest — lists all items
├── registry/                      # AUTHORED source (committed)
│   └── hello/
│       └── hello.tsx              # Phase 1 placeholder
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # preview landing page
│   │   └── globals.css            # Tailwind v4 + @theme + shadcn vars
│   └── lib/
│       └── utils.ts               # cn() from shadcn init
├── public/
│   ├── CNAME                      # registry.dg-superapp.com (single line, no newline-trailing issues)
│   ├── .nojekyll                  # disable Jekyll on GH Pages
│   └── r/                         # GENERATED by `shadcn build` — see §11 gitignore decision
│       ├── registry.json
│       └── hello.json
├── components.json                # shadcn config (aliases, css path, tailwind=blank for v4)
├── next.config.mjs                # output: 'export', images.unoptimized: true
├── postcss.config.mjs             # @tailwindcss/postcss
├── eslint.config.mjs              # flat config, next/core-web-vitals
├── .prettierrc.json
├── .prettierignore
├── .gitignore                     # includes /out, /.next, maybe /public/r
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── README.md                      # R10.5
├── CONTRIBUTING.md                # R10.5
└── .github/
    └── workflows/
        └── deploy.yml             # R2.1
```

### Pattern 1: Commit Input, Generate Output
**What:** Commit `registry/*.tsx` and `registry.json` (authored). Generate `public/r/*.json` in CI.
**When to use:** Always. Keeps diffs clean — changes to a `.tsx` don't double-noise with regenerated JSON.
**Tradeoff:** Local preview at `/r/hello.json` requires running `pnpm shadcn build` manually. Add `pnpm dev` convenience script (see §6).

### Pattern 2: Preview Site + Registry Same-Origin
**What:** The Next.js app exports to `out/`, `public/r/` is copied into `out/r/`, `actions/upload-pages-artifact@v3` ships `out/`. Both `https://registry.dg-superapp.com/` (preview) and `https://registry.dg-superapp.com/r/hello.json` (registry) serve from one artifact.
**When to use:** shadcn registry + docs site pattern (REQUIREMENTS.md R2.2). Matches official `shadcn-ui/registry-template` layout.

### Anti-Patterns to Avoid
- **Serving registry via `raw.githubusercontent.com`:** 403/429 errors, no CORS. NEVER document as install URL. (research/github-hosting.md:122)
- **Committing `public/r/` generated files:** Creates merge conflicts on every component change; diff noise obscures real source changes.
- **Mixing `next build` and `next export` (pre-13 pattern):** Deprecated. Use `output: 'export'` in `next.config.mjs` — single command emits `out/`.
- **Leaving `basePath` set after custom domain wired:** Breaks asset URLs. Set `basePath` only for the bare `user.github.io/repo` path; remove once custom domain active. (research/github-hosting.md:135)
- **Skipping `.nojekyll`:** GH Pages strips `_next/` folder contents because of underscore prefix. (CITED: GitHub Pages docs)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bundling registry items into JSON | Custom glob + fs walk | `shadcn build` | CLI handles dependency graph, inline file content, schema validation |
| GH Pages deploy step | Custom gh-pages branch push | `actions/deploy-pages@v4` + `upload-pages-artifact@v3` | Official action, OIDC auth, zero config |
| Tailwind class sorting | Custom ESLint rule | `prettier-plugin-tailwindcss` | Official plugin, v4 compatible |
| HSL conversion (future phase) | Runtime lib | Build-time script | Only need once, 30 colors, avoid bundle bloat |
| pnpm version in CI | Custom setup | `pnpm/action-setup@v4` | Caches pnpm store, handles corepack |
| Node install in CI | Custom install | `actions/setup-node@v4` with `cache: pnpm` | Built-in pnpm store caching |

**Key insight:** Phase 1 is almost entirely configuration glue between well-maintained tools. Hand-rolling anything here means debugging someone else's solved problem.

## Common Pitfalls

### Pitfall 1: `create-next-app` scaffolds Next.js 16, not 15
**What goes wrong:** `pnpm create next-app@latest` in April 2026 installs next@16.2.4. PROJECT.md locks v15.
**Why it happens:** `create-next-app@latest` always tracks newest stable.
**How to avoid:** After bootstrap, run `pnpm add next@^15.0.0` to pin, verify in `package.json`. Alternative: `pnpm create next-app@15 …` pins both CLI and template.
**Warning signs:** `package.json` shows `"next": "16.x.x"` instead of `^15`.

### Pitfall 2: Tailwind v4 silently stays on v3
**What goes wrong:** `create-next-app --tailwind` as of 2026 installs v4 by default, but if anyone manually regresses a dep or copies an old template, Tailwind stays on v3. shadcn CLI v4 behaves differently for v3 vs v4 projects.
**Why it happens:** v3 is still supported; CLI doesn't force-upgrade.
**How to avoid:** After init, open `package.json` and confirm `"tailwindcss": "^4.x"`. Confirm `postcss.config.mjs` contains `@tailwindcss/postcss`, not `tailwindcss: {}` + `autoprefixer: {}`. Confirm `globals.css` starts with `@import "tailwindcss";` not `@tailwind base; @tailwind components; @tailwind utilities;`.
**Warning signs:** Three `@tailwind` directives in `globals.css`; `tailwind.config.js/ts` with full `content: []` array; CSS `@layer` directives nested manually.

### Pitfall 3: `output: 'export'` breaks on dynamic features
**What goes wrong:** Any `route.ts`, `revalidate: 0`, `fetch(..., { cache: 'no-store' })`, server actions, or `headers()`/`cookies()` call aborts static export with a build error.
**Why it happens:** Static export requires fully-static HTML; no runtime Node server.
**How to avoid:** Phase 1's preview `src/app/page.tsx` is pure RSC with no data fetching. Keep it that way. Defer any dynamic demos to a client component behind `'use client'`.
**Warning signs:** `Error: Page "/something" cannot use "export"`, `dynamic = "force-static"` workarounds.

### Pitfall 4: CNAME file disappears after deploy
**What goes wrong:** On some setups, the `CNAME` file in `public/` gets stripped and GH Pages resets to default domain.
**Why it happens:** `actions/deploy-pages@v4` with a custom domain requires CNAME in the deployed artifact. If someone adds `public/` to `.gitignore` or the file gets nuked, domain breaks.
**How to avoid:** Commit `public/CNAME` to git, never in `.gitignore`. Workflow should NOT run a `rm -rf public/*` clean step.
**Warning signs:** `registry.dg-superapp.com` suddenly returns GitHub 404 page; check repo Settings → Pages shows the custom domain cleared.

### Pitfall 5: `shadcn build` runs before `pnpm install` completes / wrong order
**What goes wrong:** CI runs `pnpm build` (which excludes registry JSON) then `shadcn build` (generates JSON), then the build artifact `out/` is uploaded — but `out/` doesn't contain `/r/*.json` because it was written to `public/r/` AFTER `next build` already copied `public/` → `out/`.
**Why it happens:** `next build` with `output: 'export'` copies `public/` once at build time. Files added to `public/` afterward are NOT in `out/`.
**How to avoid:** Run `shadcn build` BEFORE `next build`. OR add a post-step `cp -r public/r out/r` (per research/github-hosting.md:98). Recommend the first — cleaner.
**Warning signs:** `https://registry.dg-superapp.com/` loads but `/r/hello.json` returns 404.

### Pitfall 6: `workflow_dispatch` permissions insufficient
**What goes wrong:** Manual re-run fails with "Resource not accessible by integration."
**Why it happens:** `deploy-pages@v4` requires `id-token: write` + `pages: write` in the workflow's top-level `permissions:` block.
**How to avoid:** Copy the `permissions:` block verbatim from §7 below.

## Code Examples

Verified patterns. Sources noted inline.

### `next.config.mjs` (minimal static export — CITED: nextjs.org/docs/app/guides/static-exports)

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },          // static export disallows next/image optimization
  trailingSlash: true,                     // helps GH Pages directory-style serving
  // basePath / assetPrefix intentionally OMITTED — custom domain serves at root.
  // Set them ONLY if testing at dg-superapp.github.io/design-system/ (pre-domain).
};
export default nextConfig;
```

### `components.json` (Tailwind v4 — tailwind.config blank per CITED: ui.shadcn.com/docs/tailwind-v4)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@dgc": "http://localhost:3000/r/{name}.json"
  }
}
```

*Note:* `tailwind.config: ""` is intentional for v4 — no separate config file. `registries.@dgc` is for LOCAL smoke-test only; production consumer `components.json` would use `https://registry.dg-superapp.com/r/{name}.json`.

### `src/app/globals.css` (Tailwind v4 CSS-first — CITED: ui.shadcn.com/docs/tailwind-v4)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Phase 1 ships empty theme — Phase 2 populates DGC tokens here.
     Example of what Phase 2 will add:
     --color-primary: var(--primary);
     --color-background: var(--background);
     --radius-md: calc(var(--radius) - 2px);
  */
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* Phase 2 replaces these with HEX→HSL-converted DGC tokens */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

### `postcss.config.mjs` (Tailwind v4 — CITED: tailwindcss.com v4 docs)

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### `registry.json` (root manifest — CITED: ui.shadcn.com/docs/registry/registry-json)

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "dgc-miniapp",
  "homepage": "https://registry.dg-superapp.com",
  "items": [
    {
      "name": "hello",
      "type": "registry:ui",
      "title": "Hello World (pipeline placeholder)",
      "description": "Phase 1 placeholder — validates the shadcn build + GH Pages deploy pipeline. Remove in Phase 2.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/hello/hello.tsx",
          "type": "registry:ui",
          "target": "components/ui/hello.tsx"
        }
      ],
      "cssVars": {}
    }
  ]
}
```

### `registry/hello/hello.tsx` (placeholder component)

```tsx
// registry/hello/hello.tsx
import * as React from "react";

export interface HelloProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
}

export function Hello({ name = "world", className, ...props }: HelloProps) {
  return (
    <div
      className={["rounded-md border bg-background p-4 text-foreground", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p className="text-sm">hello, {name} — dgc miniapp registry is live.</p>
    </div>
  );
}
```

### `.github/workflows/deploy.yml` (CITED: github.com/actions/deploy-pages, research/github-hosting.md)

```yaml
name: Build & Deploy Registry

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Lint (fails CI on lint errors — R10.4)
        run: pnpm lint

      - name: Build shadcn registry → public/r/*.json
        run: pnpm dlx shadcn@latest build

      - name: Build Next.js static site → out/
        run: pnpm build

      # Safety net: ensure /r/ is in the shipped artifact
      # (next build copies public/ once; if shadcn build ran after, we'd miss it)
      - name: Copy registry JSON into export
        run: |
          mkdir -p out/r
          cp -r public/r/* out/r/ 2>/dev/null || true

      - name: Disable Jekyll
        run: touch out/.nojekyll

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### `package.json` scripts (relevant subset)

```json
{
  "scripts": {
    "dev": "pnpm registry:build && next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "registry:build": "shadcn build",
    "registry:watch": "shadcn build --watch"
  }
}
```

### `public/CNAME`

```
registry.dg-superapp.com
```

(Single line, no trailing whitespace. GH Pages is strict.)

### `.gitignore` additions

```gitignore
# Next.js
.next/
out/

# shadcn build output — regenerate in CI, don't commit
public/r/
!public/r/.gitkeep
```

## State of the Art

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|------------------------|--------------|--------|
| `next export` command | `output: 'export'` in `next.config.mjs` | Next.js 13.3+ | Single command `next build` emits `out/` |
| `tailwind.config.js` with `content`, `theme.extend` | `@theme` block in CSS + `@import "tailwindcss"` | Tailwind v4 (Jan 2025) | No JS config needed; CSS variables become first-class |
| `@tailwind base; components; utilities;` | `@import "tailwindcss";` | Tailwind v4 | Single import, less boilerplate |
| shadcn CLI v3 + manual tailwind.config edits | shadcn CLI v4 + empty `tailwind.config` in components.json | shadcn CLI v4 (March 2026) | CLI writes to `@theme` blocks in CSS, not JS config |
| GH Pages `gh-pages` branch push | `actions/deploy-pages@v4` + `upload-pages-artifact@v3` | GitHub Actions + Pages (2023+) | No branch pollution; OIDC auth |
| `raw.githubusercontent.com` for shadcn install | Custom domain on Pages | Always (but commonly mis-recommended) | Avoids 403/429/CORS |

**Deprecated / outdated (do NOT use):**
- `next export` as a separate command — removed.
- `tailwind.config.ts` for defining tokens in v4 projects — now optional, most config lives in CSS.
- `darkMode: 'class'` in JS config — Tailwind v4 uses `@custom-variant dark` in CSS.
- `@radix-ui/react-toast` — shadcn defaults to `sonner` since 2024.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Next.js 15 still receives patch releases in April 2026 | Standard Stack | Low — if unmaintained, upgrade to 16 earlier than planned |
| A2 | `create-next-app@latest` in April 2026 still supports `--src-dir`, `--turbopack` flags | Install command | Low — flags are stable; fallback is interactive mode |
| A3 | `shadcn@4.4.0` init for a registry project uses same flow as consumer init (with follow-up `registry.json` creation manual) | Install command | Medium — shadcn docs don't describe a distinct "registry init"; pattern inferred from `shadcn-ui/registry-template`. Verify by running `pnpm dlx shadcn@latest init --help` in Phase 1 task 1 |
| A4 | `tw-animate-css` import is still the standard for shadcn + Tailwind v4 animations | globals.css | Low — can be removed if `hello.tsx` doesn't need animations |
| A5 | DNS CNAME `registry` → `dg-superapp.github.io` requires no org-level GitHub verification step | §8 | Medium — GitHub may require the custom domain to be verified at org level first. Verify by running the DNS add + repo Pages config during Phase 1; if blocked, add org-verification task |
| A6 | pnpm 10 works with `pnpm/action-setup@v4` | Workflow | Very low — v4 supports v8/9/10 |
| A7 | `next@15` + React 19 RC → stable combination has no known blockers for static export | Anti-pitfall 3 | Low — widely deployed pattern since Nov 2024 |

## Open Questions

1. **Repo name: `dg-superapp/design-system` vs `dg-superapp/ui`?** (ROADMAP.md:135)
   - What we know: Both work technically; short name is cleaner for URLs but `design-system` is more discoverable.
   - What's unclear: Org conventions, other repos in `dg-superapp`.
   - Recommendation: Escalate to discuss-phase / kickoff call. Default to `design-system` if no reply within 24h — matches PROJECT.md phrasing and established MDS convention.

2. **Commit `public/r/` or gitignore?**
   - What we know: Generated output; CI regenerates on every push.
   - What's unclear: Whether anyone needs to inspect JSON diffs without running `shadcn build` locally.
   - Recommendation: **Gitignore.** Add `public/r/.gitkeep` to preserve directory. CI is the source of truth for registry output. Revisit if review workflow demands it.

3. **Org-level GitHub custom domain verification required?** (A5)
   - What we know: GitHub sometimes requires org owners to add a TXT record proving domain ownership before enabling custom domain on a repo.
   - What's unclear: Whether `dg-superapp` org already has `dg-superapp.com` verified.
   - Recommendation: Have org admin check `github.com/organizations/dg-superapp/settings/pages` → Verified domains BEFORE Phase 1 starts. If missing, add as Phase 1 task 0.

4. **Next.js 16 escape hatch?**
   - What we know: PROJECT.md locks 15. But 16 may have been chosen for more than one reason (React Compiler stable, faster build).
   - What's unclear: Whether any Phase 1 blocker (e.g. Turbopack static export bug in 15.x) forces a 16 upgrade.
   - Recommendation: Proceed with 15. Open tracker issue for v1.1 migration to 16 after v1.0 ships.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 20 LTS | Local dev + CI | To verify locally | — | Use `nvm` or volta on Windows |
| pnpm 10 | Package install | To verify locally | — | `corepack enable pnpm` (Node 20 ships corepack) |
| Git | Repo management | Assumed present | — | — |
| GitHub repo create perms on `dg-superapp` org | Phase 1 repo | Blocking — requires human | — | Org admin creates empty repo first |
| DNS control for `dg-superapp.com` | Custom domain CNAME | Blocking — requires DNS admin | — | Ship with `dg-superapp.github.io/design-system/` until DNS ready; remove `basePath` once flipped |
| GitHub Pages enabled on repo | Deploy | Blocking — requires repo admin | — | Standard Settings → Pages → Source = GitHub Actions |

**Missing dependencies with no fallback:**
- Org repo creation + DNS CNAME record + org domain verification — all human-gated; Phase 1 Task 0 must hand off to a human operator. Plan should include explicit "wait on human" gates.

**Missing dependencies with fallback:**
- Custom domain — fall back to `dg-superapp.github.io/design-system/` path-prefixed temporarily.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed at Phase 1 start. Add `vitest` + `@testing-library/react` optionally, OR rely on build-step validation + manual smoke test |
| Config file | none — see Wave 0 |
| Quick run command | `pnpm lint && pnpm build && pnpm dlx shadcn@latest build` |
| Full suite command | same + manual smoke (§9) |
| Phase gate | CI green on `main` + `/r/hello.json` fetchable from live domain |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| R1.1 | Scaffold compiles | build | `pnpm build` | Wave 0 creates project |
| R1.2 | `registry.json` schema-valid | integration | `pnpm dlx shadcn@latest build` (CLI validates schema, exits non-zero on error) | Wave 0 creates file |
| R1.3 | `public/r/hello.json` emitted | integration | `pnpm dlx shadcn@latest build && test -f public/r/hello.json` | Wave 0 |
| R1.4 | Scratch consumer installs | manual smoke | see §9 — `npx shadcn@latest add http://localhost:3000/r/hello.json` in sibling dir | manual-only |
| R2.1 | CI workflow exists + runs | integration | Push to `main`, verify green run | Wave 0 creates `.github/workflows/deploy.yml` |
| R2.2 | `/` and `/r/hello.json` same origin | manual | `curl https://registry.dg-superapp.com/r/hello.json` after deploy | manual-only |
| R2.3 | Custom domain resolves | manual | `dig registry.dg-superapp.com` + browser | manual-only |
| R2.4 | Broken build fails CI | integration | Intentionally break `registry.json`, push to branch, verify red run | ad-hoc |
| R10.4 | Lint blocks CI | integration | `pnpm lint` in workflow | Wave 0 |
| R10.5 | README + CONTRIBUTING exist | file check | `test -f README.md && test -f CONTRIBUTING.md` | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm lint && pnpm build && pnpm dlx shadcn@latest build` (~30 s cold, ~8 s warm)
- **Per wave merge:** above + manual `curl localhost:3000/r/hello.json` smoke
- **Phase gate:** CI green on main + live domain smoke (§9)

### Wave 0 Gaps
- [ ] `package.json` + scaffold — Wave 0 task
- [ ] `next.config.mjs` — Wave 0 task
- [ ] `components.json` — Wave 0 task (via `shadcn init` or hand-written)
- [ ] `registry.json` + `registry/hello/hello.tsx` — Wave 0 task
- [ ] `.github/workflows/deploy.yml` — Wave 0 task
- [ ] `public/CNAME` + `public/.nojekyll` — Wave 0 task
- [ ] README.md + CONTRIBUTING.md stubs — Wave 0 task
- [ ] ESLint flat config verified + Prettier config — Wave 0 task

*(No gaps from existing test infrastructure — there is none. Phase 1 is bootstrapping.)*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Public registry v1.0; auth deferred to v2 |
| V3 Session Management | no | Static site, no sessions |
| V4 Access Control | no | All content public |
| V5 Input Validation | low | Only input is CLI consumer URL → shadcn CLI handles |
| V6 Cryptography | low | TLS via GitHub Pages managed cert |
| V10 Malicious Code | **yes** | Every `registry.json` item ships source into consumer projects — supply-chain vector |
| V14 Configuration | yes | CI secrets, deploy perms |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Registry item ships malicious code to consumers | Tampering / Elevation | Code review on PRs; CODEOWNERS (Phase 7); branch protection on `main`; no auto-merge |
| Stolen GitHub token publishes rogue registry | Spoofing | Use OIDC (`id-token: write`) for deploy-pages — no long-lived PAT needed |
| Dependency confusion on `registryDependencies` URL | Tampering | Only reference `registry.dg-superapp.com` URLs (same origin) + official shadcn registry |
| Consumer installs untrusted registry via namespaced alias | Tampering | Document only the canonical install URL in README |
| GitHub Pages deploy replaced by forked PR | Tampering | Workflow only triggers on `push` to `main` (not `pull_request`) — forked PRs can't deploy |

### Phase 1 Security Checklist
- [ ] Branch protection on `main`: require PR + passing CI before merge (repo Settings → Branches)
- [ ] CODEOWNERS stub in `.github/CODEOWNERS` even if only one owner (deferred detail to Phase 7)
- [ ] Workflow `permissions:` block is minimal (`contents: read`, `pages: write`, `id-token: write`)
- [ ] No `secrets.*` referenced in Phase 1 workflow — GH Pages uses OIDC, no tokens
- [ ] `public/CNAME` committed (not gitignored), domain verification at org level complete

## Glossary (shadcn terms used in plan)

- **`registry:ui`** — item type for atomic UI components. Default target: consumer's `components/ui/` folder.
- **`registry:theme`** — item type shipping CSS vars + Tailwind config. Merged into consumer's `globals.css`.
- **`registry:block`** — higher-level composite (e.g. FileUploader). Default target: `components/`.
- **`registry:hook`, `registry:lib`, `registry:page`, `registry:file`** — other item types. `page` and `file` REQUIRE `target` field.
- **`registryDependencies`** — list of other registry items this one needs. Accepts item names (`"button"`) or URLs (`"https://.../r/button.json"`). CLI resolves recursively.
- **`dependencies`** — npm packages to `npm install` on consumer install.
- **`cssVars`** — object of CSS variables to merge into consumer's `globals.css`. Shape: `{ theme: {}, light: {}, dark: {} }`.
- **`components.json`** — consumer's shadcn config. Aliases, css file path, tailwind config path, base color, registry namespace URLs.
- **`registry.json`** — root manifest in the REGISTRY REPO. Lists all items. Input to `shadcn build`.
- **Namespaced registry** — shadcn 3.0+ feature. Consumer declares `"registries": { "@dgc": "https://.../r/{name}.json" }` in `components.json`; installs via `shadcn add @dgc/button`. Phase 1 defers namespace usage to docs/examples.

## Sources

### Primary (HIGH confidence)
- [CITED] https://ui.shadcn.com/docs/registry/getting-started — registry project setup
- [CITED] https://ui.shadcn.com/docs/registry/registry-json — root manifest schema
- [CITED] https://ui.shadcn.com/docs/registry/registry-item-json — item schema
- [CITED] https://ui.shadcn.com/docs/tailwind-v4 — shadcn + Tailwind v4 integration (empty `tailwind.config` in components.json)
- [CITED] https://ui.shadcn.com/docs/changelog/2026-03-cli-v4 — CLI v4 release notes
- [CITED] https://ui.shadcn.com/docs/components-json — aliases + registries config
- [CITED] https://ui.shadcn.com/docs/cli — `shadcn build` command reference
- [CITED] https://nextjs.org/docs/app/guides/static-exports — `output: 'export'` config
- [CITED] https://github.com/shadcn-ui/registry-template — official reference layout
- [VERIFIED] npm registry on 2026-04-24 — next@16.2.4, tailwindcss@4.2.4, shadcn@4.4.0, react@19.2.5, pnpm@10.33.2

### Secondary (MEDIUM confidence)
- Existing: `.planning/research/shadcn-registry.md`, `.planning/research/github-hosting.md`, `.planning/research/port-strategy.md` (same project, earlier research, re-verified)
- https://github.com/actions/deploy-pages — workflow permissions block
- https://github.com/pnpm/action-setup — `version: 10`

### Tertiary (LOW confidence / deferred verification)
- A3: "registry init" flow inferred, not explicitly documented — verify in Phase 1 Wave 0 task 1
- A5: org-level domain verification requirement — verify with org admin

## Metadata

**Confidence breakdown:**
- Standard stack + versions: HIGH — verified via npm registry 2026-04-24
- Next.js static export config: HIGH — official docs + multiple community examples align
- Tailwind v4 integration: HIGH — official shadcn docs + changelog
- shadcn build pipeline: HIGH — official docs + official template repo
- GH Pages workflow: HIGH — official actions, OIDC pattern
- Custom domain + DNS: MEDIUM — DNS/org steps need human confirmation (A5)
- Pitfalls: HIGH — sourced from existing research files + common docs

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (fast-moving: shadcn CLI v4 is 1 month old; Tailwind v4 still stabilizing edge cases)
