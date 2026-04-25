import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * a11y segmented-tabs — Phase 4 Plan 4-04.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 2; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 */

test.describe('a11y segmented-tabs', () => {
  test('a11y segmented-tabs preview (light)', async ({ page }) => {
    await page.goto('/preview/segmented-tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y segmented-tabs preview (dark)', async ({ page }) => {
    await page.goto('/preview/segmented-tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
