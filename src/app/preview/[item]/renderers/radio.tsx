'use client';

import { useEffect, useId, useState } from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../../../../registry/radio/radio';
import type { PreviewRenderer } from './index';

/**
 * Radio preview renderer — Phase 3 Plan 3-06.
 *
 * Three Khmer-labeled options (Phnom Penh / Siem Reap / Battambang) wired
 * through a real Radix RadioGroup so UI-SPEC §2.6 state matrix is visible
 * end-to-end: unselected / hover / selected dot / focus ring / disabled.
 *
 * Prop-controls (see items.manifest.ts):
 *   - selectedIndex: '0' | '1' | '2' — seeds the initially-selected item.
 *   - disabled: boolean — toggles all three items.
 *
 * Layout: grid with --space-3 gap on the group (component default); each
 * row is flex row with --space-2 gap between the circle and its label
 * (UI-SPEC §2.6 "Label Pairing"). Labels render in Khmer — lang branching
 * is the renderer's responsibility, NOT the primitive's (D-07).
 */

const OPTIONS: readonly { value: string; label: string }[] = [
  { value: 'pp', label: 'ភ្នំពេញ' },
  { value: 'sr', label: 'សៀមរាប' },
  { value: 'bb', label: 'បាត់ដំបង' },
] as const;

export const RadioPreview: PreviewRenderer = ({ state }) => {
  const disabled = Boolean(state.disabled);
  const selectedIndexRaw =
    typeof state.selectedIndex === 'string' ? state.selectedIndex : '0';
  const initialIdx = Math.min(
    Math.max(parseInt(selectedIndexRaw, 10) || 0, 0),
    OPTIONS.length - 1,
  );
  const initialValue = OPTIONS[initialIdx]!.value;

  const [value, setValue] = useState<string>(initialValue);

  // Sync when the playground control changes the seeded selection.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const groupId = useId();

  return (
    <div className="flex flex-col gap-[12px]">
      <RadioGroup
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        aria-label="ខេត្ត/ក្រុង"
      >
        {OPTIONS.map((opt) => {
          const itemId = `${groupId}-${opt.value}`;
          return (
            <div
              key={opt.value}
              className="flex items-center gap-[var(--space-2,0.5rem)]"
            >
              <RadioGroupItem
                id={itemId}
                value={opt.value}
                disabled={disabled}
                aria-label={opt.label}
              />
              <label
                htmlFor={itemId}
                className="text-base leading-[1.6] text-[hsl(var(--foreground))] select-none"
              >
                {opt.label}
              </label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
