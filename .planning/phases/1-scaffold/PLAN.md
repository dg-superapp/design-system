---
phase: 1-scaffold
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - D:/sources/dgc-miniapp-shadcn/package.json
  - D:/sources/dgc-miniapp-shadcn/next.config.mjs
  - D:/sources/dgc-miniapp-shadcn/postcss.config.mjs
  - D:/sources/dgc-miniapp-shadcn/components.json
  - D:/sources/dgc-miniapp-shadcn/registry.json
  - D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx
  - D:/sources/dgc-miniapp-shadcn/registry/hello/registry-item.json
  - D:/sources/dgc-miniapp-shadcn/src/app/page.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/layout.tsx
  - D:/sources/dgc-miniapp-shadcn/src/app/globals.css
  - D:/sources/dgc-miniapp-shadcn/public/CNAME
  - D:/sources/dgc-miniapp-shadcn/public/.nojekyll
  - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml
  - D:/sources/dgc-miniapp-shadcn/.github/CODEOWNERS
  - D:/sources/dgc-miniapp-shadcn/.gitignore
  - D:/sources/dgc-miniapp-shadcn/.prettierrc.json
  - D:/sources/dgc-miniapp-shadcn/.prettierignore
  - D:/sources/dgc-miniapp-shadcn/eslint.config.mjs
  - D:/sources/dgc-miniapp-shadcn/README.md
  - D:/sources/dgc-miniapp-shadcn/CONTRIBUTING.md
  - D:/sources/dgc-miniapp-shadcn/LICENSE
autonomous: false
requirements: [R1.1, R1.2, R1.3, R1.4, R2.1, R2.2, R2.3, R2.4, R10.4, R10.5]
user_setup:
  - service: github-org
    why: "Create repo dg-superapp/design-system and enable Pages"
    dashboard_config:
      - task: "Create empty repo dg-superapp/design-system (private or public per org policy)"
        location: "github.com/organizations/dg-superapp/repositories/new"
      - task: "Settings → Pages → Source = GitHub Actions"
        location: "github.com/dg-superapp/design-system/settings/pages"
      - task: "Settings → Branches → Protect main (require PR + passing CI)"
        location: "github.com/dg-superapp/design-system/settings/branches"
      - task: "Verify custom domain ownership at org level (add TXT record if missing)"
        location: "github.com/organizations/dg-superapp/settings/pages"
  - service: dns
    why: "Wire registry.dg-superapp.com CNAME"
    dashboard_config:
      - task: "Add DNS CNAME: registry → dg-superapp.github.io"
        location: "dg-superapp.com DNS provider"

must_haves:
  truths:
    - "Running `pnpm dev` in D:/sources/dgc-miniapp-shadcn/ serves the preview page at http://localhost:3000/"
    - "Running `pnpm registry:build` emits public/r/hello.json and public/r/registry.json"
    - "Running `pnpm build` emits a static out/ directory containing both index.html and r/hello.json"
    - "A scratch Next.js app can run `pnpm dlx shadcn@latest add http://localhost:3000/r/hello.json` and receive components/ui/hello.tsx"
    - "Pushing to main triggers the deploy workflow; CI fails if `shadcn build` fails or lint fails"
    - "After DNS + Pages wiring, https://registry.dg-superapp.com/r/hello.json returns the JSON (human-verified)"
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/package.json"
      provides: "pinned next@^15, react@^19, tailwindcss@^4, shadcn@latest; scripts build/dev/lint/registry:build"
      contains: "\"next\": \"^15"
    - path: "D:/sources/dgc-miniapp-shadcn/next.config.mjs"
      provides: "output: 'export', images.unoptimized, trailingSlash"
      contains: "output: \"export\""
    - path: "D:/sources/dgc-miniapp-shadcn/components.json"
      provides: "shadcn config with tailwind.config blank (v4) + aliases"
      contains: "\"tailwind\""
    - path: "D:/sources/dgc-miniapp-shadcn/registry.json"
      provides: "root manifest with hello item, $schema set"
      contains: "\"$schema\""
    - path: "D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx"
      provides: "placeholder component consumable via shadcn add"
      min_lines: 10
    - path: "D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml"
      provides: "push:main + workflow_dispatch build+deploy pipeline"
      contains: "deploy-pages"
    - path: "D:/sources/dgc-miniapp-shadcn/public/CNAME"
      provides: "custom domain declaration"
      contains: "registry.dg-superapp.com"
    - path: "D:/sources/dgc-miniapp-shadcn/README.md"
      provides: "consumer install instructions + project overview"
      min_lines: 30
    - path: "D:/sources/dgc-miniapp-shadcn/CONTRIBUTING.md"
      provides: "how to add new registry items"
      min_lines: 20
  key_links:
    - from: "registry.json"
      to: "registry/hello/hello.tsx"
      via: "files[].path"
      pattern: "registry/hello/hello\\.tsx"
    - from: ".github/workflows/deploy.yml"
      to: "public/r/*.json"
      via: "shadcn build step runs BEFORE next build (Pitfall #5)"
      pattern: "shadcn.*build[\\s\\S]*?next build|pnpm build"
    - from: "postcss.config.mjs"
      to: "src/app/globals.css"
      via: "@tailwindcss/postcss plugin processes @import tailwindcss"
      pattern: "@tailwindcss/postcss"
    - from: "next.config.mjs"
      to: "out/ artifact"
      via: "output: export copies public/ into out/"
      pattern: "output:\\s*[\"']export[\"']"
---

<objective>
Stand up an empty but deployable shadcn registry in a NEW sibling workspace `D:/sources/dgc-miniapp-shadcn/`. The registry must be consumable via `npx shadcn@latest add https://registry.dg-superapp.com/r/hello.json` once deployed, proving the full pipeline: author source → `shadcn build` → static export → GitHub Pages → custom domain → scratch consumer install.

Purpose: De-risk the distribution pipeline before any real DGC components are written. Every later phase (tokens, primitives, blocks) rides on this scaffold working end-to-end. One broken link (CNAME, build order, static-export flag) wastes weeks of later work.

Output: A runnable Next.js 15 + Tailwind v4 + shadcn CLI v4 project with one placeholder `hello` registry item, a GitHub Actions workflow ready to deploy on first push, and the docs stubs required by R10.5.

