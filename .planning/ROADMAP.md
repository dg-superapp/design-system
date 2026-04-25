# Roadmap — DGC MiniApp shadcn Registry

Seven phases. Each phase produces a PR-sized, shippable slice. Dependency arrows noted per phase. Requirements from `REQUIREMENTS.md` mapped per phase.

---

## Phase 1: Scaffold & publish pipeline
**Goal.** Empty but deployable registry. Scratch consumer can install a hello-world item from the live URL.

**Scope.**
- Create new repo `dg-superapp/design-system` (or bootstrap sibling folder `D:/sources/dgc-miniapp-shadcn/` then push).
- Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn CLI + pnpm.
- Root `registry.json` with one placeholder `hello` item (`registry:ui`) for pipeline validation.
- `.github/workflows/deploy.yml` — pnpm install → `pnpm build` → `shadcn build` → `actions/deploy-pages@v4`.
- Custom domain `registry.016910804.xyz` wired (`CNAME` file + DNS).
- README.md + CONTRIBUTING.md stubs.

**Covers.** R1, R2, R10.4, R10.5.
**Depends on.** none.
**Exit.** `https://registry.016910804.xyz/r/hello.json` resolves; scratch app installs it successfully.

---

## Phase 2: Theme + tokens (`dgc-theme`)
**Goal.** DGC design tokens ship as a single `registry:theme` item. Every later component pulls it via `registryDependencies`.

**Scope.**
- HEX → HSL converter script (reads `project/colors_and_type.css`, emits `globals.css` snippets).
- `registry/dgc-theme/` — `globals.css` with scale tokens (`--blue-*`, `--space-N`, `--radius-*`, `--text-*`, `--shadow-*`) + shadcn semantic aliases (`--primary`, `--background`, `--foreground`, `--muted`, `--accent`, `--destructive`, `--ring`, `--border`, `--input`) for light + dark.
- `tailwind.config.ts` with `theme.extend` mapping Tailwind utilities to CSS vars.
- Khmer-first bilingual `fontFamily.sans` with Noto Sans Khmer / Kantumruy Pro / Battambang / Moul fallback.
- `.dark` class toggle (migrate away from `[data-theme="dark"]`).
- Docs page `/docs/foundations/tokens` rendering the palette + scales.

**Covers.** R3.
**Depends on.** Phase 1.
**Exit.** `npx shadcn add .../r/dgc-theme.json` in scratch app produces a `globals.css` that visually matches `project/preview/colors-*.html`.

---

## Phase 3: Primitives (14 items)
**Goal.** Every form control + atomic UI primitive shipped as `registry:ui`.

**Scope.**
- Button, Input, Textarea, Select, Checkbox, Radio, Switch, Label, Form (react-hook-form + zod), Badge, Tooltip, Tabs, Separator, ScrollArea.
- Each uses Radix primitives where applicable.
- Each ships with MDX docs page: installation, variants, props, bilingual example.
- Playground route `/preview/<item>` renders live variants.

**Covers.** R4, R9.1, R9.4.
**Depends on.** Phase 2.
**Exit.** All 14 items installable; axe check passes; Khmer `lang="km"` test page renders without clipping.

**Progress.**
- 🟢 **Plan 3-00 — Wave 0 infrastructure: COMPLETE** (2026-04-24). Playwright + Vitest + axe + items.manifest + `/preview/[item]` + `/test/khmer` + McxLayout + CI a11y gate. Commits `61f08be`, `654c928`, `5040e97`. See `phases/03-primitives/3-00-SUMMARY.md`.
- ⬜ Plans 3-01..3-14 — per-primitive (pending).
- ⬜ Plans 3-15..3-17 — docs pages, Khmer page fill-in, phase-exit smoke (pending).

---

## Phase 4: Headers + navigation
**Goal.** MiniApp-specific navigation chrome shipped as 5 `registry:ui` (AppHeader, SectionHeader, SegmentedTabs, StepIndicator, NavRow) + 3 `registry:block` (HeroBanner, SideDrawer, miniapp-home) — 8 items total. Hybrid composition API: top-level props for the 80% case + dot-namespace child slots; HeroBanner carousel is headless-controlled (consumer drives activeIndex).

**Scope.**
- AppHeader (3-slot navy, dot/count badges, 44px touch targets).
- HeroBanner (stippled pattern overlay + inner card + carousel dots).
- SectionHeader, SegmentedTabs, StepIndicator, NavRow.
- SideDrawer block (Radix Dialog slide-left, AppHeader reuse, profile block, legal footer).
- miniapp-home block — Phase 4 exit-gate dogfood composition (AppHeader + HeroBanner + SectionHeader + NavRow + 6-tile placeholder grid; HomeTile inline per D-17).

**Covers.** R5, R10.1, R10.2, R10.3, R10.5.
**Depends on.** Phase 3 (reuses Button, Tabs, Switch, Badge, ScrollArea, Tooltip).
**Plans:** 9 plans across 7 waves.

