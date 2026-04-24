import { test, expect } from '@playwright/test';

/**
 * Separator e2e — Phase 3 Plan 3-13, R4.13.
 *
 * Drives /preview/separator and asserts the UI-SPEC §2.13 contract at
 * computed-style level (JSDom cannot reach Tailwind's generated CSS —
 * these specs are authoritative for the 1px + --border invariants).
 */

test.describe('separator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/separator');
    await page.waitForSelector('[data-testid="separator-under-test"]', {
      state: 'visible',
    });
  });

  test('horizontal renders as 1px tall, full-width', async ({ page }) => {
    const sep = page.locator('[data-testid="separator-under-test"]').first();
    const demo = page.locator('[data-testid="separator-demo"]').first();
    const sepBox = await sep.boundingBox();
    const demoBox = await demo.boundingBox();
    expect(sepBox).not.toBeNull();
    expect(demoBox).not.toBeNull();
    expect(sepBox!.height).toBe(1);
    expect(sepBox!.width).toBeGreaterThan(0);
    expect(Math.round(sepBox!.width)).toBe(Math.round(demoBox!.width));
  });

  test('vertical renders as 1px wide, full-height', async ({ page }) => {
    await page.selectOption('label:has-text("orientation") select', 'vertical');
    const sep = page.locator('[data-testid="separator-under-test"]').first();
    await sep.waitFor({ state: 'visible' });
    const box = await sep.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBe(1);
    expect(box!.height).toBeGreaterThan(1);
  });

  test('background color resolves to --border token', async ({ page }) => {
    const sep = page.locator('[data-testid="separator-under-test"]').first();
    const [bg, expected] = await sep.evaluate((el) => {
      const computed = window.getComputedStyle(el).backgroundColor;
      const probe = document.createElement('div');
      probe.style.color = 'hsl(var(--border))';
      document.body.appendChild(probe);
      const want = window.getComputedStyle(probe).color;
      probe.remove();
      return [computed, want];
    });
    expect(bg).toBe(expected);
    // sanity: not transparent, not black default
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('decorative=true (default) yields role="none"', async ({ page }) => {
    const sep = page.locator('[data-testid="separator-under-test"]').first();
    await expect(sep).toHaveAttribute('role', 'none');
  });

  test('decorative=false yields role=separator (+ aria-orientation on vertical)', async ({
    page,
  }) => {
    await page
      .locator('label:has-text("decorative") input[type="checkbox"]')
      .uncheck();
    const sep = page.locator('[data-testid="separator-under-test"]').first();
    await expect(sep).toHaveAttribute('role', 'separator');
    // Radix omits aria-orientation for horizontal (ARIA default).
    await page.selectOption('label:has-text("orientation") select', 'vertical');
    const vSep = page.locator('[data-testid="separator-under-test"]').first();
    await expect(vSep).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('data-orientation attribute reflects orientation prop', async ({
    page,
  }) => {
    const sep = page.locator('[data-testid="separator-under-test"]').first();
    await expect(sep).toHaveAttribute('data-orientation', 'horizontal');
    await page.selectOption('label:has-text("orientation") select', 'vertical');
    const vSep = page.locator('[data-testid="separator-under-test"]').first();
    await expect(vSep).toHaveAttribute('data-orientation', 'vertical');
  });
});