Out of scope (deferred to later phases): Any real DGC component (button, input, etc. — Phase 3), DGC token theme (Phase 2), MDX docs, dark mode toggle UI, axe/Playwright tests (Phase 7), npm publishing (never), builder port (never).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@D:/sources/dgc-miniapp-design-system/.planning/PROJECT.md
@D:/sources/dgc-miniapp-design-system/.planning/ROADMAP.md
@D:/sources/dgc-miniapp-design-system/.planning/REQUIREMENTS.md
@D:/sources/dgc-miniapp-design-system/.planning/STATE.md
@D:/sources/dgc-miniapp-design-system/.planning/config.json
@D:/sources/dgc-miniapp-design-system/.planning/phases/1-scaffold/RESEARCH.md

<interfaces>
<!-- Phase 1 creates every interface from scratch; no prior files to extract. -->
<!-- Copy-pastable config blocks below are LIFTED from RESEARCH.md §Code Examples. -->
<!-- Use them verbatim unless a task explicitly says otherwise. -->

next.config.mjs (RESEARCH.md:230–241):
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
```

components.json (RESEARCH.md:245–269) — note `tailwind.config: ""` is REQUIRED for v4:
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

postcss.config.mjs (RESEARCH.md:310–316):
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

registry.json (RESEARCH.md:320–344) — see Task 4.

registry/hello/hello.tsx (RESEARCH.md:348–368) — see Task 4.

.github/workflows/deploy.yml (RESEARCH.md:372–438) — see Task 5. CRITICAL: `shadcn build` runs BEFORE `pnpm build` (next build), plus the `cp -r public/r out/r` safety net.
</interfaces>

<constraints>
- Workspace is a NEW sibling folder `D:/sources/dgc-miniapp-shadcn/` — DO NOT modify anything inside `D:/sources/dgc-miniapp-design-system/` except `.planning/STATE.md` in the final wrap-up step.
- Pin Next.js to `^15` (Pitfall #1). If `create-next-app@latest` scaffolds 16.x, downgrade BEFORE any other change.
- Tailwind MUST be v4 (Pitfall #2). Verify `postcss.config.mjs` uses `@tailwindcss/postcss`, `globals.css` starts with `@import "tailwindcss";`, and `package.json` lists `tailwindcss@^4`.
- `shadcn build` MUST run before `next build` in CI (Pitfall #5). The workflow also runs `cp -r public/r out/r` as a safety net.
- `public/CNAME` + `public/.nojekyll` are committed, NEVER gitignored (Pitfall #4).
- `public/r/` IS gitignored; `.gitkeep` preserves the directory.
- No server actions, no `route.ts`, no `fetch(..., { cache: 'no-store' })` anywhere — static export will break (Pitfall #3).
- Do NOT set `basePath` or `assetPrefix` — custom domain serves at root.
- Windows shell: commands run in `bash` (Git Bash) per env. Use forward slashes in paths. Use `mkdir -p` not `New-Item`.
- DO NOT run `git init` or create the GitHub repo; that is a human action (Task 8 checkpoint).
</constraints>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Bootstrap project + pin Next 15 + Tailwind v4 + shadcn CLI v4 + lint/format tooling</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/package.json,
    D:/sources/dgc-miniapp-shadcn/next.config.mjs,
    D:/sources/dgc-miniapp-shadcn/postcss.config.mjs,
    D:/sources/dgc-miniapp-shadcn/components.json,
    D:/sources/dgc-miniapp-shadcn/src/app/globals.css,
    D:/sources/dgc-miniapp-shadcn/src/app/layout.tsx,
    D:/sources/dgc-miniapp-shadcn/src/app/page.tsx,
    D:/sources/dgc-miniapp-shadcn/src/lib/utils.ts,
    D:/sources/dgc-miniapp-shadcn/eslint.config.mjs,
    D:/sources/dgc-miniapp-shadcn/.prettierrc.json,
    D:/sources/dgc-miniapp-shadcn/.prettierignore,
    D:/sources/dgc-miniapp-shadcn/.gitignore,
    D:/sources/dgc-miniapp-shadcn/tsconfig.json
  </files>
  <action>
Sequential commands. Run each, verify, then proceed.

(1) Verify parent exists, then bootstrap. Run from `D:/sources/`:
```bash
ls D:/sources/ && [ ! -d D:/sources/dgc-miniapp-shadcn ] || (echo "workspace already exists; aborting" && exit 1)
cd D:/sources && pnpm create next-app@15 dgc-miniapp-shadcn \
  --typescript --tailwind --eslint --app --src-dir --turbopack \
  --import-alias "@/*" --use-pnpm --yes
```
If `create-next-app@15` refuses, fall back to `pnpm create next-app@latest` then immediately run:
```bash
cd D:/sources/dgc-miniapp-shadcn
pnpm add next@^15.0.0 react@^19 react-dom@^19
pnpm add -D @types/react@^19 @types/react-dom@^19
```

(2) Verify pins (per Pitfall #1, #2):
```bash
cd D:/sources/dgc-miniapp-shadcn
pnpm list next react tailwindcss
# REQUIRED: next 15.x, react 19.x, tailwindcss 4.x
# If tailwindcss is 3.x: pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest
```

(3) Install shadcn + Prettier + Tailwind Prettier plugin:
```bash
pnpm add -D shadcn@latest prettier prettier-plugin-tailwindcss
```

(4) Init shadcn (non-interactive where possible; if prompted use: style=new-york, rsc=yes, tsx=yes, css=src/app/globals.css, baseColor=neutral, cssVariables=yes, tailwind.config=(blank), aliases accept defaults):
```bash
pnpm dlx shadcn@latest init
```

(5) Overwrite `components.json` with the verbatim block from `<interfaces>` above (adds `registries.@dgc` + ensures `tailwind.config: ""`).

(6) Overwrite `next.config.mjs` with the verbatim block from `<interfaces>` (output: export + trailingSlash + unoptimized images).

(7) Verify `postcss.config.mjs` matches `<interfaces>` block. If shadcn init left `tailwindcss: {}` + `autoprefixer: {}` — REPLACE with `@tailwindcss/postcss` (Pitfall #2).

(8) Verify `src/app/globals.css` starts with `@import "tailwindcss";`. If it contains `@tailwind base; @tailwind components; @tailwind utilities;` — REPLACE the top block with the v4 version from RESEARCH.md:273–306 (keep the `:root` / `.dark` / `@layer base` sections shadcn-init wrote; ensure `@theme inline {}` block exists, empty for now with a comment that Phase 2 populates it).

(9) Keep whatever `src/app/layout.tsx` and `src/app/page.tsx` create-next-app produced; Task 4 rewrites `page.tsx`.

(10) Verify `src/lib/utils.ts` exports `cn()` (shadcn init creates it).

(11) Add `.prettierrc.json`:
```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

