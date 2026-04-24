# DGC MiniApp — shadcn Component Registry

Shadcn-compatible component registry for the Cambodia Gov MiniApp design system. Primitives, MiniApp-specific blocks, and DGC theme tokens delivered as editable source straight into your Next.js or Vite project.

Hosted at **https://registry.016910804.xyz**.

## Install a component

```bash
npx shadcn@latest add https://registry.016910804.xyz/r/button.json
```

Components land in your `components/ui/` folder as standard `.tsx` files. Edit them freely — no runtime dependency on this registry.

## Install the DGC theme

Every DGC component pulls `dgc-theme` automatically via `registryDependencies`. To install the theme on its own:

```bash
npx shadcn@latest add https://registry.016910804.xyz/r/dgc-theme.json
```

This injects DGC tokens (`--blue-900`, `--space-*`, `--text-*`, `--radius-*`) plus shadcn semantic aliases (`--primary`, `--background`, …) into your `globals.css` and extends `tailwind.config.ts`.

## Bilingual (Khmer + English)

All components render correctly under `lang="km"` with the DGC font stack (Noto Sans Khmer → Kantumruy Pro → Battambang fallback). Khmer line-height is `1.6` to accommodate coeng and subscripts.

## Requirements

- Next.js 15+ (App Router) or Vite + React 19
- Tailwind CSS v4
- shadcn CLI v4

## Local development

```bash
pnpm install
pnpm dev            # preview site at http://localhost:3000
pnpm registry:build # generate public/r/*.json
pnpm build          # shadcn build && next build → static export in out/
```

## Scope

**In registry:** tokens, primitives (Button, Input, Select, …), MiniApp components (AppHeader, HeroBanner, NavRow, FileUploader, MinistryPicker, …), feedback surfaces (Alert, Dialog, Sheet, Toast, …).

**Not in registry:** SuperApp host chrome (status bar, bottom tab bar, home grid). Those belong to the SuperApp team.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

TBD — pending Phase 1 Task 6 decision. See [LICENSE](./LICENSE) placeholder.
