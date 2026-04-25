# Project state — DGC MiniApp shadcn Registry

**Initialized:** 2026-04-24
**Mode:** auto (`/gsd-new-project --auto`)

## Where we are
- Codebase mapped — `.planning/codebase/` (7 docs, 928 lines).
- Project framed — `PROJECT.md`.
- Requirements scoped — `REQUIREMENTS.md` (10 Rs, 60+ items).
- Roadmap locked — `ROADMAP.md` (7 phases).
- Research archived — `.planning/research/` (shadcn-registry · github-hosting · port-strategy).
- **Phase 1 Tasks 1–5 executed.** Target workspace live at `D:/sources/dgc-miniapp-shadcn/`.
  - Next.js 15.5.15, Tailwind 4, shadcn CLI, pnpm — bootstrap verified
  - `registry.json` + `registry/hello/hello.tsx` authored
  - `pnpm build` produces `out/r/hello.json` + `out/r/registry.json` (static export works)
  - `.github/workflows/deploy.yml` + `public/CNAME` (registry.016910804.xyz) + `public/.nojekyll`
  - `README.md` (DGC-branded), `CONTRIBUTING.md`, `LICENSE` placeholder
  - Pitfalls 1/2/3 all avoided: `next@15.5.15`, `build: "shadcn build && next build"`, `@tailwindcss/postcss@^4` + `@import "tailwindcss"`
  - `D:/sources/dgc-miniapp-shadcn/EXEC-LOG.md` has per-task status

## Current phase
**Phase 1 — COMPLETE** (all 9 tasks green, 2026-04-24).

Live production registry:
- Repo: https://github.com/dg-superapp/design-system
- URL: http://registry.016910804.xyz/r/hello.json → HTTP 200, valid JSON
- CI: GitHub Actions deploy workflow succeeded on first push
- DNS: Cloudflare CNAME `registry.016910804.xyz` → `dg-superapp.github.io` (DNS only, unproxied)
- HTTPS: cert auto-issuing; HTTP works immediately
- R2.4 regression: verified locally (`echo BROKEN > registry.json && pnpm registry:build` → exit 1)

Domain note: `016910804.xyz` is dev-only. Swap to `registry.dgsuperapp.gov.kh` when production DNS access granted.

Artifacts:
- `phases/1-scaffold/RESEARCH.md` — 665 lines
- `phases/1-scaffold/PLAN.md` — 978 lines, 9 tasks
- `phases/1-scaffold/PLAN-CHECK.md` — FLAG (minor, proceed)
- `phases/1-scaffold/TASK-8-RUNBOOK.md` — executed end-to-end
- `D:/sources/dgc-miniapp-shadcn/EXEC-LOG.md` — per-task status

## Current phase
**Phase 4 — IN PROGRESS** (started 2026-04-25). Plan 04-00 (Wave 0 infrastructure) **COMPLETE**.

Plan 4-00 commits on `main`:
- `9afcc20` feat(04-00): install @radix-ui/react-dialog ^1.1.15 and add test:visual script
- `323176a` feat(04-00): append 9 Phase 4 tokens + 4 keyframes to dgc-theme/theme.css
- `eeb8e0c` feat(04-00): scaffold visual-diff-components.mjs harness + env-driven smoke count

Gates green: `pnpm typecheck && pnpm test:unit && pnpm registry:build && pnpm test:visual -- --item hello`. 9 new CSS tokens in both light + dark scopes, 4 keyframes, `@radix-ui/react-dialog@^1.1.15` installed, `pnpm test:visual` script wired, smoke-consumer count env-driven (SMOKE_EXPECTED_COUNT default 22, >= semantics).

Unblocks: every downstream plan 4-01..4-08 can consume Phase 4 tokens and run `pnpm test:visual -- <item>` for per-task verification.

**Next:** `/gsd-plan` 4-01 (AppHeader — first Phase 4 component). See `.planning/phases/04-headers-navigation/04-00-SUMMARY.md` for full artifact list + deviations log.

## Previous current phase
**Phase 3 — IN PROGRESS** (started 2026-04-24).

Plan 3-00 (Wave 0 infrastructure) **COMPLETE** — 3 atomic commits on `phase/3-primitives`:
- `61f08be` feat(3-00): install test+radix+rhf deps and add test scripts
- `654c928` feat(3-00): scaffold playwright + vitest configs with smoke tests
- `5040e97` feat(3-00): add items.manifest, preview route, khmer test page, McxLayout, CI a11y gate

Gates green: `pnpm typecheck && pnpm test:unit && pnpm build`. Static export emits 8 pages including `/test/khmer`, `/preview/[item]/__placeholder` sentinel. Disabled tokens `--bg-disabled` / `--fg-on-disabled` added to `theme.css` (light gray-200/gray-500 + dark 222 36% 22% / 220 18% 60%); drift check green.

