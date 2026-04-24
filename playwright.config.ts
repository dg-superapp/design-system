import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright runner config — Phase 3 Wave 0.
 *
 * Runs against the *built* registry host (static export in `out/`) served
 * via `npx serve`. We don't use `next dev`: the host ships as a pure
 * GitHub-Pages static site, so dev-mode rewrites/SSR wouldn't represent
 * what consumers see. Two projects — Desktop Chrome and Pixel 5 — cover
 * the WCAG AA desktop + 375×812 mobile envelopes called out in 3-CONTEXT
 * D-13 (playground mobile-viewport toggle) and constraints (touch targets).
 *
 * Visual-diff threshold 0.15 matches RESEARCH §"Pattern 7" — loose enough
 * to absorb font-hinting jitter between Linux CI and local Windows/macOS,
 * tight enough to catch real color/layout regressions.
 *
 * webServer timeout = 180s — `pnpm build` runs `shadcn build && next build`
 * and typically needs 40–80s on CI plus serve spin-up.
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3030',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: { threshold: 0.15 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm build && npx serve out -l 3030',
    url: 'http://localhost:3030',
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
