"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/**
 * Label — Phase 3 Plan 3-08, R4.8.
 *
 * Radix Label bundled with DGC design tokens. Single-file bundle exports
 * `<Label>` so downstream consumers install one primitive via shadcn CLI
 * (D-04/D-05). Uses `@radix-ui/react-label` which provides a clickable
 * `<label>` with the correct htmlFor → id cascade and `peer` support for
 * paired disabled states.
 *
 * Typography (UI-SPEC §2.8, R4.8 authoritative):
 *   Size       → `--text-sm` (14px / 0.875rem) via `text-sm`
 *   Weight     → `--weight-medium` (500) via `font-medium`
 *   Line height → `leading-none` (shadcn canonical — keeps label flush
 *                 against its paired control; Khmer descenders are handled
 *                 by the wrapping FormItem, not by the label itself)
 *   Color      → `--foreground` (--gray-900 light / #E8EDF5 dark)
 *
 * Required asterisk (UI-SPEC §2.8 + §1.2 note):
 *   When `required` is true, appends a `<span>` after `children`:
 *     - Content: `"*"` (ASCII asterisk)
 *     - Color: `hsl(var(--red-600))` — the SINGLE permitted usage of
 *       --red-600 in Phase 3 per UI-SPEC §1.2. NOT --danger, NOT
 *       --destructive — those map to --red-700 which is reserved for
 *       error text (FormMessage, input aria-invalid state).
 *     - `aria-hidden="true"` — the "required" semantics are carried by
 *       `aria-required` on the paired control, not by the asterisk.
 *     - `ml-0.5` (2px) gap from the label text.
 *
 * peer-disabled cascade: `peer-disabled:cursor-not-allowed
 * peer-disabled:opacity-70` — when a paired control (Input, Textarea,
 * Select, Checkbox, Radio, Switch) carries `class="peer"` and is
 * disabled, the label dims in lockstep. This is the shadcn canonical
 * idiom and preserves tokens (no raw color values needed).
 *
 * No dark: utilities (D-06 token-only theming). No lang branching in
 * component (D-07 — label Khmer/Latin is caller's responsibility).
 */

const labelClassName = [
  // Typography — R4.8 authoritative
  "text-sm font-medium leading-none text-[hsl(var(--foreground))]",
  // peer-disabled cascade (shadcn canonical)
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
].join(" ");

type LabelProps = React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> & {
  /**
   * When true, renders an aria-hidden asterisk in --red-600 after the
   * label text. Pair with `aria-required` on the associated control so
   * screen readers convey the requirement.
   */
  required?: boolean;
};

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(function Label({ className, children, required, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelClassName, className)}
      {...props}
    >
      {children}
      {required ? (
        <span
          aria-hidden="true"
          className="ml-0.5 text-[hsl(var(--red-600))]"
        >
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