Unblocks: every downstream plan 3-01..3-14 can register `ManifestEntry` entries, import PropControl types, and add playground preview slots without re-scaffolding test infra.

**Next:** `/gsd-plan` 3-01 (Button — first primitive). See `.planning/phases/03-primitives/3-00-SUMMARY.md` for full artifact list + deviations log.

## Previous phase
**Phase 2 — COMPLETE** (2026-04-24).

Merge commit `4ac09b5` squash-merged to `main` (admin override — self-approval not possible with single maintainer). Deploy workflow succeeded. Prod now serves:
- https://registry.016910804.xyz/r/dgc-theme.json → HTTP 200, 39 light + 39 dark vars, HTTPS cert live
- https://registry.016910804.xyz/r/hello.json → cascade resolves correctly
- https://registry.016910804.xyz/docs/foundations/tokens → MDX page live

## Old status (archived)

Branch `phase/2-theme` pushed, **PR #2 open + CI green**:
- https://github.com/dg-superapp/design-system/pull/2
- Required check `build`: ✅ passing

Task summary (11 commits on branch):
1. ✅ Branch + `scripts/hex-to-hsl.mjs` converter + golden-table spec
2. ✅ `registry/dgc-theme/theme.css` — 306 lines, HSL triplets + `.dark` + `:lang(km)`
3. ✅ `registry-item.json` + root `registry.json` bump to `0.2.0` + `dgc-theme` item
4. ✅ Dogfood `src/app/globals.css` = `theme.css` + drift-check script
5. ✅ `src/app/page.tsx` token reference page + `Swatch` + `TokenTable` + dark toggle
6. ✅ MDX `/docs/foundations/tokens` page with bilingual specimens
7. ✅ Port `<Hello>` to `bg-brand` + `registryDependencies` → prod URL
8. ✅ `scripts/visual-diff.mjs` Playwright — 22/22 PASS max ΔRGB=2
9. ✅ `scripts/smoke-consumer.mjs` — 204s, consumer install + build green
10. ✅ CI: + drift-check + golden-table spec (spec skipped in CI, local-only)
11. ✅ PR #2 opened with full test plan
12. ⏳ **HALT: human review + approve + merge** (branch protection blocks until check + 1 approval)

Artifacts:
- `phases/2-theme/RESEARCH.md` — 750 lines (HSL mapping + 8 pitfalls)
- `phases/2-theme/CONTEXT.md` — 4 decisions D1-D4 locked
- `phases/2-theme/PLAN.md` — 880 lines, 12 tasks
- `phases/2-theme/PLAN-CHECK.md` — verdict PASS, 3 non-blocking polish (all applied during exec)
- `D:/sources/dgc-miniapp-shadcn/EXEC-LOG.md` — per-task log

## Next action
Human approves + merges PR #2. Post-merge:
- CI redeploys to `registry.016910804.xyz`, `dgc-theme.json` goes live at prod URL
- `/docs/foundations/tokens` MDX page deploys
- Consumer cascade install works end-to-end (`SMOKE_WITH_HELLO=1 pnpm smoke:consumer` will pass)

After merge → run `/gsd-plan-phase 3` (primitives: Button, Input, Select, … × 14).

## Decisions on record
- Target repo: `https://github.com/dg-superapp/design-system` (locked Task 6).
- License: **MIT** (locked Task 6, applied Task 7).
- Custom domain: **registry.016910804.xyz** (locked Task 6, applied Task 7).
- Stack: Next.js 15 App Router · TypeScript · Tailwind v4 · shadcn CLI · pnpm · Radix · sonner · Lucide icons.
- Distribution: GitHub Pages at `registry.016910804.xyz` (custom domain).
- Token convention: HSL channel triplets (shadcn standard), dual-layer (DGC scale tokens + shadcn semantic aliases).
- Dark mode: `.dark` class (migrate from `[data-theme="dark"]`).
- `builder/` editor stays in the legacy `dgc-miniapp-design-system` repo as an internal tuning tool; not ported.
- Versioning + private-auth deferred to v2.
- Lucide icons continue as placeholder until DGC production set delivered.

## Blockers
- None. Phase 1 can start immediately.

## Risks in flight
- Tailwind v4 + shadcn CLI integration freshness (Mar 2026). Budget for API churn in Phase 1–2.
- HEX → HSL token conversion visual parity — spot-check against `project/preview/*.html` during Phase 2.
- GitHub Pages CORS on registry JSON — mitigated by custom domain; never use `raw.githubusercontent.com`.

## Scratch / open questions
- Should the new repo name be `dg-superapp/design-system` or `dg-superapp/ui`? Confirm at Phase 1 kickoff.
- Migrate tokens converter to npm package or keep as repo-local script? Likely repo-local for now.
