'use client';

import { useId } from 'react';
import { Label } from '../../../../../registry/label/label';
import type { PreviewRenderer } from './index';

/**
 * Label preview renderer — Phase 3 Plan 3-08.
 *
 * Pairs Label with a bare `<input>` (no styling — Input is 3-02's concern)
 * so htmlFor/id wiring is observable end-to-end. Adds `class="peer"` on
 * the input so peer-disabled cascade is visible.
 */
export const LabelPreview: PreviewRenderer = ({ state }) => {
  const text =
    typeof state.text === 'string' && state.text.length > 0
      ? state.text
      : 'អាស័យដ្ឋានអ៊ីមែល';
  const required = Boolean(state.required);
  const disabled = Boolean(state.disabled);
  const id = useId();

  return (
    <div className="flex max-w-sm flex-col gap-[var(--space-2,0.5rem)]">
      <Label htmlFor={id} required={required}>
        {text}
      </Label>
      <input
        id={id}
        type="email"
        aria-required={required || undefined}
        disabled={disabled}
        placeholder="user@example.gov.kh"
        className="peer h-[40px] rounded-[var(--radius-md)] border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-[12px] text-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:border-[hsl(var(--blue-700))] focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed disabled:bg-[hsl(var(--background))]"
      />
    </div>
  );
};
