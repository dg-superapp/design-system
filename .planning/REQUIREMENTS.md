# Requirements — DGC MiniApp shadcn Registry

Scoped from `PROJECT.md` + research files. Each requirement has an ID, priority (P0/P1/P2), and acceptance criteria.

## R1 — Registry infrastructure (P0)
- **R1.1** Repo scaffolded as Next.js 15 App Router + Tailwind v4 + TypeScript + shadcn CLI; pnpm as package manager.
- **R1.2** `registry.json` at repo root lists all items with `$schema` set to shadcn current schema URL.
- **R1.3** `npx shadcn build` emits one JSON per item into `public/r/`.
- **R1.4** Smoke consumer test: scratch Next.js project can `npx shadcn@latest add http://localhost:3000/r/button.json` and compile successfully.

## R2 — GitHub Pages deployment (P0)
- **R2.1** GitHub Actions workflow (`.github/workflows/deploy.yml`) runs `pnpm install` → `pnpm build` → `shadcn build` → `actions/deploy-pages@v4` on every push to `main`.
- **R2.2** Pages deploy serves both the preview site (`/`) and registry JSON (`/r/*.json`) at the same origin.
- **R2.3** Custom domain `registry.016910804.xyz` wired via `CNAME` file + DNS.
- **R2.4** Broken `shadcn build` (invalid `registry-item.json`) fails CI, blocks merge.

## R3 — Theme + token export (P0)
- **R3.1** One `registry:theme` item named `dgc-theme` ships:
  - `cssVars.theme` — root tokens (`--blue-900`, `--space-4`, `--radius-md`, `--shadow-1`, `--text-body`, …) mirrored from `project/colors_and_type.css`.
  - `cssVars.light` + `cssVars.dark` — shadcn semantic aliases (`--primary`, `--background`, `--foreground`, `--muted`, `--accent`, `--destructive`, `--ring`, …) mapping into DGC scale tokens.
  - `tailwind.config.theme.extend` — color + spacing + radius + fontSize + fontFamily entries resolving `var(--token)`.
- **R3.2** HEX values from `colors_and_type.css` converted to HSL channel triplets (e.g. `#0D47A1` → `216 85% 34%`) for shadcn compatibility.
- **R3.3** Bilingual font stack declared as Tailwind `fontFamily.sans: ['Inter', 'Noto Sans Khmer', …]` so Khmer fallback inherits automatically.
- **R3.4** Dark mode uses `.dark` class on `<html>` (not `[data-theme="dark"]`); toggle documented.
- **R3.5** Installing any DGC item auto-pulls `dgc-theme` via `registryDependencies: ["dgc-theme"]`.

## R4 — Primitive components (P0)
All registered as `registry:ui`; land in consumer `components/ui/`. Each must support DGC visual spec + `lang="km"` Khmer rendering + focus ring + dark mode.

- **R4.1** Button — 4 variants (primary, secondary, ghost, ghost-danger), sizes (default/sm), icon slot, disabled state uses `--bg-disabled` + `--fg-on-disabled` (WCAG AA).
- **R4.2** Input (text, date) — 48px height, `--radius-md`, focus ring, required `*` indicator, placeholder format (`ថ្ងៃ/ខែ/ឆ្នាំ` for dates).
- **R4.3** Textarea — min-height 88px, resizable, same border/radius/focus rules.
- **R4.4** Select — Radix primitive, same visual spec as Input.
- **R4.5** Checkbox — Radix, custom check glyph; 18px box; selected = `--accent` fill.
- **R4.6** Radio — Radix group; 999px circle; selected dot uses white on `--accent`.
- **R4.7** Switch — Radix, track 40×24, thumb 18px, `--accent` track when on.
- **R4.8** Label — `--text-body-sm` + `--weight-medium`; required asterisk color `--red-600`.
- **R4.9** Form — react-hook-form + zod wrapper (shadcn-standard), with error message styling using `--danger`.
- **R4.10** Badge — 4 tones (default, success, warning, danger) using paired `*-bg` + semantic fg.
- **R4.11** Tooltip — Radix, `--gray-900` bg, `--radius-sm`, `--text-caption`.
- **R4.12** Tabs — Radix, static-specimen-compatible with optional active state.
- **R4.13** Separator — Radix, `1px solid var(--border)`.
- **R4.14** ScrollArea — Radix, for drawer / sheet content.

