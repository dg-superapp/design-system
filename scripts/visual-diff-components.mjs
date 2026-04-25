#!/usr/bin/env node
// scripts/visual-diff-components.mjs — Phase 4 Wave 0
// Per-element ΔRGB visual diff vs legacy specimens at
// D:/sources/dgc-miniapp-design-system/project/preview/<item>.html
//
// Usage: node scripts/visual-diff-components.mjs --item app-header [--threshold 2]
// Env:   VISUAL_DIFF_THRESHOLD overrides --threshold (default 2)
//        DEV_SERVER overrides http://localhost:3000

import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { PNG } from 'pngjs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1] ?? true]);
    return acc;
  }, [])
);

const item = args.item;
if (!item) { console.error('--item <slug> required'); process.exit(2); }

const threshold = Number(process.env.VISUAL_DIFF_THRESHOLD ?? args.threshold ?? 2);
const devServer = process.env.DEV_SERVER ?? 'http://localhost:3000';
const legacyPath = `D:/sources/dgc-miniapp-design-system/project/preview/${item}.html`;
const liveUrl = `${devServer}/preview/${item}`;

if (!existsSync(legacyPath)) {
  console.log(`[SKIP] no legacy specimen for ${item} (looked at ${legacyPath})`);
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 412, height: 900 } });

// Render legacy (file://) — locate component root
await page.goto(`file://${legacyPath}`);
await page.waitForLoadState('networkidle');
const legacyShot = await page.screenshot({ fullPage: false });

// Render live preview (dev server)
await page.goto(liveUrl);
await page.waitForLoadState('networkidle');
const liveShot = await page.screenshot({ fullPage: false });

await browser.close();

// Decode + per-pixel ΔRGB
const legacyPng = PNG.sync.read(legacyShot);
const livePng = PNG.sync.read(liveShot);

if (legacyPng.width !== livePng.width || legacyPng.height !== livePng.height) {
  console.error(`[FAIL] dimension mismatch: legacy ${legacyPng.width}x${legacyPng.height} vs live ${livePng.width}x${livePng.height}`);
  process.exit(1);
}

let maxDelta = 0;
let failingPixels = 0;
const diff = new PNG({ width: legacyPng.width, height: legacyPng.height });
for (let y = 0; y < legacyPng.height; y++) {
  for (let x = 0; x < legacyPng.width; x++) {
    const i = (y * legacyPng.width + x) << 2;
    const dr = Math.abs(legacyPng.data[i] - livePng.data[i]);
    const dg = Math.abs(legacyPng.data[i + 1] - livePng.data[i + 1]);
    const db = Math.abs(legacyPng.data[i + 2] - livePng.data[i + 2]);
    const delta = Math.max(dr, dg, db);
    if (delta > maxDelta) maxDelta = delta;
    if (delta > threshold) {
      failingPixels++;
      diff.data[i] = 255; diff.data[i + 1] = 0; diff.data[i + 2] = 0; diff.data[i + 3] = 255;
    } else {
      diff.data[i] = legacyPng.data[i]; diff.data[i + 1] = legacyPng.data[i + 1]; diff.data[i + 2] = legacyPng.data[i + 2]; diff.data[i + 3] = 255;
    }
  }
}

const outDir = resolve('tests/visual/__diff__');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, `${item}.png`), PNG.sync.write(diff));

if (maxDelta > threshold) {
  console.error(`[FAIL] ${item}: maxΔRGB=${maxDelta} > threshold ${threshold} (${failingPixels} pixels failed)`);
  process.exit(1);
}
console.log(`[OK] ${item}: maxΔRGB=${maxDelta} ≤ ${threshold}`);
process.exit(0);
