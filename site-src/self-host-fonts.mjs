#!/usr/bin/env node
// Self-host the site's Google Fonts (OFL) under site/fonts/ so pages don't wait on a third-party,
// render-blocking stylesheet + two extra connections, and Persian visitors don't depend on Google's
// servers being reachable. Re-run only if the font families/weights change.
//
//   node site-src/self-host-fonts.mjs
//
// Writes site/fonts/{tr,fa}.css + the .woff2 files they reference. Keeps only the subsets the site
// needs: latin + latin-ext for TR/EN (ğ ş ı İ), arabic + latin for FA.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../site/fonts');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const SETS = {
  tr: { url: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&family=Caveat:wght@600;700&display=swap', keep: ['latin', 'latin-ext'] },
  fa: { url: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap', keep: ['arabic', 'latin'] },
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, set] of Object.entries(SETS)) {
  const css = await (await fetch(set.url, { headers: { 'user-agent': UA } })).text();
  const blocks = [...css.matchAll(/\/\* ([a-z-]+) \*\/\s*(@font-face\s*{[^}]*})/g)].filter((m) => set.keep.includes(m[1]));
  if (!blocks.length) throw new Error(name + ': no @font-face blocks (Google CSS format changed?)');
  const files = new Map();
  let out = `/* self-hosted by site-src/self-host-fonts.mjs (SIL Open Font License); subsets: ${set.keep.join(', ')} */\n`;
  for (const [, subset, block] of blocks) {
    const family = block.match(/font-family:\s*'([^']+)'/)[1];
    const remote = block.match(/url\((https:[^)]+\.woff2)\)/)[1];
    if (!files.has(remote)) files.set(remote, `${family.toLowerCase().replace(/\s+/g, '-')}-${subset}.woff2`);
    out += `/* ${subset} */\n` + block.replace(remote, '/fonts/' + files.get(remote)) + '\n';
  }
  for (const [remote, local] of files) {
    const buf = Buffer.from(await (await fetch(remote, { headers: { 'user-agent': UA } })).arrayBuffer());
    if (buf.subarray(0, 4).toString() !== 'wOF2') throw new Error('not a woff2: ' + remote);
    fs.writeFileSync(path.join(OUT, local), buf);
    console.log(`${name}: ${local} ${Math.round(buf.length / 1024)} KB`);
  }
  fs.writeFileSync(path.join(OUT, name + '.css'), out);
  console.log(`${name}.css: ${blocks.length} @font-face, ${files.size} files`);
}
