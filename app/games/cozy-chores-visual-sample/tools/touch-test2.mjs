// node tools/touch-test2.mjs -> tries the tin drag at phone (touch) and desktop (mouse) sizes, sound on, computes the tin's screen spot from layout
import { createRequire } from 'module'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const require = createRequire('D:/farin/FEschool/social/tools/package.json'); const puppeteer = require('puppeteer');
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); const W = (ms) => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new', args: ['--mute-audio', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const spot = (VW, VH) => { let pw = Math.min(VW - 16, 560); const ui = Math.max(232, VH * .28), ph = Math.min(VH - 58 - ui, pw * 1.6); if (VW >= 600) pw = Math.min(pw, ph * 864 * .84 / 1080); const px = (VW - pw) / 2; const s0 = Math.max(ph / 1080, pw / (864 * .84)), s = s0 * 1.02, ax = px + pw / 2, ay = 58 + ph / 2;
  const sc = (x, y) => [ax + (x - 432) * s, ay + (y - 603) * s]; return { tin: sc(600, 955), oven: sc(399, 600), s0 }; };
for (const [name, vw, vh, touch] of [['phone-touch', 390, 844, true], ['phone-small', 360, 640, true], ['desktop-mouse', 1280, 800, false], ['desktop-side-panel', 700, 900, false]]) {
  const p = await b.newPage(); await p.setViewport({ width: vw, height: vh, isMobile: touch, hasTouch: touch });
  const log = []; p.on('pageerror', e => log.push('PAGEERROR ' + e.message)); p.on('console', m => (m.type() === 'error' || m.text().startsWith('beat')) && log.push(m.text()));
  await p.goto(pathToFileURL(path.join(D, 'demo.html')).href);
  await p.waitForFunction('!!window.__autoTin', { timeout: 30000 }).catch(() => log.push('never reached drag')); await W(1200);
  const { tin, oven } = spot(vw, vh); const n = 12;
  if (touch) { const t = await p.touchscreen.touchStart(...tin); for (let i = 1; i <= n; i++) { await t.move(tin[0] + (oven[0] - tin[0]) * i / n, tin[1] + (oven[1] - tin[1]) * i / n); await W(30); } await t.end(); }
  else { await p.mouse.move(...tin); await p.mouse.down(); for (let i = 1; i <= n; i++) { await p.mouse.move(tin[0] + (oven[0] - tin[0]) * i / n, tin[1] + (oven[1] - tin[1]) * i / n); await W(30); } await p.mouse.up(); }
  await W(3500); await p.screenshot({ path: path.join(D, 'shots', 'drag-' + name + '.png') });
  console.log(name, tin.map(Math.round), log.join(' ; ') || 'no beat', '| cue:', await p.evaluate(() => document.querySelector('#cue').textContent)); await p.close();
}
await b.close();
