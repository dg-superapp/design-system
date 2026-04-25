'use client';

import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { AppHeader } from '../../../../../registry/app-header/app-header';
import type { PreviewRenderer } from './index';

/**
 * AppHeader preview renderer — Phase 4 Plan 4-01.
 *
 * Statically imported by previewRenderers (wired in 04-09 atomic finalize
 * per ISSUE-01 fix). Knobs map to manifest controls: title (text),
 * leadingIcon (variant), trailingCount (number), withBadge (boolean).
 */
export const AppHeaderPreview: PreviewRenderer = ({ state }) => {
  const title =
    typeof state.title === 'string' && state.title.length > 0
      ? state.title
      : 'ដាក់ពាក្យទិដ្ឋាការ';
  const leadingIcon =
    (state.leadingIcon as 'menu' | 'back' | 'none' | undefined) ?? 'menu';
  const trailingCount = Math.max(0, Math.min(9, Number(state.trailingCount ?? 0)));
  const withBadge = Boolean(state.withBadge);

  const LeadingIcon = leadingIcon === 'back' ? ArrowLeft : Menu;
  const leading =
    leadingIcon === 'none' ? null : (
      <AppHeader.IconButton
        ariaLabel={leadingIcon === 'back' ? 'Back / ត្រឡប់' : 'Open menu / បើកម៉ឺនុយ'}
      >
        <LeadingIcon />
      </AppHeader.IconButton>
    );

  const trailing = withBadge ? (
    <>
      <AppHeader.IconButton
        ariaLabel="Notifications / ការជូនដំណឹង"
        badge={trailingCount > 0 ? trailingCount : 'dot'}
      >
        <Bell />
      </AppHeader.IconButton>
      <AppHeader.IconButton ariaLabel="More / បន្ថែម">
        <Menu />
      </AppHeader.IconButton>
    </>
  ) : (
    <AppHeader.IconButton
      ariaLabel="Notifications / ការជូនដំណឹង"
      badge={trailingCount > 0 ? trailingCount : undefined}
    >
      <Bell />
    </AppHeader.IconButton>
  );

  return (
    <div className="mx-auto w-full max-w-[412px]" lang="km">
      <AppHeader
        title={title}
        leading={leading}
        trailing={trailing}
        ariaLabel="Page header / ក្បាលទំព័រ"
      />
    </div>
  );
};
