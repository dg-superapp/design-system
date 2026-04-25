---
phase: 4
slug: headers-navigation
status: approved
shadcn_initialized: true
preset: dgc-theme (style="new-york", baseColor=neutral, cssVariables=true)
created: 2026-04-25
reviewed_at: 2026-04-25
---

# Phase 4 — UI Design Contract

> Visual and interaction contract for the MiniApp navigation chrome. Eight registry items: 5 `registry:ui` (`app-header`, `section-header`, `segmented-tabs`, `step-indicator`, `nav-row`) + 3 `registry:block` (`hero-banner`, `side-drawer`, `miniapp-home`).
>
> Pre-populated from `04-CONTEXT.md` (17 locked decisions), `REQUIREMENTS.md §R5/§R10`, `3-CONTEXT.md` (15 carry-forward decisions), `registry/dgc-theme/theme.css` (token catalog), `registry/items.manifest.ts` (Phase 3 entries reused).

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn (initialised; `components.json` style="new-york", baseColor=neutral, cssVariables=true) |
| Preset | `dgc-theme` registry item shipped at `https://registry.016910804.xyz/r/dgc-theme.json` (Phase 2). Every Phase 4 item declares `registryDependencies: [".../r/dgc-theme.json"]` to cascade-install |
| Component library | Radix Primitives (Dialog for SideDrawer, Tabs for SegmentedTabs — reuses Phase 3 `tabs` item) |
| Icon library | `lucide-react` (placeholder per STATE; ReactNode slot pattern D-14 keeps swap path clean for production DGC icons) |
| Font | Bilingual stack via `--font-sans: var(--font-latin), var(--font-khmer), system-ui, sans-serif`. Latin = Inter 400/500/600/700; Khmer = Noto Sans Khmer / Kantumruy Pro / Battambang. `:lang(km)` cascade applies `line-height: var(--leading-loose)` (1.6) automatically — no per-component branching (3-CONTEXT D-07) |

**Style hard rules carried forward (Phase 3 D-02/D-06):**
- Components consume CSS vars via Tailwind utilities only (`bg-primary`, `text-foreground`, `bg-[var(--blue-050)]`). NEVER raw hex.
- NEVER `dark:*` Tailwind utilities. Dark mode flips at the token layer in `dgc-theme/theme.css` under `.dark`.
- Single-file dot-namespace exports per parent (`app-header.tsx` exports `AppHeader, AppHeader.Title, AppHeader.Leading, AppHeader.Trailing`). No sub-part registry items.
- `lang="km"` Khmer test page renders every item without clipping (3-CONTEXT D-07/D-08, R10).

---

## Spacing Scale

Declared values (DGC `--space-*` tokens in `theme.css`; multiples of 4):

| Token | Value | Usage in this phase |
|-------|-------|---------------------|
| `--space-1` (xs) | 4px | Icon-glyph inset on chip; carousel-dot gap |
| `--space-2` (sm) | 8px | NavRow caption→title gap; SectionHeader title→action gap; SegmentedTabs trigger inner padding-y; HeroBanner.Slide stacked-text gap |
| `--space-3` | 12px | NavRow leading-chip→label gap; StepIndicator number→label gap; NavRow trailing→edge inset |
| `--space-4` (md) | 16px | AppHeader leading/trailing slot inner padding; SectionHeader horizontal padding; HeroBanner inner-card padding; SideDrawer list-row inner padding |
| `--space-5` | 20px | HeroBanner content inset from rounded edge; SideDrawer profile-block vertical padding |
| `--space-6` (lg) | 24px | HeroBanner outer block-padding; SideDrawer section gap; miniapp-home page padding-x |
| `--space-7` | 32px | miniapp-home vertical rhythm between AppHeader→HeroBanner→NavRow→tile-grid |
| `--space-8` | 40px | SideDrawer profile-block→nav-list separator; legal-footer top padding |

