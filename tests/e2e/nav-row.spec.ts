import { test, expect } from '@playwright/test';

/**
 * NavRow e2e — Phase 4 Plan 4-03.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 1; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 *
 * Covers:
 *   - 48px min-height (R5.6 + R10.3 touch)
 *   - Active stripe paints at left edge full row height (Pitfall 6)
 *   - Trailing variants: chevron SVG, count badge with aria-label, switch role
 */

test.describe('nav-row', () => {
  test('48px min-height (R5.6 + R10.3 touch)', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.waitForLoadState('networkidle');
    const row = page.locator('div').filter({ hasText: 'ការជូនដំណឹង' }).first();
    const box = await row.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(48);
  });

  test('active stripe paints at left edge full row height (Pitfall 6)', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Active state').check();
    await page.waitForTimeout(50);
    const row = page.locator('[class*="before:"]').first();
    const stripe = await row.evaluate((el) => {
      const s = getComputedStyle(el, '::before');
      return { width: s.width, height: s.height, left: s.left, content: s.content };
    });
    expect(stripe.content).not.toBe('none');
    expect(stripe.width).toBe('3px');
    const rowBox = await row.boundingBox();
    expect(rowBox).not.toBeNull();
    expect(parseFloat(stripe.height)).toBeCloseTo(rowBox!.height, 0);
  });

  test('trailing chevron renders SVG', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.getByLabel('Trailing').selectOption('chevron');
    await page.waitForTimeout(50);
    const svgs = page.locator('svg[aria-hidden="true"]');
    expect(await svgs.count()).toBeGreaterThan(0);
  });

  test('trailing count renders aria-labeled badge', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.getByLabel('Trailing').selectOption('count');
    await page.waitForTimeout(50);
    const badge = page.locator('[aria-label*="new"]');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('3');
  });

  test('trailing switch slot renders Phase 3 Switch (D-05 escape hatch)', async ({ page }) => {
    await page.goto('/preview/nav-row');
    await page.getByLabel('Trailing').selectOption('switch');
    await page.waitForTimeout(50);
    await expect(page.locator('[role="switch"]')).toBeVisible();
  });
});
