"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

/**
 * Radio — Phase 3 Plan 3-06, R4.6.
 *
 * Radix RadioGroup bundled with DGC design tokens. Single file exports
 * both `RadioGroup` (Root) and `RadioGroupItem` (Item) so downstream
 * consumers install one primitive via shadcn CLI (D-04/D-05).
 *
 * State matrix (UI-SPEC §2.6):
 *   Unselected default → 1.5px --gray-300 border, --card bg
 *   Unselected hover   → --brand border, --blue-050 bg
 *   Selected           → --brand border + 10×10 --brand inner dot on --card bg
 *                        (UI-SPEC §10 deviation: specimen authoritative over
 *                         R4.6 --accent — DGC blue dot on white --card)
 *   Focus-visible      → --shadow-focus ring (keyboard only)
 *   Disabled           → --gray-100 bg, cursor-not-allowed
 *                        (NOT opacity-50 — WCAG AA)
 *
 * Keyboard: Radix handles arrow keys (Up/Down/Left/Right) to cycle
 * selection within the group; Tab moves between groups, not within items.
 *
 * Group layout: CSS grid with --space-3 (12px) vertical gap per UI-SPEC
 * §2.6 Dimensions. Caller can override via className.
 *
 * No dark: utilities (D-06 token-only theming). No lang branching in
 * component (D-07 — label Khmer/Latin is caller's responsibility).
 */

const radioGroupClassName = "grid gap-[var(--space-3)]";

const radioItemClassName = [
  // Circle dimensions + pill corner + token border (unselected default)
  "aspect-square h-[20px] w-[20px] shrink-0",
  "rounded-[var(--radius-pill)] border-[1.5px] border-[hsl(var(--gray-300))]",
  "bg-[hsl(var(--card))]",
  // Hover — UI-SPEC §2.6 (brand border + blue-050 wash, matches Checkbox)
  "hover:border-[hsl(var(--brand))] hover:bg-[hsl(var(--blue-050))]",
  // Focus-visible — shadow-focus ring, no native outline
  "focus:outline-none focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
  // Selected — brand border, --card bg (specimen authoritative over R4.6)
  "data-[state=checked]:border-[hsl(var(--brand))]",
  "data-[state=checked]:bg-[hsl(var(--card))]",
  // Disabled — gray-100 fill (NOT opacity-50 per D-06 / WCAG)
  "disabled:cursor-not-allowed",
  "disabled:bg-[hsl(var(--gray-100))]",
  "disabled:border-[hsl(var(--gray-200))]",
  // Smooth state transitions
  "transition-colors",
  // Centered indicator surface
  "inline-flex items-center justify-center",
].join(" ");

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(radioGroupClassName, className)}
      {...props}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(function RadioGroupItem({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioItemClassName, className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* 10×10 brand-fill dot — specimen authoritative (UI-SPEC §10 deviation).
            Radix only mounts this when the item is data-state=checked. */}
        <span className="h-[10px] w-[10px] rounded-[var(--radius-pill)] bg-[hsl(var(--brand))]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
