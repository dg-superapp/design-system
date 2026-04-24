'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../../registry/tabs/tabs';
import type { PreviewRenderer } from './index';

/**
 * Tabs preview — Phase 3 Plan 3-12.
 *
 * Three-tab Khmer demo ("ព័ត៌មាន", "ឯកសារ", "កំណត់") in either variant.
 * Count badges are rendered inline when `withBadges=true` using
 * --font-latin on numerals (UI-SPEC §2.12: numerals always Latin).
 */

type Variant = 'underline' | 'pill';

function isVariant(v: unknown): v is Variant {
  return v === 'underline' || v === 'pill';
}

function Badge({
  count,
  active,
}: {
  count: number;
  active: boolean;
}): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={[
        'ml-[6px] inline-flex h-[18px] min-w-[20px] items-center justify-center',
        'rounded-[var(--radius-pill)] px-[6px] text-[10px] font-semibold',
        'font-[var(--font-latin)]',
        active
          ? 'bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))]'
          : 'bg-[hsl(var(--blue-050))] text-[hsl(var(--brand))]',
      ].join(' ')}
    >
      {count}
    </span>
  );
}

export const TabsPreview: PreviewRenderer = ({ state }) => {
  const variant: Variant = isVariant(state.variant) ? state.variant : 'underline';
  const withBadges = state.withBadges === true;

  const tabs: ReadonlyArray<{ value: string; label: string; count: number }> = [
    { value: 'news', label: 'ព័ត៌មាន', count: 12 },
    { value: 'docs', label: 'ឯកសារ', count: 3 },
    { value: 'settings', label: 'កំណត់', count: 0 },
  ];

  return (
    <div className="w-full max-w-[480px]">
      <Tabs defaultValue="news">
        <TabsList variant={variant}>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} variant={variant} value={t.value}>
              <span
                className="truncate"
                style={{ fontFamily: 'var(--font-khmer)' }}
              >
                {t.label}
              </span>
              {withBadges ? (
                <Badge count={t.count} active={false} />
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            <p
              className="text-sm text-[hsl(var(--foreground))]"
              style={{ fontFamily: 'var(--font-khmer)' }}
            >
              មាតិកាសម្រាប់ «{t.label}»។
            </p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
