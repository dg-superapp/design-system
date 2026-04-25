import type { ComponentType } from 'react';
import { ButtonPreview } from './button';
import { InputPreview } from './input';
import { TextareaPreview } from './textarea';
import { SelectPreview } from './select';
import { CheckboxPreview } from './checkbox';
import { RadioPreview } from './radio';
import { SwitchPreview } from './switch';
import { LabelPreview } from './label';
import { BadgePreview } from './badge';
import { TooltipPreview } from './tooltip';
import { TabsPreview } from './tabs';
import { SeparatorPreview } from './separator';
import { ScrollAreaPreview } from './scroll-area';
import { FormPreview } from './form';
// === Phase 4 — Headers + Navigation renderers (atomic batch per ISSUE-01) ===
import { AppHeaderPreview } from './app-header';
import { SectionHeaderPreview } from './section-header';
import { NavRowPreview } from './nav-row';
import { SegmentedTabsPreview } from './segmented-tabs';
import { StepIndicatorPreview } from './step-indicator';
import { HeroBannerPreview } from './hero-banner';
import { SideDrawerPreview } from './side-drawer';
import { MiniAppHomePreview } from './miniapp-home';

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
  radio: RadioPreview,
  switch: SwitchPreview,
  label: LabelPreview,
  badge: BadgePreview,
  tooltip: TooltipPreview,
  tabs: TabsPreview,
  separator: SeparatorPreview,
  'scroll-area': ScrollAreaPreview,
  form: FormPreview,
  // === Phase 4 — Headers + Navigation (atomic batch per ISSUE-01) ===
  'app-header': AppHeaderPreview,
  'section-header': SectionHeaderPreview,
  'nav-row': NavRowPreview,
  'segmented-tabs': SegmentedTabsPreview,
  'step-indicator': StepIndicatorPreview,
  'hero-banner': HeroBannerPreview,
  'side-drawer': SideDrawerPreview,
  'miniapp-home': MiniAppHomePreview,
};
