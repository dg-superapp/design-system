'use client';

import { useEffect, useId, useState } from 'react';
import { Switch } from '../../../../../registry/switch/switch';
import type { PreviewRenderer } from './index';

/**
 * Switch preview renderer — Phase 3 Plan 3-07.
 */
export const SwitchPreview: PreviewRenderer = ({ state }) => {
  const initialChecked = Boolean(state.checked);
  const disabled = Boolean(state.disabled);
  const label =
    typeof state.label === 'string' && state.label.length > 0
      ? state.label
      : 'ការជូនដំណឹង';

  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  const id = useId();

  return (
    <div className="flex items-center gap-[var(--space-3,0.75rem)]">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={setChecked}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className="text-base leading-[1.6] text-[hsl(var(--foreground))] select-none"
      >
        {label}
      </label>
    </div>
  );
};
