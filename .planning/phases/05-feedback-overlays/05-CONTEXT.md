# Phase 5: Feedback + overlays - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship MiniApp feedback + overlay surfaces as **8 registry items**: 7 `registry:ui` (alert, dialog, alert-dialog, sheet, toast, empty, skeleton, spinner — wait, 8 ui, no blocks). Final list:

1. `alert` — `registry:ui` — 4 kinds (info, success, warning, danger), inline block
2. `dialog` — `registry:ui` — Radix Dialog general modal
3. `alert-dialog` — `registry:ui` — Radix AlertDialog confirmation modal
4. `sheet` — `registry:ui` — Radix Dialog slide-up bottom variant only
5. `toast` — `registry:ui` — sonner Toaster + helper re-export
6. `empty` — `registry:ui` — empty-state placeholder
7. `skeleton` — `registry:ui` — loading-shape placeholder + `Skeleton.Text` preset
8. `spinner` — `registry:ui` — Lucide Loader2 + `dgc-spin` animation

**Exit gate:** confirmation flow demo (`AlertDialog` + destructive `Button`) installable end-to-end. The dogfood preview route at `src/app/preview/alert-dialog/page.tsx` renders a "Delete request?" pattern using `alert-dialog` + Phase 3 `button` (destructive variant) installed via the shadcn CLI. Manifest count goes 22 (post-Phase-4) → 30 (post-Phase-5); EXACT-count assertion enforced per Phase 4 ISSUE-04.

**Scope intentionally excludes:** ServiceTile / ServiceGrid / FileUploader / MinistryPicker / FormScreen / MobileFrame (Phase 6); Table / InfoRow / DocumentListRow / TimestampTag (Phase 6); docs-site polish beyond per-item pages (Phase 7); useCarousel (deferred from Phase 4 D-10); production DGC icon set swap (deferred until DGC ships icons).

</domain>

<decisions>
## Implementation Decisions

### Item split & exit gate
- **D-01:** Ship **8 registry items**: alert, dialog, alert-dialog, sheet, toast, empty, skeleton, spinner. All `registry:ui`. No `registry:block` items this phase. Single-file dot-namespace exports per Phase 3 D-05 / Phase 4 D-03.
- **D-02:** Dialog and AlertDialog ship as **two separate items** (shadcn canonical). Different ARIA roles (`role="dialog"` vs `role="alertdialog"`), different focus-trap semantics, different default behaviors (AlertDialog forces user choice; Dialog allows backdrop dismiss). New dep: `@radix-ui/react-alert-dialog ^1.1.x` (added in Wave 0). Existing `@radix-ui/react-dialog ^1.1.15` (from Phase 4) covers Dialog + Sheet.
- **D-03:** Skeleton and Spinner ship as **two separate items**, not bundled. Granular install per shadcn convention. Both reference `@dgc-pulse` / `@dgc-spin` keyframes from `dgc-theme/theme.css` (added Wave 0 — see D-09).
- **D-04:** Sheet ships **`side="bottom"` only** for v1. BottomSheet is the recommended default. Drag handle (4px, top-center) per R6.3. Top corners `--radius-lg`. Other sides (top/left/right) deferred — left would overlap Phase 4 SideDrawer; top/right have no concrete use case today.
- **D-05:** Exit-gate confirmation flow uses `alert-dialog` + Phase 3 `button` `variant="ghost-danger"` (R4.1). The dogfood route demonstrates Cancel + Delete buttons; AlertDialog handles focus trap and ESC. Wave 6 atomic-finalize commit (per Phase 4 ISSUE-01) ships manifest entries + renderer barrel re-exports for all 8 items in a single commit; EXACT-count assertion (`SMOKE_EXPECTED_COUNT=30`) enforced in Wave 0.

### Composition API (carries forward Phase 4 D-06 hybrid)
- **D-06:** All compound items (`alert`, `dialog`, `alert-dialog`, `sheet`, `empty`, `skeleton`) use **hybrid composition**: top-level prop for the 80% case + dot-namespace child slots for full control.
  - `<Alert kind="warning" title="Heads up" body="Your session expires in 2 minutes."/>` (sugar)
  - `<Alert kind="warning"><Alert.Icon/><Alert.Title>...</Alert.Title><Alert.Body>...</Alert.Body><Alert.Action>...</Alert.Action></Alert>` (escape hatch)
  - Same pattern for Dialog (`title` + `description` + `<Dialog.Header/Body/Footer>`), AlertDialog, Sheet, Empty (`title` + `body` + `<Empty.Icon/Action>`).
