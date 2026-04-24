import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * Checkbox a11y — Phase 3 Plan 3-05, R4.5.
 *
 * Runs axe-core (WCAG 2 A + AA tags) against /preview/checkbox in both
 * light and dark themes. Radix Checkbox provides aria-checked +
 * role=checkbox natively; label association is wired by the renderer.
 */

test.describe('a11y checkbox', () => {
  test('a11y checkbox preview (light)', async ({ page }) => {
    await page.goto('/preview/checkbox');
    await page.waitForSelector(
      '[data-testid="playground-frame"] [role="checkbox"]',
      { state: 'visible' },
    );
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y checkbox preview (dark)', async ({ page }) => {
    await page.goto('/preview/checkbox');
    await page.waitForSelector(
      '[data-testid="playground-frame"] [role="checkbox"]',
      { state: 'visible' },
    );
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
