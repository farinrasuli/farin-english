# FEschool — Professional SEO Strategy

Follows the technical migration (`DOMAIN-MIGRATION-SEO.md`) — that covered the "make the site crawlable and correct" work; this is the actual growth strategy to compete for real Turkish search traffic. No implementation in this file yet except where marked done; this is the plan to review, then execute in the phases at the bottom.

**Honest framing up front:** nothing here can promise a first-page ranking — nobody can, including agencies who claim otherwise. What this plan does is put FEschool in a genuinely strong technical + content + structural position to compete for the searches that actually lead to a booked lesson, and gives a way to measure whether it's working rather than guessing.

---

## 1. Where FEschool already stands (recap, verified against the live site)

**Strong:**
- Structured data already mature: `EducationalOrganization`, `Person`, `Service`, `SoftwareApplication`, `FAQPage` — most competitors in this space have none of this.
- Metadata (titles, descriptions) already differentiated per page and intent-aware, not generic "learn English" copy.
- Positioning already correct: goal-based personalization (VIP roadmap, 100 Doors, FE App, Student Club), not a generic course — this is a real differentiator worth leaning into harder in content, not just the homepage.
- Technical foundation now solid: `thefeschool.com` live, HTTPS, `robots.txt`/`sitemap.xml` correct, canonical URLs consistent.

**Gap, and it's the single biggest lever available:** zero content exists for informational/educational search intent. Every page today is a service/commercial page. Someone typing "İngilizce konuşma pratiği nasıl yapılır?" into Google has nothing on `thefeschool.com` to find — that's the single largest missed opportunity, because informational searches vastly outnumber commercial ones and are how most people discover a tutor before they're ready to buy.

---

## 2. Keyword map

One primary keyword per page (no cannibalization), grouped by intent tier.

### Commercial intent — existing service pages

| Page | Primary keyword | Secondary keywords | Intent | Audience |
|---|---|---|---|---|
| `/` (home) | kişiye özel dil eğitimi | online dil okulu, hedefe göre dil öğrenme | Commercial/brand | Broad — anyone comparing dil eğitimi options |
| `/english.html` | online İngilizce özel ders | kişiye özel İngilizce, konuşma odaklı İngilizce | Commercial | Ready to book, comparing tutors |
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

These are **directional clusters**, not volume-verified keywords — I don't have a real keyword-volume tool from here. Before committing real writing time, run these through Google Keyword Planner, Ubersuggest, or similar (free tiers exist) to confirm volume and see what Google's own "People also ask" surfaces for each — 20 minutes of real research per cluster, cheap insurance against writing for a keyword nobody searches.

---

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

---

## 5. Structured data to add

Current: `EducationalOrganization`, `Person`, `Service`, `SoftwareApplication`, `FAQPage` — keep as-is, all accurate.

**Add:**
- `WebSite` node on the homepage (enables sitelinks searchbox eligibility — low cost, real upside).
- `BreadcrumbList` on `/english.html`, `/spanish.html`, `/german.html`, and any future `/blog/` posts.
- `Article` schema on each blog post once §4 is built (author, datePublished, headline).
- `BreadcrumbList` + `Article` combo also helps blog posts get the "how-to"/FAQ-style rich result treatment where the content genuinely is a how-to (article #1 and #5 in the calendar are strong candidates).

**Do not add:** `AggregateRating`/`Review` schema unless real, collected reviews exist — the brief and Google's own spam policies are both explicit here, and it's genuinely not worth the risk of a manual action.

---

## 6. Internal linking plan

- Every future blog post links to exactly one relevant service page (hub-and-spoke, not link-everything-to-everything).
- Service pages get a small "İlgili Yazılar" (related articles) block once 2+ posts exist per topic — not built until there's real content to link, to avoid empty/broken sections.
- Footer gets a "Rehber" (Guide) link once `/blog/` exists.

---

## 7. Off-page / local authority (not started, real decision needed)

- **Google Business Profile**: worth setting up even for an online-only tutoring business — Google now supports "service area business" profiles with no physical address shown, and it's free, gives a Maps/local-pack presence for "İngilizce özel ders [şehir]" style searches, and is a legitimate trust signal. **ACTION REQUIRED FROM YOU** if you want this — it needs your own Google account and phone verification, not something I can set up on your behalf.
- **Backlinks**: no artificial link-building (paid links, directories, PBNs) — these carry real penalty risk and the brief explicitly rules them out. Legitimate options: a guest post or interview on a Turkish language-learning or expat-focused blog, a listing on legitimate language-school directories (iTutor-style comparison sites), being mentioned by a former student's own blog/social post (can't be manufactured, but worth asking happy students if they'd share).
- **Social signals**: Instagram is already linked in the footer — consistent posting there doesn't directly move rankings, but drives the kind of branded-search volume ("FEschool İngilizce") that does help.

---

## 8. Measurement & KPIs (once GSC + analytics are live per DOMAIN-MIGRATION-SEO.md §15/§16)

Track monthly, not daily (SEO is slow, daily noise is not signal):
- GSC: total impressions/clicks, average position for the keyword map's primary terms, coverage errors.
- Which specific queries are already getting impressions but zero clicks — these are "almost there" opportunities (usually a title/meta fix, not new content).
- Blog posts: which one earns the first backlink or the first real click-through from a "People also ask" box — that's the signal to double down on that content type.

No vanity metrics (raw traffic alone) — track query-level movement on the actual keyword map in §2, since that's what ties back to bookings.

---

## 9. Phased roadmap

- **Phase 1 (done)**: technical foundation — domain, HTTPS, sitemap/robots, structured-data audit.
- **Phase 2 (next, low effort)**: `WebSite`/`BreadcrumbList` schema additions (§5); privacy-policy title fix (carried over from the migration blueprint).
- **Phase 3**: build `/blog/` structure (one template, matching site design) + publish articles 1–2 from §4.
- **Phase 4**: Google Business Profile (needs you) + GSC query monitoring to see which of articles 1–2 are gaining traction before writing 3–6.
- **Phase 5**: decide on `/is-ingilizcesi`/`/ielts-hazirlik` (§3) based on real inquiry-source data, not assumption.
- **Phase 6**: ongoing — one article every 2 weeks, review GSC monthly, adjust the keyword map based on what's actually getting impressions.

---

## 10. Needs your action

- Confirm GSC + analytics are set up (per `DOMAIN-MIGRATION-SEO.md`) — everything in §8 depends on this.
- Spend ~20 minutes running the §2 keyword clusters through a real keyword tool (Google Keyword Planner is free) before I write article copy — confirms these are worth the writing time.
- Decide: do you want to write the blog articles yourself (I can draft, you edit for voice), or should I draft them end-to-end for your review each time?
- Google Business Profile — worth doing, needs your Google account.
- Tell me whether career/exam inquiries are common enough to justify §3's new pages, or if I should hold off.
