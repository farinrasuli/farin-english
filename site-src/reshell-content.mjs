#!/usr/bin/env node
// Re-shell hand-written content pages (blog posts, guides) into the 2026-10-29 design system.
//
// The header, footer, icon sprite, font/CSS block and the course offer are copied from the GENERATED
// homepage of the page's language (site/index.html for TR, site/fa/index.html for FA), so content pages
// always match the main site. Run build-pages.mjs first, then this script; re-running is safe (marked
// blocks are replaced, never duplicated), so price/nav changes on the homepage reach every post.
//
//   node site-src/reshell-content.mjs site/blog/*.html        (paths relative to the repo root)
//   node site-src/reshell-content.mjs --check site/blog/x.html (report only, write nothing)
//
// Content inside <main> is never rewritten, only wrapped: titles, meta, canonical, hreflang, JSON-LD,
// headings and body text stay byte-identical.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const files = args.filter((a) => !a.startsWith('--'));

/* which homepage goal panel to show at the end of each page (default: konusma = free app + 1:1 lessons) */
const OFFER = [
  [/ielts/, 'ielts'],
  [/insan-kaynaklari|manabe-ensani/, 'is'],
  [/mulakat|mosahebe/, 'mulakat'],
];
const offerFor = (file) => (OFFER.find(([re]) => re.test(file)) || [null, 'konusma'])[1];

function balancedDiv(html, start) { // returns the full <div ...>...</div> starting at index `start`
  const re = /<\/?div\b[^>]*>/g; re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(html))) { depth += m[0][1] === '/' ? -1 : 1; if (depth === 0) return html.slice(start, re.lastIndex); }
  throw new Error('unbalanced div');
}
const must = (v, what, f) => { if (!v) throw new Error(`${f}: ${what} not found`); return v; };

const TPL = {};
function template(lang) {
  if (TPL[lang]) return TPL[lang];
  const f = path.join(ROOT, 'site', lang === 'fa' ? 'fa/index.html' : 'index.html');
  const h = fs.readFileSync(f, 'utf8');
  const head = must(h.match(/<script>document\.documentElement\.classList\.add\('js'\)<\/script>[\s\S]*?<link rel="stylesheet" href="\/feschool\.css">/), 'font/css block', f)[0];
  const sprite = must(h.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/), 'sprite', f)[0];
  const skip = must(h.match(/<a class="skip" href="#main">[^<]*<\/a>/), 'skip link', f)[0];
  const header = must(h.match(/<header class="site">[\s\S]*?<\/header>/), 'header', f)[0].replace(/ aria-current="page"/g, '');
  const footer = must(h.match(/<footer class="site">[\s\S]*?<\/footer>/), 'footer', f)[0];
  const panels = {};
  for (const g of ['is', 'ielts', 'mulakat', 'konusma']) {
    const i = h.search(new RegExp(`<div class="gres[^"]*" id="kurs-${g}"`));
    if (i >= 0) panels[g] = balancedDiv(h, i).replace(/<div class="gres[^"]*" id="kurs-[a-z]+" data-goal="[a-z]+">/, '<div class="offer-panel">');
  }
  return (TPL[lang] = { head, sprite, skip, header, footer, panels });
}

const report = [];
for (const rel of files) {
  const file = path.resolve(ROOT, rel);
  let h = fs.readFileSync(file, 'utf8');
  const before = h;
  const lang = (h.match(/<html[^>]*\blang="([a-z]+)"/) || [])[1] === 'fa' ? 'fa' : 'tr';
  const T = template(lang);
  const pagePath = '/' + path.relative(path.join(ROOT, 'site'), file).replace(/\\/g, '/');

  // 1. head: drop the old font + site.css links (and a previous shell block), add the shared block
  h = h.replace(/\n?<!-- shell:head -->[\s\S]*?<!-- \/shell:head -->/, '');
  h = h.replace(/\n?<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"( crossorigin)?>/g, '');
  h = h.replace(/\n?<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" rel="stylesheet">/g, '');
  h = h.replace(/\n?<link rel="stylesheet" href="(\.\.\/|\/)?(\.\.\/)?site\.css[^"]*">/g, '');
  const shellHead = `\n<!-- shell:head -->\n${T.head}\n<link rel="stylesheet" href="/article.css">\n<!-- /shell:head -->`;
  const at = ['<style', '<script type="application/ld+json"', '</head>'].map((s) => h.indexOf(s)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  h = h.slice(0, at) + shellHead.slice(1) + '\n' + h.slice(at);
  h = h.replace(/src="(\.\.\/)+(consent|site)\.js"/g, 'src="/$2.js"');

  // 2. header (old: <header class="site" id="siteHeader">, or a previous shell block)
  const shellHeader = `<!-- shell:header -->\n${T.sprite}\n${T.skip}\n${T.header}\n<!-- /shell:header -->`;
  if (/<!-- shell:header -->/.test(h)) h = h.replace(/<!-- shell:header -->[\s\S]*?<!-- \/shell:header -->/, shellHeader);
  else h = h.replace(/<header class="site"[^>]*>[\s\S]*?<\/header>/, () => shellHeader);

  // 3. main
  h = h.replace(/<main id="top">/, '<main id="main" class="article">');
  if (!/<main id="main" class="article">/.test(h)) throw new Error(pagePath + ': <main> not recognised');

  // 4. offer panel at the end of the article (before the related-posts band, else before </main>)
  h = h.replace(/\n?<!-- offer -->[\s\S]*?<!-- \/offer -->/, '');
  const g = offerFor(pagePath); let panel = T.panels[g];
  if (panel) {
    panel = panel.replace(new RegExp(`<a class="tlink more" href="${pagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">[^<]*</a>`), ''); // no self-link
    const offer = `\n  <!-- offer -->\n  <section class="offer" data-loc="blog-offer-${g}"><div class="wrap">\n${panel}\n  </div></section>\n  <!-- /offer -->`;
    const mainEnd = h.indexOf('</main>');
    const tint = h.lastIndexOf('<section class="tint">', mainEnd);
    const ins = tint > h.indexOf('<main id="main"') ? tint : mainEnd;
    h = h.slice(0, ins).replace(/\s*$/, '') + offer + '\n\n  ' + h.slice(ins);
  }

  // 5. footer
  const shellFooter = `<!-- shell:footer -->\n${T.footer}\n<!-- /shell:footer -->`;
  if (/<!-- shell:footer -->/.test(h)) h = h.replace(/<!-- shell:footer -->[\s\S]*?<!-- \/shell:footer -->/, shellFooter);
  else h = h.replace(/<footer class="site"[^>]*>[\s\S]*?<\/footer>/, () => shellFooter);

  // sanity: exactly one of each landmark
  for (const [re, name] of [[/<header class="site">/g, 'header'], [/<footer class="site">/g, 'footer'], [/<main /g, 'main'], [/<h1[\s>]/g, 'h1']]) {
    const n = (h.match(re) || []).length; if (n !== 1) throw new Error(`${pagePath}: ${n} × ${name}`);
  }
  report.push(`${pagePath}  lang=${lang} offer=${panel ? g : 'none'} ${h === before ? 'unchanged' : 'updated'}`);
  if (!CHECK && h !== before) fs.writeFileSync(file, h);
}
console.log(report.join('\n'));
