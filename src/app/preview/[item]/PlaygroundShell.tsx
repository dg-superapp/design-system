'use client';

import { useEffect, useState } from 'react';
import type { ManifestEntry, PropControl } from '../../../../registry/items.manifest';
import { previewRenderers } from './renderers';

/**
 * PlaygroundShell — Phase 3 Wave 0 (3-CONTEXT D-11, D-12, D-13).
 *
 * Three global toggles per D-13:
 *  - theme     : light ↔ dark via `document.documentElement.classList`
 *  - language  : en ↔ km via `lang` attribute on the preview frame
 *  - viewport  : desktop ↔ mobile 375×812 via CSS max-width wrapper
 *
 * Prop controls (D-12) are TYPED via PropControl union — NO runtime
 * JSX eval, NO react-live, NO sandpack. Each primitive plan ships a
 * dedicated preview component that reads the control values and
 * renders the actual primitive. Wave 0 registers a placeholder slot;
 * plans 3-01..3-14 register their preview render functions via a
 * component registry (to be added in plan 3-01 alongside Button).
 */

export type PlaygroundShellProps = {
  entry: ManifestEntry;
};

type PropValue = string | number | boolean;

function defaultValue(control: PropControl): PropValue {
  return control.default;
}

function buildInitialState(controls: readonly PropControl[]): Record<string, PropValue> {
  return Object.fromEntries(controls.map((c) => [c.name, defaultValue(c)]));
}

export function PlaygroundShell({ entry }: PlaygroundShellProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'en' | 'km'>('en');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [values, setValues] = useState<Record<string, PropValue>>(() =>
    buildInitialState(entry.controls),
  );

  // Theme toggle flips `.dark` on <html> per PROJECT decisions.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    return () => {
      // Reset on unmount so navigating away doesn't leave the whole
      // docs site in dark mode.
      root.classList.remove('dark');
    };
  }, [theme]);

  const frameWrapperStyle: React.CSSProperties =
    viewport === 'mobile'
      ? { maxWidth: '375px', minHeight: '812px', margin: '0 auto' }
      : { width: '100%' };

  return (
    <div className="playground-root grid min-h-screen grid-cols-[280px_1fr] gap-0">
      <aside className="border-r border-border bg-sidebar p-4 text-sidebar-foreground">
        <header className="mb-6">
          <h1 className="text-xl font-semibold">{entry.title}</h1>
          {entry.description && (
            <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
          )}
        </header>

        <section className="mb-6 space-y-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Display
          </h2>
          <label className="flex items-center justify-between text-sm">
            Theme
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="rounded-sm border border-input bg-background px-2 py-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="flex items-center justify-between text-sm">
            Language
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'km')}
              className="rounded-sm border border-input bg-background px-2 py-1"
            >
              <option value="en">English</option>
              <option value="km">ភាសាខ្មែរ</option>
            </select>
          </label>
          <label className="flex items-center justify-between text-sm">
            Viewport
            <select
              value={viewport}
              onChange={(e) => setViewport(e.target.value as 'desktop' | 'mobile')}
              className="rounded-sm border border-input bg-background px-2 py-1"
            >
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile (375×812)</option>
            </select>
          </label>
        </section>

        {entry.controls.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Props
            </h2>
            {entry.controls.map((control) => (
              <PropKnob
                key={control.name}
                control={control}
                value={values[control.name]}
                onChange={(next) => setValues((prev) => ({ ...prev, [control.name]: next }))}
              />
            ))}
          </section>
        )}
      </aside>

      <main className="bg-background p-6">
        <div
          lang={lang}
          data-testid="playground-frame"
          className="playground-frame mx-auto rounded-md border border-border bg-card p-6"
          style={frameWrapperStyle}
        >
          <PreviewSlot entry={entry} state={values} />
        </div>
      </main>
    </div>
  );
}

function PropKnob({
  control,
  value,
  onChange,
}: {
  control: PropControl;
  value: PropValue | undefined;
  onChange: (next: PropValue) => void;
}) {
  const label = control.label ?? control.name;
  switch (control.kind) {
    case 'variant':
      return (
        <label className="flex items-center justify-between text-sm">
          {label}
          <select
            value={String(value ?? control.default)}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-sm border border-input bg-background px-2 py-1"
          >
            {control.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      );
    case 'boolean':
      return (
        <label className="flex items-center justify-between text-sm">
          {label}
          <input
            type="checkbox"
            checked={Boolean(value ?? control.default)}
            onChange={(e) => onChange(e.target.checked)}
          />
        </label>
      );
    case 'text':
      return (
        <label className="flex flex-col gap-1 text-sm">
          {label}
          <input
            type="text"
            value={String(value ?? control.default)}
            placeholder={control.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-sm border border-input bg-background px-2 py-1"
          />
        </label>
      );
    case 'number':
      return (
        <label className="flex items-center justify-between text-sm">
          {label}
          <input
            type="number"
            value={Number(value ?? control.default)}
            min={control.min}
            max={control.max}
            step={control.step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 rounded-sm border border-input bg-background px-2 py-1"
          />
        </label>
      );
  }
}

/**
 * Preview slot — dispatches to the renderer registered in
 * `./renderers/index.ts`. Plans 3-01..3-14 add their entry there.
 * Falls back to a human-readable placeholder when a manifest entry
 * ships before its renderer is registered.
 */
function PreviewSlot({
  entry,
  state,
}: {
  entry: ManifestEntry;
  state: Record<string, PropValue>;
}) {
  const Renderer = previewRenderers[entry.name];
  if (!Renderer) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
        Preview not implemented for <code className="ml-1">{entry.name}</code>
      </div>
    );
  }
  return <Renderer state={state} />;
}
