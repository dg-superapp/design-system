"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

/**
 * ScrollArea — Phase 3 Plan 3-14, R4.14.
 *
 * Radix ScrollArea bundled with DGC tokens. Single-file bundle exports
 * `<ScrollArea>` (Root + Viewport + ScrollBar + Corner composed) and the
 * standalone `<ScrollBar>` so consumers install one primitive via the
 * shadcn CLI (D-04/D-05).
 *
 * UI-SPEC §2.14 authoritative:
 *   Thumb        → 8px bar, `hsl(var(--gray-300))` (#BDBDBD) fill, pill
 *                  corners (`var(--radius-pill)` = 999px). Hover swaps to
 *                  `hsl(var(--gray-400))` (#9E9E9E).
 *   Visibility   → Radix `type="hover"` — scrollbar is hidden by default
 *                  and fades in on pointer-enter / focus-visible with
 *                  `--dur-fast` (120ms) opacity transition.
 *   Track        → 1px padding so the 8px thumb sits on a 10px rail.
 *                  NO opacity-50 (D-03 WCAG-AA rule).
 *   Constrain    → Consumer MUST set height/max-height on <ScrollArea>
 *                  (the component does not self-constrain per UI-SPEC).
 *   Keyboard     → Inner focusable content remains tabbable; viewport
 *                  does NOT trap focus.
 *
 * No `dark:` utilities (D-06 token-only theming): --gray-300 / --gray-400
 * resolve against the light palette; dark-mode consumers override the
 * tokens in dgc-theme, not here.
 */

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(function ScrollArea(
  { className, children, type = "hover", ...props },
  ref,
) {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      type={type}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-testid="scroll-area-viewport"
        tabIndex={0}
        className="h-full w-full rounded-[inherit] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

/**
 * Exported class strings so unit tests (jsdom) can assert token wiring
 * without depending on Radix's overflow-gated thumb mount. jsdom lacks
 * real layout + ResizeObserver, so Radix skips rendering the thumb even
 * under `forceMount` until it measures overflow. Playwright/e2e covers
 * the live DOM shape.
 */
export const scrollBarClassName = cn(
  "flex touch-none select-none p-[1px]",
  "transition-colors duration-[var(--dur-fast)]",
  "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[8px]",
  "data-[orientation=horizontal]:h-[8px] data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-col",
);

export const scrollThumbClassName = cn(
  "relative flex-1 rounded-[var(--radius-pill)]",
  "bg-[hsl(var(--gray-300))] hover:bg-[hsl(var(--gray-400))]",
  "transition-colors duration-[var(--dur-fast)]",
);

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(function ScrollBar({ className, orientation = "vertical", ...props }, ref) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(scrollBarClassName, className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-testid="scroll-area-thumb"
        className={scrollThumbClassName}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
