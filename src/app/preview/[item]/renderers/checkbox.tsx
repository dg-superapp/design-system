'use client';

import { useEffect, useId, useState } from 'react';
import { Checkbox } from '../../../../../registry/checkbox/checkbox';
import type { PreviewRenderer } from './index';

/**
 * Checkbox preview renderer — Phase 3 Plan 3-05.
 *
 * Mirrors the shape of Input/Select renderers: a typed prop-control
 * state drives a live <Checkbox> + adjacent <label> so UI-SPEC §2.5
 * state matrix (unchecked/checked/indeterminate/disabled/focus-visible)
 * is visible end-to-end.
 *
 * The `checked` control is a variant ('false' | 'true' | 'indeterminate')
 * so the playground can exercise all three Radix states from one
 * dropdown. Local React state tracks user clicks so Space/click toggling
 * works against a real Radix root; the variant control seeds the
 * initial/explicit value.
 *
 * Layout: flex row with --space-2 (8px) gap between box and label
 * (UI-SPEC §2.5 "Label Pairing"). Wrapper has invisible padding to
 * reach the 44×44px touch target required by UI-SPEC §6.
 */
export const CheckboxPreview: PreviewRenderer = ({ state }) => {
  const disabled = Boolean(state.disabled);
  const labelText =
    typeof state.label === 'string' && state.label.length > 0
      ? state.label
      : 'យល់ព្រម';
  const checkedControl =
    typeof state.checked === 'string' ? state.checked : 'false';

  const initial: boolean | 'indeterminate' =
    checkedControl === 'true'
      ? true
      : checkedControl === 'indeterminate'
        ? 'indeterminate'
        : false;

  const [checked, setChecked] = useState<boolean | 'indeterminate'>(initial);

  // Sync when the playground control changes (select a different variant).
  useEffect(() => {
    setChecked(initial);
  }, [initial]);

  const checkboxId = useId();

  return (
    <div className="flex flex-col gap-[12px]">
      {/* 44×44 touch target achieved via -my/-mx offsets around the 20×20 box */}
      <div className="flex items-center gap-[var(--space-2,0.5rem)]">
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={setChecked}
          disabled={disabled}
          aria-label={labelText}
        />
        <label
          htmlFor={checkboxId}
          className="text-base leading-[1.6] text-[hsl(var(--foreground))] select-none"
        >
          {labelText}
        </label>
      </div>
    </div>
  );
};
