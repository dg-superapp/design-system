// scripts/hex-to-hsl.mjs — reads source CSS, emits HSL triplet table
// Usage:
//   node scripts/hex-to-hsl.mjs <path-to-colors_and_type.css>    # print conversions
//   node scripts/hex-to-hsl.mjs --verify                         # golden-table check
// No dependencies. ESM. Emits bare HSL triplets (no hsl() wrapper — Pitfall 2).
import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";

// Golden table — locked HSL triplets for critical tokens. Source: RESEARCH.md mapping table.
// If the converter drifts on any of these, --verify exits 1.
const GOLDEN = [
  ["blue-900", "#0D47A1", "216 85% 34%"],
  ["blue-950", "#0A2A6B", "220 83% 23%"],
  ["blue-400", "#42A5F5", "207 90% 61%"],
  ["gray-050", "#F5F7FA", "216 33% 97%"],
  ["gray-900", "#212121", "0 0% 13%"],
  ["red-700", "#C62828", "0 66% 47%"],
  ["green-700", "#2E7D32", "123 46% 34%"],
  ["amber-700", "#F9A825", "37 95% 56%"],
  ["info-600", "#0288D1", "201 98% 41%"],
];

export function hexToHsl(hex) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  let hDeg = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hDeg = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hDeg = (b - r) / d + 2;
        break;
      case b:
        hDeg = (r - g) / d + 4;
        break;
    }
    hDeg *= 60;
  }
  return `${Math.round(hDeg)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function runVerify() {
  const drifts = [];
  for (const [name, hex, expected] of GOLDEN) {
    const actual = hexToHsl(hex);
    if (actual !== expected) {
      drifts.push(`  --${name}: expected '${expected}', got '${actual}' (from ${hex})`);
    }
  }
  if (drifts.length) {
    console.error("FAIL: HEX->HSL converter drift detected:");
    for (const d of drifts) console.error(d);
    exit(1);
  }
  console.log(`OK: golden table (${GOLDEN.length} entries) match.`);
}

function runConvert(path) {
  const src = readFileSync(path, "utf8");
  const rx = /--([a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{3,6})\s*;/g;
  let m;
  const rows = [];
  while ((m = rx.exec(src)) !== null) rows.push([m[1], m[2], hexToHsl(m[2])]);
  for (const [name, hex, hsl] of rows) {
    console.log(`  --${name}: ${hsl};  /* ${hex} */`);
  }
}

const arg = argv[2];
if (arg === "--verify") {
  runVerify();
} else {
  runConvert(arg ?? "project/colors_and_type.css");
}
