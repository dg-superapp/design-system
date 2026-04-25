'use client';

/**
 * MiniAppHome — Phase 4 Plan 4-08 (R5.1, R5.2, R5.3, R5.6, R10.1, R10.2, R10.3)
 *
 * **Phase 4 EXIT-GATE composition.** Composes the full MiniApp home screen:
 * AppHeader + HeroBanner + SectionHeader (×2) + NavRow list + 6-tile placeholder
 * grid, all wired together as a single block.
 *
 * Design decisions honored:
 *   D-09 — registryDependencies cascade installs dgc-theme + app-header +
 *          hero-banner + section-header + nav-row at consumer-side
 *   D-15 — presentational only; consumer wraps tiles + nav-rows for routing
 *   D-17 — <HomeTile> is INLINE in this file (NOT a separate registry item).
 *          Phase 6 swaps this for the real <ServiceTile> via consumer codemod
 *          or manual swap path.
 *
 * Imports use `@/components/ui/<name>` (consumer-style) — that's the path that
 * exists in a consumer's repo after shadcn install. In THIS repo, the matching
 * shim files at src/components/ui/ re-export from registry source.
 */

import * as React from 'react';
import {
  Bell,
  FileText,
  IdCard,
  Menu,
  Receipt,
  ScanLine,
  Stethoscope,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppHeader } from '@/components/ui/app-header';
import { HeroBanner } from '@/components/ui/hero-banner';
import { SectionHeader } from '@/components/ui/section-header';
import { NavRow } from '@/components/ui/nav-row';

type TileVariant = 'blue' | 'magenta' | 'green' | 'amber' | 'purple' | 'red';

const TILE_GRADIENTS: Record<TileVariant, string> = {
  blue: 'linear-gradient(135deg, hsl(216 85% 34%) 0%, hsl(213 92% 65%) 100%)',
  magenta: 'linear-gradient(135deg, hsl(330 65% 38%) 0%, hsl(330 80% 60%) 100%)',
  green: 'linear-gradient(135deg, hsl(154 60% 30%) 0%, hsl(154 65% 50%) 100%)',
  amber: 'linear-gradient(135deg, hsl(35 80% 38%) 0%, hsl(35 90% 60%) 100%)',
  purple: 'linear-gradient(135deg, hsl(265 50% 35%) 0%, hsl(265 65% 60%) 100%)',
  red: 'linear-gradient(135deg, hsl(0 66% 38%) 0%, hsl(0 75% 58%) 100%)',
};

interface HomeTileProps {
  label: string;
  variant: TileVariant;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

// D-17 — INLINE placeholder. NOT exported. Phase 6 swap target.
function HomeTile({ label, variant, icon, ariaLabel }: HomeTileProps) {
  return (
    <button
      type="button"
      role="listitem"
      aria-label={ariaLabel ?? label}
      className={cn(
        'flex flex-col items-center justify-end gap-[var(--space-2)]',
        'rounded-[var(--radius-md)] p-[var(--space-3)]',
        'min-h-[88px] text-center text-xs font-medium leading-tight text-white',
        'shadow-[var(--shadow-1)] transition-transform duration-[var(--dur-fast)]',
        'hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus-visible:[box-shadow:var(--shadow-focus)]',
      )}
      style={{ backgroundImage: TILE_GRADIENTS[variant] }}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center [&>svg]:h-[28px] [&>svg]:w-[28px]"
        >
          {icon}
        </span>
      )}
      <span className="block w-full truncate">{label}</span>
    </button>
  );
}

const TILES: ReadonlyArray<{
  label: string;
  variant: TileVariant;
  icon: React.ReactNode;
  ariaLabel: string;
}> = [
  { label: 'អត្តសញ្ញាណប័ណ្ណ', variant: 'blue', icon: <IdCard />, ariaLabel: 'National ID / អត្តសញ្ញាណប័ណ្ណ' },
  { label: 'ពន្ធដារ', variant: 'magenta', icon: <Receipt />, ariaLabel: 'Tax / ពន្ធដារ' },
  { label: 'សុខភាព', variant: 'green', icon: <Stethoscope />, ariaLabel: 'Health / សុខភាព' },
  { label: 'អាជ្ញាប័ណ្ណ', variant: 'amber', icon: <FileText />, ariaLabel: 'Licenses / អាជ្ញាប័ណ្ណ' },
  { label: 'សហគមន៍', variant: 'purple', icon: <Users />, ariaLabel: 'Community / សហគមន៍' },
  { label: 'ស្កេន', variant: 'red', icon: <ScanLine />, ariaLabel: 'Scan / ស្កេន' },
];

