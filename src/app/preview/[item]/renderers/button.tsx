'use client';

import { Button } from '../../../../../registry/button/button';
import type { PreviewRenderer } from './index';

/**
 * Button preview renderer — Phase 3 Plan 3-01.
 *
 * Receives typed prop-control state from PlaygroundShell and renders
 * the live <Button>. No JSX eval — this file is statically imported
 * via the renderers registry (D-12).
 */
export const ButtonPreview: PreviewRenderer = ({ state }) => {
  const variant = (state.variant as
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'ghost-danger'
    | undefined) ?? 'primary';
  const size = (state.size as 'default' | 'sm' | undefined) ?? 'default';
  const disabled = Boolean(state.disabled);
  const loading = Boolean(state.loading);
  const label =
    typeof state.label === 'string' && state.label.length > 0
      ? state.label
      : 'ចុចនៅទីនេះ';

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
    >
      {label}
    </Button>
  );
};
