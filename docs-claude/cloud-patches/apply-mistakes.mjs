// Puts the Common mistake pair (wrong/right) on one key point of each lesson listed in a mistakes JSON (cloud 2026-11-03).
// Usage: node docs-claude/cloud-patches/apply-mistakes.mjs mistakes-2026-11-03.json [more.json ...]
// Finds the lesson file under app/ielts or app/courses, the point whose head.en contains `head` (or index `point`), sets
// wrong/right, and bumps the chapter's lazy `v` in the app file. Re-runnable; run again after any local sync-*.js.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const here = path.dirname(new URL(import.meta.url).pathname);
const app = path.join(here, '..', '..', 'app');
const P = {}; for (const f of process.argv.slice(2)) Object.assign(P, JSON.parse(fs.readFileSync(path.join(here, f), 'utf8')));
delete P._about;
const files = new Map(); // uid -> file
const scan = dir => { for (const d of fs.readdirSync(dir)) { const p = path.join(dir, d); if (fs.statSync(p).isDirectory()) { if (d !== 'audio' && d !== 'assets') scan(p); } else if (/\.js$/.test(d) && d !== 'course.js' && d !== 'tools.js') files.set(d.slice(0, -3), p); } };
scan(path.join(app, 'ielts')); scan(path.join(app, 'courses'));
const changedDirs = new Set(); let n = 0; const missing = [];
for (const [uid, m] of Object.entries(P)) {
  const file = files.get(uid); if (!file) { missing.push(uid + ' (no file)'); continue; }
  const src = fs.readFileSync(file, 'utf8'); const a = src.indexOf('] = {', src.indexOf('x.units[')); const b = src.lastIndexOf('; })(');
  const json = src.slice(a + 4, b); const u = JSON.parse(json); if (JSON.stringify(u) !== json) { missing.push(uid + ' (round trip)'); continue; }
  const targets = [u.explain]; if (m.gt !== false && u.gt && u.gt.explain) targets.push(u.gt.explain);
  let hit = false;
  for (const ex of targets) {
    if (!ex || !ex.points) continue;
    const pt = m.point !== undefined ? ex.points[m.point] : ex.points.find(p => p.head && (p.head.en || '').toLowerCase().includes(m.head.toLowerCase()));
    if (!pt) continue;
    pt.wrong = m.wrong; pt.right = m.right; hit = true;
  }
  if (!hit) { missing.push(uid + ' (no point with head "' + m.head + '")'); continue; }
  fs.writeFileSync(file, src.slice(0, a + 4) + JSON.stringify(u) + src.slice(b)); changedDirs.add(path.dirname(file)); n++;
}
// bump lazy v for changed chapters
const appFile = path.join(app, 'farin-english-app.html');
const lines = fs.readFileSync(appFile, 'utf8').split('\n'); let appChanged = false;
for (let i = 0; i < lines.length; i++) {
  if (!/^COURSES\.push\(Object\.assign\(\{"id":"/.test(lines[i])) continue;
  const l = lines[i], cut = l.lastIndexOf('}, {'); if (cut < 0) continue;
  const o = JSON.parse(l.slice('COURSES.push(Object.assign('.length, cut + 1)); let ch = false;
  for (const mod of o.modules || []) { if (!mod.lazy) continue; const d = path.resolve(app, mod.lazy.dir); if (!changedDirs.has(d)) continue;
    mod.lazy.v = crypto.createHash('sha1').update(mod.lazy.files.map(f => fs.readFileSync(path.join(d, f))).join('')).digest('hex').slice(0, 10); ch = true; }
  if (ch) { lines[i] = 'COURSES.push(Object.assign(' + JSON.stringify(o) + l.slice(cut + 1); appChanged = true; }
}
if (appChanged) fs.writeFileSync(appFile, lines.join('\n'));
console.log(`mistake pairs applied: ${n}; chapters re-versioned: ${changedDirs.size}` + (missing.length ? '\nNOT applied: ' + missing.join(', ') : ''));
