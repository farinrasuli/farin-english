// node tools/shots.mjs [shots...] -> shots/<shot>.png at 390x844 (muted headless Chrome, one browser at a time)
import { createRequire } from 'module'; import path from 'path'; import fs from 'fs'; import { fileURLToPath, pathToFileURL } from 'url';
const require = createRequire('D:/farin/FEschool/social/tools/package.json');
const puppeteer = require('puppeteer');
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const list = process.argv.slice(2).length ? process.argv.slice(2) : ['intro', 'tin', 'dial', 'bake', 'done'];
fs.mkdirSync(path.join(D, 'shots'), { recursive: true });
const b = await puppeteer.launch({ headless: 'new', args: ['--mute-audio', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=user-gesture-required'] });
for (const s of list) {
  const [name, extra = ''] = s.split('+');
  const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warn') console.log('  [' + name + ']', m.text()); });
  p.on('pageerror', e => console.log('  [' + name + '] PAGEERROR', e.message));
  await p.goto(pathToFileURL(path.join(D, 'demo.html')).href + '?mute=1&shot=' + name + extra, { waitUntil: 'load' });
  await p.waitForFunction('window.__ready === true', { timeout: 30000 }).catch(() => console.log('  not ready', name));
  await new Promise(r => setTimeout(r, name === 'done' ? 1400 : 1900));
  await p.screenshot({ path: path.join(D, 'shots', name + '.png') }); console.log('shot', name); await p.close();
}
await b.close();
