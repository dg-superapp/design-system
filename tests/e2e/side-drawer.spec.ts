import { test, expect } from '@playwright/test';

/**
 * SideDrawer e2e — Phase 4 Plan 4-07.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 4; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 *
 * Covers:
 *   - Radix Dialog ARIA (role=dialog, aria-modal, aria-labelledby)
 *   - ESC closes (Radix default)
 *   - Focus trap (Pattern 5 + R10.3)
 *   - First-open animation runs (Pitfall 2 — static class)
 *   - Reduced-motion zeros animation
 *   - Sign-out row paints destructive color (UI-SPEC §Color)
 */

test.describe('side-drawer', () => {
  test('Radix Dialog ARIA (R5.7 + R10.1)', async ({ page }) => {
    await page.goto('/preview/side-drawer');
    await page.waitForLoadState('networkidle');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('ESC closes the dialog (Radix default + R10.3)', async ({ page }) => {
    await page.goto('/preview/side-drawer');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveCount(0);
  });

  test('focus traps inside drawer (Pattern 5 + R10.3)', async ({ page }) => {
    await page.goto('/preview/side-drawer');
    await page.waitForLoadState('networkidle');
    const close = page.getByRole('button', { name: /Close menu/i });
    await expect(close).toBeFocused();
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
    }
    const focused = await page.evaluate(
      () => document.activeElement?.closest('[role="dialog"]') !== null,
    );
    expect(focused).toBe(true);
  });

  test('slide-in animation runs on first open (Pitfall 2)', async ({ page }) => {
    await page.goto('/preview/side-drawer');
    await page.waitForLoadState('networkidle');
    const content = page.locator('[role="dialog"]');
    const animationName = await content.evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toContain('drawer-slide-in');
  });

  test('reduced-motion zeros animation', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/preview/side-drawer');
    await page.waitForLoadState('networkidle');
    const content = page.locator('[role="dialog"]');
    const duration = await content.evaluate((el) => getComputedStyle(el).animationDuration);
    expect(['0s', '0.01s', '0ms', '0.01ms']).toContain(duration);
    await ctx.close();
  });

  test('sign out row paints destructive color (UI-SPEC §Color)', async ({ page }) => {
    await page.goto('/preview/side-drawer');
    await page.waitForLoadState('networkidle');
    const signOut = page.locator('[role="dialog"]').getByText('ចេញ').first();
    const color = await signOut.evaluate((el) => getComputedStyle(el).color);
    const m = color.match(/\d+/g);
    expect(m).toBeTruthy();
    if (m && m.length >= 3) {
      const [r, g, b] = m.slice(0, 3).map(Number);
      expect(r).toBeGreaterThan(g);
      expect(r).toBeGreaterThan(b);
    }
  });
});
