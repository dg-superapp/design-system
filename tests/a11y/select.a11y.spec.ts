import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y select', () => {
  test('a11y select preview (light)', async ({ page }) => {
    await page.goto('/preview/select');
    await page.waitForSelector('[role="combobox"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y select preview (dark)', async ({ page }) => {
    await page.goto('/preview/select');
    await page.waitForSelector('[role="combobox"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
