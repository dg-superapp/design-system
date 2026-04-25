# Testing Patterns

**Analysis Date:** 2026-04-24

## Test Framework

**Runner:** Playwright (`playwright` `^1.59.1`) driven directly through Node,
no `@playwright/test` runner, no config file. Each rig is a plain `.mjs`
script that launches Chromium, walks the UI, records pass/fail, prints a
summary, and exits non-zero on any failure.

- Smoke rig: `builder/tests/smoke.mjs` (~110 LOC)
- Full rig:  `builder/tests/full.mjs`  (~280 LOC)
- Deps:     `builder/tests/package.json` (`type: module`, single dep:
  `playwright`)

**Target URL:** `file://` URL of `builder/index.html` (resolved via
`pathToFileURL(INDEX)` in both rigs). No dev server, no network.

**Viewport:** 1440×900 by default; `full.mjs` also switches to 720×900 to
check the responsive collapse.

## Install + Run

```bash
cd builder/tests
npm install
node smoke.mjs        # fast smoke (tabs, one edit per panel, preview modes, reset, theme, clipboard)
node full.mjs         # exhaustive (every token, brand panel, export download, interactions, responsive)
```

Screenshots land in:
- `builder/tests/screenshots/`       (smoke — one per preview mode + `dark.png`)
- `builder/tests/screenshots-full/`  (full — per preview mode + `responsive-720.png`)

Download artifacts (exported token bundle, test logo SVG) land in
`builder/tests/downloads/`.

## Test Structure

Both rigs use the same shape:
- A `rec(name, ok, detail)` helper pushes a result and prints `PASS|FAIL name — detail`.
- `page.on('pageerror')` and `page.on('console')` feed an `errors` array; in
  `full.mjs` a final assertion requires `errors.length === 0`.
- One long `try { ... } catch (e) { rec('unexpected throw', false, ...) } finally { browser.close() }` block.
- Exit code 1 if any result failed.

No suites, no `describe`/`it`, no fixtures beyond an inline SVG written to disk
for the logo upload test.

## Smoke Rig — `builder/tests/smoke.mjs`

| Selector / action | Line | Asserts |
|---|---|---|
| `.editor__tab.is-active` (wait) | 23 | Page boots and initial panel is active |
| `.app-header__title` text | 27 | Header renders "Design System Builder" |
| `.editor__tab[data-panel="{color,type,space,radius,shadow,tokens,brand}"]` | 32-36 | Each tab activates its matching `.panel[data-panel]` |
| `.color-row__input` (first) → `input` event with `#ff0000` | 40-43 | `--blue-950` on `:root` updates live to `#ff0000` |
| `#scaleList input[data-k="--text-body"]` → `20` | 48-53 | `--text-body` becomes `20px` |
| `#radiusList input[data-k="--radius-md"]` → `2` | 56-62 | `--radius-md` becomes `2px` |
| `#resetBtn` | 65-67 | `--blue-950` restored to `#0A2A6B` |
| `.mode[data-view="{guide,components,landing,dashboard,form,mobile}"]` | 70-77 | Each preview renders >20 chars into `#stage`; screenshots captured |
| `#themeToggle` | 80-82 | `documentElement.dataset.theme === 'dark'`; dark screenshot saved |
| `#tokenCss` / `#tokenJson` text length | 87-90 | Both outputs >200 chars |
| `#copyCss` + `navigator.clipboard.readText()` | 94-96 | Clipboard contains `:root` |

## Full Rig — `builder/tests/full.mjs`

Organized in 13 numbered blocks via comment banners.

**1. Brand panel** (`full.mjs:34-76`)
- `#brandName`, `#brandTagline` (Khmer string "សាកល្បង"), `#brandDesc`
  propagate into landing + mobile preview text (`#stage`).
- `#logoClear` range updates `#logoClearVal` label to `2×`.
- `#logoLight` / `#logoDark` `setInputFiles` with an on-disk SVG; asserts
  `#logoLightPreview.src` and `#logoDarkPreview.src` become `data:image` URLs.

**2. Color panel** (`full.mjs:79-104`)
- Counts `.color-row__input` === 18 tokens.
- `.color-row__contrast` badge count equals picker count.
- `.color-row__vals` text matches `/#[0-9A-F]{6}.*rgb\(.*hsl\(/i`.
- Editing `.color-row__input[data-k="--blue-900"]` to `#00aa44` propagates to
  `.btn-primary` background in the Components preview (`rgb(0, 170, 68)`),
  confirming the `--blue-900 → --accent` alias chain.

**3. Typography panel** (`full.mjs:107-123`)
- `#fontLatin` select set to `Roboto` (font-family wiring is noted as
  unimplemented — no assertion on CSS).
- Every `#scaleList input[data-k]` for `--text-caption|body-sm|body|section|title|title-lg|display`
  set to `22`, each asserted on `:root` as `22px`.

