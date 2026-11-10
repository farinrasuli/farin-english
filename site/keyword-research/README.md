# Keyword research — thefeschool.com (2026-09-19)

## What this is (and isn't)

**Not** Google Keyword Planner numbers — that tool needs a logged-in Google Ads account.
Instead this is **Google autocomplete data for Türkiye** (`hl=tr`, `gl=tr`): every seed
term in `SEO-STRATEGY.md` §2 was queried with 22 suffix variants (a–z letters, "nasıl",
"fiyat", "online"…) and the suggestions collected.

- **`autocomplete_hits`** = how many of those variant queries returned the phrase. Higher
  = Google offers it more consistently = more people type it. It is a **demand proxy, not
  a monthly search count**, and it says nothing about competition.
- One CSV per cluster, sorted by hits. UTF-8 with BOM (opens correctly in Excel/Sheets).
- Raw pull could be re-run any time; if real volumes are wanted later, paste the top
  phrases from these CSVs into Keyword Planner (much quicker than starting from scratch).

## What the data says

| Cluster | Signal | Read |
|---|---|---|
| Commercial — English tutoring | **"online ingilizce özel ders fiyatları"** is the strongest phrase in the whole pull (5 hits; also city/hourly/2026 variants). "kişiye özel İngilizce" barely shows up. | People shopping for tutors search **price**, not "kişiye özel". Home/English pages don't answer price at all. |
| Commercial — Spanish / German | "ispanyolca / almanca özel ders **fiyatları**" again dominant; German has competitor brand queries. | Same price-first pattern; small volume, keep low investment. |
| Commercial — home ("kişiye özel dil eğitimi") | Almost nothing except competitor brand names. | This is a brand-positioning phrase, not a search term. Don't build content around it. |
| Goal — business English | "online iş İngilizcesi kursu" (5), "iş İngilizcesi **mülakat soruları**" (3), "mülakat İngilizcesi" | Real career-intent demand; interview questions is the concrete, answerable one. |
| Goal — IELTS | "IELTS hazırlık kursu/online/ücretsiz", "IELTS konuşma soruları", "IELTS için konuşma alıştırma soruları" | Steady but low-hit; speaking questions is the FEschool-relevant angle. |
| Goal — travel | "seyahat İngilizcesi nasıl öğrenilir", "yurtdışında kullanılacak İngilizce cümleler" | Present but diffuse (many hits are about teaching/studying abroad). Confirms §3: don't build a travel page yet. |
| Info — speaking practice | **"evde İngilizce konuşma pratiği nasıl yapılır" (10)**, "ChatGPT ile İngilizce konuşma pratiği" (6), "…için en iyi uygulama", "yapay zeka" | Strongest info cluster. The existing article matches the query; an **AI-vs-human-tutor** angle is a wide-open second article. |
| Info — learning plan | "İngilizce çalışma programı nasıl olmalı" (4), "İngilizce nasıl öğrenilir nereden başlanır" (4), "sıfırdan öğrenme planı", "kursa gitmeden…" | Solid. Existing plan article should also target "çalışma programı" wording. |
| Info — common mistakes | Exactly **1** suggestion. | Weak / phrased wrong. People don't search it this way. Retitle or deprioritise. |
| Info — speaking anxiety | "**İngilizce anlıyorum ama konuşamıyorum** ne yapmalıyım" (3), "ingilizce konuşamıyorum ne yapmalıyım" (4). "çekiniyorum/utanıyorum" hardly appears. | The real query is "anlıyorum ama konuşamıyorum", not "çekiniyorum". Existing article should lead with that phrase. |

## Recommendation for the 2 new high-intent articles

1. **"Online İngilizce özel ders fiyatları (2026): ne kadar olmalı, neye bakmalı?"** — a buyer's
   guide answering the price question honestly (hourly ranges, what drives price, what to
   ask a tutor). Highest-intent phrase found. Only state FEschool's own prices if Farin
   confirms them; otherwise keep it a neutral guide with the soft CTA.
2. **"İş İngilizcesi mülakat soruları ve nasıl cevaplanır"** — concrete career-intent query,
   links to `/is-ingilizcesi`. (Runner-up: "IELTS konuşma soruları", links to `/ielts-hazirlik`.)

Also cheap wins on existing articles (no new page): retitle/lead the anxiety article with
**"anlıyorum ama konuşamıyorum"**; add "çalışma programı" to the plan article; add an
"AI ile konuşma pratiği" section to the speaking-practice article.

## Still unknown

Actual monthly volumes and keyword difficulty. If wanted, run the top ~10 phrases of each
CSV through Keyword Planner (Ads account, Expert Mode, no campaign needed).

---

## Persian course pages, Iran autocomplete (2026-11-07, farin-seo)

Same method, but `hl=fa`, `gl=ir`, 26 suffixes per seed (blank, آنلاین, برای, قیمت, هزینه, بهترین, رایگان, مجازی, کلاس, دوره and 15 Persian letters). There were 61 seeds across the 7 premium courses. Raw rows are in **`fa-course-pages.csv`**, with a `course` column. Row counts per course include unrelated suggestions (celebrity interviews, school workbooks), so they are not a demand measure. Read the top phrases instead.

