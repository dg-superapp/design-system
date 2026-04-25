---
phase: 3
phase_name: Primitives (14 items)
status: draft
date: 2026-04-24
author: gsd-ui-researcher
sources:
  - .planning/phases/3-primitives/3-CONTEXT.md
  - .planning/REQUIREMENTS.md (R4, R10)
  - .planning/PROJECT.md
  - project/colors_and_type.css
  - dgc-miniapp-shadcn/src/app/globals.css (Phase 2 authoritative)
  - project/preview/buttons-primary.html
  - project/preview/buttons-secondary.html
  - project/preview/inputs.html
  - project/preview/selection.html
  - project/preview/tabs.html
  - project/preview/elevation.html
  - project/preview/radii.html
  - project/preview/spacing.html
  - project/preview/type-khmer.html
  - project/preview/type-bilingual.html
---

# UI-SPEC — Phase 3: Primitives

> Design contract for all 14 `registry:ui` primitives.
> Every value is a token reference. Raw hex/px appear only when no token exists.
> Executor must NOT introduce `dark:*` Tailwind utilities — token flips handle dark mode.

---

## § 1 — Global Design Tokens

All primitives consume tokens from `dgc-theme` (`globals.css`). This table is the single authoritative
reference; it is NOT repeated per primitive.

### 1.1 Semantic Color Aliases (light → dark flips automatically under `.dark`)

