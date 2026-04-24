"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — Phase 3 Plan 3-10, R4.10.
 *
 * Non-interactive status pill. DGC design tokens only (no dark: utilities per
 * D-06, no lang branching per D-07). EXACTLY 4 tones (default/success/warning/
 * danger) — no `info` tone in Phase 3, no 5th variant.
 *
 * Shape: 22px height, 2px/10px padding, --radius-pill (999px), --text-xs (12px)
 * font-medium, leading-none. Optional leading icon slot (12px Lucide) via
 * children; inline-flex + --space-1 gap handles layout.
 *
 * Source of truth: 3-UI-SPEC.md §2.10.
 */

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-[var(--space-1,0.25rem)]",
    "h-[22px] px-[10px] py-[2px]",
    "rounded-[var(--radius-pill)]",
    "text-xs font-medium leading-none",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      tone: {
        default:
          "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]",
        success:
          "bg-[hsl(var(--success-bg))] text-[hsl(var(--success))]",
        warning:
          "bg-[hsl(var(--warning-bg))] text-[hsl(var(--warning))]",
        danger:
          "bg-[hsl(var(--danger-bg))] text-[hsl(var(--danger))]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ className, tone, children, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ tone }), className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
