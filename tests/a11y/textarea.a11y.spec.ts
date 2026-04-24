import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y textarea', () => {
  test('a11y textarea preview (light)', async ({ page }) => {
    await page.goto('/preview/textarea');
    await page.waitForSelector('textarea', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y textarea preview (dark)', async ({ page }) => {
    await page.goto('/preview/textarea');
    await page.waitForSelector('textarea', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
