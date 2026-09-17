# FEschool SEO & .COM Migration Blueprint

Status: **planning deliverable — no site code changed by this document.** Per the brief that requested it (2026-09-17), this is the audit + plan to review before any implementation starts. Supersedes the shorter 2026-09-16 draft of this file (domain candidates have since been settled: **thefeschool.com**).

---

## 1. Current website architecture

- Repo: `farinrasuli/farin-english` (git-tracked, public — it's served live via GitHub Pages, so everything tracked in it is publicly readable today).
- Live at `https://farinrasuli.github.io/farin-english/site/`.
- No build system, no framework, no bundler — plain hand-written HTML/CSS/JS, ~580KB total across `site/`. Pages: `index.html` (home), `english.html`, `spanish.html`, `german.html`, `privacy-policy.html`. Shared `site.css` + `site.js`; two third-party scripts loaded from jsdelivr (`gsap`, `lenis` — scroll/animation only, no framework).
- `site/` is a **subfolder of a larger repo**, not the whole repo — the repo root also holds `english app/app/` (the actual learner app: `farin-english-app.html`, the packaged APK/AAB, `Readme.html`, `assetlinks.json`) and root-level `icon-512.png`/`icon-180.png`. Today, one GitHub Pages origin serves both the marketing site and the app side by side.
- No routes/pages exist beyond the 5 listed above — this is a single-tier static site, no `/blog/`, no per-goal or per-course sub-pages.

## 2. Current technical SEO condition

- **Crawlability/indexability**: no blocking directives found; `<meta name="robots" content="index, follow">` present on the homepage. Good baseline.
- **`robots.txt`**: added last session at `site/robots.txt`. **Does not currently take effect** — GitHub Pages only honors a `robots.txt` at the true origin root (`farinrasuli.github.io/robots.txt`), not at a project subpath. This becomes fully functional automatically once `thefeschool.com` serves this content at its actual domain root — no extra work needed there, just noting it's inert today.
- **`sitemap.xml`**: exists, lists all 4 real content pages + privacy policy, correct `changefreq`/`priority` values. Needs a URL swap on migration (see §5).
- **Canonical tags**: present and self-referential on every page (correct pattern), currently pointing at the GitHub Pages URL.
- **HTTPS**: yes, via GitHub Pages today. Must be re-confirmed on the new host (see §5, §13).
- **Mobile responsiveness**: not independently re-audited this pass (would need a live device/viewport check); nothing in the CSS suggests a fixed-width-only layout, but this should get a real Lighthouse/PageSpeed pass once live on the new domain rather than being assumed from reading the CSS.
- **JS-rendering risk**: none — content is present in the raw HTML, not injected by JS. Search engines see the same content a browser does. Low risk area.
- **Duplicate content**: none found across the 4 real pages (each is genuinely distinct: home vs. per-language).
- **Broken links**: not found in the current, live GitHub Pages state. A **new** breakage risk exists specifically *because of* the planned migration — see §4, this is the most important finding in this audit.
- **Image optimization**: `loading="lazy"` already used on most below-the-fold decorative images. `story-cafe.jpg` (232KB) and `og-image.jpg` (84KB) are the two largest assets; not blocking, but worth compressing in a later performance pass — not urgent.
- **Semantic HTML / heading hierarchy**: exactly one `<h1>` per page (confirmed by direct count), `<h2>`/`<h3>` used for section structure. No heading-hierarchy problems found.
- **Alt text**: content images use empty `alt=""` — this is *correct*, not a gap, because every one checked is a purely decorative character illustration (`char-travel.png`, `roadmap-start-clay.png`, etc.), not information-bearing. No content images were found missing meaningful alt text.

## 3. Current metadata condition

Verified directly, not assumed:

| Page | Title | Meta description |
|---|---|---|
| Home | "FE School – Deneyimle ve Oyunla Online Dil Özel Dersi (İngilizce, İspanyolca, Almanca)" | Present, keyword-relevant, includes a CTA phrase ("İlk dersin ücretsiz!") |
| English | "FE School – Deneyimle ve Oyunla Online İngilizce Özel Ders" | Present, distinct from home, mentions the VIP roadmap concept |
| Spanish | Same pattern, Spanish-specific | Present, distinct |
| German | Same pattern, German-specific | Present, distinct |
| Privacy Policy | **"Privacy Policy — Farin English (FE school)"** | — |

Titles and descriptions are already well-differentiated per page (no duplication, no cannibalization at the metadata level) and already lead with the brand's actual differentiator (experience/game-based, goal-personalized) rather than generic "learn X" phrasing. **One small inconsistency found**: the privacy policy's title is in English and uses "Farin English (FE school)" instead of the "FE School" branding used everywhere else — cosmetic, low priority, worth fixing in the same pass as the domain swap.

Structured data already implemented (built in an earlier session, confirmed present and correctly typed): `EducationalOrganization`, `Person` (founder), `Service`, `SoftwareApplication`, `FAQPage` (7-9 real Q&As per language page), plus a homepage `ItemList` linking the three language pages. This is a genuinely solid foundation most small sites don't have — the brief's principle "never create fake reviews/ratings" is already being followed; nothing fabricated was found.

**Not yet present**: `WebSite` (with `SearchAction`), `BreadcrumbList`, `Course`-type structured data. Real gaps, not urgent — proposed as Phase 4 work (§15).

## 4. Domain migration requirements — the important finding

Internal **navigation** (`href="english.html"`, `"spanish.html"`, etc.) is already relative and needs no change.

But a full parent-directory-relative dependency exists that a naive "just upload the `site/` folder" migration will break:

- **Every page's favicon and inline logo** — `href="../icon-512.png"`, `href="../icon-180.png"` — reach *one level above* `site/`, i.e. the repo root.
- **Every "use the app" / "download APK" / privacy-policy link** — `href="../app/farin-english-app.html"`, `href="../app/farin-english.apk"`, `href="../app/privacy-policy.html"` — same thing, reaching the sibling `app/` folder.

These work today only because GitHub Pages serves the *entire* `farin-english` repo as one origin, with `site/` as a subfolder — so `../` correctly climbs from `.../farin-english/site/` up to `.../farin-english/`. **If only the contents of `site/` are uploaded to Mihan Web Host as the new domain root, every one of these breaks**: no favicon, no logo image, dead "Web/iOS'ta Kullan" and "Android APK İndir" buttons, and a dead Privacy Policy link — on every page, not just the homepage.

This is a genuine decision point, not something to silently patch around:

**Option A — keep the learner app where it is, fix the site to not depend on it structurally.** Copy `icon-512.png`/`icon-180.png` into `site/` (trivial, removes the favicon/logo risk entirely) and change the three app-related links to full absolute URLs pointing at the app's existing home (today that's `farinrasuli.github.io/farin-english/app/...`, or wherever `farin-app`'s own migration eventually lands it — that's a decision for the App project, not this one, so this option intentionally doesn't tie the site's migration to the app's). Lowest risk, smallest change, ships fastest.

**Option B — move the whole `english app/` repo (site + app + assets) to Mihan Web Host together**, preserving today's folder structure so the `../` paths keep working unmodified. Bigger scope (touches `farin-app`'s territory, Android APK hosting, `assetlinks.json` for the Android app-link verification), and means the primary marketing domain's root would need `site/`'s content promoted to actually be the domain root while `app/` becomes a sibling folder at `thefeschool.com/app/` — technically fine, but a decision that affects the App project too and shouldn't be made unilaterally inside a website-scoped task.

