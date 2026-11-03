// Objectives say what the learner can DO after the lesson (cloud 2026-11-03), in every lazy course and the course blocks:
//   en  "In this lesson you will learn to X"  -> "After this lesson, you can X"
//   tr  "Bu derste X-mayı öğreneceksin"        -> "Bu dersin sonunda X-abileceksin"   (hand fixes in objectives-tr.json win)
//   fa  "در این درس یاد می‌گیری X"              -> "بعد از این درس می‌توانی X"
// Usage: node docs-claude/cloud-patches/apply-objectives.mjs [--dry] [--only ielts|ai-internet|...]
// --dry prints the converted Turkish (and anything the rules could not convert) without writing. Re-runnable; it also bumps
// each changed chapter's lazy `v` so the browser fetches the new lesson files. Run again after any local sync-*.js.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const here = path.dirname(new URL(import.meta.url).pathname);
const app = path.join(here, '..', '..', 'app');
const DRY = process.argv.includes('--dry');
const onlyI = process.argv.indexOf('--only'); const ONLY = onlyI > 0 ? process.argv[onlyI + 1] : null;
const TR_FIX = fs.existsSync(path.join(here, 'objectives-tr.json')) ? JSON.parse(fs.readFileSync(path.join(here, 'objectives-tr.json'), 'utf8')) : {};
const ZW = '‌';
const FA_OLD = 'در این درس یاد می' + ZW + 'گیری ', FA_NEW = 'بعد از این درس می' + ZW + 'توانی ';

