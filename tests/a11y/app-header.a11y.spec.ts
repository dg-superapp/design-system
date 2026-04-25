import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * a11y app-header — Phase 4 Plan 4-01.
 *
 * Pre-04-09 note: this spec FILE compiles and is committed in Wave 1, but
 * the actual `/preview/app-header` URL only resolves once 04-09 wires the
 * manifest entry + renderer barrel re-export. Full green-gate runs in CI
 * after Wave 6 finalize.
 */

test.describe('a11y app-header', () => {
  test('a11y app-header preview (light)', async ({ page }) => {
    await page.goto('/preview/app-header');
    await page.waitForSelector('header[role="banner"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y app-header preview (dark)', async ({ page }) => {
    await page.goto('/preview/app-header');
    await page.waitForSelector('header[role="banner"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y app-header — with 2 trailing icons + count badge', async ({ page }) => {
    await page.goto('/preview/app-header');
    await page.waitForSelector('header[role="banner"]', { state: 'visible' });
    await page.getByLabel('Trailing count').fill('3');
    await page.getByLabel('Show badge cluster').check();
    await page.waitForTimeout(100);
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