| Alias | Light value | Dark value | Used for |
|---|---|---|---|
| `--background` | `--gray-050` (#F5F7FA) | `226 49% 8%` | Page surface |
| `--foreground` | `--gray-900` (#212121) | `217 39% 94%` | Primary text |
| `--card` | `--white` | `223 44% 13%` | Card / input bg |
| `--card-foreground` | `--gray-900` | `217 39% 94%` | Card text |
| `--muted` | `--gray-100` | `224 41% 18%` | Muted surface |
| `--muted-foreground` | `--gray-600` | `220 18% 71%` | Secondary text |
| `--border` | `--gray-200` (#E0E0E0) | `222 36% 22%` | Borders, dividers |
| `--input` | `--gray-200` | `222 36% 22%` | Input border |
| `--ring` | `--blue-900` | `--blue-400` | Focus ring base |
| `--primary` | `--blue-900` (#0D47A1) | `--blue-400` | (shadcn primary — avoid direct use; prefer `--brand`) |
| `--brand` | `--blue-900` (#0D47A1) | `--blue-400` | DGC CTA button fill, active indicator |
| `--brand-foreground` | white | `--blue-950` | Text on brand surface |
| `--brand-hover` | `217 87% 30%` (#0A3D8F) | `207 90% 55%` | Brand hover |
| `--brand-press` | `217 88% 26%` (#08347B) | `207 90% 48%` | Brand press |
| `--destructive` | `--red-700` (#C62828) | same | Destructive action |
| `--destructive-foreground` | white | white | Text on destructive |
| `--success` | `--green-700` (#2E7D32) | same | Success text/icon |
| `--success-bg` | `--green-100` (#E8F5E9) | `123 30% 14%` | Success surface |
| `--warning` | `--amber-700` (#F9A825) | same | Warning text/icon |
| `--warning-bg` | `--amber-100` (#FFF8E1) | `37 35% 14%` | Warning surface |
| `--danger` | `--red-700` (#C62828) | same | Error/danger text |
| `--danger-bg` | `--red-100` (#FFEBEE) | `0 35% 16%` | Error surface |
| `--info` | `--info-600` (#0288D1) | same | Info text/icon |
| `--info-bg` | `--info-100` (#E1F5FE) | `201 35% 15%` | Info surface |

> **Note on `--accent`:** In `globals.css`, `--accent` maps to `--gray-100` (a muted surface), NOT to the DGC blue.
> The DGC CTA/interactive color is `--brand` (`--blue-900`). All primitives must use `--brand` for interactive
> blue fills and `--brand-foreground` for text on those fills.

### 1.2 DGC Scale Tokens (read-only reference — primitives use semantic aliases)

| Scale | Values |
|---|---|
| Blue | `--blue-950` `--blue-900` `--blue-800` `--blue-700` `--blue-600` `--blue-500` `--blue-400` `--blue-100` `--blue-050` |
| Neutrals | `--white` `--gray-050` `--gray-100` `--gray-200` `--gray-300` `--gray-400` `--gray-500` `--gray-600` `--gray-700` `--gray-900` `--gray-950` |
| Semantic | `--red-700` `--red-600` `--red-100` `--green-700` `--green-100` `--amber-700` `--amber-100` `--info-600` `--info-100` |

> `--red-600` (#D32F2F) is used exclusively for the required-field asterisk on Label.
> It is NOT a semantic alias — reference it as `--red-600` only in Label.

### 1.3 Shadow Tokens

| Token | Value | Usage |
|---|---|---|
| `--shadow-0` | `none` | Flat surfaces |
| `--shadow-1` | `0 1px 2px 0 hsl(0 0% 0% / 0.05)` | Cards, pill-tab active |
| `--shadow-2` | `0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.08)` | Sticky headers |
| `--shadow-3` | `0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.08)` | Sheets, dialogs |
| `--shadow-focus` | `0 0 0 3px hsl(var(--ring) / 0.4)` | Focus ring (all interactive) |

Focus ring is applied via `:focus-visible { outline: none; box-shadow: var(--shadow-focus); }`.
The `border-radius` on the focus ring MUST match the component's own radius token.

### 1.4 Radius Tokens

| Token | px | Used on |
|---|---|---|
| `--radius-xs` | 4px | Chips, tags, code spans |
| `--radius-sm` | 8px | Tooltip, small buttons, pill-tab items, note blocks |
| `--radius-md` | 12px | Inputs, Textarea, Select, primary/secondary buttons, tab container |
| `--radius-lg` | 16px | Cards, banners, sheets |
| `--radius-pill` | 999px | Switch track, Radio, Badge pill, count badges |

### 1.5 Spacing Tokens (4px base, Phase 2 globals.css authoritative)

| Token | px | Notes |
|---|---|---|
| `--space-1` | 4px | Micro gap |
| `--space-2` | 8px | Icon-label gap, tab padding |
| `--space-3` | 12px | Input horizontal padding, field gap |
| `--space-4` | 16px | Screen margin, standard padding |
| `--space-5` | 20px | Section gap |
| `--space-6` | 24px | Gutter |
| `--space-7` | 32px | Large section gap |
| `--space-8` | 40px | XL gap |

> Deviation from `colors_and_type.css`: Phase 2 `globals.css` defines `--space-5: 20px` (not 24px) and
> `--space-6: 24px` (not 32px). Use `globals.css` values as authoritative.

### 1.6 Typography Tokens

| Token | Value | Mapping |
|---|---|---|
| `--text-xs` | 0.75rem (12px) | Caption, tooltip |
| `--text-sm` | 0.875rem (14px) | Body SM, label, small button |
| `--text-base` | 1rem (16px) | Body, input text |
| `--text-lg` | 1.125rem (18px) | Section heading |
| `--text-xl` | 1.25rem (20px) | Title |
| `--text-2xl` | 1.5rem (24px) | Title LG |
| `--text-3xl` | 1.875rem (30px) | — |
| `--weight-regular` | 400 | Body text |
| `--weight-medium` | 500 | Labels, button text, tab labels |
| `--weight-semibold` | 600 | Active tab labels, headings |
| `--leading-tight` | 1.25 | Latin headings |
| `--leading-normal` | 1.5 | Latin body |
| `--leading-loose` | 1.6 | Khmer (all sizes) |
| `--font-latin` | Inter, Roboto, system-ui | Default body |
| `--font-khmer` | Noto Sans Khmer, Kantumruy Pro, Battambang, system-ui | Khmer cascade |

### 1.7 Motion Tokens

| Token | Value |
|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--dur-fast` | 120ms |
| `--dur-base` | 200ms |
| `--dur-slow` | 320ms |

`prefers-reduced-motion: reduce` overrides all durations to 0ms (set in `@layer base`).

### 1.8 Touch Target Requirement

Minimum interactive area: **44×44px** (`--touch-min: 44px`).
Standard button height: **48px** (`--button-h`).
Standard input height: **48px** (`--input-h`).

---

## § 2 — Per-Primitive Specifications

---

## 2.1 Button

**Source:** `buttons-primary.html`, `buttons-secondary.html`, R4.1, CONTEXT specifics.

### Variants × Sizes

| Variant | Size | Height | Padding H | Border radius | Min-width |
|---|---|---|---|---|---|
| `primary` | `default` | 48px (`--button-h`) | 20px | `--radius-md` (12px) | 140px |
| `primary` | `sm` | 40px | 18px | `--radius-md` (12px) | — |
| `secondary` | `default` | 48px | 20px | `--radius-md` (12px) | 140px |
| `secondary` | `sm` | 40px | 18px | `--radius-md` (12px) | — |
| `ghost` | `default` | 48px | 10px | `--radius-md` (12px) | — |
| `ghost` | `sm` | 40px | 10px | `--radius-md` (12px) | — |
| `ghost-danger` | `default` | 48px | 10px | `--radius-md` (12px) | — |
| `ghost-danger` | `sm` | 40px | 10px | `--radius-md` (12px) | — |

Button uses `inline-flex; align-items: center; justify-content: center; gap: --space-2`.
Font: `--weight-medium`, `--text-base` (default) / `--text-sm` (sm), `line-height: 1`.

### State Tokens per Variant

#### primary
| State | Background | Foreground | Border | Shadow |
|---|---|---|---|---|
| Default | `--brand` | `--brand-foreground` | none | `--shadow-0` |
| Hover | `--brand-hover` | `--brand-foreground` | none | `--shadow-0` |
| Active/press | `--brand-press` | `--brand-foreground` | none | `inset 0 1px 2px rgba(0,0,0,0.12)` |
| Focus-visible | `--brand` | `--brand-foreground` | none | `--shadow-focus` |
| Disabled | `--gray-200` | `--gray-500` | none | `--shadow-0` |
| Loading | `--brand` | `--brand-foreground` | none | `--shadow-0` + spinner |

Disabled MUST use `--gray-200` bg and `--gray-500` fg — NOT `opacity-50`.
Loading spinner: 16×16px, `border: 2px solid rgba(255,255,255,0.4)`, `border-top-color: white`, `border-radius: 999px`, `animation: spin 1s linear infinite`.

#### secondary
| State | Background | Foreground | Border | Shadow |
|---|---|---|---|---|
| Default | `--blue-050` | `--brand` | none | `--shadow-0` |
| Hover | `--blue-100` | `--brand` | none | `--shadow-0` |
| Active/press | `--blue-100` | `--brand` | none | `--shadow-0` |
| Focus-visible | `--blue-050` | `--brand` | none | `--shadow-focus` |
| Disabled | `--muted` (`--gray-100`) | `--muted-foreground` (`--gray-600`) | none | `--shadow-0` |

#### ghost
| State | Background | Foreground |
|---|---|---|
| Default | transparent | `--brand` |
| Hover | `--blue-050` | `--brand` |
| Focus-visible | transparent | `--brand` + `--shadow-focus` |
| Disabled | transparent | `--muted-foreground` |

#### ghost-danger
| State | Background | Foreground |
|---|---|---|
| Default | transparent | `--danger` |
| Hover | `--danger-bg` | `--danger` |
| Focus-visible | transparent | `--danger` + `--shadow-focus` |
| Disabled | transparent | `--muted-foreground` |

### Icon Slot
`asChild` prop exposed via Radix `Slot`. Icon slot: leading or trailing child `<svg>` at 16px (default) / 14px (sm). Gap between icon and text: `--space-2` (8px).

### Interaction Contract
- Click target: full button height × width (min 44×44px enforced by height).
- Keyboard: `Enter` and `Space` activate.
- `disabled` attribute disables pointer events and keyboard activation.
- `type="button"` default to prevent form submission; pass `type="submit"` explicitly in `<Form>`.

### CVA Shape
```
variants: { variant: [primary, secondary, ghost, ghost-danger], size: [default, sm] }
defaultVariants: { variant: "primary", size: "default" }
```

### Visual Acceptance Test
Open `/preview/button`. Verify:
1. Primary default shows `--brand` (#0D47A1 in light) fill with white text.
2. Hover darkens to `--brand-hover`.
3. Disabled shows gray fill (#E0E0E0) with gray text (#757575) — NOT a transparent/faded version.
4. Tab to button → focus ring `0 0 0 3px hsl(var(--ring) / 0.4)` visible with no outline artifact.
5. Loading shows spinner inline with text.
6. Khmer label (`lang="km"`) renders without clipping at default height.

---

## 2.2 Input

**Source:** `inputs.html`, R4.2.

### Dimensions
- Height: 48px (`--input-h`)
- Border radius: `--radius-md` (12px)
- Border: `1px solid var(--input)` (`--gray-200`)
- Padding: `0 14px` (horizontal only; vertically centered via flex/line-height)
- Min-width: 100% of container (block element)

### Typography
- Font: `--font-latin`, `--text-base` (16px), `--weight-regular`
- Placeholder color: `--muted-foreground` (`--gray-600`) via `::placeholder`

### States
| State | Border | Background | Foreground | Shadow | Notes |
|---|---|---|---|---|---|
| Default | `--input` (`--gray-200`) | `--card` (white) | `--foreground` | none | |
| Hover | `--gray-400` | `--card` | `--foreground` | none | Subtle border darkening |
| Focus-visible | `--blue-700` (`#1565C0`) | `--card` | `--foreground` | `--shadow-focus` | Border color matches ring base |
| Filled/valid | `--input` | `--card` | `--foreground` | none | |
| Error/invalid | `--danger` (`--red-700`) | `--card` | `--foreground` | none | |
| Disabled | `--input` | `--background` (`--gray-050`) | `--muted-foreground` (`--gray-400`) | none | `cursor: not-allowed` |

Error message: `--text-xs` (12px), `--danger` color, `line-height: 1.4`. Appears below input, `gap: 6px` from field.

### Special: Date Input
- `type="date"` with `lang="km"` must render placeholder `ថ្ងៃ/ខែ/ឆ្នាំ`.
- Implementation: custom placeholder via CSS `::before` content or `aria-placeholder`.

### A11y
- Always paired with `<Label>` via `htmlFor` / `id`.
- `aria-invalid="true"` when error state.
- `aria-describedby` points to error message element when error is present.

### Interaction Contract
- Keyboard: standard text input behavior. No special key handling beyond browser default.
- Touch: full 48px height is the touch target.

### Visual Acceptance Test
Open `/preview/input`. Verify:
1. Default: 1px `#E0E0E0` border, white bg, 48px height.
2. Focus: border changes to `#1565C0`, blue focus ring appears.
3. Error: border changes to `#C62828`, error message appears in red below.
4. Disabled: `#F5F7FA` bg, gray text, `cursor: not-allowed`.
5. Date input with `lang="km"` shows Khmer placeholder text.

---

## 2.3 Textarea

**Source:** `inputs.html` (visual parity), R4.3.

### Dimensions
- Min-height: 88px
- Border radius: `--radius-md` (12px)
- Border: `1px solid var(--input)`
- Padding: `12px 14px` (vertical padding needed; not height-constrained)
- Resize: vertical only (`resize: vertical`)

### States
Same token mapping as Input (§ 2.2). All states identical.

### Typography
Same as Input: `--text-base`, `--weight-regular`, `--font-latin`.
Line-height: `--leading-normal` (1.5) for Latin; inherits `--leading-loose` (1.6) under `:lang(km)`.

### Khmer Note
Khmer text in Textarea requires extra vertical padding allowance because subscript characters
(coeng) extend below baseline. The `--leading-loose` (1.6) cascade via `:lang(km)` handles this
automatically — no per-component override needed.

### Visual Acceptance Test
Open `/preview/textarea`. Verify:
1. Min-height 88px at default.
2. Vertical resize handle visible; horizontal resize disabled.
3. Focus ring matches Input focus ring exactly.
4. Khmer text in textarea does not clip descenders.

---

## 2.4 Select

**Source:** `inputs.html` (visual parity spec), R4.4. Uses Radix `@radix-ui/react-select`.

### Visual Spec (same as Input)
- Height: 48px (`--input-h`)
- Border radius: `--radius-md` (12px)
- Border: `1px solid var(--input)`
- Padding: `0 14px`
- Background: `--card`
- Foreground: `--foreground`
- Placeholder: `--muted-foreground`

### States
| State | Border | Background | Notes |
|---|---|---|---|
| Default | `--input` | `--card` | Trailing chevron-down icon 16px `--muted-foreground` |
| Hover | `--gray-400` | `--card` | |
| Open | `--blue-700` | `--card` | `--shadow-focus` on trigger |
| Focus-visible | `--blue-700` | `--card` | `--shadow-focus` |
| Disabled | `--input` | `--background` | `--muted-foreground` text, `cursor: not-allowed` |
| Error | `--danger` | `--card` | `aria-invalid="true"` on trigger |

### Dropdown Content
- Background: `--card`
- Border: `1px solid var(--border)`, `--radius-md`
- Shadow: `--shadow-2`
- Item height: 40px, padding `0 14px`
- Item hover: `--background` (`--gray-050`)
- Item selected: `--blue-050` bg, `--brand` text, `--weight-medium`
- Max height: 240px with internal scroll

### Radix Sub-parts (single file)
`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton` — all exported from `select.tsx`.

### Interaction Contract
- `Space` or `Enter` opens dropdown from trigger.
- Arrow keys navigate items.
- `Escape` closes dropdown.
- `Tab` closes dropdown and moves focus to next element.

### Visual Acceptance Test
Open `/preview/select`. Verify:
1. Trigger height 48px, visual parity with Input.
2. Open: dropdown appears with shadow, items scrollable at 240px max.
3. Selected item highlighted with `--blue-050` bg.
4. Keyboard navigation cycles items; `Escape` closes.
5. Focus ring on trigger when keyboard-focused.

---

## 2.5 Checkbox

**Source:** `selection.html`, R4.5. Uses Radix `@radix-ui/react-checkbox`.

### Dimensions
- Box: 20×20px (specimen shows 20px; R4.5 says 18px — use 20px from specimen as authoritative for touch compliance, note discrepancy)
- Border radius: `--radius-xs` (4px)
- Border: `1.5px solid --gray-300` (unchecked)
- Touch target: 44×44px minimum (use padding or wrapper)

> **Claude's Discretion:** Specimen shows 20×20px box; R4.5 says 18px. 20px is used to maintain
> visual fidelity with the specimen and better touch compliance. If DGC design team specifies 18px,
> reduce at implementation time.

### States
| State | Background | Border | Indicator |
|---|---|---|---|
| Unchecked default | `--card` (white) | `--gray-300` (1.5px) | none |
| Unchecked hover | `--blue-050` | `--brand` | none |
| Checked | `--brand` | `--brand` | White checkmark glyph |
| Checked hover | `--brand-hover` | `--brand-hover` | White checkmark glyph |
| Indeterminate | `--brand` | `--brand` | White minus glyph |
| Focus-visible | (current bg) | `--brand` | `--shadow-focus` |
| Disabled unchecked | `--gray-100` | `--gray-200` | none |
| Disabled checked | `--gray-300` | `--gray-300` | White checkmark, low contrast |

Checkmark: `font-weight: 700`, size ~13px, centered; or SVG check icon from Lucide (`Check`).

### Label Pairing
Checkbox always renders with an adjacent label. Gap between box and label text: `--space-2` (8px).
Row layout: `display: flex; align-items: center; gap: --space-2`.

### Interaction Contract
- `Space` toggles checked state.
- Click on label also toggles (standard `<label>` association).
- Radix `onCheckedChange` fires on toggle.

### Visual Acceptance Test
Open `/preview/checkbox`. Verify:
1. Unchecked: white bg, `#BDBDBD` border, 20×20px box.
2. Checked: `--brand` (#0D47A1) fill, white check visible.
3. Disabled: gray fill, no pointer interaction.
4. Focus ring visible on keyboard tab.
5. Khmer label text (`:lang(km)`) renders with `--leading-loose`.

---

## 2.6 Radio

**Source:** `selection.html`, R4.6. Uses Radix `@radix-ui/react-radio-group`.

### Dimensions
- Circle: 20×20px
- Border radius: `--radius-pill` (999px)
- Border: `1.5px solid --gray-300` (unselected)
- Touch target: 44×44px minimum (padding wrapper)

### States
| State | Background | Border | Indicator |
|---|---|---|---|
| Unselected default | `--card` (white) | `--gray-300` (1.5px) | none |
| Unselected hover | `--blue-050` | `--brand` | none |
| Selected | `--card` | `--brand` (1.5px) | 10×10px `--brand` dot, centered |
| Selected hover | `--card` | `--brand-hover` | `--brand-hover` dot |
| Focus-visible | (current bg) | `--brand` | `--shadow-focus` |
| Disabled | `--gray-100` | `--gray-200` | none / gray dot |

Inner dot: `width: 10px; height: 10px; border-radius: 999px; background: var(--brand)`.

> **Note on R4.6 spec:** "white dot on `--accent`" — in `globals.css`, `--accent` is a muted gray surface,
> NOT the DGC blue. The specimen shows a `--brand`-colored dot on white background. This spec uses the
> specimen as authoritative: `--brand` dot on white `--card` background.

### Interaction Contract
- Arrow keys (Up/Down or Left/Right) move selection within `RadioGroup`.
- `Tab` moves between groups, not within items.
- Radix `onValueChange` fires on selection change.

### Visual Acceptance Test
Open `/preview/radio`. Verify:
1. Unselected: white bg, `#BDBDBD` border.
2. Selected: white bg, `--brand` border, `--brand` inner dot 10×10px.
3. Arrow keys cycle selection within group.
4. Focus ring on selected item.

---

## 2.7 Switch

**Source:** `selection.html`, R4.7, CONTEXT specifics. Uses Radix `@radix-ui/react-switch`.

### Dimensions (exact, from R4.7)
- Track: **40px wide × 24px tall** (R4.7 authoritative; specimen shows 36×20 — use R4.7)
- Track border radius: `--radius-pill` (999px)
- Thumb: **18px diameter**, `--radius-pill`
- Thumb offset off: `left: 2px; top: 2px`
- Thumb offset on: `left: 20px; top: 2px` (40 - 18 - 2 = 20px)

> **Claude's Discretion:** Specimen shows 36×20 track / 16px thumb. R4.7 explicitly specifies 40×24 track
> / 18px thumb. R4.7 is used as authoritative per instructions.

### States
| State | Track bg | Thumb bg | Notes |
|---|---|---|---|
| Off default | `--gray-300` | white | |
| Off hover | `--gray-400` | white | |
| On default | `--brand` | white | |
| On hover | `--brand-hover` | white | |
| Focus-visible | (current) | white | `--shadow-focus` on track |
| Disabled off | `--gray-200` | white | `cursor: not-allowed` |
| Disabled on | `--gray-300` | white | `cursor: not-allowed` |

Thumb transition: `left var(--dur-fast) var(--ease-standard)`.
Track transition: `background-color var(--dur-fast) var(--ease-standard)`.

### Interaction Contract
- `Space` toggles switch.
- Touch: 44px minimum target (Switch track + invisible padding).
- `aria-checked` reflects current state (Radix handles this).

### Label Pairing
Row: `display: flex; align-items: center; gap: --space-3 (12px)`.
Label to the right of track.

### Visual Acceptance Test
Open `/preview/switch`. Verify:
1. Off: `#BDBDBD` track, thumb at left.
2. On: `--brand` (#0D47A1) track, thumb at right.
3. Toggle animation: 120ms, smooth.
4. Track dimensions: 40×24px exactly (measure in DevTools).
5. Thumb: 18px diameter.

---

## 2.8 Label

**Source:** `inputs.html` (field label styling), R4.8, CONTEXT specifics.

### Typography
- Font size: `--text-sm` (14px / `0.875rem`)
- Font weight: `--weight-medium` (500)
- Line height: `--leading-normal` (1.5) Latin / `--leading-loose` (1.6) Khmer
- Color: `--foreground` (`--gray-900`)

### Required Asterisk
- Content: `" *"` (space + asterisk, appended after label text)
- Color: `--red-600` (#D32F2F) — this is the ONLY usage of `--red-600` in Phase 3
- `aria-hidden="true"` on the asterisk span (requirement is conveyed by `aria-required` on the input)
- Implementation: `<span aria-hidden="true" className="text-[--red-600] ml-0.5">*</span>`

### A11y
- Rendered as `<label>` HTML element.
- `htmlFor` always matches the associated control's `id`.
- Screen readers announce label text when control is focused.

### Visual Acceptance Test
Open `/preview/form` (Label appears within Form context). Verify:
1. Label text: 14px, weight 500, `#212121`.
2. Required asterisk: `#D32F2F`, immediately after label text.
3. Khmer label text: `--leading-loose` line-height, no clipping.

---

## 2.9 Form

**Source:** R4.9, CONTEXT D-03. Uses `react-hook-form` + `zod`. Single file exporting 7 sub-parts.

### Exported Sub-parts
`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `FormDescription` — shadcn canonical bundle in `form.tsx`.

### FormLabel
Same spec as Label (§ 2.8) — required asterisk applies here.

### FormDescription
- Font: `--text-xs` (12px), `--muted-foreground` (`--gray-600`), `--leading-normal` (1.5)
- Appears below the control, above error message.
- `id` connected via `aria-describedby` on the control.

### FormMessage (error state)
- Font: `--text-xs` (12px), `--danger` (`--red-700`), `--leading-normal` (1.5)
- Content: `aria-live="polite"` so screen reader announces on change.
- Appears below the control (or below FormDescription if present).
- Gap from control: `--space-1` (4px).

> MUST use `--danger` — NOT `text-red-500`, NOT `--destructive`.

### FormItem Layout
```
vertical stack, gap: --space-1 (4px) between each layer:
  FormLabel
  FormControl (wraps Input / Select / etc.)
  FormDescription (optional)
  FormMessage (conditional)
```

### Error State Integration
When `FormField` has an error:
- `FormControl` passes `aria-invalid="true"` and `aria-describedby` to the child control.
- Child control (Input, Select, Textarea) renders in error state automatically via `data-invalid` prop or className merge.

### Interaction Contract
- Form submission: `handleSubmit` from RHF triggers zod validation.
- Validation errors populate `FormMessage` per field.
- Focus moves to first invalid field on failed submit.

### Visual Acceptance Test
Open `/preview/form`. Verify:
1. Submit with empty required field: error message appears in `--danger` red below field.
2. `aria-live` region announces error to screen reader (use browser a11y tools).
3. Error border on Input appears simultaneously with error message.
4. Valid submit: no error messages visible.

---

## 2.10 Badge

**Source:** R4.10, CONTEXT specifics. No dedicated specimen — derived from token spec.

### Dimensions
- Height: 22px
- Padding: `2px 10px`
- Border radius: `--radius-pill` (999px) — pill shape
- Font: `--text-xs` (12px), `--weight-medium` (500), `line-height: 1`
- `display: inline-flex; align-items: center; gap: --space-1 (4px)`

### Tones (exactly 4 — no 5th tone)

| Tone | Background | Foreground |
|---|---|---|
| `default` | `--muted` (`--gray-100`) | `--foreground` (`--gray-900`) |
| `success` | `--success-bg` (`--green-100`) | `--success` (`--green-700`) |
| `warning` | `--warning-bg` (`--amber-100`) | `--warning` (`--amber-700`) |
| `danger` | `--danger-bg` (`--red-100`) | `--danger` (`--red-700`) |

> Source note: R4.10 references `*-bg` token paired with semantic fg. `--info` tone is NOT included in
> Phase 3 — 4 tones only.

### Icon Slot
Optional leading icon: 12px Lucide icon, same color as foreground. `gap: --space-1`.

### CVA Shape
```
variants: { tone: [default, success, warning, danger] }
defaultVariants: { tone: "default" }
```

### States
Badge is non-interactive (no hover/focus states). No `role="button"` unless explicitly made interactive.
For interactive badges: add `tabIndex={0}`, `role="button"`, `--shadow-focus` on `:focus-visible`.

### Visual Acceptance Test
Open `/preview/badge`. Verify:
1. All 4 tones render correct bg/fg pairing.
2. Pill shape with `border-radius: 999px`.
3. Optional icon renders at 12px inline-flex.
4. No 5th tone exists in the playground.

---

## 2.11 Tooltip

**Source:** R4.11, CONTEXT specifics. Uses Radix `@radix-ui/react-tooltip`.

### Dimensions + Visual
- Background: `hsl(var(--gray-900))` (#212121) — NOT `--popover`, NOT `--card`
- Foreground: white (`--brand-foreground`)
- Border radius: `--radius-sm` (8px)
- Padding: `6px 10px`
- Font: `--text-xs` (12px), `--weight-regular`, `line-height: --leading-normal`
- Max-width: 200px
- Shadow: `--shadow-2`

> `--gray-900` is used directly (not via semantic alias) because `--popover` maps to white/card,
> which is the wrong color for tooltip. This is a deliberate exception, noted in CONTEXT specifics.

### Arrow
Optional tooltip arrow (caret): 6×6px, same `--gray-900` fill. Radix `TooltipArrow` component.

### Trigger
- `TooltipTrigger asChild` wraps the trigger element — the trigger itself (button, icon) retains its own focus style.
- Tooltip does NOT steal focus — it is shown on hover + focus, closed on `Escape` or blur.

### Timing
- Open delay: 500ms (Radix default `delayDuration`).
- Close delay: 100ms.

### A11y
- `role="tooltip"` on tooltip content (Radix sets this automatically).
- Trigger must have accessible name (label or `aria-label`).
- Tooltip content is NOT the only way to convey information — visual label must also exist.

### Interaction Contract
- Opens on hover (pointer), focus (keyboard).
- Closes on `Escape`, pointer-leave, blur.
- Does NOT open on touch (mobile users read the label directly).

### Visual Acceptance Test
Open `/preview/tooltip`. Verify:
1. Tooltip bg: `#212121` (dark, not white).
2. Border radius: 8px.
3. Appears on button hover after 500ms.
4. `Escape` closes tooltip.
5. Focus on trigger also shows tooltip.

---

## 2.12 Tabs

**Source:** `tabs.html`, R4.12. Uses Radix `@radix-ui/react-tabs`.

### Variants
1. **Underline** (default) — border-bottom indicator, white bg container
2. **Pill** (segmented) — no underline, active tab gets `--shadow-1`, white bg on active pill

### Underline Variant Dimensions
- Container: `display: flex; background: --card (white); border-radius: --radius-md (12px); border: 1px solid --border; overflow: hidden`
- Tab height: 44px (touch target)
- Tab padding: `0 --space-2 (8px)`
- Tab flex: `flex: 1; min-width: 0`
- Underline indicator: `height: 2px; background: --brand; border-radius: 2px 2px 0 0; position: absolute; bottom: 0; left: --space-2; right: --space-2`
- Font: `--font-khmer` (specimens show Khmer; Latin also supported), `--text-sm` (14px), `--weight-medium` inactive / `--weight-semibold` active

### Pill Variant Dimensions
- Container: `background: --background; border: 1px solid --border; padding: 4px; gap: 2px; border-radius: --radius-md`
- Tab height: 36px
- Tab border radius: `--radius-sm` (8px)
- No underline indicator

### Tab States

#### Underline variant
| State | Color | Background | Indicator |
|---|---|---|---|
| Inactive default | `--muted-foreground` (`--gray-600`) | transparent | none |
| Inactive hover | `--foreground` (`--gray-900`) | `--background` (`--gray-050`) | none |
| Active | `--brand` | transparent | 2px `--brand` underline |
| Focus-visible | (current) | (current) | `--shadow-focus` |
| Disabled | `--gray-400` (`--muted-foreground`) | transparent | `cursor: not-allowed` |

#### Pill variant
| State | Color | Background | Shadow |
|---|---|---|---|
| Inactive | `--muted-foreground` | transparent | none |
| Inactive hover | `--foreground` | transparent | none |
| Active | `--brand` | `--card` (white) | `--shadow-1` |
| Focus-visible | (current) | (current) | `--shadow-focus` |

### Count Badge (optional)
- Height: 18px; min-width: 20px; padding: `0 6px`; border-radius: `--radius-pill`
- Inactive: bg `--blue-050`, color `--brand`, font `--font-latin`, `--text-xs` (10px actually — see specimen), `--weight-semibold`
- Active: bg `--brand`, color white
- Font family: `--font-latin` (numerals always Latin, even in Khmer context)

### Radix Sub-parts (single file)
`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — all exported from `tabs.tsx`.

### Static-Specimen-Compatible
Tabs MUST support both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes.
Docs/static examples may use `defaultValue` without state management.

### Interaction Contract
- Arrow keys (Left/Right) cycle between tabs within `TabsList`.
- `Tab` key moves focus to active panel content.
- `Home`/`End` jump to first/last tab.
- Radix handles all keyboard behavior.

### Visual Acceptance Test
Open `/preview/tabs`. Verify:
1. Underline: active tab has 2px brand underline, `--weight-semibold`.
2. Pill: active tab has white bg + `--shadow-1`.
3. Count badge inverts (white text on brand bg) when tab is active.
4. Disabled tab: gray text, no interaction.
5. Arrow keys cycle tabs.
6. Khmer tab labels render at `--leading-loose`.

---

## 2.13 Separator

**Source:** R4.13. Uses Radix `@radix-ui/react-separator`.

### Visual Spec
- Thickness: **1px**
- Color: `1px solid var(--border)` (`--gray-200`)
- Orientation: `horizontal` (default) or `vertical`
- Horizontal: `width: 100%; height: 1px; border: none; border-top: 1px solid var(--border)`
- Vertical: `height: 100%; width: 1px; border: none; border-left: 1px solid var(--border)`

> MUST be `var(--border)` — NOT `border-muted`, NOT hardcoded `#E0E0E0`.

### Margins
- Default: no margin (consuming layout provides spacing).
- Recommended usage: wrap in a container with `margin: --space-4 0` when used as section divider.

### A11y
- `role="separator"` (Radix sets this).
- `aria-orientation` reflects horizontal/vertical.

### Visual Acceptance Test
Open `/preview/separator`. Verify:
1. Horizontal: 1px line, full width, `--border` color.
2. Vertical: 1px line, full height of container.
3. DevTools: no `border-muted`, no hardcoded color.

---

## 2.14 ScrollArea

**Source:** R4.14. Uses Radix `@radix-ui/react-scroll-area`.

### Dimensions
- Container: 100% width × height set by consumer (no default height — must be explicitly constrained).
- Scrollbar width: 8px (thumb)
- Scrollbar track: transparent
- Scrollbar thumb: `--gray-300`, `--radius-pill`; hover: `--gray-400`
- Scrollbar corner: transparent

### Behavior
- Custom scrollbar replaces native scrollbar.
- Scrollbar appears on hover of scroll area (fade in/out, `--dur-fast`).
- `type="hover"` (Radix default): scrollbar visible only on hover/focus.

### Usage Context
Intended for: drawer/sheet content, long dropdown lists, modal body scroll.
Consumer MUST set explicit `height` or `max-height` on `<ScrollArea>` — the component does not self-constrain.

### A11y
- `role="region"` with `aria-label` required when ScrollArea wraps content (for screen reader landmark).
- Scrollable content must be keyboard-accessible (Tab to items inside).

### Visual Acceptance Test
Open `/preview/scroll-area`. Verify:
1. Scrollbar appears on hover, fades when pointer leaves.
2. Thumb: `#BDBDBD` gray, pill-radius.
3. Content scrolls smoothly via keyboard (Page Up/Down, arrow keys).
4. Scrollbar does not overflow outside container bounds.

---

## § 3 — Khmer Rendering Protocol

### Global Cascade
Applied in `@layer base` of `globals.css` (Phase 2 — already shipped):
```css
:lang(km), [lang="km"], .khmer {
  font-family: var(--font-khmer);
  line-height: var(--leading-loose); /* 1.6 */
}
```

This cascade affects ALL primitives automatically when `lang="km"` is set on `<html>` or an ancestor.

### Rules for All Primitives
1. No per-component `lang` branching in TSX source. Khmer cascade is global.
2. No per-component `line-height` overrides that would conflict with `--leading-loose`.
3. Primitives with fixed heights (Button, Input, Switch) must accommodate `1.6` line-height without clipping. Because text is vertically centered via flex `align-items: center`, the line-height only affects multi-line scenarios — single-line primitives are safe.
4. Textarea must not set a fixed height — it sets `min-height` only.
5. Tabs use `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` on label span to prevent wrapping at short widths.

### Bilingual Pairing Rule
- Khmer text on line 1, English on line 2.
- Never interleave scripts within a single sentence.
- In docs examples, show Khmer label above English sublabel (see `type-bilingual.html`).

### Test Page
Every primitive must render on `/test/khmer` with Khmer labels/placeholders. Playwright visual-diff snapshot committed. CI fails on diff (D-17).

---

## § 4 — Dark Mode Protocol

### Zero Per-Component Logic
All primitives MUST NOT contain:
- `dark:` Tailwind utility classes
- `isDark` prop or conditional class logic
- Inline style conditionals based on color scheme

### How It Works
`.dark` class on `<html>` causes `globals.css` to override all `--*` HSL values. Primitives read semantic aliases (`--card`, `--foreground`, `--border`, `--brand`, etc.) which resolve to dark values automatically.

### Exceptions
- `--gray-900` on Tooltip background: this does not flip in dark mode by design (dark tooltip on dark bg is fine — always high contrast). If dark-mode tooltip contrast fails axe audit, switch to `--popover` with `--popover-foreground` and set `--popover` to a dark value in `.dark`.
- `--red-600` on Label asterisk: this is a scale token, not semantic. In dark mode it will NOT flip. If dark-mode contrast fails, switch to `--danger` in the future.

### Verification
Playground's theme toggle (light/dark) must pass visual inspection on all 14 primitives. `axe-core` CI runs in both light and dark mode.

---

## § 5 — Accessibility Protocol

### Global Rules
1. **Focus ring**: all interactive primitives apply `--shadow-focus` on `:focus-visible`. No `outline` (set to `none`). The focus ring `border-radius` must match the component's own radius token.
2. **Touch targets**: minimum 44×44px. Button height 48px satisfies this. Checkbox, Radio, Switch use invisible padding or wrapper to reach 44px.
3. **Contrast**: body text 4.5:1 minimum (WCAG AA). `--foreground` on `--background` passes. `--brand-foreground` on `--brand` passes. `--gray-500` on `--gray-200` (disabled) = 4.54:1 — passes AA.
4. **Keyboard navigation**: Tab/Shift+Tab, Enter/Space activate. Esc closes overlays. Arrow keys navigate grouped controls (Radio, Tabs, Select).
5. **ARIA**: all primitives use correct `role` via Radix (Radix handles most automatically). FormMessage uses `aria-live="polite"`.
6. **No `aria-label` on decorative**: Lucide icons in buttons/badges get `aria-hidden="true"`.

### Per-Primitive Delta
| Primitive | ARIA note |
|---|---|
| Button | `aria-disabled="true"` (not `disabled`) when loading state to keep focusable |
| Input | `aria-invalid`, `aria-describedby` (FormMessage id) |
| Textarea | Same as Input |
| Select | Radix manages `aria-expanded`, `aria-haspopup` on trigger |
| Checkbox | Radix manages `aria-checked` |
| Radio | Radix manages `aria-checked`, `role="radio"` |
| Switch | Radix manages `aria-checked`, `role="switch"` |
| Label | `htmlFor` required; asterisk span `aria-hidden="true"` |
| Form | FormMessage `aria-live="polite"`, `id` for `aria-describedby` |
| Badge | `role="status"` if conveying live status; otherwise decorative |
| Tooltip | Radix sets `role="tooltip"`; trigger needs accessible name |
| Tabs | Radix sets `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Separator | Radix sets `role="separator"`, `aria-orientation` |
| ScrollArea | Consumer must add `aria-label` on scroll region |

### CI Gate
`pnpm test:a11y` runs `@axe-core/playwright` against every `/preview/<item>` route. Violations block deploy.

---

## § 6 — Playground Acceptance Checklist

Each primitive has a playground route at `/preview/<item>`. The following checklist applies to all.

### Universal Checks (all 14 primitives)
- [ ] Component renders in light mode without visual errors.
- [ ] Theme toggle switches to dark mode — component reads dark tokens without `dark:` classes in TSX.
- [ ] Language toggle sets `lang="km"` on playground frame — Khmer text renders with `--font-khmer` and `--leading-loose`, no clipping.
- [ ] Mobile viewport (375px) — component does not overflow or break layout.
- [ ] Tab key reaches interactive element; focus ring is visible (3px blue glow).
- [ ] `axe-core` audit returns 0 violations (DevTools Accessibility panel or Playwright report).

### Per-Primitive Checks

| Primitive | Specific acceptance criteria |
|---|---|
| **Button** | All 4 variants × 2 sizes render; disabled state uses gray fill (not opacity); loading spinner animates; Khmer label fits in default height |
| **Input** | All 4 states (default/focus/error/disabled) togglable via playground controls; date input with Khmer placeholder visible |
| **Textarea** | Min-height 88px; resize handle visible and functional; error state matches Input error state |
| **Select** | Dropdown opens on Space/Enter; items keyboard-navigable; selected item highlighted; closes on Escape |
| **Checkbox** | Checked/unchecked/indeterminate/disabled states toggleable; checkmark glyph visible; 20×20px box |
| **Radio** | Group of 3 options; arrow keys cycle; selected dot visible; one item always selected |
| **Switch** | Off/on toggle; track 40×24px; thumb 18px; thumb slides smoothly; Khmer label adjacent |
| **Label** | Required/optional states; asterisk visible in `--red-600`; Khmer label at 1.6 line-height |
| **Form** | Full field stack (Label + Input + Description + Message); submit with empty required triggers error; error message in `--danger` |
| **Badge** | All 4 tones visible; with/without icon; pill shape |
| **Tooltip** | Dark bg tooltip on hover and keyboard focus; dismisses on Escape; 500ms open delay |
| **Tabs** | Underline and Pill variants; with/without count badges; disabled tab; arrow key navigation; Khmer labels |
| **Separator** | Horizontal and vertical orientation; 1px `--border` color |
| **ScrollArea** | Constrained height container with overflow content; scrollbar appears on hover; keyboard scrollable |

---

## § 7 — Open Questions Resolved (Claude's Discretion)

| Item | Decision | Rationale |
|---|---|---|
| `--accent` vs `--brand` for interactive blue | Use `--brand` exclusively for DGC CTA/interactive blue. `--accent` in `globals.css` maps to `--gray-100` (muted surface) — using it for interactive elements would break contrast. | Direct reading of `globals.css` Phase 2 output. |
| Checkbox size: 18px (R4.5) vs 20px (specimen) | 20×20px from specimen. | Specimen is visual source of truth; 20px improves touch area and matches selection.html exactly. |
| Switch size: R4.7 (40×24) vs specimen (36×20) | 40×24 from R4.7. | R4.7 takes precedence over specimen when they conflict; 40×24 is a larger touch-friendlier size. |
| Radio dot color: R4.6 "white dot on `--accent`" | `--brand` dot on white bg. | `--accent` in globals.css ≠ DGC blue. Specimen shows blue dot on white. Specimen is authoritative. |
| Tooltip bg: `--gray-900` vs `--popover` | `--gray-900` directly. | R4.11 explicitly specifies `--gray-900`. Dark tooltip on any bg provides maximum contrast. |
| `asChild` on interactive primitives | Expose on Button, Tooltip.Trigger, TabsTrigger. | Standard shadcn pattern; allows polymorphic rendering (e.g., `<Button asChild><Link /></Button>`). |
| Spacing scale discrepancy (colors_and_type.css vs globals.css) | Use `globals.css` values as authoritative. | globals.css is the Phase 2 shipped output; `colors_and_type.css` is a source reference pre-conversion. |
| Dark-mode Tooltip bg | No flip — `--gray-900` stays dark in both modes. | Tooltip is always dark bg; in dark mode this remains appropriate. Flag for axe review. |
| Label asterisk dark-mode | `--red-600` does not flip; acceptable for now. | Contrast of `--red-600` on dark bg should be verified in CI; switch to `--danger` if it fails. |

---

## UI-SPEC COMPLETE

**Phase:** 3 — Primitives (14 items)
**Design System:** dgc-theme (Phase 2, `globals.css`) — no shadcn preset init needed (theme already shipped)

### Contract Summary
- Spacing: 4px base scale, 8 steps (`--space-1` through `--space-8`)
- Typography: 4 sizes used in primitives (`--text-xs` 12px, `--text-sm` 14px, `--text-base` 16px, `--text-lg` 18px); 3 weights (400/500/600)
- Color: `--brand` for interactive blue (CTA), `--foreground`/`--muted-foreground` for text hierarchy, `--danger`/`--success`/`--warning`/`--info` for semantic states
- Copywriting: n/a (primitives are structural; copywriting is consumer-provided)
- Registry: shadcn official only — no third-party registries

### Files Created
`D:/sources/dgc-miniapp-design-system/.planning/phases/3-primitives/3-UI-SPEC.md`

### Pre-Populated From
| Source | Decisions Used |
|---|---|
| CONTEXT.md | 19 implementation decisions (D-01 through D-19), all specifics, all deferred items |
| REQUIREMENTS.md | All R4.1–R4.14 exact values |
| globals.css (Phase 2) | All token values, `--brand` rename, spacing scale, shadow/radius/motion |
| Visual specimens (7 files) | Exact px dimensions, state colors, Khmer rendering rules, tab anatomy |
| PROJECT.md | WCAG AA, 44px touch, government tone, Khmer-first |
| User input | 0 (--auto mode; all resolved from source material) |
