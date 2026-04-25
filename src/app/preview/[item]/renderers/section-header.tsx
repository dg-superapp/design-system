'use client';

import { SectionHeader } from '../../../../../registry/section-header/section-header';
import type { PreviewRenderer } from './index';

/**
 * SectionHeader preview renderer — Phase 4 Plan 4-02.
 *
 * Knobs (defined in 04-09 manifest entry): title (text), withAction (boolean),
 * actionLabel (text). Default copy is bilingual Khmer per UI-SPEC §Copywriting.
 */
export const SectionHeaderPreview: PreviewRenderer = ({ state }) => {
  const title =
    typeof state.title === 'string' && state.title.length > 0
      ? state.title
      : 'សេវាថ្មីៗ';
  const withAction = state.withAction === undefined ? true : Boolean(state.withAction);
  const actionLabel =
    typeof state.actionLabel === 'string' && state.actionLabel.length > 0
      ? state.actionLabel
      : 'មើលទាំងអស់';

  return (
    <div className="mx-auto w-full max-w-[412px]" lang="km">
      <SectionHeader
        title={title}
        action={
          withAction
            ? { label: actionLabel, href: '#', ariaLabel: `${actionLabel} (preview)` }
            : undefined
        }
      />
    </div>
  );
};
