// Post-build: copy index.html to 404.html so static hosts that serve
// 404.html for unknown paths (e.g. GitHub Pages) still boot the SPA and
// let client-side routing take over.
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const index = join(dist, 'index.html');
const notFound = join(dist, '404.html');

if (existsSync(index)) {
  copyFileSync(index, notFound);
  console.log('postbuild: copied dist/index.html -> dist/404.html');
} else {
  console.warn('postbuild: dist/index.html not found; skipped 404.html');
}
