// Applies hr-2026-11-03.json to app/farin-english-app.html. Safe to re-run (it skips what is already applied).
// Run after any local sync-hr.js, which regenerates the HR block from the specs on Farin's PC:
//   node docs-claude/cloud-patches/apply-hr.mjs
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const appFile = path.join(here, '..', '..', 'app', 'farin-english-app.html');
const P = JSON.parse(fs.readFileSync(path.join(here, 'hr-2026-11-03.json'), 'utf8'));
let html = fs.readFileSync(appFile, 'utf8');
const lines = html.split('\n');
const enObj = s => s.replace(/^In this lesson you will learn to /, 'After this lesson, you can ').replace(/, and to /g, ', and ').replace(/ and to /g, ' and ');
const faObj = s => s.replace(/^در این درس یاد می‌گیری /, 'بعد از این درس می‌توانی ');
const swaps = []; let n = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/^COURSE_EXTRA\.explain\.push\(\{"id":"c-(hr-\d-\d)-e"/); if (!m) continue;
  const uid = m[1], p = P[uid]; if (!p) continue;
  const o = JSON.parse(l.slice(l.indexOf('(') + 1, l.lastIndexOf(')')));
  const old = Object.assign({}, o.objective);
  const nu = { en: enObj(old.en), tr: p.objTr || old.tr, fa: faObj(old.fa) };
  for (const k of ['en', 'tr', 'fa']) if (old[k] !== nu[k]) swaps.push([JSON.stringify(old[k]), JSON.stringify(nu[k])]);
  o.objective = nu;
  if (p.mk && o.points[1]) { o.points[1].wrong = p.mk[0]; o.points[1].right = p.mk[1]; }
  if (p.p4 && o.points[3]) o.points[3].head = p.p4;
  lines[i] = 'COURSE_EXTRA.explain.push(' + JSON.stringify(o) + ');'; n++;
}
html = lines.join('\n');
// the unit's own objective (in the HR course block) carries the same strings
for (const [a, b] of swaps) html = html.split(a).join(b);
fs.writeFileSync(appFile, html);
console.log(`HR explain items patched: ${n}; objective strings replaced: ${swaps.length}`);
