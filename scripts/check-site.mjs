import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const pages = ['/', '/privacy/', '/terms/', '/health-disclaimer/', '/support/', '/delete-account/', '/model-attribution/'];
const errors = [];

execFileSync(process.execPath, ['--check', path.join(root, 'site.js')], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', path.join(root, 'body-model.js')], { stdio: 'inherit' });

for (const route of pages) {
  const file = path.join(root, route.slice(1), 'index.html');
  if (!fs.existsSync(file)) { errors.push(`Missing page: ${route}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${route}: missing title`);
  if (!/<meta name="description"/.test(html)) errors.push(`${route}: missing description`);
  if (!/<h1[ >]/.test(html)) errors.push(`${route}: missing h1`);
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const [target, hash] = match[1].split('#');
    const local = target.endsWith('/') ? path.join(root, target.slice(1), 'index.html') : path.join(root, target.slice(1));
    if (!fs.existsSync(local)) { errors.push(`${route}: broken link ${match[1]}`); continue; }
    if (hash && !fs.readFileSync(local, 'utf8').includes(`id="${hash}"`)) errors.push(`${route}: missing anchor ${match[1]}`);
  }
  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    if (!html.includes(`id="${match[1]}"`)) errors.push(`${route}: missing anchor #${match[1]}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} routes, internal links, anchors, metadata and JavaScript syntax.`);
}
