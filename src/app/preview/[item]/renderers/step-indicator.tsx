'use client';

import {
  StepIndicator,
  type StepData,
} from '../../../../../registry/step-indicator/step-indicator';
import type { PreviewRenderer } from './index';

const FIXTURE: ReadonlyArray<{ label: string }> = [
  { label: 'បញ្ជាក់អត្តសញ្ញាណ' }, // Identify
  { label: 'ផ្ទៀងផ្ទាត់' },        // Verify
  { label: 'បង់ប្រាក់' },          // Pay
  { label: 'បញ្ចប់' },             // Done
  { label: 'មើលសេចក្តីសង្ខេប' }, // Review
];

/**
 * StepIndicator preview renderer — Phase 4 Plan 4-05.
 *
 * Knobs (defined in 04-09 manifest entry): stepCount (variant 3/4/5),
 * activeIndex (number 0..stepCount-1).
 */
export const StepIndicatorPreview: PreviewRenderer = ({ state }) => {
  const stepCount = Math.max(3, Math.min(5, Number(state.stepCount ?? '4')));
  const activeIndex = Math.max(0, Math.min(stepCount - 1, Number(state.activeIndex ?? 1)));
  const steps: StepData[] = FIXTURE.slice(0, stepCount).map((s, i) => ({
    label: s.label,
    state: i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending',
  }));

  return (
    <div className="mx-auto w-full max-w-[412px] bg-card p-[var(--space-6)]" lang="km">
      <StepIndicator steps={steps} ariaLabel="Application progress / វឌ្ឍនភាពពាក្យសុំ" />
    </div>
  );
};
