"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Textarea — Phase 3 Plan 3-03, R4.3.
 *
 * Native `<textarea>` styled with DGC design tokens. Mirrors the Input
 * state matrix (§ UI-SPEC 2.3 = same tokens as 2.2) — the only visual
 * deltas are:
 *   - `min-height: 88px`    (vs 48px fixed height on Input)
 *   - `resize: vertical`    (horizontal resize blocked)
 *   - `py-3`                (vertical padding; Input pins height instead)
 *
 * Everything else — border, card bg, focus ring, aria-invalid danger
 * border, disabled tokens — matches Input verbatim so Label + form-field
 * scaffolds can style both primitives from the same rules.
 *
 * No dark:* utilities (D-06 — tokens flip via :root / .dark on the
 * theme). No lang branching inside the component (D-07) — Khmer text's
 * coeng descenders are handled by the `:lang(km)` `--leading-loose`
 * cascade in dgc-theme, which the textarea's `py-3` comfortably
 * accommodates without extra overrides.
 *
 * Disabled uses tokenized --background + --muted-foreground, NOT
 * opacity-50 (WCAG AA — UI-SPEC § 2.2/2.3 state matrix).
 */

const textareaBaseClassName = [
  // Layout — min-height (not fixed height) + vertical resize only
  "flex min-h-[88px] w-full rounded-[var(--radius-md)]",
  "border border-[hsl(var(--input))] bg-[hsl(var(--card))]",
  "px-[14px] py-3 text-base text-[hsl(var(--foreground))]",
  "resize-y",
  "placeholder:text-[hsl(var(--muted-foreground))]",
  "transition-colors",
  // Hover darkens border subtly (UI-SPEC state matrix parity with Input)
  "hover:border-[hsl(var(--gray-400))]",
  // Focus-visible — border flips to --blue-700 and --shadow-focus ring
  "focus-visible:outline-none focus-visible:border-[hsl(var(--blue-700))]",
  "focus-visible:shadow-[var(--shadow-focus)]",
  // Error — aria-invalid flips border to --danger
  "aria-[invalid=true]:border-[hsl(var(--danger))]",
  "aria-[invalid=true]:focus-visible:border-[hsl(var(--danger))]",
  // Disabled — --background bg, muted-foreground text, cursor blocked
  "disabled:cursor-not-allowed disabled:bg-[hsl(var(--background))]",
  "disabled:text-[hsl(var(--muted-foreground))]",
].join(" ");

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(textareaBaseClassName, className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
