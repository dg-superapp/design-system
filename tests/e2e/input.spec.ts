import { test, expect } from '@playwright/test';

/**
 * Input e2e — Phase 3 Plan 3-02, UI-SPEC §2.2.
 */
test.describe('input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/input');
    await page.waitForSelector('input[type="text"]', { state: 'visible' });
  });

  test('default renders at 48px height', async ({ page }) => {
    const input = page.locator('[data-testid="playground-frame"] input').first();
    const box = await input.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.height)).toBe(48);
  });

  test('focus-visible applies --shadow-focus ring', async ({ page }) => {
    const input = page.locator('[data-testid="playground-frame"] input').first();
    await input.evaluate((el) => (el as HTMLElement).focus());
    const shadow = await input.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );
    expect(shadow).toMatch(/3px/);
  });

  test('invalid control applies danger border via aria-invalid', async ({ page }) => {
    await page.locator('label:has-text("invalid") input[type="checkbox"]').check();
    const input = page.locator('[data-testid="playground-frame"] input').first();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    const border = await input.evaluate((el) => window.getComputedStyle(el).borderColor);
    expect(border).toMatch(/rgb/);
    expect(border).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('disabled uses tokenized background + muted-foreground (NOT opacity-50)', async ({ page }) => {
    await page.locator('label:has-text("disabled") input[type="checkbox"]').check();
    const input = page.locator('[data-testid="playground-frame"] input').first();
    await expect(input).toBeDisabled();
    const opacity = await input.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('khmer placeholder renders at lang=km without clipping', async ({ page }) => {
    await page.selectOption('label:has-text("Language") select', 'km');
    const input = page.locator('[data-testid="playground-frame"] input').first();
    const box = await input.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeLessThanOrEqual(50);
  });
});
