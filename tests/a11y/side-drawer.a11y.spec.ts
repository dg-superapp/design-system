import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * a11y side-drawer — Phase 4 Plan 4-07.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 4; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 */

test.describe('a11y side-drawer', () => {
  test('a11y side-drawer preview (light)', async ({ page }) => {
    await page.goto('/preview/side-drawer');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y side-drawer preview (dark)', async ({ page }) => {
    await page.goto('/preview/side-drawer');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
