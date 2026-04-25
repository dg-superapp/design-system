import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

/**
 * a11y hero-banner — Phase 4 Plan 4-06.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 3; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 */

test.describe('a11y hero-banner', () => {
  test('a11y hero-banner preview (light)', async ({ page }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForSelector('section[aria-roledescription="carousel"]', {
      state: 'visible',
    });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y hero-banner preview (dark)', async ({ page }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForSelector('section[aria-roledescription="carousel"]', {
      state: 'visible',
    });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y hero-banner — inactive slides do not raise aria-hidden-focus (A8)', async ({
    page,
  }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForSelector('section[aria-roledescription="carousel"]', {
      state: 'visible',
    });
    const results = await runAxe(page);
    const hidden = results.violations.find(
      (v: { id: string }) => v.id === 'aria-hidden-focus',
    );
    expect(hidden).toBeUndefined();
  });
});
