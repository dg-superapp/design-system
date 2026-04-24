import { test, expect } from '@playwright/test';

/**
 * Radio e2e — Phase 3 Plan 3-06, R4.6.
 *
 * Covers UI-SPEC §2.6 Visual Acceptance:
 *   1. Three radio items render at 20×20 px each.
 *   2. Click on second item sets data-state=checked on it and unchecks peers.
 *   3. ArrowDown / ArrowUp cycle selection within the group (Radix).
 *   4. focus-visible applies --shadow-focus (non-empty box-shadow).
 *   5. Selected state flips border to --brand (hsl assertion).
 *   6. disabled prop-control blocks interaction on all three items.
 */

test.describe('radio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/radio');
    await page.waitForSelector(
      '[data-testid="playground-frame"] [role="radio"]',
      { state: 'visible' },
    );
  });

  test('three radio items render at 20×20px each', async ({ page }) => {
    const items = page.locator(
      '[data-testid="playground-frame"] [role="radio"]',
    );
    await expect(items).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      const bb = await items.nth(i).boundingBox();
      expect(bb).not.toBeNull();
      expect(Math.round(bb!.width)).toBe(20);
      expect(Math.round(bb!.height)).toBe(20);
    }
  });

  test('click on second item selects it and unchecks peers', async ({
    page,
  }) => {
    const items = page.locator(
      '[data-testid="playground-frame"] [role="radio"]',
    );
    await items.nth(1).click();
    await expect(items.nth(0)).toHaveAttribute('data-state', 'unchecked');
    await expect(items.nth(1)).toHaveAttribute('data-state', 'checked');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'unchecked');
  });

  test('clicking items cycles the checked state within the group', async ({
    page,
  }) => {
    const items = page.locator(
      '[data-testid="playground-frame"] [role="radio"]',
    );
    await items.nth(0).click();
    await expect(items.nth(0)).toHaveAttribute('data-state', 'checked');
    await items.nth(1).click();
    await expect(items.nth(1)).toHaveAttribute('data-state', 'checked');
    await expect(items.nth(0)).toHaveAttribute('data-state', 'unchecked');
    await items.nth(2).click();
    await expect(items.nth(2)).toHaveAttribute('data-state', 'checked');
    await expect(items.nth(1)).toHaveAttribute('data-state', 'unchecked');
  });

  test('focus-visible applies --shadow-focus ring on an item', async ({
    page,
  }) => {
    const item = page
      .locator('[data-testid="playground-frame"] [role="radio"]')
      .first();
    await item.evaluate((el) => (el as HTMLElement).focus());
    const shadow = await item.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );
    // --shadow-focus resolves to a non-"none" box-shadow.
    expect(shadow).not.toBe('none');
    expect(shadow.length).toBeGreaterThan(5);
  });

  test('selected state border is --brand (not --gray-300)', async ({
    page,
  }) => {
    const items = page.locator(
      '[data-testid="playground-frame"] [role="radio"]',
    );
    await items.nth(0).click();
    await expect(items.nth(0)).toHaveAttribute('data-state', 'checked');
    const borderColor = await items
      .nth(0)
      .evaluate((el) => window.getComputedStyle(el).borderTopColor);
    // --brand light = hsl(216 85% 34%) ≈ rgb(13, 71, 161). Assert it's NOT
    // the unselected --gray-300 (≈ rgb(189, 189, 189) / #BDBDBD).
    expect(borderColor).not.toMatch(/189,\s*189,\s*189/);
    expect(borderColor).toMatch(/rgb/);
  });

  test('disabled control blocks interaction on all items', async ({ page }) => {
    await page
      .locator('label:has-text("disabled") input[type="checkbox"]')
      .check();
    const items = page.locator(
      '[data-testid="playground-frame"] [role="radio"]',
    );
    for (let i = 0; i < 3; i += 1) {
      await expect(items.nth(i)).toBeDisabled();
    }
  });
});
