"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Select — Phase 3 Plan 3-04, R4.4.
 *
 * Radix Select bundle with DGC design tokens (no dark: utilities per
 * D-06, no lang branching inside component per D-07). All sub-parts
 * are exported from this single file per D-04/D-05 so downstream
 * consumers install one component via shadcn CLI.
 *
 * State matrix (parity with Input §2.2):
 *   Trigger default   → 1px --input border, --card bg, --foreground text
 *   Trigger hover     → --gray-400 border
 *   Trigger focus     → --blue-700 border + --shadow-focus ring
 *   Trigger open      → --blue-700 border + --shadow-focus (data-state=open)
 *   Trigger invalid   → --danger border (via aria-invalid=true)
 *   Trigger disabled  → --background bg, --muted-foreground text,
 *                       cursor-not-allowed (NOT opacity-50 — WCAG AA)
 *
 *   Content           → --card bg, --border, --shadow-2, 12px radius
 *   Item hover/focus  → --background bg
 *   Item selected     → --blue-050 bg + --brand text + font-medium
 *   Item disabled     → pointer-events none, muted text
 *
 * Keyboard: Radix handles Space/Enter to open, Arrow keys to cycle,
 * Escape to close, typeahead.
 */

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const selectTriggerClassName = [
  // Layout + dimensions (48px height, 12px radius, parity with Input)
  "flex h-[var(--input-h)] w-full items-center justify-between",
  "rounded-[var(--radius-md)] border border-[hsl(var(--input))]",
  "bg-[hsl(var(--card))] px-[14px] py-0 text-base",
  "text-[hsl(var(--foreground))] transition-colors",
  // Placeholder state — muted-foreground (matches Input placeholder)
  "data-[placeholder]:text-[hsl(var(--muted-foreground))]",
  // Hover + open border treatment
  "hover:border-[hsl(var(--gray-400))]",
  "data-[state=open]:border-[hsl(var(--blue-700))]",
  "data-[state=open]:shadow-[var(--shadow-focus)]",
  // Focus-visible (Input parity)
  "focus-visible:outline-none focus-visible:border-[hsl(var(--blue-700))]",
  "focus-visible:shadow-[var(--shadow-focus)]",
  // Invalid
  "aria-[invalid=true]:border-[hsl(var(--danger))]",
  "aria-[invalid=true]:focus-visible:border-[hsl(var(--danger))]",
  // Disabled (NOT opacity-50)
  "disabled:cursor-not-allowed disabled:bg-[hsl(var(--background))]",
  "disabled:text-[hsl(var(--muted-foreground))]",
  // Ensure icon inherits muted styling via chevron class below
  "[&>span]:line-clamp-1",
].join(" ");

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectTriggerClassName, className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          aria-hidden="true"
          className="ml-2 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(function SelectScrollUpButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-[hsl(var(--muted-foreground))]",
        className,
      )}
      {...props}
    >
      <ChevronUp aria-hidden="true" className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(function SelectScrollDownButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-[hsl(var(--muted-foreground))]",
        className,
      )}
      {...props}
    >
      <ChevronDown aria-hidden="true" className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
});
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const selectContentClassName = [
  // Popover surface — --card bg, --border, --shadow-2, 12px radius
  "relative z-50 max-h-[240px] min-w-[8rem] overflow-hidden",
  "rounded-[var(--radius-md)] border border-[hsl(var(--border))]",
  "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]",
  "shadow-[var(--shadow-2)]",
  // Radix open/close state animations (entrance/exit)
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
].join(" ");

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent(
  { className, children, position = "popper", ...props },
  ref,
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          selectContentClassName,
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        "px-[14px] py-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))]",
        className,
      )}
      {...props}
    />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const selectItemClassName = [
  // Layout — 40px row, 14px horizontal padding
  "relative flex h-[40px] w-full cursor-default select-none items-center",
  "rounded-sm pl-[14px] pr-10 text-base outline-none",
  // Hover/focus — --background wash
  "focus:bg-[hsl(var(--background))]",
  // Selected — --blue-050 bg + --brand text + medium weight
  "data-[state=checked]:bg-[hsl(var(--blue-050))]",
  "data-[state=checked]:text-[hsl(var(--brand))]",
  "data-[state=checked]:font-medium",
  // Disabled item — non-interactive + muted
  "data-[disabled]:pointer-events-none",
  "data-[disabled]:text-[hsl(var(--muted-foreground))]",
].join(" ");

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(selectItemClassName, className)}
      {...props}
    >
      <span className="absolute right-3 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-[hsl(var(--border))]", className)}
      {...props}
    />
  );
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
