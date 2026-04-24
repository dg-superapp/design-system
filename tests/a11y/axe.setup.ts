import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/**
 * Shared axe-core runner for every a11y test (3-CONTEXT D-16).
 *
 * Usage from a spec:
 *   import { runAxe } from '../a11y/axe.setup';
 *   test('a11y — button preview', async ({ page }) => {
 *     await page.goto('/preview/button');
 *     const results = await runAxe(page);
 *     expect(results.violations).toEqual([]);
 *   });
 *
 * Tags `wcag2a` + `wcag2aa` match the PROJECT constraint (WCAG AA).
 * We intentionally omit `best-practice` so axe rules that are advisory
 * don't fail CI. Phase 5/6 may extend with `wcag21aa` once evaluated.
 */
export async function runAxe(page: Page) {
  return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
}
