#!/usr/bin/env node
// Dogfood drift check: src/app/globals.css MUST match registry/dgc-theme/theme.css
// byte-for-byte after stripping the leading dogfood comment line.
// Exits 1 on drift. Used by CI (Task 10) and local `pnpm drift:check`.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const globalsPath = resolve(root, "src/app/globals.css");
const themePath = resolve(root, "registry/dgc-theme/theme.css");

const DOGFOOD_MARKER = /^\/\* DGC registry dogfood[^\n]*\*\/\r?\n/;

const globals = readFileSync(globalsPath, "utf8").replace(DOGFOOD_MARKER, "");
const theme = readFileSync(themePath, "utf8");

if (globals !== theme) {
  console.error(
    "DRIFT: src/app/globals.css diverged from registry/dgc-theme/theme.css.\n" +
      "Fix: cp registry/dgc-theme/theme.css src/app/globals.css && re-add dogfood comment.",
  );
  process.exit(1);
}

console.log("dogfood OK — globals.css == theme.css");