## R5 — MiniApp headers + navigation (P0)
- **R5.1** AppHeader — 56px navy gradient (`--gradient-hero`), 3-slot grid (left 56px / center 1fr / right 56px or 96px), icon buttons 44px touch target with 22px glyphs in white. Supports dot + count badges with navy border.
- **R5.2** HeroBanner — rounded `--radius-lg`, stippled dot pattern overlay, optional inner rounded card, carousel dots (3 visible, active = white 18px pill).
- **R5.3** SectionHeader — title + optional link action in `--accent`.
- **R5.4** SegmentedTabs — pill group, `--bg-surface-2` track, active = `--accent` fill + white text.
- **R5.5** StepIndicator — numbered circles (28px) with connecting bars; done / active / pending states.
- **R5.6** NavRow — 48px min-height, leading 24px icon chip + label (+ optional caption) + trailing (chevron / badge / switch / toggle). Active state: `--blue-050` bg + 3px `--accent` leading stripe.
- **R5.7** SideDrawer — Radix Dialog slide-left, 82% width ≤ 340px, reuses AppHeader with X close, optional profile block, scrollable nav list, legal footer.

## R6 — Feedback + overlays (P0)
- **R6.1** Alert — 4 kinds (info, success, warning, danger) with matching `*-bg` + semantic text + icon slot.
- **R6.2** Dialog — Radix; center modal with `--radius-lg` + `--shadow-3`; scrim uses `--bg-overlay`.
- **R6.3** Sheet / BottomSheet — Radix Dialog slide-up variant, 4px drag handle, top corners `--radius-lg`.
- **R6.4** Toast — `sonner` integration, positioned top; government tone (no emoji).
- **R6.5** Empty — 40px+ padding, outline icon `--fg-3`, title + body.
- **R6.6** Skeleton + Spinner — shared shimmer animation with `--ease-standard`.

## R7 — Data + lists (P1)
- **R7.1** Table — `<table class="tbl">`-style; th with uppercase label `--fg-2`; responsive wrapper for mobile overflow.
- **R7.2** InfoRow — label-left, value-right, 1px divider.
- **R7.3** DocumentListRow — 40px chip + title + sub + trailing badge/chevron.
- **R7.4** TimestampTag — pill with clock/calendar icon + relative time.
- **R7.5** ServiceTile — 56px gradient art slot + 2-line label. Variants: blue, magenta, green, amber, purple, red gradients.

## R8 — MiniApp blocks (P0)
Registered as `registry:block` (composite flows).
- **R8.1** FileUploader — 4 states (empty, uploading w/ progress bar, uploaded, error); type chip color per file type (PDF red, image blue, doc amber).
- **R8.2** MinistryPicker — sheet-style multi-select, 2-col tile grid, seal + Khmer name + corner checkbox, footer count in Khmer numerals + Later/Done CTAs.
- **R8.3** FormScreen — layout block: HeroBanner-as-header + step indicator + vertical field stack + sticky bottom CTA bar.
- **R8.4** MobileFrame — 390×780 phone frame for previews (also used in docs site).
- **R8.5** ServiceGrid — 4-column mobile / responsive grid of ServiceTile items.

## R9 — Docs site (P1)
- **R9.1** MDX docs page per item with: installation command, props table, variants gallery, usage example, Khmer bilingual sample.
- **R9.2** Playground: live-edit props, theme toggle, language toggle, mobile viewport constraint.
- **R9.3** Specimens that are NOT registry items (color palette, type scale, iconography, tone guide) render as docs pages under `/docs/foundations/*`.
- **R9.4** Install command copy-button on every item page.

## R10 — Non-functional (P0)
- **R10.1** All components pass axe-core accessibility checks (automated in CI).
- **R10.2** Playwright smoke test for registry: install each item into a scratch app, verify compile.
- **R10.3** Keyboard navigation works for every interactive component (Tab, Shift+Tab, Enter, Space, Esc).
- **R10.4** Prettier + ESLint configured; CI fails on lint errors.
- **R10.5** README.md at repo root + CONTRIBUTING.md explaining how to add new items.

## Out of scope (explicit)
- SuperApp chrome (MiniHeader host variant, bottom tab bar, status bar).
- Builder app port (stays as internal tool in current repo).
- Production DGC icon set (continues with Lucide substitute).
- Bearer-auth private registry, `/v1/` versioning (v2).
- npm package publishing (registry is the distribution mechanism).
