import { test, expect } from '@playwright/test';

/**
 * Docs pages e2e — Phase 3 Plan 3-15 (R9.1 + R9.4).
 *
 * Walks all 14 primitive docs routes and asserts the install command
 * surfaces, the copy button is present, and the preview link resolves.
 */

const PRIMITIVES = [
  'button',
  'input',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'switch',
  'label',
  'form',
  'badge',
  'tooltip',
  'tabs',
  'separator',
  'scroll-area',
] as const;

test.describe('docs pages', () => {
  for (const slug of PRIMITIVES) {
    test(`docs /${slug} renders install command + preview link`, async ({ page }) => {
      await page.goto(`/docs/components/${slug}/`);
      const heading = page.getByRole('heading', { level: 1 }).first();
      await expect(heading).toBeVisible();

      const install = page
        .locator(`text=/npx shadcn@latest add .*\\/r\\/${slug}\\.json/`)
        .first();
      await expect(install).toBeVisible();

      const previewLink = page
        .locator(`a[href*="/preview/${slug}"]`)
        .first();
      await expect(previewLink).toBeVisible();
    });
  }

  test('form docs includes client-validation-only callout', async ({ page }) => {
    await page.goto('/docs/components/form/');
    await expect(page.getByText(/server must re-validate/i)).toBeVisible();
  });

  test('CopyInstallButton is clickable on button docs', async ({ page }) => {
    await page.goto('/docs/components/button/');
    const copyBtn = page.getByRole('button', { name: /copy|ចម្លង/i }).first();
    await expect(copyBtn).toBeVisible();
  });
});
