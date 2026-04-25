# Phase 1 PLAN.md Quality Check

**Reviewed:** 2026-04-24
**Target:** `.planning/phases/1-scaffold/PLAN.md` (978 lines, 9 tasks)
**Method:** Goal-backward analysis against ROADMAP exit criterion + REQUIREMENTS + RESEARCH pitfalls.

---

## Verdict: **FLAG (minor, proceed)**

Plan is executable end-to-end and reaches the ROADMAP Phase 1 exit criterion. Two minor inconsistencies and one documentation gap are worth fixing before execution, but none block Task 1–6 unattended run.

---

## Per-check table

| # | Check | Status | Evidence (PLAN.md line refs) | Recommendation |
|---|-------|--------|------------------------------|----------------|
| 1 | Goal achievement — tasks 1–9 in order reach exit criterion | PASS | Task 1 scaffolds (L202–334) → Task 2 builds registry + serves locally (L336–436) → Task 3 proves local install (L438–505) → Task 4 ships CI + CNAME (L507–579) → Task 5–7 docs/license (L581–711) → Task 8 human push + DNS + Pages (L713–779) → Task 9 R2.4 proof + STATE (L781–828). Success criteria L939–954 explicitly map to ROADMAP exit. | None — flow is tight. |
| 2 | Requirement coverage (R1.1–R2.4, R10.4, R10.5) | PASS | Frontmatter L30 lists all 10. Success criteria L942–954 hit each: R1.1 L942, R1.2 L943, R1.3 L944, R1.4 L945+952, R2.1 L946, R2.2 L947, R2.3 L948, R2.4 L949, R10.4 L946+950, R10.5 L951. | None. |
| 3 | Pitfall handling (Next 15 pin, shadcn before next build, Tailwind v4 triple) | PASS | Pitfall #1: Task 1 step 1–2 (L222–242) + verify L322; Pitfall #5: Task 1 step 14 (L301–313) makes `build = shadcn build && next build`; Task 4 step 1.7 (L527) explicitly changes CI to `pnpm exec next build` to avoid double-run; Tailwind v4: Task 1 step 7–8 (L258–261) + components.json `tailwind.config: ""` (L254) + postcss `@tailwindcss/postcss` (L322) + globals `@import "tailwindcss"` (L322). All 6 RESEARCH pitfalls restated L875–886. | None — most thorough section. |
| 4 | Task atomicity (independently committable + clear verification) | PASS | Every auto task has `<verify><automated>` block: L322, L426, L497, L569, L627, L703, L822. Each `<done>` gives pass criteria. Task 8 `<resume-signal>` (L778) and Task 6 `<resume-signal>` (L668) well-defined for human gates. | None. |
| 5 | Order correctness / no circular deps | PASS | Linear chain at L832–843. Task 3 correctly depends on Task 2's local `pnpm dev`; Task 4 CI can write after local works; Task 7 license depends on Task 6 decision; Task 9 R2.4 depends on Task 8 repo existing. No circular edges. | None. |
| 6 | Human-action clarity (Task 8 DNS + GitHub UI) | PASS | Step-by-step L721–776: git init L722–728, remote+push L732–736, Pages source L739, branch protection L740, DNS CNAME with TTL L744–749, Pages custom domain auto-detect L752, HTTPS L754, verify curl commands L757–769, failure troubleshooting L772–776. DNS record shape explicit: `registry` → `dg-superapp.github.io`. | None. |
| 7 | Rollback / R2.4 broken-build regression | PASS with caveat | Task 9 step 1 (L788–802) scripts the deliberate break with `node -e` JSON mutation, pushes branch, opens PR, verifies red CI, deletes branch. Records PR+run URLs in SUMMARY. | Minor: no rollback path if Task 9's red-CI test accidentally lands on `main` — recommend explicit note that branch protection (set in Task 8) prevents this, or add guard. |
| 8 | Open-questions routing (Task 6 checkpoint scope) | PASS | Three questions enumerated L642–644: repo name, LICENSE, org domain verification. Four options L647–667 with pros/cons. Resume-signal L668 specifies exact expected payload. Matches RESEARCH.md Open Questions §1/§2/§3 (RESEARCH L507–520). | None. |
| 9 | Length vs density (978 lines) | FLAG | Justified: frontmatter 102 lines of must-haves/artifacts/key-links, embedded configs ~150 lines, threat model 24 lines, risks 15 lines, human actions table 15 lines, verification 30 lines. No fluff. But: `<interfaces>` block (L127–184) duplicates RESEARCH.md code — could be `@-reference` to reduce 57 lines without loss. | Optional: replace inline config blocks with pointer "see RESEARCH.md:230–316" since RESEARCH is already `@`-imported at L125. Saves ~60 lines. Not blocking. |