**Phase-specific exceptions (R5 + R10.3 touch targets):**
- AppHeader bar height: **56px** fixed (R5.1) — derived as `--app-header-h: 56px`, propose adding to `theme.css` under R5.
- AppHeader icon-button hit area: **44px × 44px** (R5.1; honors `--touch-min: 44px`) with **22px** glyph centred.
- AppHeader 3-slot grid: `grid-template-columns: 56px 1fr auto` — auto-collapses to 56px (1 trailing icon) or 96px (2 icons) per D-07. Two trailing icons sit in a `flex gap-[var(--space-2)] pr-[var(--space-2)] items-center justify-end` cluster.
- NavRow min-height: **48px** (R5.6).
- NavRow leading-icon chip: **24px × 24px** square (R5.6); icon glyph 18px centred.
- NavRow active-state leading stripe: **3px × 100% block-height**, position `absolute inset-y-0 left-0`, `bg-[hsl(var(--brand))]` (Gap #5 closed — full-height stripe, not inset).
- SegmentedTabs trigger min-height: **36px**, horizontal padding `--space-4` (16px).
- StepIndicator number circle: **28px × 28px** (R5.5); connector-bar **2px** height, vertically centred against the circle (`top: 50% − 1px`).
- HeroBanner radius: `--radius-lg` (16px); inner card radius `--radius-md` (12px).
- HeroBanner carousel-dot rail: **8px** dot diameter inactive; **18px × 8px** white pill active (R5.2). Dot gap `--space-2` (8px). Position `absolute bottom-[var(--space-4)] left-1/2 -translate-x-1/2`.
- SideDrawer width: **min(82vw, 340px)** (R5.7); content padding `--space-4`; header reuses AppHeader bar (56px).

---

## Typography

DGC scale tokens from `theme.css`. Latin baseline 1.5; Khmer baseline 1.6 (auto via `:lang(km)` cascade).

| Role | Size | Weight | Line Height | Phase 4 usage |
|------|------|--------|-------------|---------------|
| Caption | `var(--text-xs)` 12px | `var(--weight-medium)` 500 | `var(--leading-tight)` 1.25 | NavRow caption (sub-text under label); StepIndicator step-label; AppHeader count-badge digits |
| Body | `var(--text-sm)` 14px | `var(--weight-regular)` 400 | `var(--leading-normal)` 1.5 | NavRow label default; SegmentedTabs trigger label; SectionHeader action-link; SideDrawer nav-list label; SideDrawer legal footer |
| Heading | `var(--text-base)` 16px | `var(--weight-semibold)` 600 | `var(--leading-normal)` 1.5 | AppHeader title; SectionHeader title; SideDrawer profile-name; HeroBanner.Slide body; StepIndicator active-step label |
| Display | `var(--text-xl)` 20px | `var(--weight-semibold)` 600 | `var(--leading-tight)` 1.25 | HeroBanner.Slide title; HeroBanner inner-card heading |

**Weight rule (3-CONTEXT D-01 carries forward):** registry source uses exactly two weights — `--weight-regular` (400) for body/captions and `--weight-semibold` (600) for headings/titles/active states. Medium (500) is reserved for component-internal contrast (caption, count-badge digits) per token catalog. No `font-bold`, no `font-light` in Phase 4 components.

**Khmer line-height contract:** every text-bearing element must function correctly under `[lang="km"]` where line-height jumps to 1.6. AppHeader title, NavRow label, HeroBanner.Slide body, SegmentedTabs trigger, and StepIndicator labels must all reserve enough vertical room (use `min-h` via the spacing tokens above, not fixed `h-`) to avoid clipping. Verified on `/test/khmer` per R10 + 3-CONTEXT D-08.

---

## Color

DGC palette (60/30/10 split via `theme.css`).

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `hsl(var(--background))` = `--gray-050` light / `226 49% 8%` dark | miniapp-home page background, SideDrawer body background, page surface behind every Phase 4 item |
| Secondary (30%) | `hsl(var(--card))` = `--white` light / `223 44% 13%` dark; **plus** `hsl(var(--bg-surface-2))` (proposed token, see §Tokens) for SegmentedTabs track | Card surfaces, NavRow rest-state row, SideDrawer profile-block background, SegmentedTabs unselected track, StepIndicator pending-state circle fill |
| Accent (10%) | `hsl(var(--brand))` = `--blue-900` light / `--blue-400` dark (Phase 3 D1 `--accent` → `--brand` rename) | **Reserved-for list below** |
| Destructive | `hsl(var(--destructive))` = `--red-700` light / `0 66% 47%` dark | Not used in Phase 4 navigation chrome by default. Available to consumers via NavRow `tone="danger"` opt-in (e.g., "Sign out" row); SideDrawer "Sign out" row reference renders with `text-destructive` icon-only, no destructive background |

**Accent (`--brand`) reserved for the following navigation surfaces only:**

1. AppHeader navy gradient (`--gradient-hero` = `linear-gradient(135deg, hsl(var(--blue-900)) 0%, hsl(var(--blue-700)) 100%)`) — the bar background and any reuse inside SideDrawer header.
2. SegmentedTabs **active** trigger fill (`bg-brand text-brand-foreground`).
3. StepIndicator **active** + **done** circle fill (`bg-brand text-brand-foreground`); connector-bar **done** segment (`bg-brand`).
4. NavRow **active** state: `bg-[hsl(var(--blue-050))]` row tint **plus** 3px `bg-brand` leading stripe (R5.6, Gap #5 closure).
5. SectionHeader optional action-link text (`text-brand`, no underline by default; underline on `:hover`).
6. HeroBanner **active** carousel-dot pill (`bg-white` on the navy banner — the navy banner itself is the brand surface, so the dot inverts to white per R5.2).
7. AppHeader count-badge fill on a notification icon (`bg-[hsl(var(--red-700))]` for unread count, NOT brand — use `--destructive`/`--red-700` so it visibly cuts against the navy gradient; brand+brand would vanish). Dot-only badge (no count) uses `bg-[hsl(var(--red-600))]` 8px circle with 2px navy border for visual lift.

**Surface-2 (`--bg-surface-2`)** — secondary track surface, used by SegmentedTabs and StepIndicator pending circle. Proposed token (see §Tokens below) maps to `--gray-100` light / `224 41% 18%` dark. NavRow rest-state stays on `hsl(var(--card))` (white) so the active `--blue-050` tint reads as elevation, not as an inverse swap.

**Banner foreground colour rules:**
- AppHeader text + glyphs: pure `--white` (R5.1) on the navy gradient.
- HeroBanner.Slide content: pure `--white` on the navy + stipple background; inner card swaps to `bg-white text-foreground` (light) / `bg-card text-card-foreground` (dark).
- Stipple-pattern overlay opacity: `rgba(255,255,255,0.18)` light, `rgba(255,255,255,0.10)` dark (closes Gap #1 — see §Tokens for the exact gradient stops).

---

## Copywriting Contract

Government tone (PROJECT constraint, Phase 4 sets the precedent per `04-CONTEXT.md` §Specific Ideas): sentence case, no exclamations, no emoji, bilingual where the surface is user-facing.

| Element | Copy (English / Khmer) |
|---------|------------------------|
| Primary CTA in HeroBanner.Slide default | "Apply now" / "ដាក់ពាក្យឥឡូវនេះ" |
| Secondary CTA in HeroBanner.Slide default | "Learn more" / "ស្វែងយល់បន្ថែម" |
| AppHeader default title (playground) | "Apply for visa" / "ដាក់ពាក្យទិដ្ឋាការ" |
| SectionHeader default title (playground) | "Recent services" / "សេវាថ្មីៗ" |
| SectionHeader default action-link | "View all" / "មើលទាំងអស់" |
| SegmentedTabs default 3-tab fixture | "Active" / "សកម្ម" · "Pending" / "កំពុងរង់ចាំ" · "Done" / "បានបញ្ចប់" |
| StepIndicator default 4-step fixture | "Identify" / "បញ្ជាក់អត្តសញ្ញាណ" · "Verify" / "ផ្ទៀងផ្ទាត់" · "Pay" / "បង់ប្រាក់" · "Done" / "បញ្ចប់" |
| NavRow default label / caption | "Notifications" / "ការជូនដំណឹង" · caption: "Push, email, SMS" / "Push, អ៊ីមែល, SMS" |
| SideDrawer profile-block name placeholder | "Lim Sokun" / "លី សុផាត" |
| SideDrawer profile-block sub | "Cambodia ID · 0123456" / "អត្តសញ្ញាណប័ណ្ណខ្មែរ · 0123456" |
| SideDrawer legal-footer | "Royal Government of Cambodia · v1.0.0" / "រាជរដ្ឋាភិបាលកម្ពុជា · v1.0.0" |
| Empty state — miniapp-home no-tiles fallback | Heading: "No services yet" / "មិនទាន់មានសេវា" — Body: "Services will appear here once your account is verified. Check back after verification." / "សេវានឹងបង្ហាញនៅទីនេះបន្ទាប់ពីគណនីត្រូវបានផ្ទៀងផ្ទាត់។ សូមត្រឡប់មកវិញបន្ទាប់ពីការផ្ទៀងផ្ទាត់។" |
| Error state — HeroBanner failed to load | "Banner unavailable. Pull down to refresh, or continue to services below." / "បដាមិនអាចផ្ទុកបាន។ សូមអូសចុះក្រោមដើម្បីផ្ទុកឡើងវិញ ឬបន្តទៅសេវានៅខាងក្រោម។" |
| Destructive confirmation — SideDrawer "Sign out" row | Action: "Sign out" / "ចេញ" · Confirmation copy (ships in Phase 5 Dialog, but contract referenced here): "Sign out of DGC MiniApp? You will need to log in again to continue." / "ចេញពី DGC MiniApp? អ្នកនឹងត្រូវចូលម្ដងទៀតដើម្បីបន្ត។" |

**Destructive actions in this phase:** none performed inline — the only destructive surface is the SideDrawer "Sign out" `NavRow` (rendered with `text-destructive` icon + label). The actual confirmation Dialog ships Phase 5; the copy is recorded here so the SideDrawer reference fixture stays consistent across phases.

**`miniapp-home` block default copy:** AppHeader title "Hello, Sokun" / "ជំរាបសួរ សុផាត" · HeroBanner.Slide title "DGC services in your pocket" / "សេវាសាធារណៈនៅក្នុងហោប៉ៅរបស់អ្នក" · NavRow row "Recently viewed" / "បានមើលថ្មីៗ".

---

## Tokens — proposed additions to `dgc-theme/theme.css`

These close the eight gaps flagged in CONTEXT (`Key open spec gaps the UI-SPEC must close`). Components MUST consume these tokens; planner adds them to `theme.css` in the Wave 0 (or Wave 1) plan task and bumps `dgc-theme` to `0.4.0`.

| Token | Light value | Dark value | Consumed by |
|-------|-------------|------------|-------------|
| `--app-header-h` | `56px` | `56px` | AppHeader bar height; SideDrawer header reuse |
| `--app-header-icon` | `44px` | `44px` | AppHeader leading/trailing icon-button hit area |
| `--app-header-glyph` | `22px` | `22px` | AppHeader icon-button glyph size |
| `--bg-surface-2` | `var(--gray-100)` | `224 41% 18%` (HSL triplet) | SegmentedTabs track; StepIndicator pending circle fill |
| `--pattern-stipple` | `radial-gradient(circle at center, hsl(0 0% 100% / 0.18) 1px, transparent 1.5px)` with `background-size: 12px 12px` | `radial-gradient(circle at center, hsl(0 0% 100% / 0.10) 1px, transparent 1.5px)` with `background-size: 12px 12px` | HeroBanner stipple overlay (closes Gap #1; D-12 chooses the **token path** over arbitrary value so dark-mode pairs in one place) |
| `--drawer-overlay` | `hsl(0 0% 0% / 0.50)` (alias to `--bg-overlay`) | `hsl(0 0% 0% / 0.65)` | SideDrawer Dialog scrim |
| `--drawer-width` | `min(82vw, 340px)` | same | SideDrawer panel width (R5.7) |
| `--ring-on-navy` | `0 0 0 3px hsl(0 0% 100% / 0.55)` | `0 0 0 3px hsl(0 0% 100% / 0.65)` | AppHeader icon-button `:focus-visible` ring (closes Gap #6 — distinct from default `--shadow-focus` because the default ring uses `hsl(var(--ring))` which is navy and would vanish on the gradient) |
| `--nav-active-stripe` | `3px` | `3px` | NavRow active-state leading-stripe width (consumed as `w-[var(--nav-active-stripe)]` to keep R5.6 reading single-token) |
| `--nav-active-bg` | `var(--blue-050)` | `221 46% 19%` (HSL triplet, mirrors dark `--accent`) | NavRow active row tint (R5.6 — light path uses `--blue-050`; dark path needs an equivalent low-saturation tint that doesn't disappear into the page background) |

**Motion contract** (closes Gaps #2/#3 — durations come from existing `--dur-*` and `--ease-standard` tokens; no new motion tokens needed):

| Surface | Property | Value |
|---------|----------|-------|
| SideDrawer panel slide-in | `transform: translateX(-100%) → 0` on `[data-state="open"]` | `var(--dur-slow)` 320ms · `var(--ease-standard)` |
| SideDrawer panel slide-out | `transform: 0 → translateX(-100%)` on `[data-state="closed"]` | `var(--dur-base)` 200ms · `var(--ease-standard)` |
| SideDrawer overlay fade | `opacity: 0 → 1` (open) / `1 → 0` (close) | matches panel duration; opacity transition only, no transform |
| SegmentedTabs active-pill | `transition: background-color, color` per-trigger (closes Gap #3 — choose **per-trigger background** over sliding indicator; simpler, dark-mode-aware via tokens, no JS layout-effect needed) | `var(--dur-fast)` 120ms · `var(--ease-standard)` |
| StepIndicator state change (e.g., done → active externally toggled) | `transition: background-color, border-color` on circle + connector | `var(--dur-base)` 200ms · `var(--ease-standard)` |
| HeroBanner carousel-dot pill expand | `transition: width, background-color` | `var(--dur-base)` 200ms · `var(--ease-standard)` (closes Gap #7 — width animates from 8px → 18px on the active dot only) |
| NavRow `:hover` (rest → hovered) | `transition: background-color` | `var(--dur-fast)` 120ms · `var(--ease-standard)` |

**Reduced-motion override:** the existing `@media (prefers-reduced-motion: reduce)` rule in `theme.css` already zeros all transitions. SideDrawer must additionally substitute `transform` with an instant open/close (no slide); HeroBanner active-dot snaps to width without animation. Implementation: components rely on the global rule, no per-component media queries (R10.3 + 3-CONTEXT carries forward).

**StepIndicator connector render strategy (closes Gap #4):** absolutely-positioned `span` between consecutive circles using `aria-hidden="true"`, `top: 50% - 1px`, `left: calc(<previous-circle-right>)`, `right: calc(<next-circle-left>)`, `height: 2px`. Bar background:
- pending segment → `bg-[hsl(var(--bg-surface-2))]`
- done segment → `bg-brand`
- active circle's preceding bar is `bg-brand` (the bar leading INTO the active step is "done"); the bar leading OUT is pending.

**AppHeader icon-button focus-visible (closes Gap #6):** override the default `--shadow-focus` selector locally:
```
.app-header [data-app-header-icon]:focus-visible {
  box-shadow: var(--ring-on-navy);
  border-radius: var(--radius-sm);
}
```
Authored in `app-header.tsx` source; never `dark:*` — the token already pairs.

**HeroBanner carousel-dot details (closes Gap #7):**
- Inactive dot: `8px × 8px` circle, `bg-white/40` (~`hsl(0 0% 100% / 0.4)`), `rounded-full`.
- Active dot: `18px × 8px` pill, `bg-white` (full opacity), `rounded-full`.
- Dots positioned `absolute bottom-[var(--space-4)] left-1/2 -translate-x-1/2 flex gap-[var(--space-2)]`.
- Exactly **3 dots visible** when slide count ≤ 3; for slide count > 3, dots stay 3-visible with a windowed rendering (out-of-window dots hidden via `display:none`) — keeps R5.2 visual contract intact.
- Dots are presentational (`aria-hidden="true"`); the controlled `activeIndex` is the source of truth (D-10).

**AppHeader 2-trailing-icon layout (closes Gap #8):** when 2 trailing icons are passed, the right slot column auto-resolves to `auto` via `grid-template-columns: 56px 1fr auto`. The trailing slot inner layout is `flex items-center justify-end gap-[var(--space-2)] pr-[var(--space-2)]` so each 44px hit area ends with an 8px breath against the bar's right edge. Total visual width = 8 + 44 + 8 + 44 + 8 = 112px — the spec's "96px" is a minimum hint, not a max; the grid `auto` keyword honours intrinsic sizing per D-07.

---

## Variants & States Matrix

Every interactive item must satisfy this matrix (3-CONTEXT D-18 carry-forward — `--shadow-focus` on `:focus-visible`; AppHeader icon-buttons swap to `--ring-on-navy`).

| Item | Rest | Hover | Focus-visible | Active/Selected | Disabled | Loading |
|------|------|-------|---------------|-----------------|----------|---------|
| AppHeader icon-button | `bg-transparent text-white` | `bg-white/10` | `--ring-on-navy` | n/a (action only) | `opacity-50 cursor-not-allowed pointer-events-none` | n/a (Phase 5 spinner item) |
| AppHeader count-badge | `bg-[hsl(var(--red-700))] text-white border-2 border-[hsl(var(--blue-900))]` | n/a | inherits parent button | n/a | hidden when `count===0` | n/a |
| HeroBanner carousel-dot | inactive `bg-white/40` | n/a (presentational) | n/a | active `bg-white w-[18px]` | n/a | n/a |
| SectionHeader action-link | `text-brand` | `underline` | `--shadow-focus` | n/a | `opacity-50 pointer-events-none` | n/a |
| SegmentedTabs trigger | `bg-transparent text-foreground` (track is `bg-[hsl(var(--bg-surface-2))]`) | `bg-white/40` (light) / `bg-white/5` (dark) | `--shadow-focus` | `bg-brand text-brand-foreground` | `opacity-50 pointer-events-none` | n/a |
| StepIndicator circle | pending `bg-[hsl(var(--bg-surface-2))] text-muted-foreground` | n/a (presentational) | n/a | done `bg-brand text-brand-foreground`; active `bg-brand text-brand-foreground ring-2 ring-[hsl(var(--brand)/0.25)] ring-offset-2 ring-offset-background` | n/a (each step is data-driven, not interactive) | n/a |
| NavRow row | `bg-card text-foreground` | `bg-[hsl(var(--blue-050)/0.5)]` | `--shadow-focus` (when interactive via `<button>`/`<a>` consumer wrap) | `bg-[hsl(var(--nav-active-bg))]` + `before:absolute before:inset-y-0 before:left-0 before:w-[var(--nav-active-stripe)] before:bg-brand before:content-['']` | `opacity-50 pointer-events-none` | n/a |
| SideDrawer panel | `data-state=closed` translateX(-100%) | n/a | trap inside drawer (Radix default) | `data-state=open` translateX(0) | n/a | n/a |

---

## Item-by-item visual inventory

(Planner consumes this for per-item plans; each row = one Wave entry. Wave structure: Wave 1 = `app-header` + `section-header` + `nav-row` (no inter-deps among these); Wave 2 = `segmented-tabs` + `step-indicator` (depend on Phase 3 `tabs` only); Wave 3 = `hero-banner` (block, depends on no Phase 4 sibling); Wave 4 = `side-drawer` (block, depends on `app-header`); Wave 5 = `miniapp-home` (block, depends on `app-header` + `hero-banner` + `nav-row`); Wave 6 = manifest + visual-diff baseline + ROADMAP exit-gate edit.)

| Item | Type | shadcn primitive deps | Phase 3 registryDependencies | Visual specimen |
|------|------|----------------------|------------------------------|-----------------|
| `app-header` | `registry:ui` | `lucide-react` | `dgc-theme`, `button`, `badge`, optional `tooltip` | `app-header.html` |
| `section-header` | `registry:ui` | `lucide-react` (only if action icon used) | `dgc-theme` | `section-header.html` |
| `segmented-tabs` | `registry:ui` | `@radix-ui/react-tabs`, `lucide-react` | `dgc-theme`, `tabs` | `segmented-tabs.html` |
| `step-indicator` | `registry:ui` | `lucide-react` (check glyph for done) | `dgc-theme` | `step-indicator.html` |
| `nav-row` | `registry:ui` | `lucide-react` | `dgc-theme`, `badge`, `switch` (slot pattern; no hard registry dep — switch sits in `trailing` ReactNode per D-05) | `nav-row.html` |
| `hero-banner` | `registry:block` | `lucide-react` | `dgc-theme` | `hero-banner.html` |
| `side-drawer` | `registry:block` | `@radix-ui/react-dialog`, `lucide-react` | `dgc-theme`, `app-header`, `scroll-area` | `side-drawer.html` |
| `miniapp-home` | `registry:block` | `lucide-react` | `dgc-theme`, `app-header`, `hero-banner`, `nav-row` | `superapp-host.html` |

Visual-diff baseline (Phase 2 precedent ΔRGB ≤ 2): one Playwright screenshot per item compared against the legacy specimen at `D:/sources/dgc-miniapp-design-system/project/preview/<item>.html`. The `miniapp-home` block diffs against `superapp-host.html`.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none directly used (every item is DGC-authored, not pulled from `ui.shadcn.com`) | not required |
| DGC self (`@dgc` → `https://registry.016910804.xyz`) | All 8 Phase 4 items + cascade into `dgc-theme`, `button`, `badge`, `switch`, `tabs`, `scroll-area`, optional `tooltip` (all first-party, repo-controlled) | not applicable — first-party |
| Third-party | none declared | not applicable |

No third-party registry. No registry vetting gate triggered. (`components.json` `registries` map points only at the DGC self-host at `http://localhost:3000/r/{name}.json` for local dev; production is `https://registry.016910804.xyz` — the project's own host, repo-controlled per `dg-superapp/design-system`.)

---

## Non-functional gates (R10 — embedded into the UI contract)

Every Phase 4 item must, before phase exit:

1. Render correctly under `lang="km"` on `/test/khmer` page — no clipping at `--leading-loose` 1.6 (R10 + 3-CONTEXT D-08).
2. `.dark` class flip produces no visual breakage — every token consumed in this spec resolves in both modes via `theme.css` (R3.4).
3. `axe-core` Playwright pass on `/preview/<item>` — zero violations (R10.1; existing CI a11y gate from 3-00).
4. Touch targets ≥ 44px on AppHeader icon-button, NavRow when interactive, SegmentedTabs trigger (R5.1, R10.3).
5. Visual-diff vs legacy specimen ≤ ΔRGB 2 (Phase 2 precedent); baseline added to `scripts/visual-diff.mjs`.
6. Keyboard navigation: Tab cycles AppHeader leading→title-link→trailing-1→trailing-2→… ; SegmentedTabs ArrowLeft/Right cycles triggers (Radix Tabs default); SideDrawer Esc closes, focus traps inside panel (Radix Dialog default); NavRow Tab when wrapped in `<a>`/`<button>` (R10.3).
7. RTL not required (Khmer is LTR; PROJECT). However, no `margin-left`/`margin-right` patterns — use `margin-inline-*` or token spacing utilities to keep future RTL low-cost (3-CONTEXT carries).

---

## ARIA + semantics

| Item | Element / role | ARIA contract |
|------|----------------|---------------|
| AppHeader | `<header role="banner">` outer; title in `<h1>` (or `<h2>` when nested under a page heading — pass `as` prop) | leading/trailing buttons ship as `<button>` with `aria-label` (Khmer + English) and `aria-haspopup="menu"` when wired to drawer |
| AppHeader count-badge | sibling `<span aria-live="polite" aria-atomic="true">` with `aria-label="{count} unread"` (bilingual) | dot-only badge: `aria-hidden="true"` + parent button gets `aria-label` "Notifications, unread" |
| HeroBanner | outer `<section aria-roledescription="carousel" aria-label="{slidesLabel}">`; each slide `<div role="group" aria-roledescription="slide" aria-label="Slide {n} of {total}">` | dots are `aria-hidden="true"` (presentational) — consumer drives `activeIndex` (D-10), so the controlled state lives outside Radix |
| SectionHeader | `<h2>` title; `<a>` action-link with descriptive text (no "click here") | n/a |
| SegmentedTabs | Radix Tabs underneath: `role="tablist"`, triggers `role="tab"`, panels `role="tabpanel"` | inherits Phase 3 `tabs` ARIA verbatim |
| StepIndicator | `<ol aria-label="{label}">` with `<li aria-current="step"` on active, `aria-label="{n}. {label}, {state}"` per step | done state visually shows check glyph; `aria-label` says "completed" |
| NavRow | semantic depends on slot — bare row `<div>`; consumer-wrapped `<a>`/`<button>` keeps focus ring | trailing badge gets `aria-label="{count} new"`; trailing chevron `aria-hidden="true"` |
| SideDrawer | Radix Dialog: `role="dialog" aria-modal="true" aria-labelledby="{header-title-id}"` | close button `aria-label="Close menu"` (bilingual); first focus on header close button (Radix default) |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
