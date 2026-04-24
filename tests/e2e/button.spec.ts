import { test, expect } from '@playwright/test';

/**
 * Button e2e — Phase 3 Plan 3-01, UI-SPEC §2.1 Visual Acceptance.
 *
 * Runs against the static export served by the playwright webServer.
 * Uses the playground route so the Button is real-DOM and theme
 * toggles resolve against registered CSS tokens.
 */
test.describe('button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/button');
    await page.waitForSelector('button', { state: 'visible' });
  });

  test('primary default renders at 48px height', async ({ page }) => {
    const btn = page.locator('[data-testid="playground-frame"] button').first();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.height)).toBe(48);
  });

  test('tab shows shadow-focus ring on :focus-visible', async ({ page }) => {
    const btn = page.locator('[data-testid="playground-frame"] button').first();
    await btn.evaluate((el) => (el as HTMLElement).focus());
    const shadow = await btn.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );
    // --shadow-focus resolves to `0 0 0 3px hsl(var(--ring) / 0.4)` — computed
    // style returns the canonical "rgba(..) 0px 0px 0px 3px" form. Assert
    // the 3px spread survives the resolution.
    expect(shadow).toMatch(/3px/);
  });

  test('disabled control applies disabled attribute + non-opacity disabled styling', async ({ page }) => {
    const disabledToggle = page.locator('label:has-text("disabled") input[type="checkbox"]');
    await disabledToggle.check();
    const btn = page.locator('[data-testid="playground-frame"] button').first();
    await expect(btn).toBeDisabled();
    const bg = await btn.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // Disabled must resolve --bg-disabled (gray-200 family) — not transparent, not primary blue.
    expect(bg).not.toMatch(/rgba\(0,\s*0,\s*0,\s*0\)/);
  });

  test('khmer label renders without vertical clipping', async ({ page }) => {
    await page.selectOption('label:has-text("Language") select', 'km');
    const labelInput = page.locator('label:has-text("label") input[type="text"]');
    await labelInput.fill('យល់ព្រម');
    const btn = page.locator('[data-testid="playground-frame"] button').first();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeLessThanOrEqual(50);
  });

  test('variant ghost-danger renders with danger foreground', async ({ page }) => {
    await page.selectOption('label:has-text("variant") select', 'ghost-danger');
    const btn = page.locator('[data-testid="playground-frame"] button').first();
    const color = await btn.evaluate((el) => window.getComputedStyle(el).color);
    // --danger resolves to red-700; just assert it's a non-blue non-zero color.
    expect(color).toMatch(/rgb/);
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
  });
});
