'use client';

import * as React from 'react';
import { HeroBanner } from '../../../../../registry/hero-banner/hero-banner';
import type { PreviewRenderer } from './index';

const SLIDES = [
  {
    title: 'សេវាសាធារណៈនៅក្នុងហោប៉ៅរបស់អ្នក',
    body: 'DGC services in your pocket',
    cta: 'ដាក់ពាក្យឥឡូវនេះ',
  },
  {
    title: 'ផ្ទៀងផ្ទាត់ភ្លាមៗ',
    body: 'Verify in seconds',
    cta: 'ស្វែងយល់បន្ថែម',
  },
  {
    title: 'សុវត្ថិភាពតាមស្តង់ដារ',
    body: 'Government-grade security',
    cta: 'ដាក់ពាក្យឥឡូវនេះ',
  },
];

/**
 * HeroBanner preview renderer — Phase 4 Plan 4-06.
 *
 * Demonstrates the consumer recipe (RESEARCH Pattern 6): registry source has
 * NO state; this renderer wires `useState` for activeIndex on the consumer
 * side. Knobs (defined in 04-09 manifest entry): slideCount (variant 1/2/3),
 * activeIndex (number), withCard (boolean).
 */
export const HeroBannerPreview: PreviewRenderer = ({ state }) => {
  const slideCount = Math.max(1, Math.min(3, Number(state.slideCount ?? '3')));
  const initialIndex = Math.max(0, Math.min(slideCount - 1, Number(state.activeIndex ?? 0)));
  const withCard = Boolean(state.withCard);

  const [active, setActive] = React.useState(initialIndex);
  React.useEffect(() => {
    setActive(initialIndex);
  }, [initialIndex]);

  const slides = SLIDES.slice(0, slideCount);

  return (
    <div className="mx-auto w-full max-w-[412px] bg-card p-[var(--space-4)]" lang="km">
      <HeroBanner
        activeIndex={active}
        onIndexChange={setActive}
        ariaLabel="Promotional carousel / កាពិសេសផ្សព្វផ្សាយ"
      >
        {slides.map((s, i) => (
          <HeroBanner.Slide key={i} index={i + 1}>
            {withCard ? (
              <HeroBanner.Card>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <h2 className="text-xl font-semibold">{s.title}</h2>
                  <p className="text-sm">{s.body}</p>
                  <button
                    type="button"
                    className="mt-[var(--space-2)] inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-brand px-[var(--space-4)] py-[var(--space-2)] text-sm font-semibold text-brand-foreground"
                  >
                    {s.cta}
                  </button>
                </div>
              </HeroBanner.Card>
            ) : (
              <div className="flex flex-col gap-[var(--space-2)]">
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <p className="text-sm font-normal opacity-90">{s.body}</p>
                <button
                  type="button"
                  className="mt-[var(--space-3)] inline-flex items-center justify-center self-start rounded-[var(--radius-sm)] bg-white px-[var(--space-4)] py-[var(--space-2)] text-sm font-semibold text-foreground"
                >
                  {s.cta}
                </button>
              </div>
            )}
          </HeroBanner.Slide>
        ))}
      </HeroBanner>
    </div>
  );
};
