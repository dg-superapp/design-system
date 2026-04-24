import { test, expect } from '@playwright/test';

test.describe('switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/switch');
    await page.waitForSelector('[role="switch"]', { state: 'visible' });
  });

  test('track renders at 40×24px', async ({ page }) => {
    const sw = page.locator('[data-testid="playground-frame"] [role="switch"]').first();
    const box = await sw.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBe(40);
    expect(Math.round(box!.height)).toBe(24);
  });

  test('click toggles checked state', async ({ page }) => {
    const sw = page.locator('[data-testid="playground-frame"] [role="switch"]').first();
    await expect(sw).toHaveAttribute('data-state', 'unchecked');
    await sw.click();
    await expect(sw).toHaveAttribute('data-state', 'checked');
    await sw.click();
    await expect(sw).toHaveAttribute('data-state', 'unchecked');
  });

  test('checked track uses --brand', async ({ page }) => {
    const sw = page.locator('[data-testid="playground-frame"] [role="switch"]').first();
    await sw.click();
    const bg = await sw.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toMatch(/rgb/);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('focus-visible applies --shadow-focus ring', async ({ page }) => {
    const sw = page.locator('[data-testid="playground-frame"] [role="switch"]').first();
    await sw.evaluate((el) => (el as HTMLElement).focus());
    const shadow = await sw.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(shadow).not.toBe('none');
    expect(shadow).toMatch(/3px/);
  });

  test('disabled control blocks interaction', async ({ page }) => {
    await page.locator('label:has-text("disabled") input[type="checkbox"]').check();
    const sw = page.locator('[data-testid="playground-frame"] [role="switch"]').first();
    await expect(sw).toBeDisabled();
  });
});
