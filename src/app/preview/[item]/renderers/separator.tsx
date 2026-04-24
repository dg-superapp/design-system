'use client';

import { Separator } from '../../../../../registry/separator/separator';
import type { PreviewRenderer } from './index';

/**
 * Separator preview renderer — Phase 3 Plan 3-13, R4.13.
 *
 * Demonstrates both orientations so visual-diff / e2e specs can assert
 * 1px sizing, hsl(var(--border)) fill, and ARIA disposition in a single
 * pass.
 *
 * Horizontal: stacked text blocks split by a full-width 1px rule.
 * Vertical: inline text pair split by a 1px-wide, full-height rule.
 * `decorative` toggles role=none ↔ role=separator (Radix semantics).
 */
export const SeparatorPreview: PreviewRenderer = ({ state }) => {
  const orientation =
    state.orientation === 'vertical' ? 'vertical' : 'horizontal';
  const decorative = state.decorative === false ? false : true;

  if (orientation === 'vertical') {
    return (
      <div
        data-testid="separator-demo"
        className="flex h-[64px] max-w-sm items-center gap-[var(--space-4,1rem)]"
      >
        <span className="text-sm text-[hsl(var(--foreground))]">
          ផ្នែកទី១
        </span>
        <Separator
          data-testid="separator-under-test"
          orientation="vertical"
          decorative={decorative}
        />
        <span className="text-sm text-[hsl(var(--foreground))]">
          ផ្នែកទី២
        </span>
      </div>
    );
  }

  return (
    <div
      data-testid="separator-demo"
      className="flex max-w-sm flex-col gap-[var(--space-3,0.75rem)]"
    >
      <p className="text-sm text-[hsl(var(--foreground))]">
        ផ្នែកខាងលើ
      </p>
      <Separator
        data-testid="separator-under-test"
        orientation="horizontal"
        decorative={decorative}
      />
      <p className="text-sm text-[hsl(var(--foreground))]">
        ផ្នែកខាងក្រោម
      </p>
    </div>
  );
};