**4. Spacing panel** (`full.mjs:127-135`)
- Every `#spaceList input[data-k="--space-1..8"]` set to `10`, asserted as `10px`.

**5. Radius panel** (`full.mjs:138-147`)
- Every `#radiusList input[data-k="--radius-xs|sm|md|lg|pill"]` set to `6`, asserted as `6px`.

**6. Shadow panel** (`full.mjs:150-157`)
- `#shadowList input[data-k="--shadow-1"]` set to `0 4px 10px rgba(0,0,0,0.1)`;
  asserted substring `4px 10px`.

**7. Tokens panel — export + clipboard** (`full.mjs:160-183`)
- `#tokenCss` includes `:root`, `--accent:`, and the earlier `#00aa44` edit.
- `#copyJson` + `navigator.clipboard.readText()` → `JSON.parse`; asserts
  `color`, `typography`, `spacing` sections exist and
  `color['blue-900'].source === 'colors_and_type.css'` (source label contract).
- `#exportBtn` triggers a download saved to `downloads/design-tokens.json`;
  asserts file size > 500 bytes and the bundle has `css`, `json`, and
  `brand.name === 'Test Brand'`.

**8. Reset** (`full.mjs:186-192`)
- `#resetBtn` shows `#toast`, restores `--blue-900` to `#0D47A1` and
  `--text-body` to `16px`.

**9. Theme + language** (`full.mjs:195-209`)
- `#themeToggle` flips `documentElement.dataset.theme` between `dark` and
  empty/`light`. Dark sets `--bg-page` to `#0B1020`.
- `#lang` toggles `documentElement.lang` between `km` and `en`.

**10. Preview modes — interactive elements** (`full.mjs:212-228`)
Per-mode selector checks (each must have count > 0):
- `guide`: `.palette .sw`, `.spec .row`, `.sample-radius`, `.sample-shadow`
- `components`: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.input-p`,
  `.alert--info|success|warning|danger`, `.tabs .t`, `.badge`, `.nav-row`,
  `.modal-demo`, `table.tbl`, `.empty`, `.skeleton`, `.spinner`, `.switch`,
  `.check`, `.rad`
- `landing`: `.hero`, `.grid .tile`, `.stat`
- `dashboard`: `.dash .stat`, `.tbl`, `.tabs`
- `form`: `.hero`, `.input-p`, `textarea.input-p`, `.alert--info`
- `mobile`: `.mobile-frame`, `.mobile-frame .topbar`, `.mobile-frame .tabbar`,
  `.mobile-frame .grid .tile`

**11. Component interactions** (`full.mjs:231-256`)
- `label.switch` click flips the hidden `.switch input` checked state.
- `.tabs .t` click is asserted NOT to toggle `.is-active` — preview tabs are
  decorative only; this is codified as intended behaviour.
- `.btn-primary` hover produces a `backgroundColor` matching `/rgb/`.
- `.input-p:focus` has a non-`none` `boxShadow` (the `--shadow-focus` ring).

**12. Responsive** (`full.mjs:259-264`)
- Viewport 720×900 → `.workspace` `grid-template-columns` collapses to a
  single column. Screenshot saved as `responsive-720.png`. Viewport restored
  to 1440×900 after.

**13. Errors** (`full.mjs:267`)
- Final gate: `errors.length === 0` (no `pageerror`, no `console.error`).

## Interactive Browser Testing

Beyond the automated rigs, interactive testing is done through the
`claude-in-chrome` MCP bridge against a locally served copy of
`builder/index.html` at `http://localhost:8765`. Serve the `builder/`
directory with any static server (e.g. `python -m http.server 8765`) from
that folder.

## What Is NOT Tested

- No unit tests, no JS module tests, no visual regression baseline.
- `#fontLatin` / `#fontKhmer` selects do not verify the applied font-family
  on `:root` — `full.mjs:111` explicitly notes the skip. The handler exists
  at `builder/app.js:791-798` but is not asserted.
- No CI pipeline. Playwright is the only automated check; it runs manually.
- No linter (`eslint`, `biome`) and no formatter (`prettier`) are configured,
  so no style checks.

## Fixtures

- SVG logo fixture is written inline to `downloads/test-logo.svg` at
  `full.mjs:65-67` and uploaded via `setInputFiles`. No `fixtures/` directory.

## Debugging a Failure

1. Run `node full.mjs` and scan the `FAIL` lines — each includes a detail
   string (the actual value observed).
2. Check the matching screenshot in `screenshots-full/` to see the stage at
   the time the assertion ran.
3. If a selector listed under `modeChecks` (`full.mjs:212-219`) fails with
   count 0, the preview renderer in `stageRenderers`
   (`builder/app.js:240`) is the place to look.

---

*Testing analysis: 2026-04-24*
