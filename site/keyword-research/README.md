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
