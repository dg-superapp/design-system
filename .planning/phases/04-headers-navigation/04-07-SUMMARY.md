---
phase: 04-headers-navigation
plan: 07
status: complete
type: execute
wave: 4
completed: 2026-04-25
requirements: [R5.7, R10.1, R10.3]
---

# 04-07 — side-drawer (registry:block)

Ships `side-drawer` as Phase 4's second `registry:block`. Left-edge slide-in
panel built on `@radix-ui/react-dialog` with Wave 0 keyframes
(`drawer-slide-in/out` + `overlay-fade-in/out`). Cascade-installs dgc-theme,
app-header, scroll-area per D-09.

## Key files

| File | LOC | Notes |
|---|---:|---|
| `registry/side-drawer/side-drawer.tsx` | 86 | Radix Dialog wrapper, dot-namespace |
| `registry/side-drawer/registry-item.json` | 16 | `type: "registry:block"`, 3-item cascade |
| `src/app/preview/[item]/renderers/side-drawer.tsx` | 130 | Composes AppHeader + profile + ScrollArea + NavRow list + footer |
| `tests/a11y/side-drawer.a11y.spec.ts` | 28 | light + dark axe |
| `tests/e2e/side-drawer.spec.ts` | 89 | ARIA, ESC, focus trap, animation, reduced-motion, sign-out color |

Plus root `registry.json` updated.

## ScrollArea export resolved

```
$ grep "^export" registry/scroll-area/scroll-area.tsx
export const scrollBarClassName = cn(...)
export const scrollThumbClassName = cn(...)
export { ScrollArea, ScrollBar };
```

Renderer imports `{ ScrollArea }` directly. Used in `<SideDrawer.Body>` to
wrap the NavRow list with scroll-on-overflow.

## Pitfall 2 closure (static animate-* class)

```
$ grep -c "data-\[state=open\]:animate-\[drawer-slide-in" registry/side-drawer/side-drawer.tsx
1
$ grep -c "data-\[state=open\]:animate-\[overlay-fade-in" registry/side-drawer/side-drawer.tsx
1
```

Both `animate-*` utilities are STATIC on the JSX `className`. Radix toggles
`data-state="open"` immediately on mount when `open={true}`, which triggers
the keyframe. No conditional rendering of the class.

## Wave 0 keyframes used

```
$ grep "^@keyframes" registry/dgc-theme/theme.css
@keyframes drawer-slide-in
@keyframes drawer-slide-out
@keyframes overlay-fade-in
@keyframes overlay-fade-out
```

Tokens used: `--drawer-width: min(82vw, 340px)`, `--drawer-overlay`
(0.5 light / 0.65 dark), `--shadow-3`, `--dur-slow` (320ms), `--dur-base` (200ms),
`--ease-standard`.

## Cascade per D-09 — verified

```json
"registryDependencies": [
  "https://registry.016910804.xyz/r/dgc-theme.json",
  "https://registry.016910804.xyz/r/app-header.json",
  "https://registry.016910804.xyz/r/scroll-area.json"
]
```

Pitfall 10: dgc-theme FIRST in cascade. Installing side-drawer auto-installs
AppHeader (drawer header) and ScrollArea (nav-list overflow).

## Reduced-motion behavior

The existing global `@media (prefers-reduced-motion: reduce)` rule in theme.css
zeros animation-duration. The e2e spec verifies this by creating a Playwright
context with `reducedMotion: 'reduce'` and asserting the dialog's computed
animation-duration is `0s`/`0.01s` (or equivalent). No per-component override
in side-drawer.tsx.

## Exported namespace shape (D-03)

```ts
SideDrawer            // root (props: open, onOpenChange, title?, children, className?)
SideDrawer.Trigger    // re-exported DialogPrimitive.Trigger
SideDrawer.Close      // re-exported DialogPrimitive.Close
SideDrawer.Header     // dot-namespace child slot
SideDrawer.Body       // dot-namespace child slot (consumer wraps with ScrollArea)
SideDrawer.Footer     // dot-namespace child slot
```

