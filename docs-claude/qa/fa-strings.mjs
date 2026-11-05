// Inventory of learner-facing Persian strings with their English (and Turkish) siblings, for the Persian pass (cloud 2026-11-03).
// Usage: node docs-claude/qa/fa-strings.mjs <file> [--jsonl out.jsonl] [--stats]
// Finds {en,tr,fa} triples in object literals ('fa:' and '"fa":') and the third argument of L(...) / CL(...) calls.
// Each entry: {kind, en, tr, fa, n} where n = how many times that exact fa string occurs in the file.
import fs from 'node:fs';
const [file, ...rest] = process.argv.slice(2); const out = rest.includes('--jsonl') ? rest[rest.indexOf('--jsonl') + 1] : null;
const src = fs.readFileSync(file, 'utf8');
// a JS string literal starting at i (quote char q); returns [value, endIndex] or null
function lit(i) { const q = src[i]; if (q !== "'" && q !== '"' && q !== '`') return null; let s = '', j = i + 1; while (j < src.length) { const c = src[j]; if (c === '\\') { s += src[j + 1] === 'n' ? '\n' : src[j + 1]; j += 2; continue; } if (c === q) return [s, j + 1]; s += c; j++; } return null; }
const seen = new Map();
const add = (kind, en, tr, fa) => { if (!fa || !/[؀-ۿ]/.test(fa)) return; const k = fa; const e = seen.get(k); if (e) { e.n++; return; } seen.set(k, {kind, en: en || '', tr: tr || '', fa, n: 1}); };
// 1. object literals: ...en:'..', tr:'..', fa:'..'  (also "en":"..")
const reObj = /(?:["']?en["']?\s*:\s*)(['"`])/g; let m;
while ((m = reObj.exec(src))) {
  const a = lit(m.index + m[0].length - 1); if (!a) continue; const [en, e1] = a; let rest = src.slice(e1, e1 + 4000);
  const tr = rest.match(/^\s*,\s*["']?tr["']?\s*:\s*(['"`])/); let trv = '', pos = e1;
  if (tr) { const t = lit(e1 + tr[0].length - 1); if (t) { trv = t[0]; pos = t[1]; } }
  const fa = src.slice(pos, pos + 4000).match(/^\s*,\s*["']?fa["']?\s*:\s*(['"`])/); if (!fa) continue;
  const f = lit(pos + fa[0].length - 1); if (!f) continue; add('obj', en, trv, f[0]);
}
// 2. L('en','tr','fa'[, 'es']) and CL(...)
const reCall = /\b(CL|L)\(\s*(['"`])/g;
while ((m = reCall.exec(src))) {
  const a = lit(m.index + m[0].length - 1); if (!a) continue; let [en, p] = a; const args = [en];
  for (let k = 0; k < 3; k++) { const mm = src.slice(p, p + 20).match(/^\s*,\s*(['"`])/); if (!mm) break; const v = lit(p + mm[0].length - 1); if (!v) break; args.push(v[0]); p = v[1]; }
  if (args.length >= 3) add(m[1], args[0], args[1], args[2]);
}
const all = [...seen.values()];
const words = all.reduce((n, e) => n + e.fa.split(/\s+/).length, 0);
console.log(`${file}: ${all.length} distinct fa strings (${all.filter(e => e.kind === 'obj').length} obj, ${all.filter(e => e.kind !== 'obj').length} L/CL), ~${words} words`);
if (out) { fs.writeFileSync(out, all.map(e => JSON.stringify(e)).join('\n') + '\n'); console.log('written', out); }
