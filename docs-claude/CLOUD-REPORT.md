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