Plans:
- [x] 04-00-PLAN.md — Wave 0 infrastructure (add `@radix-ui/react-dialog`, append 9 tokens + 4 keyframes to `dgc-theme/theme.css`, scaffold per-item visual-diff harness with ΔRGB ≤ 2, env-driven smoke-consumer count).
- [x] 04-01-PLAN.md — `app-header` (R5.1) — 56px navy gradient, 3-slot grid, 44px icon-buttons, dot/count badges with navy border, white focus ring on navy.
- [x] 04-02-PLAN.md — `section-header` (R5.3) — title + accent action-link.
- [x] 04-03-PLAN.md — `nav-row` (R5.6) — 48px row, leading chip, label/caption, hybrid trailing (chevron/count built-in, switch via slot per D-05), active stripe full-row-height.
- [x] 04-04-PLAN.md — `segmented-tabs` (R5.4) — Radix Tabs imported directly (Pitfall 4), surface-2 track, brand-fill active, dual API (compound + array per D-08).
- [x] 04-05-PLAN.md — `step-indicator` (R5.5) — 28px numbered circles, 2px connector bars, 3 states, dual API (D-08), absolutely-positioned span connector (UI-SPEC Gap #4).
- [x] 04-06-PLAN.md — `hero-banner` (R5.2) — registry:block, headless-controlled carousel (D-10), token stipple (D-12), inert+aria-hidden inactive slides, 18×8 white pill active dot.
- [ ] 04-07-PLAN.md — `side-drawer` (R5.7) — registry:block, Radix Dialog wrapper with data-state animate-* keyframes, AppHeader cascade reuse (D-09).
- [ ] 04-08-PLAN.md — `miniapp-home` (Exit-gate composition) — registry:block, AppHeader + HeroBanner + 2× SectionHeader + 6 HomeTiles + 3 NavRows; HomeTile inline per D-17.
- [ ] 04-09-PLAN.md — Wave 6 finalize — bump `registry.json` to 0.4.0 with 8 new items, full smoke-consumer walk over 22 entries, visual-diff sweep, ROADMAP exit-gate edit (D-02).

**Exit.** Example MiniApp screen `/preview/miniapp-home` composes AppHeader + HeroBanner + tile-stub grid without manual glue. (Wave 6 plan 04-09 commits this exit-gate text edit per D-02.)

---

## Phase 5: Feedback + overlays
**Goal.** All feedback surfaces shipped.

**Scope.**
- Alert (4 kinds), Dialog, Sheet (BottomSheet variant), Toast (sonner), Empty, Skeleton, Spinner.
- Docs page per item with sample invocations.
- Government-tone examples baked into docs (no emoji, sentence case, no exclamations).

**Covers.** R6.
**Depends on.** Phase 3 (uses Button, Label).
**Exit.** Confirmation flow demo (`Dialog` + destructive `Button`) installable end-to-end.

---

## Phase 6: Data, lists, MiniApp blocks
**Goal.** Remaining list patterns + heavy composite blocks.

**Scope.**
- Data items: Table, InfoRow, DocumentListRow, TimestampTag, ServiceTile.
- Blocks: FileUploader (4 states), MinistryPicker, FormScreen layout, MobileFrame, ServiceGrid.

**Covers.** R7, R8.
**Depends on.** Phases 3–5 (blocks compose primitives + feedback).
**Exit.** `/preview/form-flow` renders a full FileUploader + MinistryPicker + FormScreen flow installed from the registry.

---

## Phase 7: Docs site polish + v1.0 launch
**Goal.** Launch-ready docs site at `registry.016910804.xyz`; tag v1.0.

**Scope.**
- Docs playground: live prop editor, dark mode + language toggle, mobile viewport constraint (reuse concept from `builder/`).
- Foundations pages: colors, type, space, radius, shadow, iconography, content tone (ported from `project/*.md` as MDX).
- Install instructions for each item with copy button.
- Consumer-install Playwright regression test: scratch Next.js app installs every item; CI blocks on failure.
- Contribution guide + PR template + CODEOWNERS.
- `meta.version: "1.0.0"` + git tag `v1.0.0`.
- Announcement stub for MiniApp teams.

**Covers.** R9, R10.1, R10.2, R10.3.
**Depends on.** Phases 1–6.
**Exit.** External MiniApp team can follow docs only and install any DGC component correctly on first attempt.

---

## Dependency graph

```
1 → 2 → 3 → 4 ─┐
            └→ 5 ─┤
                 └→ 6 ─→ 7
```

## Success criteria (repeat from PROJECT.md)
1. `npx shadcn@latest add https://registry.016910804.xyz/r/button.json` works for external consumers.
2. All 30+ existing specimens either ship as registry items or render as MDX docs.
3. Dark mode + Khmer `lang="km"` pass spot-check across every component.
4. CI auto-deploys on `main` push; broken `shadcn build` blocks merge.
5. Install docs exist per item with copy-pastable command.

## Open questions
- Migrate `builder/` editor into new repo or keep it separate? Lean toward **keep separate** — the editor is an internal tool, not a shadcn item. Revisit phase 7.
- Private-install story for internal-only experimental components? **Deferred to v2.** Phase 7 ships flat public.
- Icon set swap plan — stays on Lucide until DGC production set arrives. Swap is a v1.1 task.
- Should the new repo live at `dg-superapp/design-system` or `dg-superapp/ui`? Short name better. Confirm in Phase 1 kickoff.
