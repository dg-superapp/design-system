# DGC MiniApp shadcn Registry

## One-liner
Transform the existing Cambodia Gov MiniApp design system (CSS tokens + HTML specimens + JSX kit) into a shadcn-compatible component registry, hosted on GitHub under `dg-superapp`, so downstream MiniApp teams can install DGC-approved UI with `npx shadcn@latest add`.

## Why
- Current system ships as static HTML previews + a small JSX kit. MiniApp teams copy-paste markup manually, which drifts.
- A shadcn registry delivers editable TSX source directly into each MiniApp repo. Teams stay in control, but every install starts from the canonical DGC version.
- One registry = one source of truth for tokens, primitives, and MiniApp-specific blocks (file uploader, ministry picker, app header).

## Scope (in)
- **Registry host** — Next.js 15 site at `registry.016910804.xyz` serving `/r/<name>.json` per-item files + MDX docs pages.
- **Theme package** — one `registry:theme` item shipping DGC tokens (existing `--blue-*`, `--space-*`, `--text-*`, `--radius-*`, `--shadow-*`) converted to shadcn HSL convention + Tailwind v4 preset + Khmer-first bilingual font stack.
- **Primitives** — Button, Input, Textarea, Select, Checkbox, Radio, Switch, Label, Form, Badge, Tooltip, Tabs, Separator, ScrollArea.
- **MiniApp-specific components** — AppHeader (navy 3-slot), HeroBanner (stippled), SegmentedTabs, StepIndicator, NavRow, SideDrawer, SectionHeader, Alert, Toast, Dialog, Sheet, Empty, Skeleton, Spinner, Table, InfoRow, DocumentListRow, TimestampTag, ServiceTile.
- **Blocks** — FileUploader (4 states), MinistryPicker, FormScreen layout, MobileFrame preview harness, ServiceGrid.
- **Distribution** — GitHub Actions → GitHub Pages deploy on every `main` push. Custom domain `registry.016910804.xyz`.

## Scope (out)
- **SuperApp host chrome** — `MiniHeader` (host version), bottom tab bar, SuperApp status bar. These belong to the SuperApp team, never MiniApps.
- **Pure documentation specimens** — `colors-*.html`, `type-*.html`, `spacing.html`, `radii.html`, `elevation.html`, `iconography.html`, `content-tone.html` become MDX docs pages, not registry items.
- **Real SuperApp icon set** — keep Lucide as confirmed substitute until DGC provides production icons (flagged in `project/ICONOGRAPHY.md:3`).
- **Private/gated registry, versioning primitives** — v1.0 is flat public deploy from `main`. Bearer-auth and `/v1/` path prefixes deferred to v2.
- **Builder app port** — the existing vanilla `builder/` editor is not shipped in the registry; it stays as an internal tuning tool.

## Target users
- **MiniApp engineers** — install components via shadcn CLI, drop into their Next.js or Vite app.
- **DGC design system maintainers** — publish new components, bump versions, review contributions.
- **SuperApp integration team** — reference the registry when validating MiniApp submissions.

## Constraints
- **Khmer-first bilingual** — every component must render Noto Sans Khmer / Kantumruy Pro / Battambang / Moul correctly. `lang="km"` attribute must cascade to `line-height: 1.6` (taller for coeng / subscripts).
- **WCAG AA** — 4.5:1 contrast for body text, 44×44 touch targets, visible focus ring via `--shadow-focus`.
- **No marketing voice** — sentence case, no emoji in UI, no playful animation. Government tone.
- **Tailwind v4** — CSS-first config, `@theme` block. v3 migration path documented but not the starting point.
- **React 19 + Next.js 15 (App Router)** — the host site; consumer apps free to use any stack shadcn supports.
- **Radix primitives** — for Dialog, Popover, Tabs, Switch, Checkbox, Radio, Select, Tooltip, NavigationMenu, ScrollArea.

## Success criteria
1. Consumer running `npx shadcn@latest add https://registry.016910804.xyz/r/button.json` receives a working DGC-branded Button with zero manual wiring.
2. All 30+ specimens from `project/preview/` have a corresponding registry item or MDX docs page.
3. Dark mode (`.dark` class) toggles through all components without style breakage.
4. `lang="km"` + Khmer text renders correctly across every component.
5. CI deploys on every `main` push; broken `shadcn build` fails the job.
6. Consumer install docs (copy-pastable) exist per item.

## Risks
- **HEX → HSL token conversion** must preserve visual fidelity; automated converter + spot-check against `project/preview/*.html`.
- **Tailwind v4 + shadcn integration** is new (March 2026); expect API stabilization pains.
- **GitHub Pages 404s / CORS** — mitigated by custom domain and never using `raw.githubusercontent.com`.
- **Lucide as placeholder icons** — production handoff blocked until DGC icon set arrives.

## Repo plan
- Target GitHub repo: `https://github.com/dg-superapp/design-system` (new repo under org)
- Local workspace: sibling folder `D:/sources/dgc-miniapp-shadcn/` (clean checkout, not this one) — or migrate `builder/` into the new repo structure. TBD phase 1.
- Existing `D:/sources/dgc-miniapp-design-system/` stays as source-of-truth reference during port.

## Related
- Design tokens source — `project/colors_and_type.css`
- Brand rules — `project/README.md`
- Icon sourcing — `project/ICONOGRAPHY.md`
- SuperApp host context — `project/SUPERAPP_HOST.md`
- Research — `.planning/research/shadcn-registry.md`, `.planning/research/github-hosting.md`, `.planning/research/port-strategy.md`
- Codebase map — `.planning/codebase/*.md`
