import { test, expect } from '@playwright/test';

test.describe('label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/label');
    await page.waitForSelector('[data-testid="playground-frame"] label', { state: 'visible' });
  });

  test('label renders with medium weight 14px', async ({ page }) => {
    const label = page.locator('[data-testid="playground-frame"] label').first();
    const styles = await label.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontWeight: cs.fontWeight, fontSize: cs.fontSize };
    });
    expect(styles.fontSize).toBe('14px');
    expect(['500', 'medium']).toContain(styles.fontWeight);
  });

  test('htmlFor focuses paired input when clicked', async ({ page }) => {
    const label = page.locator('[data-testid="playground-frame"] label').first();
    const input = page.locator('[data-testid="playground-frame"] input[type="email"]').first();
    await label.click();
    await expect(input).toBeFocused();
  });

  test('required control renders aria-hidden red asterisk', async ({ page }) => {
    await page.locator('label:has-text("required") input[type="checkbox"]').check();
    const asterisk = page.locator('[data-testid="playground-frame"] label span[aria-hidden="true"]').first();
    await expect(asterisk).toHaveText('*');
    const color = await asterisk.evaluate((el) => window.getComputedStyle(el).color);
    expect(color).toMatch(/rgb/);
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('required toggle adds aria-required on paired input', async ({ page }) => {
    await page.locator('label:has-text("required") input[type="checkbox"]').check();
    const input = page.locator('[data-testid="playground-frame"] input[type="email"]').first();
    await expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('disabled control blocks paired input', async ({ page }) => {
    await page.locator('label:has-text("disabled") input[type="checkbox"]').check();
    const input = page.locator('[data-testid="playground-frame"] input[type="email"]').first();
    await expect(input).toBeDisabled();
  });
});
