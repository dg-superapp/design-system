import { test, expect } from '@playwright/test';

/**
 * SegmentedTabs e2e — Phase 4 Plan 4-04.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 2; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 *
 * Covers:
 *   - Radix tablist semantics (R5.4 + R10.3)
 *   - ArrowRight cycles focus (Radix default keyboard)
 *   - Active trigger paints brand color (UI-SPEC §Color rule 2)
 *   - Track uses --bg-surface-2 token (non-transparent, non-pure-white)
 */

test.describe('segmented-tabs', () => {
  test('Radix tablist semantics (R5.4 + R10.3)', async ({ page }) => {
    await page.goto('/preview/segmented-tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    await expect(page.getByRole('tablist')).toBeVisible();
    expect(await page.getByRole('tab').count()).toBeGreaterThanOrEqual(2);
  });

  test('ArrowRight cycles focus (Radix default keyboard)', async ({ page }) => {
    await page.goto('/preview/segmented-tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    const tabs = page.getByRole('tab');
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
  });

  test('active trigger paints brand color (UI-SPEC §Color rule 2)', async ({ page }) => {
    await page.goto('/preview/segmented-tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    const active = page.locator('[data-state="active"]').first();
    await expect(active).toBeVisible();
    const bg = await active.evaluate((el) => getComputedStyle(el).backgroundColor);
    const m = bg.match(/\d+/g);
    expect(m).toBeTruthy();
    if (m && m.length >= 3) {
      const [r, g, b] = m.slice(0, 3).map(Number);
      expect(b).toBeGreaterThan(r);
    }
  });

  test('track uses bg-surface-2 token', async ({ page }) => {
    await page.goto('/preview/segmented-tabs');
    await page.waitForSelector('[role="tablist"]', { state: 'visible' });
    const list = page.getByRole('tablist');
    const bg = await list.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });
});
