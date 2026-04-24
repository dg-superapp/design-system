import { test, expect } from '@playwright/test';
import { runAxe } from './axe.setup';

test.describe('a11y tooltip', () => {
  test('a11y tooltip preview (light, closed)', async ({ page }) => {
    await page.goto('/preview/tooltip');
    await page.waitForSelector('[data-testid="playground-frame"] button', { state: 'visible' });
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test('a11y tooltip preview (dark, closed)', async ({ page }) => {
    await page.goto('/preview/tooltip');
    await page.waitForSelector('[data-testid="playground-frame"] button', { state: 'visible' });
    await page.selectOption('label:has-text("Theme") select', 'dark');
    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });
});
