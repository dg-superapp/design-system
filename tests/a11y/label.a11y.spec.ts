import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y label', () => {
  test('a11y label preview (light)', async ({ page }) => {
    await page.goto('/preview/label');
    await page.waitForSelector('[data-testid="playground-frame"] label', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y label preview (dark)', async ({ page }) => {
    await page.goto('/preview/label');
    await page.waitForSelector('[data-testid="playground-frame"] label', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
