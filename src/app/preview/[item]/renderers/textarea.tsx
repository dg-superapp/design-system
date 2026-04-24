'use client';

import { Textarea } from '../../../../../registry/textarea/textarea';
import type { PreviewRenderer } from './index';

/**
 * Textarea preview renderer — Phase 3 Plan 3-03.
 *
 * Receives typed prop-control state from PlaygroundShell and renders a
 * live <Textarea> wrapped in a minimal <label>+error-message scaffold,
 * identical in shape to the Input renderer so the UI-SPEC §2.3 state
 * matrix is visible end-to-end.
 *
 * Per D-07 the component itself does NOT branch on lang; Khmer coeng
 * descenders are handled by the `:lang(km)` `--leading-loose` cascade
 * on the playground-frame.
 *
 * No JSX eval — statically imported via the renderers registry (D-12).
 */
export const TextareaPreview: PreviewRenderer = ({ state }) => {
  const invalid = Boolean(state.invalid);
  const disabled = Boolean(state.disabled);
  const rawRows = typeof state.rows === 'number' ? state.rows : 3;
  const rows = Math.max(1, Math.min(12, Math.trunc(rawRows)));
  const placeholder =
    typeof state.placeholder === 'string' ? state.placeholder : '';

  const textareaId = 'playground-textarea';
  const errorId = 'playground-textarea-error';

  return (
    <div className="flex max-w-md flex-col gap-[6px]">
      <label
        htmlFor={textareaId}
        className="text-sm font-medium text-[hsl(var(--foreground))]"
      >
        ចំណាំ
      </label>
      <Textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        disabled={disabled}
      />
      {invalid ? (
        <p
          id={errorId}
          className="text-xs leading-[1.4] text-[hsl(var(--danger))]"
        >
          សូមបញ្ចូលតម្លៃត្រឹមត្រូវ
        </p>
      ) : null}
    </div>
  );
};
