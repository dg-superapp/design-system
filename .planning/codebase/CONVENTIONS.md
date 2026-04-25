# Coding Conventions

**Analysis Date:** 2026-04-24

## Stack Baseline

Vanilla HTML + CSS + one IIFE in `builder/app.js`. No framework, no bundler, no
TypeScript, no linter, no formatter config. Browser-native ES modules are used
only in Playwright test rigs (`builder/tests/*.mjs`).

## Naming Patterns

**Design tokens (CSS custom properties):**
- Kebab-case, prefixed by category: `--blue-950`, `--text-body`, `--space-4`,
  `--radius-md`, `--shadow-focus`, `--bg-surface`, `--fg-on-primary`. See
  `builder/styles.css:70-102`.
- Color scales use `--{hue}-{weight}` (050..950). Semantic aliases sit on top:
  `--accent`, `--accent-hover`, `--border-focus`.
- Numeric ramps are integer-indexed (`--space-1`..`--space-8`,
  `--radius-xs|sm|md|lg|pill`, `--text-caption|body-sm|body|section|title|title-lg|display`).

**DOM classes (BEM-ish):**
- Block: `.app-header`, `.editor`, `.preview`, `.color-row`.
- Element: `.app-header__title`, `.editor__tab`, `.color-row__input`,
  `.color-row__contrast`, `.color-row__vals`, `.field-p__lbl`.
- Modifier: `.alert--info`, `.alert--success`, `.alert--warning`,
  `.alert--danger`, `.btn--sm`. State flags use `.is-active`.

**IDs (editor control hooks only):**
- camelCase on interactive controls referenced from `app.js`:
  `#resetBtn`, `#copyCss`, `#copyJson`, `#exportBtn`, `#themeToggle`,
  `#tokenCss`, `#tokenJson`, `#brandName`, `#brandTagline`, `#brandDesc`,
  `#logoLight`, `#logoLightPreview`, `#logoDark`, `#logoDarkPreview`,
  `#logoClear`, `#logoClearVal`, `#fontLatin`, `#fontKhmer`, `#lang`,
  `#scaleList`, `#spaceList`, `#radiusList`, `#shadowList`, `#stage`, `#toast`.

**Data attributes:**
- `data-panel="color|type|space|radius|shadow|tokens|brand"` on `.editor__tab`
  and `.panel` pair.
- `data-view="guide|components|landing|dashboard|form|mobile"` on `.mode`
  buttons; matches keys in `stageRenderers` (`builder/app.js:240`).
- `data-k="--token-name"` on every range/color/text input in editor panels —
  this is how `app.js` writes back to `:root` via
  `document.documentElement.style.setProperty(data-k, value)`.

## Code Style

**JS (`builder/app.js`):**
- Single IIFE-style file, ~1000 LOC, organized by section comment banners.
- `const` by default, `let` only when reassigned (`let currentView = 'guide'`
  at `builder/app.js:237`).
- 2-space indent. Single quotes. Semicolons. Template literals for HTML strings.
- Short helpers at top: `$` = `document.querySelector`, `$$` = `querySelectorAll`.
- Event handlers attached imperatively (`el.addEventListener('input', ...)`).
- Preview HTML is built via tagged template literal strings in the
  `stageRenderers` map; no virtual DOM, no diffing.

**CSS (`builder/styles.css`):**
- `:root` block declares all tokens first, then globals, then components.
- One selector per line for multi-rule blocks, but short single-property rules
  are allowed inline (`.btn-sm{height:36px;padding:0 12px;...}`).
- All component values reference tokens — no hardcoded colors/spacings inside
  component rules. Example: `builder/styles.css:217` uses
  `height:var(--button-h); padding:0 16px; border-radius:var(--radius-md)`.

**HTML (`builder/index.html`):**
- 2-space indent. Lowercase tags, kebab-case class names.
- Google Fonts loaded with preconnect; one `<link>` with every family
  (`builder/index.html:9`).

## Import / Script Organization

- `index.html` loads `styles.css`, Google Fonts, then `app.js` and the
  `lucide` icon CDN. Icons are rendered after each stage render via
  `window.lucide && lucide.createIcons()` (`builder/app.js:238`).
- No build pipeline. Everything runs off `file://` or a static server.

