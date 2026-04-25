'use client';

import { MiniAppHome } from '../../../../../registry/miniapp-home/miniapp-home';
import type { PreviewRenderer } from './index';

/**
 * MiniAppHome preview renderer — Phase 4 Plan 4-08.
 *
 * Block ships fixed dogfood layout (D-17 + RESEARCH Pattern 7). No knobs —
 * manifest declares `controls: [] as const` and PlaygroundShell handles the
 * empty-controls case (line ~111 of PlaygroundShell.tsx).
 */
export const MiniAppHomePreview: PreviewRenderer = () => {
  return (
    <div className="mx-auto w-full max-w-[412px]" lang="km">
      <MiniAppHome />
    </div>
  );
};
