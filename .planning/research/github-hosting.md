# GitHub Hosting for shadcn Registry — DGC Super-App

**Target org:** https://github.com/dg-superapp
**Context:** Port `D:/sources/dgc-miniapp-design-system/project` (static HTML + CSS tokens + JSX kit) to a Next.js app that doubles as preview site **and** registry host.
**Researched:** 2026-04-24 | **Confidence:** HIGH (official shadcn docs + community templates verified)

---

## 1. How shadcn Registry Publishing Works

`npx shadcn build` reads `registry.json` at repo root and emits one `public/r/<name>.json` per item. Each JSON embeds the component source + metadata. Consumers install via:

```bash
npx shadcn@latest add https://registry.dg-superapp.com/r/button.json
```

The registry is just static JSON. Any static host works — GitHub Pages, S3, Vercel, Netlify, Cloudflare Pages.

---

## 2. Recommended Repo Layout

```
dgc-superapp-registry/                 # or: dgc-miniapp-design-system (mono)
├── registry.json                      # root index — lists all items
├── registry/
│   └── default/                       # style namespace (or "miniapp")
│       ├── button/
│       │   └── button.tsx
│       ├── app-header/
│       │   └── app-header.tsx
│       ├── doc-viewer/
│       └── tokens/
│           └── tokens.css             # CSS vars from colors_and_type.css
├── src/app/                           # Next.js preview site
│   ├── page.tsx                       # registry landing page
│   ├── preview/[slug]/page.tsx        # live component previews
│   └── layout.tsx
├── components/ui/                     # shadcn primitives used by preview
├── public/
│   ├── r/                             # BUILD OUTPUT — do NOT commit, generate in CI
│   │   ├── button.json
│   │   └── ...
│   └── .nojekyll                      # required for GH Pages
├── components.json                    # shadcn config (aliases)
├── next.config.mjs                    # output: 'export' for static build
├── package.json
└── .github/workflows/deploy.yml
```

**Key choice:** `registry/` is the authored source (`.tsx` + per-item `registry.json` fragments). `public/r/` is generated output. Commit the input, not the output.

---

## 3. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
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
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile

      # 1. Build shadcn registry → public/r/*.json
      - run: pnpm dlx shadcn@latest build

      # 2. Build Next.js static preview site → out/
      - run: pnpm build
        env:
          NEXT_PUBLIC_BASE_PATH: /dgc-superapp-registry

      # 3. Copy registry JSON into exported static site
      - run: cp -r public/r out/r

      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./out }

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

`next.config.mjs` needs `output: 'export'` and `images: { unoptimized: true }`.

---

## 4. Raw GitHub vs GitHub Pages

| Option | Verdict |
|---|---|
| `raw.githubusercontent.com/dg-superapp/repo/main/public/r/button.json` | **Do not use.** Returns 403 on CORS preflight; aggressively IP rate-limited (429 errors). |
| GitHub Pages (`dg-superapp.github.io/repo/r/button.json`) | **Recommended.** Proper CORS, CDN-backed, no rate limits for normal use. |
| jsDelivr proxy (`cdn.jsdelivr.net/gh/dg-superapp/repo/public/r/button.json`) | Acceptable fallback; bypasses GitHub limits but adds dependency. |

**Conclusion:** Always serve via GitHub Pages (or custom domain on Pages). Never document the raw URL as the install target.

---

## 5. Custom Domain — `registry.dg-superapp.com`

1. Add `public/CNAME` file containing `registry.dg-superapp.com`
2. In DNS, create CNAME: `registry` → `dg-superapp.github.io`
3. GitHub settings → Pages → enforce HTTPS (wait ~1h for cert)
4. Remove `basePath` from `next.config.mjs` once on custom domain
5. Install URLs become: `https://registry.dg-superapp.com/r/button.json`

---

## 6. Versioning Strategy

shadcn registry has no built-in versioning — URLs are flat. Two practical patterns:

**Pattern A — Git tags + branch deploys (simple, recommended):**
- `main` → `registry.dg-superapp.com/r/*.json` (latest)
- Create branches `v1`, `v2` → deploy via matrix workflow to `/v1/r/*.json`, `/v2/r/*.json`
- Consumers pin: `https://registry.dg-superapp.com/v1/r/button.json`

**Pattern B — SemVer in filename:**
- Emit `button@1.2.0.json` alongside `button.json` via post-build script
- Keep old versions forever; `button.json` is always latest
- Use shadcn's `@version` field in dependencies to track internal deps

**Recommendation for DGC:** Start with Pattern A. Add Pattern B only after first breaking change ships.

---

## 7. Public vs Private Registry

The Super-App design system is a **government asset** — default to **public**. If mini-app-specific components must stay internal, shadcn supports bearer-token auth natively:

```json
// consumer's components.json
{
  "registries": {
    "@dgc": {
      "url": "https://registry.dg-superapp.com/r/{name}.json",
      "headers": { "Authorization": "Bearer ${DGC_REGISTRY_TOKEN}" }
    }
  }
}
```

Install: `DGC_REGISTRY_TOKEN=xxx npx shadcn@latest add @dgc/button`

For private hosting, GitHub Pages doesn't support auth — you'd need Vercel/Cloudflare Workers with a token-checking edge function. **Not recommended for v1.**

---

## 8. Recommendation for DGC Team

1. **Single repo, mono-structure** (`dg-superapp/design-system`): Next.js preview site + registry live in one repo. Preview pages render the same `.tsx` components that the registry ships. One CI job, one URL, one source of truth.
2. **Publish public on GitHub Pages with custom domain** `registry.dg-superapp.com`. Ship existing preview HTML as Next.js routes; port `colors_and_type.css` tokens into `registry/default/tokens/tokens.css` as a `registry:theme` item so consumers pull tokens + components together.
3. **Defer versioning + private auth until v2.** Start with flat `main`-only deploy; the design system is small enough that breaking changes can be coordinated manually in the first 6 months.

---

## Sources

- [shadcn Registry — Getting Started](https://ui.shadcn.com/docs/registry/getting-started) (HIGH)
- [shadcn Registry — registry.json schema](https://ui.shadcn.com/docs/registry/registry-json) (HIGH)
- [shadcn Registry — Authentication](https://ui.shadcn.com/docs/registry/authentication) (HIGH)
- [shadcn-ui/registry-template (official)](https://github.com/shadcn-ui/registry-template) (HIGH)
- [iloveitaly/shadcn-registry-template-github-pages](https://github.com/iloveitaly/shadcn-registry-template-github-pages) (MEDIUM)
- [GitHub community — raw.githubusercontent CORS](https://github.com/orgs/community/discussions/69281) (HIGH)
- [GitHub community — raw rate limits](https://github.com/orgs/community/discussions/157940) (HIGH)
- [Next.js static export to GitHub Pages](https://github.com/nextjs/deploy-github-pages) (HIGH)
