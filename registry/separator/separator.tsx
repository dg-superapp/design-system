"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

/**
 * Separator — Phase 3 Plan 3-13, R4.13.
 *
 * Radix Separator bundled with DGC tokens. Single-file bundle exports
 * `<Separator>` so downstream consumers install one primitive via
 * shadcn CLI (D-04/D-05).
 *
 * UI-SPEC §2.13 authoritative:
 *   Color        → `hsl(var(--border))` (light 0 0% 88% / dark 222 36% 22%).
 *                  NOT `border-muted`, NOT a hardcoded #E0E0E0.
 *   Horizontal   → `h-[1px] w-full` (full-width 1px bar). Radix sets
 *                  `data-orientation="horizontal"` and `aria-orientation`
 *                  (omitted on decorative — role="none" instead).
 *   Vertical     → `w-[1px] h-full` (1px-wide full-height rule).
 *   Decorative   → `decorative` prop (default true) passes through to
 *                  Radix. When true → `role="none"`; when false →
 *                  `role="separator"` + `aria-orientation`.
 *
 * No dark: utilities (D-06 token-only theming). --border flips via CSS
 * variable in dgc-theme when `.dark` is present on root.
 */

const separatorClassName = [
  "shrink-0 bg-[hsl(var(--border))]",
  "data-[orientation=horizontal]:h-[1px]",
  "data-[orientation=horizontal]:w-full",
  "data-[orientation=vertical]:h-full",
  "data-[orientation=vertical]:w-[1px]",
].join(" ");

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(function Separator(
  { className, orientation = "horizontal", decorative = true, ...props },
  ref,
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorClassName, className)}
      {...props}
    />
  );
});
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
