---
phase: 3
plan_id: 3-16
wave: 2
depends_on: [3-00, 3-01, 3-02, 3-03, 3-04, 3-05, 3-06, 3-07, 3-08, 3-09, 3-10, 3-11, 3-12, 3-13, 3-14]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts
  - D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts-snapshots/ (baseline dir)
autonomous: false
requirements: []
must_haves:
  truths:
    - "/test/khmer page renders ALL 14 primitives (including one Tooltip opened) inside <div lang='km'>."
    - "Khmer labels use authentic government-tone strings (no lorem, no placeholder text)."
    - "Playwright visual-diff snapshot baseline committed to repo."
    - "No glyph clipping on subscripts (coeng: ្ក ្ខ ្គ ្ឃ) in Tooltip/Badge/Chip/Tabs/Button."
    - "CI fails if Khmer visual-diff regresses (D-17)."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx"
      provides: "Full 14-primitive Khmer test harness"
      min_lines: 120
    - path: "D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts"
      provides: "Visual-diff snapshot test"
      min_lines: 30
  key_links:
    - from: "/test/khmer"
      to: "all 14 registry primitives"
      pattern: "@/registry/"
---

<objective>
Fill the /test/khmer page (Plan 00 scaffold) with all 14 primitives under `lang="km"`, commit Playwright visual-diff baseline, enforce CI failure on Khmer clipping regression (D-17).
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx (scaffolded by Plan 00)
2. .planning/phases/3-primitives/3-UI-SPEC.md §3 (Khmer Rendering Protocol)
3. .planning/phases/3-primitives/3-CONTEXT.md §D-07, D-08, D-17
4. D:/sources/dgc-miniapp-design-system/project/preview/type-khmer.html
5. D:/sources/dgc-miniapp-design-system/project/preview/type-bilingual.html
6. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css (:lang(km) cascade)
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto">
  <name>Task 1: Populate /test/khmer page with all 14 primitives</name>
  <files>D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx (scaffold from Plan 00)
    - .planning/phases/3-primitives/3-UI-SPEC.md §3 (Khmer rules: no per-component lang branching, line-height 1.6 via cascade, subscript accommodation)
    - D:/sources/dgc-miniapp-design-system/project/preview/type-khmer.html (coeng examples)
    - D:/sources/dgc-miniapp-design-system/project/preview/type-bilingual.html
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Rewrite `src/app/test/khmer/page.tsx` to:
    - Set `<html lang="km">` context via a wrapper `<div lang="km" className="font-khmer space-y-6 p-6">`.
    - Import every primitive from `@/registry/<item>/<item>`.
    - Render each primitive with authentic Khmer text (sample strings include coeng subscripts to stress-test):
      - Button: "ចុចនៅទីនេះ" (primary), "សូមបញ្ជាក់" (secondary), "បោះបង់" (ghost-danger).
      - Input: placeholder "បញ្ចូលឈ្មោះ"; date input type.
      - Textarea: placeholder "សរសេរសេចក្តីពន្យល់ជាមួយ ្ក ្ខ ្គ ្ឃ subscripts".
      - Select: 3 options "ភ្នំពេញ", "សៀមរាប", "បាត់ដំបង".
      - Checkbox + Label: "យល់ព្រមនឹងល័ក្ខខ័ណ្ឌ".
      - Radio group: provinces list.
      - Switch + Label: "បើកការជូនដំណឹង".
      - Label with required: "ឈ្មោះពេញ *".
      - Form (Zod schema with Khmer error message "សូមបំពេញឈ្មោះ").
      - Badge 4 tones: "ព័ត៌មាន", "ជោគជ័យ", "ប្រុងប្រយ័ត្ន", "បញ្ហា".
      - Tooltip (forced open via defaultOpen prop or `open={true}` for snapshot): "ព័ត៌មានបន្ថែម".
      - Tabs: 3 tabs "ព័ត៌មាន", "ឯកសារ", "កំណត់".
      - Separator: between sections.
      - ScrollArea h=200px with list of 20 Khmer items including coeng chars.
    - NO per-component lang branching (D-07). Everything inherits from the wrapper.
  </action>
  <acceptance_criteria>
    - `grep -q 'lang="km"' D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx`
    - All 14 primitive imports present: `for p in button input textarea select checkbox radio switch label form badge tooltip tabs separator scroll-area; do grep -q "@/registry/$p" D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx || exit 1; done`
    - `grep -q "្ក\|្ខ\|្គ" D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx` (subscripts included)
    - `pnpm build` compiles the page.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm build</automated></verify>
  <done>Page renders all 14 primitives with Khmer labels + coeng subscripts.</done>
