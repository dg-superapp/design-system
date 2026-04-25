---
phase: 3
plan_id: 3-17
wave: 3
depends_on: [3-00, 3-15, 3-16]
files_modified:
  - D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs
  - D:/sources/dgc-miniapp-shadcn/tests/a11y/all-primitives.a11y.spec.ts
  - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml
autonomous: true
requirements: []
must_haves:
  truths:
    - "`SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` installs all 14 primitives sequentially into a scratch Next.js consumer and compiles a page importing each."
    - "axe-core/playwright passes on every /preview/<item> route (all 14, light + dark mode)."
    - "CI deploy workflow blocks merge on any failure: typecheck, unit, build, a11y, khmer-clipping, smoke-consumer."
    - "exit.install, exit.a11y, exit.khmer criteria (from ROADMAP §Phase 3 Exit) all verifiable via CLI."
  artifacts:
    - path: "D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs"
      provides: "Extended smoke with SMOKE_WITH_PRIMITIVES=1 branch"
      min_lines: 60
    - path: "D:/sources/dgc-miniapp-shadcn/tests/a11y/all-primitives.a11y.spec.ts"
      provides: "Full a11y sweep across all 14 /preview routes"
      min_lines: 30
  key_links:
    - from: "smoke-consumer.mjs"
      to: "items.manifest.ts"
      pattern: "items.manifest"
---

<objective>
Finalize phase exit: extend smoke-consumer with SMOKE_WITH_PRIMITIVES=1 to install all 14 registry items into a scratch Next app, add full-sweep a11y spec, wire both as CI gates. This plan closes ROADMAP Phase 3 exit: "all 14 installable end-to-end; axe check passes on every playground route; Khmer test page without clipping."
</objective>

<files_to_read>
1. D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs (existing, Phase 2; extend)
2. .planning/phases/3-primitives/3-CONTEXT.md §D-19 (SMOKE_WITH_PRIMITIVES=1)
3. .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 7" (axe + iteration over items)
4. .planning/phases/3-primitives/3-RESEARCH.md §5 + §8 (non-interactive local registry server tips)
5. D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml (current state after Plan 00 + Plan 16)
6. D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts (all 14 entries appended by Plans 01-14)
7. D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
</files_to_read>

<execution_context>@$HOME/.claude/get-shit-done/workflows/execute-plan.md</execution_context>

<tasks>

<task type="auto">
  <name>Task 1: Extend smoke-consumer.mjs with SMOKE_WITH_PRIMITIVES=1 branch</name>
  <files>D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs (existing, preserve SMOKE_WITH_HELLO=1 branch)
    - .planning/phases/3-primitives/3-CONTEXT.md §D-19
    - .planning/phases/3-primitives/3-RESEARCH.md §8 (local registry serve: `pnpm build && npx serve out -l 3030`)
    - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Extend `scripts/smoke-consumer.mjs`:
    - Preserve existing `SMOKE_WITH_HELLO=1` branch (Phase 2).
    - Add new branch: if `process.env.SMOKE_WITH_PRIMITIVES === "1"`:
      1. Boot local registry server: `pnpm build` then spawn `npx serve out -l 3030` (background child_process, track pid for teardown).
      2. Poll `http://localhost:3030/r/dgc-theme.json` until 200 (timeout 60s).
      3. Create scratch consumer: `mkdir -p tmp/smoke-primitives && cd tmp/smoke-primitives && npx create-next-app@15 --ts --tailwind --app --import-alias="@/*" --no-eslint --yes .` (use non-interactive flags).
      4. Run `npx shadcn@latest init --yes` in scratch.
      5. For each of 14 primitive names (source: read `registry/items.manifest.ts` via dynamic import or hardcode list): `npx shadcn@latest add http://localhost:3030/r/<name>.json --yes`.
      6. Generate `app/smoke/page.tsx` that imports AND renders every primitive (minimal usage for each).
      7. `pnpm install && pnpm build` in scratch — MUST succeed (R1.4).
      8. Kill serve process; remove tmp/smoke-primitives directory.
      9. Exit 0 on success, non-zero on any failure.
    - Timeout overall: 10 minutes.
    Add `test -f` assertions in the compiled consumer for each expected `components/ui/<name>.tsx` file after install.
  </action>
  <acceptance_criteria>
    - `grep -q "SMOKE_WITH_PRIMITIVES" D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs`
    - `grep -q "SMOKE_WITH_HELLO" D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs` (preserved)
    - `grep -q "localhost:3030\|:3030/r" D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs`
    - `grep -q "shadcn@latest add\|shadcn add" D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs`
    - `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` exits 0 within 10 min.
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer</automated>
  </verify>
  <done>Smoke installs all 14 into scratch consumer; scratch builds green.</done>
</task>

