#!/usr/bin/env node
// Visual-diff: computed colors on http://localhost:3000 vs reference swatch HTML.
// Threshold: per-channel max ΔRGB ≤ 3. Fails with exit 1 on any violation.
// Abort-on-detection-failure guard: if zero swatches detected on either side,
// exits 1 with a clear report of patterns tried (PLAN-CHECK polish).

import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_URL = process.env.VISUAL_DIFF_URL ?? "http://localhost:3000";
const THRESHOLD = Number(process.env.VISUAL_DIFF_THRESHOLD ?? 3);
const REPORT_PATH = resolve(__dirname, "visual-diff-report.json");

const REFERENCE_HTMLS = [
  "D:/sources/dgc-miniapp-design-system/project/preview/colors-primary.html",
  "D:/sources/dgc-miniapp-design-system/project/preview/colors-neutrals.html",
  "D:/sources/dgc-miniapp-design-system/project/preview/colors-semantic.html",
];

// Authoritative hex→token mapping. Mirrors registry/dgc-theme/theme.css
// and src/app/page.tsx. This is the contract: reference HTML supplies pixel
// values, page.tsx supplies the token label, theme.css drives the runtime.
const HEX_TO_TOKEN = {
  // primary (blue-*)
  "#EEF4FB": "blue-050",
  "#E3F2FD": "blue-100",
  "#42A5F5": "blue-400",
  "#2196F3": "blue-500",
  "#1E88E5": "blue-600",
  "#1565C0": "blue-700",
  "#1E4FB0": "blue-800",
  "#0D47A1": "blue-900",
  "#0A2A6B": "blue-950",
  // neutrals
  "#FFFFFF": "white",
  "#F5F7FA": "gray-050",
  "#EEEEEE": "gray-100",
  "#E0E0E0": "gray-200",
  "#BDBDBD": "gray-300",
  "#9E9E9E": "gray-400",
  "#757575": "gray-500",
  "#616161": "gray-600",
  "#424242": "gray-700",
  "#212121": "gray-900",
  "#121417": "gray-950",
  // semantic
  "#2E7D32": "success",
  "#E8F5E9": "success-bg",
  "#F9A825": "warning",
  "#FFF8E1": "warning-bg",
  "#C62828": "danger",
  "#FFEBEE": "danger-bg",
  "#0288D1": "info",
  "#E1F5FE": "info-bg",
};

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Bad hex: ${hex}`);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function parseCssRgb(str) {
  // "rgb(13, 71, 161)" or "rgba(13, 71, 161, 1)"
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(str);
  if (!m) return null;
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
}

function channelDelta(a, b) {
  return Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b));
}

async function collectReferenceSwatches() {
  // Parse every `background:#HEX` inline style found in the three HTMLs.
  // Map to token via HEX_TO_TOKEN. Ignore gradient swatches (they have commas).
  const triedPatterns = [
    `background:#RRGGBB inline style (case-insensitive)`,
    `HEX_TO_TOKEN mapping lookup`,
  ];
  const swatches = [];
  const seenHex = new Set();
  for (const file of REFERENCE_HTMLS) {
    const html = await readFile(file, "utf8");
    const matches = html.matchAll(/background:\s*(#[0-9A-Fa-f]{6})(?![0-9A-Fa-f])/g);
    for (const m of matches) {
      const hex = m[1].toUpperCase();
      if (seenHex.has(hex)) continue;
      seenHex.add(hex);
      const token = HEX_TO_TOKEN[hex];
      if (!token) continue; // unmapped (e.g. gradient anchors not on target page)
      swatches.push({ token, hex, source: file.split(/[\\/]/).pop() });
    }
  }
  if (swatches.length === 0) {
    console.error("[visual-diff] ABORT: zero reference swatches detected.");
    console.error("Patterns tried:");
    for (const p of triedPatterns) console.error("  - " + p);
    console.error("Reference files scanned:");
    for (const f of REFERENCE_HTMLS) console.error("  - " + pathToFileURL(f).href);
    process.exit(1);
  }
  return swatches;
}

async function collectTargetSwatches(page) {
  const triedSelectors = [`[data-token]`, `attribute-bound computed backgroundColor`];
  const rows = await page.$$eval("[data-token]", (nodes) =>
    nodes.map((n) => {
      // <figure data-token> is transparent; the colored square is a descendant.
      let bg = getComputedStyle(n).backgroundColor;
      if (bg === "rgba(0, 0, 0, 0)" || bg === "transparent") {
        const walker = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT);
        let cur = walker.nextNode();
        while (cur) {
          const c = getComputedStyle(cur).backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
            bg = c;
            break;
          }
          cur = walker.nextNode();
        }
      }
      return { token: n.getAttribute("data-token"), bg };
    }),
  );
  // Keep only color swatches — those whose token matches a color token.
  // Spacing/radii/shadow elements also carry data-token but are filtered here.
  if (rows.length === 0) {
    console.error("[visual-diff] ABORT: zero target swatches detected on " + TARGET_URL);
    console.error("Selectors tried:");
    for (const p of triedSelectors) console.error("  - " + p);
    process.exit(1);
  }
  return rows;
}

