/**
 * Post-build guard. Fails the build if any unresolved template token or
 * obviously broken href reaches the output HTML.
 *
 * Why this exists: a June bug once emitted `{{AFFILIATE:provider:slug}}` as a
 * literal href, so Google crawled a batch of junk URLs like
 * /lake-district/cottages/{{AFFILIATE:sykes:fell-foot}}. The bug was fixed long
 * ago and those URLs now 404 correctly — but it has since been re-reported
 * twice from Search Console crawl data, each time costing an investigation to
 * establish that the live site was clean. This turns that question into
 * something the build answers by itself.
 *
 * Runs automatically after `npm run build`.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not .pathname — the project path contains spaces, which
// .pathname would hand back percent-encoded.
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

/** Patterns that must never appear in built HTML. */
const FORBIDDEN = [
  { name: 'unresolved affiliate token', re: /\{\{AFFILIATE:/ },
  { name: 'url-encoded affiliate token', re: /%7B%7BAFFILIATE/i },
  { name: 'any unresolved handlebars-style token', re: /\{\{[A-Z_]+:/ },
  { name: 'literal "undefined" in an href', re: /href="[^"]*undefined[^"]*"/ },
];

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

let failures = 0;
let scanned = 0;

for await (const file of htmlFiles(DIST)) {
  scanned++;
  const html = await readFile(file, 'utf8');
  for (const { name, re } of FORBIDDEN) {
    const match = html.match(re);
    if (match) {
      // The 404 page carries an explanatory comment about the historic token
      // bug; an Astro comment never reaches the HTML, but guard anyway.
      failures++;
      console.error(`✗ ${name} in ${file.replace(DIST, '')} — found ${JSON.stringify(match[0])}`);
    }
  }
}

if (failures > 0) {
  console.error(`\nBuild check FAILED — ${failures} problem(s) across ${scanned} HTML files.`);
  process.exit(1);
}

console.log(`✓ Build check passed — ${scanned} HTML files, no unresolved tokens or broken hrefs.`);
