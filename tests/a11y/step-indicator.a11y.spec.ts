import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * a11y step-indicator — Phase 4 Plan 4-05.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 2; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 */

test.describe('a11y step-indicator', () => {
  test('a11y step-indicator preview (light)', async ({ page }) => {
    await page.goto('/preview/step-indicator');
    await page.waitForSelector('ol', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y step-indicator preview (dark)', async ({ page }) => {
    await page.goto('/preview/step-indicator');
    await page.waitForSelector('ol', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
