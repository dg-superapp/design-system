import { clsx } from "clsx";

export type SwatchProps = {
  /** Bare token name (without `--` prefix) e.g. `"blue-900"`, `"success-bg"`. */
  token: string;
  /** HSL triplet e.g. `"216 85% 34%"`. Rendered as meta. */
  hslTriplet?: string;
  /** Optional hex source from RESEARCH mapping e.g. `"#0D47A1"`. */
  hex?: string;
  /** Optional shadcn alias note e.g. `"primary"`, `"brand"`. */
  shadcnAlias?: string;
  /** Label override (defaults to token name). */
  label?: string;
  /** Extra className for the tile. */
  className?: string;
  /**
   * If token has special handling (e.g. bare `white` without an hsl()),
   * consumer can override background inline. Leave undefined to use
   * `hsl(var(--token))` derived from `token`.
   */
  backgroundOverride?: string;
  /** Force foreground text color for readability atop the swatch. */
  textClassName?: string;
};

/**
 * Renders a single color swatch tile for the token reference page.
 *
 * Design decisions:
 *  - `data-token={token}` attribute is stable — used by Task 8 visual-diff
 *    script to locate rendered swatches and compare computed styles.
 *    Example rendered output: `<figure data-token="blue-900">…</figure>`.
 *  - Background is derived as `hsl(var(--${token}))` so HSL drift in globals.css
 *    shows up as a visual regression immediately.
 *  - Label block below the tile carries token name, optional HSL triplet and
 *    hex source note, and optional shadcn alias chip.
 */
export function Swatch({
  token,
  hslTriplet,
  hex,
  shadcnAlias,
  label,
  className,
  backgroundOverride,
  textClassName,
}: SwatchProps) {
  const background = backgroundOverride ?? `hsl(var(--${token}))`;
  return (
    <figure
      data-token={token}
      className={clsx(
        "flex flex-col gap-2 text-xs",
        "min-w-0", // keeps grid cells from overflowing with long labels
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={clsx(
          "h-20 w-full rounded-md border border-border/60 shadow-[var(--shadow-1)]",
          textClassName,
        )}
        style={{ background }}
      />
      <figcaption className="flex flex-col gap-0.5">
        <span className="font-mono text-[11px] font-medium text-foreground">
          --{label ?? token}
        </span>
        {hslTriplet ? (
          <span className="font-mono text-[10px] text-muted-foreground">
            {hslTriplet}
          </span>
        ) : null}
        {hex ? (
          <span className="font-mono text-[10px] text-muted-foreground">
            {hex}
          </span>
        ) : null}
        {shadcnAlias ? (
          <span className="mt-0.5 inline-flex w-fit items-center rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            alias: {shadcnAlias}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
