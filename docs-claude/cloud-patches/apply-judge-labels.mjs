// Merges judge-label glosses (tr/fa) into COURSE_JUDGE_L in BOTH app files (engine table, byte-identical on both sides).
// Usage: node docs-claude/cloud-patches/apply-judge-labels.mjs <labels.json> [...]   Re-runnable.
// ES_APP_FILE: the Spanish app file when farin-spanish is not checked out next to this repo (e.g. a worktree).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));   // new URL().pathname gave C:\C:\... on Windows
const add = {}; for (const f of process.argv.slice(2)) Object.assign(add, JSON.parse(fs.readFileSync(path.resolve(here, f), 'utf8'))); delete add._about;
for (const rel of ['../../app/farin-english-app.html', process.env.ES_APP_FILE || '../../../farin-spanish/app/farin-spanish-app.html']) {
  const file = path.resolve(here, rel); const lines = fs.readFileSync(file, 'utf8').split('\n');
  const i = lines.findIndex(l => l.startsWith('const COURSE_JUDGE_L = ')); const l = lines[i];
  const obj = JSON.parse(l.slice('const COURSE_JUDGE_L = '.length, l.lastIndexOf(';'))); let n = 0;
  // a doc comment that slipped into the data as the first key (lxd business READY-2 item 3, 2026-11-07)
  for (const k of Object.keys(obj)) if (k.startsWith('Format: `')) { delete obj[k]; console.log(path.basename(file), 'removed junk key', JSON.stringify(k)); }
  for (const [k, v] of Object.entries(add)) if (!obj[k]) { obj[k] = v; n++; }
  lines[i] = 'const COURSE_JUDGE_L = ' + JSON.stringify(obj) + ';' + (l.endsWith('\r') ? '\r' : ''); fs.writeFileSync(file, lines.join('\n')); console.log(path.basename(file), 'labels added:', n);
}
