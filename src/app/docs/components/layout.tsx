import Link from 'next/link';
import type { ReactNode } from 'react';
import { items } from '../../../../registry/items.manifest';

/**
 * /docs/components layout — Phase 3 Plan 3-15 (R9.1).
 *
 * Wraps every `/docs/components/<item>/page.mdx` page with a left-rail
 * primitive index + a content well. The nav enumerates the 14
 * primitives from `registry/items.manifest.ts` so adding a new entry
 * there surfaces the docs link automatically.
 *
 * The top-level Foundations nav is rendered by the root docs layout
 * (Phase 2). This layout only owns the Components sub-section.
 */

export default function ComponentsDocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      data-docs-components-layout
      className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[220px_minmax(0,1fr)]"
    >
      <aside
        aria-label="Components navigation"
        className="hidden md:block md:sticky md:top-6 md:self-start"
      >
        <nav className="flex flex-col gap-1">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Components
          </p>
          {items.map((item) => (
            <Link
              key={item.name}
              href={`/docs/components/${item.docsSlug}/`}
              className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
              data-docs-nav-link={item.name}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
      <main data-docs-components-main className="min-w-0">
        {children}
      </main>
    </div>
  );
}
