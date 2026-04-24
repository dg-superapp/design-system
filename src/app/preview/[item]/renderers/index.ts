import type { ComponentType } from 'react';
import { ButtonPreview } from './button';
import { InputPreview } from './input';
import { TextareaPreview } from './textarea';
import { SelectPreview } from './select';
import { CheckboxPreview } from './checkbox';

/**
 * Preview renderer registry — Phase 3 Plan 3-01.
 *
 * Static map from manifest entry `name` → renderer component. Each
 * primitive plan (3-01..3-14) adds an entry here alongside its
 * component. No runtime JSX eval (D-12) — PlaygroundShell just looks
 * up the renderer by name and passes prop-control state.
 */

export type PreviewState = Record<string, string | number | boolean>;

export type PreviewRendererProps = {
  state: PreviewState;
};

export type PreviewRenderer = ComponentType<PreviewRendererProps>;

export const previewRenderers: Record<string, PreviewRenderer> = {
  button: ButtonPreview,
  input: InputPreview,
  textarea: TextareaPreview,
  select: SelectPreview,
  checkbox: CheckboxPreview,
};
