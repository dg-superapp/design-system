"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

/**
 * Checkbox — Phase 3 Plan 3-05, R4.5.
 *
 * Radix Checkbox with DGC design tokens (no dark: utilities per D-06,
 * no lang branching inside component per D-07). Shipped as a single
 * `<Checkbox>` root that subsumes Root + Indicator so downstream
 * consumers install one file via shadcn CLI (D-04/D-05).
 *
 * State matrix (UI-SPEC §2.5):
 *   Unchecked default   → 1.5px --gray-300 border, --card bg
 *   Unchecked hover     → --brand border, --blue-050 bg
 *   Checked             → --brand bg + --brand border + white check glyph
 *   Checked hover       → --brand-hover bg + --brand-hover border
 *   Indeterminate       → --brand bg + --brand border + white minus glyph
 *   Focus-visible       → --shadow-focus ring (keyboard only)
 *   Disabled unchecked  → --gray-100 bg, --gray-200 border, cursor-not-allowed
 *                         (NOT opacity-50 — WCAG AA)
 *
 * Keyboard: Radix handles Space to toggle; label click delegates via
 * standard `<label for>` association (wired by the renderer/Form).
 *
 * Icons: inline SVG (Check / Minus) — lucide-react pin is wrong in this
 * repo (see 3-01 SUMMARY known-issue). Scoped to indicator only.
 */

const checkboxClassName = [
  // Box dimensions + corner + token border (unchecked default)
  "peer h-[20px] w-[20px] shrink-0",
  "rounded-[var(--radius-xs)] border-[1.5px] border-[hsl(var(--gray-300))]",
  "bg-[hsl(var(--card))]",
  // Hover — UI-SPEC §2.5 (brand border + blue-050 wash)
  "hover:border-[hsl(var(--brand))] hover:bg-[hsl(var(--blue-050))]",
  // Focus-visible — shadow-focus ring, no native outline
  "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
  // Checked — brand fill + brand border + white indicator
  "data-[state=checked]:bg-[hsl(var(--brand))]",
  "data-[state=checked]:border-[hsl(var(--brand))]",
  "data-[state=checked]:text-white",
  "data-[state=checked]:hover:bg-[hsl(var(--brand-hover))]",
  "data-[state=checked]:hover:border-[hsl(var(--brand-hover))]",
  // Indeterminate — same visual treatment as checked, different glyph
  "data-[state=indeterminate]:bg-[hsl(var(--brand))]",
  "data-[state=indeterminate]:border-[hsl(var(--brand))]",
  "data-[state=indeterminate]:text-white",
  // Disabled — gray-100 fill + gray-200 border (NOT opacity-50 per D-06 / WCAG)
  "disabled:cursor-not-allowed",
  "disabled:bg-[hsl(var(--gray-100))]",
  "disabled:border-[hsl(var(--gray-200))]",
  // Smooth state transitions
  "transition-colors",
  // Centered indicator surface
  "inline-flex items-center justify-center",
].join(" ");

/**
 * Inline 13×13 Check glyph — weight 2.5 to read at 20px box. Avoids
 * importing lucide-react (broken pin in this repo, see 3-01 SUMMARY).
 */
function CheckGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[13px] w-[13px]"
      {...props}
    >
      <path d="M3 8.5 L6.5 12 L13 4.5" />
    </svg>
  );
}

/** Inline 13×13 Minus glyph for indeterminate state. */
function MinusGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-[13px] w-[13px]"
      {...props}
    >
      <path d="M3.5 8 L12.5 8" />
    </svg>
  );
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxClassName, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {/* Radix only mounts Indicator when state is checked or indeterminate.
            We branch on checked prop to pick the correct glyph; for
            controlled boolean usage Radix renders on `true` and swaps via
            data-state on the root when `"indeterminate"` is passed. */}
        {props.checked === "indeterminate" ? <MinusGlyph /> : <CheckGlyph />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
