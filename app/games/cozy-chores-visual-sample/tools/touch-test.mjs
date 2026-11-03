// node tools/touch-test.mjs -> plays tin + dial with real pointer drags (muted), wrong value first; logs beats and errors
import { createRequire } from 'module'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const require = createRequire('D:/farin/FEschool/social/tools/package.json'); const puppeteer = require('puppeteer');
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); const W = (ms) => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new', args: ['--mute-audio', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage(); await p.setViewport({ width: 390, height: 844 });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => (m.type() === 'error' || m.text().startsWith('beat')) && console.log('C', m.text()));
await p.goto(pathToFileURL(path.join(D, 'demo.html')).href + '?mute=1');
const drag = async (a, c) => { await p.mouse.move(...a); await p.mouse.down(); for (let i = 1; i <= 12; i++) { await p.mouse.move(a[0] + (c[0] - a[0]) * i / 12, a[1] + (c[1] - a[1]) * i / 12); await W(30); } await W(150); await p.mouse.up(); };
const read = () => p.evaluate(() => document.querySelector('#readout b').textContent + ' | ' + document.querySelector('#line').textContent);
await p.waitForFunction('!!window.__autoTin', { timeout: 20000 }); await W(1200);
await drag([283, 505], [178, 340]); await p.waitForFunction('!!window.__setDial', { timeout: 15000 }).catch(() => console.log('TIN DRAG FAILED')); await W(1500);
const c = [193, 291];
await drag(c, [c[0] + 70, c[1] - 30]); await W(3500); console.log('after wrong:', await read());
await drag(c, [c[0], c[1] - 70]); await W(1500); console.log('after 30:', await read()); await W(11000);
console.log('end:', await read(), await p.evaluate(() => document.querySelector('#cta').className)); await b.close();