## Copy & Content Rules (from `project/README.md:70-111` "CONTENT FUNDAMENTALS")

- **Tone:** plain, direct, institutional. Never casual, never clever.
- **Casing:** sentence case only for UI copy. No Title Case on buttons, labels,
  headings. Acronyms stay uppercase.
- **Bilingual order:** Khmer first, English second. Khmer on line 1, English on
  line 2 or in a lighter weight beneath.
- **Line-height:** Khmer runs 1.5–1.6 to fit subscripts and coeng.
- **No italics** in either script — Khmer italics are unreadable.
- **No emoji** in product UI. Single exception: 🇰🇭 flag in branding/marketing
  contexts, never inside service flows.
- **Currency:** `៛` before the amount, space-separated (`៛ 12,500`); USD as
  `$12.50`.

## Typography Families

Loaded in `builder/index.html:9`:
- Latin: Inter, IBM Plex Sans, Roboto, JetBrains Mono.
- Khmer: Noto Sans Khmer (primary), Kantumruy Pro (display alt), Battambang,
  Moul (display/heading only). Battambang was missing from the Google Fonts
  import until a recent patch — confirm it is present on any font-family edit.
- Khmer often needs +1px over Latin at the same optical size
  (`project/README.md:127`).

## Accessibility Baseline

Targets WCAG AA (`project/README.md:32, 223`):
- **Contrast:** Disabled state uses `--bg-disabled` `#E0E0E0` +
  `--fg-on-disabled` `#757575` (4.54:1). Never ship `#BDBDBD` on white.
- **Touch targets:** `--touch-min: 44px` and `--button-h: 48px`, `--input-h: 48px`
  declared at `builder/styles.css:102`. Interactive rows use `min-height:48px`
  (`builder/styles.css:308`). Clear/reset links must meet the 44px target with
  vertical padding (`project/README.md:256`).
- **Focus ring:** `--shadow-focus: 0 0 0 3px rgba(21,101,192,0.25)` at
  `builder/styles.css:97`. Applied globally via
  `:focus-visible{outline:none;box-shadow:var(--shadow-focus);border-radius:var(--radius-sm)}`
  at `builder/styles.css:131`, and on inputs at `builder/styles.css:280`.
- **No italics**, no motion on critical flows, no color-only state.

## Adding a New Token

1. Declare under `:root` in `builder/styles.css:70-102` in the appropriate
   ramp block (color / type / space / radius / shadow).
2. Add a matching editor row in `builder/index.html` inside the relevant
   `.panel[data-panel="..."]` block, using an input with
   `data-k="--your-token"`.
3. `app.js` wires generic `input[data-k]` listeners — the new control writes to
   `:root` automatically if it follows the `data-k` contract.
4. The Tokens panel's CSS/JSON outputs are generated by reading the same map,
   so exports pick it up with no extra code.

## Adding a New Preview Component

1. Extend the `stageRenderers` map in `builder/app.js:240`. Each key matches a
   `.mode[data-view="..."]` button: `guide`, `components`, `landing`,
   `dashboard`, `form`, `mobile`. Add a new key and a function returning an
   HTML string written into `#stage`.
2. If adding a new view, also add a `<button class="mode" data-view="...">` in
   `builder/index.html`.
3. Add component styles to `builder/styles.css` using existing tokens only — no
   raw hex, no raw pixel values outside the token system.
4. If icons are used, rely on the `data-lucide="name"` attribute; the renderer
   calls `lucide.createIcons()` after each stage render
   (`builder/app.js:238`).
5. Add selectors for the new component to the `modeChecks` array in
   `builder/tests/full.mjs:212-219` so the full rig asserts it renders.

## Function & Module Design

- Functions are small, top-level inside the IIFE. No classes. No async except
  around `FileReader` and `navigator.clipboard` calls.
- Exports: none — single-file app, state held in module-scope `let`s
  (`currentView`, the tokens map, brand fields).
- Comments: section banners (`/* ============ BRAND ============ */`) and
  one-liners for non-obvious behaviour. No JSDoc.

## Linting / Formatting

**None configured.** No `.eslintrc`, no `.prettierrc`, no `biome.json`, no
`editorconfig`. Style is enforced by convention only.

---

*Convention analysis: 2026-04-24*
