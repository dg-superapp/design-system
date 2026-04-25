# Codebase Concerns

**Analysis Date:** 2026-04-24
**Scope:** `builder/` editor + `project/` static guideline (vanilla HTML/CSS/JS, no bundler)

---

## Tech Debt

### No root-level package.json / no one-command dev server
- **Severity:** med
- **Evidence:** `D:/sources/dgc-miniapp-design-system/` root contains only `README.md`, `builder/`, `project/`, `image-prompt.txt`. The only `package.json` is `builder/tests/package.json` (Playwright tests). `builder/index.html` references `./app.js` and `./styles.css` directly.
- **Impact:** New contributors must know to run `python -m http.server` manually; `file://` URLs are blocked by the `claude-in-chrome` extension used for smoke tests; no `npm start` / `npm run dev`.
- **Next step:** Add a root `package.json` with `"dev": "python -m http.server 8080"` (or a tiny node `http-server` dev-dep) and document it in `README.md`.

### Hard CDN dependency for icons and fonts
- **Severity:** med
- **Evidence:** `builder/index.html:10` loads `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`; line 9 loads Google Fonts (`Battambang`, `IBM Plex Sans`, `Inter`, `JetBrains Mono`, `Kantumruy Pro`, `Moul`, `Noto Sans Khmer`, `Roboto`). No local fallback bundled.
- **Impact:** Offline/air-gapped usage silently degrades — icons disappear (`<i data-lucide="…">` stays empty because `window.lucide` is undefined, guarded at `app.js:238, 823, 871`), Khmer + Latin typography falls back to system fonts, contrast/line-height appearance shifts.
- **Next step:** Vendor Lucide UMD + the WOFF2 font files into `builder/vendor/`; swap `<link>`/`<script>` to local paths; keep CDN as a commented fallback.

### No persistence — editor state lost on reload
- **Severity:** high
- **Evidence:** `builder/app.js` has zero `localStorage` / `sessionStorage` / `IndexedDB` calls. Only escape hatch is `#exportBtn` at `app.js:855-865` (downloads `design-tokens.json`).
- **Impact:** An hour of token tuning vanishes on accidental refresh or tab close; no autosave warning.
- **Next step:** Persist `{COLORS, TYPE, SPACES, RADII, SHADOWS, brand, fontLatin, fontKhmer, theme}` to `localStorage` on every `renderTokens()`; hydrate in `renderAll()`; add a "Clear saved state" entry next to `#resetBtn`.

### Reset button only clears token arrays — brand + fonts persist
- **Severity:** med
- **Evidence:** `app.js:837-848` iterates `SEED` which only contains `COLORS, SPACES, RADII, SHADOWS, TYPE`. `#brandName`, `#brandTagline`, `#brandDesc`, `#fontLatin`, `#fontKhmer`, `#logoLightPreview`, `#logoDarkPreview`, `--font-latin`, `--font-khmer` are never reset.
- **Impact:** "Reset to guideline defaults" is misleading — user-typed brand copy and custom logos survive; a half-reset state is easy to ship by accident.
- **Next step:** Extend reset to clear brand inputs, restore default `<select>` values (`Inter`, `Noto Sans Khmer`), remove inline `--font-*` vars via `root.style.removeProperty`, and reset logo `<img src>` to the bundled defaults.

### Dual mobile preview paradigms coexist
- **Severity:** low
- **Evidence:** `stageRenderers.mobile()` in `app.js:733-767` renders a fixed 390×780 phone chrome (`styles.css:346` `.mobile-frame{width:390px;height:780px}`). Separately, `#viewportMobile` checkbox (`app.js:832-834`) toggles `#stage.is-mobile` which constrains any view to 430px (`styles.css:406`).
- **Impact:** Two competing "what does mobile look like?" answers; users toggle both and get 390px inside a 430px frame.
- **Next step:** Pick one — either drop the `.mobile-frame` chrome view and always use the `#viewportMobile` toggle, or hide `#viewportMobile` while `currentView === 'mobile'`.

### Decorative-only segmented tabs / tabs in components view
- **Severity:** low
- **Evidence:** `stageRenderers.components()` renders `.seg__o` and `.tabs .t` buttons at `app.js:440-445` with no click handler; `is-active` is a static class.
- **Impact:** Visitors expect these to switch; clicking feels broken. OK as pure specimens, but label them.
- **Next step:** Either wire simple class-toggle on click, or add `aria-disabled="true"` + tooltip "Static specimen".

### `eval()` used for dynamic array lookup in reset
- **Severity:** low
- **Evidence:** `app.js:839` uses `eval(k)` where `k` is `'COLORS'`, `'TYPE'`, etc.
- **Impact:** No actual security risk (keys are hard-coded in `SEED`), but triggers CSP violations if the editor is ever hosted behind a strict `Content-Security-Policy` header, and flags every static analyzer.
- **Next step:** Replace with an explicit map: `const SEED_TARGETS = {COLORS, TYPE, SPACES, RADII, SHADOWS};` and iterate via bracket access.

---

## Known Gaps / Missing Features

