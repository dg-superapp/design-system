import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * Button a11y — Phase 3 Plan 3-01 (grep tag `a11y` + `button`).
 *
 * Runs axe-core at /preview/button in both light and dark themes.
 * Both modes must ship zero WCAG AA violations (R4 acceptance).
 */
test.describe('a11y button', () => {
  test('a11y button preview (light)', async ({ page }) => {
    await page.goto('/preview/button');
    await page.waitForSelector('button', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y button preview (dark)', async ({ page }) => {
    await page.goto('/preview/button');
    await page.waitForSelector('button', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