(12) Add `.prettierignore`:
```
.next
out
public/r
pnpm-lock.yaml
node_modules
```

(13) Overwrite `.gitignore` — append (dedupe if present):
```
# Next.js
.next/
out/

# shadcn build output — regenerate in CI, don't commit
public/r/
!public/r/.gitkeep

# env
.env*.local
```
Then `mkdir -p public/r && touch public/r/.gitkeep`.

(14) Edit `package.json` scripts to match RESEARCH.md:443–453:
```json
"scripts": {
  "dev": "pnpm registry:build && next dev --turbopack",
  "build": "shadcn build && next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write .",
  "registry:build": "shadcn build",
  "registry:watch": "shadcn build --watch"
}
```
Note: `build` chains `shadcn build && next build` (Pitfall #5) so local `pnpm build` mirrors CI order.

(15) Smoke check:
```bash
pnpm lint
pnpm build   # expected: fails because registry.json doesn't exist yet — that is acceptable at this task. If it fails ONLY on "registry.json not found", task is green.
```
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn &amp;&amp; pnpm list next react tailwindcss shadcn --depth=0 | grep -E "next\s+15\.|react\s+19\.|tailwindcss\s+4\.|shadcn\s+4\." | wc -l | grep -q 4 &amp;&amp; test -f next.config.mjs &amp;&amp; test -f components.json &amp;&amp; test -f postcss.config.mjs &amp;&amp; grep -q "@tailwindcss/postcss" postcss.config.mjs &amp;&amp; grep -q "output:\s*\"export\"" next.config.mjs &amp;&amp; grep -q "@import \"tailwindcss\"" src/app/globals.css &amp;&amp; pnpm lint</automated>
  </verify>
  <done>
    - `D:/sources/dgc-miniapp-shadcn/` exists with Next 15.x, React 19.x, Tailwind 4.x, shadcn 4.x pinned in `package.json`.
    - `next.config.mjs` has `output: "export"`, `images.unoptimized`, `trailingSlash`.
    - `postcss.config.mjs` uses `@tailwindcss/postcss`.
    - `src/app/globals.css` opens with `@import "tailwindcss";` and contains an empty `@theme inline {}` block (Phase 2 placeholder).
    - `components.json` has `tailwind.config: ""` and `registries.@dgc` entry.
    - `package.json` scripts include `build: "shadcn build && next build"` and `registry:build: "shadcn build"`.
    - `.gitignore` excludes `public/r/` but keeps `.gitkeep`.
    - `pnpm lint` exits 0.
  </done>
</task>

<task type="auto">
  <name>Task 2: Author the `hello` registry item + root registry.json + preview landing page</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/registry.json,
    D:/sources/dgc-miniapp-shadcn/registry/hello/hello.tsx,
    D:/sources/dgc-miniapp-shadcn/registry/hello/registry-item.json,
    D:/sources/dgc-miniapp-shadcn/src/app/page.tsx
  </files>
  <action>
(1) Create `registry/hello/hello.tsx` verbatim from RESEARCH.md:348–368. Uses tokenized Tailwind classes (`bg-background`, `text-foreground`, `border`) so Phase 2's theme swap changes its appearance with zero code change. No external deps.

(2) Create `registry/hello/registry-item.json` — per-item manifest (used by `shadcn build` when `registry.json` references it; keeping it as a standalone file matches the reference layout and makes Phase 3+ additions trivial):
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
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
```

(3) Create root `D:/sources/dgc-miniapp-shadcn/registry.json` verbatim from RESEARCH.md:320–344 (name `dgc-miniapp`, homepage `https://registry.dg-superapp.com`, items[] with single `hello` entry pointing to `registry/hello/hello.tsx`).

(4) Rewrite `src/app/page.tsx` as a minimal preview (pure RSC, no client hooks, no data fetching — Pitfall #3):
```tsx
import { Hello } from "../../registry/hello/hello";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">dgc-miniapp registry</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Phase 1 pipeline validation. Install the placeholder item with:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border bg-background p-3 text-xs">
          <code>pnpm dlx shadcn@latest add https://registry.dg-superapp.com/r/hello.json</code>
        </pre>
      </header>
      <section>
        <Hello name="world" />
      </section>
    </main>
  );
}
```
Relative import from `src/app/page.tsx` → `registry/hello/hello.tsx` keeps the preview rendering the exact file that ships to consumers (single source of truth).

(5) Run `shadcn build` locally to confirm it emits the JSON:
```bash
cd D:/sources/dgc-miniapp-shadcn
pnpm registry:build
ls public/r/
# expected: hello.json, registry.json
cat public/r/hello.json | head -20
# expected: JSON with name, type, files[], content of hello.tsx inlined
```

(6) Run the full build:
```bash
pnpm build
# expected: shadcn build succeeds, next build emits out/
test -f out/index.html && test -f out/r/hello.json
# NOTE: if out/r/hello.json is missing but public/r/hello.json exists, that's Pitfall #5 in action.
# The workflow handles this with a `cp -r public/r out/r` safety net (Task 5).
# For local: shadcn build runs BEFORE next build in package.json scripts, so public/r/*.json
# is already in place when next build copies public/ → out/. Verify out/r/hello.json exists.
```

(7) Local dev smoke:
```bash
pnpm dev &
sleep 5
curl -sS http://localhost:3000/r/hello.json | head -5
curl -sS http://localhost:3000/ | grep -q "dgc-miniapp registry" && echo OK
kill %1
```
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn &amp;&amp; test -f registry.json &amp;&amp; test -f registry/hello/hello.tsx &amp;&amp; test -f registry/hello/registry-item.json &amp;&amp; pnpm registry:build &amp;&amp; test -f public/r/hello.json &amp;&amp; test -f public/r/registry.json &amp;&amp; grep -q "hello" public/r/hello.json &amp;&amp; pnpm build &amp;&amp; test -f out/index.html &amp;&amp; test -f out/r/hello.json</automated>
  </verify>
  <done>
    - `registry.json` at repo root with `$schema`, name `dgc-miniapp`, homepage, and one `hello` item.
    - `registry/hello/hello.tsx` exports `Hello` with tokenized Tailwind classes.
    - `registry/hello/registry-item.json` declares the item.
    - `src/app/page.tsx` renders `<Hello name="world" />` inside a landing layout (no client hooks, no fetch).
    - `pnpm registry:build` emits `public/r/hello.json` and `public/r/registry.json`.
    - `pnpm build` emits `out/index.html` and `out/r/hello.json`.
  </done>
</task>

<task type="auto">
  <name>Task 3: Scratch-consumer smoke test (R1.4)</name>
  <files>
    (external: temp directory under system tmp — not committed to the registry repo)
  </files>
  <action>
Validate the end-to-end consumer experience. Creates a scratch Next.js app, installs the local registry, verifies compile. Cleanup at the end.

(1) Start the registry dev server:
```bash
cd D:/sources/dgc-miniapp-shadcn
pnpm dev &
REGISTRY_PID=$!
sleep 8
curl -sS http://localhost:3000/r/hello.json | grep -q "\"name\":\s*\"hello\"" && echo "registry serving OK"
```

(2) In a scratch folder, bootstrap a consumer:
```bash
SCRATCH="/tmp/dgc-scratch-consumer-$$"
mkdir -p "$SCRATCH" && cd "$SCRATCH"
pnpm create next-app@15 consumer \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --yes
cd consumer
# Pin Tailwind v4 to match registry stack
pnpm list tailwindcss | grep -q "4\." || pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest
pnpm dlx shadcn@latest init --yes --base-color neutral || pnpm dlx shadcn@latest init
```

(3) Install the hello item from the running local registry:
```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/hello.json --yes
test -f src/components/ui/hello.tsx && echo "consumer installed OK"
grep -q "export function Hello" src/components/ui/hello.tsx
```

(4) Verify consumer compiles (use the Hello component):
```bash
cat > src/app/page.tsx <<'EOF'
import { Hello } from "@/components/ui/hello";
export default function Home() {
  return <main className="p-8"><Hello name="consumer" /></main>;
}
EOF
pnpm build
```
Expected: successful static build, no TS errors, no missing-dep errors.

(5) Cleanup:
```bash
kill $REGISTRY_PID 2>/dev/null
cd D:/sources/dgc-miniapp-shadcn
rm -rf "$SCRATCH"
```

If any step fails: do NOT proceed to Task 4. Fix the root cause (likely in Task 1 or Task 2 outputs) first.
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn &amp;&amp; (pnpm dev &amp;) &amp;&amp; sleep 8 &amp;&amp; SCRATCH="/tmp/dgc-scratch-$$" &amp;&amp; mkdir -p "$SCRATCH" &amp;&amp; cd "$SCRATCH" &amp;&amp; pnpm create next-app@15 consumer --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes &amp;&amp; cd consumer &amp;&amp; pnpm dlx shadcn@latest init --yes || true &amp;&amp; pnpm dlx shadcn@latest add http://localhost:3000/r/hello.json --yes &amp;&amp; test -f src/components/ui/hello.tsx &amp;&amp; echo "import { Hello } from \"@/components/ui/hello\"; export default function Home(){ return &lt;main&gt;&lt;Hello/&gt;&lt;/main&gt;; }" &gt; src/app/page.tsx &amp;&amp; pnpm build &amp;&amp; pkill -f "next dev" || true &amp;&amp; rm -rf "$SCRATCH"</automated>
  </verify>
  <done>
    - Scratch Next.js 15 app in a temp dir successfully runs `shadcn add http://localhost:3000/r/hello.json`.
    - `src/components/ui/hello.tsx` appears in the consumer with the exported `Hello` component.
    - Consumer `pnpm build` succeeds referencing the installed component.
    - Temp dir cleaned up.
  </done>
</task>

<task type="auto">
  <name>Task 4: CI workflow + CNAME + .nojekyll + CODEOWNERS</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml,
    D:/sources/dgc-miniapp-shadcn/.github/CODEOWNERS,
    D:/sources/dgc-miniapp-shadcn/public/CNAME,
    D:/sources/dgc-miniapp-shadcn/public/.nojekyll
  </files>
  <action>
(1) Create `.github/workflows/deploy.yml` verbatim from RESEARCH.md:372–438. Key properties to re-verify:
- Triggers: `push: branches: [main]` + `workflow_dispatch` (R2.1).
- Top-level `permissions:` block: `contents: read`, `pages: write`, `id-token: write` (Pitfall #6).
- `concurrency: group: pages, cancel-in-progress: false`.
- Steps in this exact order:
  1. `actions/checkout@v4`
  2. `pnpm/action-setup@v4` with `version: 10`
  3. `actions/setup-node@v4` with `node-version: 20`, `cache: pnpm`
  4. `pnpm install --frozen-lockfile`
  5. `pnpm lint` (R10.4 — fail CI on lint error)
  6. `pnpm dlx shadcn@latest build` (emits `public/r/*.json` — MUST be before next build per Pitfall #5)
  7. `pnpm build` — but NOTE: `package.json` `build` script chains `shadcn build && next build`. For CI clarity, use `pnpm exec next build` instead of `pnpm build` to avoid running `shadcn build` twice. UPDATE the workflow step to `pnpm exec next build`.
  8. Safety net: `mkdir -p out/r && cp -r public/r/* out/r/ 2>/dev/null || true`
  9. `touch out/.nojekyll`
  10. `actions/upload-pages-artifact@v3` with `path: ./out`
- Second job `deploy` with `needs: build`, `environment: github-pages`, `actions/deploy-pages@v4`.

(2) Create `public/CNAME`:
```
registry.dg-superapp.com
```
Single line, no trailing newline issues. Use:
```bash
printf "registry.dg-superapp.com" > D:/sources/dgc-miniapp-shadcn/public/CNAME
```

(3) Create `public/.nojekyll` (empty file):
```bash
touch D:/sources/dgc-miniapp-shadcn/public/.nojekyll
```

(4) Create `.github/CODEOWNERS` stub (Phase 7 expands this):
```
# Default owners for everything in this repo (Phase 7 refines).
* @dg-superapp/design-system-maintainers
```

(5) Sanity-check the workflow YAML parses:
```bash
cd D:/sources/dgc-miniapp-shadcn
# If Node has yaml installed globally or we have python:
python -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" 2>/dev/null \
  || node -e "require('fs').readFileSync('.github/workflows/deploy.yml','utf8').split('\n').forEach((l,i)=>console.log(i+1,l))" | head -60
```

(6) Re-run full local build to ensure nothing broke:
```bash
pnpm build
test -f out/CNAME && grep -q "registry.dg-superapp.com" out/CNAME
test -f out/r/hello.json
```
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn &amp;&amp; test -f .github/workflows/deploy.yml &amp;&amp; grep -q "deploy-pages@v4" .github/workflows/deploy.yml &amp;&amp; grep -q "id-token: write" .github/workflows/deploy.yml &amp;&amp; grep -q "shadcn.*build" .github/workflows/deploy.yml &amp;&amp; grep -q "pnpm lint" .github/workflows/deploy.yml &amp;&amp; test -f public/CNAME &amp;&amp; grep -q "registry.dg-superapp.com" public/CNAME &amp;&amp; test -f public/.nojekyll &amp;&amp; test -f .github/CODEOWNERS &amp;&amp; pnpm build &amp;&amp; test -f out/CNAME &amp;&amp; test -f out/r/hello.json</automated>
  </verify>
  <done>
    - `.github/workflows/deploy.yml` runs checkout → pnpm → node20 → install → lint → shadcn build → next build → cp safety net → nojekyll → upload-pages-artifact → deploy-pages.
    - Permissions block includes `pages: write` + `id-token: write`.
    - `public/CNAME` contains exactly `registry.dg-superapp.com`.
    - `public/.nojekyll` exists (empty).
    - `.github/CODEOWNERS` contains a default-owner rule.
    - `out/CNAME` + `out/r/hello.json` present after `pnpm build`.
  </done>
</task>

<task type="auto">
  <name>Task 5: Docs — README, CONTRIBUTING, LICENSE</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/README.md,
    D:/sources/dgc-miniapp-shadcn/CONTRIBUTING.md,
    D:/sources/dgc-miniapp-shadcn/LICENSE
  </files>
  <action>
(1) `README.md` — cover: what this is, stack, consumer install command, local dev, directory layout, phase status. Target ~60–100 lines. Government tone (sentence case, no emoji).

Required sections:
- Title + one-sentence description
- Consumer install (with `npx` and `pnpm dlx` variants, using the production URL `https://registry.dg-superapp.com/r/<item>.json`)
- Available items (table with one entry: `hello` — placeholder)
- Local development (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm registry:build`)
- Directory layout (tree mirroring RESEARCH.md:122–156)
- Stack list (Next 15, Tailwind v4, shadcn CLI v4, pnpm 10, Node 20)
- Phase status — "Phase 1 of 7: scaffold + deploy pipeline"
- Link to CONTRIBUTING.md

(2) `CONTRIBUTING.md` — cover: how to add a new registry item. Target ~40–60 lines.

Required sections:
- Add a component: 4-step checklist (create `registry/<name>/<name>.tsx`, add `registry/<name>/registry-item.json`, append to `registry.json` items[], run `pnpm registry:build` to verify)
- Naming + item types (link to `registry:ui`, `registry:theme`, `registry:block` glossary in RESEARCH.md or shadcn docs)
- Tokens rule: components MUST use Tailwind classes resolving to CSS vars (no hex literals; Phase 2 ships tokens)
- Bilingual rule: all copy must accept Khmer; reserve `lang="km"` prop where text renders
- PR flow: branch, `pnpm lint`, `pnpm build`, push, open PR against main, CI must go green
- Where to ask for help (placeholder — internal channel TBD)

(3) `LICENSE` — RESOLVE via checkpoint task 7 before writing the final version. For now, write a placeholder file:
```
DGC MiniApp Design System Registry

Copyright (c) 2026 Digital Government Committee, Cambodia.

License TBD — see Phase 1 Task 7 checkpoint. Do not redistribute until resolved.
```
Task 7 replaces this with the resolved license text.

(4) Verify files render reasonably:
```bash
wc -l D:/sources/dgc-miniapp-shadcn/README.md D:/sources/dgc-miniapp-shadcn/CONTRIBUTING.md
```
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn &amp;&amp; test -f README.md &amp;&amp; test -f CONTRIBUTING.md &amp;&amp; test -f LICENSE &amp;&amp; [ $(wc -l &lt; README.md) -ge 30 ] &amp;&amp; [ $(wc -l &lt; CONTRIBUTING.md) -ge 20 ] &amp;&amp; grep -q "registry.dg-superapp.com" README.md &amp;&amp; grep -q "pnpm registry:build" CONTRIBUTING.md</automated>
  </verify>
  <done>
    - `README.md` ≥ 30 lines, documents consumer install with production URL, lists stack, links to CONTRIBUTING.
    - `CONTRIBUTING.md` ≥ 20 lines, walks through adding a new registry item.
    - `LICENSE` file exists (placeholder pending Task 7 checkpoint).
  </done>
</task>

<task type="checkpoint:decision" gate="blocking">
  <name>Task 6: Open questions — repo name + LICENSE choice</name>
  <decision>Before handing off to the human for repo creation, resolve three ambiguities.</decision>
  <context>
RESEARCH.md open questions §1, §2, §3 and STATE.md scratch notes flag these. They block external work (repo creation, DNS) not local work, so asking now avoids wasted cycles.

- Q1: Final repo name. ROADMAP.md:135 and RESEARCH.md:507 list `dg-superapp/design-system` vs `dg-superapp/ui`. Default recommendation: `design-system` (discoverable, matches PROJECT.md phrasing).
- Q2: LICENSE. Options: MIT (permissive, internal-friendly), Apache-2.0 (adds patent grant — suitable for gov-adjacent work), or DGC-internal / UNLICENSED (restrict to DGC + approved MiniApp teams). Government distribution typically demands one of the latter two. No default — needs a human call.
- Q3: Org-level custom-domain verification for `dg-superapp.com` on the GitHub org. RESEARCH.md A5. Has the org admin already verified the domain at `github.com/organizations/dg-superapp/settings/pages`? If not, this must happen BEFORE pushing the workflow or Pages will reject the custom domain.
  </context>
  <options>
    <option id="option-a">
      <name>design-system + MIT + domain already verified</name>
      <pros>Fastest path; MIT is least friction for external MiniApp teams.</pros>
      <cons>MIT may not match DGC legal stance on government IP.</cons>
    </option>
    <option id="option-b">
      <name>design-system + Apache-2.0 + domain already verified</name>
      <pros>Patent grant covers gov use; still OSS-friendly.</pros>
      <cons>Slightly longer license text; most teams accept either MIT or Apache.</cons>
    </option>
    <option id="option-c">
      <name>design-system + DGC-internal/proprietary + domain already verified</name>
      <pros>Matches internal-only distribution posture; no external fork risk.</pros>
      <cons>Must ship custom license text (flag for legal review); blocks v2 if DGC later wants public OSS.</cons>
    </option>
    <option id="option-d">
      <name>Custom: other repo name / license / domain not yet verified</name>
      <pros>Captures edge cases.</pros>
      <cons>Describe in resume signal; may create a Phase 0.5 verification subtask.</cons>
    </option>
  </options>
  <resume-signal>Select option-a, option-b, option-c, or describe custom decision including: (1) repo name, (2) LICENSE choice + full license text if custom, (3) whether `dg-superapp.com` is verified at org level (yes/no — if no, add TXT record first).</resume-signal>
</task>

<task type="auto">
  <name>Task 7: Apply licensing decision + update README badges</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/LICENSE,
    D:/sources/dgc-miniapp-shadcn/README.md,
    D:/sources/dgc-miniapp-shadcn/package.json
  </files>
  <action>
Based on the Task 6 resume signal:

(1) Rewrite `LICENSE` with the resolved license text:
- Option A (MIT): standard MIT template with "Copyright (c) 2026 Digital Government Committee, Cambodia".
- Option B (Apache-2.0): paste Apache-2.0 full text + NOTICE file if helpful.
- Option C (DGC-internal/proprietary): use the exact text provided by the user in the resume signal. If no custom text provided, fall back to a short "All rights reserved. Internal use by DGC and approved MiniApp integrators only" placeholder and flag it for legal review in the summary.

(2) Update `package.json` `"license"` field:
- MIT → `"MIT"`
- Apache-2.0 → `"Apache-2.0"`
- Proprietary → `"UNLICENSED"`

(3) Add a single-line license line to the top of `README.md` under the title (e.g. `License: MIT` or `License: DGC Internal — see LICENSE`).

(4) If Task 6 selected a repo name different from `dg-superapp/design-system`, update any hardcoded repo references in README.md and CONTRIBUTING.md. The consumer URL `registry.dg-superapp.com` does NOT change (that is DNS-level, not repo-name-level).

(5) Re-run lint/build to confirm nothing broke:
```bash
cd D:/sources/dgc-miniapp-shadcn
pnpm lint
pnpm build
```
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn &amp;&amp; test -f LICENSE &amp;&amp; [ $(wc -c &lt; LICENSE) -gt 200 ] &amp;&amp; grep -qE "\"license\":\s*\"(MIT|Apache-2\.0|UNLICENSED)\"" package.json &amp;&amp; grep -qi "license" README.md &amp;&amp; pnpm lint &amp;&amp; pnpm build</automated>
  </verify>
  <done>
    - `LICENSE` contains the resolved license text (not the placeholder).
    - `package.json` `license` field matches (MIT / Apache-2.0 / UNLICENSED).
    - `README.md` declares the license.
    - `pnpm lint` + `pnpm build` still green.
  </done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 8: HUMAN — Create GitHub repo, push, wire DNS, enable Pages</name>
  <what-built>
All local scaffolding, registry item, CI workflow, CNAME, .nojekyll, docs, and license. Local `pnpm build` produces a shippable `out/` artifact. `shadcn add http://localhost:3000/r/hello.json` works end-to-end from a scratch consumer (Task 3 proved it).
  </what-built>
  <how-to-verify>
The following steps are human-only (no CLI substitutes for DNS, org repo creation, or the initial `git init` + org push):

1) In the target workspace, initialize git and make the initial commit. Run from `D:/sources/dgc-miniapp-shadcn/`:
```bash
cd D:/sources/dgc-miniapp-shadcn
git init -b main
git add .
git status  # confirm public/r/ NOT staged; CNAME + .nojekyll ARE staged
git commit -m "feat(phase-1): scaffold Next 15 + Tailwind v4 + shadcn registry, hello placeholder, deploy workflow"
```

2) Create the empty GitHub repo under `dg-superapp` (name per Task 6 decision, default `design-system`). Do NOT initialize with README/LICENSE — local repo already has both.

3) Add remote and push:
```bash
git remote add origin git@github.com:dg-superapp/design-system.git   # or the resolved name
git push -u origin main
```

4) GitHub repo settings:
- Settings → Pages → Source = "GitHub Actions" (not "Deploy from a branch").
- Settings → Branches → Add rule for `main`: "Require a pull request before merging" + "Require status checks to pass" (select the `build` workflow job once it has run once).
- Settings → General → Features → keep Issues + Discussions (later phases will use them).

5) DNS (via `dg-superapp.com` DNS provider):
- Add CNAME record: `registry` → `dg-superapp.github.io` (TTL 300s during rollout, raise to 3600 after verification).
- Wait 5–30 min for propagation. Verify:
  ```bash
  dig registry.dg-superapp.com CNAME +short
  # expected: dg-superapp.github.io.
  ```

