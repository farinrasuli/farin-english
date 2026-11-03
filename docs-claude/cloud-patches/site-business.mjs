// Puts Complete Business English on the website (standing rule: a new course goes on thefeschool.com TR/EN/FA, /dersler/ and
// /kelas/ in the same piece of work). Cloud 2026-11-03. Price from the site's own COMPANY list (biz: ₺5,990 / ۶٬۹۹۰٬۰۰۰ تومان).
// Status 'start' = in the app with its 2 free lessons, not on sale yet (like the AI course); Farin flips SALE.biz to 'now'.
// Re-runnable. Then run: node site-src/build-pages.mjs
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.join(here, '..', '..');
const rw = (rel, fn) => { const p = path.join(root, rel); const a = fs.readFileSync(p, 'utf8'); const b = fn(a); if (a !== b) { fs.writeFileSync(p, b); console.log('updated', rel); } else console.log('unchanged', rel); };

// 1. generated main pages: sale status + the row under the Work & career card
rw('site-src/build-pages.mjs', s => {
  s = s.replace("ai: 'start', biz: 'plan'", "ai: 'start', biz: 'start'");
  const row = "      [null, ['Kapsamlı İş İngilizcesi', 'Complete Business English', 'دوره‌ی جامع انگلیسی تجاری'], ['₺5.990', '₺5,990', '۶٬۹۹۰٬۰۰۰ تومان'], 'biz', 'business', true]] },";
  if (!s.includes("'biz', 'business', true]")) s = s.replace("'ai', 'ai-internet', true]] },", "'ai', 'ai-internet', true],\n" + row);
  return s;
});

// 2. /dersler/ (Turkish, hand-written) and /kelas/ (Persian, hand-written): one course block after the AI course
const APP = 'https://farinrasuli.github.io/farin-english-app/farin-english-app.html?course=business&amp;lang=';
const TR = `      <article class="course" style="--c:#5B3FD6">
        <header>
          <div class="ch-top"><span class="num">07</span><span class="when" data-sale="soon" data-course="business">İlk 2 ders ücretsiz</span></div>
          <span class="tag light">“Kendini tanıt. Toplantıyı yönet. Rakamları sun. Anlaşmayı yazıya dök.”</span>
          <h3>Kapsamlı İş İngilizcesi</h3>
          <div class="chips"><span>16 ders</span><span>4 bölüm</span><span>~8 hafta</span><span>B1 → B2</span></div>
        </header>
        <div class="c-body">
          <div class="c-info">
            <p class="lh">Kimin için</p><p>B1 ve üzeri; yabancı müşteri, tedarikçi ya da iş arkadaşlarıyla çalışan ofis çalışanları, yöneticiler, mühendisler, ihracatçılar ve serbest çalışanlar. Hikâye yok, her ders doğrudan bir iş becerisi.</p>
            <p class="lh">Ne öğrenirsin</p><p>Kendini ve şirketini tanıtmak, cevap alan e-postalar, toplantı yönetmek ve tutanak yazmak, rakamları ve eğilimleri sunmak, proje raporu, fiyat ve koşul pazarlığı, şikâyet çözmek ve teklif yazmak.</p>
          </div>
          <div class="c-get">
            <p class="lh">Bitirdiğinde elinde</p>
            <ol class="pieces"><li>Yeni müşteriye tanışma e-postası</li><li>Toplantı gündemi ve tutanağı</li><li>Tek slaytlı 3 dakikalık sunum</li><li>Tek sayfalık proje raporu</li><li>Koşulları teyit eden e-posta</li><li>Bir şikâyete planlı cevap</li></ol>
            <p class="fnote">Kendi işinden bir iş dosyası.</p>
          </div>
        </div>
        <footer>
          <div class="price"><b>₺5.990</b></div>
          <a class="btn soft" href="${APP}tr" target="_blank" rel="noopener">2 ücretsiz derse başla →</a>
          <a class="btn soft" data-course="business" href="/waitlist/?course=business&amp;lang=tr">Bu kursu istiyorum →</a>
        </footer>
      </article>`;
const FA = `      <article class="course" style="--c:#5B3FD6">
        <header>
          <div class="ch-top"><span class="num">۰۷</span><span class="when" data-sale="soon" data-course="business">۲ درس اول رایگان</span></div>
          <span class="tag light">«خودت را معرفی کن. جلسه را اداره کن. عددها را ارائه بده. توافق را بنویس.»</span>
          <h3>دوره‌ی جامع انگلیسی تجاری</h3>
          <div class="chips"><span>۱۶ درس</span><span>۴ فصل</span><span>حدود ۸ هفته</span><span>B1 → B2</span></div>
        </header>
        <div class="c-body">
          <div class="c-info">
            <p class="lh">برای کی</p><p>کارمندان اداری، مدیران، مهندس‌ها، صادرکننده‌ها و فریلنسرهایی با سطح B1 یا بالاتر که با مشتری، تأمین‌کننده یا همکار خارجی کار می‌کنن. داستان نداره؛ هر درس مستقیم یک مهارت کاری یاد می‌ده.</p>
            <p class="lh">چی یاد می‌گیری</p><p>معرفی خودت و شرکتت، ایمیل‌هایی که جواب می‌گیرن، اداره‌ی جلسه و نوشتن صورت‌جلسه، ارائه‌ی عددها و روندها، گزارش پروژه، مذاکره سر قیمت و شرایط، رسیدگی به شکایت و نوشتن پروپوزال.</p>
          </div>
          <div class="c-get">
            <p class="lh">آخرش چی دستته</p>
            <ol class="pieces"><li>ایمیل معرفی به مشتری تازه</li><li>دستور جلسه و صورت‌جلسه</li><li>ارائه‌ی ۳ دقیقه‌ای با یک اسلاید</li><li>گزارش یک‌صفحه‌ای پروژه</li><li>ایمیل تأیید شرایط توافق‌شده</li><li>جواب یک شکایت همراه با برنامه</li></ol>
            <p class="fnote">یک پرونده‌ی کاری از شغل خودت.</p>
          </div>
        </div>
        <footer>
          <div class="price"><b>۶٬۹۹۰٬۰۰۰</b><span>تومان</span></div>
          <a class="btn soft" href="${APP}fa" target="_blank" rel="noopener">شروع ۲ درس رایگان ←</a>
          <a class="btn soft" data-course="business" href="/waitlist/?course=business&amp;lang=fa">این دوره رو می‌خوام ←</a>
        </footer>
      </article>`;
const insertAfterAi = (s, block, lang) => {
  if (s.includes('data-course="business"')) return s;
  const anchor = `href="/waitlist/?course=ai-internet&amp;lang=${lang}">`; const i = s.indexOf(anchor); if (i < 0) throw new Error('AI block not found');
  const end = s.indexOf('</article>', i) + '</article>'.length;
  return s.slice(0, end) + '\n' + block + s.slice(end);
};
rw('site/dersler/index.html', s => insertAfterAi(s, TR, 'tr'));
rw('site/kelas/index.html', s => insertAfterAi(s, FA, 'fa'));

// 3. waiting-list page: course names
rw('site/waitlist/index.html', s => s.includes("'business':") ? s : s.replace(/(\n\s*'ai-internet':\s*\{[^\n]*\n)/, "$1  'business':    {art:'char-career',      en:'Complete Business English', tr:'Kapsamlı İş İngilizcesi', fa:'دوره‌ی جامع انگلیسی تجاری'},\n"));
console.log('now run: node site-src/build-pages.mjs');
