import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { SegmentedTabs } from '../../registry/segmented-tabs/segmented-tabs';

/**
 * SegmentedTabs dual-API parity — Phase 4 Plan 4-04 (D-08).
 *
 * Asserts that rendering the same fixture via `items={[...]}` (sugar path)
 * produces structurally equal DOM to the canonical compound path. Per D-08,
 * the array path renders compound internally, so any divergence is a bug.
 *
 * Runs pre-04-09 because it imports the registry source directly — does
 * not depend on `/preview/segmented-tabs` being reachable.
 */

describe('SegmentedTabs dual API (D-08)', () => {
  const items = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
  ] as const;

  it('array path renders identical role + value attributes to compound path', () => {
    const { container: arrayContainer } = render(
      <SegmentedTabs items={items} defaultValue="a" />,
    );
    const { container: compoundContainer } = render(
      <SegmentedTabs defaultValue="a">
        <SegmentedTabs.List>
          {items.map((i) => (
            <SegmentedTabs.Trigger key={i.value} value={i.value}>
              {i.label}
            </SegmentedTabs.Trigger>
          ))}
        </SegmentedTabs.List>
      </SegmentedTabs>,
    );

    const arrayTabs = arrayContainer.querySelectorAll('[role="tab"]');
    const compoundTabs = compoundContainer.querySelectorAll('[role="tab"]');

    expect(arrayTabs.length).toBe(compoundTabs.length);
    expect(arrayTabs.length).toBe(items.length);

    for (let i = 0; i < arrayTabs.length; i++) {
      // Compare textContent (Radix doesn't expose `value` as a DOM attribute,
      // but uses internal data-* identifiers; visible label is the canonical
      // surface).
      expect(arrayTabs[i].textContent).toBe(compoundTabs[i].textContent);
      expect(arrayTabs[i].getAttribute('role')).toBe(compoundTabs[i].getAttribute('role'));
      expect(arrayTabs[i].getAttribute('data-state')).toBe(
        compoundTabs[i].getAttribute('data-state'),
      );
    }
  });
});