| Course | Strongest buyer-intent phrases (hits/26, best position) | Decision |
|---|---|---|
| IELTS | دوره آیلتس آنلاین (3/1), بهترین دوره آیلتس آنلاین (4–5), هزینه دوره آنلاین آیلتس (4/1), آزمون آزمایشی آیلتس آنلاین رایگان (5/1), ماک تست آیلتس آنلاین (3/1), آمادگی برای آیلتس بدون کلاس (4/3), آمادگی آیلتس در خانه (2/1), آیلتس جنرال برای کانادا (5/1) | Built `/fa/dore-ielts-online.html`. By far the most demand, and the most competition (Kanoon, Safir, IDP and others). The angle is practice exams at home. |
| Business | دوره زبان انگلیسی تجاری (4/1), کلاس زبان انگلیسی تجاری (4/1), دوره آموزش زبان انگلیسی تجاری (4/2), آموزش انگلیسی تجاری و بازرگانی (4/1), دوره مکاتبات تجاری به زبان انگلیسی (4/1), دوره بیزینس انگلیش (4/1) | Built `/fa/dore-zaban-englisi-tejari.html`. A WebSearch SERP look showed mostly Maktabkhooneh course pages. |
| HR | آموزش زبان تخصصی مدیریت منابع انسانی (3/2), زبان تخصصی مدیریت منابع انسانی (3/1), زبان تخصصی منابع انسانی (2/1). Info queries (اصطلاحات / مخفف / به انگلیسی) belong to the FA HR blog post. | Built `/fa/dore-englisi-manabe-ensani.html`. A WebSearch look found **no Persian page selling an HR English course**. «زبان تخصصی» is also the name of a university course, so the page says plainly that this is for work, not the term exam. |
| Interview | آمادگی برای مصاحبه کاری (4/1), آمادگی برای مصاحبه زبان انگلیسی (4/1), سوالات رایج در مصاحبه شغلی به زبان انگلیسی (5/1), سوالات مصاحبه شغلی به انگلیسی (4/1), نمونه مصاحبه کاری به زبان انگلیسی (3/1). «دوره مصاحبه کاری» returned nothing. | Built `/fa/amadegi-mosahebe-kari-englisi.html`, with a visible "questions you build answers for" section for the question queries. Self-introduction stays with the FA blog post. |
| AI & Internet | آموزش پرامپت نویسی (7/2 and others) is strong, but it is prompt-engineering intent in Persian. پرامپت نویسی به انگلیسی is 3/1 only, and «زبان انگلیسی با هوش مصنوعی» means learning English *with* AI. | Not built. The intent does not match the course. |
| Copywriting | دوره کپی رایتینگ is strong, but it means Persian copywriting. کپی رایتینگ به انگلیسی is 3/1 and the only English-copy phrase. | Not built. Demand is too thin for the English-copy angle. |
| Sales | Almost no buyer intent. «مکالمه خرید و فروش انگلیسی» (3/1) is shopping dialogue. | Not built. |

All of this is directional demand, not volume. No Keyword Planner was used. WebSearch is US-located, so the SERP notes are directional too.

---

## Turkish long-tail guides, Türkiye autocomplete (2026-11-09, farin-seo)

Same method as the first pull (`hl=tr`, `gl=tr`), with 28 suffixes per seed (blank, space, 18 letters incl. ö/ş/ü, and "nasıl", "örnek", "örnekleri", "kalıpları", "cümleleri", "için"). There were 33 seeds in 8 clusters close to the courses we sell, 924 queries in total. Raw rows are in **`tr-guides-2026-11.csv`**, with a `cluster` column. Hits are out of 28 per seed and add up across a cluster's seeds, so compare phrases inside a cluster, not across clusters. Demand signal only, no volumes.

