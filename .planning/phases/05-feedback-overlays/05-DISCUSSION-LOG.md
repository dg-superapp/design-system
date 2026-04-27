# Phase 5: Feedback + overlays - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-27
**Phase:** 05-feedback-overlays
**Areas discussed:** Item split & exit gate, Sheet side support, Toast architecture, Skeleton + Spinner API

---

## Item split & exit gate

### Q1: Dialog item shape

| Option | Description | Selected |
|--------|-------------|----------|
| Two items: dialog + alert-dialog | shadcn canonical. Dialog (general modal, role='dialog') + AlertDialog (confirmation, role='alertdialog'). Adds @radix-ui/react-alert-dialog. | ✓ |
| One item: dialog only, document destructive pattern | Single dialog using react-dialog (already installed). Confirmation flow as docs recipe. | |
| One item: alert-dialog only, plus generic-modal pattern | Ship only alert-dialog; generic modal docs say 'use alert-dialog without action button'. Fights Radix semantics. | |

**User's choice:** Two items: dialog + alert-dialog (Recommended)
**Notes:** Different ARIA roles, different focus-trap semantics, exit-gate clarity.

---

### Q2: Skeleton + Spinner packaging

| Option | Description | Selected |
|--------|-------------|----------|
| Separate items: skeleton + spinner | shadcn canonical, granular installs, independent docs. | ✓ |
| Bundled: one feedback-loading item exporting both | Single TSX file dot-namespace export. Smaller surface. | |

**User's choice:** Separate items (Recommended)

---

### Q3: Sheet side support

| Option | Description | Selected |
|--------|-------------|----------|
| side='bottom' only | BottomSheet exclusive. Matches R6.3 wording literally. | ✓ |
| side='bottom' \| 'top' | Both vertical sides. | |
| side='top' \| 'right' \| 'bottom' \| 'left' (full shadcn) | All 4 sides. Left would overlap SideDrawer. | |

**User's choice:** side='bottom' only (Recommended)
**Notes:** Phase 4 SideDrawer handles slide-left; bottom-only is the v1 minimum.

---

## Toast architecture

### Q1: Toaster mount strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Single item exports both <Toaster/> + toast() helper | DGC-themed Toaster preconfigured + sonner toast() re-exported. One npx shadcn add. | ✓ |
| Two separate items: toaster (provider) + toast (helpers) | Forces explicit mount step. Non-canonical for sonner. | |
| Wrap sonner with full DGC API — no re-export | Custom dgcToast({...}) only. High maintenance. | |

**User's choice:** Single item exports both (Recommended)

---

### Q2: Position + duration

| Option | Description | Selected |
|--------|-------------|----------|
| top-center, 4000ms | Mobile-first thumb-reachable. 4s matches Material spec. | ✓ |
| top-right, 4000ms | Desktop convention. Collides with notification icons in AppHeader. | |
| top-center, 6000ms | Longer dwell for bilingual scan. Risk of slow stacking. | |

**User's choice:** top-center, 4000ms (Recommended)

---

### Q3: Icons (no-emoji constraint)

| Option | Description | Selected |
|--------|-------------|----------|
| Lucide icons per kind, override sonner defaults | iconMap: info=Info, success=CheckCircle2, warning=AlertTriangle, danger=XCircle. Swappable for DGC icons later. | ✓ |
| No icons — text-only toasts | Strictest reading. Color-only signal (a11y cost). | |
| Lucide icons hardcoded, no override | Smaller API but no consumer override. | |

**User's choice:** Lucide icons per kind, override sonner defaults (Recommended)

---

### Q4: Method surface

| Option | Description | Selected |
|--------|-------------|----------|
| All sonner methods (info, success, warning, error, loading, promise) | Full surface. loading() useful for Phase 6 FileUploader. | ✓ |
| Only the 4 alert kinds | Match R6.1 Alert exactly. Skip loading/promise for v1. | |

**User's choice:** All sonner methods exposed (Recommended)

---

## Skeleton + Spinner API

### Q1: Shimmer animation location

| Option | Description | Selected |
|--------|-------------|----------|
| Keyframes in dgc-theme/theme.css, components reference by name | Add @keyframes dgc-pulse + dgc-spin alongside Phase 4 keyframes. Single source of truth. | ✓ |
| Inline keyframes per component | Self-contained but two places to fix. Doesn't follow Phase 4 precedent. | |
| Tailwind animate-pulse + animate-spin defaults | Smallest custom code but doesn't use --ease-standard. Violates R6.6. | |

**User's choice:** Keyframes in dgc-theme/theme.css (Recommended)

---

### Q2: Skeleton API

| Option | Description | Selected |
|--------|-------------|----------|
| shadcn-canonical primitive + <Skeleton.Text lines={n}/> preset | Hybrid: Tailwind sizing + paragraph-placeholder preset. Phase 4 D-06/D-08 dual-API precedent. | ✓ |
| shadcn-canonical only: <Skeleton className='h-4 w-32'/> | Just primitive, no presets. Most flexible, most boilerplate. | |
| Variant prop: <Skeleton variant='text'\|'circle'\|'rect' lines={n}/> | Variant-driven. Less Tailwind, harder to extend. Not canonical. | |

**User's choice:** shadcn-canonical + Skeleton.Text preset (Recommended)

---

### Q3: Spinner implementation

| Option | Description | Selected |
|--------|-------------|----------|
| Lucide Loader2 with animate via dgc-spin keyframe | Zero custom SVG. Consistent with Phase 4 D-14 icon abstraction. Swappable for DGC icons. | ✓ |
| Custom SVG ring (stroke-dasharray + dashoffset) | Most pixel control. Custom SVG to maintain. | |
| CSS-only border-spin | Smallest bundle. Limited fidelity. Doesn't match Lucide visual language. | |

**User's choice:** Lucide Loader2 + dgc-spin (Recommended)

---

### Q4: Spinner sizes

| Option | Description | Selected |
|--------|-------------|----------|
| sm (16px) \| md (20px) \| lg (24px), md default | Three sizes covering inline-button + text + section. Maps to Lucide size prop. | ✓ |
| Single size, sized via className | Tailwind-driven, no size prop. Risk of mismatched sizes. | |
| xs (12) \| sm (16) \| md (20) \| lg (24) \| xl (32) | Maximum granularity. YAGNI. | |

**User's choice:** sm/md/lg with md default (Recommended)

---

## Claude's Discretion

The following were left for downstream agents to decide (captured in CONTEXT.md §Claude's Discretion):

- Exact `dgc-pulse` keyframe values (current pick: opacity 1→0.5→1)
- Sonner version pin (researcher checks current stable)
- AlertDialog focus-on-open target (Cancel vs first focusable in body)
- Alert.Close slot implementation (button vs bare X icon)
- Sheet drag handle exact pixel dimensions within R6.3 spec
- PlaygroundShell `<Demo>` mode prop name
- Toast iconMap export path (top-level vs namespaced)
- Spinner aria-label localization defaults

## Deferred Ideas

Captured in CONTEXT.md §Deferred — primary items: Sheet other sides, swipe-to-dismiss, Alert auto-dismiss promotion, Alert banner variant, Skeleton shape presets, Spinner xs/xl sizes, DGC icon swap, useCarousel hook, ROADMAP em-dash fix.
