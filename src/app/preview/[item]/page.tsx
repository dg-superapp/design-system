import { notFound } from 'next/navigation';
import { items } from '../../../../registry/items.manifest';
import { PlaygroundShell } from './PlaygroundShell';

/**
 * Dynamic playground route — Phase 3 Wave 0 (3-CONTEXT D-11).
 *
 * `generateStaticParams` is REQUIRED for `output: 'export'` in
 * next.config.ts. Plans 3-01..3-14 append entries to items.manifest.ts;
 * Wave 0 ships a `__placeholder` entry so Next.js 15.5.15 doesn't
 * refuse to prerender the route (it errors on an empty param list
 * under static export — deviation Rule 3). The placeholder hits
 * notFound() below, so it never renders real UI; it just keeps the
 * build happy until real items land.
 *
 * `dynamicParams = false` makes the enumerated list exhaustive: any
 * slug outside `items` returns a 404 page at build time (required
 * because static export can't 404 dynamically at runtime).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  const names = items.map((i) => ({ item: i.name }));
  // Wave 0 fallback — keeps static export happy when the manifest is
  // empty. The placeholder route never reaches PlaygroundShell thanks
  // to the notFound() check below, so it emits an empty 404 page.
  return names.length > 0 ? names : [{ item: '__placeholder' }];
}

type PageProps = {
  params: Promise<{ item: string }>;
};

export default async function PreviewPage({ params }: PageProps) {
  const { item } = await params;
  const entry = items.find((i) => i.name === item);
  if (!entry) notFound();
  return <PlaygroundShell entry={entry} />;
}
