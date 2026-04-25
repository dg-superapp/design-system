'use client';

/**
 * SegmentedTabs — Phase 4 Plan 4-04 (R5.4, R10.1, R10.3)
 *
 * Pill-group tab navigation. Renders Radix Tabs DIRECTLY (NOT via Phase 3
 * `registry/tabs/`) so consumers can install both items without conflict.
 *
 * Design decisions honored:
 *   D-03 — single file, dot-namespace exports (.List, .Trigger, .Content)
 *   D-06 — no dark: utilities (token-driven hover that works across modes)
 *   D-08 — dual API: `items={[]}` array path renders compound internally
 *          (only one render surface, no API drift)
 *   D-15 — pure-presentational active state; consumer reads pathname and
 *          passes the matched value to <SegmentedTabs value={…}>
 *
 * Pitfalls closed:
 *   Pitfall 4 — CVA exports DELIBERATELY namespaced
 *               (segmentedTabsListVariants / segmentedTabsTriggerVariants)
 *               so they don't collide with Phase 3 tabsListVariants /
 *               tabsTriggerVariants. Different visual contracts compose at
 *               consumer level, not via registry cascade.
 */

import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const segmentedTabsListVariants = cva(
  [
    'inline-flex items-center gap-[var(--space-1)]',
    'bg-[hsl(var(--bg-surface-2))] rounded-[var(--radius-md)]',
    'p-[var(--space-1)]',
  ].join(' '),
);

export const segmentedTabsTriggerVariants = cva(
  [
    'inline-flex items-center justify-center',
    'min-h-[36px] px-[var(--space-4)]',
    'rounded-[var(--radius-sm)] text-sm font-medium',
    'bg-transparent text-foreground',
    'transition-colors duration-[var(--dur-fast)]',
    'hover:bg-[hsl(var(--bg-surface-2)/0.6)]',
    'data-[state=active]:bg-brand data-[state=active]:text-brand-foreground',
    'data-[state=active]:font-semibold',
    'focus:outline-none focus-visible:[box-shadow:var(--shadow-focus)]',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);

type SegmentedTabItem = { value: string; label: string; disabled?: boolean };

export interface SegmentedTabsProps
  extends Omit<React.ComponentProps<typeof RadixTabs.Root>, 'children'> {
  items?: ReadonlyArray<SegmentedTabItem>;
  ariaLabel?: string;
  children?: React.ReactNode;
}

function SegmentedTabsRoot({
  items,
  ariaLabel,
  children,
  className,
  ...rest
}: SegmentedTabsProps) {
  const content = items ? (
    <SegmentedTabsList aria-label={ariaLabel}>
      {items.map((it) => (
        <SegmentedTabsTrigger key={it.value} value={it.value} disabled={it.disabled}>
          {it.label}
        </SegmentedTabsTrigger>
      ))}
    </SegmentedTabsList>
  ) : (
    children
  );
  return (
    <RadixTabs.Root className={cn(className)} {...rest}>
      {content}
    </RadixTabs.Root>
  );
}

const SegmentedTabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List> &
    VariantProps<typeof segmentedTabsListVariants>
>(({ className, ...props }, ref) => (
  <RadixTabs.List ref={ref} className={cn(segmentedTabsListVariants(), className)} {...props} />
));
SegmentedTabsList.displayName = 'SegmentedTabs.List';

const SegmentedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> &
    VariantProps<typeof segmentedTabsTriggerVariants>
>(({ className, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(segmentedTabsTriggerVariants(), className)}
    {...props}
  />
));
SegmentedTabsTrigger.displayName = 'SegmentedTabs.Trigger';

const SegmentedTabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn('mt-[var(--space-3)] focus:outline-none', className)}
    {...props}
  />
));
SegmentedTabsContent.displayName = 'SegmentedTabs.Content';

export const SegmentedTabs = Object.assign(SegmentedTabsRoot, {
  List: SegmentedTabsList,
  Trigger: SegmentedTabsTrigger,
  Content: SegmentedTabsContent,
});
