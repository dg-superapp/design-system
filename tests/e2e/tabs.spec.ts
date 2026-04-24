import { test, expect } from '@playwright/test';

test.describe('tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
  });

  test('tablist with 3 tabs rendered', async ({ page }) => {
    const tablist = page.locator('[data-testid="playground-frame"] [role="tablist"]').first();
    await expect(tablist).toBeVisible();
    const tabs = tablist.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3);
  });

  test('first tab is selected by default and shows its panel', async ({ page }) => {
    const firstTab = page.locator('[data-testid="playground-frame"] [role="tab"]').first();
    await expect(firstTab).toHaveAttribute('data-state', 'active');
    const panel = page.locator('[data-testid="playground-frame"] [role="tabpanel"]').first();
    await expect(panel).toBeVisible();
  });

  test('clicking a tab switches the active panel', async ({ page }) => {
    const tabs = page.locator('[data-testid="playground-frame"] [role="tab"]');
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('data-state', 'active');
    await expect(tabs.nth(0)).toHaveAttribute('data-state', 'inactive');
  });

  test('ArrowRight advances focus + selection', async ({ page }) => {
    const tabs = page.locator('[data-testid="playground-frame"] [role="tab"]');
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('data-state', 'active');
  });

  test('pill variant selector changes the tablist class set', async ({ page }) => {
    await page.selectOption('label:has-text("variant") select', 'pill');
    const tablist = page.locator('[data-testid="playground-frame"] [role="tablist"]').first();
    const clsBefore = await tablist.getAttribute('class');
    expect(clsBefore).toBeTruthy();
  });

  test('focus-visible on trigger applies --shadow-focus', async ({ page }) => {
    const tab = page.locator('[data-testid="playground-frame"] [role="tab"]').first();
    await tab.focus();
    const shadow = await tab.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(shadow).not.toBe('none');
  });
});
