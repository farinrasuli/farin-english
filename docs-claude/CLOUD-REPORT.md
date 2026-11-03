# Cloud report

Work done in Claude Code cloud sessions on the `cloud-work` branch of `farin-english` and `farin-spanish`,
merged to `main` after each task. Newest entry at the bottom.

## Decisions for the whole cloud run (2026-11-03)

- **How "live" works.** `main` of `farin-spanish` is the live Spanish app. `main` of `farin-english` deploys only the
  website (its Pages workflow excludes `app/`). The live English app is the separate repo `farinrasuli/farin-english-app`,
  which is an exact copy of `farin-english/app/`. After each merge I copy `app/` into `farin-english-app` and push its
  `main` (same result as the documented `git subtree push --prefix=app`).
- **`LESSON-ENGINE.md` does not exist** in either repo, so I followed `CLAUDE.md`, the agent files and the game `NOTES.md`.
- **Generated course blocks.** The course data in the app file is generated on Farin's PC from `Claude/specs/...`
  (`sync-hr.js` and the other `sync-*.js`). Those specs are not in the repos. So each cloud change to course text is
  stored as a data file plus a re-runnable script in `docs-claude/cloud-patches/`. **After any local sync, run the
  matching `apply-*.mjs`, or port the change into the specs**, otherwise the sync will undo it.
- **Test.** `node docs-claude/qa/cloud-smoke.mjs app ../farin-spanish/app --courses` (Playwright, headless,
  `--mute-audio`): 0 console errors, login and recovery screens, Home roadmap, saved progress after a reload, and every
  step of every live course renders. The page's IIFE is opened for the test by the test server only; no app code changed for it.

## Task 1: HR & Business English (2026-11-03)

**Audit.** The 32 HR lessons were already strong: real HR tasks, the why, a worked weak → strong example, a quick
check, a "Result of this lesson" line and Turkish/Persian notes. Three gaps against the lesson standard:
1. Objectives said what the lesson teaches ("In this lesson you will learn to…"), not what the learner can do after it.
2. In modules 1–6, key point 4 ("At work") had the speaking topic's title as its heading, so the heading did not match the text
   (e.g. "Making a Polite Request by Phone" over a note on email tone in the Gulf and the UK).
3. The common learner mistake was only in prose inside the tip; there was no clear wrong → right model.

**Changed**
- Engine, both apps: a key point can carry `wrong` + `right`. It shows a **Common mistake** box (✗ crossed-out line, ✓ fixed
  line, labels in en/tr/fa/es) above the tip, which says why. Ready for every course.
- All 32 HR lessons: the objective is now "After this lesson, you can…" in en/tr/fa (the unit card and the Learn page);
  a Common mistake pair on the language point; 24 new "At work" headings that say what the text says.
- HR keeps its story (Leyla at Atlas Logistics), as the rule says.
- Files: `docs-claude/cloud-patches/engine-mistake.mjs`, `hr-2026-11-03.json`, `apply-hr.mjs`.

**Before → after (hr-1-2)**
- Objective: "In this lesson you will learn to write a clear, polite request by email and reply to one." →
  "After this lesson, you can write a clear, polite request by email and reply to one."
- FA: «در این درس یاد می‌گیری یک درخواست روشن و مؤدبانه با ایمیل بنویسی…» → «بعد از این درس می‌توانی یک درخواست روشن و مؤدبانه با ایمیل بنویسی…»
- Key point 4 heading: "Making a Polite Request by Phone" → "Short emails: direct or cold?" (FA «ایمیل کوتاه: رُک یا سرد؟»)
- New box: ✗ "Could you to send me the list?" ✓ "Could you send me the list?"

**Left / not done**
- I did not add more judge rounds to HR (5 of 32 lessons have one). The practice is already real tasks (scene, speaking,
  writing, perspective, exit check), and the brief asks for real-life tasks, not drills.
