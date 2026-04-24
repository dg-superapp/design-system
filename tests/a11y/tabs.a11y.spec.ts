import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y tabs', () => {
  test('a11y tabs preview (light)', async ({ page }) => {
    await page.goto('/preview/tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y tabs preview (dark)', async ({ page }) => {
    await page.goto('/preview/tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
