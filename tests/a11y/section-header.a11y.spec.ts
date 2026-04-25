import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * a11y section-header — Phase 4 Plan 4-02.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 1; `/preview/section-header`
 * URL resolves once 04-09 wires manifest + renderer barrel atomically.
 */

test.describe('a11y section-header', () => {
  test('a11y section-header preview (light)', async ({ page }) => {
    await page.goto('/preview/section-header');
    await page.waitForSelector('h2', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y section-header preview (dark)', async ({ page }) => {
    await page.goto('/preview/section-header');
    await page.waitForSelector('h2', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
