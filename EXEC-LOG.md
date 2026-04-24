# Phase 1 execution log

- [x] Task 1 — bootstrap verified; next.config.ts static export; components.json; src/lib/utils.ts; globals.css v4 + shadcn vars; package.json scripts; .prettier*; public/r/.gitkeep
- [x] Task 2 — registry.json + registry/hello/hello.tsx + landing
- [x] Task 3 — `shadcn build` emits public/r/hello.json; dev server served it (earlier run log)
- [x] Task 4 — .github/workflows/deploy.yml + public/CNAME + public/.nojekyll
- [x] Task 5 — README.md (DGC-branded) + CONTRIBUTING.md + LICENSE (placeholder pending Task 6)
- [x] Task 6 — decisions: repo=dg-superapp/design-system, license=MIT, domain=registry.016910804.xyz (dev; swap to dgsuperapp.gov.kh when DNS access granted)
- [x] Task 7 — MIT LICENSE written; domain patched in public/CNAME, registry.json, README.md, .planning/*.md; full `pnpm build` clean
- [x] Task 8 — git init+main, initial commit, `gh repo create dg-superapp/design-system --public --push`, Pages enabled (build_type=workflow), Cloudflare CNAME `registry.016910804.xyz -> dg-superapp.github.io` (proxied=false), PUT pages cname, first workflow run succeeded, `curl http://registry.016910804.xyz/r/hello.json` returned 200 + valid JSON (name=hello, type=registry:ui, files=1)
- [x] Task 9 — R2.4 fully satisfied end-to-end:
  1. Local test: `echo BROKEN > registry.json && pnpm registry:build` → exit 1 (`" is not valid JSON`)
  2. Workflow updated: added `pull_request: branches: [main]` trigger, gated upload-pages + deploy job with `if: github.event_name == 'push'` (commit e730929)
  3. CI test: branch `test/r2.4-regression` with broken registry.json + PR #1 → workflow ran, failed at "Build shadcn registry → public/r/*.json" step ✅
  4. PR closed without merge, branch deleted
  5. Branch protection on `main` applied via `gh api --method PUT`:
     - required_status_checks.strict=true, contexts=["build"]
     - required_pull_request_reviews.required_approving_review_count=1, dismiss_stale_reviews=true
     - required_linear_history=true, allow_force_pushes=false, allow_deletions=false
     - enforce_admins=false (admins can bypass for emergency patches)
  6. main now unmerge-able with red check or without 1 approval. R2.4 complete.

# Phase 2 execution log

- [x] Task 1 — branch `phase/2-theme` from main; `scripts/hex-to-hsl.mjs` (HEX→HSL, --verify flag, 9-entry golden table); `scripts/hex-to-hsl.spec.mjs` (8 assertions passing); `#0D47A1 → 216 85% 34%` verified.
- [x] Task 2 — `registry/dgc-theme/theme.css` authored (306 lines). All 8 grep assertions pass: --brand, @custom-variant dark, no [data-theme], no hsl() wrapper in var values, --radius: 0.75rem, :lang(km), no Moul, --sidebar-* (D4). Pitfall 6 file order respected. `pnpm registry:build` clean.
- [x] Task 3 — `registry/dgc-theme/registry-item.json` created (inline convention); root `registry.json` gained `meta.version: 0.2.0` + `dgc-theme` item above `hello`. `shadcn build` emitted `public/r/dgc-theme.json`; 8 schema asserts pass (type=registry:theme, light.primary=216 85% 34%, brand+sidebar-primary present, no hsl() wrappers).
- [x] Task 4 — `src/app/globals.css` replaced with dogfood of `registry/dgc-theme/theme.css` (leading dogfood marker comment only difference); `scripts/check-dogfood.mjs` strips marker, compares rest, exits 1 on drift; `pnpm drift:check` script wired; `node scripts/check-dogfood.mjs` → "dogfood OK"; `pnpm registry:build && pnpm build` → full pipeline green (Next compiled 22.8s, 5/5 static pages).
- [x] Task 5 — token reference landing page. New: `src/components/docs/Swatch.tsx` (data-token attr, hsl(var(--x)) background), `src/components/docs/TokenTable.tsx` (grid), `src/components/docs/DarkModeToggle.tsx` (client island, no next-themes). Rewrote `src/app/page.tsx` with 9 sections: hero (bg-brand CTA + install cmd + Khmer subtitle), primary palette (blue-050..950), neutrals (white + gray-050..950), semantics (success/warning/danger/info + -bg), type scale (Latin + `<p lang="km">` specimen per size), spacing (space-1..8 bars), radii (xs..pill), shadows (0..3 + focus), hello preview. All 3 grep assertions green (`data-token="blue-900"`, `bg-brand`, `lang="km"`). `pnpm tsc --noEmit` clean. `pnpm build` clean, no ESLint warnings, 5/5 static pages, route `/` 510 B. Deviation: Task 5 action mentions rendering `<Hello>` "from Task 7"; Task 7 not yet executed, so Hello rendered with current (pre-migration) classes and labeled as such — will auto-update after Task 7. Section 9 (hello) is smoke only.
- [x] Task 6 — MDX docs page `/docs/foundations/tokens` (R9.3). Installed `@next/mdx @mdx-js/loader @mdx-js/react @types/mdx` as devDeps; `next.config.ts` wrapped with `createMDX({ extension: /\.mdx?$/ })` + `pageExtensions: ["ts","tsx","md","mdx"]`. New: root-level `mdx-components.tsx` (Next 15 App Router MDX hook — required, cannot live under `src/`; reintroduces prose cascade for docs). New: `src/app/docs/foundations/tokens/page.mdx` — reuses `Swatch`/`TokenTable` from `src/components/docs/`, sections for install cmd, D1 `--accent`→`--brand` callout, primary/neutral/semantic palette tables, type scale (Latin + Khmer `lang="km"` column), spacing/radius/shadow tables, dark mode + downstream usage sections. `pnpm build` green, `out/docs/foundations/tokens/index.html` emitted (123 B route). Grep assertions on emitted HTML: `data-token="blue-900"` count=1, `lang="km"` count=2. Deviation: plan says `next.config.mjs` but repo uses `next.config.ts` (Phase 1 convention); wrapped the existing .ts file instead of creating a .mjs — Rule 3 (blocking: two configs would conflict).
