import { test, expect } from '@playwright/test';

/**
 * HeroBanner e2e — Phase 4 Plan 4-06.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 3; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 *
 * Covers:
 *   - Gradient + stipple overlay paint (R5.2, D-12)
 *   - Dot click changes active slide (D-10 controlled)
 *   - Inactive slides have inert + aria-hidden + tabIndex=-1 (Pattern 6 + A8)
 *   - Inner card variant is opaque (Pitfall 5)
 *   - Active dot is 18×8, inactive is 8×8 (UI-SPEC Gap #7)
 */

test.describe('hero-banner', () => {
  test('gradient + stipple overlay paint (R5.2)', async ({ page }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForLoadState('networkidle');
    const banner = page.locator('section[role="region"][aria-roledescription="carousel"]');
    await expect(banner).toBeVisible();
    const bg = await banner.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bg).toContain('linear-gradient');
    const stipple = banner.locator('div[aria-hidden="true"]').first();
    const stippleBg = await stipple.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(stippleBg).toContain('radial-gradient');
  });

  test('clicking a dot changes active slide (D-10 controlled)', async ({ page }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForLoadState('networkidle');
    const dots = page.locator('section[aria-roledescription="carousel"] button');
    expect(await dots.count()).toBeGreaterThanOrEqual(2);
    await dots.nth(1).click();
    await page.waitForTimeout(50);
    const track = page.locator('section[aria-roledescription="carousel"] > div').nth(1);
    const transform = await track.evaluate(
      (el) => (el as HTMLElement).style.transform || getComputedStyle(el).transform,
    );
    expect(transform).toMatch(/translateX\(-100%\)|matrix.*-1/);
  });

  test('inactive slides have inert + aria-hidden + tabIndex=-1 (Pattern 6 + A8)', async ({
    page,
  }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForLoadState('networkidle');
    const slides = page.locator('[aria-roledescription="slide"]');
    const inactive = slides.nth(1);
    await expect(inactive).toHaveAttribute('aria-hidden', 'true');
    const tabIndex = await inactive.evaluate((el) => (el as HTMLElement).tabIndex);
    expect(tabIndex).toBe(-1);
    const inert = await inactive.evaluate((el) => el.hasAttribute('inert'));
    expect(inert).toBe(true);
  });

  test('inner card variant is opaque (Pitfall 5)', async ({ page }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Inner card variant').check();
    await page.waitForTimeout(50);
    const card = page
      .locator('[aria-roledescription="slide"][aria-hidden="false"] > div > div')
      .first();
    const bg = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
  });

  test('active dot is 18×8 white pill, inactive is 8×8 (UI-SPEC Gap #7)', async ({ page }) => {
    await page.goto('/preview/hero-banner');
    await page.waitForLoadState('networkidle');
    const dots = page.locator('section[aria-roledescription="carousel"] button');
    const activeBox = await dots.nth(0).boundingBox();
    expect(activeBox?.width).toBeCloseTo(18, 0);
    expect(activeBox?.height).toBeCloseTo(8, 0);
    const inactiveBox = await dots.nth(1).boundingBox();
    expect(inactiveBox?.width).toBeCloseTo(8, 0);
    expect(inactiveBox?.height).toBeCloseTo(8, 0);
  });
});
