'use client';

import { ScrollArea } from '../../../../../registry/scroll-area/scroll-area';
import type { PreviewRenderer } from './index';

/**
 * ScrollArea preview renderer — Phase 3 Plan 3-14, R4.14.
 *
 * Renders a constrained-height scroll container filled with `rowCount`
 * sample rows (Khmer + Latin). Consumer-set height is the whole point
 * of the primitive per UI-SPEC §2.14 — playground `maxHeight` control
 * drives the inline style so e2e can assert the measured box.
 *
 * The container also exposes `aria-label` so axe's region-has-name rule
 * is satisfied (UI-SPEC §2.14 A11y).
 */
export const ScrollAreaPreview: PreviewRenderer = ({ state }) => {
  const maxHeight =
    typeof state.maxHeight === 'string' && state.maxHeight.length > 0
      ? state.maxHeight
      : '240px';
  const rawRowCount =
    typeof state.rowCount === 'number' ? state.rowCount : 30;
  const rowCount = Math.max(5, Math.min(100, Math.floor(rawRowCount)));

  const rows = Array.from({ length: rowCount }, (_, i) => i + 1);

  return (
    <div
      data-testid="scroll-area-demo"
      className="w-full max-w-sm"
      style={{ maxWidth: '20rem' }}
    >
      <ScrollArea
        data-testid="scroll-area-under-test"
        aria-label="បញ្ជីឧទាហរណ៍រមូរ"
        className="w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
        style={{ height: maxHeight }}
      >
        <ul
          data-testid="scroll-area-list"
          className="flex flex-col"
        >
          {rows.map((n) => (
            <li
              key={n}
              data-testid={`scroll-row-${n}`}
              className="flex items-center justify-between border-b border-[hsl(var(--border))] px-[var(--space-3,0.75rem)] py-[var(--space-2,0.5rem)] text-sm text-[hsl(var(--foreground))] last:border-b-0"
            >
              <span>ជួរទី {n}</span>
              <span className="text-[hsl(var(--muted-foreground))]">
                Row {n}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};