- Persian tips that mix English and Persian (e.g. hr-1-2's tip) still show bidi glitches around «» and English words. This is
  part of the Persian pass (task 6).
- No new audio needed (the mistake lines are text only).

**Farin to decide**
- Port the cloud patches into `Claude/specs/lxd-course-hr` on the PC (or keep running `apply-hr.mjs` after each sync).

## Task 1b: objective + Common mistake pass on every existing premium lesson (2026-11-03)

Done while the Exam 11 / Business / Copywriting writers were running. Covers IELTS exams 1-10 (100 lessons), English for AI
and the Internet (16), Job Interview (9), Copywriting (12) and Sales & Trade (12): 149 lessons, in the lazy lesson files and
the course blocks. Chapter reviews have no Learn page, so nothing to change there. All lessons already ended with a result line.

**Changed**
- Objective in en/tr/fa on every lesson (unit card + Learn page): "After this lesson, you can…" / "Bu dersin sonunda …-ebileceksin." /
  «بعد از این درس می‌توانی …». Turkish is converted by rule (-mayı/-meyi öğreneceksin → -abileceksin) with a guard for nouns that look
  like infinitives (bir konuşmayı, kelimeyi, aşamayı…) and two hand fixes (`objectives-tr.json`). Every converted sentence was reviewed.
- A Common mistake pair on each lesson's language point (AI, Interview, Copywriting, Sales) or trap point (IELTS, written as a mini exam
  item: ✗ the tempting answer, ✓ the right one and why). IELTS pairs are on the Academic Learn page; GT pages keep their trap text.
- Each changed chapter's lazy `v` is bumped so installed apps refetch the lesson files.
- Files: `apply-objectives.mjs`, `objectives-tr.json`, `apply-mistakes.mjs`, `mistakes-2026-11-03.json`, `mistakes-ielts-1.json`, `mistakes-ielts-2.json`.

**Before → after**
- x03-r1 (Reading, FALSE or NOT GIVEN?): ✗ "'The horse was first bred in Spain.' The passage says Portugal → NOT GIVEN." ✓ "The text gives the
  opposite (Portugal) → FALSE."
- ai-16 objective (tr): "Bu derste bir konuşmayı işaret sözcükleriyle takip etmeyi … öğreneceksin." → "Bu dersin sonunda bir konuşmayı işaret
  sözcükleriyle takip edebilecek, yapay zekâ notlarını düzeltebilecek ve beş satırlık rapor yazabileceksin."

**Left:** the tips next to the new pairs are the lessons' existing tr/fa tips; the Persian pass (task 6) re-reads them.
**Farin to decide:** nothing new. Re-run the two apply scripts after any local sync, or port the pairs into the specs.

## Task 2: IELTS Exam 11, a bonus exam copy (2026-11-03)

**Changed.** Ten new lessons in `app/ielts/exam-11/` in the exact shape of exam 10, written by four parallel writers from the brief in
`docs-claude/cloud-patches/ielts-exam-11-brief.md`, each rendered in the real engine (en/tr/fa, Academic and GT) with 0 console errors
before hand-back. Contexts: booking a holiday cottage (L1 notes + table), a city farm's volunteers (L2 choice + map labelling), a
research project on learning through play (L3), tide mills (L4 note completion); rooftop farms (R1 T/F/NG + notes; GT allotment
notices + garden rules), the psychology of queuing (R2 paragraphs + summary + MC; GT rota + service policy), the value of boredom
(R3 MC + sentence endings + Y/N/NG; GT phone pouches), a household-spending bar chart (W1; GT letter to a neighbour), cooking at
school (W2 opinion), weather / a skill from an older person / learning between generations (Speaking). All original material.
Wired by `build-ielts-11.mjs`; the four Listening lessons carry `waitsForAudio` ("Recording coming soon") until their clips exist.

**Decisions.**
- The course keeps its name "IELTS: 10 full exams"; Exam 11 is a labelled **bonus exam** ("10 full exams, plus a bonus exam").
  Renaming to 11 would touch the brand, the Turkish SEO page's structured data and blog posts, and change again at exam 12.
  Site lesson counts became "10 exams + 1 bonus, 110 lessons" (/dersler/, /kelas/, ielts-hazirlik.html). To rename instead:
  edit `REN` in `build-ielts-11.mjs` and the site names.
- The Common mistake box sits with the tip that explains it: the trap point in exams 1-10, the technique point in exam 11 (both
  Academic and GT there). The learner sees the same box either way.
- Exam 11's Persian wraps English runs in Unicode isolates (as the AI course does); exams 1-10 don't. Harmless, and better bidi.

**Before → after (x11-w1 Task 1).** ✗ "In 2000 households in Country A spent 31% of their budget for food." → ✓ "…spent 31% of
their budget on food." Persian tip: «در فارسی می‌گوییم "برای غذا" و همین را به for ترجمه می‌کنی؛ انگلیسی با spend همیشه on می‌آورد.»

