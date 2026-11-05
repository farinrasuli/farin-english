// Mechanical Persian consistency fixes (cloud 2026-11-03), safe app-wide: hamza ezafe «سادهٔ» -> half-space «ساده‌ی» (the app's
// majority style, 1890 vs 271), «نقشه راه» -> «نقشه‌ی راه». Prints the contexts of «می‌گردد» and «است!» for a hand decision.
// Usage: node docs-claude/cloud-patches/apply-fa-mechanical.mjs   (both app files + every lazy course file; re-runnable)
import fs from 'node:fs'; import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname); const root = path.join(here, '..', '..');
const files = [path.join(root, 'app/farin-english-app.html'), path.join(root, '../farin-spanish/app/farin-spanish-app.html')];
const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.js$/.test(f)) files.push(p); } };
walk(path.join(root, 'app/ielts')); walk(path.join(root, 'app/courses'));
let tot = 0; const ctx = [];
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8'); const before = s;
  s = s.replace(/هٔ(?=[\s«»،؛:.!؟)]|$)/gm, 'ه‌ی');   // hamza ezafe at word end -> ه‌ی
  s = s.replace(/نقشه راه/g, 'نقشه‌ی راه');
  if (s !== before) { fs.writeFileSync(f, s); const n = (before.match(/هٔ/g) || []).length + (before.match(/نقشه راه/g) || []).length; tot += n; console.log(path.relative(root, f), 'fixes:', n); }
  for (const re of [/.{0,50}می‌گردد.{0,30}/g, /.{0,60}است!.{0,10}/g]) { let m; while ((m = re.exec(s))) ctx.push(path.basename(f) + ': …' + m[0].replace(/\s+/g, ' ') + '…'); }
}
console.log('total mechanical fixes:', tot); console.log('\nfor a hand decision (می‌گردد / است!):\n' + ctx.join('\n'));
