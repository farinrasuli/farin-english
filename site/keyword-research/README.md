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
