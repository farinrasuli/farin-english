# FEschool — Professional SEO Strategy

Follows the technical migration (`DOMAIN-MIGRATION-SEO.md`) — that covered the "make the site crawlable and correct" work; this is the actual growth strategy to compete for real Turkish search traffic. No implementation in this file yet except where marked done; this is the plan to review, then execute in the phases at the bottom.

**Honest framing up front:** nothing here can promise a first-page ranking — nobody can, including agencies who claim otherwise. What this plan does is put FEschool in a genuinely strong technical + content + structural position to compete for the searches that actually lead to a booked lesson, and gives a way to measure whether it's working rather than guessing.

---

## 1. Where FEschool already stands (recap, verified against the live site)

**Strong:**
- Structured data already mature: `EducationalOrganization`, `Person`, `Service`, `Course`, `SoftwareApplication`, `FAQPage`, `Article`, `BreadcrumbList`, `WebSite` (see §5 for the 2026-10-08 status). Most competitors in this space have none of this.
- Metadata (titles, descriptions) already differentiated per page and intent-aware, not generic "learn English" copy.
- Positioning already correct: goal-based personalization (VIP roadmap, 100 Doors, FE App, Student Club), not a generic course — this is a real differentiator worth leaning into harder in content, not just the homepage.
- Technical foundation now solid: `thefeschool.com` live, `robots.txt`/`sitemap.xml` correct, canonical URLs consistent. **HTTPS (checked 2026-09-20):** works for visitors, but via Cloudflare, not GitHub Pages. The GitHub Pages certificate is still stuck at `new` and "Enforce HTTPS" is off (the GitHub support ticket of 2026-09-19 was auto-closed, free accounts get no human support). Since 2026-09-19 the Cloudflare orange-cloud proxy + SSL mode Full + Always Use HTTPS serve the site: `https://thefeschool.com/` returns 200 with a valid Let's Encrypt certificate (issued 2026-09-17, expires 2026-12-16, auto-renewed by Cloudflare), `http://` and `www` both 301 to `https://thefeschool.com/`. Do not switch the DNS records back to grey (DNS-only) unless GitHub's own certificate shows `approved`, or HTTPS breaks.

**Gap, and it's the single biggest lever available:** zero content exists for informational/educational search intent. Every page today is a service/commercial page. Someone typing "İngilizce konuşma pratiği nasıl yapılır?" into Google has nothing on `thefeschool.com` to find — that's the single largest missed opportunity, because informational searches vastly outnumber commercial ones and are how most people discover a tutor before they're ready to buy.

---

## 2. Keyword map

One primary keyword per page (no cannibalization), grouped by intent tier.

### Commercial intent — existing service pages

| Page | Primary keyword | Secondary keywords | Intent | Audience |
|---|---|---|---|---|
| `/` (home) | ~~kişiye özel dil eğitimi~~ → **İngilizce öğrenme uygulaması** (see §2b) | ücretsiz İngilizce öğrenme uygulaması, oyunla İngilizce öğrenme | Commercial/brand | App-first since 2026-10-07 |
| `/english.html` | online İngilizce özel ders | birebir online İngilizce dersi, online İngilizce konuşma dersi (see §2g, 2026-11-09) | Commercial | Ready to book, comparing tutors |
| `/spanish.html` | online İspanyolca özel ders | kişiye özel İspanyolca dersi | Commercial | Smaller volume, same intent as English |
| `/german.html` | online Almanca özel ders | Almanca özel ders | Commercial | Smallest volume — keep as-is, low investment |

### Commercial intent — NEW goal-specific pages (see §3 for whether to build)

| Proposed page | Primary keyword | Secondary keywords | Intent | Audience |
|---|---|---|---|---|
| `/is-ingilizcesi` (Business English) | iş İngilizcesi | profesyonel İngilizce, toplantı İngilizcesi, mülakat İngilizcesi | Commercial, career-goal | Professionals, job-seekers |
| `/ielts-hazirlik` (IELTS prep) | IELTS hazırlık | IELTS konuşma, IELTS İngilizce dersi | Commercial, exam-goal | Students, visa/university applicants |
| `/seyahat-ingilizcesi` (Travel English) | seyahat İngilizcesi | yurtdışında İngilizce | Commercial, travel-goal | Travelers, lower urgency/price-sensitivity |

### Educational/informational intent — the content gap (§4 has the actual calendar)

