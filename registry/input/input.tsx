"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input — Phase 3 Plan 3-02, R4.2.
 *
 * Native `<input>` styled with DGC design tokens (no dark: utilities per
 * D-06, no lang branching inside component per D-07). Text/date/email
 * modes share the same state matrix:
 *   default  → 1px --input border, --card bg, --foreground text
 *   hover    → --gray-400 border
 *   focus    → --blue-700 border + --shadow-focus ring
 *   invalid  → --danger border (via aria-invalid=true)
 *   disabled → --background bg, --muted-foreground text, cursor-not-allowed
 *
 * Khmer date placeholder (ថ្ងៃ/ខែ/ឆ្នាំ per UI-SPEC §2.2) is delivered via
 * CSS pseudo-element scoped by `:lang(km) input[type="date"]::before` —
 * no lang logic inside the component itself. The component exposes the
 * native `required` prop; the paired `<Label>` is responsible for the
 * visual asterisk (per UI-SPEC §2.2 A11y — Input pairs with Label via
 * htmlFor/id).
 *
 * Disabled must use tokenized --background + --muted-foreground, NOT
 * opacity-50 (WCAG AA contrast — matches UI-SPEC §2.2 State matrix).
 */

const inputBaseClassName = [
  // Layout + dimensions (48px height from --input-h; 12px radius from --radius-md)
  "flex h-[var(--input-h)] w-full min-w-0 rounded-[var(--radius-md)]",
  "border border-[hsl(var(--input))] bg-[hsl(var(--card))]",
  "px-[14px] py-0 text-base text-[hsl(var(--foreground))]",
  // File input support parity with shadcn upstream (unused by text/date but harmless)
  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  "placeholder:text-[hsl(var(--muted-foreground))]",
  "transition-colors",
  // Hover darkens border subtly (UI-SPEC state matrix)
  "hover:border-[hsl(var(--gray-400))]",
  // Focus-visible — border flips to --blue-700 and --shadow-focus ring
  "focus-visible:outline-none focus-visible:border-[hsl(var(--blue-700))]",
  "focus-visible:shadow-[var(--shadow-focus)]",
  // Error — aria-invalid flips border to --danger (no opacity, no color-only cue)
  "aria-[invalid=true]:border-[hsl(var(--danger))]",
  "aria-[invalid=true]:focus-visible:border-[hsl(var(--danger))]",
  // Disabled — --background bg, muted-foreground text, cursor blocked (NOT opacity-50)
  "disabled:cursor-not-allowed disabled:bg-[hsl(var(--background))]",
  "disabled:text-[hsl(var(--muted-foreground))]",
].join(" ");

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputBaseClassName, className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
