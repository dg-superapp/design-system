'use client';

import { SegmentedTabs } from '../../../../../registry/segmented-tabs/segmented-tabs';
import type { PreviewRenderer } from './index';

const FIXTURE = [
  { value: 'active', label: 'សកម្ម' },
  { value: 'pending', label: 'កំពុងរង់ចាំ' },
  { value: 'done', label: 'បានបញ្ចប់' },
  { value: 'all', label: 'ទាំងអស់' },
];

/**
 * SegmentedTabs preview renderer — Phase 4 Plan 4-04.
 *
 * Knobs (defined in 04-09 manifest entry): tabCount (variant 2/3/4),
 * defaultIndex (variant 0/1/2/3).
 */
export const SegmentedTabsPreview: PreviewRenderer = ({ state }) => {
  const tabCount = Math.max(2, Math.min(4, Number(state.tabCount ?? '3')));
  const defaultIndex = Math.min(tabCount - 1, Number(state.defaultIndex ?? '0'));
  const items = FIXTURE.slice(0, tabCount);
  const defaultValue = items[defaultIndex]?.value ?? items[0].value;

  return (
    <div className="mx-auto w-full max-w-[412px] bg-card p-[var(--space-4)]" lang="km">
      <SegmentedTabs
        items={items}
        defaultValue={defaultValue}
        ariaLabel="Filter status / តម្រងស្ថានភាព"
      />
    </div>
  );
};