| Topic cluster | Primary keyword | Feeds which service page |
|---|---|---|
| Speaking practice | İngilizce konuşma pratiği nasıl yapılır | `/english.html` (speaking/goal messaging) |
| Learning plans | İngilizce öğrenme planı nasıl oluşturulur | `/` (VIP roadmap concept) |
| IELTS prep | IELTS için nasıl çalışılır | `/ielts-hazirlik` (if built) |
| Common mistakes | İngilizce öğrenirken yapılan hatalar | `/english.html` |
| Speaking anxiety | İngilizce konuşurken çekiniyorum ne yapmalıyım | `/english.html`, Student Club angle |
| HR English (added 2026-10-22, HR = course sale #1) | insan kaynakları İngilizcesi (secondary: İK İngilizce terimler, insan kaynakları uzmanı/müdürü İngilizce, işe alım süreci İngilizce) | `blog/insan-kaynaklari-ingilizcesi.html` (published 2026-10-25; links to `/is-ingilizcesi.html`, which links back from İlgili yazılar). The HR course block on `/is-ingilizcesi.html` (website rGfPTnEZ) should target "İK ve İş İngilizcesi kursu", not this head term. Candidate-side "mülakat soruları" stays with `blog/is-ingilizcesi-mulakat-sorulari.html`. Evidence: autocomplete TR 2026-10-22, in `Claude/tools/seo-audit/content-queue.json` |

These are **directional clusters**, not volume-verified keywords — I don't have a real keyword-volume tool from here. Before committing real writing time, run these through Google Keyword Planner, Ubersuggest, or similar (free tiers exist) to confirm volume and see what Google's own "People also ask" surfaces for each — 20 minutes of real research per cluster, cheap insurance against writing for a keyword nobody searches.

### 2b. Keyword map v2: app-first repositioning (2026-10-07)

The site now leads with the app (best learning techniques, games, personalization). Google autocomplete for Türkiye, pulled 2026-10-07, gives demand signals only, not volumes:

- **Home `/` now owns "İngilizce öğrenme uygulaması"** (secondary: ücretsiz …, oyunla, kişiye özel). Recurring: "ingilizce öğrenme uygulaması ücretsiz", "ingilizce öğrenmek için hangi uygulama daha iyi" (5/28), "en iyi … uygulaması ücretsiz". The old home phrase "kişiye özel dil eğitimi" has no search demand, so it stays as messaging only.
- "kişiye özel İngilizce" and "oyunla İngilizce öğrenme" barely register. They work as messaging, not as title targets. "İspanyolca öğrenme uygulaması ücretsiz" recurs and becomes a secondary on `/spanish.html`.
- English-language head terms ("language learning app", "learn English with games") are out of scope: Duolingo and the like own them, and the audience is wrong.
- Next blog targets, in order, with evidence: `D:/farin/Claude/tools/seo-audit/content-queue.json`. They cover which app is best, the free level test (126 suggestions for the seed), vocabulary games, durable vocabulary (spaced review), ChatGPT speaking practice, and graded stories.
- On-page rules for the redesign: `site/SEO-HANDOFF-REDESIGN.md`.

**Automation:** `D:/farin/Claude/tools/seo-audit/` holds a weekly live audit (Windows task "FEschool SEO Audit"), a sitemap `lastmod` builder, and the content queue. These open Trello cards on new errors or a missed 14-day blog cadence. See the README there.

---

### 2c. Keyword map v3: sprint 2026-10-29 (winnable long-tail, TR + FA)

Rule: a new small domain should target queries where page 1 is thin or off-language. These are not head terms. Evidence is a WebSearch SERP look on 2026-10-29 (directional, not Google TR/IR SERPs, no volumes).

| Page | Primary query | SERP evidence | Feeds |
|---|---|---|---|
| `/blog/ielts-writing-task-2-puanlama.html` | ielts writing task 2 puanlama (değerlendirme kriterleri) | IDP, ielts.international, 3d-universal, foreign pages; few TR articles | `/ielts-hazirlik.html#ielts-kursu` |
| `/blog/ielts-general-training-mektup.html` | ielts general training mektup (writing task 1) | IDP TR, 3d-universal, ielts.international | `/ielts-hazirlik.html#ielts-kursu` |
| `/fa/blog/estelahat-manabe-ensani-englisi.html` | اصطلاحات منابع انسانی به انگلیسی | abadis dictionary, FAO, English pages: **no Persian article** | `/fa/#kurs-is` (HR course) |
| `/fa/blog/moarefi-khod-mosahebe-englisi.html` | معرفی خود در مصاحبه کاری به انگلیسی | only English pages (resumelab, flexjobs…) | `/fa/#kurs-mulakat` |
| `/fa/blog/nameh-nevisi-ielts-general.html` | نامه نویسی آیلتس جنرال | only IDP pages | `/fa/#kurs-ielts` |
| `/blog/is-ingilizcesi-mulakat-sorulari.html` (retitled) | ingilizce mülakat soruları ve cevapları | job portals (yenibiris, kariyer, secretcv): hard; GSC already shows it at pos 69–77 | `/is-ingilizcesi.html` |
| `/is-ingilizcesi.html` (retitled) | online iş ingilizcesi kursu | seen in GSC (1 impr, pos 80) | HR course + classes |

Not chased (owned by big players): "online ingilizce özel ders fiyatları" (armut.com city pages fill the SERP; marketplaces are the lever there, see LINK-BUILDING §F3), "iş görüşmesinde ingilizce kendini tanıtma" (TR job portals). hreflang pairs: TR HR ↔ FA HR post, TR GT letter ↔ FA GT letter.

### 2d. FA course landing pages (2026-11-07)

Before this, Persian searchers had no indexable page that sells a course. The `/fa/c/` sale pages are noindex. Evidence and the courses I skipped are in `keyword-research/README.md` (last section) and `fa-course-pages.csv`.

| Page | Primary query | Secondary | Sells (CTA) |
|---|---|---|---|
| `/fa/dore-ielts-online.html` | دوره آیلتس آنلاین | آزمون آزمایشی آیلتس آنلاین, آمادگی آیلتس در خانه, آیلتس جنرال برای کانادا | `/fa/c/ielts.html`. hreflang pair with `/ielts-hazirlik.html` |
| `/fa/dore-zaban-englisi-tejari.html` | دوره زبان انگلیسی تجاری | کلاس زبان انگلیسی تجاری, آموزش انگلیسی تجاری و بازرگانی, دوره مکاتبات تجاری به زبان انگلیسی | `/fa/c/business.html` |
| `/fa/dore-englisi-manabe-ensani.html` | آموزش زبان تخصصی منابع انسانی | زبان تخصصی مدیریت منابع انسانی, دوره انگلیسی منابع انسانی | `/fa/c/hr.html` |
| `/fa/amadegi-mosahebe-kari-englisi.html` | آمادگی مصاحبه کاری به انگلیسی | سوالات رایج در مصاحبه شغلی به زبان انگلیسی, آموزش مصاحبه شغلی به زبان انگلیسی | `/fa/c/interview.html` |

No cannibalisation: the 3 FA posts keep their informational queries, and each one now links to its course page. Each page shows the price exactly as its sale page does. The `Course` JSON-LD offer is the first-20 price in IRR (toman x 10). **When the first-20 offer ends, update the `/fa/c/` page, the visible price card and the JSON-LD on these pages together.**

### 2e. TR long-tail guides (2026-11-09)

Five question-style guides near the courses we sell. Each one ends with a course panel chosen by `<meta name="fe-offer">`. Evidence is Türkiye autocomplete from 2026-11-09 (`keyword-research/README.md`, last section, and `tr-guides-2026-11.csv`). It is a demand signal, not volume.

| Page | Primary query | Secondary | Panel / service link |
|---|---|---|---|
| `/blog/ingilizce-cv-nasil-yazilir.html` | ingilizce cv nasıl yazılır | ingilizce cv'de adres / şirket isimleri / üniversite / devam ediyor / askerlik durumu / referans nasıl yazılır, cv ingilizce mi türkçe mi | mulakat · `/is-ingilizcesi.html` |
| `/blog/ingilizce-resmi-mail-kaliplari.html` | ingilizce resmi mail kalıpları | mail bitirme kalıpları, resmi mail nasıl bitirilir, mail başlangıç cümleleri, iş maili örneği | is · `/is-ingilizcesi.html` |
| `/blog/ielts-kac-puan-yeterli.html` | ielts kaç puan yeterli | ielts puanı nasıl hesaplanır / kaç üzerinden / kaç yıl geçerli, kaç puan hangi seviye, academic mi general mı | ielts · `/ielts-hazirlik.html#ielts-kursu` |
| `/blog/ingilizce-toplanti-kaliplari.html` | ingilizce toplantı kalıpları | toplantı açılış konuşması örnekleri, toplantı tutanağı İngilizce, online toplantı cümleleri | is · `/is-ingilizcesi.html` |
| `/blog/ingilizce-small-talk-ornekleri.html` | ingilizce small talk örnekleri | ingilizce sohbet başlatma, günlük sohbet cümleleri, small talk ne demek | konusma · `/english.html#paketler` |

Cannibalisation calls: "cv ingilizce seviyesi nasıl yazılır" stays with `ingilizce-seviyemi-nasil-anlarim.html`, and the CV guide links there. "ielts writing puanı nasıl hesaplanır" stays with `ielts-writing-task-2-puanlama.html`. HR-specific e-mails (job ads, rejections, policy) stay with `insan-kaynaklari-ingilizcesi.html`. Formal letters for the exam stay with `ielts-general-training-mektup.html`. "Academic mi General mı" had too little demand for its own page (3/1), so it is a section of the IELTS score guide. Runner-up for the next TR guide is "ingilizce sunum kalıpları / nasıl yapılır", which needs a business angle because many of its hits are school homework.

### 2f. FA long-tail guides (2026-11-09)

Five Persian guides for informational queries close to what we sell. Evidence and the topics I skipped (meeting phrases, presentations, small talk) are in `keyword-research/README.md` (last section) and `fa-guides.csv`. Each guide links in its body to the matching indexable FA course page, and its end panel (`fe-offer`) sells the matching course.

| Page | Primary query | Secondary | Feeds (body link / panel) |
|---|---|---|---|
| `/fa/blog/neveshtan-rezume-englisi.html` | نوشتن رزومه کاری به انگلیسی | نمونه رزومه انگلیسی برای کار, نمونه کاور لتر انگلیسی برای کار | `/fa/amadegi-mosahebe-kari-englisi.html` / mulakat |
| `/fa/blog/email-rasmi-englisi.html` | ایمیل رسمی به انگلیسی | نمونه ایمیل رسمی انگلیسی به شرکت, جواب ایمیل دعوت به مصاحبه | `/fa/dore-zaban-englisi-tejari.html` / is |
| `/fa/blog/mokaleme-telefoni-englisi.html` | مکالمه تلفنی به انگلیسی | مکالمه تلفنی انگلیسی با ترجمه فارسی, اصطلاحات تماس تلفنی به انگلیسی | `/fa/dore-zaban-englisi-tejari.html` / is |
| `/fa/blog/ielts-general-ya-academic.html` | آیلتس جنرال یا آکادمیک | تفاوت آیلتس جنرال و آکادمیک, آیلتس جنرال سخت تره یا آکادمیک, … برای اپلای / استرالیا | `/fa/dore-ielts-online.html` / ielts |
| `/fa/blog/nomre-ielts-mohajerat.html` | نمره آیلتس برای مهاجرت (کانادا، استرالیا) | حداقل نمره آیلتس برای مهاجرت به کانادا, نمره آیلتس برای مهاجرت کاری به انگلستان | `/fa/dore-ielts-online.html` / ielts |

No cannibalisation: the GT letter post keeps «نامه نویسی آیلتس جنرال»; the IELTS course page keeps the commercial «دوره آیلتس آنلاین / آیلتس جنرال برای کانادا»; the two IELTS guides split choice-of-test from score requirements and link to each other. The self-intro post keeps «معرفی خود در مصاحبه»; the resume guide links to it. **The immigration guide carries official numbers with dates (IRCC page 2026-10-16, Home Affairs and GOV.UK checked 2026-11-09). Re-check them whenever IRCC, Home Affairs or GOV.UK change their pages, and at least every 3 months.**

### 2g. Live online classes, TR + FA (2026-11-09)

Farin: people looking for English classes or learning English should find the site. The pages that list the classes (`/dersler/`, `/kelas/`) are noindex campaign pages and stay that way, so each language gets one indexable class page. Evidence: Türkiye + Iran autocomplete in `keyword-research/README.md` (last section) and the four `live-classes-*` CSVs. Demand signal only.

| Page | Primary query | Secondary | Links in |
|---|---|---|---|
| `/english.html` (rewritten top: H1, how it works, packages with the 3-month line, 6-question FAQ + `FAQPage`, `Service` + `Course` offers incl. the two 3-month prices) | online ingilizce özel ders | birebir online İngilizce dersi, online İngilizce konuşma dersi, İngilizce özel ders online yetişkinlere | footer (every TR page), the homepage general live-lesson card, in-body from 7 TR guides (konuşma korkusu, konuşma pratiği, yapılan hatalar, öğrenme planı, hangi uygulama, seviyemi, özel ders fiyatları) |
| `/fa/kelas-zaban-englisi-online.html` (new) | کلاس زبان انگلیسی آنلاین | قیمت کلاس خصوصی زبان انگلیسی آنلاین, کلاس مکالمه زبان انگلیسی آنلاین, برای بزرگسالان | the /fa/ live-class card (build-pages `LIVES.*.pageFa`, so every FA `fe-offer` panel carries it too), in-body from 6 FA pages (business, HR and interview course pages; self-intro, phone and formal-email guides) |

Cannibalisation calls: "online ingilizce özel ders fiyatları" stays with `blog/online-ingilizce-ozel-ders-fiyatlari.html` (no "fiyat" in the english.html title/H1; the post now links to the page with the "online İngilizce özel ders" anchor). "online ingilizce kursu" ranks above "özel ders" in autocomplete but is platform/course-shopping intent; not chased on english.html (homepage title proposal in the 11-09 report, not applied). FA: the /fa/ homepage title also says «کلاس و دوره‌ی آنلاین زبان انگلیسی»; watch in GSC which URL Google shows for «کلاس زبان انگلیسی آنلاین», and if the homepage keeps taking it, drop «کلاس» from the homepage title (farin-website, build-pages). «کلاس زبان انگلیسی تجاری» is still listed as a secondary of the self-paced business course page (§2d); the new page names the live business class in an H3 only. Prices on both pages are copied from `business/farin-monetization/08-final-prices.md` (2026-10-29 decisions) and match `/dersler/`, `/kelas/` and the homepages; **when a class price, pack or discount changes, update both pages, their FAQ text and their JSON-LD together.**

### 2h. GSC quick wins, same URLs (2026-11-09, Trello dMtWXwgn)

Source: Farin's Search Console export (3 months to 2026-11-07). Real positions, not volumes. No new pages: the three posts that already get impressions were expanded toward the queries Google already tests them for.

| Page | Primary query (GSC position before) | What changed | Links in (new) |
|---|---|---|---|
| `/blog/insan-kaynaklari-ingilizcesi.html` | insan kaynakları İngilizcesi (page avg 12.2; "insan kaynakları ingilizce" 24) | H1 names kısaltmalar; new HR abbreviations table ("insan kaynakları kısaltması" appeared in GSC); terms split by HR process (7 tables); offer + announcement phrase sets; 4 more Turkish-speaker mistakes; 6-question FAQ + `FAQPage` | CV guide (job-title bullet), meetings guide, `/is-ingilizcesi.html` HR course block (#ik-kursu) |
| `/blog/is-ingilizcesi-mulakat-sorulari.html` | ingilizce mülakat soruları ve cevapları (60-77; also "… pdf", "… test soruları", "soru cevap") | 20 questions with English model answers + Turkish "neden işe yarıyor / sık hata" notes; STAR section; honest test section (company English assessments, link to the level guide); printable checklist (print CSS already hides header/offer; no fake PDF); 6-question FAQ + `FAQPage` | existing: CV guide, HR post, `/is-ingilizcesi.html` related; listing anchors refreshed to "… ve cevapları" |
| `/blog/ingilizce-konusma-pratigi-nasil-yapilir.html` | evde ingilizce konuşma pratiği (19.7) + ingilizce konuşma refleksi (16) | H1 "Evde … Nasıl Yapılır? 10 Yöntem"; methods grouped under one "Evde İngilizce konuşma pratiği için 10 yöntem" H2; new 15-minute daily routine H2; refleks H2 renamed "İngilizce konuşma refleksi nasıl kazanılır?" + self-check drill; 5-question FAQ + `FAQPage` | links out to the small-talk + düşünmek guides (existing + routine + FAQ) |

Not targeted: "refleks ingilizce konuşma" (a competitor brand). Re-check in the next GSC export (~2026-11-23). If the HR post reaches page 1 for the head term, the next lever is the HR course page and the FA HR pair. If the interview post stays past position 30, job portals own that SERP and the Job Interview course landing (Loop 2) should carry the commercial intent instead.

### 2i. TR course pages for the 5 premium courses (2026-11-09, Loop 2, Trello CrWzf1ai)

Turkish searchers had indexable course pages only for HR (inside `/is-ingilizcesi.html`) and IELTS. Evidence (Türkiye autocomplete, 2,000 seed queries + 48 stem probes) and the reasoning per course are in `keyword-research/README.md` (last section), `tr-courses-2026-11.csv` and `tr-courses-stems-2026-11.csv`. Demand signal only.

| Page | Primary query | Secondary | Sells (CTA) | hreflang |
|---|---|---|---|---|
| `/ingilizce-mulakat-hazirligi.html` | ingilizce mülakat hazırlığı | mülakata hazırlık eğitimi, mülakat İngilizcesi kursu, mülakat pratiği | interview: free Lesson 1.1 (app) + waiting list | ↔ `/fa/amadegi-mosahebe-kari-englisi.html` |
| `/dis-ticaret-ingilizcesi.html` | dış ticaret İngilizcesi eğitimi | dış ticaret İngilizcesi, ticari İngilizce kursu, satış / ihracat İngilizcesi, İngilizce fiyat teklifi | sales | none (no FA page) |
| `/ingilizce-prompt-yazma.html` | ingilizce prompt yazma | prompt yazma eğitimi / kursu, ChatGPT İngilizce prompt | ai-internet | none |
| `/ingilizce-metin-yazarligi.html` | ingilizce metin yazarlığı (copywriting) | İngilizce içerik üretmek, pazarlama İngilizcesi | marketing | none |
| `/is-ingilizcesi.html#kapsamli-kurs` (new section, not a page) | online iş İngilizcesi kursu (the page already owns it) | iş İngilizcesi kursu / eğitimi, iş İngilizcesi online eğitim | business | none |

Cannibalisation calls: "ingilizce mülakat soruları ve cevapları" stays with the blog guide. The course page links to it with that anchor, and the guide now links to the course page with "İngilizce mülakat hazırlığı kursu". "ingilizce iş görüşmesi kendini tanıtma" stays with the guide. Complete Business gets no page of its own, because every buyer phrase for it is the head term `/is-ingilizcesi.html` already owns. "yapay zeka ingilizcesi" (word translation) and "yapay zeka ile ingilizce öğrenme" (learning with AI) are not targeted.

**Keep each page exact to the app:** prices from `build-pages.mjs` (₺1.290 / ₺1.690 / ₺1.690 / ₺1.690 / ₺5.990, also in each `Course` JSON-LD), only Lesson 1.1 free, waiting list for the rest, 12 months' access, completion certificate after the final project. The interview page states no lesson count, because the course is being extended from 9 to 11 lessons. When a price, the sale model or a course changes, update the page, its FAQ and its JSON-LD together (plain static HTML, no build step; re-run `reshell-content.mjs` after editing).

Links in: the TR homepage (course names in the "Ayrıca" rows, and "Kurs detayları →" on the interview card, via `build-pages.mjs` `also[7]` / `pageTr`), so every TR guide with the `is` panel carries them too; `/is-ingilizcesi.html`; in-body links from the interview Q&A, CV, formal e-mail, meetings and speaking-practice guides.

## 3. Page architecture decision

Per the "don't build thin pages" principle — only building what earns its keep:

**Build:**
- A `/blog/` (or `/rehber/`, "guide" reads slightly more premium in Turkish than "blog") for the educational cluster in §2. This is the one confidently-justified addition — real intent, zero current coverage, directly feeds existing service pages.

**Build only if career/exam traffic is a meaningful share of actual students** (check WhatsApp inquiry history or ask returning students how they found FEschool before investing here):
- `/is-ingilizcesi`, `/ielts-hazirlik` — genuinely distinct enough search intent from the general English page to justify their own page, but only worth the content-writing effort if this is a real acquisition channel, not a hypothetical one.

**Don't build (yet):** separate pages for "Travel English," "Daily English," "Speaking English" as their own URLs — the existing `/english.html` already covers these as sections with real content; splitting them into thin, mostly-duplicate pages this early would cannibalize the very page currently ranking for these terms, for a traffic gain that isn't proven yet.

---

## 4. Content calendar — first 90 days

Six articles, cadence of roughly one every 2 weeks, each following the brief's own template (intent, keyword, useful answer, internal link, one CTA — not a sales pitch dressed as an article):

| # | Title (draft) | Target keyword | Internal link to |
|---|---|---|---|
| 1 | İngilizce Konuşma Pratiği Nasıl Yapılır? Evde Uygulanabilir 7 Yöntem | İngilizce konuşma pratiği nasıl yapılır | `/english.html` speaking section |
| 2 | Kendine Özel Bir İngilizce Öğrenme Planı Nasıl Oluşturulur? | İngilizce öğrenme planı nasıl oluşturulur | `/` VIP roadmap section |
| 3 | İngilizce Konuşurken Çekiniyor musun? Bunun Gerçek Bir Nedeni Var | İngilizce konuşma korkusu | Student Club / 100 Doors game angle |
| 4 | İngilizce Öğrenirken Yapılan 9 Yaygın Hata (ve Nasıl Düzeltilir) | İngilizce öğrenirken yapılan hatalar | `/english.html` |
| 5 | IELTS Speaking'e Nasıl Hazırlanılır? Gerçekçi Bir Çalışma Planı | IELTS speaking nasıl hazırlanır | `/ielts-hazirlik` if built, else `/english.html` |
| 6 | Hedefe Göre İngilizce Öğrenmek Neden Daha Hızlı Sonuç Verir? | hedefe göre İngilizce öğrenme | `/` positioning piece, ties to brand |

Each article: 800–1,200 words, real answer first (not buried under intro fluff), one relevant internal link, one soft CTA at the end (not mid-article), written in the site's existing direct/warm Turkish voice — not translated-from-English AI copy, which Google's own guidance now actively deprioritizes ("helpful content" system).

**Published 2026-09-28 — 2 more articles**, per the autocomplete-based keyword check in `site/keyword-research/README.md` (Trello card LDcyi5y3):

| # | Title | Target keyword | Internal link to |
|---|---|---|---|
| 7 | Online İngilizce Özel Ders Fiyatları (2026): Ne Kadar Olmalı, Neye Bakmalı? | online İngilizce özel ders fiyatları | `/english.html#paketler` (only references FEschool's own already-published prices, no invented figures) |
| 8 | İş İngilizcesi Mülakat Soruları ve Nasıl Cevaplanır | iş İngilizcesi mülakat soruları | `/is-ingilizcesi.html#kapsam` |

**Published 2026-10-10 — article 9** (content-queue item 1, Trello 7qJudVsb; SERP checked 2026-10-10 = listicles: tamindir, Lemon Academy, listelist, papora):

| # | Title | Target keyword | Internal link to |
|---|---|---|---|
| 9 | İngilizce Öğrenmek İçin Hangi Uygulama Daha İyi? Seçmeden Önce Bakman Gereken 6 Şey | ingilizce öğrenmek için hangi uygulama daha iyi | `/#sana-gore` (homepage personalization section; home owns "İngilizce öğrenme uygulaması", the post owns the question query) |

Angle: honest selection criteria instead of a ranking; no competitor names, no stats. FE App claims limited to the marketing-brief claim ledger (free, no card, ≤3 goals + level + topics, roadmap, games at every stop, review rounds, Chapter 1 of courses free, Android + iPhone browser).

**Published 2026-10-14, article 10** (content-queue item 2; plan `SEO-FOCUS-2026-10.md`, kept out of git):

| # | Title | Target keyword | Internal link to |
|---|---|---|---|
| 10 | İngilizce Seviyemi Nasıl Anlarım? A1'den C1'e Seviyeler ve Ücretsiz Testler | ingilizce seviyemi nasıl anlarım | `/english.html#paketler` (free İlk Adım lesson) |

Autocomplete TR 2026-10-14: "ingilizce seviyemi nasıl anlarım" 5, "seviye tespit sınavı ücretsiz/online" 5 each. No in-app level-test claim: the learner onboarding uses a self-reported level since 2026-09-29 (the adaptive test is admin-only). Cites Cambridge Test your English, EF SET, EnglishScore.

Also applied the same pass's "cheap wins": retitled/led article #3 around "İngilizce anlıyorum ama konuşamıyorum" (the actual query, not "çekiniyorum"), added "çalışma programı" wording to article #2, added a ChatGPT/AI-practice section to article #1.

**Published 2026-10-28, article 12** (Trello Qd1BaPIK; draft from the paused 10-15 run):

| # | Title | Target keyword | Internal link to |
|---|---|---|---|
| 12 | İngilizce Düşünmek Nasıl Olur? Kafanda Çeviri Yapmadan Konuşmak | ingilizce düşünmek (secondary: ingilizce düşünmek nasıl olur, türkçe düşünmeden / kafada çeviri yapmadan İngilizce konuşmak) | `/english.html#yontem` |

Cannibalization call: "ingilizce konuşma refleksi" / "refleks ingilizce konuşma" stay with article #1 (konuşma pratiği). GSC 10-01..10-26 shows them on that post only (9 impr pos 16.4, 4 impr pos 12.8), its only non-brand queries near page 1, and the TR SERP for "konuşma refleksi" is generic speaking-practice pages (papora, speakshark). So the new post was retargeted before publishing: slug `ingilizce-dusunmek-nasil-olur` (not `...-konusma-refleksi`), "refleks" removed from title/H1/meta keywords/H2, and the anchors pointing to it say "İngilizce düşünmek", not "konuşma refleksi". The TR SERP for "ingilizce düşünmek nasıl olur" was mostly English-language pages (Rachel's English, FluentU) on 2026-10-28: directional sign of a thin Turkish answer set, not a volume figure. Re-check in GSC by 2026-11-25: if #1 loses the refleks queries to #12, move the refleks wording back into #1 only.

---

## 5. Structured data to add

Current: `EducationalOrganization`, `Person`, `Service`, `SoftwareApplication`, `FAQPage` — keep as-is, all accurate.

**Add:**
- `WebSite` node on the homepage (enables sitelinks searchbox eligibility — low cost, real upside).
- `BreadcrumbList` on `/english.html`, `/spanish.html`, `/german.html`, and any future `/blog/` posts.
- `Article` schema on each blog post once §4 is built (author, datePublished, headline).
- `BreadcrumbList` + `Article` combo also helps blog posts get the "how-to"/FAQ-style rich result treatment where the content genuinely is a how-to (article #1 and #5 in the calendar are strong candidates).

**Status 2026-10-08 (Trello Orkb8jpq):** all of the above is live, plus:
- Homepage `EducationalOrganization` (`/#fe-school`) now carries `logo` (icon-512, 512x512), `image`, `description`, `alternateName`, `areaServed`, `contactPoint` (WhatsApp URL + e-mail, no raw phone number) and `sameAs` (the footer's Instagram). `WebSite` got `inLanguage` + `publisher`.
- `Course` (`#kurs`) on the 5 lesson pages (`english`, `spanish`, `german`, `is-ingilizcesi`, `ielts-hazirlik`), instructor `/#farin`, `courseMode` Online, offers = the 4 published packages (İlk Adım free, ₺3.400 / ₺6.720 / ₺9.960). Every value is copied from the page itself. No lesson duration or `courseSchedule`/`courseWorkload` is published because the site doesn't state one ("Süre ve sıklığı birlikte belirleriz"), so Google's Course-info rich result may still call those fields missing. That is deliberate. Don't invent them; add them only if Farin fixes a lesson length on the page.
- `Article` on all 8 posts now has `@id`, `description` (= meta description), `inLanguage`, author `@id` `/#farin`, publisher `EducationalOrganization` with logo, `mainEntityOfPage` as `WebPage`, `isPartOf` `/blog/`.

**Do not add:** `AggregateRating`/`Review` schema unless real, collected reviews exist — the brief and Google's own spam policies are both explicit here, and it's genuinely not worth the risk of a manual action.

---

## 6. Internal linking plan

- Every future blog post links to exactly one relevant service page (hub-and-spoke, not link-everything-to-everything).
- Service pages get a small "İlgili Yazılar" (related articles) block once 2+ posts exist per topic — not built until there's real content to link, to avoid empty/broken sections.
- Footer gets a "Rehber" (Guide) link once `/blog/` exists.

---

## 7. Off-page / local authority (not started, real decision needed)

- **Google Business Profile: not eligible (corrected 2026-10-14).** Google's guidelines (support.google.com/business/answer/3038177) only allow businesses that have a location customers visit or that travel to customers. An online-only school does not qualify; a profile risks suspension. The earlier "service area business, worth doing" advice here was wrong. Revisit only if Farin starts teaching in person somewhere.
- **Backlinks** (2026-10 execution list: `LINK-BUILDING-2026-10.md`, kept out of git): no artificial link-building (paid links, directories, PBNs) — these carry real penalty risk and the brief explicitly rules them out. Legitimate options: a guest post or interview on a Turkish language-learning or expat-focused blog, a listing on legitimate language-school directories (iTutor-style comparison sites), being mentioned by a former student's own blog/social post (can't be manufactured, but worth asking happy students if they'd share).
- **Social signals**: Instagram is already linked in the footer — consistent posting there doesn't directly move rankings, but drives the kind of branded-search volume ("FEschool İngilizce") that does help.

---

## 8. Measurement & KPIs (once GSC + analytics are live per DOMAIN-MIGRATION-SEO.md §15/§16)

Track monthly, not daily (SEO is slow, daily noise is not signal):
- GSC: total impressions/clicks, average position for the keyword map's primary terms, coverage errors.
- Which specific queries are already getting impressions but zero clicks — these are "almost there" opportunities (usually a title/meta fix, not new content).
- Blog posts: which one earns the first backlink or the first real click-through from a "People also ask" box — that's the signal to double down on that content type.

No vanity metrics (raw traffic alone) — track query-level movement on the actual keyword map in §2, since that's what ties back to bookings.

### 8b. Search Console log (real observations only)

- **2026-10-08, Farin (manual, Search Console UI, me card BusjmGHy):** requested indexing for 7 URLs, all show "Indexing requested", no quota hit: `/`, `/english.html`, `/is-ingilizcesi.html`, `/ielts-hazirlik.html`, `/blog/`, `/blog/ingilizce-konusma-pratigi-nasil-yapilir.html`, `/blog/online-ingilizce-ozel-ders-fiyatlari.html`. `is-ingilizcesi.html` was already indexed (the Pages report lags). The speaking-practice post showed "URL is unknown to Google" before the request.
- **2026-10-08, farin-seo (URL Inspection API, same day, after Farin's requests):** indexed = `/`, `/is-ingilizcesi.html`, `/blog/` (3/17). Crawled today, not indexed yet: `/english.html`, `/ielts-hazirlik.html`, and the speaking-practice post (crawled 09:27 UTC, so the request worked). Discovered, not crawled: `german`, `konusma-korkusu`, `hedefe-gore`, `ozel-ders-fiyatlari`. Still "unknown to Google": `spanish`, `studio`, `ogrenme-plani`, `yapilan-hatalar`, `ielts-speaking`, `is-ingilizcesi-mulakat`, `gizlilik-politikasi`. Sitemap: 17 submitted, last downloaded 2026-10-05, 0 errors.
- **Why the speaking post was unknown (checked):** it is in `sitemap.xml` and has 8 internal links, including one from the homepage. So the cause is not a missing sitemap entry or an orphan page. It is crawl lag on a young domain: Google downloaded the sitemap but hasn't queued most of its URLs yet. Every sitemap URL has 2–16 internal inlinks; the weakest are `ielts-speaking` and `is-ingilizcesi-mulakat` (2 each). Next lever if they stay unknown: more contextual links from indexed pages (`/blog/`, `/is-ingilizcesi.html`), not more sitemap pings.
- **Crawl hygiene fixed 2026-10-08 (Trello oQbWyB3K, 7PhBeJf8):** all internal `index.html` links now point at the canonical `/` and `/blog/` (48 links: 8 `blog/index.html`, 22 `../index.html` incl. 3 with anchors, 16 blog-folder `index.html`, 2 on the privacy page). robots.txt disallows `/cdn-cgi/l/` (Cloudflare e-mail obfuscation, always 404). Added `/favicon.ico` (it was 404). **Expected 404s, leave them alone:** old app assets under `/app/` (`manifest.json`, `farin-sw.js`, icons, audio). The app left this domain on purpose (HARD RULE in `Claude/entities.md`). Only the `/app/*.html` redirect stubs stay. `/site/*` is a duplicate copy that the deploy produces; it carries canonicals to the root and nothing links to it.

- **2026-10-14, farin-seo (Search Console API):** 28 days to 10-11: 0 clicks, 33 impressions, avg position 16.0 (27 impressions from Türkiye). Indexed 8/18: `/`, `/english.html`, `/is-ingilizcesi.html`, `/ielts-hazirlik.html`, `/blog/`, speaking post, app post, `/gizlilik-politikasi.html`. Not fetched yet: spanish, german, studio + 7 posts. Only non-brand impressions: speaking post ("refleks ingilizce konuşma" pos 12.8, "ingilizce konuşma refleksi" 21.5). Cause: indexed service pages linked to no posts. Same day: related-posts blocks on the 3 service pages (farin-website), contextual links + a "konuşma refleksi" section (farin-seo), article 10 published.

- **2026-10-21, farin-seo (Search Console API, Trello KFMhJJT5):** 28 days 09-22..10-19: 5 clicks (first clicks ever, 10-17/10-18, all on `/`), 57 impressions, avg position 21.8. Of the 7 URLs that were "unknown" on 10-08, 5 are now indexed (spanish, studio, ielts-speaking, is-ingilizcesi-mulakat, gizlilik-politikasi; crawled 10-13..10-15). Still unknown: `ingilizce-ogrenme-plani`, `ingilizce-ogrenirken-yapilan-hatalar`, `german`; `hedefe-gore` is "Discovered, not indexed". Fix applied: one contextual in-body link to each blog straggler from indexed posts (seviyemi + fiyatlari → ogrenme-plani, ielts-speaking → yapilan-hatalar, mulakat → hedefe-gore). `german` is linked from every page's nav already, so no new link; watch it. Duplicate `/site/*` copy and the public `.md` docs are all "unknown to Google" (no leak into the index).
- **2026-10-28, farin-seo (Search Console API, real numbers):** 2026-10-01..10-26: 6 clicks, 82 impressions (Türkiye 6 / 73). September 1-30: 0 clicks, 8 impressions. Clicks: `/` 5 (brand), `/studio.html` 1. Mobile 6 clicks / 40 impr at pos 13.0; desktop 0 / 39 at pos 48.7. Non-brand impressions now on 3 posts: konuşma pratiği (30 impr, "ingilizce konuşma pratiği" pos 65, "ingilizce konuşma refleksi" 16.4), mülakat soruları (8 impr, pos ~70), seviyemi (3). GSC data lags ~2 days.
- **2026-10-21, brand entity (Trello tsxpN5Rx):** homepage `sameAs` = @the_feschool + LinkedIn company page (retired @fariinrasouli removed; the footer links were already correct), `WebSite.alternateName` = FEschool / The FE School / thefeschool, `SoftwareApplication` name "FE App" (alternateName "Farin English"). Track "fe school"/"feschool" positions (10-21: "fe school" pos 6.0, "fe english" 6.0, 2 impressions each).
- **2026-11-09, farin-seo (Farin's GSC export, 3 months to 11-07, Trello dMtWXwgn):** 8 clicks / 183 impressions, impressions ~5x up in early November; Türkiye 128 impr at avg pos 29; Iran 14 impr at pos ~5. Near page 1: HR post (18 impr, pos 12.2), `/english.html` (17 impr, pos 11.2). Interview post 17 impr at pos 64 (10 interview queries at 60-77). Speaking post 41 impr at pos 41.6 ("evde ingilizce konuşma pratiği" 19.7, "ingilizce konuşma refleksi" 16). Action: §2h.

---

## 9. Phased roadmap

- **Phase 1 (done)**: technical foundation — domain, HTTPS (via Cloudflare proxy, see §1), sitemap/robots, structured-data audit.
- **Phase 2 (next, low effort)**: `WebSite`/`BreadcrumbList` schema additions (§5); privacy-policy title fix (carried over from the migration blueprint).
- **Phase 3**: build `/blog/` structure (one template, matching site design) + publish articles 1–2 from §4.
- **Phase 4**: ~~Google Business Profile~~ (not eligible, see §7) + GSC query monitoring to see which of articles 1–2 are gaining traction before writing 3–6.
- **Phase 5**: decide on `/is-ingilizcesi`/`/ielts-hazirlik` (§3) based on real inquiry-source data, not assumption.
- **Phase 6**: ongoing — one article every 2 weeks, review GSC monthly, adjust the keyword map based on what's actually getting impressions.

---

## 10. Needs your action

- Confirm GSC + analytics are set up (per `DOMAIN-MIGRATION-SEO.md`) — everything in §8 depends on this.
- Spend ~20 minutes running the §2 keyword clusters through a real keyword tool (Google Keyword Planner is free) before I write article copy — confirms these are worth the writing time.
- Decide: do you want to write the blog articles yourself (I can draft, you edit for voice), or should I draft them end-to-end for your review each time?
- ~~Google Business Profile~~: not eligible for an online-only school (see §7, corrected 2026-10-14).
- Tell me whether career/exam inquiries are common enough to justify §3's new pages, or if I should hold off.