**Recommendation: Option A.** It solves the actual breakage with a two-line asset copy + a handful of absolute-URL edits, doesn't force a decision about the app's own hosting future, and can be executed in the same pass as the rest of the URL migration (§5). Flagging Option B only so it's a conscious choice, not something assumed away.

Also relevant to §4:

- No `CNAME` file exists yet in `site/` (needed only if GitHub Pages itself will resolve the custom domain — see the deployment-method fork in §13).
- `og:image`/`twitter:image` point at `og-image.jpg`, which does live inside `site/` already — unaffected by the Option A/B choice.
- Trailing-slash/www handling: canonical URLs are already written consistently as `https://<domain>/` (with trailing slash) for the homepage and bare paths for subpages — just needs the domain swapped, no structural fix needed.

## 5. Domain migration checklist (execute once approved)

1. Copy `icon-512.png`/`icon-180.png` into `site/assets/` (or `site/`) and repoint the 5 `../icon-*` references (Option A, §4).
2. Change the 3 `../app/...` links per page (privacy policy, web/iOS app, APK) to absolute URLs at the app's current live location, pending confirmation from whoever owns the app's own domain plans.
3. Find/replace all ~56 `https://farinrasuli.github.io/farin-english/site` → `https://thefeschool.com` occurrences across `index.html`, `english.html`, `spanish.html`, `german.html`, `privacy-policy.html` (canonical, OG, Twitter, JSON-LD `@id`/`url` fields). Verify afterward with `grep -rn "farinrasuli.github.io" site/` returning nothing.
4. Update `sitemap.xml` `<loc>` values and `robots.txt`'s `Sitemap:` line to the new domain.
5. Fix the privacy-policy page's title/branding inconsistency (§3) in the same pass.
6. Decide on a redirect from the old GitHub Pages URL (see §13's deployment-method fork — the mechanism differs depending on whether GitHub Pages stays live at all).
7. Re-verify the property in Google Search Console under the new domain — a `.com` is a distinct GSC property from the `github.io` one; nothing carries over automatically (§13).
8. Submit the updated sitemap under the new GSC property.
9. Spot-check `qr-install.png`/`qr-apk.png` — they point at the **app**, not this site, so likely unaffected, but worth one confirmation pass rather than assuming.

## 6. Required human actions

**ACTION REQUIRED FROM FARIN — nameservers.** You gave me:
```
ns127.mihanwebhost.com
ns128.mihanwebhost.com
```
Two things I need you to confirm before I treat DNS as settled:
1. Has `thefeschool.com` actually been registered/purchased yet, and at which registrar (Mihan Web Host itself, or elsewhere with Mihan just providing DNS)?
2. Have these nameservers already been set on the domain, or is that still pending? I will not claim DNS propagation has happened until you tell me it's done and I can verify it myself (e.g. `nslookup`/`dig` against the live domain).

**ACTION REQUIRED FROM FARIN — deployment-method decision.** Pointing nameservers at Mihan Web Host usually means the intent is to fully host there (upload files via Mihan's cPanel/FTP), not just use Mihan for DNS while the actual site keeps living on GitHub Pages. But there's a real trade-off worth deciding on purpose rather than by default:

- **Full move to Mihan cPanel hosting**: matches what the nameservers suggest; loses the current "push to `main` → live in ~1 minute" GitHub Pages workflow — future edits would need a manual file upload (FTP/cPanel file manager) unless a deploy script is set up separately.
- **Keep GitHub Pages as the actual host, use Mihan only for the domain + a DNS record pointing at GitHub Pages** (a `CNAME` file in `site/` + Mihan DNS records aimed at GitHub's Pages IPs) — keeps the auto-deploy-on-push workflow, and Mihan's hosting plan becomes unnecessary (only domain registration is needed, not a hosting package).

Tell me which one you want — it changes what I build in Phase 1 (a `CNAME` file + DNS record instructions for the second option, vs. a file-upload/FTP handoff for the first).

**ACTION REQUIRED FROM FARIN — once domain + hosting method is confirmed:**
> If going with full Mihan hosting: log into Mihan Web Host's cPanel/File Manager (or give me FTP/SFTP credentials if you're comfortable, which is a safer, narrower grant than the full account login) so the site files can be uploaded. If going with GitHub Pages + Mihan DNS only: log into Mihan Web Host's DNS panel and add a DNS record pointing `thefeschool.com` at GitHub Pages' addresses — I'll give you the exact record values once you confirm this is the chosen path.

I will not ask for your Mihan account password, payment details, or any verification codes at any point.

## 7. Turkish SEO audience analysis

The site already gets this largely right, verified against the actual copy, not assumed:

- No geo-restriction language anywhere ("Türkiye'de yaşayanlar" is never used) — copy consistently says "Türkçe konuşanlar için," matching the brief's "Turkish nationals, including those abroad" framing exactly.
- `og:locale` is `tr_TR`, all visible copy is Turkish, `knowsLanguage` in the `Person` schema includes `tr` first.
- The brand is already positioned as a *system* (VIP roadmap + courses + game + app + club), not a generic "İngilizce kursu" — matches the brief's "personalized language learning system" positioning requirement; no rewrite needed here, this groundwork is already done.

## 8. Initial keyword clusters (research directions, not final targets)

Grouped by the goals the site itself already organizes around (career/travel/exam/immigration/daily), not invented separately:

- **Core/brand**: "online İngilizce kursu," "kişiye özel İngilizce," "özel İngilizce dersi," "konuşma odaklı İngilizce," "online İspanyolca kursu."
- **Career**: "iş İngilizcesi," "mülakat İngilizcesi," "profesyonel İngilizce," "toplantı İngilizcesi."
- **Travel**: "seyahat İngilizcesi," "yurtdışında İngilizce."
- **Exam**: "IELTS İngilizce," "IELTS konuşma," "IELTS hazırlık."
- **Immigration**: "yurtdışına taşınmak için İngilizce," "göç için İngilizce."
- **Daily/speaking**: "günlük İngilizce," "İngilizce konuşma pratiği," "İngilizce konuşma geliştirme."

These are **starting categories** per the brief's own instruction — actual volume/competition/SERP-intent research (via a real keyword tool, which I don't have direct access to here) is the next concrete step before locking a content calendar, not something to fabricate numbers for.

## 9. Search intent categories

Two clearly distinct intents map onto two clearly distinct site needs:

- **Commercial intent** ("online İngilizce kursu," "özel ders," "IELTS hazırlık") → served by the existing service pages (home, `english.html`, `spanish.html`) and pricing section. Already reasonably well covered.
- **Educational/informational intent** ("İngilizce konuşma nasıl geliştirilir," "IELTS için nasıl çalışılır") → **currently unserved** — zero content exists for this intent. This is the single biggest content gap, and it's the intent category organic search traffic typically enters through before converting on a commercial page.

## 10. Proposed page architecture (candidates only — not all should be built)

Evaluated against the brief's own rule ("first determine which pages have genuine search intent and business value," "avoid thin SEO pages"):

**Likely worth building** (genuine, distinct search intent + real content to say):
- A `/blog/` or `/rehber/` (guide) section for the educational-intent cluster (§9) — real gap, real intent, real content possible without inventing anything.
- A dedicated **Business/Career English** landing angle if career is a meaningfully large share of current students (worth checking against actual student data before committing effort) — "iş İngilizcesi" and "IELTS" have clearly distinct enough intent from the general English page to justify their own targeted page, if the effort is there to write real content for each rather than thin variants.

**Not recommended as separate pages right now**: "Speaking English," "Travel English," "Daily English" as their *own* pages — the existing per-language pages already cover these as sub-sections with real content; splitting them into thin standalone pages this early would risk keyword cannibalization against the very sections the brief warns about, for goals that don't yet have enough distinct content to justify a whole page.
- `/app/`, `/100-doors/`, `/student-club/` as dedicated pages: **not recommended yet** — the existing sections (`#uygulama`, the game tile) already communicate what each is; a standalone page only earns its keep if there's a genuine amount of unique content and independent search demand for "100 Kapı" as its own query, which hasn't been established.

## 11. Homepage SEO plan

No structural rewrite needed — the existing 5-part flow (hero → FEschool-system cards → testimonials → wizard → language cards → pricing → app → CTA, per the September 16 restructuring) already communicates what/who/why/main-courses/main-goals in the order the brief asks for. The only homepage-level SEO work from this audit is: fix the metadata URLs (§5) and consider adding `WebSite`+`SearchAction` structured data (§12) — not a content or layout change.

## 12. Internal linking strategy

Current internal linking is sound at the site's current size: nav → per-language pages, per-language pages → app, footer → all pages. The **future** content pages (§10's blog/guide section, if approved) should each link back to the relevant service page/goal by intent (e.g. an IELTS guide article links to the exam-goal messaging on `english.html`, not to the generic homepage) — standard hub-and-spoke, not implemented until those pages exist.

