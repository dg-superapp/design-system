/**
 * registry/items.manifest.ts — Phase 3 Wave 0
 *
 * Single source of truth for the dynamic playground route
 * (`src/app/preview/[item]/page.tsx`) and the docs index.
 *
 * Each primitive plan (3-01 … 3-14) appends one entry here. The
 * playground route enumerates these via `generateStaticParams()`;
 * `SMOKE_WITH_PRIMITIVES=1 pnpm smoke:consumer` walks them via
 * shadcn CLI to prove end-to-end installability (D-19).
 *
 * Design constraints:
 * - Type-only — NO runtime JSX eval (3-CONTEXT D-12). React children
 *   live in the playground components themselves; the manifest
 *   declares shape only.
 * - Controls are typed unions (PropControl) so PlaygroundShell can
 *   render correct <input>/<select>/<switch> elements without
 *   sandpack/react-live.
 * - `registryUrl` resolves to the shadcn install URL; docs pages reuse
 *   it via InstallCommand in McxLayout.
 */

/**
 * PropControl — typed playground prop-knob descriptors.
 *
 * Each primitive registers the props it wants exposed in the playground
 * as one of these shapes. Per 3-CONTEXT D-12 we intentionally do NOT
 * support arbitrary JSX/React-component controls — Phase 3 primitives
 * render via declarative preview components the plans ship alongside
 * their registry entries.
 */
export type PropControl =
  | {
      kind: 'variant';
      name: string;
      label?: string;
      options: readonly string[];
      default: string;
    }
  | {
      kind: 'boolean';
      name: string;
      label?: string;
      default: boolean;
    }
  | {
      kind: 'text';
      name: string;
      label?: string;
      default: string;
      placeholder?: string;
    }
  | {
      kind: 'number';
      name: string;
      label?: string;
      default: number;
      min?: number;
      max?: number;
      step?: number;
    };

export interface ManifestEntry {
  /** URL-safe item slug, matches shadcn registry name (e.g. 'button', 'input'). */
  name: string;
  /** Human-readable title rendered in playground header + docs nav. */
  title: string;
  /** Docs route slug under /docs/components/<docsSlug>. */
  docsSlug: string;
  /** Fully-qualified shadcn install URL. */
  registryUrl: string;
  /** Playground prop controls — drives PlaygroundShell's left rail. */
  controls: readonly PropControl[];
  /** Optional one-line description rendered under the title. */
  description?: string;
}

/**
 * Production registry base. Overrideable via NEXT_PUBLIC_REGISTRY_BASE
 * so local dev + consumer smoke tests can point at localhost without a
 * DNS swap. See STATE.md "domain note" — dev-only `016910804.xyz` swaps
 * to `registry.dgsuperapp.gov.kh` when production access is granted.
 */
export const REGISTRY_BASE =
  process.env.NEXT_PUBLIC_REGISTRY_BASE ?? 'https://registry.016910804.xyz';

/** Helper so plans 3-01..3-14 can author entries without repeating the base. */
export function itemUrl(name: string): string {
  return `${REGISTRY_BASE}/r/${name}.json`;
}

/**
 * Wave 0: empty. Plans 3-01..3-14 append entries in their Task files.
 * `generateStaticParams()` tolerates [] — Next.js simply emits no
 * `/preview/[item]` routes until the array is populated.
 */