</task>

<task type="auto">
  <name>Task 2: Write Khmer clipping Playwright spec (generates baseline on first run)</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/src/app/test/khmer/page.tsx (Task 1 output)
    - .planning/phases/3-primitives/3-UI-SPEC.md §3 + §6
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Create `tests/e2e/khmer-clipping.spec.ts`:
    - Import test, expect from @playwright/test.
    - Test `khmer-clipping: visual diff`:
      - `await page.goto('/test/khmer');`
      - `await page.waitForLoadState('networkidle');`
      - Wait for fonts: `await page.evaluate(() => document.fonts.ready);`
      - Wait 300ms for any animations to settle.
      - `await expect(page).toHaveScreenshot('khmer-full-page.png', { fullPage: true, maxDiffPixelRatio: 0.005 });`
    - Additional assertions:
      - For each primitive wrapper (use data-testid on each section in Task 1), assert bounding-box height ≤ 1.25 × expected single-line height (i.e., text isn't clipping forcing multi-line expansion on single-line primitives like Button/Input).
      - Assert computed line-height >= 1.55 under `lang="km"` cascade (confirms :lang(km) rule applied).
    Test name includes "khmer-clipping" so `--grep khmer-clipping` matches.
    NOTE: First run generates baseline snapshots — THIS IS THE MANUAL CHECKPOINT. See Task 3.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts`
    - `grep -q "toHaveScreenshot" D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts`
    - `grep -q "/test/khmer" D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts`
    - First run: `pnpm test:e2e --grep khmer-clipping --update-snapshots` exits 0 and creates `tests/e2e/khmer-clipping.spec.ts-snapshots/` directory.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep khmer-clipping --update-snapshots</automated></verify>
  <done>Spec written; baseline snapshot generated.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Human approves Khmer baseline snapshot (visual quality gate)</name>
  <what-built>
    `/test/khmer` page with all 14 primitives rendered under `lang="km"`, and a Playwright `toHaveScreenshot` baseline committed.
  </what-built>
  <how-to-verify>
    1. Open `D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts-snapshots/khmer-full-page-chromium-*.png` in an image viewer.
    2. Inspect every primitive section visually:
       - Tooltip bg `--gray-900` renders dark with white Khmer text; no coeng subscript clipping at bottom.
       - Badge pill heights (22px) accommodate subscripts without descender cutoff.
       - Button/Input single-line labels render without wrap.
       - Tabs labels fit within 44px height.
       - Font fallback works (Noto Sans Khmer > Kantumruy Pro > Battambang).
    3. If any clipping / rendering quality issue: REJECT and ask executor to adjust line-height or padding before approving.
    4. If clean: type `approved` to commit snapshot.
  </how-to-verify>
  <resume-signal>Type "approved" or describe specific rendering issues</resume-signal>
</task>

<task type="auto">
  <name>Task 4: Wire Khmer clipping spec into CI a11y job</name>
  <files>D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml (extended by Plan 00 with test:a11y gate)
    - .planning/phases/3-primitives/3-CONTEXT.md §D-17 (CI fails on diff)
    - D:/sources/dgc-miniapp-shadcn/tests/e2e/khmer-clipping.spec.ts
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Add a step in deploy.yml after `pnpm test:a11y` named "Run Khmer clipping visual-diff": `run: pnpm test:e2e --grep khmer-clipping`. Do NOT pass `--update-snapshots` in CI — CI must fail if the committed baseline differs from current rendering.
  </action>
  <acceptance_criteria>
    - `grep -q "khmer-clipping" D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml`
    - NOT `grep -q "update-snapshots" D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml`
    - `pnpm test:e2e --grep khmer-clipping` (NO --update-snapshots) passes against the committed baseline.
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:e2e --grep khmer-clipping</automated></verify>
  <done>CI gate wired; regression blocks merge.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.16-01 | Tampering (supply chain) | @playwright/test snapshot infra | accept | Snapshots committed to repo; review on PR. |
</threat_model>

<verification>pnpm typecheck && pnpm build && pnpm test:e2e --grep khmer-clipping</verification>

<success_criteria>/test/khmer renders all 14; baseline snapshot approved + committed; CI fails on diff.</success_criteria>

<output>Create .planning/phases/3-primitives/3-16-SUMMARY.md</output>
