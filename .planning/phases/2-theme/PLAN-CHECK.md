# Phase 2 PLAN.md — Goal-Backward Verification

**Reviewed:** `.planning/phases/2-theme/PLAN.md` (880 lines, 12 tasks)
**Date:** 2026-04-24
**Reviewer:** Planner verification pass

---

## Verdict: **PASS**

Plan wires every task back to the ROADMAP exit criterion and every CONTEXT decision to at least one grep-level assertion. Dependencies are sequential and acyclic; all 8 RESEARCH pitfalls are mitigated at named task points. Minor polish items noted below — none blocking.

---

## Check Table

| # | Check | Result | Evidence (PLAN.md line refs) |
|---|---|---|---|
| 1 | Goal achievement — Tasks 1–12 reach exit criterion | PASS | Task 1 converter (L186–218) -> Task 2 theme.css (L219–299) -> Task 3 registry-item.json (L300–347) -> Task 4 dogfood globals (L348–376) -> Tasks 5–7 preview/docs/hello (L377–474) -> Task 8 visual-diff + Task 9 smoke satisfy exit gate (L475–544) -> Task 10 CI (L546–595) -> Tasks 11–12 PR+merge (L596–686). Exit block L631–644 re-quotes ROADMAP criterion and names gating scripts. |
| 2 | R3.1–R3.5 coverage | PASS | "Requirements closed" explicitly names R3.1, R3.2, R3.3, R3.4, R3.5, R9.3 (L619–620). R3.1 = Tasks 2+3; R3.2 = Task 1 converter + `--verify` (L186–218); R3.3 = Khmer fontFamily in theme.css (Task 2) + `:lang(km)` smoke assert (L528); R3.4 = `.dark` class, Pitfall 5 grep NOT `[data-theme` (L529, risk L827); R3.5 = Task 7 `hello` declares `registryDependencies: ["dgc-theme"]` (L451–474). |
| 3 | CONTEXT decisions D1–D4 honored | PASS | "Decisions honored" block L613–617 names all 4. D1 `--brand` asserted in smoke L525 + risk 1 L815; D2 dark-tinted HSL triplets per risk 7 L833 (deferred visual check Phase 5); D3 `Moul` NOT present smoke assert L532; D4 `--sidebar-primary` present assert L526. |
| 4 | All 8 RESEARCH pitfalls mitigated | PASS | Risks block L812–847 enumerates 11 risks; risks 1–9 bind 1:1 to Pitfalls 1–8 + Open Q3. Each names the Task that greps/verifies: Pitfall 1→L815 (Task 2/7/10); Pitfall 2→L818 + smoke assert `hsl(hsl(` L531; Pitfall 3→L821 + smoke `@tailwind base` L530; Pitfall 4→L824 (`--radius` required); Pitfall 5→L827 + smoke L529; Pitfall 6→L830 + Task 4 pnpm build; Pitfall 7→L836 (doc-only); Pitfall 8→L839 (doc-only, Phase 3 target). |
| 5 | Branch protection + CI compatibility | PASS | Task 10 (L546–595) creates `pr-checks.yml` with required-check name `build` on `pull_request → main`. Human-actions L851–857 flags first-time branch-protection config. Task 11 opens PR via `gh`; Task 12 (L647–686) is blocking human checkpoint awaiting approval + merge. Risk 11 (L845) acknowledges workflow constraint. |
| 6 | Task atomicity — each committable | PASS | Every `<task type="auto">` ends with an explicit `git commit` step (e.g. L217, L296, L344, L374, L412, L448, L473, L501, L538, L587). Each has `<verify><automated>` and `<done>` clauses. Task 12 is the only non-commit task by design (human checkpoint). |
| 7 | Ordering / dependencies sound | PASS | Dependency graph L779–810 is acyclic and matches task order. Task 1 converter precedes Task 2 theme.css (needs HSL values). Task 3 registry-item precedes Task 4 dogfood (needs JSON). Tasks 8/9 depend on built `public/r/dgc-theme.json` + running server (both state this in `<automated>` L504, L541). Task 10 CI comes after all scripts exist. No task runs before its prerequisite. |
| 8 | Visual-diff (Task 8) concrete | PASS | L490–498 specifies Playwright, explicit loop over `data-token=` attributes, `getComputedStyle` on `background-color`, baseline load from `project/preview/colors-{primary,neutrals,semantic}.html` as `file://`, Euclidean RGB delta threshold `<=3` per channel, PASS/FAIL table, exit-code contract. `<automated>` L504 boots `pnpm start`, sleeps 6s, runs `test:visual`. Minor: L494 tells executor to "inspect HTML files first to determine selectors; do not guess" — acceptable deferral (executor will confirm selector style from Phase 0 specimens). |
| 9 | Scratch-consumer smoke (Task 9) concrete | PASS | L518–538 specifies `fs.mkdtempSync`, explicit `create-next-app@15` flags, `shadcn init -y -d`, `shadcn add http://localhost:3000/...`, then 8 grep assertions (`--brand`, `--sidebar-primary`, `.dark {`, `:lang(km)` positive; `[data-theme="dark"]`, `@tailwind base`, `hsl(hsl(`, `Moul` negative), then `pnpm build` in scratch app must exit 0. Cleanup policy stated (L534). Each assertion ties to a Decision or Pitfall. |
| 10 | Open questions well-scoped (5 listed) | PASS | L859–869. All 5 are deferrable to execution time: (1) `$ref` vs inline registry.json convention — executor preserves Phase 1 state; (2) `hello.tsx` button surface — executor adapts; (3) `next.config.mjs` `output: 'export'` — Task 6 accommodates both branches; (4) `meta.version` schema acceptance — fallback noted; (5) `wait-on` vs `curl --retry` in CI — readability preference. None are blocking. |

