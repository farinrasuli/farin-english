// Compare an IELTS lesson file's data shape with a reference lesson (e.g. exam-10/x10-l1.js vs exam-11/x11-l1.js).
// Reports keys the reference has and the new file lacks (at every depth, first array element as the sample),
// tr/fa missing where the reference has them, and "شما" in fa. Usage: node ielts-shape.mjs <ref.js> <new.js>
import fs from 'node:fs';
const load = f => { const w = {}; new Function('globalThis', fs.readFileSync(f, 'utf8'))(w); const ex = Object.values(w.IELTS_EXAMS)[0]; return Object.values(ex.units)[0]; };
const [ra, nb] = process.argv.slice(2); const A = load(ra), B = load(nb); const out = [];
const walk = (a, b, p) => {
  if (a && typeof a === 'object' && !Array.isArray(a)) {
    if (!b || typeof b !== 'object') { out.push('missing object ' + p); return; }
    for (const k of Object.keys(a)) { if (!(k in b)) { out.push('missing key ' + p + '.' + k); continue; } walk(a[k], b[k], p + '.' + k); }
    if ('en' in a && 'fa' in a && b && typeof b.fa === 'string' && /(^|[^آ-ی])شما([^آ-ی]|$)/.test(b.fa)) out.push('formal شما at ' + p);
  } else if (Array.isArray(a)) { if (!Array.isArray(b)) { out.push('not array ' + p); return; } if (a.length && !b.length) out.push('empty array ' + p); if (a.length && b.length) walk(a[0], b[0], p + '[0]'); }
};
walk(A, B, B.id || 'unit');
const txt = JSON.stringify(B); if (/شما/.test(txt)) out.push('note: شما appears somewhere (check it is not addressing the learner)');
console.log(out.length ? out.join('\n') : 'shape OK'); process.exit(out.length ? 1 : 0);
