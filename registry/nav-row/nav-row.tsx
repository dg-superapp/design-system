'use client';

/**
 * NavRow — Phase 4 Plan 4-03 (R5.6, R10.1, R10.3)
 *
 * 48px min-height list row with:
 *   - 24px leading icon-chip
 *   - label + optional caption
 *   - hybrid trailing slot (chevron / count built-in OR ReactNode escape hatch)
 *
 * Design decisions honored:
 *   D-03 — single file, dot-namespace exports (.Leading, .Body, .Trailing)
 *   D-05 — hybrid trailing: chevron + count are built-in variants;
 *          switch/toggle/custom go through ReactNode slot
 *   D-06 — no dark: utilities (active state via theme tokens)
 *   D-15 — presentational only; consumer wraps with <a> or <button>
 *
 * Pitfalls closed:
 *   Pitfall 6 — `relative` is on the row root (variant base classes), so the
 *               active stripe `before:` pseudo stays bound to the row even
 *               when consumer wraps with `<a class="relative">`.
 */

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const navRowVariants = cva(
  [
    'relative flex items-center gap-[var(--space-3)]',
    'min-h-[48px] px-[var(--space-4)]',
    'bg-card text-foreground',
    'transition-colors duration-[var(--dur-fast)]',
    'hover:bg-[hsl(var(--blue-050)/0.5)]',
    'focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]',
  ].join(' '),
  {
    variants: {
      active: {
        true: [
          'bg-[hsl(var(--nav-active-bg))]',
          "before:absolute before:inset-y-0 before:left-0",
          "before:w-[var(--nav-active-stripe)] before:bg-brand before:content-['']",
        ].join(' '),
        false: '',
      },
      tone: {
        default: '',
        danger: 'text-destructive [&_svg]:text-destructive',
      },
    },
    defaultVariants: { active: false, tone: 'default' },
  },
);

export type NavRowTrailingVariant = 'chevron' | 'count' | 'none';

export interface NavRowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navRowVariants> {
  label?: string;
  caption?: string;
  leadingIcon?: React.ReactNode;
  trailing?: NavRowTrailingVariant | React.ReactNode;
  trailingCount?: number;
}

function NavRowRoot({
  label,
  caption,
  leadingIcon,
  active,
  tone,
  trailing,
  trailingCount,
  className,
  children,
  ...rest
}: NavRowProps) {
  if (children) {
    return (
      <div className={cn(navRowVariants({ active, tone }), className)} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn(navRowVariants({ active, tone }), className)} {...rest}>
      {leadingIcon && <NavRowLeading>{leadingIcon}</NavRowLeading>}
      {(label || caption) && <NavRowBody label={label ?? ''} caption={caption} />}
      <NavRowTrailingSlot trailing={trailing} count={trailingCount} />
    </div>
  );
}

function NavRowLeading({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[24px] w-[24px] items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]"
    >
      {children}
    </span>
  );
}

function NavRowBody({ label, caption }: { label: string; caption?: string }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="truncate text-sm font-normal">{label}</div>
      {caption && (
        <div className="truncate text-xs font-medium leading-tight text-muted-foreground">
          {caption}
        </div>
      )}
    </div>
  );
}

function NavRowTrailing({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto inline-flex items-center gap-[var(--space-2)] pr-[var(--space-3)]">
      {children}
    </div>
  );
}

function NavRowTrailingSlot({
  trailing,
  count,
}: {
  trailing?: NavRowTrailingVariant | React.ReactNode;
  count?: number;
}) {
  if (trailing === 'chevron') {
    return (
      <NavRowTrailing>
        <ChevronRight
          aria-hidden="true"
          className="h-[18px] w-[18px] text-muted-foreground"
        />
      </NavRowTrailing>
    );
  }
  if (trailing === 'count') {
    return (
      <NavRowTrailing>
        <Badge
          aria-label={count ? `${count} new / ${count} ថ្មី` : undefined}
          className="bg-[hsl(var(--red-700))] text-white"
        >
          {count ?? 0}
        </Badge>
      </NavRowTrailing>
    );
  }
  if (trailing === 'none' || trailing == null) return null;
  return <NavRowTrailing>{trailing}</NavRowTrailing>;
}

export const NavRow = Object.assign(NavRowRoot, {
  Leading: NavRowLeading,
  Body: NavRowBody,
  Trailing: NavRowTrailing,
});
