# SEO handoff for the app-first redesign (farin-seo → farin-website, 2026-10-07)

Apply these while rewriting the pages. Voice and wording come from farin-content's brief. This file only sets the SEO constraints. Ping farin-seo when the redesign is pushed: it re-runs the audit and the sitemap dates.

## 1. Keyword ownership (one primary keyword per page, no overlap)

Evidence is Google autocomplete for Türkiye (pulled 2026-10-07). It shows demand, but it is **not a search-volume figure**.

| Page | Primary keyword | Secondary | Evidence |
|---|---|---|---|
| `/` (app-first home) | **İngilizce öğrenme uygulaması** | ücretsiz İngilizce öğrenme uygulaması, oyunla İngilizce öğrenme, kişiye özel | "ingilizce öğrenme uygulaması ücretsiz", "ingilizce öğrenmek için hangi uygulama daha iyi", "en iyi … uygulaması ücretsiz" all recur |
| `/english.html` | online İngilizce özel ders | ders fiyatları, birebir | unchanged |
| `/spanish.html` | online İspanyolca özel ders | İspanyolca öğrenme uygulaması (ücretsiz) | "ispanyolca öğrenme uygulaması ücretsiz" recurs |
| `/german.html`, `/is-ingilizcesi.html`, `/ielts-hazirlik.html`, `/studio.html` | unchanged | | |

- Neither "kişiye özel İngilizce" nor "oyunla İngilizce öğrenme" has real search demand. Use both freely as **messaging**, but don't build titles around them.
- Use "ücretsiz" in titles and metas only while the app really is free. The schema already says price 0.
- Don't target English-language head terms ("language learning app", "learn English with games"). Duolingo and the like own them, and they're the wrong audience for a Turkish-language site.

## 2. Head tags on every page (keep or apply)

- `<title>` ≤ 60 characters, primary keyword near the front, ending in `| FE School`. Example for home (adjust to the voice): `Ücretsiz İngilizce Öğrenme Uygulaması | FE School`.
- Meta description 120–155 characters. Say what the user gets, and include "ücretsiz" plus one differentiator (games, personal roadmap).
- **Over the limit now:** `english.html` desc 166, `spanish.html` 167, `german.html` 164, `studio.html` 167, `ielts-hazirlik.html` title 67. Trim these during the rewrite.
- Keep exactly one `<h1>` per page. It can follow the brand voice. If the H1 doesn't contain the primary keyword, put it in an H2 or in the first 100 words of visible text.
- Keep these unchanged: the absolute https self-canonical, `robots index, follow`, `lang="tr"`, og/twitter tags, GA4 + `consent.js`.
- `privacy-policy.html` is the English app policy (`lang="en"`), but its title and description are Turkish. Make them English, e.g. `Privacy Policy — Farin English app`.

## 3. Less text is fine, if the text is real HTML

- Text inside images is invisible to Google. Every headline and claim needs to be real text.
- Keep roughly 250+ words of crawlable copy on the home page and 400+ on service pages. Cut the overload by putting FAQs in `<details>` blocks (still indexed), not by deleting them. The FAQPage schema must match the visible Q&A.
- Give every app or game screenshot a descriptive Turkish `alt`.

## 4. Schema changes

- **Move the app node to the homepage** (keep the same `@id`) and fix `operatingSystem`. There is no iOS app; it runs on iOS through the browser, and "Web" covers that. On `english.html`, keep only a reference: `"isRelatedTo": {"@id": "https://thefeschool.com/#uygulama"}` or drop the node there.

```json
{
  "@type": "SoftwareApplication",
  "@id": "https://thefeschool.com/#uygulama",
  "name": "Farin English",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web, Android",
  "url": "https://farinrasuli.github.io/farin-english-app/farin-english-app.html",
  "downloadUrl": "https://farinrasuli.github.io/farin-english-app/farin-english.apk",
  "inLanguage": ["tr", "en"],
  "description": "<one sentence from the new copy>",
  "featureList": ["Seviye tespit testi", "Hedefe göre kişisel yol haritası", "Dilbilgisi ve kelime oyunları", "Aralıklı tekrar", "Seviyeye göre hikâye kütüphanesi"],
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
  "publisher": { "@id": "https://thefeschool.com/#fe-school" }
}
```
  Only list features the live app really has. Google shows no star rich result without real ratings, and that's fine. **Never add `aggregateRating`/`Review`.**
- Keep: `EducationalOrganization`, `Person`, `WebSite` (home); `Service` + `FAQPage` + `BreadcrumbList` (language and goal pages).

## 5. Links that must keep working

Blog posts link to these anchors. Keep the ids, or tell farin-seo the new ones:
`english.html#paketler`, `english.html#yontem`, `index.html#dersler`, `index.html#program`, `index.html#yontem`, `is-ingilizcesi.html#kapsam`.

Add the following:
- Home → `/blog/` in the nav or footer ("Rehber"), plus 2–3 direct links to posts that fit the app angle (speaking practice, learning plan).
- Home → `/english.html` (private lessons) as the secondary path after the app CTA.

## 6. Trust

The homepage "%97 öğrenci hedefine ulaştı" and the Elif/Mert/Zeynep quotes have no source. Farin chose to keep them on 2026-09-19. The rewrite is the natural moment to drop them, or to replace them with real, permissioned quotes. Unsourced claims are a quality-rater negative and conflict with the social rules.

## After the push

farin-seo runs `node D:/farin/Claude/tools/seo-audit/build-sitemap.mjs` (refreshes `<lastmod>`), then `seo-audit.mjs`, and requests re-indexing of `/` in Search Console.
