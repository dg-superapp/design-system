'use client';

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { REGISTRY_BASE } from '../../../registry/items.manifest';

/**
 * CopyInstallButton — Phase 3 Plan 3-15 (R9.4).
 *
 * Shared copy-ready install command block for every
 * `/docs/components/<item>/page.mdx` docs page. Renders the canonical
 * shadcn CLI invocation:
 *
 *   npx shadcn@latest add {REGISTRY_BASE}/r/{name}.json
 *
 * Clicking the trailing "Copy" button writes that exact string to the
 * clipboard via `navigator.clipboard.writeText`. The button tracks its
 * own copied state for 1500ms to surface feedback without needing a
 * toast system.
 *
 * Icons swap between Copy / Check (lucide-react) on toggle. When the
 * Clipboard API is unavailable (http://, older Safari) the handler
 * silently no-ops — the command text is still selectable and copyable
 * with Cmd/Ctrl+C.
 *
 * R9.4 acceptance: `navigator.clipboard` call present, command writes
 * exactly `{REGISTRY_BASE}/r/{name}.json`, min 25 LoC.
 */

export interface CopyInstallButtonProps {
  /** Registry slug, e.g. `button`, `scroll-area`. */
  name: string;
}

export function CopyInstallButton({ name }: CopyInstallButtonProps) {
  const command = `npx shadcn@latest add ${REGISTRY_BASE}/r/${name}.json`;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — user can still select and copy manually.
    }
  }, [command]);

  return (
    <div
      data-testid="copy-install-button"
      data-copy-install-name={name}
      className="my-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-muted px-[14px] py-3 font-mono text-xs"
    >
      <code
        data-testid="install-command-text"
        className="flex-1 overflow-x-auto whitespace-nowrap text-foreground"
      >
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Install command copied' : 'Copy install command'}
        data-copied={copied ? 'true' : 'false'}
        className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-background px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
      >
        {copied ? (
          <Check aria-hidden="true" className="h-3.5 w-3.5" />
        ) : (
          <Copy aria-hidden="true" className="h-3.5 w-3.5" />
        )}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}

export default CopyInstallButton;