export const items: ManifestEntry[] = [
  {
    name: 'button',
    title: 'Button',
    docsSlug: 'button',
    registryUrl: itemUrl('button'),
    description: '4 variants × 2 sizes, CVA-driven, DGC-tokened, asChild support.',
    controls: [
      {
        kind: 'variant',
        name: 'variant',
        options: ['primary', 'secondary', 'ghost', 'ghost-danger'] as const,
        default: 'primary',
      },
      {
        kind: 'variant',
        name: 'size',
        options: ['default', 'sm'] as const,
        default: 'default',
      },
      { kind: 'boolean', name: 'disabled', default: false },
      { kind: 'boolean', name: 'loading', default: false },
      {
        kind: 'text',
        name: 'label',
        default: 'ចុចនៅទីនេះ',
        placeholder: 'Button label',
      },
    ] as const,
  },
  {
    name: 'input',
    title: 'Input',
    docsSlug: 'input',
    registryUrl: itemUrl('input'),
    description:
      '48px text/date input with state matrix + Khmer date placeholder.',
    controls: [
      {
        kind: 'variant',
        name: 'type',
        options: ['text', 'email', 'date'] as const,
        default: 'text',
      },
      {
        kind: 'text',
        name: 'placeholder',
        default: 'បញ្ចូលអត្ថបទ',
        placeholder: 'Input placeholder',
      },
      { kind: 'boolean', name: 'invalid', default: false },
      { kind: 'boolean', name: 'disabled', default: false },
      { kind: 'boolean', name: 'required', default: false },
    ] as const,
  },
  {
    name: 'textarea',
    title: 'Textarea',
    docsSlug: 'textarea',
    registryUrl: itemUrl('textarea'),
    description:
      'Min-height 88px textarea with vertical resize + Input-parity state matrix.',
    controls: [
      {
        kind: 'text',
        name: 'placeholder',
        default: 'បញ្ចូលចំណាំ',
        placeholder: 'Textarea placeholder',
      },
      {
        kind: 'number',
        name: 'rows',
        default: 3,
        min: 1,
        max: 12,
        step: 1,
      },
      { kind: 'boolean', name: 'invalid', default: false },
      { kind: 'boolean', name: 'disabled', default: false },
    ] as const,
  },
  {
    name: 'select',
    title: 'Select',
    docsSlug: 'select',
    registryUrl: itemUrl('select'),
    description:
      'Radix Select bundle — 48px trigger with Input-parity state matrix + selected --blue-050 item.',
    controls: [
      {
        kind: 'text',
        name: 'placeholder',
        default: 'ជ្រើសរើសភាសា',
        placeholder: 'Select placeholder',
      },
      { kind: 'boolean', name: 'invalid', default: false },
      { kind: 'boolean', name: 'disabled', default: false },
    ] as const,
  },
  {
    name: 'checkbox',
    title: 'Checkbox',
    docsSlug: 'checkbox',
    registryUrl: itemUrl('checkbox'),
    description:
      'Radix Checkbox — 20×20 box with --brand fill when checked, inline check/minus glyph, --shadow-focus ring.',
    controls: [
      {
        kind: 'variant',
        name: 'checked',
        options: ['false', 'true', 'indeterminate'] as const,
        default: 'false',
      },
      { kind: 'boolean', name: 'disabled', default: false },
      {
        kind: 'text',
        name: 'label',
        default: 'យល់ព្រម',
        placeholder: 'Checkbox label',
      },
    ] as const,
  },
  {
    name: 'radio',
    title: 'Radio',
    docsSlug: 'radio',
    registryUrl: itemUrl('radio'),
    description:
      'Radix RadioGroup — 20×20 circle with --brand border + --brand dot when selected; arrow-key cycling.',
    controls: [
      {
        kind: 'variant',
        name: 'selectedIndex',
        options: ['0', '1', '2'] as const,
        default: '0',
      },
      { kind: 'boolean', name: 'disabled', default: false },
    ] as const,
  },
  {
    name: 'switch',
    title: 'Switch',
    docsSlug: 'switch',
    registryUrl: itemUrl('switch'),
    description:
      'Radix Switch — 40×24 track, 18×18 thumb, --brand when checked, --gray-300 unchecked.',
    controls: [
      { kind: 'boolean', name: 'checked', default: false },
      { kind: 'boolean', name: 'disabled', default: false },
      {
        kind: 'text',
        name: 'label',
        default: 'ការជូនដំណឹង',
        placeholder: 'Switch label',
      },
    ] as const,
  },
  {
    name: 'label',
    title: 'Label',
    docsSlug: 'label',
    registryUrl: itemUrl('label'),
    description:
      'Radix Label — 14px medium, htmlFor pairing, optional required asterisk.',
    controls: [
      {
        kind: 'text',
        name: 'text',
        default: 'អាស័យដ្ឋានអ៊ីមែល',
        placeholder: 'Label text',
      },
      { kind: 'boolean', name: 'required', default: false },
      { kind: 'boolean', name: 'disabled', default: false },
    ] as const,
  },
  {
    name: 'badge',
    title: 'Badge',
    docsSlug: 'badge',
    registryUrl: itemUrl('badge'),
    description:
      'CVA Badge — 22px pill with 4 tones (default/success/warning/danger) + optional 12px icon.',
    controls: [
      {
        kind: 'variant',
        name: 'tone',
        options: ['default', 'success', 'warning', 'danger'] as const,
        default: 'default',
      },
      { kind: 'boolean', name: 'withIcon', default: false },
      {
        kind: 'text',
        name: 'label',
        default: 'ព័ត៌មាន',
        placeholder: 'Badge label',
      },
    ] as const,
  },
  {
    name: 'tooltip',
    title: 'Tooltip',
    docsSlug: 'tooltip',
    registryUrl: itemUrl('tooltip'),
    description:
      'Radix Tooltip — dark --gray-900 surface, appears on hover/focus, Escape closes.',
    controls: [
      {
        kind: 'text',
        name: 'content',
        default: 'ជំនួយ',
        placeholder: 'Tooltip text',
      },
      {
        kind: 'variant',
        name: 'side',
        options: ['top', 'right', 'bottom', 'left'] as const,
        default: 'top',
      },
    ] as const,
  },
];
