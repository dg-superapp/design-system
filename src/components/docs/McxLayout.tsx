'use client';

import { useCallback, useState } from 'react';
import { REGISTRY_BASE } from '../../../registry/items.manifest';

/**
 * McxLayout — shared MDX layout for `/docs/components/<item>/page.mdx`
 * (Phase 3 R9.1, R9.4).
 *
 * Wraps MDX children with a simple docs frame (header + content well +
 * optional ToC placeholder). Each primitive docs page opts in by
 * importing McxLayout and wrapping its content:
 *
 *   import { McxLayout, InstallCommand } from "@/components/docs/McxLayout";
 *   <McxLayout title="Button" slug="button">
 *     <InstallCommand name="button" />
 *     …rest of MDX…
 *   </McxLayout>
 *
 * InstallCommand (R9.4) emits the canonical shadcn install command and
 * provides a copy-to-clipboard button using `navigator.clipboard`.
 */

export type McxLayoutProps = {
  title: string;
  slug: string;
  children: React.ReactNode;
  description?: string;
};

export function McxLayout({ title, slug, children, description }: McxLayoutProps) {
  return (
    <article
      data-mcx-layout
      data-mcx-slug={slug}
      className="mcx-layout mx-auto max-w-3xl space-y-6 px-6 py-8"
    >
      <header className="space-y-2 border-b border-border pb-4">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </header>
      <div className="mcx-content prose prose-neutral max-w-none dark:prose-invert">{children}</div>
    </article>
  );
}

/**
 * InstallCommand — copy-ready `npx shadcn@latest add …` block.
 *
 * Uses `navigator.clipboard.writeText` (R9.4). Falls back silently when
 * the Clipboard API is unavailable (Safari http://, older browsers) —
 * users can still select + Cmd/Ctrl+C. The button tracks its own
 * "copied" state for 1.8s so users get unambiguous feedback.
 */
export function InstallCommand({ name }: { name: string }) {
  const command = `npx shadcn@latest add ${REGISTRY_BASE}/r/${name}.json`;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable; user can still select manually.
    }
  }, [command]);

  return (
    <div
      data-testid="install-command"
      className="install-command flex items-center gap-2 rounded-md border border-border bg-muted p-3 font-mono text-sm"
    >
      <code className="flex-1 overflow-x-auto whitespace-nowrap">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Command copied' : 'Copy install command'}
        className="rounded-sm border border-border bg-background px-2 py-1 text-xs font-medium hover:bg-accent"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