### No runtime validation on token inputs
- **Severity:** med
- **Evidence:** `app.js:147, 166, 185` use `+e.target.value || 12/0` coercion only; `app.js:204` accepts raw strings for shadow; color picker uses native `<input type="color">` (safe) but JSON import (if added) would be unchecked.
- **Impact:** Negative numbers, NaN, unparseable shadow strings silently propagate into the exported CSS/JSON. Downstream consumers would get `--space-1: -5px;`.
- **Next step:** Clamp numeric inputs server-side-style (`Math.max(0, Math.min(max, v))`); validate shadow with a regex `^(none|(\d+px\s+){2,4}rgba?\([^)]+\)(,\s*…)*)$`; surface a red outline on invalid.

### No TypeScript / no linter / no formatter / no CI
- **Severity:** med
- **Evidence:** Repo has no `tsconfig.json`, `.eslintrc*`, `.prettierrc`, `.github/workflows/`, `biome.json`, `package.json` at root.
- **Impact:** Style drift, silent breakage, no refactor safety. `builder/app.js` is 876 lines in one IIFE — the risk compounds as it grows.
- **Next step:** Add a minimal `package.json` with `eslint` + `prettier` + a `check` npm script; add a GitHub Actions workflow running `eslint builder/app.js` and the existing Playwright smoke.

### Accessibility checks are single-axis (vs white only)
- **Severity:** med
- **Evidence:** `app.js:111` computes `contrast(c.v, '#FFFFFF')` per color; no pairwise matrix (fg-1 vs bg-page, fg-2 vs surface, accent vs white/dark). No keyboard-nav automated test. No prefers-reduced-motion audit.
- **Impact:** WCAG AA claim in `project/README.md` is unverified for real use pairs; dark-theme contrast not measured.
- **Next step:** Add a pairs matrix that evaluates `{fg-1, fg-2, fg-3, accent, danger, success, warning}` × `{bg-page, bg-surface}` on both light + dark themes; render fail chips in a new "A11y" editor panel.

### No i18n infrastructure — only `html[lang]` flips
- **Severity:** low
- **Evidence:** `app.js:827-829` toggles `document.documentElement.lang` only; all preview copy in `stageRenderers.*` is hardcoded English/Khmer strings inline.
- **Impact:** The "lang toggle" is visually misleading — copy does not change. Future production apps cannot reuse these specimens for true bilingual review.
- **Next step:** Extract specimen copy into a `const COPY = {en:{…}, km:{…}}` dictionary; bind the toggle to swap keys and re-render.

### Font select fires even when font not loaded
- **Severity:** low
- **Evidence:** `app.js:791-801` sets `--font-latin`/`--font-khmer` CSS vars immediately; does not check `document.fonts.check()` or await `document.fonts.ready` for the selected family.
- **Impact:** If the Google Fonts link fails (e.g., slow network), the select still "succeeds" but renders fallback; no user feedback.
- **Next step:** After `setProperty`, run `document.fonts.load('16px "Moul"').then(…)` and toast a warning if the face didn't resolve.

---

## Risks From External `project/` Disclaimers

### Lucide flagged as placeholder icon set
- **Severity:** high (for production handoff, low for design review)
- **Evidence:** `project/ICONOGRAPHY.md:3` — "production SuperApp's icon set was **not provided**… substitutes Lucide via CDN… Please share the real icon set to replace this." Also `project/README.md:43, 264, 288`.
- **Impact:** Any design approved here will need icon re-skin before shipping; icon widths + optical alignment may shift.
- **Next step:** Pull the real SuperApp icon set from the production owner; define a 1:1 mapping table `{lucide-name → production-name}` before any dev team consumes this kit.

### Fonts substituted — no validated SuperApp faces
- **Severity:** med
- **Evidence:** `project/README.md:287` — "Fonts substituted: Noto Sans Khmer and Inter are loaded from Google Fonts. If the SuperApp ships a custom Khmer face, please provide the files."
- **Impact:** Metrics (x-height, Khmer diacritic stacking, line-height) may not match production; spacing and `.mobile-frame` measurements are tuned against substitute metrics.
- **Next step:** Request official font files + license; when available, re-run spacing audits (`project/preview/spacing.html`, `type-khmer.html`).

### No real SuperApp screenshot validation
- **Severity:** low
- **Evidence:** `project/README.md:284-288` "Open questions / things to flag" section — no Figma or production codebase attached.
- **Impact:** The guideline is an informed reconstruction, not a mirror. Divergence from production is likely in pixel-exact areas.
- **Next step:** Acquire at least one canonical screenshot per surface (home, service list, form, modal) and add them to `project/reference/` for visual diffing.

---

## Test Coverage Gaps

### Smoke tests require a running HTTP server
- **Severity:** low
- **Evidence:** `builder/tests/smoke.mjs` + `builder/tests/full.mjs` with Playwright; `file://` access is blocked by the Chrome test extension used per project convention.
- **Impact:** CI environments need `python -m http.server` or equivalent started out-of-band; no bundled runner.
- **Next step:** Wrap Playwright with a `globalSetup` that starts a static server on a free port and sets `baseURL`.

### No unit tests on the pure helpers
- **Severity:** low
- **Evidence:** `hexToRgb`, `rgbToHsl`, `luminance`, `contrast` at `app.js:77-103` are pure but untested.
- **Impact:** A regression in `contrast()` silently corrupts the A11y chip UI.
- **Next step:** Extract these four helpers into `builder/utils.js` (IIFE-exposed or `<script type="module">`) and add a tiny `builder/tests/utils.test.mjs` with known-answer pairs.

---

*Concerns audit: 2026-04-24*
