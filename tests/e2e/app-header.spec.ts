import { test, expect } from '@playwright/test';

/**
 * AppHeader e2e — Phase 4 Plan 4-01.
 *
 * Pre-04-09 note: spec FILE compiles + commits in Wave 1; `/preview/app-header`
 * URL resolves once Wave 6 (04-09) wires manifest + renderer barrel.
 *
 * Covers:
 *   - 44×44 minimum hit area (R5.1, R10.3)
 *   - 2-trailing-icon cluster auto-sizes right column ≥ 96px (D-07, UI-SPEC Gap #8)
 *   - Focus-visible ring contains white RGB on navy gradient (Pitfall 9)
 */

test.describe('app-header', () => {
  test('icon buttons are 44×44 minimum (R5.1 R10.3)', async ({ page }) => {
    await page.goto('/preview/app-header');
    await page.waitForSelector('[data-app-header-icon]', { state: 'visible' });
    const buttons = page.locator('[data-app-header-icon]');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('2 trailing icons auto-size right column ≥ 96px (D-07 Gap #8)', async ({ page }) => {
    await page.goto('/preview/app-header');
    await page.waitForSelector('header[role="banner"]', { state: 'visible' });
    await page.getByLabel('Show badge cluster').check();
    await page.waitForTimeout(100);
    const trailing = page.locator('header[role="banner"] > div').last();
    const buttons = trailing.locator('[data-app-header-icon]');
    expect(await buttons.count()).toBeGreaterThanOrEqual(2);
    const box = await trailing.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(96);
  });

  test('focus-visible shows white ring on navy (Pitfall 9)', async ({ page }) => {
    await page.goto('/preview/app-header');
    await page.waitForSelector('[data-app-header-icon]', { state: 'visible' });
    const firstBtn = page.locator('[data-app-header-icon]').first();
    await firstBtn.focus();
    const ring = await firstBtn.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(ring).toMatch(/255,\s*255,\s*255/);
  });
});
