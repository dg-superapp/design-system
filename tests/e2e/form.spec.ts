import { test, expect } from '@playwright/test';

/**
 * Form e2e — Phase 3 Plan 3-09.
 *
 * Exercises the playground `/preview/form` which renders an RHF+Zod
 * form with fullName (min 2 chars) + email (format) validation.
 *
 * Covers:
 *   1. Submit empty required → FormMessage visible with --danger color
 *      (rgb(199,40,40) / hsl(0 66% 47%)).
 *   2. Invalid input flips aria-invalid=true on the paired Input.
 *   3. Valid submission clears errors and the submitted line appears.
 *   4. aria-describedby on the Input points at the message id on error.
 *   5. FormMessage element uses aria-live="polite".
 *   6. forceInvalid control pre-fills invalid state on mount.
 */

// hsl(0 66% 47%) ≈ rgb(199, 41, 41). Allow 2-unit slop for browser rounding.
function dangerCloseEnough(color: string): boolean {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return false;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const near = (a: number, b: number) => Math.abs(a - b) <= 3;
  return near(r, 199) && near(g, 41) && near(b, 41);
}

test.describe('form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/form');
    await page.waitForSelector('[data-testid="playground-form"]', {
      state: 'visible',
    });
  });

  test('submit empty required field → FormMessage visible with --danger color', async ({
    page,
  }) => {
    // Clear initial fullName so submit fails on required.
    const nameInput = page.getByLabel('ឈ្មោះពេញ');
    await nameInput.fill('');
    const emailInput = page.getByLabel('អ៊ីមែល');
    await emailInput.fill('');
    await page
      .locator('[data-testid="playground-form-submit"]')
      .first()
      .click();
    const msg = page.getByText(/សូមបញ្ចូលឈ្មោះពេញ/);
    await expect(msg).toBeVisible();
    const color = await msg.evaluate(
      (el) => window.getComputedStyle(el).color,
    );
    expect(dangerCloseEnough(color)).toBe(true);
  });

  test('invalid field flips aria-invalid=true on the Input', async ({
    page,
  }) => {
    const nameInput = page.getByLabel('ឈ្មោះពេញ');
    await nameInput.fill('');
    await page
      .locator('[data-testid="playground-form-submit"]')
      .first()
      .click();
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('aria-describedby references the FormMessage id on error', async ({
    page,
  }) => {
    const nameInput = page.getByLabel('ឈ្មោះពេញ');
    await nameInput.fill('');
    await page
      .locator('[data-testid="playground-form-submit"]')
      .first()
      .click();
    const describedBy = await nameInput.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    // Message id is the last token (description + message).
    const tokens = (describedBy ?? '').split(/\s+/);
    const msgId = tokens.find((t) => t.endsWith('-form-item-message'));
    expect(msgId).toBeTruthy();
    const msgEl = page.locator(`#${msgId}`);
    await expect(msgEl).toBeVisible();
    await expect(msgEl).toHaveAttribute('aria-live', 'polite');
  });

  test('invalid email triggers its own FormMessage', async ({ page }) => {
    const nameInput = page.getByLabel('ឈ្មោះពេញ');
    const emailInput = page.getByLabel('អ៊ីមែល');
    await nameInput.fill('លី សុផាត');
    await emailInput.fill('not-an-email');
    await emailInput.blur();
    await page
      .locator('[data-testid="playground-form-submit"]')
      .first()
      .click({ force: true });
    await expect(page.getByText(/អ៊ីមែលមិនត្រឹមត្រូវ/)).toBeVisible({ timeout: 8000 });
  });

  test('valid submission clears errors and renders the Submitted line', async ({
    page,
  }) => {
    await page.getByLabel('ឈ្មោះពេញ').fill('លី សុផាត');
    await page.getByLabel('អ៊ីមែល').fill('sothy@example.com');
    await page
      .locator('[data-testid="playground-form-submit"]')
      .first()
      .click();
    await expect(
      page.locator('[data-testid="playground-form-submitted"]'),
    ).toBeVisible();
    await expect(page.getByText(/សូមបញ្ចូលឈ្មោះពេញ/)).toHaveCount(0);
    await expect(page.getByText(/អ៊ីមែលមិនត្រឹមត្រូវ/)).toHaveCount(0);
  });

  test('forceInvalid control pre-fills invalid state on mount', async ({
    page,
  }) => {
    await page
      .locator('label:has-text("Pre-fill as invalid") input[type="checkbox"]')
      .check();
    // After the flip, a fresh form instance mounts with invalid defaults
    // and triggers validation on mount → both messages should appear.
    await expect(page.getByText(/សូមបញ្ចូលឈ្មោះពេញ/)).toBeVisible();
    await expect(page.getByText(/អ៊ីមែលមិនត្រឹមត្រូវ/)).toBeVisible();
  });
});
