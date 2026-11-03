// node tools/flow.mjs -> plays the whole station headless (muted) through the test hooks, logs errors, saves shots/flow-*.png
import { createRequire } from 'module'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const require = createRequire('D:/farin/FEschool/social/tools/package.json'); const puppeteer = require('puppeteer');
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); const W = (ms) => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new', args: ['--mute-audio', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => (m.type() === 'error' || m.text().startsWith('beat')) && console.log('C', m.text()));
await p.goto(pathToFileURL(path.join(D, 'demo.html')).href + '?mute=1' + (process.argv[2] || ''));
const snap = async (n) => { await p.screenshot({ path: path.join(D, 'shots', 'flow-' + n + '.png') }); console.log('flow', n); };
await W(2200); await snap('1-intro'); await W(4200); await snap('2-tin');
await p.waitForFunction('!!window.__autoTin', {timeout: 20000}); await W(600); await snap('2b-tin'); await p.evaluate(() => window.__autoTin()); await W(2600); await snap('3-closed');
await p.waitForFunction('!!window.__setDial', {timeout: 20000}); await p.evaluate(() => window.__setDial(45)); await W(1500); await snap('4-wrong');
await W(2500); await p.evaluate(() => window.__setDial(30)); await W(4000); await snap('5-baking'); await W(6000); await snap('6-done');
await b.close();