<task type="auto">
  <name>Task 2: Author all-primitives a11y sweep spec</name>
  <files>D:/sources/dgc-miniapp-shadcn/tests/a11y/all-primitives.a11y.spec.ts</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/registry/items.manifest.ts
    - .planning/phases/3-primitives/3-RESEARCH.md §"Pattern 7"
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/axe.setup.ts
    - .planning/phases/3-primitives/3-UI-SPEC.md §5 (a11y protocol)
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Create `tests/a11y/all-primitives.a11y.spec.ts`:
    - Import items from `../../registry/items.manifest`.
    - For each item, create a `test('a11y: /preview/${item.name} [light]')`:
      - Navigate /preview/item.name.
      - Run `runAxe(page)` from axe.setup.
      - Assert `results.violations.length === 0`; if non-zero, print each violation's id + nodes for debugging.
    - Repeat for dark mode: toggle theme control in playground before running axe.
    - Total tests: 14 × 2 = 28 a11y assertions.
    Test descriptions include "a11y" so `pnpm test:a11y` (which greps "a11y") catches them.
  </action>
  <acceptance_criteria>
    - `test -f D:/sources/dgc-miniapp-shadcn/tests/a11y/all-primitives.a11y.spec.ts`
    - `grep -q "items.manifest" D:/sources/dgc-miniapp-shadcn/tests/a11y/all-primitives.a11y.spec.ts`
    - `grep -q "for.*of items\|items.forEach\|items.map" D:/sources/dgc-miniapp-shadcn/tests/a11y/all-primitives.a11y.spec.ts`
    - `pnpm test:a11y` — all 14 × 2 tests pass (28 assertions).
  </acceptance_criteria>
  <verify><automated>cd D:/sources/dgc-miniapp-shadcn && pnpm test:a11y</automated></verify>
  <done>Full a11y sweep green across all primitives + both themes.</done>
</task>

<task type="auto">
  <name>Task 3: Wire smoke-primitives into CI + full exit verification</name>
  <files>D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml</files>
  <read_first>
    - D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml (state after Plan 00 + Plan 16)
    - .planning/phases/3-primitives/3-CONTEXT.md §D-19 (phase exit blocked until smoke green)
    - D:/sources/dgc-miniapp-shadcn/scripts/smoke-consumer.mjs
    - D:/sources/dgc-miniapp-shadcn/tests/a11y/all-primitives.a11y.spec.ts
    - D:/sources/dgc-miniapp-shadcn/registry/dgc-theme/globals.css
  </read_first>
  <action>
    Add new CI step AFTER existing `test:a11y` and `khmer-clipping` steps, BEFORE deploy:
    - Step name: "Run consumer smoke (all 14 primitives)"
    - `run: SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer`
    - `timeout-minutes: 15`
    Also add a pre-deploy summary step "Verify Phase 3 exit criteria":
    - `run: |
        echo "Phase 3 exit verification:"
        echo "  exit.install: all 14 primitives installable via smoke:consumer — checked above"
        echo "  exit.a11y: axe passes all /preview/<item> — checked in test:a11y step"
        echo "  exit.khmer: /test/khmer page no clipping — checked in khmer-clipping step"
        ls -la public/r/ | grep -E '(button|input|textarea|select|checkbox|radio|switch|label|form|badge|tooltip|tabs|separator|scroll-area)\.json' | wc -l | grep -q '^14$' || { echo "Missing primitive JSONs"; exit 1; }`
    Final pipeline order: install → typecheck → test:unit → build → test:a11y → khmer-clipping → smoke-consumer → exit-verification → deploy.
  </action>
  <acceptance_criteria>
    - `grep -q "SMOKE_WITH_PRIMITIVES" D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml`
    - `grep -q "exit.install\|exit.a11y\|exit.khmer" D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml`
    - `grep -q "test:a11y" D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml`
    - `grep -q "khmer-clipping" D:/sources/dgc-miniapp-shadcn/.github/workflows/deploy.yml`
    - Workflow syntax valid: `yamllint -d relaxed .github/workflows/deploy.yml` (or `pnpm dlx @action-validator/core` check).
    - Full local CI simulation:
      `pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:a11y && pnpm test:e2e --grep khmer-clipping && SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` all exit 0.
  </acceptance_criteria>
  <verify>
    <automated>cd D:/sources/dgc-miniapp-shadcn && pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:a11y && pnpm test:e2e --grep khmer-clipping && SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer</automated>
  </verify>
  <done>All exit criteria verifiable via CI; Phase 3 ready to ship.</done>
</task>

</tasks>

<threat_model>
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-3.17-01 | Tampering (supply chain) | scratch consumer pulling all 14 items | mitigate | Items pinned via URL hash? (no, URL-only); pnpm audit at install; CI detects install failures. |
| T-3.17-02 | Denial of Service | local serve process not torn down | accept | Script uses child_process.kill in finally{} block; 15min CI timeout. |
</threat_model>

<verification>Full local CI simulation: pnpm typecheck && pnpm test:unit && pnpm build && pnpm test:a11y && pnpm test:e2e --grep khmer-clipping && SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer</verification>

<success_criteria>
Phase 3 exit (ROADMAP):
- All 14 items installable end-to-end via smoke:consumer ✓
- axe check passes on every /preview/<item> (light+dark) ✓
- /test/khmer renders every primitive without clipping, CI enforces ✓
</success_criteria>

<output>Create .planning/phases/3-primitives/3-17-SUMMARY.md</output>
