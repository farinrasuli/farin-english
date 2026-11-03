# Brief for chapter 4 of Copywriting & Content English (cloud session 2026-11-03)

Course id `marketing` (Copywriting & Content English, already live with 12 lessons in 3 chapters). You add chapter 4.
Entry B1, tracks B1 and B2 (B2 = the `b2` item and `b2Point` / `b2Task` fields, like the reference). Lesson ids `mkt-13` to `mkt-16`,
chapter id `mkt-m4`, chapter review `mkt-cp-4`. Repo /home/user/farin-english, branch cloud-work. Read the existing 12 lessons' titles and one full chapter so the new one fits and does not repeat them.

Read first and follow: /home/user/farin-english/CLAUDE.md and, in /home/user/farin-english/docs-claude/agents/farin-lxd.md,
the sections "Premium courses: direct lessons, no story", "Premium courses = world-class benchmark" and "Native-quality check".

## The reference you copy (data shape)
The Copywriting course is the newest lazy course and the shape to copy exactly:
- lesson files: /home/user/farin-english/app/courses/marketing/mkt-m1/mkt-1.js ... mkt-4.js and the chapter review mkt-cp-1.js
  (look at all four lessons of one chapter and one review before writing);
- its chapter entry inside the app file: run
  `node -e 'const L=require("fs").readFileSync("/home/user/farin-english/app/farin-english-app.html","utf8").split("\n");const l=L.find(l=>l.startsWith("COURSES.push(Object.assign({\"id\":\"marketing\""));const o=JSON.parse(l.slice(27,l.lastIndexOf("}, {")+1));console.log(JSON.stringify(o.modules[0],null,1))'`
- the engine reads these keys per lesson: explain, judge, speaking, writing, exit, plus grammar, b2 and vocab (used by the
  check and recycling, not shown as test steps). Keep every key and sub-key the reference has.

## What each chapter writer produces
1. `app/courses/marketing/mkt-m4/mkt-13.js` ... `mkt-16.js` and `mkt-cp-4.js`. Header:
   `// Written in the cloud session 2026-11-03 (Copywriting chapter 4). Source of truth until ported to Claude/specs/lxd-course-marketing/.`
   then the same `(function(E){ ... })(globalThis.COURSE_FILES = globalThis.COURSE_FILES || {});` wrapper as the reference,
   with key "mkt-m4" and unit ids mkt-13 ... / mkt-cp-4. Item ids follow the reference pattern (c-mkt-13-e, c-mkt-13-j ...),
   `course:"marketing"`, `unit:"mkt-<n>"`.
2. `docs-claude/cloud-patches/marketing/mkt-m4.json` (weeks [7,8]) = the chapter entry for the course block, the same shape as the
   reference chapter entry above (id, weeks, title, blurb, goal, units [{id, episode, title, cando, sessions, objective}],
   checkpoint {...}) WITHOUT `lazy` (I add it). `episode` is a one-line teaser of the lesson, no story.
3. Check: load every file with node (new Function('globalThis', src)(w)) and compare its keys recursively with the matching
   reference lesson; fix gaps. Do not edit farin-english-app.html. Do not commit or push.

## Lesson standard (every lesson)
- Objective, one sentence, what the learner can DO after it: en "After this lesson, you can ...", tr "Bu dersin sonunda
  ...-ebileceksin.", fa "بعد از این درس می‌توانی ...". Same sentence in the chapter entry's unit `objective`.
- Explain: the point stated plainly, the why, a real before/after (weak → strong) worked example with the reason, a key
  phrase set, and on the language point a `"wrong"` / `"right"` pair (English, short) = the most common learner mistake
  for that point; the point's `tip` explains it in en/tr/fa with the Turkish/Persian-speaker reason where real.
  `remember` ends with "Result of this lesson: you can ..." (tr "Bu dersin sonucu: ...", fa «حالا می‌توانی ...»).
- Practise with real work material: emails, meeting lines, call scripts, slides, reports, offers. The judge sorts real lines
  (weak/strong features), speaking and writing are real tasks with a model, frame and checklist like the reference.
- Exit check proves the objective (tasks, not vocabulary quizzes).
- Direct teaching, NO running story, company or cast across lessons. Short, warm, direct sentences; no filler, no textbook
  phrasing. Neutral international business settings (Istanbul, Dubai, Tehran, London, Berlin ... suppliers, clients, teams).
- Benchmark: what Cambridge Business English (B1/B2 Business), British Council business English and the best Coursera /
  LinkedIn Learning business communication courses teach for that skill; be clearer than them. Do not copy their text.
  You may use WebSearch to check current best practice; cite sources only in your report, not in the app.
- Persian: natural modern Persian an educated Iranian professional writes, never a translation. Informal تو, never شما.
  Half-spaces (می‌کنی، ایمیل‌ها), Persian punctuation (، ؛ « » ؟), the business terms Iranians really use (جلسه، صورت‌جلسه،
  پیشنهاد قیمت، مذاکره، ددلاین/مهلت، پروپوزال where it is the normal word). Wrap English runs inside Persian text in
  U+2068 … U+2069 like the reference. Turkish: natural, sen form, correct İ/ı. No calques.

## Syllabus (chapter 4: "Formats that convert")
Benchmark in the field: the best copywriting sources (e.g. Copyhackers, Nielsen Norman Group on web writing, Google Search
Central's helpful-content guidance, Mailchimp/Litmus email guidance, platform guidance for short video). Learn from their
methods, never copy their text.
| Lesson | Skill |
|---|---|
| mkt-13 | Email newsletters people open: one message per email, subject lines and preview text, the first line, one call to action |
| mkt-14 | A landing page that converts: headline that names the result, benefit bullets, proof, objections answered, one CTA |
| mkt-15 | Writing for search: match the searcher's intent, a clear title and headings, answer first, plain words (no keyword stuffing) |
| mkt-16 | Scripts for short videos: the 2-second hook, three beats, on-screen text and captions, a spoken call to action |
| mkt-cp-4 | Review: launch one product in four formats (newsletter, landing-page hero, search-friendly intro, 30-second script) |

Report back briefly: files and sizes, the key check result, and one before → after example from your chapter.
