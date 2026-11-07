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
