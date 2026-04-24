"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — Phase 3 Plan 3-01, R4.1.
 *
 * DGC design tokens only (no dark: utilities per D-06, no lang branching per D-07).
 * Variants: primary, secondary, ghost, ghost-danger. Sizes: default (48px), sm (40px).
 * Disabled uses --bg-disabled / --fg-on-disabled (NOT opacity-50).
 * Focus-visible uses 3px --shadow-focus ring.
 * asChild delegates rendering to a Radix Slot child.
 */

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--radius-md)] font-medium",
    "transition-colors duration-[var(--dur-fast)]",
    "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
    "disabled:pointer-events-none disabled:bg-[hsl(var(--bg-disabled))] disabled:text-[hsl(var(--fg-on-disabled))]",
    "aria-disabled:pointer-events-none aria-disabled:bg-[hsl(var(--bg-disabled))] aria-disabled:text-[hsl(var(--fg-on-disabled))]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))]",
          "hover:bg-[hsl(var(--brand-hover))] active:bg-[hsl(var(--brand-press))]",
          "min-w-[140px]",
        ].join(" "),
        secondary: [
          "bg-[hsl(var(--blue-050))] text-[hsl(var(--brand))]",
          "hover:bg-[hsl(var(--blue-100))] active:bg-[hsl(var(--blue-100))]",
          "min-w-[140px]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[hsl(var(--brand))]",
          "hover:bg-[hsl(var(--blue-050))]",
        ].join(" "),
        "ghost-danger": [
          "bg-transparent text-[hsl(var(--danger))]",
          "hover:bg-[hsl(var(--danger-bg))]",
        ].join(" "),
      },
      size: {
        default: "h-[var(--button-h)] px-5 text-base",
        sm: "h-10 px-[18px] text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      type,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const buttonType = asChild ? undefined : (type ?? "button");
    return (
      <Comp
        ref={ref}
        type={buttonType}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={loading ? true : undefined}
        data-loading={loading ? "true" : undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? <Spinner /> : null}
            {children}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";