6) In GitHub repo Settings → Pages:
- Custom domain field should auto-detect `registry.dg-superapp.com` from the committed CNAME.
- Wait for the green "DNS check successful" indicator.
- Enable "Enforce HTTPS" (requires cert provisioning, takes 5–15 min after DNS verification).

7) Verify the deploy:
- The push in step 3 should have triggered the Actions workflow. Check `Actions` tab → `Build & Deploy Registry` run → green.
- `curl -I https://registry.dg-superapp.com/r/hello.json` → expect `HTTP/2 200` with `content-type: application/json`.
- `curl https://registry.dg-superapp.com/r/hello.json | jq .name` → expect `"hello"`.
- `curl https://registry.dg-superapp.com/` → expect the preview HTML with "dgc-miniapp registry".

8) Real consumer smoke (from any clean machine):
```bash
mkdir /tmp/final-smoke && cd /tmp/final-smoke
pnpm create next-app@15 app --typescript --tailwind --eslint --app --src-dir --use-pnpm --yes
cd app
pnpm dlx shadcn@latest init --yes
pnpm dlx shadcn@latest add https://registry.dg-superapp.com/r/hello.json --yes
test -f src/components/ui/hello.tsx && echo "PHASE 1 EXIT CRITERION MET"
```

9) If any step fails: capture the exact error and return to this checkpoint. Common causes:
- DNS not yet propagated → wait 15 min, retry.
- Custom-domain verification missing at org level → `github.com/organizations/dg-superapp/settings/pages` → add domain + TXT record.
- Pages returns 404 on `/r/hello.json` → check Actions log for Pitfall #5 (shadcn build ran after next build); confirm workflow YAML order.
- CI red on lint → fix lint error, force-push is NOT needed, just push a fix commit.
  </how-to-verify>
  <resume-signal>Paste: (a) the live URL `https://registry.dg-superapp.com/r/hello.json` (must return 200 JSON), and (b) proof that step 8 created `src/components/ui/hello.tsx` in a scratch consumer. Or type "blocked: <reason>" to escalate.</resume-signal>
