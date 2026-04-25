#!/usr/bin/env node
/**
 * Scratch-consumer smoke test.
 * Creates a throwaway Next.js 15 app, installs `dgc-theme` via shadcn CLI,
 * asserts the merged globals.css has the expected DGC tokens, builds the app,
 * adds `hello` component, and cleans up.
 *
 * Prereq: registry server serving http://localhost:3000/r/*.json
 *         (started externally via `pnpm start` or a static server on `out/`).
 *         We use `wait-on` to block until the registry endpoint is reachable.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REG = 'http://localhost:3000/r/dgc-theme.json';
const HELLO = 'http://localhost:3000/r/hello.json';
const START = Date.now();

const log = (m) => console.log(`[smoke] ${m}`);
const die = (m, code = 1) => {
  console.error(`[smoke] FAIL: ${m}`);
  process.exit(code);
};

function run(cmd, args, opts = {}) {
  log(`$ ${cmd} ${args.join(' ')}  (cwd=${opts.cwd || process.cwd()})`);
  const r = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: true,
    ...opts,
  });
  return r.status ?? 1;
}

// Piped variant: feeds stdin input (newline-terminated Enters to accept defaults).
function runPiped(cmd, args, stdinData, opts = {}) {
  log(`$ ${cmd} ${args.join(' ')}  (cwd=${opts.cwd || process.cwd()}) [piped]`);
  const r = spawnSync(cmd, args, {
    input: stdinData,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true,
    ...opts,
  });
  return r.status ?? 1;
}

// 1. wait-on registry endpoint
log('waiting for registry server via wait-on...');
const waitRc = run('npx', ['wait-on', '-t', '30000', REG]);
if (waitRc !== 0) die('registry server not running (wait-on timed out on ' + REG + ')');

// Also sanity-check with fetch
try {
  const res = await fetch(REG);
  if (res.status !== 200) die(`registry returned HTTP ${res.status} for ${REG}`);
  log(`registry OK: ${REG} -> 200`);
} catch (e) {
  die(`fetch failed: ${e.message}`);
}

// 2. temp dir
const TMP = mkdtempSync(join(tmpdir(), `dgc-consumer-smoke-${Date.now()}-`));
log(`temp: ${TMP}`);

let failed = false;
try {
  // 3. create-next-app
  const createStart = Date.now();
  const createRc = run(
    'pnpm',
    [
      'create',
      'next-app@15',
      'consumer',
      '--ts',
      '--tailwind',
      '--app',
      '--eslint',
      '--src-dir',
      '--import-alias',
      '"@/*"',
      '--use-pnpm',
      '--yes',
    ],
    { cwd: TMP },
  );
  if (createRc !== 0) die('create-next-app failed');
  log(`create-next-app done in ${((Date.now() - createStart) / 1000).toFixed(1)}s`);

  const consumer = join(TMP, 'consumer');

  // 4. shadcn init — fully non-interactive via `--defaults` (= next template + base-nova preset)
  // plus `-b radix` to answer the "Select a component library" prompt that `--yes` alone misses.
  const initStart = Date.now();
  const initRc = run(
    'pnpm',
    ['dlx', 'shadcn@latest', 'init', '--yes', '--defaults', '-b', 'radix', '--force'],
    { cwd: consumer },
  );
  if (initRc !== 0) die('shadcn init failed');
  log(`shadcn init done in ${((Date.now() - initStart) / 1000).toFixed(1)}s`);

  // 5. shadcn add dgc-theme
  const addThemeStart = Date.now();
  const addRc = run('pnpm', ['dlx', 'shadcn@latest', 'add', REG, '--yes', '--overwrite'], {
    cwd: consumer,
  });
  if (addRc !== 0) die('shadcn add dgc-theme failed');
  log(`shadcn add dgc-theme done in ${((Date.now() - addThemeStart) / 1000).toFixed(1)}s`);

  // 6. assert theme contents across globals.css + components/theme.css
  // shadcn registry:theme splits output: cssVars inline into globals.css,
  // arbitrary CSS (e.g. :lang(km) rule) ships as a separate theme file.
  const globalsPath = join(consumer, 'src/app/globals.css');
  const themePath = join(consumer, 'src/components/theme.css');
  if (!existsSync(globalsPath)) die(`globals.css not found at ${globalsPath}`);
  const globalsCss = readFileSync(globalsPath, 'utf8');
  const themeCss = existsSync(themePath) ? readFileSync(themePath, 'utf8') : '';
  const css = globalsCss + '\n/* --- theme.css --- */\n' + themeCss;

  const hslTriplet = /\d{1,3}\s\d{1,3}%\s\d{1,3}%/;
  const checks = [
    { name: '--brand token present', test: () => css.includes('--brand') },
    { name: '.dark selector present', test: () => css.includes('.dark') },
    { name: ':lang(km) cascade present', test: () => css.includes(':lang(km)') },
    { name: 'HSL triplet (e.g. 216 85% 34%)', test: () => hslTriplet.test(css) },
    {
      // Tailwind v4 @theme inline legitimately uses hsl(var(--token)) to
      // resolve bare HSL triplets into full colors. The actual pitfall is
      // a double wrap like hsl(hsl(var(...))) or cssVars values being
      // pre-wrapped in hsl() (then theme block double-wraps them).
      name: 'NO double hsl(hsl(...)) wrapping',
      test: () => !/hsl\(\s*hsl\(/.test(css),
    },
  ];

  for (const c of checks) {
    const ok = c.test();
    const status = ok ? 'PASS' : 'FAIL';
    // grep a matching line for context (best-effort)
    let hint = '';
    if (c.name.startsWith('NO raw') && !ok) {
      const m = css.split('\n').find((l) => l.includes('hsl(var(--'));
      hint = m ? ` <<< ${m.trim()}` : '';
    } else if (ok) {
      const needle =
        c.name === 'HSL triplet (e.g. 216 85% 34%)'
          ? (css.match(hslTriplet) || [''])[0]
          : c.name === '--brand token present'
            ? '--brand'
            : c.name === '.dark selector present'
              ? '.dark'
              : c.name === ':lang(km) cascade present'
                ? ':lang(km)'
                : '';
      const m = css.split('\n').find((l) => l.includes(needle));
      hint = m ? ` <<< ${m.trim().slice(0, 120)}` : '';
    }
    log(`[${status}] ${c.name}${hint}`);
    if (!ok) failed = true;
  }
  if (failed) die('globals.css assertions failed');

  // 7. pnpm build
  const buildStart = Date.now();
  const buildRc = run('pnpm', ['build'], { cwd: consumer });
  if (buildRc !== 0) die('pnpm build in consumer failed');
  log(`consumer pnpm build done in ${((Date.now() - buildStart) / 1000).toFixed(1)}s`);

  // 8. shadcn add hello — OPTIONAL, opt-in via SMOKE_WITH_HELLO=1
  //
  // Why optional: hello.json lists registryDependencies pointing to the
  // PROD dgc-theme URL. Pre-merge, prod does not yet serve dgc-theme, so
  // shadcn CLI cascades into a 404. Post-merge (Phase 2 merged to main,
  // CI deploys dgc-theme to prod) this step works end-to-end. R3.5 cascade
  // compliance is already verified by the registry-item.json grep in
  // prior tasks, so this is a belt-and-braces integration check.
  if (process.env.SMOKE_WITH_HELLO === '1') {
    const addHelloStart = Date.now();
    const helloRc = run('pnpm', ['dlx', 'shadcn@latest', 'add', HELLO, '--yes', '--overwrite'], {
      cwd: consumer,
    });
    if (helloRc !== 0) die('shadcn add hello failed');
    const helloPath = join(consumer, 'src/components/ui/hello.tsx');
    const helloPathAlt = join(consumer, 'components/ui/hello.tsx');
    const foundHello = existsSync(helloPath)
      ? helloPath
      : existsSync(helloPathAlt)
        ? helloPathAlt
        : null;
    if (!foundHello) die(`hello.tsx not found at ${helloPath} or ${helloPathAlt}`);
    const helloSrc = readFileSync(foundHello, 'utf8');
    if (!helloSrc.includes('bg-brand')) die(`hello.tsx missing 'bg-brand' (path=${foundHello})`);
    log(`[PASS] hello component present at ${foundHello} with bg-brand`);
    log(`shadcn add hello done in ${((Date.now() - addHelloStart) / 1000).toFixed(1)}s`);
  } else {
    log('[SKIP] shadcn add hello — requires prod dgc-theme to be live (post-merge). Set SMOKE_WITH_HELLO=1 to run.');
  }

  // 9. shadcn add primitives — OPTIONAL, opt-in via SMOKE_WITH_PRIMITIVES=1 (D-19).
  //
  // Phase 3 extension. Walks every entry from registry/items.manifest.ts,
  // invokes `shadcn add` for each `/r/<name>.json`, then re-runs `pnpm build`
  // against a scratch page that imports each primitive. Phase exit (3-17)
  // blocks until this is green.
  //
  // Wave 0: manifest is empty, so this is a no-op that proves the branch
  // compiles and scripts stay stable while primitive plans 01–14 are added.
  if (process.env.SMOKE_WITH_PRIMITIVES === '1') {
    const manifestPath = join(process.cwd(), 'registry/items.manifest.ts');
    if (!existsSync(manifestPath)) {
      die(`items.manifest.ts not found at ${manifestPath} — run Wave 0 first`);
    }
    const manifestSrc = readFileSync(manifestPath, 'utf8');
    // Extract the `name:` fields from the manifest entries. Tolerant regex —
    // Wave 0 manifest was empty; Phase 3 exit (3-17) requires all 14.
    // Match only top-level ManifestEntry `name:` (the first field inside each
     // entry object). Control entries inside `controls: [...]` start with
     // `kind:` before their `name:`, so the `\{` anchor excludes them.
    const names = [...manifestSrc.matchAll(/\{\s*name:\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
    if (names.length === 0) {
      log('[SKIP] SMOKE_WITH_PRIMITIVES=1 — manifest is empty (Wave 0). Plans 3-01..3-14 will populate it.');
    } else {
      // Phase 4 env-driven count (Pitfall 7 option 2): default 22 (full Phase 4
      // manifest). Use >= semantics so partial Phase 4 progress doesn't break CI.
      // Override via SMOKE_EXPECTED_COUNT env var (e.g. SMOKE_EXPECTED_COUNT=14
      // during Phase 4 build until all 22 entries land).
      const expected = Number(process.env.SMOKE_EXPECTED_COUNT ?? 22);
      if (names.length < expected) {
        die(
          `SMOKE_WITH_PRIMITIVES=1 expected at least ${expected} primitives in manifest, found ${names.length}: ${names.join(', ')}`,
        );
      }
      log(`[SMOKE_WITH_PRIMITIVES] installing ${names.length} primitives: ${names.join(', ')}`);
      // REG points at localhost:3000 (phase 2 default) but CI + playwright
      // use 3030. Honor either via SMOKE_REGISTRY_BASE override, else reuse
      // REG's origin so the hello step and primitives step stay aligned.
      const base =
        process.env.SMOKE_REGISTRY_BASE ||
        (REG.match(/^https?:\/\/[^/]+/) || [''])[0] ||
        'http://localhost:3000';
      for (const name of names) {
        const url = `${base}/r/${name}.json`;
        const rc = run('pnpm', ['dlx', 'shadcn@latest', 'add', url, '--yes', '--overwrite'], {
          cwd: consumer,
        });
        if (rc !== 0) die(`shadcn add ${name} failed (${url})`);
        // Assert the component source landed at either src/ or root alias.
        const compPathSrc = join(consumer, `src/components/ui/${name}.tsx`);
        const compPathRoot = join(consumer, `components/ui/${name}.tsx`);
        const found = existsSync(compPathSrc)
          ? compPathSrc
          : existsSync(compPathRoot)
            ? compPathRoot
            : null;
        if (!found) {
          die(`expected components/ui/${name}.tsx not found (checked ${compPathSrc} and ${compPathRoot})`);
        }
        log(`[PASS] ${name}.tsx installed at ${found}`);
      }
      const rebuildRc = run('pnpm', ['build'], { cwd: consumer });
      if (rebuildRc !== 0) die('consumer rebuild after primitive install failed');
      log(`[PASS] all ${names.length} primitives installed and consumer rebuilt`);
    }
  }
} catch (e) {
  failed = true;
  console.error('[smoke] unexpected error:', e);
} finally {
  if (failed) {
    log(`KEEPING temp dir for inspection: ${TMP}`);
    process.exit(1);
  } else {
    try {
      rmSync(TMP, { recursive: true, force: true });
      log(`cleaned up ${TMP}`);
    } catch (e) {
      log(`cleanup warning: ${e.message}`);
    }
    log(`TOTAL: ${((Date.now() - START) / 1000).toFixed(1)}s — all checks PASS`);
    process.exit(0);
  }
}
