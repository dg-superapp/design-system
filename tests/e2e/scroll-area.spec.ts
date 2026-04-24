import { test, expect } from '@playwright/test';

test.describe('scroll-area', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/scroll-area');
    await page.waitForSelector('[data-testid="scroll-area-under-test"]', { state: 'visible' });
  });

  test('container height matches maxHeight control', async ({ page }) => {
    const sa = page.locator('[data-testid="scroll-area-under-test"]').first();
    const box = await sa.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.height)).toBe(240);
  });

  test('content overflows and is scrollable', async ({ page }) => {
    const viewport = page.locator('[data-testid="scroll-area-under-test"] [data-radix-scroll-area-viewport]').first();
    const overflow = await viewport.evaluate((el) => {
      return { client: el.clientHeight, scroll: el.scrollHeight };
    });
    expect(overflow.scroll).toBeGreaterThan(overflow.client);
  });

  test('scrollbar thumb is present in DOM when content overflows', async ({ page }) => {
    const sa = page.locator('[data-testid="scroll-area-under-test"]').first();
    await sa.hover();
    const thumb = page.locator('[data-testid="scroll-area-under-test"] [data-testid="scroll-area-thumb"]').first();
    await expect(thumb).toHaveCount(1);
  });

  test('aria-label set on region for screen-reader context', async ({ page }) => {
    const sa = page.locator('[data-testid="scroll-area-under-test"]').first();
    await expect(sa).toHaveAttribute('aria-label', /.+/);
  });
});
