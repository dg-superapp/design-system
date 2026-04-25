import { test, expect } from '@playwright/test';

/**
 * MiniAppHome e2e — Phase 4 Plan 4-08 (EXIT GATE).
 *
 * Targets the dogfood route at /preview/miniapp-home.
 *
 * Covers:
 *   - Composed block renders all sub-elements (Phase 4 exit gate)
 *   - Khmer in AppHeader title does not clip (R10 + Pitfall 3)
 *   - Tiles have aria-labels (R10.1)
 *   - Dark mode flip leaves no broken styles
 */

test.describe('miniapp-home (Phase 4 exit gate)', () => {
  test('composed block renders all sub-elements', async ({ page }) => {
    await page.goto('/preview/miniapp-home');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('section[aria-roledescription="carousel"]')).toBeVisible();
    expect(await page.locator('h2').count()).toBeGreaterThanOrEqual(2);

    const tiles = page.locator('[role="list"][class*="grid-cols-3"] [role="listitem"]');
    expect(await tiles.count()).toBe(6);

    await expect(page.getByText('ការបន្តអាជ្ញាប័ណ្ណ').first()).toBeVisible();
  });

  test('Khmer in AppHeader title does not clip (R10 + Pitfall 3)', async ({ page }) => {
    await page.goto('/preview/miniapp-home');
    await page.waitForLoadState('networkidle');
    const title = page.locator('[data-testid="app-header-title"]');
    const dims = await title.evaluate((el: HTMLElement) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));
    expect(dims.scrollHeight).toBeLessThanOrEqual(dims.clientHeight);
  });

  test('all tiles have aria-label for screen readers (R10.1)', async ({ page }) => {
    await page.goto('/preview/miniapp-home');
    await page.waitForLoadState('networkidle');
    const tiles = page.locator('[role="listitem"]');
    const count = await tiles.count();
    for (let i = 0; i < count; i++) {
      const label = await tiles.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label!.length).toBeGreaterThan(2);
    }
  });

  test('dark mode flip leaves no broken styles', async ({ page }) => {
    await page.goto('/preview/miniapp-home');
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(50);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });
});
