# Brief for writing the Business flagship course (cloud session 2026-11-03)

Course id `business`, title "Complete Business English" (tr "Kapsamlı İş İngilizcesi", fa «دوره‌ی جامع انگلیسی تجاری»).
Entry B1, tracks B1 and B2 (B2 = the `b2` item and `b2Point` / `b2Task` fields, like the reference). Lesson ids `bus-<n>`,
chapter ids `bus-m<k>`, chapter reviews `bus-cp-<k>`. Repo /home/user/farin-english, branch cloud-work.

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
1. `app/courses/business/bus-m<k>/bus-<n>.js` for its four lessons and `bus-cp-<k>.js` for its chapter review. Header:
   `// Written in the cloud session 2026-11-03 (Complete Business English). Source of truth until ported to Claude/specs/lxd-course-business/.`
   then the same `(function(E){ ... })(globalThis.COURSE_FILES = globalThis.COURSE_FILES || {});` wrapper as the reference,
   with key "bus-m<k>" and unit ids bus-<n> / bus-cp-<k>. Item ids follow the reference pattern (c-bus-<n>-e, c-bus-<n>-j ...),
   `course:"business"`, `unit:"bus-<n>"`.
2. `docs-claude/cloud-patches/business/bus-m<k>.json` = the chapter entry for the course block, the same shape as the
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

## Syllabus
| Chapter | Lessons |
|---|---|
| bus-m1 Working in English (weeks 1-2) | bus-1 Introduce yourself and your company · bus-2 Emails that get action · bus-3 Calls and video meetings · bus-4 Networking and small talk · bus-cp-1 review: a first week with a new international client |
| bus-m2 Meetings and decisions (weeks 3-4) | bus-5 Run a meeting with an agenda · bus-6 Give and ask for opinions · bus-7 Disagree politely and reach a decision · bus-8 Minutes and action points · bus-cp-2 review: chair and minute a 20-minute decision meeting |
| bus-m3 Present and report (weeks 5-6) | bus-9 Structure a short presentation · bus-10 Numbers, charts and trends · bus-11 A one-page report · bus-12 A project update when things slip · bus-cp-3 review: a 3-minute quarterly update with one slide |
| bus-m4 Clients and deals (weeks 7-8) | bus-13 Negotiate price and terms · bus-14 Handle a complaint · bus-15 Solve a problem with a client (apology + plan) · bus-16 Write a proposal · bus-cp-4 review: win back an unhappy client |

Report back briefly: files and sizes, the key check result, and one before → after example from your chapter.
