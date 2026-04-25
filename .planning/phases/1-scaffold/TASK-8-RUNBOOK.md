# Task 8 — Human Actions Runbook

All Task 8 steps require human execution (org permissions, DNS access, GitHub UI). Run in order. Stop if any step fails.

**Decisions locked:**
- Repo: `dg-superapp/design-system`
- License: MIT (applied — see `LICENSE`)
- Domain: `registry.016910804.xyz`

---

## Step 1 — Pre-flight sanity (in `D:/sources/dgc-miniapp-shadcn/`)

```bash
cd /d/sources/dgc-miniapp-shadcn

# Confirm build artifacts present + domain correct
cat public/CNAME                 # expect: registry.016910804.xyz
ls public/.nojekyll              # file exists
ls out/r/hello.json              # static export exists
grep -l "dg-superapp.com" public/r/*.json out/r/*.json || echo "clean"
```

If any check fails: rerun `pnpm build` before proceeding.

---

## Step 2 — Initialize git + commit

```bash
cd /d/sources/dgc-miniapp-shadcn

git init
git branch -m main

# Verify CNAME + .nojekyll WILL be tracked (plan-check issue #3)
git add -A
git status | grep -E "CNAME|\.nojekyll"
# Both must appear. If either missing, check .gitignore.

git commit -m "chore: initial scaffold (Next 15 + Tailwind v4 + shadcn registry)

- Next.js 15.5.15 static export (output: 'export')
- Tailwind v4 with @import 'tailwindcss' + @tailwindcss/postcss
- shadcn CLI v4 components.json (registry-mode, blank tailwind.config)
- Root registry.json + registry/hello/hello.tsx placeholder
- CI: .github/workflows/deploy.yml (shadcn build + next build -> Pages)
- public/CNAME: registry.016910804.xyz
- public/.nojekyll
- README, CONTRIBUTING, LICENSE (MIT)"
```

---

## Step 3 — Create GitHub repo under `dg-superapp` org

Option A — via GitHub CLI (recommended):

```bash
gh auth status                   # confirm logged in
gh repo create dg-superapp/design-system \
  --public \
  --description "DGC MiniApp shadcn component registry" \
  --source=. \
  --remote=origin \
  --push
```

Option B — via GitHub web UI:

1. Browse to https://github.com/organizations/dg-superapp/repositories/new
2. Repository name: `design-system`
3. Visibility: Public
4. Description: `DGC MiniApp shadcn component registry`
5. Do NOT init with README/license/.gitignore (we already have them)
6. Create repository
7. Back in terminal:

```bash
git remote add origin git@github.com:dg-superapp/design-system.git
git push -u origin main
```

---

## Step 4 — Verify GitHub org custom-domain for `016910804.xyz`

Org-level verification is a prerequisite for Pages + custom-domain HTTPS.

1. Navigate: https://github.com/organizations/dg-superapp/settings/pages
2. Under "Verified domains" add `016910804.xyz`
3. GitHub shows a `TXT` record, e.g. `_github-pages-challenge-dg-superapp.016910804.xyz` with a verification token
4. At your DNS provider for `016910804.xyz`, add:

   | Type | Host | Value | TTL |
   |---|---|---|---|
   | TXT | `_github-pages-challenge-dg-superapp` | `<token from step 3>` | 300 |

5. Wait 1–5 min, click "Verify" in GitHub UI. Must show ✓.

If org-level verification fails: you can still deploy (step 6 below) but GitHub will not auto-issue a Let's Encrypt cert for the custom domain. Verification is required for HTTPS without warnings.

---

## Step 5 — Add production CNAME DNS record

At your `016910804.xyz` DNS provider:

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME | `registry` | `dg-superapp.github.io` | 300 |

Verify:

```bash
dig +short CNAME registry.016910804.xyz
# expect: dg-superapp.github.io.
```

Propagation: 1–15 min typical.

---

## Step 6 — Enable GitHub Pages (Actions source)

1. Browse: https://github.com/dg-superapp/design-system/settings/pages
2. Build and deployment → Source: **GitHub Actions**
3. Custom domain: GitHub should auto-detect `registry.016910804.xyz` from `public/CNAME`. Confirm it appears.
4. Enforce HTTPS: check the box (will be greyed until Let's Encrypt cert issued — that takes up to 24h).

---

## Step 7 — Trigger workflow + verify deploy

The push from Step 3 already triggered `.github/workflows/deploy.yml`. Verify:

```bash
gh run list --limit 1
gh run watch     # tail current run
```

Expect: `shadcn build` → `next build` → `upload-pages-artifact` → `deploy-pages` — all green. Build time ~2–3 min.

If workflow fails:
- Permission errors → repo Settings → Actions → General → Workflow permissions → "Read and write"
- Pages source mismatch → repeat Step 6
- Missing `@tailwindcss/postcss` → reinstall deps, push again

---

## Step 8 — Production smoke test

Once workflow is green AND DNS has propagated:

```bash
# HTTPS may take up to 24h for first-issue cert. If 404/SSL error, try http:// first.
curl -sI https://registry.016910804.xyz/r/hello.json
# expect: HTTP/2 200, content-type: application/json

curl -s https://registry.016910804.xyz/r/hello.json | jq .name
# expect: "hello"
```

Scratch consumer install (in a throwaway folder):

```bash
cd /tmp
pnpm create next-app@15 prod-smoke --ts --tailwind --app --eslint --src-dir \
  --import-alias "@/*" --use-pnpm --yes
cd prod-smoke
pnpm dlx shadcn@latest init -y
pnpm dlx shadcn@latest add https://registry.016910804.xyz/r/hello.json
ls components/ui/hello.tsx       # must exist
pnpm build                        # must compile
```

If any step fails → halt, diagnose, do not proceed to Task 9.

---

## Done

All 8 steps green = Phase 1 ends. Return here and run `/gsd-execute-phase 1 --from-task 9` (or manual) to run Task 9: R2.4 broken-build regression + advance STATE to Phase 2.
