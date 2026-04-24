import * as React from "react";

export interface HelloProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Greeting target. Defaults to `"world"`. */
  name?: string;
}

/**
 * Phase 2 — migrated to DGC theme tokens (R3.5, D1).
 *
 * Styling is expressed entirely in `dgc-theme` utilities — no hardcoded
 * colors. A consumer who runs `npx shadcn@latest add dgc-theme` gets the
 * brand palette automatically because `registry-item.json` lists
 * `registryDependencies: ["dgc-theme"]`.
 *
 * Utilities applied:
 *  - `bg-brand text-brand-foreground` — DGC Cambodia blue CTA + on-brand text
 *  - `hover:bg-brand-hover active:bg-brand-press` — interactive states
 *  - `focus-visible:ring-ring` — focus outline via semantic ring token
 *  - `rounded-[var(--radius)]` — shadcn v4 radius anchor (0.75rem)
 *  - `h-11 px-4 font-medium` — WCAG touch target + type weight
 */
export function Hello({
  name = "world",
  className,
  ...props
}: HelloProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        "bg-brand text-brand-foreground",
        "hover:bg-brand-hover active:bg-brand-press",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "rounded-[var(--radius)] px-4 h-11 font-medium",
        "transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      hello, {name} — dgc miniapp registry is live.
    </button>
  );
}
