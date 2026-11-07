// Assembles cloud-written lazy course chapters into the English app file. Safe to re-run.
//   node docs-claude/cloud-patches/assemble-course.mjs business   -> writes the BUS-COURSE block (new course)
//   node docs-claude/cloud-patches/assemble-course.mjs marketing  -> adds chapter mkt-m4 to the generated MKT block
// Chapter entries come from docs-claude/cloud-patches/<course>/<chapter>.json, lesson files from app/courses/<course>/<chapter>/.
// After a local sync-marketing.js run, re-run this (the sync regenerates the MKT block without mkt-m4).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));   // new URL().pathname gave C:\C:\... on Windows
const app = path.join(here, '..', '..', 'app');
const appFile = path.join(app, 'farin-english-app.html');
const which = process.argv[2];
const enObj = s => s.replace(/^In this lesson you will learn to /, 'After this lesson, you can ');

function chapter(course, id) {
  const m = JSON.parse(fs.readFileSync(path.join(here, course, id + '.json'), 'utf8'));
  const dir = path.join(app, 'courses', course, id);
  const unitIds = m.units.map(u => u.id).concat(m.checkpoint && m.checkpoint.id ? [m.checkpoint.id] : []);
  const files = unitIds.map(u => u + '.js').filter(f => fs.existsSync(path.join(dir, f)));
  for (const f of files) { const w = {}; new Function('globalThis', fs.readFileSync(path.join(dir, f), 'utf8'))(w); const x = w.COURSE_FILES && w.COURSE_FILES[id]; if (!x || !x.units || !x.units[f.slice(0, -3)]) throw new Error(`${f}: no COURSE_FILES["${id}"].units["${f.slice(0, -3)}"]`); }
  const v = crypto.createHash('sha1').update(files.map(f => fs.readFileSync(path.join(dir, f))).join('')).digest('hex').slice(0, 10);
  delete m.lazy;
  for (const u of m.units) if (u.objective && u.objective.en) u.objective.en = enObj(u.objective.en);
  return Object.assign(m, {lazy: {key: id, global: 'COURSE_FILES', dir: `courses/${course}/${id}/`, files, v}});
}
function cpPush(course, mods, upto) {
  const covers = mods.slice(0, upto + 1).flatMap(m => m.units.map(u => u.id));
  const id = mods[upto].checkpoint.id;
  return 'COURSE_EXTRA.checkpoint.push(' + JSON.stringify({id, course, unit: id, covers}) + ');';
}

let html = fs.readFileSync(appFile, 'utf8');
if (which === 'business') {
  const C = JSON.parse(fs.readFileSync(path.join(here, 'business', 'course.json'), 'utf8'));
  const mods = ['bus-m1', 'bus-m2', 'bus-m3', 'bus-m4', 'bus-m5', 'bus-m6', 'bus-m7', 'bus-m8', 'bus-m9', 'bus-m10'].filter(id => fs.existsSync(path.join(here, 'business', id + '.json'))).map(id => chapter('business', id));
  const course = Object.assign({}, C.course, {modules: mods});
  // rubric bands: the Copywriting course's, with a business tone line
  const mk = html.split('\n').find(l => l.startsWith('COURSES.push(Object.assign({"id":"marketing"'));
  const mko = JSON.parse(mk.slice('COURSES.push(Object.assign('.length, mk.lastIndexOf('}, {') + 1));
  course.rubricBands = Object.assign({}, mko.rubricBands, {tone: C.course.rubricTone}); delete course.rubricTone;
  const proj = Object.assign({}, C.project); proj.defaultProduct = proj.defaultCompany; delete proj.defaultCompany;
  // the engine reads rubric as the English list + rubricI18n {tr, fa} (as Copywriting/Sales); a {en, tr, fa} rubric crashed the final
  // project page (pd.rubric.map is not a function), found by the review walk 2026-11-07
  if (proj.rubric && !Array.isArray(proj.rubric)) { const r = proj.rubric; proj.rubricI18n = Object.assign({}, proj.rubricI18n, {tr: r.tr, fa: r.fa}); proj.rubric = r.en; }
  const appF = C.app;
  const block = ['/* BUS-COURSE-BEGIN: Complete Business English, written in the cloud session 2026-11-03 (docs-claude/cloud-patches/business/,',
    '   assembled by assemble-course.mjs). Lesson data is lazy: courses/business/<chapter>/<lesson>.js. Port to Claude/specs/lxd-course-business/. */']
    .concat(mods.map((m, i) => cpPush('business', mods, i)))
    .concat(['COURSE_EXTRA.project.push(' + JSON.stringify(proj) + ');',
      'COURSES.push(Object.assign(' + JSON.stringify(course) + `, {status:'${appF.status}', cat:'${appF.cat}', icon:'${appF.icon}', freeUnits:${JSON.stringify(appF.freeUnits)}}));`,
      '/* BUS-COURSE-END */']).join('\n');
  html = html.replace(/\/\* BUS-COURSE-BEGIN[\s\S]*?\/\* BUS-COURSE-END \*\/\n/, '');
  html = html.replace('/* COURSES-IN-THE-MAKING', block + '\n/* COURSES-IN-THE-MAKING');
  // admin catalog + password prefix
  if (!html.includes("{id:'business', app:'en', title:'Complete Business English'}"))
    html = html.replace("{id:'sales', app:'en', title:'Sales & Trade English'},", "{id:'sales', app:'en', title:'Sales & Trade English'}, {id:'business', app:'en', title:'Complete Business English'},");
  if (!/COURSE_PW_PREFIX = \{[^}]*business:/.test(html)) html = html.replace("marketing:'MK', sales:'SC'}", "marketing:'MK', sales:'SC', business:'BE'}");
  console.log('business: chapters', mods.map(m => m.id + '(' + m.lazy.files.length + ' files)').join(' '));
} else if (which === 'marketing') {
  const m4 = chapter('marketing', 'mkt-m4');
  const lines = html.split('\n');
  const i = lines.findIndex(l => l.startsWith('COURSES.push(Object.assign({"id":"marketing"')); let l = lines[i];
  const cut = l.lastIndexOf('}, {'); const o = JSON.parse(l.slice('COURSES.push(Object.assign('.length, cut + 1));
  o.modules = o.modules.filter(m => m.id !== 'mkt-m4').concat([m4]);
  // the final project still unlocks after chapter 3 (saved progress keeps it open); chapter 4 is an extra chapter
  o.weeks = Math.max(o.weeks, 8);
  lines[i] = 'COURSES.push(Object.assign(' + JSON.stringify(o) + l.slice(cut + 1);
  html = lines.join('\n');
  const cpLine = cpPush('marketing', o.modules, o.modules.length - 1);
  html = html.replace(/COURSE_EXTRA\.checkpoint\.push\(\{"id":"mkt-cp-4"[^\n]*\n/, '');
  html = html.replace('COURSE_EXTRA.project.push({"id":"mkt-final"', cpLine + '\nCOURSE_EXTRA.project.push({"id":"mkt-final"');
  console.log('marketing: chapters now', o.modules.map(m => m.id).join(' '));
} else throw new Error('usage: assemble-course.mjs business|marketing');
fs.writeFileSync(appFile, html);