async function main() {
  console.log(`[visual-diff] target=${TARGET_URL} threshold=ΔRGB≤${THRESHOLD}`);
  const reference = await collectReferenceSwatches();
  console.log(`[visual-diff] detected ${reference.length} reference color swatches:`);
  for (const s of reference) console.log(`    - ${s.token.padEnd(14)} ${s.hex}  (${s.source})`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 30_000 });
    const targetRows = await collectTargetSwatches(page);
    const targetByToken = new Map(targetRows.map((r) => [r.token, r.bg]));
    console.log(`[visual-diff] detected ${targetRows.length} target [data-token] nodes`);

    const results = [];
    let failures = 0;
    let unmatched = 0;
    for (const ref of reference) {
      const computed = targetByToken.get(ref.token);
      if (!computed) {
        unmatched++;
        results.push({
          token: ref.token,
          expectedHex: ref.hex,
          status: "missing-on-target",
          source: ref.source,
        });
        continue;
      }
      const expected = hexToRgb(ref.hex);
      const got = parseCssRgb(computed);
      if (!got) {
        results.push({
          token: ref.token,
          expectedHex: ref.hex,
          computed,
          status: "unparseable",
          source: ref.source,
        });
        failures++;
        continue;
      }
      const delta = channelDelta(expected, got);
      const pass = delta <= THRESHOLD;
      if (!pass) failures++;
      results.push({
        token: ref.token,
        expectedHex: ref.hex,
        expectedRgb: expected,
        computedRgb: got,
        computed,
        maxChannelDelta: delta,
        status: pass ? "pass" : "fail",
        source: ref.source,
      });
    }

    const summary = {
      target: TARGET_URL,
      threshold: THRESHOLD,
      totalReference: reference.length,
      totalTarget: targetRows.length,
      matched: results.length - unmatched,
      unmatched,
      failures,
      timestamp: new Date().toISOString(),
      results,
    };
    await writeFile(REPORT_PATH, JSON.stringify(summary, null, 2));

    console.log("\n[visual-diff] results:");
    for (const r of results) {
      const tag =
        r.status === "pass"
          ? "PASS"
          : r.status === "missing-on-target"
            ? "MISS"
            : "FAIL";
      const delta = r.maxChannelDelta ?? "-";
      console.log(
        `  [${tag}] ${r.token.padEnd(14)} expected=${r.expectedHex} got=${r.computed ?? "(none)"} ΔRGB=${delta}`,
      );
    }
    console.log(
      `\n[visual-diff] matched=${summary.matched} unmatched=${unmatched} failures=${failures}`,
    );
    console.log(`[visual-diff] report → ${REPORT_PATH}`);

    if (failures > 0 || unmatched > 0) {
      console.error(
        `[visual-diff] FAIL: ${failures} over-threshold, ${unmatched} unmatched token(s).`,
      );
      process.exit(1);
    }
    console.log("[visual-diff] OK");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("[visual-diff] unexpected error:", err);
  process.exit(1);
});