function en(s) {
  if (!/^In this lesson you will learn (how )?to /.test(s)) return null;
  return s.replace(/^In this lesson you will learn (how )?to /, 'After this lesson, you can ').replace(/, and (how )?to /g, ', and ').replace(/ and (how )?to /g, ' and ').replace(/, then (how )?to /g, ', then ');
}
function fa(s) {
  if (!s.startsWith(FA_OLD)) return null;
  let r = FA_NEW + s.slice(FA_OLD.length);
  r = r.replace(new RegExp('^' + FA_NEW + '(که |چطور |چگونه )'), FA_NEW);
  return r;
}
// Nouns that look like -mayı/-meyi infinitives: always nouns (kelime, aşama, şema...), or nouns only after "bir"
// (bir konuşmayı takip etmek = follow a talk; ziyaretçilerle konuşmayı = to talk with visitors).
const NOUN = new Set(['kelimeyi', 'aşamayı', 'şemayı', 'temayı', 'firmayı', 'formayı', 'diplomayı', 'sinemayı']);
const NOUN_AFTER_BIR = new Set(['konuşmayı', 'görüşmeyi', 'tartışmayı', 'açıklamayı', 'uygulamayı', 'karşılaştırmayı', 'değerlendirmeyi', 'planlamayı']);
const SOFT = {et: 'ed', git: 'gid', kaybet: 'kaybed', hisset: 'hissed', reddet: 'redded', affet: 'affed', seyret: 'seyred', kaydet: 'kayded', bahset: 'bahsed', de: 'diy', ye: 'yiy'};
function conv(stem, suf) {
  const front = suf === 'meyi';
  let st = SOFT[stem] || stem;
  if (!SOFT[stem] && /[aeıioöuü]$/.test(st)) st += 'y';
  return st + (front ? 'ebilecek' : 'abilecek');
}
function tr(s) {
  if (TR_FIX[s]) return TR_FIX[s];
  if (!/^Bu derste /.test(s)) return null;
  const t = s.replace(/^Bu derste /, 'Bu dersin sonunda ');
  const i = t.indexOf(' öğreneceksin'); if (i < 0) return null;
  let head = t.slice(0, i), tail = t.slice(i + ' öğreneceksin'.length), n = 0;
  head = head.replace(/([^\s"“(,;:]+?)(mayı|meyi)(?=[,;:)"”]|\s|$)/g, (m, stem, suf, off, all) => { if (NOUN.has(m) || (NOUN_AFTER_BIR.has(m) && /\bbir $/.test(all.slice(0, off)))) return m; n++; return conv(stem, suf); });
  if (!n) return null;
  const last = Math.max(head.lastIndexOf('abilecek'), head.lastIndexOf('ebilecek'));
  head = head.slice(0, last + 8) + 'sin' + head.slice(last + 8);
  return head + tail;
}
const report = {changed: 0, trMissing: [], enMissing: [], faMissing: [], trOut: []};
function convertTriple(o, where) {
  if (!(o && typeof o === 'object' && typeof o.en === 'string' && /^In this lesson you will/.test(o.en))) return false;
  const E = en(o.en), T = tr(o.tr || ''), F = fa(o.fa || '');
  if (!E) report.enMissing.push(where + ' | ' + o.en);
  if (!T) report.trMissing.push(where + ' | ' + o.tr);
  if (o.fa && !F) report.faMissing.push(where + ' | ' + o.fa);
  if (DRY) { if (T) report.trOut.push(where + ' | ' + T); return false; }
  if (E) o.en = E; if (T) o.tr = T; if (F) o.fa = F;
  return !!(E || T || F);
}
function walk(o, where) {
  let ch = false;
  if (Array.isArray(o)) { o.forEach((x, i) => { ch = walk(x, where) || ch; }); return ch; }
  if (o && typeof o === 'object') { if (convertTriple(o, where)) return true; for (const k of Object.keys(o)) ch = walk(o[k], where) || ch; }
  return ch;
}
// 1. lazy lesson files
const dirs = [];
for (const d of fs.readdirSync(path.join(app, 'ielts'))) if (/^exam-\d+$/.test(d)) dirs.push(['ielts', path.join(app, 'ielts', d)]);
for (const c of fs.readdirSync(path.join(app, 'courses'))) for (const d of fs.readdirSync(path.join(app, 'courses', c))) { const p = path.join(app, 'courses', c, d); if (fs.statSync(p).isDirectory() && d !== 'assets') dirs.push([c, p]); }
const changedDirs = new Set();
for (const [cid, dir] of dirs) {
  if (ONLY && cid !== ONLY) continue;
  for (const f of fs.readdirSync(dir).filter(f => /\.js$/.test(f) && f !== 'course.js' && f !== 'tools.js')) {
    const file = path.join(dir, f); const src = fs.readFileSync(file, 'utf8');
    const a = src.indexOf('] = {', src.indexOf('x.units[')); const b = src.lastIndexOf('; })(');
    if (a < 0 || b < 0) { console.log('skip (wrapper)', file); continue; }
    const json = src.slice(a + 4, b); let u;
    try { u = JSON.parse(json); } catch (e) { console.log('skip (parse)', file); continue; }
    if (JSON.stringify(u) !== json) { console.log('skip (round trip differs)', file); continue; }
    if (walk(u, cid + '/' + f.replace(/\.js$/, ''))) { report.changed++; changedDirs.add(dir); if (!DRY) fs.writeFileSync(file, src.slice(0, a + 4) + JSON.stringify(u) + src.slice(b)); }
  }
}
// 2. course blocks in the app file (unit objectives + lazy v)
const appFile = path.join(app, 'farin-english-app.html');
const lines = fs.readFileSync(appFile, 'utf8').split('\n'); let appChanged = false;
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^COURSES\.push\(Object\.assign\(\{"id":"([a-z-]+)"/); if (!m) continue;
  if (ONLY && m[1] !== ONLY) continue;
  const l = lines[i], cut = l.lastIndexOf('}, {'); if (cut < 0) continue;
  const o = JSON.parse(l.slice('COURSES.push(Object.assign('.length, cut + 1));
  let ch = walk(o.modules, m[1] + '/block');
  for (const mod of o.modules || []) {
    if (!mod.lazy) continue; const d = path.join(app, mod.lazy.dir);
    if (changedDirs.has(path.resolve(d))) { mod.lazy.v = crypto.createHash('sha1').update(mod.lazy.files.map(f => fs.readFileSync(path.join(d, f))).join('')).digest('hex').slice(0, 10); ch = true; }
  }
  if (ch && !DRY) { lines[i] = 'COURSES.push(Object.assign(' + JSON.stringify(o) + l.slice(cut + 1); appChanged = true; }
}
if (appChanged) fs.writeFileSync(appFile, lines.join('\n'));
if (DRY) console.log(report.trOut.join('\n'));
console.log(`\nfiles changed: ${report.changed}${DRY ? ' (dry run)' : ''}; app block updated: ${appChanged}`);
if (report.enMissing.length) console.log('EN not converted:\n' + report.enMissing.join('\n'));
if (report.trMissing.length) console.log('TR not converted (add to objectives-tr.json):\n' + report.trMissing.join('\n'));
if (report.faMissing.length) console.log('FA not converted:\n' + report.faMissing.join('\n'));