</task>

<task type="auto">
  <name>Task 9: Broken-build regression test (R2.4) + update STATE.md</name>
  <files>
    D:/sources/dgc-miniapp-shadcn/registry.json,
    D:/sources/dgc-miniapp-design-system/.planning/STATE.md
  </files>
  <action>
(1) Prove R2.4 — CI must block merge on broken `shadcn build`. On a throwaway branch:
```bash
cd D:/sources/dgc-miniapp-shadcn
git checkout -b test/broken-registry
# Introduce a schema violation — remove required "name" field:
node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('registry.json','utf8'));delete j.name;fs.writeFileSync('registry.json',JSON.stringify(j,null,2));"
git commit -am "test(phase-1): deliberately break registry.json to verify CI blocks merge"
git push -u origin test/broken-registry
# Open a PR in the GitHub UI → confirm the Actions run goes RED and the PR shows "Required check failed".
# Then revert:
git checkout main
git branch -D test/broken-registry
git push origin --delete test/broken-registry
```
Record the PR URL + failing-run URL in the phase SUMMARY.

(2) Update `D:/sources/dgc-miniapp-design-system/.planning/STATE.md`:
- Set `Current phase` → "Phase 2 — Theme + tokens (not started)".
- Append to `Where we are`:
  - "Phase 1 complete: `D:/sources/dgc-miniapp-shadcn/` scaffolded, deployed to `https://registry.dg-superapp.com/`, `hello` placeholder item installs from production URL, CI blocks merge on broken shadcn build (R2.4 proven via PR <URL>)."
