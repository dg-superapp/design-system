"use client";

/**
 * AppHeader — Phase 4 Plan 4-01 (R5.1, R10.1, R10.3)
 *
 * 56px navy-gradient nav bar with 3-slot CSS grid (56px 1fr auto).
 * 44px icon-button hit targets, 22px white glyphs, dot/count badges
 * with 2px navy border, focus-visible white ring (--ring-on-navy).
 *
 * Design decisions honored:
 *   D-03 — single file, dot-namespace exports (AppHeader.Title, .Leading, .Trailing, .IconButton)
 *   D-06 — hybrid composition: top-level props + child slots (children escape hatch)
 *   D-07 — right column uses `auto` keyword — no trailingWidth prop
 *   D-14 — no dark: utilities (nav gradient is always navy)
 *   D-15 — no usePathname() coupling
 *
 * Pitfalls closed:
 *   Pitfall 3  — min-h not h (Khmer descenders at line-height 1.6)
 *   Pitfall 9  — data-app-header-icon + --ring-on-navy focus-visible override
 *   Pitfall 1  — navy border on count badge via className composition (not variant override)
 *   Pitfall 10 — dgc-theme first in registryDependencies cascade (registry-item.json)
 */

import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ─── Public props ──────────────────────────────────────────────────────────

export interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Page title rendered in the center column (80% path — D-06). */
  title?: string;
  /** Single icon-button in the left column. Defaults to Lucide Menu. */
  leading?: React.ReactNode;
  /** 1 or 2 icon-buttons in the right column; auto-sized via CSS grid auto (D-07). */
  trailing?: React.ReactNode;
  /** Outer <header> aria-label. Bilingual default supplied by consumers. */
  ariaLabel?: string;
  /** Title heading level. Defaults to h1. */
  as?: "h1" | "h2";
}

export interface AppHeaderIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible label (R10.1). Bilingual recommended. */
  ariaLabel: string;
  /** Unread indicator: "dot" = 8px circle; number = Phase 3 Badge with count. */
  badge?: "dot" | number;
}

// ─── Internal primitives ───────────────────────────────────────────────────

/**
 * AppHeaderIconButton — internal icon-button primitive.
 * NOT exported as public API surface; exposed via dot-namespace only.
 *
 * Applies `data-app-header-icon` for the focus-visible CSS hook (Pitfall 9).
 * Height + width locked to --app-header-icon (44px) for R5.1 compliance.
 */
function AppHeaderIconButton({
  ariaLabel,
  badge,
  className,
  children,
  ...rest
}: AppHeaderIconButtonProps) {
  return (
    <button
      type="button"
      data-app-header-icon
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center justify-center",
        "h-[var(--app-header-icon)] w-[var(--app-header-icon)]",
        "rounded-[var(--radius-sm)] bg-transparent text-white",
        "hover:bg-white/10 transition-colors duration-[var(--dur-fast)]",
        // Pitfall 9 — white ring on navy gradient (default --shadow-focus is invisible)
        "focus:outline-none focus-visible:[box-shadow:var(--ring-on-navy)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        className,
      )}
      {...rest}
    >
      {/* Glyph locked to --app-header-glyph (22px) */}
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center [&>svg]:h-[var(--app-header-glyph)] [&>svg]:w-[var(--app-header-glyph)]"
      >
        {children}
      </span>

      {/* Dot badge — unread indicator, no count */}
      {badge === "dot" && (
        <span
          aria-hidden="true"
          className="absolute top-[6px] right-[6px] h-[8px] w-[8px] rounded-full bg-[hsl(var(--red-600))] ring-2 ring-[hsl(var(--blue-900))]"
        />
      )}

      {/* Count badge — Phase 3 Badge component; navy border per UI-SPEC §Color rule 7 */}
      {typeof badge === "number" && badge > 0 && (
        <span
          aria-live="polite"
          aria-atomic="true"
          aria-label={`${badge} unread / ${badge} មិនបានអាន`}
          className="absolute top-[2px] right-[2px]"
        >
          <Badge
            className={cn(
              "h-[18px] min-w-[18px] px-[4px] py-0 text-[10px] font-medium leading-none",
              // Pitfall 1 — compose over Badge defaults; red fill + navy border
              "bg-[hsl(var(--red-700))] text-white border-2 border-[hsl(var(--blue-900))]",
            )}
          >
            {badge}
          </Badge>
        </span>
      )}
    </button>
  );
}

// ─── Dot-namespace slot wrappers (D-03 + D-06) ────────────────────────────

function AppHeaderTitle({
  children,
  as = "h1",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2";
}) {
  const TitleEl = as;
  return (
    <TitleEl
      data-testid="app-header-title"
      className="truncate px-[var(--space-2)] text-base font-semibold"
    >
      {children}
    </TitleEl>
  );
}

function AppHeaderLeading({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center">{children}</div>;
}

function AppHeaderTrailing({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-[var(--space-2)] pr-[var(--space-2)]">
      {children}
    </div>
  );
}

// ─── Root component ────────────────────────────────────────────────────────

function AppHeaderRoot({
  title,
  leading,
  trailing,
  ariaLabel,
  as = "h1",
  className,
  children,
  ...rest
}: AppHeaderProps) {
  // Children escape hatch — when children present, slots are ignored (D-06)
  if (children) {
    return (
      <header
        role="banner"
        aria-label={ariaLabel}
        className={cn(
          "app-header relative",
          "min-h-[var(--app-header-h)]",
          "grid grid-cols-[var(--app-header-icon)_1fr_auto] items-center",
          "bg-[image:var(--gradient-hero)] text-white",
          className,
        )}
        {...rest}
      >
        {children}
      </header>
    );
  }

  // Slots path — 80% case (D-06)
  const TitleEl = as;

  return (
    <header
      role="banner"
      aria-label={ariaLabel}
      className={cn(
        "app-header relative",
        // Pitfall 3 — min-h not h; Khmer line-height 1.6 needs bar to grow
        "min-h-[var(--app-header-h)]",
        // D-07 — intrinsic right column via auto keyword
        "grid grid-cols-[var(--app-header-icon)_1fr_auto] items-center",
        "bg-[image:var(--gradient-hero)] text-white",
        className,
      )}
      {...rest}
    >
      {/* Left column — leading icon (default: Menu) */}
      <div className="flex items-center justify-center">
        {leading ?? (
          <AppHeaderIconButton ariaLabel="Open menu / បើកម៉ឺនុយ">
            <Menu size={22} />
          </AppHeaderIconButton>
        )}
      </div>

      {/* Center column — title */}
      {title ? (
        <TitleEl
          data-testid="app-header-title"
          className="truncate px-[var(--space-2)] text-base font-semibold"
        >
          {title}
        </TitleEl>
      ) : (
        <span aria-hidden="true" />
      )}

      {/* Right column — trailing icons (auto-sized by CSS grid auto — D-07) */}
      <div className="flex items-center justify-end gap-[var(--space-2)] pr-[var(--space-2)]">
        {trailing}
      </div>
    </header>
  );
}

// ─── Dot-namespace export (D-03) ──────────────────────────────────────────

export const AppHeader = Object.assign(AppHeaderRoot, {
  Title: AppHeaderTitle,
  Leading: AppHeaderLeading,
  Trailing: AppHeaderTrailing,
  IconButton: AppHeaderIconButton,
});
