import { test, expect } from '@playwright/test';

/**
 * Tooltip e2e — Phase 3 Plan 3-11.
 */
test.describe('tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/tooltip');
    await page.waitForSelector('[data-testid="playground-frame"] button', { state: 'visible' });
  });

  test('content is not rendered before open', async ({ page }) => {
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });

  test('focus opens the tooltip with role=tooltip', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] button').first();
    await trigger.focus();
    await expect(page.getByRole('tooltip').first()).toBeVisible({ timeout: 2000 });
  });

  test('Escape closes the tooltip', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] button').first();
    await trigger.focus();
    await expect(page.getByRole('tooltip').first()).toBeVisible({ timeout: 2000 });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });

  test('content background is dark --gray-900', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] button').first();
    await trigger.focus();
    await page.waitForSelector('[data-state="delayed-open"], [data-state="instant-open"]', { timeout: 2000 });
    const bg = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-state="delayed-open"], [data-state="instant-open"]'));
      const styled = nodes.find((n) => n.className.includes('bg-[hsl(var(--gray-900))]'));
      return styled ? window.getComputedStyle(styled).backgroundColor : null;
    });
    expect(bg).not.toBeNull();
    expect(bg).toMatch(/rgb/);
  });
});
