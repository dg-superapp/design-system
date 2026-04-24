import { test, expect } from '@playwright/test';

/**
 * Badge e2e — Phase 3 Plan 3-10, R4.10 (Visual Acceptance UI-SPEC §2.10).
 *
 * Asserts in a real browser:
 *   1. 4-tone gallery renders all four <span> badges.
 *   2. Each tone has a distinct background color (no two tones share).
 *   3. Pill shape: border-radius >= 999px / 50% resolved.
 *   4. Height 22px.
 *   5. Typography: 12px text, medium weight, line-height 1.
 *   6. No 5th tone exists in the playground (tone control options === 4).
 *   7. Icon toggle adds an <svg> inside the active badge.
 */

test.describe('badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/badge');
    await page.waitForSelector('[data-testid="badge-gallery"] span[data-tone]', {
      state: 'visible',
    });
  });

  test('4-tone gallery renders exactly 4 distinct bg colors', async ({ page }) => {
    const tones = ['default', 'success', 'warning', 'danger'] as const;
    const bgs: string[] = [];
    for (const t of tones) {
      const el = page.locator(`[data-testid="badge-gallery"] span[data-tone="${t}"]`);
      await expect(el).toBeVisible();
      const bg = await el.evaluate((node) => window.getComputedStyle(node).backgroundColor);
      bgs.push(bg);
    }
    // All four non-empty
    for (const bg of bgs) {
      expect(bg).toMatch(/rgb/);
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    }
    // All four distinct
    expect(new Set(bgs).size).toBe(4);
  });

  test('pill shape: border-radius >= 22px (>= half height so effectively pill)', async ({
    page,
  }) => {
    const badge = page
      .locator('[data-testid="badge-gallery"] span[data-tone="default"]')
      .first();
    const { radius, height } = await badge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        radius: parseFloat(cs.borderTopLeftRadius),
        height: parseFloat(cs.height),
      };
    });
    expect(height).toBeCloseTo(22, 0);
    // pill: radius >= half of height (for 22px that's >= 11; --radius-pill is 999px)
    expect(radius).toBeGreaterThanOrEqual(height / 2);
  });

  test('typography: 12px medium line-height 1', async ({ page }) => {
    const badge = page
      .locator('[data-testid="badge-gallery"] span[data-tone="success"]')
      .first();
    const styles = await badge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
      };
    });
    expect(styles.fontSize).toBe('12px');
    expect(['500', 'medium']).toContain(styles.fontWeight);
    // leading-none -> line-height: 1 => computed in px equals font-size
    expect(parseFloat(styles.lineHeight)).toBeCloseTo(12, 0);
  });

  test('playground tone control exposes EXACTLY 4 options (no 5th tone)', async ({
    page,
  }) => {
    const select = page.locator('label:has-text("tone") select').first();
    const options = await select.locator('option').allTextContents();
    // May include blank/placeholder — assert the tone set is exactly the 4
    const toneOpts = options.map((o) => o.trim()).filter((o) => o.length > 0);
    expect(new Set(toneOpts)).toEqual(
      new Set(['default', 'success', 'warning', 'danger']),
    );
    expect(toneOpts).not.toContain('info');
  });

  test('withIcon toggle renders an svg inside the active badge', async ({ page }) => {
    // Initially no icon
    const active = page.locator('[data-testid="badge-active"] span').first();
    await expect(active.locator('svg')).toHaveCount(0);
    // Toggle icon on
    await page.locator('label:has-text("withIcon") input[type="checkbox"]').check();
    await expect(active.locator('svg')).toHaveCount(1);
  });

  test('danger tone fg + bg both resolve to non-transparent distinct colors', async ({
    page,
  }) => {
    const el = page.locator('[data-testid="badge-gallery"] span[data-tone="danger"]');
    const { bg, fg } = await el.evaluate((node) => {
      const cs = window.getComputedStyle(node);
      return { bg: cs.backgroundColor, fg: cs.color };
    });
    expect(bg).toMatch(/rgb/);
    expect(fg).toMatch(/rgb/);
    expect(bg).not.toBe(fg);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });
});
