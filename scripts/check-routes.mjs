import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appSrc = readFileSync(resolve(__dirname, '../src/App.jsx'), 'utf8');
const re = /lazy\(\s*\(\)\s*=>\s*import\(\s*["']([^"']+)["']\s*\)\s*\)/g;
let match;
const missing = [];

while ((match = re.exec(appSrc)) !== null) {
  const rel = match[1].replace(/^\.\//, '');
  const base = resolve(__dirname, '../src', rel);
  const found = ['.jsx', '.js', '/index.jsx', '/index.js'].some(
    (ext) => existsSync(base + ext) || existsSync(base.replace(/\.\w+$/, '') + ext)
  );
  if (!found) missing.push(match[1]);
}

if (missing.length) {
  console.error('\n❌ Missing lazy-loaded page files:');
  missing.forEach((m) => console.error(`   ${m}`));
  process.exit(1);
}
console.log(`✓ All lazy routes resolve to existing files.`);
