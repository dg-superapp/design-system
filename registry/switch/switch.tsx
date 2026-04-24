"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/**
 * Switch — Phase 3 Plan 3-07, R4.7.
 *
 * Radix Switch bundled with DGC design tokens. Single-file bundle exports
 * just `<Switch>` (Root+Thumb subsumed) so downstream consumers install one
 * primitive via shadcn CLI (D-04/D-05).
 *
 * Dimensions (UI-SPEC §2.7, R4.7 authoritative — specimen 36×20 deprecated):
 *   Track              → 40×24 px, rounded --radius-pill
 *   Thumb              → 18×18 px, rounded --radius-pill, white fill
 *   Thumb off          → translate-x-[2px] (2px inset from track left edge)
 *   Thumb on           → translate-x-[20px] (40 - 18 - 2 = 20)
 *
 * State matrix (UI-SPEC §2.7):
 *   Unchecked default  → --gray-300 track
 *   Unchecked hover    → --gray-400 track
 *   Checked            → --brand track + white thumb
 *   Checked hover      → --brand-hover track
 *   Focus-visible      → --shadow-focus ring on track (keyboard only)
 *   Disabled           → opacity-50 (soft disable — track color stays
 *                         tokenized; matches Radix disabled idiom)
 *
 * Keyboard: Radix handles Space to toggle. Tab reaches the Root button.
 *
 * Transitions: `transition-colors` on track, `transition-transform` on
 * thumb — both bound to --dur-fast / --ease-standard for consistent
 * motion with Checkbox/Radio state changes.
 *
 * No dark: utilities (D-06 token-only theming). No lang branching in
 * component (D-07 — label Khmer/Latin is caller's responsibility).
 */

const switchRootClassName = [
  // Track dimensions (R4.7 authoritative)
  "peer inline-flex h-[24px] w-[40px] shrink-0 cursor-pointer items-center",
  "rounded-[var(--radius-pill)] border-transparent",
  // Smooth color transitions on track (checked/unchecked, hover)
  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
  // Focus-visible — shadow-focus ring, no native outline
  "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
  // Disabled — cursor + soft opacity (Radix idiom; token colors remain)
  "disabled:cursor-not-allowed disabled:opacity-50",
  // State colors — explicit tokens (no opacity-hack for differentiation)
  "data-[state=checked]:bg-[hsl(var(--brand))]",
  "data-[state=unchecked]:bg-[hsl(var(--gray-300))]",
  "data-[state=checked]:hover:bg-[hsl(var(--brand-hover))]",
  "data-[state=unchecked]:hover:bg-[hsl(var(--gray-400))]",
].join(" ");

const switchThumbClassName = [
  // Thumb dimensions + shape (18×18 circle, white fill)
  "pointer-events-none block h-[18px] w-[18px] rounded-[var(--radius-pill)]",
  "bg-white shadow ring-0",
  // Smooth slide — transform-based for GPU compositing
  "transition-transform duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
  // Positions: off = 2px inset, on = 40-18-2 = 20px translation
  "data-[state=checked]:translate-x-[20px] data-[state=unchecked]:translate-x-[2px]",
].join(" ");

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(switchRootClassName, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={switchThumbClassName} />
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
