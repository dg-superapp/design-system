'use client';

/**
 * StepIndicator — Phase 4 Plan 4-05 (R5.5, R10.1)
 *
 * Ordered list of numbered 28px circles connected by 2px bars representing
 * process state — pending / active / done.
 *
 * Design decisions honored:
 *   D-03 — single file, dot-namespace exports (.Step)
 *   D-06 — no dark: utilities (token-driven)
 *   D-08 — dual API: steps={[]} array path renders compound internally
 *   D-15 — pure-presentational state; no usePathname coupling
 *
 * UI-SPEC Gap #4 closure: connector bar is an absolutely-positioned
 * <span aria-hidden="true"> between consecutive circles. Color resolves
 * by the CURRENT step's state — `bg-brand` when done (path INTO the next
 * is "completed"), `bg-[hsl(var(--bg-surface-2))]` otherwise.
 */

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepState = 'pending' | 'active' | 'done';
export type StepData = { label: string; state: StepState };

export interface StepIndicatorProps {
  steps?: ReadonlyArray<StepData>;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

const StepContext = React.createContext<{ totalSteps: number } | null>(null);

function StepIndicatorRoot({ steps, ariaLabel, children, className }: StepIndicatorProps) {
  const stepNodes = steps
    ? steps.map((s, i) => <StepIndicatorStep key={i} index={i + 1} {...s} />)
    : children;
  const totalSteps = steps?.length ?? React.Children.count(children);
  return (
    <StepContext.Provider value={{ totalSteps }}>
      <ol
        aria-label={ariaLabel}
        className={cn('relative flex items-start gap-[var(--space-4)]', className)}
      >
        {stepNodes}
      </ol>
    </StepContext.Provider>
  );
}

interface StepIndicatorStepProps extends StepData {
  index?: number;
}

function StepIndicatorStep({ label, state, index }: StepIndicatorStepProps) {
  const ctx = React.useContext(StepContext);
  const total = ctx?.totalSteps ?? 0;
  const stateLabel =
    state === 'done'
      ? 'completed / បានបញ្ចប់'
      : state === 'active'
        ? 'active / សកម្ម'
        : 'pending / កំពុងរង់ចាំ';
  const isLast = index != null && index === total;
  const showConnector = !isLast;

  return (
    <li
      aria-current={state === 'active' ? 'step' : undefined}
      aria-label={`${index ?? ''}. ${label}, ${stateLabel}`}
      className="relative flex min-w-0 flex-1 flex-col items-center"
    >
      <div
        className={cn(
          'relative flex items-center justify-center',
          'h-[28px] w-[28px] rounded-full text-base font-semibold',
          state === 'pending' && 'bg-[hsl(var(--bg-surface-2))] text-muted-foreground',
          state === 'active' &&
            'bg-brand text-brand-foreground ring-2 ring-[hsl(var(--brand)/0.25)] ring-offset-2 ring-offset-background',
          state === 'done' && 'bg-brand text-brand-foreground',
          'transition-colors duration-[var(--dur-base)]',
        )}
      >
        {state === 'done' ? (
          <Check aria-hidden="true" className="h-[16px] w-[16px]" />
        ) : (
          (index ?? '')
        )}
      </div>
      <div className="mt-[var(--space-2)] max-w-[88px] truncate text-center text-xs font-medium text-foreground">
        {label}
      </div>
      {showConnector && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-[14px] left-[calc(50%+14px+var(--space-2))] right-[calc(-50%+14px+var(--space-2))]',
            'h-[2px]',
            state === 'done' ? 'bg-brand' : 'bg-[hsl(var(--bg-surface-2))]',
          )}
        />
      )}
    </li>
  );
}

export const StepIndicator = Object.assign(StepIndicatorRoot, {
  Step: StepIndicatorStep,
});