- **D-07:** `Skeleton` ships **canonical primitive + one preset** (Phase 4 D-08 dual-API precedent):
  - Primitive: `<Skeleton className="h-4 w-32"/>` — Tailwind utility-driven sizing (shadcn canonical).
  - Preset: `<Skeleton.Text lines={3}/>` — paragraph placeholder with descending widths (100%, 100%, 60%). Internally renders 3 `<Skeleton/>` elements.
- **D-08:** `Spinner` is API-minimal: `<Spinner size="sm|md|lg"/>` (md default = 20px). Sizes map to Lucide `size` prop: sm=16, md=20, lg=24. Optional `label` prop adds `aria-label` (default `"Loading"`). No top-level dot-namespace children — too small to compose.

### Animation
- **D-09:** Add **two keyframes** to `registry/dgc-theme/theme.css` in Wave 0 (alongside Phase 4's 4 existing keyframes):
  ```css
  @keyframes dgc-pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
  @keyframes dgc-spin  { to { transform: rotate(360deg) } }
  ```
  Skeleton uses `animation: dgc-pulse 1.5s var(--ease-standard) infinite`. Spinner wraps Lucide `Loader2` with `animation: dgc-spin 0.8s linear infinite` (constant rotation, no easing). Both keyframes documented on the dgc-theme docs page; drift-check script extended to assert their presence (Phase 2 precedent: 39 light + 39 dark vars; now 41 light + 41 dark + 6 keyframes).
- **D-10:** Skeleton color uses `bg-[var(--bg-surface-2)]` (already in theme.css). No new color tokens. Dark mode flips automatically per Phase 3 D-06.

### Toast (sonner integration)
- **D-11:** Single `toast` registry item exports **both** `<Toaster/>` (DGC-themed wrapper around sonner's `Toaster`) **and** re-exports sonner's `toast` helper. Consumer mounts `<Toaster/>` once in `app/layout.tsx`; calls `toast.success("Saved")` anywhere. Adds `sonner ^1.x` dep (latest stable; researcher confirms version).
- **D-12:** Toaster preconfigured: `position="top-center"`, `duration={4000}`, `richColors={false}` (we use our own iconMap + DGC tokens, not sonner's built-in colored variants), `closeButton={false}` (auto-dismiss), `toastOptions={{ classNames: {...} }}` mapping sonner CSS hooks to `--bg-surface-2` / `--shadow-3` / `--radius-lg`.
- **D-13:** Icon override map (PROJECT no-emoji constraint): info=`Info`, success=`CheckCircle2`, warning=`AlertTriangle`, danger=`XCircle` (Lucide). Wired via sonner's `icons` prop on `<Toaster/>`. Exported as `toastIconMap` for consumer override (DGC icon swap path per Phase 4 D-14).
- **D-14:** Expose **all sonner methods**: `toast(msg)`, `toast.success`, `toast.warning`, `toast.error`, `toast.info`, `toast.loading`, `toast.promise`, `toast.dismiss`. Docs page covers each with bilingual (Khmer + English) examples. `toast.error` ↔ R6.1 `danger` semantic mapping documented (sonner uses "error", we keep the alias for sonner-fluent consumers).

### Item-specific
- **D-15:** Alert `kind` prop drives CVA variants over 4 token pairs: `--info-bg`/`--info`, `--success-bg`/`--success`, `--warning-bg`/`--warning`, `--danger-bg`/`--danger`. Default Lucide icon per kind matches D-13 toast iconMap exactly (consistent visual language across feedback surfaces). Alert is **inline-only for v1** (no full-bleed banner variant, no auto-dismiss, no dismiss button by default — opt-in via `<Alert.Close/>` slot). Visual-diff target: `dgc-miniapp-design-system/project/preview/alerts.html`.
- **D-16:** Dialog uses `--shadow-3` elevation, `--radius-lg`, scrim `--bg-overlay` (R6.2). Default size: max-width `min(440px, 90vw)`, vertical center. Compound parts: `<Dialog.Header/>` (title + description), `<Dialog.Body/>` (content), `<Dialog.Footer/>` (actions, right-aligned). Visual-diff target: `dgc-miniapp-design-system/project/preview/modal.html`.
- **D-17:** AlertDialog mirrors Dialog visually but compound parts force confirmation semantics: `<AlertDialog.Title/>`, `<AlertDialog.Description/>`, `<AlertDialog.Cancel/>` (Phase 3 button `variant="secondary"`), `<AlertDialog.Action/>` (consumer chooses `variant="primary"` or `variant="ghost-danger"`). No backdrop dismiss (Radix AlertDialog default). No legacy specimen — researcher uses Dialog visual + shadcn AlertDialog baseline.
- **D-18:** Sheet uses `@radix-ui/react-dialog` (already installed Phase 4) with `data-side="bottom"` styling. Drag handle is a 32×4px `--bg-surface-3` pill 8px from top, centered. No swipe-to-dismiss for v1 (would need gesture lib; deferred). ESC + backdrop click dismiss enabled. Top corners `--radius-lg`, slide-up via Phase 4 keyframe `slideInFromBottom` if present (researcher confirms; otherwise add).
- **D-19:** Empty: 40px+ padding (`p-10` = 40px), outline icon `--fg-3` color, default Lucide icon `Inbox` (most generic; consumer overrides via `icon` prop). Title `--text-body` + `--weight-medium`. Body `--text-body-sm` + `--fg-2`. Optional `<Empty.Action/>` slot for retry/CTA button. Visual-diff target: `dgc-miniapp-design-system/project/preview/empty-state.html`.

### Testing & gates (carries forward Phase 3 + 4 patterns)
- **D-20:** Wave 0 (infrastructure) ships: (a) `@radix-ui/react-alert-dialog` + `sonner` deps installed, (b) 2 keyframes added to `theme.css`, (c) `SMOKE_EXPECTED_COUNT` env bumped from 22 to 30 (>= semantics; EXACT-count assertion runs in Wave 6 finalize), (d) `scripts/visual-diff.mjs` baseline list extended with the 3 items that have legacy specimens (alert, dialog, empty). Items without legacy specimens (alert-dialog, sheet, toast, skeleton, spinner) skip the visual-diff gate but MUST pass axe + Khmer + smoke-consumer.
- **D-21:** Each item ships its own `/preview/<item>` route via `items.manifest.ts` append + `renderers/index.ts` barrel re-export (Phase 4 D-09 cascade pattern). Renderer pattern: layout-heavy items (dialog, alert-dialog, sheet, toast, empty) need a `<Demo>` mode in `PlaygroundShell` (Phase 4 Claude's Discretion: extend PlaygroundShell with demo-mode hatch — implement in Wave 0). Skeleton + spinner work with controls-only.
- **D-22:** Atomic finalize commit (Wave 6) covers all 8 manifest entries + 8 renderer barrel re-exports + `meta.version` bump (`0.4.0` → `0.5.0` per Phase 2/3/4 minor-bump-per-phase precedent) in a SINGLE commit. EXACT-count assertion verifies manifest has exactly 30 entries; no baseline-drift escape hatch (Phase 4 ISSUE-04 lesson).

### Government tone (PROJECT constraint, sets precedent for Phase 6)
- **D-23:** All default props, examples, docs strings use sentence case, no exclamation marks, no emoji. Examples that ship verbatim in docs:
  - Alert info: `"Your session is about to expire"`
  - Alert success: `"Document submitted for review"`
  - Alert warning: `"Connection unstable"`
  - Alert danger: `"Submission failed. Try again."`
  - Dialog title: `"Confirm submission"` / body: `"Your application will be sent to the Ministry of Interior."`
  - AlertDialog: `"Delete request?"` / `"This action cannot be undone."`
  - Toast: `"Saved"` / `"File uploaded"` / `"Network error"`
  - Empty: `"No requests yet"` / `"You haven't submitted any applications."`
  Khmer parallel strings provided in docs but not as defaults — defaults are English (consumer translates).

### Claude's Discretion
- Exact CSS keyframe values for `dgc-pulse` (current pick: `0%,100% { opacity:1 } 50% { opacity:0.5 }` — alternative: light-grey gradient sweep). Researcher picks; both pass dark-mode token cascade.
- Sonner version pin (`^1.4.x` vs latest stable). Researcher checks current and pins via `dependencies` in `registry-item.json`.
- AlertDialog focus-on-open target — Radix default focuses Cancel; we may switch to first focusable in `<AlertDialog.Body/>` if it has a form. Document the override pattern.
- Whether `<Alert.Close/>` slot uses Phase 3 `button` `variant="ghost"` `size="icon"` or a bare `<X/>` Lucide icon — both work; prefer button for keyboard ergonomics.
- Sheet drag handle visual exact dimensions within R6.3 spec (4px height, top corners).
- PlaygroundShell `<Demo>` mode prop name — `demo`, `customRender`, `mode="demo"` — Claude picks consistent naming.
- Whether Toast's iconMap is a top-level export (`import { toastIconMap }`) or attached to the toast namespace (`toast.iconMap`). Prefer top-level export for tree-shaking.
- `Spinner` `aria-label` localization — default "Loading" English; doc override pattern for Khmer (`label="កំពុងផ្ទុក"`).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase inputs (target repo `D:/sources/dgc-miniapp-shadcn/`)
- `.planning/ROADMAP.md` §"Phase 5 — Feedback + overlays" — goal, scope, exit gate (note: roadmap uses em-dash heading; gsd-tools requires `## Phase N:` colon — durable fix deferred per Phase 4 deferred ideas)
- `.planning/REQUIREMENTS.md` §R6 (R6.1–R6.6) — per-item acceptance criteria
- `.planning/REQUIREMENTS.md` §R10 (R10.1, R10.3) — axe + keyboard navigation gates
- `.planning/PROJECT.md` §Constraints (Khmer-first, WCAG AA, no emoji, government tone) + §"Success criteria"
- `.planning/STATE.md` §"Decisions on record" — stack, distribution, dark-mode, Lucide placeholder

### Visual source of truth (read before implementing each item)
- `D:/sources/dgc-miniapp-design-system/project/preview/alerts.html` — Alert R6.1 (4 kinds, icon left, title + body)
- `D:/sources/dgc-miniapp-design-system/project/preview/modal.html` — Dialog R6.2 (radius-lg, shadow-3, scrim)
- `D:/sources/dgc-miniapp-design-system/project/preview/empty-state.html` — Empty R6.5 (padding, outline icon, title + body)
- **No legacy specimen** for AlertDialog, Sheet, Toast, Skeleton, Spinner — researcher uses shadcn canonical baselines + DGC token application; visual-diff gate skipped for these (axe + Khmer + smoke-consumer still required)

### Phase 2 outputs (upstream — in target repo)
- `D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/theme.css` — semantic tokens (`--info`, `--success`, `--warning`, `--danger` + `*-bg`, `--bg-overlay`, `--shadow-3`, `--radius-lg`, `--ease-standard`, `--bg-surface-2`/`-3`, `--fg-2`/`-3`) — all confirmed present; Phase 5 adds 2 keyframes (`dgc-pulse`, `dgc-spin`) per D-09
- `D:/sources/dgc-miniapp-shadcn/tailwind.config.ts` (or `.mjs`) — Tailwind v4 utility ↔ token mapping

### Phase 3 outputs (upstream — in target repo)
- `D:/sources/dgc-miniapp-shadcn/registry/button/button.tsx` — variants `primary` / `secondary` / `ghost` / `ghost-danger` (R4.1); Cancel + destructive Action in AlertDialog
- `D:/sources/dgc-miniapp-shadcn/registry/label/label.tsx` — Empty title styling reference
- `D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts` — append 8 entries (Phase 3 D-11/12 `ManifestEntry` shape)
- `D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/page.tsx` — `generateStaticParams` enumerates manifest
- `D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/PlaygroundShell.tsx` — extend with demo-mode escape hatch in Wave 0 (D-21)
- `D:/sources/dgc-miniapp-shadcn/src/app/preview/[item]/renderers/index.ts` — barrel re-export pattern (Phase 4 D-09)

### Phase 4 outputs (upstream — in target repo)
- `D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/theme.css` — Phase 4 added 9 tokens + 4 keyframes; Phase 5 extends with 2 keyframes
- `@radix-ui/react-dialog ^1.1.15` (in `package.json`) — Dialog + Sheet share this dep; AlertDialog needs separate `@radix-ui/react-alert-dialog`
- `D:/sources/dgc-miniapp-shadcn/scripts/visual-diff.mjs` — Playwright visual-diff harness (extend baseline list with alert, dialog, empty)
- `D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs` — extend with `SMOKE_WITH_FEEDBACK=1` mode covering all 8 Phase 5 items
- `SMOKE_EXPECTED_COUNT` env in `package.json` test:visual script — bump default 22 → 30 in Wave 0

### Prior CONTEXT (carry forward in full)
- `.planning/phases/03-primitives/3-CONTEXT.md` — D-01 (CVA), D-02 (CSS vars), D-05 (single-file dot-namespace), D-06 (no `dark:*`), D-07/08 (`:lang(km)` cascade + `/test/khmer`), D-11/12 (manifest pattern), D-14/15 (registryDependencies cascade + lucide-react), D-16 (axe), D-19 (smoke-consumer extension)
- `.planning/phases/04-headers-navigation/04-CONTEXT.md` — D-03 (single file per parent), D-06 (hybrid composition top-level prop + dot-namespace), D-08 (dual-API: compound + data-array), D-14 (icon ReactNode slots, Lucide default, swappable), D-16 (lucide-react cascade)
- `.planning/phases/04-headers-navigation/04-09-SUMMARY.md` — atomic finalize pattern (ISSUE-01) + EXACT-count assertion (ISSUE-04) — apply both to Wave 6 finalize

### Research refs (target repo `.planning/`)
- `.planning/research/shadcn-registry.md` — registry JSON schema rules
- `.planning/research/port-strategy.md` — migration patterns (legacy specimen → registry item)
- `.planning/codebase/CONVENTIONS.md` — code conventions (read first)
- `.planning/codebase/STRUCTURE.md` — repo layout
- `.planning/codebase/STACK.md` — stack confirmation (Next.js 15, React 19, Tailwind v4, pnpm)
- `.planning/codebase/TESTING.md` — Playwright + axe + smoke-consumer patterns

### External specs (fetch via WebFetch / mcp__context7)
- https://ui.shadcn.com/docs/registry — registry JSON schema (current version)
- https://ui.shadcn.com/docs/components/alert — shadcn baseline for Alert
- https://ui.shadcn.com/docs/components/dialog — shadcn baseline for Dialog
- https://ui.shadcn.com/docs/components/alert-dialog — shadcn baseline for AlertDialog (confirms two-item split is canonical)
- https://ui.shadcn.com/docs/components/sheet — shadcn baseline for Sheet (we use bottom-only subset)
- https://ui.shadcn.com/docs/components/sonner — shadcn sonner integration recipe
- https://ui.shadcn.com/docs/components/skeleton — shadcn baseline for Skeleton
- https://www.radix-ui.com/primitives/docs/components/dialog — Dialog API (focus mgmt, portal, ESC)
- https://www.radix-ui.com/primitives/docs/components/alert-dialog — AlertDialog API (forced choice semantics)
- https://sonner.emilkowal.ski/ — sonner full docs (`<Toaster/>` props, `toast` methods, `icons` override)
- https://lucide.dev/icons — Lucide (Info, CheckCircle2, AlertTriangle, XCircle, Inbox, Loader2)
- https://github.com/dequelabs/axe-core/tree/develop/packages/playwright — `@axe-core/playwright` for CI a11y gate

### Non-functional gates (R10 — apply to every item)
- Khmer (`lang="km"`) renders correctly with bilingual font stack — `/test/khmer` page
- `.dark` class theme switch works without style breakage
- Touch targets ≥ 44px for interactive elements (AlertDialog buttons, Sheet drag handle = visual-only, not touch target — close via backdrop tap)
- A11y: roles + ARIA confirmed via `axe-core` Playwright run; AlertDialog `role="alertdialog"` enforced
- Keyboard navigation: Tab / Shift+Tab cycles inside Dialog/AlertDialog/Sheet focus trap; ESC closes Dialog/Sheet (NOT AlertDialog by default — Radix behavior)
- RTL not required (Khmer is LTR per PROJECT)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets (Phase 1–4 outputs in target repo)
- **`dgc-theme` semantic tokens** — `--info/success/warning/danger` + `*-bg`, `--bg-overlay`, `--shadow-3`, `--radius-lg`, `--ease-standard`, `--bg-surface-2/-3`, `--fg-2/-3` all live in `theme.css`. Zero new color tokens needed; only 2 new keyframes.
- **Phase 3 `button`** — `variant="ghost-danger"` for AlertDialog destructive Action; `variant="secondary"` for Cancel; `variant="ghost"` `size="icon"` for optional Alert close + Sheet close
- **Phase 3 `label`** — Empty title typography reference (consistent type ramp)
- **`@radix-ui/react-dialog ^1.1.15`** — already installed Phase 4; reused by Dialog + Sheet (no new install)
- **`registry/items.manifest.ts`** — `ManifestEntry` + `PropControl` shape (Phase 3 D-11/12); append 8 entries
- **`src/app/preview/[item]/{page.tsx, PlaygroundShell.tsx, renderers/index.ts}`** — playground harness; PlaygroundShell needs `<Demo>` mode escape hatch added in Wave 0 for layout-heavy items (Phase 4 Claude's Discretion item finally implemented)
- **`scripts/visual-diff.mjs`** — Playwright ΔRGB ≤ 2 vs legacy specimens (Phase 2 precedent); extend baseline list with alert + dialog + empty (3 items have legacy specimens)
- **`scripts/smoke-consumer.mjs`** — extend with `SMOKE_WITH_FEEDBACK=1` walking the 8 new manifest entries; existing top-level entry regex from Phase 3 commit `5b4ebdc` requires no schema change

### Established patterns (continue applying)
- **Token pipeline:** Tailwind v4 `@theme` block; components write `bg-info-bg`, `text-info`, `bg-[var(--bg-overlay)]` — never raw hex
- **Registry build:** `npx shadcn build` compiles `registry.json` + `registry/<item>/*` → `public/r/<name>.json`. 8 new entries → 8 new `registry/<item>/` folders + 8 `registry-item.json` files + root `registry.json` items array updated
- **Item layout:** `registry/<name>/<name>.tsx` (single file dot-namespace exports) + `registry/<name>/registry-item.json` (per-item metadata)
- **Manifest registration:** every plan appends one `ManifestEntry` to `registry/items.manifest.ts`
- **Renderer barrel:** every plan appends import + map entry to `src/app/preview/[item]/renderers/index.ts` (Phase 4 D-09)
- **Atomic finalize (Phase 4 ISSUE-01):** Wave 6 commits manifest + renderer barrel changes for all 8 items in ONE commit; per-task waves stage code only (registry/<item>/*, docs MDX, playground renderer module)
- **EXACT-count assertion (Phase 4 ISSUE-04):** Wave 0 sets `SMOKE_EXPECTED_COUNT=30`; Wave 6 verifies manifest has exactly 30 entries; no baseline-drift escape hatch
- **Docs page:** MDX at `/docs/components/<docs-slug>` with copy-pastable `npx shadcn add` command
- **Playground:** `/preview/<item-slug>` rendered via `PlaygroundShell` — controls drive prop knobs; layout items use Demo mode (new Wave 0)
- **CI deploy:** push `main` → GitHub Actions → GitHub Pages at `registry.016910804.xyz`. CI gates: typecheck, unit, build, drift-check (now incl. 2 new keyframes), a11y, smoke-consumer (`SMOKE_WITH_FEEDBACK=1`)

### Integration points
- Append 8 entries to `registry/items.manifest.ts` (Phase 3 D-11)
- Append 8 imports + 8 map entries to `src/app/preview/[item]/renderers/index.ts` (Phase 4 D-09) — atomic finalize Wave 6
- Append 8 item objects to root `registry.json` and bump `meta.version` `0.4.0` → `0.5.0`
- Add 3 items (alert, dialog, empty) to `scripts/visual-diff.mjs` baseline list
- Bump `SMOKE_EXPECTED_COUNT` env default 22 → 30 in `package.json` test:visual script + smoke-consumer
- Mount `<Toaster/>` example in docs root layout for the docs-site dogfood path (cosmetic — not a registry deliverable)
- New deps: `@radix-ui/react-alert-dialog ^1.1.x`, `sonner ^1.x` (researcher pins exact versions)

</code_context>

<specifics>
## Specific Ideas

- **Confirmation flow as the exit-gate dogfood route** — `/preview/alert-dialog` should render a "Delete request?" pattern complete with Cancel + Delete buttons (`variant="ghost-danger"`), proving that AlertDialog + Phase 3 Button install end-to-end. This is the primary R6 + R10 exit proof. Researcher must confirm Phase 3 Button's `ghost-danger` variant emits the correct `--red-600` semantic.
- **Toast iconMap as the icon-swap precedent** — when DGC ships production icons later (PROJECT constraint), `toastIconMap` is the first thing that gets swapped. Document this in the toast docs page so the swap path is obvious.
- **Skeleton shimmer = `dgc-pulse`** (opacity-only). Considered light-grey gradient sweep but rejected: requires extra CSS background-image complexity and breaks dark mode without per-mode tokens. Opacity pulse is dark-mode-safe by default.
- **Spinner uses Lucide Loader2 not custom SVG** — keeps Phase 4 D-14 icon abstraction layer pristine. When DGC icons land, swapping `Loader2` → DGC equivalent is a one-line change.
- **Sheet bottom-only is a v1 minimum** — left handled by Phase 4 SideDrawer; top/right have no current design need. If Phase 6/7 surfaces a need (filter sheet, action sheet from top), expand the API then via additive `side` prop values. No breaking change risk: prop didn't exist in v1.
- **Government tone defaults set the precedent for Phase 6** — every default string in Phase 5 (Alert kind defaults, Dialog title placeholders, Toast example messages, Empty body copy) follows sentence case + no exclamations + no emoji. Phase 6 FileUploader/MinistryPicker copy will follow the same template.
- **PlaygroundShell `<Demo>` mode** — finally implements the Phase 4 Claude's Discretion item. Layout-heavy items pass a `demo` prop to renderer; PlaygroundShell falls back to `<Demo/>` rendering when `controls={[]}`. Pattern unblocks Phase 6 FormScreen / MobileFrame too.

</specifics>

<deferred>
## Deferred Ideas

- **Sheet `side="top" | "left" | "right"`** — add when concrete use case appears. Left would overlap Phase 4 SideDrawer; top/right have no current design.
- **Sheet swipe-to-dismiss gesture** — needs a gesture lib (react-use-gesture or framer-motion). Defer to Phase 7 polish if real demand.
- **Toast custom JSX content** — sonner supports it natively (`toast.custom(t => <div>...</div>)`). Documented but no first-class wrapper in v1.
- **Alert auto-dismiss + dismiss button defaults** — opt-in via `<Alert.Close/>` slot for v1; if usage shows always-dismissable is the norm, promote to top-level `dismissable` prop in Phase 7.
- **Alert banner (full-bleed) variant** — would need a `width="full"` prop; defer until concrete use case.
- **Skeleton shape variants** (`circle`, `rectangle` presets) — Tailwind `rounded-full` covers circle; YAGNI for v1.
- **Spinner `xs (12px) | xl (32px)`** — add if real consumer demand surfaces; sm/md/lg covers 95% of cases.
- **Production DGC icon set swap** — v1.1 / when DGC icons delivered (PROJECT). `toastIconMap` is the first swap target.
- **`useCarousel` hook** — Phase 4 deferred; still deferred.
- **Bearer-auth private registry, `/v1/` versioning** — v2 (STATE).
- **npm package publishing** — explicitly out of scope (REQUIREMENTS §Out of scope).
- **RTL support** — out of scope (Khmer is LTR; PROJECT).
- **Roadmap regex compatibility fix** — `## Phase N — ` em-dash vs `## Phase N:` colon — still a gsd-tools workaround. One-line ROADMAP heading edit deferred (carried over from Phase 4 deferred).
- **`<NavRow.Link href>` Next.js adapter** — Phase 4 deferred; not Phase 5 scope.

### Reviewed Todos (not folded)
- None — `gsd-tools todo match-phase 5` returned 0 matches.

</deferred>

---

*Phase: 05-feedback-overlays*
*Context gathered: 2026-04-27*
