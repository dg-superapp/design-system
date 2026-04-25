'use client';

/**
 * SectionHeader — Phase 4 Plan 4-02 (R5.3)
 *
 * Horizontal title + optional right-aligned accent action-link.
 * Simplest Phase 4 item — no Radix dependency.
 *
 * Design decisions honored:
 *   D-03 — single file, dot-namespace exports (.Title, .Action)
 *   D-06 — hybrid composition: top-level title/action props + child slots (children escape hatch)
 *   D-14 — no dark: utilities (action-link uses --brand which adapts via theme tokens)
 *   D-15 — Action is presentational <a>; consumer wraps with router
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: { label: string; href: string; ariaLabel?: string };
  as?: 'h2' | 'h3';
}

function SectionHeaderRoot({
  title,
  action,
  as = 'h2',
  className,
  children,
  ...rest
}: SectionHeaderProps) {
  if (children) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)]',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
  const TitleEl = as;
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)]',
        className,
      )}
      {...rest}
    >
      {title ? (
        <TitleEl className="text-base font-semibold text-foreground">{title}</TitleEl>
      ) : (
        <span aria-hidden="true" />
      )}
      {action && (
        <SectionHeaderAction href={action.href} ariaLabel={action.ariaLabel}>
          {action.label}
        </SectionHeaderAction>
      )}
    </div>
  );
}

function SectionHeaderTitle({
  children,
  as = 'h2',
}: {
  children: React.ReactNode;
  as?: 'h2' | 'h3';
}) {
  const TitleEl = as;
  return <TitleEl className="text-base font-semibold text-foreground">{children}</TitleEl>;
}

function SectionHeaderAction({
  children,
  href,
  ariaLabel,
}: {
  children: React.ReactNode;
  href: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn(
        'text-sm font-normal text-brand',
        'hover:underline',
        'rounded-[var(--radius-sm)] focus:outline-none focus-visible:[box-shadow:var(--shadow-focus)]',
        'aria-disabled:pointer-events-none aria-disabled:opacity-50',
      )}
    >
      {children}
    </a>
  );
}

export const SectionHeader = Object.assign(SectionHeaderRoot, {
  Title: SectionHeaderTitle,
  Action: SectionHeaderAction,
});