**Left.** Recordings for L1-L4 (90 script lines + 18 announcer texts) and 20 examiner lines, listed in `AUDIO-TODO.md` with the
voices. GT Learn pages of exams 1-10 have no mistake box yet. When porting to the PC corpus: add the `W1-comp-neighbour` card and
a weather/daily-routine family for Speaking Part 1 (tagged S1-places for now).
**Farin to decide.** Keep "bonus exam" or rename the course; record the Listening clips and remove the four `waitsForAudio` flags.

## Task 3: Complete Business English, the flagship course (2026-11-03)

**Changed.** New course `business`: 16 direct lessons in 4 chapters (Working in English · Meetings and decisions · Present and report ·
Clients and deals), 4 chapter reviews, a 6-piece final project (intro email, agenda + minutes, 3-minute update with one slide,
one-page report, email confirming negotiated terms, reply to a complaint) and a certificate. Files `app/courses/business/`, chapter
entries and course text in `docs-claude/cloud-patches/business/`, assembled by `assemble-course.mjs business`. B1 + B2 tracks; first
2 lessons free; password prefix BE; admin catalog in both apps. No story or cast; every lesson: objective → point, why, weak → strong
model, Common mistake with the Turkish/Persian reason → judge / speaking / writing on real work material → check → result line.
Written by four parallel writers from `business-brief.md`, each rendered in the engine (both tracks, en/tr/fa) with 0 errors.
Website: on the TR/EN/FA main pages (`build-pages.mjs`), /dersler/ and /kelas/ course blocks, waiting-list page, at the price the
site already planned for this course (₺5,990 / ۶٬۹۹۰٬۰۰۰ تومان), status "first 2 lessons free" until Farin flips `SALE.biz` to 'now'.

**Before → after (bus-2 worked example).** "Subject: Order. Dear Mr Yilmaz, I hope you are well. As you know, our team has had many
meetings about the hotel project… We need some information about the quantities until next week, if possible." → "Subject: Chair
numbers by Thu 14 March, please. Dear Mr Yilmaz, could you confirm the final number of chairs by Thursday 14 March, so that our
factory can start on Monday 18 March? Is 400 still right? A quick yes is fine." Mistake box: ✗ "…until Friday" ✓ "…by Friday"
(Turkish "Cuma'ya kadar" and Persian «تا جمعه» cover both).

**Decisions.** Chapters 2 and 4 give B2 learners an extra mistake box and B2 task; chapters 1 and 3 don't (a bonus, not a gap). bus-2
and bus-8 both touch by/until (bus-8 adds within, in minutes): kept as recycling. Chapter 3's recall questions for chapter 1 are
general best practice because chapter 1 was written in parallel.
**Left.** 180 natural-voice lines (Learn phrases, speaking models, vocab) use the device voice until recorded: `AUDIO-TODO.md`.
Engine glitch in Turkish UI: uppercase eyebrows apply Turkish casing to English ("PRİOR TO"); affects every course, not fixed yet.
**Farin to decide.** Confirm the price and the on-sale date (then `SALE.biz = 'now'`, re-run build-pages, flip the data-sale markers in
/dersler/ and /kelas/); port `docs-claude/cloud-patches/business/` into `Claude/specs/lxd-course-business/`.

## Task 4: Copywriting & Content English, chapter 4 "Formats that convert" (2026-11-03)

**Changed.** Four new lessons + review in `app/courses/marketing/mkt-m4/`: newsletters people open, a landing page that converts,
writing for search, scripts for short videos; review = one product launch in four formats. Course intro and outcomes now say 16
lessons in 4 chapters, about 8 weeks (also the /dersler/ and /kelas/ chips). Ten judge-label glosses added to `COURSE_JUDGE_L` in
both apps. Assembled by `assemble-course.mjs marketing` (re-run after any local sync-marketing.js).

**Before → after (mkt-13).** "Subject: June Newsletter. Preview: View this email in your browser. First line: Dear valued customers,
we are pleased to share our latest news. Button: Click here." → "Subject: Persian rice class, Friday: 6 seats left. Preview: Learn
crispy tahdig with our chef in two hours. First line: This Friday at 7 pm, our chef teaches the crispy rice everyone asks about.
Button: Book my seat."

**Decisions.** The final project still unlocks after chapter 3 (saved progress stays valid); chapter 4's writing tasks are not portfolio
pieces. No new audio needed.
**Farin to decide.** Make the chapter 4 review a portfolio piece ("launch kit")? Port `mkt-m4` into `Claude/specs/lxd-course-marketing/`.
