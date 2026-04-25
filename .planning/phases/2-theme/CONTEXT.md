# Phase 2 — Decisions (applied 2026-04-24)

Answers to the 4 open questions RESEARCH.md surfaced. Planner + executor must honor these.

## D1. DGC `--accent` rename → **`--brand`**
- Reason: avoids collision with shadcn's semantic `--accent` (subtle surface, not CTA).
- Consequence: DGC scale keeps `--blue-900` etc.; new semantic alias `--brand: hsl(var(--blue-900))`. shadcn `--accent` remains free for its intended subtle-surface role.
- Migration: every future component that wants the DGC CTA blue uses `bg-brand` / `text-brand` (not `bg-accent`).

## D2. Dark-mode alert backgrounds → **auto-generated**
- Use `hsl(var(--success) / 0.15)` pattern for `--success-bg`, `--warning-bg`, `--danger-bg`, `--info-bg` in dark mode.
- Light mode keeps existing solid tints from `colors_and_type.css`.
- Revisit during Phase 5 Alert component if visual parity fails.

## D3. Moul typeface → **drop from Phase 2**
- Not in `colors_and_type.css`. Only referenced in PROJECT.md and builder Khmer select.
- Reintroduce in Phase 4 when a heading/display component needs it.
- Keep Noto Sans Khmer + Kantumruy Pro + Battambang in v1 font stack.

## D4. shadcn `--sidebar-*` tokens → **include**
- Shipped as part of `dgc-theme` even though our Phase 4 SideDrawer uses Radix Dialog (not shadcn Sidebar).
- Low cost. Prevents future merge drift if we adopt shadcn Sidebar later.

## Other decisions on record
- Target workspace: `D:/sources/dgc-miniapp-shadcn/` (Phase 1 scaffold complete, deployed at `http://registry.016910804.xyz`).
- Consumer install target: `src/app/globals.css` (Next.js 15 + Tailwind v4 default).
- Token format: HSL channel triplets, no `hsl()` wrapper. Enables `bg-primary/90` alpha-at-callsite.
- `--radius` ships as a raw CSS var consumed by shadcn `rounded-*` utilities.
- `:lang(km)` cascade rule ships in `@layer base`, sets `line-height: 1.6`.
- Branch protection on `main` active. All Phase 2 work goes through PRs with CI green + 1 approval.