- Update `Decisions on record`:
  - Append repo name decision from Task 6.
  - Append LICENSE decision from Task 6.
- Set `Next command` → "`/gsd-plan-phase 2` — generate PLAN.md for Phase 2 (dgc-theme + HEX→HSL converter)."
- Clear `Blockers` (should remain "None" unless Task 8 surfaced new ones).

(3) Commit:
```bash
cd D:/sources/dgc-miniapp-design-system
git add .planning/STATE.md
git commit -m "chore(state): mark phase 1 complete, point to phase 2"
```
  </action>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-design-system &amp;&amp; grep -q "Phase 2" .planning/STATE.md &amp;&amp; grep -q "Phase 1 complete" .planning/STATE.md &amp;&amp; grep -q "gsd-plan-phase 2" .planning/STATE.md</automated>
  </verify>
  <done>
    - R2.4 proven: a deliberately-broken registry.json on a throwaway branch caused a red CI run + blocked PR merge. PR + run URLs captured in phase SUMMARY.
    - `D:/sources/dgc-miniapp-design-system/.planning/STATE.md` reflects Phase 1 complete + Phase 2 as next.
  </done>
</task>

</tasks>

<dependency_graph>
```
Task 1 (bootstrap)
  └─> Task 2 (registry item + page)
        └─> Task 3 (scratch consumer smoke)
              └─> Task 4 (CI workflow + CNAME)
                    └─> Task 5 (README / CONTRIBUTING / LICENSE placeholder)
                          └─> Task 6 (DECISION: repo name + license + domain verification)
                                └─> Task 7 (apply license)
                                      └─> Task 8 (HUMAN: git init, push, DNS, Pages)
                                            └─> Task 9 (R2.4 regression + STATE update)
```

