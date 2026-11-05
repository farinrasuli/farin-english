// Applies the editors' Persian/Turkish fixes (docs-claude/cloud-patches/fa/fix-*.json) to both app files and the lazy course files.
// A fix replaces every occurrence of the old string (raw, or escaped as a JS/JSON literal). It is skipped, and reported, if the new
// value drops a ${...} placeholder, an HTML tag or a «» quote the old one had, or if the old string is not found. Re-runnable.
// Usage: node docs-claude/cloud-patches/apply-fa-fixes.mjs [fix files...]   (default: every fa/fix-*.json)
import fs from 'node:fs'; import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname); const root = path.join(here, '..', '..');
const fixFiles = process.argv.slice(2).length ? process.argv.slice(2).map(f => path.resolve(here, f)) : fs.readdirSync(path.join(here, 'fa')).filter(f => /^fix-.*\.json$/.test(f)).map(f => path.join(here, 'fa', f));
const files = [path.join(root, 'app/farin-english-app.html'), path.join(root, '../farin-spanish/app/farin-spanish-app.html')];
const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.js$/.test(f)) files.push(p); } };
walk(path.join(root, 'app/ielts')); walk(path.join(root, 'app/courses'));
const toks = s => (s.match(/\$\{[^}]*\}|<[^>]+>|«|»|\\n/g) || []).sort().join('|');
const variants = s => { const v = new Set([s]); v.add(JSON.stringify(s).slice(1, -1)); v.add(s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")); v.add(s.replace(/\n/g, '\\n')); return [...v]; };
const srcs = new Map(files.map(f => [f, fs.readFileSync(f, 'utf8')])); const report = {applied: 0, notFound: [], unsafe: [], occurrences: 0};
for (const ff of fixFiles) {
  const J = JSON.parse(fs.readFileSync(ff, 'utf8')); const name = path.basename(ff);
  for (const lang of ['fa', 'tr']) for (const [oldS, newS] of Object.entries(J[lang] || {})) {
    if (typeof newS !== 'string' || !newS.trim() || newS === oldS) continue;
    if (toks(oldS) !== toks(newS)) { report.unsafe.push(`${name}: ${oldS.slice(0, 60)}`); continue; }
    let hits = 0;
    for (const [f, s] of srcs) { let t = s; for (const o of variants(oldS)) { const n = (variants(newS))[variants(oldS).indexOf(o)] ?? newS; if (t.includes(o)) { hits += t.split(o).length - 1; t = t.split(o).join(n); } } if (t !== s) srcs.set(f, t); }
    if (!hits) report.notFound.push(`${name}: ${oldS.slice(0, 60)}`); else { report.applied++; report.occurrences += hits; }
  }
}
for (const [f, s] of srcs) if (s !== fs.readFileSync(f, 'utf8')) fs.writeFileSync(f, s);
console.log(`fixes applied: ${report.applied} (${report.occurrences} occurrences)`);
if (report.unsafe.length) console.log('SKIPPED (placeholder/tag/quote mismatch):\n  ' + report.unsafe.join('\n  '));
if (report.notFound.length) console.log('NOT FOUND:\n  ' + report.notFound.join('\n  '));
