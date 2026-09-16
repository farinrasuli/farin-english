# FEschool — .com Migration & SEO Prep

Working doc for the `.com` migration + SEO work (Phase 2 of the homepage-restructure request, 2026-09-16). Keep this in the repo (not git-ignored) as the durable reference — cite it instead of re-deriving this research in a future session.

## 1. Current state, verified against the actual files

- Live at `https://farinrasuli.github.io/farin-english/site/`, git-tracked repo `english app/.git`.
- Internal navigation (`href="english.html"`, `"spanish.html"`, etc.) is **already relative** — no code change needed there for the domain migration.
- **56 hardcoded absolute `farinrasuli.github.io` URLs**, all in `<link rel="canonical">`, `og:url`/`og:image`, `twitter:image`, and JSON-LD `@id`/`url` fields, spread across `index.html`, `english.html`, `spanish.html`, `german.html`, `privacy-policy.html`. These are all metadata, not navigation — the site works fine today, they just need a single find/replace pass once the real `.com` domain is chosen (see §4 checklist).
- Structured data is already fairly mature (built in an earlier session): `EducationalOrganization`, `Person` (founder), `Service`, `SoftwareApplication`, `FAQPage` on the language pages, plus an `ItemList` linking the three language pages on the homepage. **Not yet present**: `WebSite` (with `SearchAction`) and `BreadcrumbList` — worth adding in a future SEO pass, not done in this one to keep this session's scope to what was asked.
- `robots.txt` **did not exist** — created this session (`site/robots.txt`), pointing at `sitemap.xml`. **Caveat**: on GitHub Pages, a project-page's `robots.txt` living at `/farin-english/site/robots.txt` is *not* the origin's `/robots.txt` (that's `farinrasuli.github.io/robots.txt`, outside this repo's control) — search engines won't actually fetch it from here today. It becomes fully effective the moment the site is the domain root on the new `.com`, so this is genuine migration prep, not a working fix on the current URL.
- `sitemap.xml` was missing `privacy-policy.html` — added (low priority, `0.3`).
- CTA wording: the plan's example was English "START YOUR COURSE →"; the site is 100% Turkish-voiced, so I kept the existing "Dersine Başla →" as the one recurring primary CTA rather than introducing an English phrase — same intent, matches the site's actual language.

## 2. Domain migration checklist (do this once the `.com` is live)