const SLIDES: ReadonlyArray<{ title: string; body?: string }> = [
  { title: 'សេវាសាធារណៈនៅក្នុងហោប៉ៅរបស់អ្នក', body: 'DGC services in your pocket' },
  { title: 'ផ្ទៀងផ្ទាត់ភ្លាមៗ', body: 'Verify in seconds' },
  { title: 'សុវត្ថិភាពតាមស្តង់ដារ', body: 'Government-grade security' },
];

export interface MiniAppHomeProps {
  userName?: string;
  className?: string;
}

export function MiniAppHome({ userName = 'សុផាត', className }: MiniAppHomeProps) {
  // Consumer-side state for HeroBanner activeIndex (RESEARCH Pattern 6 — proves D-10).
  const [hbIndex, setHbIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setHbIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div lang="km" className={cn('min-h-screen bg-background', className)}>
      <AppHeader
        title={`ជំរាបសួរ ${userName}`}
        ariaLabel="MiniApp home / ទំព័រដើមរបស់ MiniApp"
        leading={
          <AppHeader.IconButton ariaLabel="Open menu / បើកម៉ឺនុយ">
            <Menu />
          </AppHeader.IconButton>
        }
        trailing={
          <AppHeader.IconButton ariaLabel="Notifications / ការជូនដំណឹង" badge="dot">
            <Bell />
          </AppHeader.IconButton>
        }
      />

      <main className="flex flex-col gap-[var(--space-7)] px-[var(--space-6)] py-[var(--space-7)]">
        <HeroBanner
          activeIndex={hbIndex}
          onIndexChange={setHbIndex}
          ariaLabel="Promotional / ការផ្សព្វផ្សាយ"
        >
          {SLIDES.map((s, i) => (
            <HeroBanner.Slide key={i} index={i + 1}>
              <div className="flex flex-col gap-[var(--space-2)]">
                <h2 className="text-xl font-semibold">{s.title}</h2>
                {s.body && <p className="text-sm font-normal opacity-90">{s.body}</p>}
              </div>
            </HeroBanner.Slide>
          ))}
        </HeroBanner>

        <div className="flex flex-col gap-[var(--space-3)]">
          <SectionHeader
            title="សេវា"
            action={{
              label: 'មើលទាំងអស់',
              href: '#',
              ariaLabel: 'View all services / មើលសេវាទាំងអស់',
            }}
          />
          <div role="list" className="grid grid-cols-3 gap-[var(--space-3)]">
            {TILES.map((t, i) => (
              <HomeTile
                key={i}
                label={t.label}
                variant={t.variant}
                icon={t.icon}
                ariaLabel={t.ariaLabel}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-3)]">
          <SectionHeader
            title="បានមើលថ្មីៗ"
            action={{
              label: 'មើលទាំងអស់',
              href: '#',
              ariaLabel: 'Recently viewed / បានមើលថ្មីៗ',
            }}
          />
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
            <NavRow
              leadingIcon={<IdCard />}
              label="ការបន្តអាជ្ញាប័ណ្ណ"
              caption="ដាក់ស្នើពេលថ្ងៃនេះ"
              trailing="chevron"
            />
            <NavRow
              leadingIcon={<Receipt />}
              label="ការបង់ពន្ធ"
              caption="វិក្កយបត្រ #4521"
              trailing="chevron"
            />
            <NavRow
              leadingIcon={<Stethoscope />}
              label="ការណាត់ជួបពេទ្យ"
              caption="ច័ន្ទ ៩ តុលា"
              trailing="chevron"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
