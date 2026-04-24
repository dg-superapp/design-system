# Contributing

## Adding a new registry item

1. Create the source file under `registry/<name>/<name>.tsx`.
2. Add an entry to `registry.json` under `items[]`:
   ```json
   {
     "name": "<name>",
     "type": "registry:ui",
     "title": "Short title",
     "description": "One-line purpose",
     "dependencies": [],
     "registryDependencies": ["dgc-theme"],
     "files": [{ "path": "registry/<name>/<name>.tsx", "type": "registry:ui" }]
   }
   ```
3. Run `pnpm registry:build` — emits `public/r/<name>.json`.
4. Verify locally: start `pnpm dev`, then in a scratch consumer run `npx shadcn@latest add http://localhost:3000/r/<name>.json` and confirm compile.
5. Open a PR. CI runs `shadcn build` — broken items fail the build.

## Component rules (DGC brand)

- **Khmer-first bilingual.** Support `lang="km"` with taller line-height.
- **Sentence case** labels. No uppercase buttons. No emoji in UI.
- **Government tone.** No marketing voice, no playful animation, no exclamation points.
- **WCAG AA.** 4.5:1 contrast, 44×44 touch targets, visible focus ring.
- **Token-driven.** Use Tailwind utilities that resolve to `var(--token)` — never hardcode hex values.
- **Radix primitives** for interactive patterns (Dialog, Popover, Tabs, Switch, Checkbox, Radio, Select, Tooltip, NavigationMenu, ScrollArea).
- **Lucide icons** — current placeholder; will swap to DGC production set in v1.1.

## Review checklist

- [ ] Component works under `lang="km"` without clipping or wrong line-height
- [ ] Dark mode (`.dark` class) toggle works
- [ ] Keyboard navigation (Tab / Shift+Tab / Enter / Space / Esc) works
- [ ] Focus ring visible via `--shadow-focus`
- [ ] Install via `shadcn add` + compile verified in scratch consumer
- [ ] MDX docs page added under `src/app/docs/<name>/page.mdx`

## Local dev

```bash
pnpm install
pnpm dev
pnpm registry:build
pnpm build     # shadcn build && next build → static export
pnpm lint
```

## Commit style

Conventional commits: `feat(button): add ghost-danger variant`, `fix(nav-row): correct active state contrast`, `docs(readme): link to install guide`.
