'use client';

import { Bell } from 'lucide-react';
import { NavRow } from '../../../../../registry/nav-row/nav-row';
import { Switch } from '../../../../../registry/switch/switch';
import type { PreviewRenderer } from './index';

/**
 * NavRow preview renderer — Phase 4 Plan 4-03.
 *
 * Knobs (defined in 04-09 manifest entry): trailing (variant), active (boolean),
 * withCaption (boolean), withLeadingIcon (boolean).
 */
export const NavRowPreview: PreviewRenderer = ({ state }) => {
  const trailingVariant = (state.trailing as string) ?? 'chevron';
  const active = Boolean(state.active);
  const withCaption = state.withCaption === undefined ? true : Boolean(state.withCaption);
  const withLeadingIcon =
    state.withLeadingIcon === undefined ? true : Boolean(state.withLeadingIcon);

  let trailing: 'chevron' | 'count' | 'none' | React.ReactNode;
  if (trailingVariant === 'count') trailing = 'count';
  else if (trailingVariant === 'switch') trailing = <Switch />;
  else if (trailingVariant === 'none') trailing = 'none';
  else trailing = 'chevron';

  return (
    <div className="mx-auto w-full max-w-[412px] bg-card" lang="km">
      <NavRow
        leadingIcon={withLeadingIcon ? <Bell /> : undefined}
        label="ការជូនដំណឹង"
        caption={withCaption ? 'Push, អ៊ីមែល, SMS' : undefined}
        active={active}
        trailing={trailing}
        trailingCount={trailingVariant === 'count' ? 3 : undefined}
      />
    </div>
  );
};
