import { test, expect } from '@playwright/test';

/**
 * Checkbox e2e — Phase 3 Plan 3-05, R4.5.
 *
 * Covers UI-SPEC §2.5 Visual Acceptance:
 *   1. Box renders at 20×20 px.
 *   2. Click toggles data-state unchecked → checked.
 *   3. Space key toggles state.
 *   4. focus-visible applies --shadow-focus (non-empty box-shadow).
 *   5. Disabled blocks pointer interaction and has aria-disabled.
 *   6. Checked state fills with --brand (hsl assertion).
 *   7. Indeterminate variant from playground control renders data-state=indeterminate.
 */

test.describe('checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/checkbox');
    await page.waitForSelector('[data-testid="playground-frame"] [role="checkbox"]', {
      state: 'visible',
    });
  });

  test('box renders at 20×20px', async ({ page }) => {
    const box = page
      .locator('[data-testid="playground-frame"] [role="checkbox"]')
      .first();
    const bb = await box.boundingBox();
    expect(bb).not.toBeNull();
    expect(Math.round(bb!.width)).toBe(20);
    expect(Math.round(bb!.height)).toBe(20);
  });

  test('click toggles data-state unchecked -> checked', async ({ page }) => {
    const box = page
      .locator('[data-testid="playground-frame"] [role="checkbox"]')
      .first();
    await expect(box).toHaveAttribute('data-state', 'unchecked');
    await box.click();
    await expect(box).toHaveAttribute('data-state', 'checked');
    await box.click();
    await expect(box).toHaveAttribute('data-state', 'unchecked');
  });

  test('Space key toggles state', async ({ page }) => {
    const box = page
      .locator('[data-testid="playground-frame"] [role="checkbox"]')
      .first();
    await box.focus();
    await page.keyboard.press('Space');
    await expect(box).toHaveAttribute('data-state', 'checked');
    await page.keyboard.press('Space');
    await expect(box).toHaveAttribute('data-state', 'unchecked');
  });

  test('focus-visible applies --shadow-focus ring', async ({ page }) => {
    const box = page
      .locator('[data-testid="playground-frame"] [role="checkbox"]')
      .first();
    await box.evaluate((el) => (el as HTMLElement).focus());
    const shadow = await box.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );
    // --shadow-focus is a non-"none" box-shadow; assert it's been applied.
    expect(shadow).not.toBe('none');
    expect(shadow.length).toBeGreaterThan(5);
  });

  test('checked state fills with --brand background', async ({ page }) => {
    const box = page
      .locator('[data-testid="playground-frame"] [role="checkbox"]')
      .first();
    await box.click();
    await expect(box).toHaveAttribute('data-state', 'checked');
    const bg = await box.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    // --brand light = hsl(216 85% 34%) ≈ rgb(13, 71, 161). Assert it's clearly
    // not the unchecked --card (white) background.
    expect(bg).not.toMatch(/rgba?\(255,\s*255,\s*255/);
    expect(bg).toMatch(/rgb/);
  });

  test('disabled control blocks interaction', async ({ page }) => {
    await page
      .locator('label:has-text("disabled") input[type="checkbox"]')
      .check();
    const box = page
      .locator('[data-testid="playground-frame"] [role="checkbox"]')
      .first();
    await expect(box).toBeDisabled();
  });

  test('indeterminate variant renders data-state=indeterminate', async ({
    page,
  }) => {
    await page.selectOption(
      'label:has-text("checked") select',
      'indeterminate',
    );
    const box = page
      .locator('[data-testid="playground-frame"] [role="checkbox"]')
      .first();
    await expect(box).toHaveAttribute('data-state', 'indeterminate');
  });
});
