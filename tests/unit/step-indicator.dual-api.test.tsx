import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import {
  StepIndicator,
  type StepData,
} from '../../registry/step-indicator/step-indicator';

/**
 * StepIndicator dual-API parity — Phase 4 Plan 4-05 (D-08, RESEARCH Pattern 3).
 *
 * Asserts that rendering the same fixture via `steps={[...]}` produces
 * identical DOM (li count, aria-current, aria-label) to the canonical
 * compound `<StepIndicator><StepIndicator.Step .../></StepIndicator>` path.
 * Per D-08 the array path renders compound internally — this is a regression
 * guard for API drift.
 */

describe('StepIndicator dual API (D-08, RESEARCH Pattern 3)', () => {
  const steps: StepData[] = [
    { label: 'A', state: 'done' },
    { label: 'B', state: 'active' },
    { label: 'C', state: 'pending' },
  ];

  it('array path produces identical DOM structure to compound path', () => {
    const { container: arrayC } = render(
      <StepIndicator steps={steps} ariaLabel="X" />,
    );
    const { container: compoundC } = render(
      <StepIndicator ariaLabel="X">
        {steps.map((s, i) => (
          <StepIndicator.Step key={i} index={i + 1} {...s} />
        ))}
      </StepIndicator>,
    );

    const arrayLis = arrayC.querySelectorAll('ol > li');
    const compoundLis = compoundC.querySelectorAll('ol > li');
    expect(arrayLis.length).toBe(compoundLis.length);
    expect(arrayLis.length).toBe(steps.length);
    for (let i = 0; i < arrayLis.length; i++) {
      expect(arrayLis[i].getAttribute('aria-current')).toBe(
        compoundLis[i].getAttribute('aria-current'),
      );
      expect(arrayLis[i].getAttribute('aria-label')).toBe(
        compoundLis[i].getAttribute('aria-label'),
      );
    }
  });
});