---

## Top 3 issues (ranked)

1. **Task 8 selector extraction is deferred to the executor (L494).** The script relies on the executor reading `colors-{primary,neutrals,semantic}.html` at runtime to determine how swatches are keyed (class/inline-style/data-attr). If the specimens use a mix, the script needs branching logic. Low risk — specimens were authored by the same team — but add a one-line pre-check ("abort with clear error if selector detection fails") to avoid silent mismatches. Not blocking.

2. **Task 9 smoke depends on a running local server at `http://localhost:3000` (L523).** The `<automated>` block (L541) boots `pnpm start` and sleeps 6s, which is fragile on slower CI runners. Consider `npx wait-on http://localhost:3000/r/dgc-theme.json` (already called out as Open Q5 L868). Not blocking — retry/extended sleep is an easy follow-up.

3. **Pitfalls 7 and 8 (`next/font` double-load, `:lang(km)` portals) are documented-only, not asserted.** Risks 8 and 9 (L836, L839) mitigate via MDX docs (Task 6) and defer enforcement to Phase 3. Acceptable per CONTEXT D2-style deferral pattern, but means a consumer adopting `next/font` could hit the footgun without the smoke test catching it. Phase 3 should add `next/font` variant to smoke. Not blocking for Phase 2 exit.

---

## Confidence: Executor can run Tasks 1–11 unattended to Task 12 checkpoint

**HIGH (≈90%).**

- Every auto task has a deterministic `<automated>` verify block with explicit exit-0 semantics; executor can detect failure and stop.
- Commit points are atomic — a mid-phase abort leaves the repo on a clean known state.
- Dependency graph is strictly sequential, so a failure in Task N means Tasks N+1..11 won't be attempted.
- Open questions are executor-adaptive (preserve-existing-state defaults) rather than planner decisions — no blocking unknowns.
- Risk: the Playwright install in Task 8 (`pnpm dlx playwright install chromium`) is ~150MB and can flake on first run; executor should retry once before declaring failure. Document in runbook.
- Risk: `pnpm create next-app@15` in Task 9 requires network + registry availability; single point of external dependency.
- Task 12 is the designed human gate — executor must halt there regardless of how well Tasks 1–11 run. Plan correctly tags it `checkpoint:human-verify` with `gate="blocking"` (L647).

**Recommendation:** PASS as-is. Execute. Surface Top-3 polish items as inline comments during execution if they bite.