## 13. Structured data plan

- **Keep as-is**: `EducationalOrganization`, `Person`, `Service`, `SoftwareApplication`, `FAQPage`, `ItemList` — all verified accurate to real site content, nothing fabricated.
- **Add** (Phase 4, §15): `WebSite` with a `SearchAction` (only meaningful once/if on-site search exists — otherwise just the base `WebSite` node), `BreadcrumbList` on the per-language pages.
- **Consider**: `Course`-type nodes for the per-language offerings, but only with real, non-fabricated `hasCourseInstance`/pricing data already shown on the pricing section — never invented ratings/reviews, matching the brief's explicit rule.

## 14. Content strategy

Contingent on the §10 decision to build a guide/blog section. If approved, each piece should follow the brief's own template: search intent, target keyword, supporting keywords, audience, a genuinely useful answer, internal links to the matching service, and one relevant CTA — not built this session, since it's new scope beyond the migration/audit that was asked for here.

## 15. Google Search Console plan

- A `.com` domain is a **new, separate GSC property** from the existing `github.io` one — nothing (query history, coverage data) carries over automatically.

**ACTION REQUIRED FROM FARIN, once the domain is live:**
> In Google Search Console, add `thefeschool.com` as a new property (domain-level property is usually the better choice over URL-prefix, since it covers http/https/www/non-www variants in one place) → verify ownership (DNS TXT record via Mihan's DNS panel is usually the simplest method for a domain-property verification — I'll give you the exact record once the domain's live) → submit `sitemap.xml` → periodically check Coverage, Search queries (impressions/clicks/CTR), and any manual actions.

I won't claim any of this is done until you've done it and I can see it reflected (e.g. the sitemap actually returns success in GSC).

## 16. Analytics plan

**No analytics currently installed** — confirmed by grep, no `gtag`/`googletagmanager`/GA references anywhere in `site/`. Worth adding once the domain is live (privacy-conscious, minimal — a single GA4 tag is standard and low-risk for a marketing site like this).

**ACTION REQUIRED FROM FARIN, if you want this**: create/access a Google Analytics 4 property and give me the Measurement ID (`G-XXXXXXX`) — I can wire the tag in myself once I have that; I won't ask for the Google account login itself, just the ID once you've created the property.

## 17. Technical SEO priorities (ranked)

1. Fix the `../` favicon/app-link dependency (§4) — this is the one change that actually breaks something if skipped, everything else is additive/safe.
2. URL migration find/replace (§5).
3. `robots.txt`/`sitemap.xml` domain swap (already built, just needs the new URLs dropped in).
4. GSC re-verification + sitemap submission.
5. `WebSite`/`BreadcrumbList` schema (nice-to-have, not urgent).
6. Analytics (optional, your call).

## 18. SEO implementation phases

- **Phase 1 — Technical foundation**: §4/§5/§6 (the actual migration + the favicon/app-link fix) + robots/sitemap domain swap. Blocked on your nameserver/hosting-method confirmation (§6).
- **Phase 2 — Homepage/metadata polish**: privacy-policy title/branding fix (§3); no structural homepage change needed.
- **Phase 3 — GSC + analytics**: §15/§16, once domain is live and verifiable.
- **Phase 4 — Structured data additions**: §13's `WebSite`/`BreadcrumbList`.
- **Phase 5 — Content/keyword strategy**: §8-§10, §14 — real keyword-tool research, then a decision on whether to build the guide/blog section, then content production. Explicitly gated on your go-ahead since it's new scope.
- **Phase 6 — Authority & measurement**: ongoing GSC/analytics monitoring once the above is live.

## 19. Risks

- **The `../icon`/`../app` dependency (§4) is the one real risk that causes visible breakage** if the migration is done as a naive folder copy — everything else in this audit is either already fine or a non-urgent enhancement.
- Deployment-method ambiguity (§6): nameservers pointing at Mihan could mean either "host fully at Mihan" or "just use Mihan for DNS, keep GitHub Pages" — proceeding on the wrong assumption wastes a hosting purchase or breaks the auto-deploy workflow, so this needs your explicit call before Phase 1 executes.
- No rollback plan currently exists if the new domain has DNS/propagation issues — recommend keeping the GitHub Pages URL live and unmodified until the new domain is confirmed fully working, rather than tearing down the old one immediately.
- This repo is public (GitHub Pages) — any credentials/DNS specifics you share with me for configuration should go through chat, not be committed into any tracked file (already the repo's existing convention per `.gitignore` history).

## 20. Recommended first sprint

1. You confirm: (a) domain purchase status, (b) nameserver status, (c) full-Mihan-hosting vs. GitHub-Pages-plus-Mihan-DNS (§6).
2. Once confirmed, I execute Phase 1 (§18): the favicon/app-link fix (Option A, §4) + the full URL migration find/replace (§5) + robots/sitemap domain swap — as a reviewable diff, same as the previous session's homepage restructuring, not committed/pushed until you've seen it.
3. In parallel, you handle whichever DNS/hosting-panel action Phase 1 requires (§6) and, once live, the GSC verification (§15).
4. Analytics (§16) and structured-data additions (§13) follow once the domain is stable — low priority, no rush.
5. Content/keyword strategy (§8-10, §14) stays parked until you decide whether to invest in it — flagged, not started.
