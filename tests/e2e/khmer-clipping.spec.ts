import { test, expect } from '@playwright/test';

/**
 * Khmer clipping visual-diff — Phase 3 Plan 3-16 (D-17).
 *
 * Captures a baseline screenshot of /test/khmer rendering all 14 primitives
 * under `<div lang="km">`. The suite fails if any future change causes a
 * coeng subscript (្ក ្ខ ្គ ្ឃ) to clip or descender spacing to regress.
 *
 * Baseline PNG lives in `khmer-clipping.spec.ts-snapshots/`. Regenerate
 * with `pnpm exec playwright test --update-snapshots --grep khmer`.
 */

test.describe('khmer clipping', () => {
  test('full-page baseline — all 14 primitives under lang=km', async ({ page }) => {
    await page.goto('/test/khmer/');
    // Deterministic paint: wait for the last primitive (ScrollArea) to mount.
    await page.waitForSelector('[role="list"], ul, [data-radix-scroll-area-viewport]', {
      state: 'visible',
      timeout: 10000,
    });
    // Small delay so Radix Tooltip + animations settle before snapshot.
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('khmer-test-page.png', {
      fullPage: true,
      threshold: 0.15,
      maxDiffPixelRatio: 0.05,
    });
  });
});