Strictly sequential. Task 5 (docs) could run in parallel with Task 4 (CI workflow) in theory — both are leaf writes against disjoint files — but keeping it sequential makes failure diagnosis simpler for a solo Claude execution pass. No meaningful parallelism gain to justify the complexity.

File-ownership check: every task writes to a disjoint file set (except the LICENSE/README pair updated by Tasks 5 + 7; Task 7 strictly supersedes Task 5 there). No conflicts.
</dependency_graph>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Consumer app → registry JSON URL | Untrusted consumer fetches our-authored TSX source; our code runs in their build. |
| GitHub Actions → GH Pages | OIDC-authenticated deploy; no long-lived tokens. |
| Public internet → `registry.dg-superapp.com` | Anyone can fetch `/r/*.json`; no auth in v1. |
| Contributor → `main` branch | Requires PR + CI green (branch protection). |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-1-01 | Tampering | `hello.tsx` ships into consumer builds | mitigate | Branch protection on `main` (Task 8 step 4) + CODEOWNERS stub (Task 4) — every item change requires reviewed PR. |
| T-1-02 | Spoofing | CI deploy credentials | mitigate | Use `id-token: write` OIDC via `actions/deploy-pages@v4` (RESEARCH.md:419). No PAT in secrets, nothing to steal. |
| T-1-03 | Tampering | Forked-PR workflow runs trying to deploy | mitigate | Workflow triggers on `push: branches: [main]` + `workflow_dispatch` only — NOT `pull_request`. Forked PRs cannot publish. |
| T-1-04 | Tampering | `registryDependencies` pointing to external registries | mitigate | Phase 1's `hello` has `registryDependencies: []`. Policy in CONTRIBUTING.md: only `registry.dg-superapp.com` or official shadcn registries allowed. |
| T-1-05 | Information Disclosure | Registry content | accept | All content is intentionally public; no PII, no secrets. v1.0 public-by-design. |
| T-1-06 | Denial of Service | GH Pages rate limits | accept | GH Pages is hardened; abuse is GitHub's problem. Low-value target. |
| T-1-07 | Repudiation | Who deployed what | accept | Git history + Actions logs provide audit trail; sufficient for gov use case. |
| T-1-08 | Elevation | Consumer install overwrites files in their repo | accept | Inherent to shadcn model; consumers consent by running `shadcn add`. Document in CONTRIBUTING. |
</threat_model>

<risks>
## Risks / gotchas (lifted + extended from RESEARCH.md Pitfalls)

1. **Pitfall #1 — Next 16 vs 15.** `create-next-app@latest` pulls 16.x. Task 1 pins `next@^15` immediately after scaffold; verification asserts `next 15.x` appears in `pnpm list`.
2. **Pitfall #2 — Tailwind v3 regression.** v4 must be verified post-init. Task 1 step 2 + verification grep for `@tailwindcss/postcss` and `@import "tailwindcss"`.
3. **Pitfall #3 — Static export breaks on dynamic features.** Task 2 page.tsx is pure RSC; no `fetch`, no `cookies()`, no server actions. Codified in `<constraints>`.
4. **Pitfall #4 — CNAME disappears.** Task 4 commits `public/CNAME` to git; `.gitignore` in Task 1 excludes only `public/r/`, never `public/*`.
5. **Pitfall #5 — `shadcn build` after `next build`.** Workflow runs `shadcn build` BEFORE `next build`, plus `cp -r public/r out/r` safety net after. Both Task 4 + `package.json` scripts encode the right order.
6. **Pitfall #6 — `workflow_dispatch` permissions.** Top-level `permissions:` block in `deploy.yml` includes `pages: write` + `id-token: write` verbatim from RESEARCH.md.
7. **DNS not yet propagated at Task 8.** Plan calls out a 5–30 min wait + `dig` verification command. If blocked > 1 hour, escalate to org DNS admin.
8. **Org-level domain verification (RESEARCH A5).** Task 6 checkpoint Q3 forces the human to confirm this BEFORE push. If missing, Task 8 step 4 adds the TXT record first.
9. **Windows path quirks.** All commands use forward slashes + bash. No PowerShell needed. `touch` works under Git Bash.
10. **pnpm lockfile drift between registry repo and scratch consumer.** Task 3 uses `pnpm create next-app@15` on each run to stay aligned with the registry's Next 15 pin.
</risks>

