'use client';

/**
 * HeroBanner — Phase 4 Plan 4-06 (R5.2, R10.1)
 *
 * Rounded navy-gradient hero with token-driven stipple overlay, optional inner
 * card, and a 3-dot carousel rail. Headless-controlled per D-10 — consumer
 * drives `activeIndex` + `onIndexChange`; no internal state, no auto-advance,
 * no swipe handlers.
 *
 * Design decisions honored:
 *   D-03 — single file, dot-namespace exports (.Slide, .Card)
 *   D-04 — inline stipple overlay div (D-12 token path; no SVG asset)
 *   D-06 — no dark: utilities (token-driven; --pattern-stipple has its own .dark value)
 *   D-10 — headless-controlled carousel: zero useState, zero useEffect
 *   D-11 — dual API: slides={[]} array path renders compound internally
 *   D-12 — stipple via bg-[image:var(--pattern-stipple)] bg-[length:12px_12px]
 *   D-13 — inner-card variant via <HeroBanner.Card> slot
 *
 * Pitfalls closed:
 *   Pitfall 5 — inner card is OPAQUE (`bg-card`); stipple does not bleed through
 *   Pitfall 6 — Pattern 6 + A8: inactive slides have inert + aria-hidden + tabIndex=-1
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

type SlideData = { title: string; body?: string; cta?: React.ReactNode };

export interface HeroBannerProps {
  activeIndex: number;
  onIndexChange: (i: number) => void;
  slides?: ReadonlyArray<SlideData>;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

const HeroBannerCtx = React.createContext<{ activeIndex: number; total: number } | null>(null);

function HeroBannerRoot({
  activeIndex,
  onIndexChange,
  slides,
  ariaLabel,
  children,
  className,
}: HeroBannerProps) {
  const slideNodes = slides
    ? slides.map((s, i) => (
        <HeroBannerSlide key={i} index={i + 1}>
          <div className="flex flex-col gap-[var(--space-2)]">
            <h2 className="text-xl font-semibold">{s.title}</h2>
            {s.body && <p className="text-sm font-normal opacity-90">{s.body}</p>}
            {s.cta && <div className="mt-[var(--space-3)]">{s.cta}</div>}
          </div>
        </HeroBannerSlide>
      ))
    : children;
  const total = slides?.length ?? React.Children.count(children);

  return (
    <HeroBannerCtx.Provider value={{ activeIndex, total }}>
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className={cn(
          'relative overflow-hidden rounded-[var(--radius-lg)]',
          'bg-[image:var(--gradient-hero)] text-white',
          'min-h-[176px] p-[var(--space-6)]',
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[image:var(--pattern-stipple)] bg-[length:12px_12px]"
        />
        <div
          className="relative flex transition-transform duration-[var(--dur-base)]"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slideNodes}
        </div>
        {total > 0 && (
          <HeroBannerDots total={total} active={activeIndex} onSelect={onIndexChange} />
        )}
      </section>
    </HeroBannerCtx.Provider>
  );
}

interface HeroBannerSlideProps {
  children: React.ReactNode;
  index?: number;
}

function HeroBannerSlide({ children, index }: HeroBannerSlideProps) {
  const ctx = React.useContext(HeroBannerCtx);
  const i0 = (index ?? 1) - 1;
  const isActive = ctx?.activeIndex === i0;
  const total = ctx?.total ?? 1;
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index ?? 1} of ${total}`}
      aria-hidden={!isActive}
      // @ts-expect-error — `inert` boolean attribute (React 19 supports natively; A6/A8)
      inert={!isActive ? '' : undefined}
      tabIndex={isActive ? 0 : -1}
      className="relative shrink-0 grow-0 basis-full"
    >
      {children}
    </div>
  );
}

function HeroBannerCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-card p-[var(--space-4)] text-card-foreground shadow-[var(--shadow-2)]">
      {children}
    </div>
  );
}

function HeroBannerDots({
  total,
  active,
  onSelect,
}: {
  total: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  const visibleStart = total <= 3 ? 0 : Math.max(0, Math.min(total - 3, active - 1));
  const visibleEnd = total <= 3 ? total : visibleStart + 3;

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-[var(--space-4)] left-1/2 flex -translate-x-1/2 gap-[var(--space-2)]"
    >
      {Array.from({ length: total }).map((_, i) => {
        const inWindow = i >= visibleStart && i < visibleEnd;
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            onClick={() => onSelect(i)}
            className={cn(
              'h-[8px] rounded-full transition-all duration-[var(--dur-base)]',
              !inWindow && 'hidden',
              isActive ? 'w-[18px] bg-white' : 'w-[8px] bg-white/40',
            )}
          />
        );
      })}
    </div>
  );
}

export const HeroBanner = Object.assign(HeroBannerRoot, {
  Slide: HeroBannerSlide,
  Card: HeroBannerCard,
});
