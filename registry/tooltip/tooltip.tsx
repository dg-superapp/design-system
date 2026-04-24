"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/**
 * Tooltip — Phase 3 Plan 3-11, R4.11.
 *
 * Radix Tooltip bundle with a DELIBERATE exception to semantic aliasing:
 * the content surface uses `--gray-900` DIRECTLY (not `--popover`, not
 * `--card`) per UI-SPEC §2.11. Rationale from UI-SPEC:
 *
 *   > --gray-900 is used directly (not via semantic alias) because
 *   > --popover maps to white/card, which is the wrong color for
 *   > tooltip. This is a deliberate exception, noted in CONTEXT specifics.
 *
 * Dimensions (UI-SPEC §2.11):
 *   - Background: hsl(var(--gray-900)) (#212121)
 *   - Foreground: white (per-token white, not --brand-foreground alias
 *     because gray-900 has no semantic fg pair)
 *   - Radius:     --radius-sm (8px)
 *   - Padding:    6px 10px
 *   - Font:       --text-xs (12px), regular weight, normal leading
 *   - Max-width:  200px
 *   - Shadow:     --shadow-2
 *   - Arrow:      6×6, same --gray-900 fill
 *
 * Timing:
 *   - Open delay: 500ms (Radix default via TooltipProvider)
 *   - Skip delay:  100ms (rapid re-hover within group)
 *
 * A11y (Radix-managed):
 *   - role="tooltip" on content
 *   - Opens on hover + focus
 *   - Closes on Escape, pointer-leave, blur
 *   - TooltipTrigger supports asChild (Slot) so the underlying
 *     element keeps its own focus + semantics
 *
 * Per D-06, NO dark: utilities — token resolves the same in light +
 * dark (an always-dark chip is the intended visual in both themes).
 */

/**
 * TooltipProvider — direct passthrough to Radix Provider with DGC defaults
 * (500ms open delay, 100ms skip delay per UI-SPEC §2.11 timing). Radix
 * Provider is a plain FC with no DOM node to forward a ref to, so we wrap
 * it as a regular function component rather than via forwardRef.
 */
function TooltipProvider({
  delayDuration = 500,
  skipDelayDuration = 100,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>): React.ReactElement {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}
TooltipProvider.displayName = "TooltipProvider";

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentClassName = [
  // Stacking
  "z-50",
  // Surface — direct --gray-900 (NOT --popover, NOT --card, per UI-SPEC §2.11)
  "bg-[hsl(var(--gray-900))] text-white",
  // Shape + dimensions
  "rounded-[var(--radius-sm)] px-[10px] py-[6px]",
  "text-xs leading-normal font-normal",
  "max-w-[200px]",
  // Elevation
  "shadow-[var(--shadow-2)]",
  // Overflow safety for long content in narrow viewports
  "overflow-hidden",
  // Entrance/exit animations (token-equivalent via tw-animate-css)
  "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
  "data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
].join(" ");

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent(
  { className, sideOffset = 6, ...props },
  ref,
) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(tooltipContentClassName, className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(function TooltipArrow({ className, width = 12, height = 6, ...props }, ref) {
  return (
    <TooltipPrimitive.Arrow
      ref={ref}
      width={width}
      height={height}
      className={cn("fill-[hsl(var(--gray-900))]", className)}
      {...props}
    />
  );
});
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
};
