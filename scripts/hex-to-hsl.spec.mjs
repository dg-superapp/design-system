// scripts/hex-to-hsl.spec.mjs — self-contained spec for hex-to-hsl converter.
// Run: node scripts/hex-to-hsl.spec.mjs  (exits 0 on pass, 1 on fail)
import { strictEqual } from "node:assert";
import { hexToHsl } from "./hex-to-hsl.mjs";

const cases = [
  ["#0D47A1", "216 85% 34%"], // blue-900 — DGC primary CTA
  ["#0A2A6B", "220 83% 23%"], // blue-950
  ["#42A5F5", "207 90% 61%"], // blue-400 — dark-mode primary
  ["#F5F7FA", "216 33% 97%"], // gray-050 — background
  ["#212121", "0 0% 13%"], // gray-900 — foreground
  ["#C62828", "0 66% 47%"], // red-700 — destructive
];

for (const [hex, expected] of cases) {
  const got = hexToHsl(hex);
  strictEqual(got, expected, `hexToHsl(${hex}) === ${expected} (got ${got})`);
}

// 3-digit shorthand coverage
strictEqual(hexToHsl("#fff"), "0 0% 100%", "3-digit shorthand #fff");
strictEqual(hexToHsl("#000"), "0 0% 0%", "3-digit shorthand #000");

console.log(`OK: ${cases.length + 2} spec assertions passed.`);
