import { expect, test } from '@playwright/test';

/**
 * Playwright boot smoke — proves `pnpm test:e2e` wires up correctly.
 *
 * Navigates to `/` (the registry host landing page from Phase 2) and
 * asserts a 2xx response + a non-empty <body>. Real per-primitive e2e
 * specs land in plans 3-01..3-14.
 */
test('landing page boots', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).not.toBeNull();
  expect(response!.status()).toBeLessThan(400);
  await expect(page.locator('body')).not.toBeEmpty();
});