1. Find/replace every `https://farinrasuli.github.io/farin-english/site` → `https://<newdomain>` across the 5 HTML files (56 occurrences — a single sed/find-replace pass, verify with `grep -rn "farinrasuli.github.io"` afterward returns nothing under `site/`).
2. Update `sitemap.xml` `<loc>` values the same way.
3. Update `robots.txt`'s `Sitemap:` line.
4. Re-generate `og-image.jpg`'s absolute URL references (same find/replace, no new image needed).
5. Set up a redirect from the GitHub Pages URL to the new domain (GitHub Pages project sites can't 301-redirect natively — the practical option is to leave a minimal `index.html` at the old location with a `<link rel="canonical">` pointing to the new domain plus a `<meta http-equiv="refresh">`/JS redirect, so existing backlinks and any indexed pages funnel over instead of just going dead). Flagging as a decision point, not yet built — tell me if you want this done before or after the domain is live.
6. Re-verify property in Google Search Console under the new domain (a `.com` is a distinct property from the `github.io` one — old GSC data doesn't carry over automatically).
7. Submit the updated sitemap under the new GSC property.
8. Update the QR codes (`qr-install.png`, `qr-apk.png`) if they encode the github.io URL rather than the app's own domain — check `site.js`/the app links before assuming; these point at the **app**, not this site, so may be unaffected. Worth a quick check when the domain work starts.

## 3. Hosting research — Mihan Web Host (mihanwebhost.com)

Site is Persian-only, no English version. Verified plans (September 2026 pricing, in Toman):

| Plan | Price | Notes |
|---|---|---|
| Linux cPanel (Iran datacenter) | from 660,000 Toman/yr | 200MB+ storage, unlimited bandwidth |
| Linux cPanel (Germany datacenter) | from 1,220,000 Toman/yr | 200MB+ storage, unlimited bandwidth |
| High-traffic hosting (Iran) | from 999,000 Toman/**month** | 10GB+ storage |
| Node.js/Python hosting | from 1,200,000 Toman/yr | not needed — this site has no backend |
| VPS (Iran/Germany) | from 1,350,000–1,740,000 Toman/mo | overkill for a static site |
| Domain `.com` | 3,000,000 Toman/yr | via Mihan Web Host's own registration |
| SSL | Free with hosting | — |

**Recommendation**: this site is plain static HTML/CSS/JS (~580KB total, no database, no server code) — the cheapest **Linux cPanel shared hosting** plan is more than enough; the Node.js/Python and VPS tiers are unnecessary cost. Between the Iran and Germany datacenter options: Germany is likely the safer default for search-engine crawl reliability and international reachability (Iran-hosted sites can see inconsistent international routing); Iran is geographically closer to Turkey and cheaper. This is a judgment call with a real trade-off, not a technical requirement either way — your call.

**Do NOT let me buy anything.** When you're ready:

**ACTION REQUIRED FROM YOU:**
> Go to mihanwebhost.com → pick a `.com` domain (see §5 for name candidates — check live availability there, I can't check registrar availability directly) → purchase domain + the Linux cPanel shared hosting plan (Germany or Iran datacenter, your call) → complete their payment/verification → tell me when it's done, and share the cPanel/FTP access details you're comfortable giving me (or just the DNS panel access) so I can configure the deployment.

I will not ask you for passwords, payment info, or verification codes — if Mihan Web Host's panel needs 2FA or ID verification, that's on your side only.

## 4. Domain name candidates

Not purchased, not availability-checked against a registrar (I don't have that tool) — check these at Mihan Web Host's own domain search before deciding:

- `feschool.com` — short, matches the brand name used site-wide already, easy to say/type for a Turkish audience.
- `fe-school.com` — fallback if the bare word is taken.
- `feschool.com.tr` — worth checking too since `.com.tr` reads as more locally trustworthy to Turkish users specifically, at some cost to international reach; the brief asked for `.com` specifically, so treating this as a secondary/defensive registration rather than the primary pick.

`feschool.com` is the recommendation if available — it's literally the name already on every page, so no rebrand risk, and it's short enough for word-of-mouth/WhatsApp sharing.

## 5. Turkish SEO — search-intent notes (not implemented as content yet)

Grounded in what the site already says about itself, not blind keyword stuffing:

- **Commercial-intent terms this site is already well-positioned for**: "online İngilizce özel ders," "kişiye özel İngilizce eğitimi," "İngilizce konuşma pratiği" — the homepage/English page copy already centers goal-based personalization and speaking practice, which matches actual search intent for these terms rather than generic "learn English" copy.
- **Gap**: no blog/educational content exists yet (`/blog/` doesn't exist). Educational-intent queries ("İngilizce konuşma nasıl geliştirilir," "IELTS için nasıl çalışılır") currently have nothing on-site to rank for. This is real, uncommitted future work — flagged as a next-task, not built this session (content pages weren't asked for in Phase 1, and building them without being asked would be scope creep).
- **Persona note**: site already targets Turkish speakers broadly (not "people living in Turkey" — no geo-restriction language anywhere, `tr_TR` locale, all copy in Turkish) — this already matches the brief's "Turkish nationals including those abroad" persona; no change needed.

## 6. Needs-your-action summary

- Pick + purchase `.com` domain + hosting at Mihan Web Host (see §3/§4) — I can't do this for you.
- Decide Germany vs Iran datacenter.
- After purchase: DNS records, Google Search Console re-verification, and the find/replace migration pass in §2 — I can do the file-edit parts once you tell me the final domain; the account-level steps (GSC verification, DNS entry, Mihan panel actions) are yours.
- Decide whether to build `/blog/` educational content (§5 gap) — not started, needs an explicit go-ahead since it's new scope beyond what was asked this session.
