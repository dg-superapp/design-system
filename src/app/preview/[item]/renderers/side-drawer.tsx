'use client';

import * as React from 'react';
import {
  Bell,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { SideDrawer } from '../../../../../registry/side-drawer/side-drawer';
import { AppHeader } from '../../../../../registry/app-header/app-header';
import { NavRow } from '../../../../../registry/nav-row/nav-row';
import { ScrollArea } from '../../../../../registry/scroll-area/scroll-area';
import type { PreviewRenderer } from './index';

const NAV_ITEMS = [
  { Icon: Bell, label: 'ការជូនដំណឹង', caption: 'Push, អ៊ីមែល, SMS' },
  { Icon: FileText, label: 'ឯកសារខ្ញុំ', caption: undefined },
  { Icon: ShieldCheck, label: 'ឯកជនភាព', caption: undefined },
  { Icon: Settings, label: 'ការកំណត់', caption: undefined },
  { Icon: HelpCircle, label: 'ជំនួយ', caption: undefined },
  { Icon: User, label: 'គណនី', caption: undefined },
  { Icon: ShieldCheck, label: 'សុវត្ថិភាព', caption: undefined },
];

/**
 * SideDrawer preview renderer — Phase 4 Plan 4-07.
 *
 * Composes AppHeader (drawer header w/ X-close) + optional profile block +
 * ScrollArea wrapping NavRow list + optional Footer. Sign-out row uses
 * NavRow.tone="danger".
 *
 * Knobs (defined in 04-09 manifest entry):
 *   withProfile (boolean), navItemCount (variant 3/5/7),
 *   withFooter (boolean), defaultOpen (boolean default true)
 */
export const SideDrawerPreview: PreviewRenderer = ({ state }) => {
  const withProfile = state.withProfile === undefined ? true : Boolean(state.withProfile);
  const navItemCount = Math.max(3, Math.min(7, Number(state.navItemCount ?? '5')));
  const withFooter = state.withFooter === undefined ? true : Boolean(state.withFooter);
  const defaultOpen = state.defaultOpen === undefined ? true : Boolean(state.defaultOpen);

  const [open, setOpen] = React.useState(defaultOpen);
  React.useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const items = NAV_ITEMS.slice(0, navItemCount);

  return (
    <div
      className="relative mx-auto h-[640px] w-full max-w-[412px] overflow-hidden bg-card"
      lang="km"
    >
      <div className="p-[var(--space-4)]">
        <SideDrawer.Trigger asChild>
          <button
            type="button"
            className="rounded-[var(--radius-sm)] bg-brand px-[var(--space-4)] py-[var(--space-2)] text-sm font-semibold text-brand-foreground"
          >
            Open menu / បើកម៉ឺនុយ
          </button>
        </SideDrawer.Trigger>
      </div>

      <SideDrawer open={open} onOpenChange={setOpen} title="Menu / ម៉ឺនុយ">
        <SideDrawer.Header>
          <AppHeader
            title="ម៉ឺនុយ"
            ariaLabel="Drawer header / ក្បាលម៉ឺនុយ"
            leading={
              <SideDrawer.Close asChild>
                <AppHeader.IconButton ariaLabel="Close menu / បិទម៉ឺនុយ">
                  <X />
                </AppHeader.IconButton>
              </SideDrawer.Close>
            }
          />
        </SideDrawer.Header>

        {withProfile && (
          <div className="border-b border-border px-[var(--space-4)] py-[var(--space-5)]">
            <div className="text-base font-semibold">លី សុផាត</div>
            <div className="mt-[var(--space-1)] text-xs font-medium text-muted-foreground">
              អត្តសញ្ញាណប័ណ្ណខ្មែរ · 0123456
            </div>
          </div>
        )}

        <SideDrawer.Body>
          <ScrollArea className="h-full">
            <div role="list">
              {items.map((it, i) => {
                const { Icon } = it;
                return (
                  <NavRow
                    key={i}
                    leadingIcon={<Icon />}
                    label={it.label}
                    caption={it.caption}
                    trailing="chevron"
                  />
                );
              })}
              <NavRow
                leadingIcon={<LogOut />}
                label="ចេញ"
                tone="danger"
                trailing="none"
              />
            </div>
          </ScrollArea>
        </SideDrawer.Body>

        {withFooter && (
          <SideDrawer.Footer>
            <div className="text-xs">រាជរដ្ឋាភិបាលកម្ពុជា · v1.0.0</div>
          </SideDrawer.Footer>
        )}
      </SideDrawer>
    </div>
  );
};
