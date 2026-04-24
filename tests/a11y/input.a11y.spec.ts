import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y input', () => {
  test('a11y input preview (light)', async ({ page }) => {
    await page.goto('/preview/input');
    await page.waitForSelector('input[type="text"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y input preview (dark)', async ({ page }) => {
    await page.goto('/preview/input');
    await page.waitForSelector('input[type="text"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
