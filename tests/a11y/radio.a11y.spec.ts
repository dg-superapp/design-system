import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * Radio a11y — Phase 3 Plan 3-06, R4.6.
 *
 * Runs axe-core (WCAG 2 A + AA tags) against /preview/radio in both light
 * and dark themes. Radix RadioGroup provides role=radiogroup + role=radio
 * + aria-checked natively; label associations are wired by the renderer
 * via `<label for={id}>`.
 */

test.describe('a11y radio', () => {
  test('a11y radio preview (light)', async ({ page }) => {
    await page.goto('/preview/radio');
    await page.waitForSelector(
      '[data-testid="playground-frame"] [role="radio"]',
      { state: 'visible' },
    );
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y radio preview (dark)', async ({ page }) => {
    await page.goto('/preview/radio');
    await page.waitForSelector(
      '[data-testid="playground-frame"] [role="radio"]',
      { state: 'visible' },
    );
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
