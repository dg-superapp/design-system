import { test, expect } from '@playwright/test';

/**
 * StepIndicator e2e — Phase 4 Plan 4-05.
 *
 * Pre-04-09: spec FILE compiles + commits in Wave 2; URL resolves once
 * 04-09 wires manifest + renderer barrel.
 *
 * Covers:
 *   - Ordered list semantics (R5.5)
 *   - Active step has aria-current="step" (exactly one)
 *   - Connector after done step paints brand (UI-SPEC §Tokens)
 *   - Done step shows Check glyph instead of number (UI-SPEC §Variants matrix)
 */

test.describe('step-indicator', () => {
  test('renders ordered list with N steps (R5.5)', async ({ page }) => {
    await page.goto('/preview/step-indicator');
    await page.waitForLoadState('networkidle');
    const list = page.locator('ol');
    await expect(list).toBeVisible();
    const items = list.locator('li');
    expect(await items.count()).toBeGreaterThanOrEqual(3);
  });

  test('active step has aria-current="step" (exactly one)', async ({ page }) => {
    await page.goto('/preview/step-indicator');
    await page.waitForLoadState('networkidle');
    const active = page.locator('[aria-current="step"]');
    await expect(active).toBeVisible();
    expect(await active.count()).toBe(1);
  });

  test('connector after done step paints brand (UI-SPEC §Tokens)', async ({ page }) => {
    await page.goto('/preview/step-indicator');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/Active step index/i).fill('2');
    await page.waitForTimeout(50);
    const firstStep = page.locator('ol > li').nth(0);
    const connector = firstStep.locator('span[aria-hidden="true"]').last();
    const bg = await connector.evaluate((el) => getComputedStyle(el).backgroundColor);
    const m = bg.match(/\d+/g);
    expect(m).toBeTruthy();
    if (m && m.length >= 3) {
      const [r, g, b] = m.slice(0, 3).map(Number);
      expect(b).toBeGreaterThan(r);
    }
  });

  test('done step shows Check glyph instead of number', async ({ page }) => {
    await page.goto('/preview/step-indicator');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/Active step index/i).fill('2');
    await page.waitForTimeout(50);
    const firstStepCircle = page.locator('ol > li').nth(0).locator('div').first();
    const svg = firstStepCircle.locator('svg');
    expect(await svg.count()).toBe(1);
  });
});