---

## Top 3 issues

### Issue 1 — `package.json` build script double-runs `shadcn build` in CI (minor inconsistency)

**Where:** PLAN.md L304 (`"build": "shadcn build && next build"`) vs L527 (workflow changes to `pnpm exec next build`).

**Problem:** The plan sets `build` script to chain `shadcn build && next build` for local dev parity (L313), then Task 4 step 1.7 tells the executor to edit the CI workflow from `pnpm build` to `pnpm exec next build` to avoid running `shadcn build` twice. This is correct but subtle — easy for an unattended executor to miss and leave CI running `shadcn build` twice (wastes ~3s, not fatal).

**Fix:** Add an explicit one-liner to Task 4 `<done>` block asserting `grep -q "pnpm exec next build" .github/workflows/deploy.yml && ! grep -q "^\s*run: pnpm build$" .github/workflows/deploy.yml` — or simply pick one idiom (have CI call `pnpm build` and strip `shadcn build` from the npm script; CI runs it explicitly in a prior step).

### Issue 2 — Task 3 automated verify line is a shell one-liner that will not work on Windows Git Bash as written

**Where:** PLAN.md L497.

**Problem:** Uses `pkill -f "next dev"` which is not always present on Git Bash Windows. Also chains `pnpm create next-app@15 … --yes &&` with `cd …` and `pnpm dlx shadcn@latest init --yes || true` — the `|| true` short-circuit masks genuine init failures. The manual step list (L446–492) is fine; only the automated-verify line is fragile.

**Fix:** Either (a) replace the auto-verify with a skip-marker and rely on `<done>` manual criteria (L499–504), or (b) wrap process kill in `taskkill //F //IM node.exe 2>/dev/null || pkill -f "next dev" || true`.

### Issue 3 — Plan commits `public/CNAME` + `.nojekyll` in Task 4 but human-action Task 8 step 1 `git status` check (L725) only looks at `public/r/` exclusion

**Where:** PLAN.md L725.

**Problem:** The `git status` sanity note says "confirm public/r/ NOT staged; CNAME + .nojekyll ARE staged" — good, but doesn't tell the human what to do if `public/CNAME` IS somehow gitignored (Pitfall #4). If someone earlier edited `.gitignore` wrong, this silent check leaves them puzzled at step 6 when Pages custom-domain field doesn't auto-populate.

**Fix:** Add an explicit pre-push invariant: `git ls-files public/CNAME public/.nojekyll | wc -l` should equal 2. One-line addition to Task 8 step 1.

---

## Confidence: can executor run PLAN.md unattended up to Task 6 checkpoint?

**YES.**

Reasoning:
- Tasks 1–5 are all `type="auto"` with concrete `<action>` steps, verbatim config blocks (or RESEARCH.md references), and `<automated>` verify lines that will fail loudly on regression.
- Pitfall #1, #2, #5 are all captured with grep-based verify assertions (L322 in Task 1, L426 in Task 2, L569 in Task 4).
- The only non-automatable pre-Task-6 activity is `pnpm create next-app@15` prompting behavior if the `--yes` flag drops support between now and execution — mitigated by the explicit fallback pin commands at L231–234.
- Issues 1 and 2 above are cosmetic: Issue 1 produces a slower-but-correct CI; Issue 2 only affects the _automated_ verify line, not the manual Task 3 procedure.
- Task 6 is a blocking human checkpoint by design; executor halts cleanly at L668 resume-signal without ambiguity.

**Key risk to watch:** Task 3's local scratch-consumer smoke depends on the registry dev server starting within 8 seconds (L451). On a cold Windows machine with pnpm store rebuild, this can take 20–30 s. Suggest raising `sleep 8` to `sleep 15` or converting to a curl-retry loop.

---

**Report:** `D:/sources/dgc-miniapp-design-system/.planning/phases/1-scaffold/PLAN-CHECK.md`