## Manifest entry — verbatim for 04-09 to copy-paste

```ts
{
  name: 'side-drawer',
  title: 'SideDrawer',
  docsSlug: 'side-drawer',
  registryUrl: `${REGISTRY_BASE}/r/side-drawer.json`,
  description: 'Left-edge slide-in drawer with AppHeader header, nav list, and legal footer.',
  controls: [
    { kind: 'boolean', name: 'withProfile', label: 'Profile block', default: true },
    { kind: 'variant', name: 'navItemCount', label: 'Nav item count', options: ['3', '5', '7'] as const, default: '5' },
    { kind: 'boolean', name: 'withFooter', label: 'Legal footer', default: true },
    { kind: 'boolean', name: 'defaultOpen', label: 'Open in playground', default: true },
  ] as const,
},
```

## Barrel re-export — verbatim for 04-09 to copy-paste

```ts
import { SideDrawerPreview } from './side-drawer';
// + map entry: 'side-drawer': SideDrawerPreview,
```

## Verification — done in this plan

| Gate | Status | Evidence |
|---|---|---|
| `pnpm registry:build` | green | `public/r/side-drawer.json` emitted with `type: "registry:block"` |
| Cascade order | green | dgc-theme first, app-header, scroll-area |
| `@radix-ui/react-dialog` in deps | green | Wave 0 dep ^1.1.15 |
| `pnpm typecheck` | green | clean |
| Pitfall 2 (static animate-*) | code-verified | grep ×1 each direction |
| ISSUE-01 fix | honored | manifest + barrel deferred to 04-09 |
| D-15 / D-06 | code-verified | grep `dark:` / `usePathname` ×0 |

## Verification — deferred to 04-09 post-wire-up

- a11y axe (light, dark)
- e2e: Radix ARIA, ESC close, focus trap (15 tabs), animation-on-open, reduced-motion zero, sign-out destructive
- visual-diff vs `side-drawer.html`

## Deviations + rationale

1. Added `side-drawer` to root `registry.json` (recurring pattern; second
   `registry:block` so `target` set to `components/blocks/side-drawer.tsx`).
2. Skipped manifest+barrel edits per ISSUE-01 BANNER.
3. The plan's "first focusable should be Close button" assertion in the focus-trap
   e2e relies on Radix's default `initialFocus` to land on the first tabbable
   inside the Content. The `<SideDrawer.Close asChild><AppHeader.IconButton>` is
   the first interactive in our compose order, so this should work — verification
   deferred to 04-09 full-suite run.

## Commits

```
feat(04-07): add side-drawer registry:block via Radix Dialog with slide-in keyframes
test(04-07): add a11y + e2e specs for side-drawer (focus trap, ESC, motion)
```

## must_haves status

| Truth | Status | Where |
|---|---|---|
| Cascade installs dgc-theme, app-header, scroll-area | code-verified | registryDependencies length=3, ordered |
| Slide-left motion via Wave 0 keyframes | code-verified | grep `drawer-slide-in/out` |
| Panel width = `var(--drawer-width)` (R5.7) | code-verified | grep `w-[var(--drawer-width)]` |
| Overlay = `var(--drawer-overlay)` | code-verified | grep `bg-[var(--drawer-overlay)]` |
| AppHeader inside drawer header (D-09) | code-verified | renderer composes `<AppHeader>` inside `<SideDrawer.Header>` |
| ESC + focus trap + return focus (Radix defaults) | code-default | e2e at post-04-09 |
| Static animate-* (Pitfall 2) | code-verified | grep checks |
| prefers-reduced-motion zeros animation | code-default | global theme.css rule; e2e at post-04-09 |

Wave 4 complete (1/1 plan). 8 of 10 plans done overall (80%). Next: Wave 5 / 04-08 miniapp-home — Phase 4 EXIT GATE composition.
