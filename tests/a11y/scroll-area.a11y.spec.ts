import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y scroll-area', () => {
  test('a11y scroll-area preview (light)', async ({ page }) => {
    await page.goto('/preview/scroll-area');
    await page.waitForSelector('[data-testid="scroll-area-under-test"]', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y scroll-area preview (dark)', async ({ page }) => {
    await page.goto('/preview/scroll-area');
    await page.waitForSelector('[data-testid="scroll-area-under-test"]', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
