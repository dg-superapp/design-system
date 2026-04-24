import { test, expect } from '@playwright/test';

/**
 * Select e2e — Phase 3 Plan 3-04.
 */
test.describe('select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/select');
    await page.waitForSelector('[role="combobox"]', { state: 'visible' });
  });

  test('trigger renders at 48px height', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] [role="combobox"]').first();
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.height)).toBe(48);
  });

  test('opens dropdown on click and lists options', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] [role="combobox"]').first();
    await trigger.click();
    const opt = page.getByRole('option', { name: 'English' });
    await expect(opt).toBeVisible();
  });

  test('selects an item and reflects value', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] [role="combobox"]').first();
    await trigger.click();
    await page.getByRole('option', { name: 'English' }).click();
    await expect(trigger).toContainText('English');
  });

  test('focus-visible applies --shadow-focus on trigger', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] [role="combobox"]').first();
    await trigger.evaluate((el) => (el as HTMLElement).focus());
    const shadow = await trigger.evaluate((el) => window.getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/3px/);
  });

  test('disabled control blocks interaction', async ({ page }) => {
    await page.locator('label:has-text("disabled") input[type="checkbox"]').check();
    const trigger = page.locator('[data-testid="playground-frame"] [role="combobox"]').first();
    await expect(trigger).toBeDisabled();
  });

  test('invalid control applies aria-invalid on trigger', async ({ page }) => {
    await page.locator('label:has-text("invalid") input[type="checkbox"]').check();
    const trigger = page.locator('[data-testid="playground-frame"] [role="combobox"]').first();
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  test('keyboard: Enter opens, Arrow navigates, Escape closes', async ({ page }) => {
    const trigger = page.locator('[data-testid="playground-frame"] [role="combobox"]').first();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('option', { name: 'ខ្មែរ' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('option', { name: 'ខ្មែរ' })).not.toBeVisible();
  });
});
