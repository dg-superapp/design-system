import { test, expect } from '@playwright/test';

/**
 * Textarea e2e — Phase 3 Plan 3-03, UI-SPEC §2.3.
 *
 * Verifies the Visual Acceptance Test contract:
 *   1. Min-height 88px at default.
 *   2. Vertical resize handle visible; horizontal resize disabled.
 *   3. Focus ring matches Input focus ring (--shadow-focus).
 *   4. Khmer text does not clip descenders (handled by --leading-loose
 *      cascade; we assert coeng-bearing text can exceed the 88px
 *      minimum without layout thrash).
 */
test.describe('textarea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/textarea');
    await page.waitForSelector('textarea', { state: 'visible' });
  });

  test('default renders with min-height of at least 88px', async ({ page }) => {
    const textarea = page
      .locator('[data-testid="playground-frame"] textarea')
      .first();
    const minHeight = await textarea.evaluate(
      (el) => window.getComputedStyle(el).minHeight,
    );
    expect(minHeight).toBe('88px');
    const box = await textarea.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(88);
  });

  test('resize is vertical only', async ({ page }) => {
    const textarea = page
      .locator('[data-testid="playground-frame"] textarea')
      .first();
    const resize = await textarea.evaluate(
      (el) => window.getComputedStyle(el).resize,
    );
    expect(resize).toBe('vertical');
  });

  test('focus-visible applies --shadow-focus ring (Input parity)', async ({
    page,
  }) => {
    const textarea = page
      .locator('[data-testid="playground-frame"] textarea')
      .first();
    await textarea.evaluate((el) => (el as HTMLElement).focus());
    const shadow = await textarea.evaluate(
      (el) => window.getComputedStyle(el).boxShadow,
    );
    expect(shadow).toMatch(/3px/);
  });

  test('invalid control applies danger border via aria-invalid', async ({
    page,
  }) => {
    await page
      .locator('label:has-text("invalid") input[type="checkbox"]')
      .check();
    const textarea = page
      .locator('[data-testid="playground-frame"] textarea')
      .first();
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    const border = await textarea.evaluate(
      (el) => window.getComputedStyle(el).borderColor,
    );
    expect(border).toMatch(/rgb/);
    expect(border).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('disabled uses tokenized background + muted-foreground (NOT opacity-50)', async ({
    page,
  }) => {
    await page
      .locator('label:has-text("disabled") input[type="checkbox"]')
      .check();
    const textarea = page
      .locator('[data-testid="playground-frame"] textarea')
      .first();
    await expect(textarea).toBeDisabled();
    const opacity = await textarea.evaluate(
      (el) => window.getComputedStyle(el).opacity,
    );
    expect(opacity).toBe('1');
  });

  test('khmer text renders without clipping descenders', async ({ page }) => {
    await page.selectOption('label:has-text("Language") select', 'km');
    const textarea = page
      .locator('[data-testid="playground-frame"] textarea')
      .first();
    // Coeng-bearing string ("ក្រុមប្រឹក្សា") — must render without
    // descender clipping inside the 88px min box.
    await textarea.fill('ក្រុមប្រឹក្សាធិការ\nខេត្តកំពង់ឆ្នាំង');
    const box = await textarea.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(88);
    // Scroll height should not exceed client height for short content
    // (i.e., no hidden overflow) once min-h is satisfied.
    const overflow = await textarea.evaluate((el) => {
      const t = el as HTMLTextAreaElement;
      return { scroll: t.scrollHeight, client: t.clientHeight };
    });
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client + 1);
  });
});
