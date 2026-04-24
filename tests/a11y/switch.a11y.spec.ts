import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y switch', () => {
  test('a11y switch preview (light)', async ({ page }) => {
    await page.goto('/preview/switch');
    await page.waitForSelector('[role="switch"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y switch preview (dark)', async ({ page }) => {
    await page.goto('/preview/switch');
    await page.waitForSelector('[role="switch"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
