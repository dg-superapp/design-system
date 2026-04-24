import { clsx } from "clsx";
import { Swatch, type SwatchProps } from "./Swatch";

export type TokenTableProps = {
  /** Heading rendered above the grid (also sets the anchor id). */
  title: string;
  /** Optional descriptive subtitle / source note. */
  caption?: string;
  /** Array of swatch defs; one tile each. */
  tokens: SwatchProps[];
  /** Grid columns. Defaults to responsive 2/3/4/6 pattern. */
  columnsClassName?: string;
  /** Extra wrapper className. */
  className?: string;
};

/**
 * Grid of token swatches. Used by `/` (Task 5) and reused by the MDX docs
 * page under `/docs/foundations/tokens` (Task 6) — all swatch rendering
 * should route through this component so a single styling change propagates.
 */
export function TokenTable({
  title,
  caption,
  tokens,
  columnsClassName,
  className,
}: TokenTableProps) {
  const anchor = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return (
    <section className={clsx("flex flex-col gap-3", className)} id={anchor}>
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {caption ? (
          <p className="text-sm text-muted-foreground">{caption}</p>
        ) : null}
      </header>
      <div
        className={clsx(
          "grid gap-4",
          columnsClassName ??
            "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
        )}
      >
        {tokens.map((t) => (
          <Swatch key={t.token} {...t} />
        ))}
      </div>
    </section>
  );
}
