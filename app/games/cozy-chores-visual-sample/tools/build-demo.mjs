// node tools/build-demo.mjs -> demo.html: one file that opens from disk (file://): game + layout + art (data URIs) + PixiJS inlined.
// PixiJS stays lazy: it sits as inert text and is only evaluated when the game module asks for it.
import fs from 'fs'; import path from 'path';
import { fileURLToPath } from 'url';
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = (f) => fs.readFileSync(path.join(D, f), 'utf8');
const layout = r('layout.js').replace('export const LAYOUT =', 'window.__LAYOUT =');
const art = {};
for (const f of fs.readdirSync(path.join(D, 'art'))) if (f.endsWith('.webp')) art[f.slice(0, -5)] = 'data:image/webp;base64,' + fs.readFileSync(path.join(D, 'art', f)).toString('base64');
const pixi = r('vendor/pixi-8.22.0.mjs');
if (/<\/script/i.test(pixi) || /<\/script/i.test(r('game.js'))) throw new Error('</script in source');
const html = r("dev.html").replace('<script type="module" src="./game.js"></script>', () =>
  `<script type="text/plain" id="pixi-src">${pixi}</script>\n<script>${layout}\nwindow.__ART=${JSON.stringify(art)};window.__PIXI_SRC='pixi-src';</script>\n<script type="module">\n${r('game.js')}\n</script>`);
fs.writeFileSync(path.join(D, 'demo.html'), html);
console.log('demo.html', (fs.statSync(path.join(D, 'demo.html')).size / 1024).toFixed(0) + ' KB,', Object.keys(art).length, 'art files');
