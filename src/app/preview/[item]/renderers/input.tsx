'use client';

import { Input } from '../../../../../registry/input/input';
import type { PreviewRenderer } from './index';

/**
 * Input preview renderer — Phase 3 Plan 3-02.
 *
 * Receives typed prop-control state from PlaygroundShell and renders a
 * live <Input> wrapped in a minimal <label>+error-message scaffold so
 * the UI-SPEC §2.2 state matrix is visible end-to-end (required
 * asterisk hook, error message below field).
 *
 * Per D-07 the component itself does NOT branch on lang; the Khmer date
 * placeholder ថ្ងៃ/ខែ/ឆ្នាំ is delivered via the declarative
 * `placeholder` prop when `type=date` and the playground-frame `lang`
 * attribute is `km`. PlaygroundShell scopes `lang` to the frame, so
 * navigating away resets cleanly.
 *
 * No JSX eval — statically imported via the renderers registry (D-12).
 */
const KHMER_DATE_PLACEHOLDER = 'ថ្ងៃ/ខែ/ឆ្នាំ';

export const InputPreview: PreviewRenderer = ({ state }) => {
  const type = (state.type as 'text' | 'email' | 'date' | undefined) ?? 'text';
  const invalid = Boolean(state.invalid);
  const disabled = Boolean(state.disabled);
  const required = Boolean(state.required);

  // Resolve the effective `lang` from the playground frame so the Khmer
  // date placeholder is applied without the Input component needing to
  // know about lang (D-07).
  const frameLang =
    typeof document !== 'undefined'
      ? (document.querySelector('[data-testid="playground-frame"]')
          ?.getAttribute('lang') ?? 'en')
      : 'en';

  const rawPlaceholder =
    typeof state.placeholder === 'string' ? state.placeholder : '';
  const placeholder =
    type === 'date' && frameLang === 'km'
      ? KHMER_DATE_PLACEHOLDER
      : rawPlaceholder;

  const inputId = 'playground-input';
  const errorId = 'playground-input-error';
  const labelText = type === 'date' ? 'កាលបរិច្ឆេទកំណើត' : 'ឈ្មោះ';

  return (
    <div className="flex max-w-md flex-col gap-[6px]">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-[hsl(var(--foreground))]"
      >
        {labelText}
        {required ? (
          <span
            aria-hidden="true"
            className="ml-1 text-[hsl(var(--danger))]"
          >
            *
          </span>
        ) : null}
      </label>
      <Input
        id={inputId}
        type={type}
        placeholder={placeholder || undefined}
        aria-placeholder={
          type === 'date' && frameLang === 'km'
            ? KHMER_DATE_PLACEHOLDER
            : undefined
        }
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        disabled={disabled}
        required={required}
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
