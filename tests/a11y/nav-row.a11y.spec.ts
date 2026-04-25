import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * a11y nav-row — Phase 4 Plan 4-03.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 1; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 */

test.describe('a11y nav-row', () => {
  test('a11y nav-row preview (light)', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.waitForLoadState('networkidle');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y nav-row preview (dark)', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.waitForLoadState('networkidle');
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y nav-row — active state across all trailing variants', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Active state').check();
    for (const t of ['chevron', 'count', 'switch', 'none']) {
      await page.getByLabel('Trailing').selectOption(t);
      await page.waitForTimeout(50);
      const results = await runAxe(page);
      expect(results.violations).toEqual([]);
    }
  });
});
