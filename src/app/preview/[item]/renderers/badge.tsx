'use client';

import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Badge } from '../../../../../registry/badge/badge';
import type { PreviewRenderer } from './index';

/**
 * Badge preview renderer — Phase 3 Plan 3-10, R4.10.
 *
 * Renders a 4-tone gallery so visual acceptance (UI-SPEC §2.10) can assert
 * distinct bg/fg pairings in one pass. The playground controls select an
 * active tone + label + icon toggle; the gallery below always renders all
 * four so Playwright can compare computed background colors simultaneously.
 *
 * Icon mapping mirrors semantic-tone convention:
 *   default → Info, success → CheckCircle2, warning → AlertTriangle,
 *   danger → AlertCircle. All 12px, inherit currentColor from token pair.
 */

type Tone = 'default' | 'success' | 'warning' | 'danger';

const TONES: readonly Tone[] = ['default', 'success', 'warning', 'danger'] as const;

const ICONS: Record<Tone, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

function isTone(v: unknown): v is Tone {
  return typeof v === 'string' && (TONES as readonly string[]).includes(v);
}

export const BadgePreview: PreviewRenderer = ({ state }) => {
  const tone: Tone = isTone(state.tone) ? state.tone : 'default';
  const withIcon = Boolean(state.withIcon);
  const label =
    typeof state.label === 'string' && state.label.length > 0
      ? state.label
      : 'ព័ត៌មាន';

  return (
    <div className="flex flex-col gap-[var(--space-4,1rem)]">
      {/* Active tone (controlled by playground) */}
      <div data-testid="badge-active" className="flex items-center gap-2">
        <Badge tone={tone}>
          {withIcon
            ? (() => {
                const Icon = ICONS[tone];
                return <Icon size={12} aria-hidden />;
              })()
            : null}
          {label}
        </Badge>
      </div>

      {/* 4-tone gallery — always rendered for visual-acceptance assertions */}
      <div
        data-testid="badge-gallery"
        className="flex flex-wrap items-center gap-[var(--space-2,0.5rem)]"
      >
        {TONES.map((t) => {
          const Icon = ICONS[t];
          return (
            <Badge key={t} tone={t} data-tone={t}>
              {withIcon ? <Icon size={12} aria-hidden /> : null}
              {t}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
