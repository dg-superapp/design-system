"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Tabs — Phase 3 Plan 3-12, R4.12.
 *
 * Radix Tabs bundle with DGC design tokens (no dark: utilities per D-06,
 * no lang branching per D-07). Two CVA variants per UI-SPEC §2.12:
 *
 *   underline (default)
 *     - Container: --card bg, 1px --border, --radius-md, overflow-hidden
 *     - Trigger:   44px tall, flex-1, --muted-foreground inactive
 *     - Active:    --brand text + font-semibold + 2px --brand bottom bar
 *
 *   pill
 *     - Container: --background bg, 1px --border, p-[4px], gap-[2px], --radius-md
 *     - Trigger:   36px tall, --radius-sm, --muted-foreground inactive
 *     - Active:    --card bg + --brand text + --shadow-1
 *
 * Keyboard: Radix handles ArrowLeft/ArrowRight cycling, Home/End jumps,
 * Tab to enter panel. Focus-visible applies --shadow-focus ring to the
 * active trigger. Disabled triggers use cursor-not-allowed (NOT
 * opacity-50, per WCAG AA contrast rule D-03).
 *
 * Controlled AND uncontrolled modes both supported (Radix pass-through):
 *   - Uncontrolled: <Tabs defaultValue="a">
 *   - Controlled:   <Tabs value={v} onValueChange={setV}>
 */

type TabsVariant = "underline" | "pill";

const TabsVariantContext = React.createContext<TabsVariant>("underline");

/**
 * tabsListVariants — CVA variants for TabsList container.
 */
export const tabsListVariants = cva(
  "relative inline-flex",
  {
    variants: {
      variant: {
        underline: [
          "flex w-full",
          "bg-[hsl(var(--card))]",
          "rounded-[var(--radius-md)]",
          "border border-[hsl(var(--border))]",
          "overflow-hidden",
        ].join(" "),
        pill: [
          "bg-[hsl(var(--background))]",
          "border border-[hsl(var(--border))]",
          "p-[4px] gap-[2px]",
          "rounded-[var(--radius-md)]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "underline" },
  },
);

/**
 * tabsTriggerVariants — CVA variants for TabsTrigger.
 * Focus-visible + disabled treatment is shared; variant-specific state
 * styles (active indicator, hover, dimensions) live under each arm.
 */
export const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center gap-[6px]",
    "text-sm font-medium whitespace-nowrap",
    "text-[hsl(var(--muted-foreground))]",
    "transition-colors duration-[var(--dur-fast)]",
    "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
    "disabled:cursor-not-allowed disabled:text-[hsl(var(--muted-foreground))]",
  ].join(" "),
  {
    variants: {
      variant: {
        underline: [
          "relative flex-1 h-[44px] px-[var(--space-2)] min-w-0",
          "hover:text-[hsl(var(--foreground))]",
          "hover:bg-[hsl(var(--background))]",
          "data-[state=active]:text-[hsl(var(--brand))]",
          "data-[state=active]:font-semibold",
          "data-[state=active]:after:content-['']",
          "data-[state=active]:after:absolute",
          "data-[state=active]:after:bottom-0",
          "data-[state=active]:after:left-[var(--space-2)]",
          "data-[state=active]:after:right-[var(--space-2)]",
          "data-[state=active]:after:h-[2px]",
          "data-[state=active]:after:bg-[hsl(var(--brand))]",
          "data-[state=active]:after:rounded-t-[2px]",
        ].join(" "),
        pill: [
          "h-[36px] px-[var(--space-3)]",
          "rounded-[var(--radius-sm)]",
          "hover:text-[hsl(var(--foreground))]",
          "data-[state=active]:bg-[hsl(var(--card))]",
          "data-[state=active]:text-[hsl(var(--brand))]",
          "data-[state=active]:shadow-[var(--shadow-1)]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "underline" },
  },
);

// Tabs (Root) — pure Radix pass-through. Exposes value / defaultValue /
// onValueChange / orientation / dir / activationMode directly.
const Tabs = TabsPrimitive.Root;

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(function TabsList({ className, variant, ...props }, ref) {
  const effective = (variant ?? "underline") as TabsVariant;
  return (
    <TabsVariantContext.Provider value={effective}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant: effective }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(function TabsTrigger({ className, variant, ...props }, ref) {
  // If a Trigger is rendered inside a List the List context wins; when a
  // consumer passes `variant` explicitly we honour it so docs snippets
  // can render standalone (variant prop on both List and Trigger).
  const ctx = React.useContext(TabsVariantContext);
  const effective = (variant ?? ctx ?? "underline") as TabsVariant;
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant: effective }), className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-[var(--space-3)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        className,
      )}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
