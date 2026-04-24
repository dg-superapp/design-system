'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../registry/select/select';
import type { PreviewRenderer } from './index';

/**
 * Select preview renderer — Phase 3 Plan 3-04.
 *
 * Receives typed prop-control state from PlaygroundShell and renders a
 * live <Select> wrapped in a minimal <label>+error-message scaffold,
 * identical in shape to the Input/Textarea renderers so the UI-SPEC
 * §2.4 state matrix is visible end-to-end.
 *
 * Options are hardcoded Khmer/English/Chinese language labels (matches
 * 3-UI-SPEC §2.4 playground example). Per D-07 the component itself
 * does NOT branch on lang — descender handling is theme-layer.
 *
 * No JSX eval — statically imported via the renderers registry (D-12).
 */
export const SelectPreview: PreviewRenderer = ({ state }) => {
  const invalid = Boolean(state.invalid);
  const disabled = Boolean(state.disabled);
  const placeholder =
    typeof state.placeholder === 'string' && state.placeholder.length > 0
      ? state.placeholder
      : 'ជ្រើសរើសភាសា';

  const triggerId = 'playground-select';
  const errorId = 'playground-select-error';

  return (
    <div className="flex max-w-md flex-col gap-[6px]">
      <label
        htmlFor={triggerId}
        className="text-sm font-medium text-[hsl(var(--foreground))]"
      >
        ភាសា
      </label>
      <Select disabled={disabled}>
        <SelectTrigger
          id={triggerId}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="km">ខ្មែរ</SelectItem>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="zh">中文</SelectItem>
        </SelectContent>
      </Select>
      {invalid ? (
        <p
          id={errorId}
          className="text-xs leading-[1.4] text-[hsl(var(--danger))]"
        >
          សូមជ្រើសរើសភាសា
        </p>
      ) : null}
    </div>
  );
};