<human_actions>
Explicit human-gated steps (Task 8 handles them all but enumerated here for planning visibility):

| # | Action | Why human-only | When |
|---|--------|----------------|------|
| 1 | Create empty repo `dg-superapp/<name>` | Org-level create perms | Before Task 8 step 2 |
| 2 | `git init` + initial commit + push | Prefer human control over first git state (can be automated, but plan defers to human per brief) | Task 8 step 1–3 |
| 3 | Settings → Pages → Source = "GitHub Actions" | Repo admin | Task 8 step 4 |
| 4 | Settings → Branches → protect `main` | Repo admin | Task 8 step 4 |
| 5 | Add DNS CNAME `registry` → `dg-superapp.github.io` | DNS admin | Task 8 step 5 |
| 6 | Verify custom domain at org Pages settings | Org owner (if not already verified — see Task 6 Q3) | Before Task 8 step 6 |
| 7 | Confirm HTTPS enforced after cert provisioning | Repo admin | Task 8 step 6 |
| 8 | Verify production URL returns `/r/hello.json` | N/A — any human with curl | Task 8 step 7 |
| 9 | Merge the R2.4-regression PR as failing (then delete branch) | Human PR approver | Task 9 |

Claude handles: everything else (local file creation, edits, `pnpm` commands, lint, build, local smoke tests, STATE.md updates).
</human_actions>

<verification>
Overall phase checks (run in this order after Task 9):

```bash
# 1. Local invariants
cd D:/sources/dgc-miniapp-shadcn
pnpm list next react tailwindcss shadcn --depth=0   # versions 15 / 19 / 4 / 4
pnpm lint
pnpm build
test -f out/index.html && test -f out/r/hello.json && test -f out/CNAME && test -f out/.nojekyll

# 2. Production invariants (after Task 8)
curl -sSI https://registry.dg-superapp.com/r/hello.json | grep -E "^HTTP/.* 200"
curl -sS https://registry.dg-superapp.com/r/hello.json | jq -e '.name == "hello"'
curl -sS https://registry.dg-superapp.com/ | grep -q "dgc-miniapp registry"

# 3. Consumer install invariant
SCRATCH=/tmp/phase1-final-$$
mkdir -p "$SCRATCH" && cd "$SCRATCH"
pnpm create next-app@15 app --typescript --tailwind --eslint --app --src-dir --use-pnpm --yes
cd app && pnpm dlx shadcn@latest init --yes
pnpm dlx shadcn@latest add https://registry.dg-superapp.com/r/hello.json --yes
test -f src/components/ui/hello.tsx && grep -q "export function Hello" src/components/ui/hello.tsx
rm -rf "$SCRATCH"

# 4. CI gate invariant (R2.4 — done in Task 9)
# Verified manually: broken-registry branch produced a red CI run + blocked PR merge.
```

If all four pass, Phase 1 is complete.
</verification>

<success_criteria>
Phase 1 done when ALL are true:

- [x] `D:/sources/dgc-miniapp-shadcn/` exists with Next 15, React 19, Tailwind v4, shadcn CLI v4, pnpm.
- [x] Root `registry.json` with `$schema` lists the `hello` item (R1.2).
- [x] `pnpm registry:build` / `shadcn build` emits `public/r/hello.json` (R1.3).
- [x] Scratch consumer installs `hello` from `http://localhost:3000/r/hello.json` (R1.4 — local).
- [x] `.github/workflows/deploy.yml` exists; CI runs `pnpm install` → `pnpm lint` → `shadcn build` → `next build` → `deploy-pages@v4` (R2.1, R10.4).
- [x] Preview site `/` and `/r/*.json` serve from the same origin (R2.2).
- [x] Custom domain `registry.dg-superapp.com` resolves + serves (R2.3).
- [x] Intentionally-broken `registry.json` fails CI + blocks PR merge (R2.4).
- [x] Prettier + ESLint configured; `pnpm lint` passes; CI fails on lint error (R10.4).
- [x] `README.md` + `CONTRIBUTING.md` + `LICENSE` present (R10.5).
- [x] External consumer runs `pnpm dlx shadcn@latest add https://registry.dg-superapp.com/r/hello.json` and receives a working component (R1.4 — production, final exit criterion from ROADMAP Phase 1).
- [x] `STATE.md` updated to point at Phase 2.
</success_criteria>

<open_questions>
Escalated to Task 6 checkpoint; do NOT proceed past Task 6 without resolution:

1. Repo name: `dg-superapp/design-system` (recommended) vs `dg-superapp/ui`.
2. LICENSE: MIT / Apache-2.0 / DGC-internal proprietary.
3. Is `dg-superapp.com` already verified at org-level for GitHub Pages custom domains? (RESEARCH A5)

Not blocking but worth flagging in the SUMMARY for Phase 2 to consider:
- Should `public/r/` remain gitignored? Recommendation (RESEARCH §Open Questions 2): yes, gitignore + `.gitkeep`. Already implemented this way in Task 1.
- Next.js 16 escape hatch. Recommendation: stay on 15 through v1.0; open a v1.1 tracker issue. Already on 15.
</open_questions>

<output>
After completion, create `.planning/phases/1-scaffold/1-01-SUMMARY.md` in the SOURCE project (`D:/sources/dgc-miniapp-design-system/.planning/phases/1-scaffold/`), capturing:

- Final repo URL + live registry URL.
- Exact pinned versions (`pnpm list` output snippet).
- Task 6 resolved decisions (repo name, license, domain verification status).
- Task 8 live-smoke proof (`curl` response headers from `registry.dg-superapp.com/r/hello.json`).
- Task 9 R2.4 proof (PR URL + failing Actions run URL).
- Any deviations from this PLAN and why.
- Handoff note for Phase 2: location of `globals.css` `@theme inline {}` block to populate, location of `components.json` registries entry to update when production URL goes live.
</output>
