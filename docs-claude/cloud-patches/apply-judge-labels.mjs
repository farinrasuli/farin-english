// Merges judge-label glosses (tr/fa) into COURSE_JUDGE_L in BOTH app files (engine table, byte-identical on both sides).
// Usage: node docs-claude/cloud-patches/apply-judge-labels.mjs <labels.json> [...]   Re-runnable.
import fs from 'node:fs'; import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const add = {}; for (const f of process.argv.slice(2)) Object.assign(add, JSON.parse(fs.readFileSync(path.resolve(here, f), 'utf8'))); delete add._about;
for (const rel of ['../../app/farin-english-app.html', '../../../farin-spanish/app/farin-spanish-app.html']) {
  const file = path.resolve(here, rel); const lines = fs.readFileSync(file, 'utf8').split('\n');
  const i = lines.findIndex(l => l.startsWith('const COURSE_JUDGE_L = ')); const l = lines[i];
  const obj = JSON.parse(l.slice('const COURSE_JUDGE_L = '.length, l.lastIndexOf(';'))); let n = 0;
  for (const [k, v] of Object.entries(add)) if (!obj[k]) { obj[k] = v; n++; }
  lines[i] = 'const COURSE_JUDGE_L = ' + JSON.stringify(obj) + ';'; fs.writeFileSync(file, lines.join('\n')); console.log(path.basename(file), 'labels added:', n);
}