| Cluster | Strongest phrases (hits / best position) | Decision |
|---|---|---|
| CV | "ingilizce cv de adres / şirket isimleri nasıl yazılır" (11/1), "... üniversite" (9/1), "... referans" (9/2), "... devam ediyor" (8/1), "... yüksek lisans" (6/1), "... sertifikalar" (6/2), "... askerlik durumu" (6/2), "cv ingilizce mi türkçe mi olmalı" (6/1), "ingilizce cv nasıl yazılır" (4/1). "cv ingilizce seviyesi nasıl yazılır" (11/1) is the top phrase, but `ingilizce-seviyemi-nasil-anlarim.html` already answers it. | Built `/blog/ingilizce-cv-nasil-yazilir.html`. Each "... nasıl yazılır" detail has its own H2 or bullet. The CV-level question links to the seviyemi post instead of competing with it. Panel: mulakat. |
| E-mail | "ingilizce resmi mail kalıpları" (6/1), "... mail bitirme kalıpları" (5/1), "... resmi mail nasıl bitirilir" (5/1), "resmi mail nasıl yazılır ingilizce" (5/2), "... mail başlangıç cümleleri" (4/1), "... e mail örnekleri formal" (4/1) | Built `/blog/ingilizce-resmi-mail-kaliplari.html`. A WebSearch look showed mostly English-language pages (British Council, Blair English). Panel: is. |
| IELTS score | "ielts puanı kaç yıl geçerli" (6/2), "ielts kaç puan yeterli" (5/1), "ielts puanı kaç üzerinden" (5/1), "ielts puanı nasıl hesaplanır" (5/1), "ielts kaç puan hangi seviye" (4/1), "ielts kaç puan almak gerekir" (4/1), "ielts b2 kaç puan" (3/1), "ielts kaç doğru kaç puan" (2/1) | Built `/blog/ielts-kac-puan-yeterli.html`. Every fact comes from ielts.org, GOV.UK or Canada.ca, and each is linked. "ielts writing puanı nasıl hesaplanır" (3/2) stays with the Writing Task 2 post. Panel: ielts. |
| IELTS Academic vs GT | "ielts academic mi general mı" (3/1), "ielts academic general farkı" (3/1). The rest is book and PDF searches. | Not built as its own page because demand is thin. It is an H2 + FAQ inside the IELTS score post. |
| Meetings | "ingilizce toplantı kalıpları" (6/1), "ingilizce toplantı açılış konuşması örnekleri" (6/1), "... toplantı daveti maili" (3/1), "... toplantı diyalogları" (3/1). Noise: "zümre toplantı tutanağı" (teachers' minutes). | Built `/blog/ingilizce-toplanti-kaliplari.html`, with a sample opening speech and "meeting minutes". Panel: is. |
| Small talk | "ingilizce small talk örnekleri" (10/1), "ingilizce günlük / basit sohbet cümleleri" (3/1) | Built `/blog/ingilizce-small-talk-ornekleri.html`. Lemon Academy is the main TR competitor. Panel: konusma (free app + 1:1 lessons). |
| Presentations | "ingilizce sunum nasıl yapılır" (6/1), "... sunum örnekleri pdf" (6/2), "... sunum kalıpları" (4/1), "... nasıl bitirilir" (4/1). Many hits are school homework ("hazırlık sunum", "11. sınıf", "sunum kapağı"). | Runner-up. Not built yet; next TR guide if a business angle holds (opening, transitions, Q&A). |
| Phone calls | "telefon görüşmesi ingilizce ne demek" (4/1), "... telefon görüşmesi diyalogları" (3/1). Weak. | Not built. |

Not used as evidence: SERP positions or volumes. WebSearch is US-located, so the SERP notes are directional.

---

## Persian guides, Iran autocomplete (2026-11-09, farin-seo)

Same method as the section above: `hl=fa`, `gl=ir`, 26 suffixes per seed (blank, نمونه, چگونه, چطور, برای, در, با, pdf, آموزش and 17 Persian letters). There were 46 seeds in 8 topics, in two rounds (first the seeds from the brief, then long-tail variants of the topics that showed demand). Raw rows are in **`fa-guides.csv`** (`topic` column, one row per topic + phrase, best hit count kept). Hits are out of 26 and are a demand signal, not a search volume. Several seeds returned nothing at all, which is itself the finding.

| Topic | Strongest phrases (hits/26, best position) | Decision |
|---|---|---|
| Resume | نمونه رزومه انگلیسی برای اپلای کاری (5/1), نمونه کاور لتر انگلیسی برای کار (6/1), رزومه کاری به انگلیسی چی میشه (4/1), نمونه رزومه انگلیسی برای کار (4/3). Blank seed «نوشتن رزومه به انگلیسی» suggests نوشتن رزومه کاری / نحوه نوشتن رزومه به انگلیسی. «رزومه انگلیسی» alone gave 93 different suggestions. | Built `/fa/blog/neveshtan-rezume-englisi.html`, with a cover-letter section. Sells the job-interview course. |
| Formal email | نمونه ایمیل انگلیسی برای درخواست کار (6/1), نمونه ایمیل رسمی انگلیسی به شرکت (4/1), جواب ایمیل دعوت به مصاحبه به انگلیسی (4/1), تشکر رسمی به انگلیسی در ایمیل (3/1), احوالپرسی رسمی در ایمیل به انگلیسی (3/2). «ایمیل کاری» and «ایمیل اداری» returned almost nothing; people say «ایمیل رسمی». | Built `/fa/blog/email-rasmi-englisi.html`. Sells the business course. University/professor emails (apply intent) are left out on purpose. |
| Phone | مکالمه تلفنی انگلیسی با ترجمه فارسی (4/1), اصطلاحات تماس تلفنی به انگلیسی (2/1), متن مکالمه تلفنی انگلیسی (2/1), قطع شدن تماس تلفنی به انگلیسی (2/1). | Built `/fa/blog/mokaleme-telefoni-englisi.html` (phrase tables with Persian translation + a full dialogue). Sells the business course; links the interview course for phone screens. |
| IELTS GT vs Academic | آیلتس جنرال یا آکادمیک برای اپلای (4/1), آیلتس آکادمیک یا جنرال برای استرالیا (4/1), آیلتس جنرال سخت تره یا آکادمیک (3/1), برای مهاجرت آیلتس آکادمیک یا جنرال (3/1), تفاوت آیلتس جنرال با آکادمیک (2/1). | Built `/fa/blog/ielts-general-ya-academic.html`. Rules checked on ielts.org, IRCC and Home Affairs on 2026-11-09. |
| IELTS score for immigration | نمره آیلتس برای مهاجرت تحصیلی به کانادا (5/1), نمره آیلتس برای مهاجرت کاری به انگلستان (4/1), نمره آیلتس برای مهاجرت به استرالیا / کانادا (4/2), حداقل نمره آیلتس برای مهاجرت به کانادا (blank seed). | Built `/fa/blog/nomre-ielts-mohajerat.html` (Canada CLB table, Australia levels + 189 points, UK B2 note, study note). Every number is linked to its official page with a date. |
| Meeting | Almost all suggestions are «جلسه به انگلیسی چی میشه» (word translation). «جملات کاربردی جلسه به انگلیسی», «اصطلاحات جلسه به انگلیسی», «مکالمه جلسه کاری انگلیسی» returned nothing. | Not built. No phrase-list intent. |
| Presentation | «ارائه دادن به انگلیسی چی میشه» and «موضوع ارائه به انگلیسی» (word translation, school topics). «جملات ارائه به انگلیسی», «شروع ارائه به انگلیسی» returned nothing. | Not built. |
| Small talk | Only «اسمال تاک چیست / یعنی چی». | Not built. |

SERP look (WebSearch, US-located, directional only): for the resume query, generic Persian career sites rank (e-estekhdam, faradars, maktabkhooneh, iranestekhdam), mostly about resumes in general rather than English resumes with ready English lines. For the formal email, phone and both IELTS queries the WebSearch results were English-language pages, so there may be a Persian gap, but that could not be confirmed on a real Google Iran SERP from here. No Keyword Planner was used.

---

## Live online classes, TR + FA autocomplete (2026-11-09, farin-seo)

Goal: one indexable page per language that sells the live classes with Farin. TR `/english.html` was the only TR page and its H1 did not match the query; FA had no indexable class page at all (`/kelas/` and `/dersler/` stay noindex campaign pages).

Method: same as above. TR `hl=tr gl=tr`, 38 suffixes per seed (blank, space, 28 letters incl. ç/ı/ö/ş/ü, and fiyat, ücretsiz, en iyi, nasıl, için, 2026, birebir, öğretmen), 12 seeds in 5 clusters, 456 queries. FA `hl=fa gl=ir`, 34 suffixes per seed (blank, space, 24 Persian letters, and قیمت، هزینه، رایگان، بهترین، با، برای، گروهی، در), 13 seeds in 5 clusters, 442 queries. Raw rows: **`live-classes-tr-2026-11.csv`**, **`live-classes-fa-2026-11.csv`** (hits add up across a cluster's seeds, so compare inside a cluster). Bare-stem suggestion order (Google lists more popular completions higher): **`live-classes-tr-stems-2026-11.csv`**, **`live-classes-fa-stems-2026-11.csv`**. Demand signal only, no volumes, no Keyword Planner.

**Türkiye**

| Evidence | Read |
|---|---|
| Stem "online ingilizce": 1 kursu, 2 kursları, 4 dersi, 5 kursu fiyatları, 6 eğitimi, **7 özel ders**, 8 konuşma kursu. Stem "online ingilizce ö": **1 özel ders**, 5 özel ders fiyatları. Stem "ingilizce özel ders": 8 "… online". Stem "birebir ingilizce": 3 özel ders, 5 konuşma dersi. | "online ingilizce kursu" is the bigger phrase, but its suggestions are platform/course shopping (çocuk, ücretsiz, sertifikalı, flalingo, tavsiye). "online ingilizce özel ders" is the exact product (live 1:1 lessons). |
| Özel ders cluster: "online ingilizce özel ders fiyatları" 4/1, "ingilizce özel ders online yetişkinlere" 4/1, "online ingilizce özel ders ücretleri" 2/1. Noise: "… vermek istiyorum" 8/1 (teachers looking for students). | Buyer intent with price and adult angles. |
| Birebir cluster: "birebir ingilizce (özel) dersi fiyatları" 4/1, "birebir online ingilizce dersi" 3/1, "birebir ingilizce konuşma dersi" 3/1. Konuşma cluster: "online ingilizce konuşma dersi" 5/1, "… konuşma kursu" 3/1, "… konuşma kulübü ücretsiz" 5/1. "online ingilizce dersi" cluster is mostly teacher-side ("nasıl verilir", "iş ilanları"). | Secondary phrases for the body and for anchors. |

**Decision TR:** `/english.html` targets **"online ingilizce özel ders"** (title "Birebir Online İngilizce Özel Ders | FE School", H1 "Online İngilizce özel ders, tamamen hedefine göre."). Secondary: birebir online İngilizce dersi, online İngilizce konuşma dersi. "… fiyatları" stays with `blog/online-ingilizce-ozel-ders-fiyatlari.html` (kept out of the title/H1; the page shows the real prices). "online ingilizce kursu" is not chased on this page. WebSearch look (US-located, directional): "online ingilizce özel ders birebir" returns marketplaces (armut, preply, italki, verbling, ogretmenbulun, ozeldersalani) and Lingoda, so no single school owns it; "online ingilizce kursu yetişkin" returns platforms and listicles (Lingoda, Udemy, Boenstitu, Lemon Academy).

**Iran**

| Evidence | Read |
|---|---|
| Stem "کلاس زبان انگلیسی": 1 itself, **2 «کلاس زبان انگلیسی آنلاین»**, then کودکان and city names. Stem "کلاس زبان": 5 «کلاس زبان آنلاین», 9 «کلاس زبان انگلیسی آنلاین». Stem "کلاس آنلاین": 7 «کلاس آنلاین زبان انگلیسی» (the rest is the driving test and Kanoon). | The main buyer phrase. |
| Stem "کلاس خصوصی زبان": 1 «کلاس خصوصی زبان انگلیسی», 4 «… قیمت». Cluster: **«قیمت کلاس خصوصی زبان انگلیسی آنلاین» 8/1**, «هزینه کلاس خصوصی (آنلاین) زبان انگلیسی» 4/1, «کلاس خصوصی زبان انگلیسی ساعتی چند است» 5/1. | Strong price intent; we show prices, most Persian results don't. |
| Stem "کلاس مکالمه": 1 «کلاس مکالمه زبان انگلیسی», 3 «… آنلاین». Cluster: «کلاس آنلاین زبان انگلیسی برای بزرگسالان» 6/2; many kids/Kanoon/free/Eitaa/city queries. «آموزش زبان انگلیسی آنلاین با استاد» returned **nothing**; «آموزش خصوصی آنلاین زبان انگلیسی برای بزرگسالان» 7/1. «تدریس خصوصی زبان انگلیسی» is Divar/Sheypoor listings. | Speaking and adult angles go in the body; "با استاد" is not a search phrase. |

**Decision FA:** new `/fa/kelas-zaban-englisi-online.html` targets **«کلاس زبان انگلیسی آنلاین»** (H1 «کلاس زبان انگلیسی آنلاین با فرین، تنها یا با دوستانت»). The title adds «خصوصی» and «قیمت» for the price query («کلاس زبان انگلیسی آنلاین خصوصی: قیمت و شرایط | FE School»); a single learner gets a private class and a group is always the learner's own 2–4 people, so «خصوصی» is accurate. H2 «قیمت کلاس زبان انگلیسی آنلاین», FAQ «قیمت … چقدر است؟». Not chased: «آموزش زبان انگلیسی آنلاین» (free/kids/pdf intent), «تدریس خصوصی» (marketplaces). WebSearch look (US-located, directional): mostly foreign platforms (QQEng, Berlitz, British Council), no Persian page with toman prices among the results; not confirmed on a real Google Iran SERP.

---

## Turkish course pages for 5 premium courses, Türkiye autocomplete (2026-11-09, farin-seo, Loop 2)

Goal: an indexable Turkish page for each premium course that had none (Job Interview, Sales & Trade, Copywriting & Content, AI & Internet, Complete Business). Method: same as above, `hl=tr gl=tr`, 40 suffixes per seed (blank, space, 28 letters incl. ç/ı/ö/ş/ü, and kursu, eğitimi, online, nedir, nasıl, için, fiyat, ücretsiz, sertifikalı, 2026), 10 seeds per course, 2,000 queries. Then a second round of 48 exact-stem probes ("ingilizce mülakat h", "dış ticaret ingilizcesi e", "prompt yazma k" …) to read suggestion order. Raw rows: **`tr-courses-2026-11.csv`** (`course` column; hits add up across a course's seeds, so compare inside a course) and **`tr-courses-stems-2026-11.csv`** (bare-seed and exact-stem suggestion lists in Google's order; `(nothing)` = Google offers no completion). Demand signal only, no volumes, no Keyword Planner.

| Course | Evidence | Decision |
|---|---|---|
| Job Interview | Stem "ingilizce mülakat h" → **1 "ingilizce mülakat hazırlığı"**; stem "ingilizce mülakat" → 7 simülasyonu, 8 "için yapay zeka", 9 hazırlığı; "ingilizce mülakata" → 1 nasıl hazırlanılır, 2 hazırlık, 3 hazırlık eğitimi; "mülakat ingilizcesi kursu" (stem "mülakat ingilizcesi" #3, 4/1); "ingilizce mülakat k" → 5 kursu; "… p" → 1 pratiği; "… e" → 2 eğitimi. "ingilizce mülakat hazırlık kursu" itself returns nothing. The big phrases are Q&A ("… soruları ve cevapları" 5/1) and stay with the blog guide. | Built **`/ingilizce-mulakat-hazirligi.html`** for "ingilizce mülakat hazırlığı" (secondary: mülakata hazırlık eğitimi, mülakat İngilizcesi kursu, mülakat pratiği). Links to the Q&A guide with its own anchor. hreflang pair with `/fa/amadegi-mosahebe-kari-englisi.html`. No lesson count on the page (course is being extended). |
| Sales & Trade | **"dış ticaret ingilizcesi eğitimi" 7/1** (stem "dış ticaret ingilizcesi e" #1), "dış ticaret ingilizcesi" (its own stem #1), **"ticari ingilizce kursu" 6/1**, "ingilizce ticari yazışmalar (pdf)" 4–5, "satış ingilizcesi kalıpları" 3/1, "dış ticaret ingilizce dersleri" 3/1, "ingilizce fiyat teklifi örneği / nasıl yazılır". "dış ticaret ingilizcesi kursu" returns nothing. Noise: job-title translations ("dış ticaret uzmanı ingilizcesi"), university departments ("taban puanları"). | Built **`/dis-ticaret-ingilizcesi.html`** for "dış ticaret İngilizcesi eğitimi" (secondary: ticari İngilizce kursu, satış İngilizcesi, ihracat İngilizcesi, İngilizce fiyat teklifi). The page says plainly it is the seller's side (no buying from suppliers, customs or tenders) and sends buyers to Complete Business. No FA pair (no FA Sales page). |
| AI & Internet | "yapay zeka için ingilizce" collapses into "yapay zeka ingilizcesi" (word translation) and "yapay zeka ile ingilizce öğrenme" (learning English *with* AI): wrong intent. Matching intent: **"ingilizce prompt yazma" 5/1**, "ingilizce prompt oluşturma" (stem "ingilizce prompt" #1), "chatgpt / gemini ingilizce prompt", "prompt yazma eğitimi" (stem "prompt yazma" #4, "prompt yazma e" #1), "prompt yazma kursu" ("prompt yazma k" #1), "yapay zeka prompt yazma eğitimi" 5/1. | Built **`/ingilizce-prompt-yazma.html`** for "ingilizce prompt yazma" (secondary: prompt yazma eğitimi / kursu, ChatGPT İngilizce prompt). The page says it is not a learn-English-with-AI course and links that intent to the speaking-practice guide. No FA pair. |
| Copywriting & Content | Thin. "ingilizce copywriting" and "copywriting ingilizce" return **nothing**; "ingilizce metin yazarlığı" returns only itself (2/1); "copywriting eğitimi" (2/1) and "metin yazarlığı kursu / eğitimi" are Turkish-copywriting intent; "ingilizce içerik üretmek / üreticisi" exist (stem "ingilizce içerik" #3, #5); "pazarlama ingilizcesi" 2/1 is mixed (partly word translation). | Built **`/ingilizce-metin-yazarligi.html`** (weakest evidence, built last) for "ingilizce metin yazarlığı" with "(Copywriting)" in the title; secondary: İngilizce içerik üretmek, pazarlama İngilizcesi. Demand is small but real (Google completes the exact phrase), and the course had no indexable page in any language. The page says it does not teach Turkish copywriting. |
| Complete Business | Every buyer phrase is the head term `/is-ingilizcesi.html` already owns: **"online iş ingilizcesi kursu" 10/1** (the strongest phrase in this pull), "iş ingilizcesi kursu" (stem "iş ingilizcesi" #4, "… k" #2), "iş ingilizcesi eğitimi" (#3), "iş ingilizcesi online eğitim" ("… o" #1), "business english kursu" 2/1. "kapsamlı iş ingilizcesi" only completes to a PDF. "kurumsal ingilizce eğitimi" 4/1 is corporate-training intent. | **No separate page** (it would split the same intent on a young domain). Instead `/is-ingilizcesi.html` got a full Complete Business section (`#kapsamli-kurs`: H2 "Online iş İngilizcesi kursu: şirketin bütün işleri, 40 derste.", 10 chapters / 40 lessons, ₺5.990, both CTAs, `Course` JSON-LD, one FAQ). `/is-ingilizcesi.html` leads the query. No hreflang to the FA Complete Business page, because the TR page is not the same single-course page. |

SERP look (WebSearch, US-located, directional only): "dış ticaret ingilizcesi eğitimi" shows university course pages (Anadolu, Bilecik), İnternet Enstitüsü "İngilizce Ticari Yazışmalar" and Turkish-language foreign-trade certificates (Boğaziçi Enstitüsü); no selling-skills English course among them. "ingilizce mülakat hazırlığı kursu" shows İnternet Enstitüsü "İngilizce Mülakata Hazırlık Eğitimi", Lemon Academy posts, Yenibiriş and Youthall guides. "ingilizce prompt yazma" shows blogs with mixed intent (prompting AI in English vs prompts for learning English), no course. "ingilizce metin yazarlığı copywriting kursu" shows no Turkey-specific English copywriting course (Udemy/Coursera in English, Turkish content-editing certificates). Not confirmed on a real Google TR SERP.

---

## Persian pages for Sales & Trade, Copywriting, AI + an FA course hub, Iran autocomplete (2026-11-09, farin-seo, Loop 3)

Goal: an indexable Persian page for the 3 premium courses that only had noindex sale pages (`/fa/c/sales.html`, `/fa/c/copywriting.html`, `/fa/c/ai.html`), and one indexable FA page that lists all 7 courses and the live classes. The 11-07 pull (section above) found weak intent for these 3 because it probed the skill in Persian ("دوره کپی رایتینگ", "آموزش پرامپت نویسی"). This pull probes the English-learning angle instead.

Method: same as above, `hl=fa gl=ir`, 34 suffixes per seed (blank, space, 24 Persian letters, and آنلاین، دوره، کلاس، قیمت، رایگان، بهترین، برای، با), 54 seeds in 4 clusters (sales 15, copywriting 14, ai 13, hub 12), 1,836 queries, 0 failures. Raw rows: **`fa-courses-loop3-2026-11.csv`** (`cluster` column; hits add up across a cluster's seeds, so compare inside a cluster). Bare-seed suggestion lists in Google's order (`(nothing)` = no completion): **`fa-courses-loop3-stems-2026-11.csv`**. Demand signal only, no volumes, no Keyword Planner.

| Course | Evidence | Decision |
|---|---|---|
| Sales & Trade | Stem «انگلیسی بازرگانی» returns 10 completions: #6 «زبان انگلیسی بازرگانی», #8 «… بازرگانی خارجی», #9 «دوره انگلیسی بازرگانی», #10 «آموزش …». Stem «زبان انگلیسی بازرگانی»: #2 «… خارجی», #5 «دوره زبان انگلیسی بازرگانی», #7 «کلاس …». Cluster: **«دوره آموزش زبان انگلیسی بازرگانی» 10/1**, «آموزش زبان انگلیسی بازرگانی و تجاری» 10/1, «زبان انگلیسی بازرگانی خارجی» 7/1, «دوره انگلیسی بازرگانی» 6/1, «آموزش مکالمه زبان انگلیسی بازرگانی» 5/1, «کلاس زبان انگلیسی بازرگانی» 4/1, «مذاکره تجاری به انگلیسی» 3/1, «نمونه نامه تجاری انگلیسی با ترجمه فارسی» 7/1. Noise: «زبان انگلیسی مدیریت بازرگانی» (university subject), «مذاکره به انگلیسی چه می‌شود» (word translation), «پیش فاکتور انگلیسی» (Excel templates). «انگلیسی برای فروش», «زبان انگلیسی برای فروشندگان», «ایمیل فروش انگلیسی» return shop names or nothing. | Built **`/fa/dore-zaban-englisi-bazargani.html`** for «دوره زبان انگلیسی بازرگانی» (secondary: زبان انگلیسی بازرگانی خارجی، مکالمه‌ی انگلیسی بازرگانی، مذاکره‌ی تجاری به انگلیسی). The 11-07 pull missed this because it only probed «فروش». The page says plainly it is the seller's side (no buying from suppliers, customs or tenders) and sends the buying side to Complete Business. No cannibalisation: the Complete Business page (`/fa/dore-zaban-englisi-tejari.html`) owns «تجاری» and never uses «بازرگانی». hreflang pair with `/dis-ticaret-ingilizcesi.html` (same course). |
| Copywriting & Content | Thin, but real. Stem «کپی رایتینگ انگلیسی» → #1 «کپی رایتینگ به انگلیسی» (3/1, the same as on 11-07). Stem «تولید محتوای انگلیسی» returns 7 completions: itself (5/1), «… استخدام» 7/1 (people looking for English content jobs), «قیمت / سفارش تولید محتوای انگلیسی» 6/1 and 3/1 (buying the service, not our intent), «تولید محتوای متنی به انگلیسی» 4/1, «… دیجیتال به انگلیسی» 4/1. «نوشتن کپشن به انگلیسی» 3/1. «کپشن انگلیسی …» (10 completions) is people looking for ready-made captions for their own photos. «کپی رایتینگ به زبان انگلیسی», «نوشتن محتوای انگلیسی», «زبان انگلیسی برای مارکتینگ» return nothing. | Built **`/fa/dore-copywriting-englisi.html`** for «کپی رایتینگ به انگلیسی» + «تولید محتوای انگلیسی». It has the weakest evidence of the three, but Google completes both exact phrases, and the job-seeker angle («… استخدام») matches the course. The course had no indexable Persian page. The page says it does not teach Persian copywriting and is not a content-writing service. hreflang pair with `/ingilizce-metin-yazarligi.html`. |
| AI & Internet | Stronger than on 11-07. **«پرامپت نویسی به انگلیسی» 6/1** (3/1 on 11-07): it is the #1 completion of both «پرامپت نویسی انگلیسی» and «پرامپت نویسی به انگلیسی». «نوشتن پرامپت به انگلیسی» 4/1. Stem «پرامپت انگلیسی» returns 10 completions, mostly ready-made image prompts («… برای عکس» 5/1, «… آماده», «… برای افزایش کیفیت عکس» 7/1), so people know prompts work in English but copy them instead of writing their own. «انگلیسی برای هوش مصنوعی» means "what is AI in English" or text to paste into image tools. «زبان انگلیسی با هوش مصنوعی» is learning English *with* AI (wrong intent). «دوره پرامپت نویسی» (8 completions) is prompt-engineering courses in Persian. «زبان انگلیسی برای کار با هوش مصنوعی», «… فریلنسری», «انگلیسی برای کار آنلاین» return nothing. | Built **`/fa/dore-prompt-nevisi-englisi.html`** for «پرامپت نویسی به انگلیسی» (secondary: نوشتن پرامپت به انگلیسی، پرامپت انگلیسی). The angle: write your own English prompt instead of copying a ready-made one, then check the result. The page says it is not a learn-English-with-AI course and not a Persian prompting course. hreflang pair with `/ingilizce-prompt-yazma.html`. |
| Hub (all courses) | Stem «دوره آنلاین زبان انگلیسی» → #1 itself, **#2 «… برای مهاجرت»**, #4 رایگان, #6 آیلتس, #9 «… با مدرک», #10 «بهترین …». Stem «دوره زبان انگلیسی آنلاین» → #1 itself, #2 «دوره مکالمه …». «دوره‌های زبان انگلیسی آنلاین» and «دوره‌های آنلاین زبان انگلیسی» are both their own #1. Cluster: «بهترین دوره‌های آنلاین زبان انگلیسی» 13/1, «بهترین دوره‌های زبان انگلیسی آنلاین» 13/1, «دوره آنلاین زبان انگلیسی با مدرک» 9/1, «دوره‌های آنلاین مکالمه زبان انگلیسی» 9/1, «خرید دوره آنلاین زبان انگلیسی» 5/1, «دوره آنلاین زبان انگلیسی برای مهاجرت» 4/1. Noise: kids, «نی نی سایت» (a forum), school brands (Kanoon, Safir, Jahad), «پکیج» (DVD packages). «دوره زبان انگلیسی برای کار» returns nothing. | Built **`/fa/dore-haye-zaban-englisi.html`** for «دوره‌های آنلاین زبان انگلیسی» / «دوره آنلاین زبان انگلیسی». The title is plural and names the course count, so it differs from the /fa/ homepage title («کلاس و دوره‌ی آنلاین زبان انگلیسی + اپ رایگان»). It answers «با مدرک» honestly in the FAQ (FEschool completion certificate, not an international qualification) and has an immigration line (IELTS + Job Interview). «بهترین» is not chased (no ranking claims). Watch in GSC which URL Google shows for «دوره آنلاین زبان انگلیسی». |

No course was folded into the hub: each of the three has at least one exact English-learning phrase that Google completes in Iran.

SERP look (WebSearch, US-located, directional only): «دوره زبان انگلیسی بازرگانی آنلاین» shows Maktabkhooneh's re-hosted Udemy business-English courses and foreign platforms. No Persian page sells an exporter's sales course in English. «کپی رایتینگ انگلیسی / تولید محتوای انگلیسی دوره» shows Persian copywriting courses (Maktabkhooneh) and English-language Udemy/Coursera courses. «پرامپت نویسی به انگلیسی آموزش» shows Faradars and Digiato articles and Maktabkhooneh prompt courses (in Persian). Not confirmed on a real Google Iran SERP.

---

## Loop 4: TR presentations guide + the next FA guide, autocomplete (2026-11-10, farin-seo)

Method: same Google suggest endpoint. Türkiye (`hl=tr gl=tr`): 20 seeds x 34 suffixes (blank, space, 25 letters incl. ö/ş/ü, nasıl, örnek, örnekleri, kalıpları, cümleleri, için, iş) = 680 queries, 0 failures; raw rows in **`tr-sunum-2026-11.csv`** (hits out of 34). Iran (`hl=fa gl=ir`): bare-seed probes only (23 presentation seeds, then 14 job-application seeds), Google's completion lists in **`loop4-stems-2026-11.csv`** (`(nothing)` = no completion). Demand signal only, no volumes.

| Topic | Evidence | Decision |
|---|---|---|
| TR presentations | **"ingilizce sunum yaparken nasıl başlanır" 12/1**, "... sunum giriş cümleleri" 7/1, "... sunum bitirme cümleleri" 7/1, "... sunum nasıl yapılır" 6/1, "... sunum nasıl bitirilir" 6/1, "... sunum sonu teşekkür" 5/1, "... sunum kalıpları" 4/1, "... sunum yaparken kullanılan kalıplar" 4/1. Work angle: "roketsan ingilizce sunum mülakatı" 2/1 and "fnss ingilizce sunum" (candidates presenting in English during hiring). Noise: school homework ("sunum örnekleri pdf", "kapağı", "7. sınıf", "a1 / a2 sunum konuları", "rüyada ..."). No completion: "açılış cümleleri", "geçiş cümleleri", "ifadeleri", "sunumda soru cevap", "ingilizce iş sunumu". | Built `/blog/ingilizce-sunum-kaliplari.html` for adults presenting at work or in interviews: H1 says "İş Sunumuna Nasıl Başlanır, Nasıl Bitirilir?", with H2s for giriş cümleleri, nasıl yapılır, nasıl bitirilir / bitirme cümleleri, numbers and charts, Q&A, an interview-presentation section and a 20-minute rehearsal routine. Panel: is. |
| FA presentations | «جملات ارائه به (زبان) انگلیسی», «جملات شروع ارائه انگلیسی», «شروع ارائه به انگلیسی», «نحوه ارائه به انگلیسی», «جملات کنفرانس انگلیسی», «عبارات ارائه انگلیسی», «اصطلاحات ارائه به انگلیسی», «جملات پرزنتیشن انگلیسی», «شروع کنفرانس به انگلیسی»: **no completion**. «ارائه به انگلیسی» → word translations (ارائه دهنده / خدمات / شده …), «موضوع ارائه»; «کنفرانس انگلیسی» → school topics (درباره حیوانات / ورزش / ایران); «پایان ارائه» → thesis defence; «پرزنت به انگلیسی» → the present tense. Same result as the 11-09 pull. | Not built. Persian searchers do not look for business presentation phrases. |
| FA job application email (fallback, top phrase of the `email` topic in `fa-guides.csv`) | Stem «ایمیل درخواست کار» → **#1 «ایمیل درخواست کار به انگلیسی»**, #4 «نمونه ایمیل درخواست کار به انگلیسی». Stem «ایمیل ارسال رزومه» → #2 «متن ایمیل ارسال رزومه به انگلیسی». Stem «نمونه ایمیل انگلیسی» → #6 «… برای درخواست کار». `fa-guides.csv` (11-09): «نمونه ایمیل انگلیسی برای درخواست کار» 6/1 (the strongest e-mail phrase), «نمونه ایمیل درخواست کار به انگلیسی» 3/2. No completion: «ایمیل اپلای کاری», «ایمیل پیگیری درخواست کار», «ایمیل تشکر بعد از مصاحبه», «ایمیل قبول پیشنهاد کار» (covered as sections, not as targets). | Built `/fa/blog/email-darkhast-kar-englisi.html`: no FA page had a job application e-mail (the formal-email guide's samples are quote, follow-up, interview reply, thanks, delay, reschedule; the resume guide has the cover letter as a document). Panel: mulakat; body link to the interview course page. Other uncovered `fa-guides.csv` phrases are apply intent (university / professor) or travel (hotel booking), which we do not sell. |

SERP look (WebSearch, US-located, directional only): for the TR query, Lemon Academy (TR competitor, several posts) and English-language pages (FluentU, Loora, Business Spotlight). For the FA query, only English-language pages came back (CakeResume, ResumeBuilder, Novoresume, Kickresume, Zety), so there may be a Persian gap, but that is not confirmed on a real Google Iran SERP.
