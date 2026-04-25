import { test, expect } from '@playwright/test';

/**
 * SectionHeader e2e — Phase 4 Plan 4-02.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 1; URL resolves once
 * 04-09 wires the manifest + renderer barrel atomically.
 *
 * Covers:
 *   - Title renders as <h2> with bilingual default copy
 *   - Action-link computed color skews blue (--brand resolves to navy / sky)
 *   - Focus-visible shows non-empty box-shadow (--shadow-focus)
 *   - Hover adds text-decoration: underline
 */

test.describe('section-header', () => {
  test('title renders as h2', async ({ page }) => {
    await page.goto('/preview/section-header');
    await page.waitForSelector('h2', { state: 'visible' });
    const h2 = page.locator('h2').first();
    await expect(h2).toBeVisible();
    await expect(h2).toHaveText(/សេវាថ្មីៗ|Recent services/);
  });

  test('action link uses brand color (R5.3 + UI-SPEC §Color rule 5)', async ({ page }) => {
    await page.goto('/preview/section-header');
    await page.waitForSelector('h2', { state: 'visible' });
    const link = page.locator('header[role="banner"] a, h2 ~ a, a').first();
    await expect(link).toBeVisible();
    const color = await link.evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe('');
    expect(color).not.toMatch(/^rgb\(0,\s*0,\s*0\)$/);
    const m = color.match(/\d+/g);
    if (m && m.length >= 3) {
      const [r, g, b] = m.map(Number);
      expect(b).toBeGreaterThan(r);
    }
  });

  test('action link shows focus ring on focus-visible', async ({ page }) => {
    await page.goto('/preview/section-header');
    await page.waitForSelector('h2', { state: 'visible' });
    const link = page.locator('a').first();
    await link.focus();
    const ring = await link.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(ring).not.toBe('none');
    expect(ring).not.toBe('');
  });

  test('action link underlines on hover', async ({ page }) => {
    await page.goto('/preview/section-header');
    await page.waitForSelector('h2', { state: 'visible' });
    const link = page.locator('a').first();
    await link.hover();
    const decoration = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
    expect(decoration).toMatch(/underline/);
  });
});
