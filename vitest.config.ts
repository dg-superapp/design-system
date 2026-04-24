import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Vitest config — Phase 3 Wave 0.
 *
 * happy-dom is lighter than jsdom and sufficient for primitive unit
 * tests (Label required-asterisk color, Separator ARIA role, Badge tone
 * classes). @testing-library/jest-dom extends expect() with DOM matchers.
 *
 * `@` alias mirrors tsconfig.json paths so tests can `import from '@/...'`.
 *
 * Tests live at tests/unit/**. Playwright e2e + a11y live at tests/e2e/**
 * and are excluded here — vitest would try to load them and fail on
 * @playwright/test imports in the unit-test runtime.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'out', '.next', 'tests/e2e/**', 'tests/a11y/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
