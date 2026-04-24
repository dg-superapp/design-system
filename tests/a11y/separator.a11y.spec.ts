import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y separator', () => {
  test('a11y separator preview (light)', async ({ page }) => {
    await page.goto('/preview/separator');
    await page.waitForSelector('[data-testid="separator-under-test"]', {
      state: 'visible',
    });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y separator preview (dark)', async ({ page }) => {
    await page.goto('/preview/separator');
    await page.waitForSelector('[data-testid="separator-under-test"]', {
      state: 'visible',
    });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
