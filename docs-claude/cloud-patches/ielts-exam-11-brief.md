# Brief for writing IELTS exam 11 (cloud session 2026-11-03)

You are writing one part of a new IELTS exam copy, "Exam 11", for the Farin English app's premium IELTS course.
Repo: /home/user/farin-english (branch cloud-work). Read first: /home/user/farin-english/CLAUDE.md and the
"IELTS course method" section of /home/user/farin-english/docs-claude/agents/farin-lxd.md. Follow them.

## What to produce
- Files in /home/user/farin-english/app/ielts/exam-11/ named x11-<part>.js, one per lesson, mirroring the matching
  exam-10 file EXACTLY in data shape: /home/user/farin-english/app/ielts/exam-10/x10-<part>.js. Same wrapper:
  `// Written in the cloud session 2026-11-03 (exam 11). Source of truth until ported to Claude/specs/lxd-course-ielts-exams/exam-11/.`
  then `(function(E){ const x = E["exam-11"] = E["exam-11"] || {units:{}}; x.units["x11-<part>"] = {...}; })(globalThis.IELTS_EXAMS = globalThis.IELTS_EXAMS || {});`
  (look at how the exam-10 file assigns its unit and copy that pattern with exam-11 / x11 ids).
- Every key the exam-10 lesson has, your lesson has too (explain with context cards, points, example, quick, remember, hook,
  stats; the drill/sets/writing item with the real exam format; exit; and the `gt` General Training override when the exam-10
  file has one; objectiveGT when it has one). Ids: replace x10 with x11 everywhere. `patterns` = the corpus tags that fit your lesson.
- Run `node /home/user/farin-english/docs-claude/qa/ielts-shape.mjs app/ielts/exam-10/x10-<part>.js app/ielts/exam-11/x11-<part>.js`
  from /home/user/farin-english and fix every real gap (different speaker names and an optional table are fine). Also
  `node -e` load the file to be sure it parses.
- Do NOT edit farin-english-app.html, course.js or anything outside your x11 files. Do not commit or push.

## Content rules
- A close copy of a RECENT Cambridge IELTS test (books 19-20 style): same part structure, length, question types, number of
  questions (Listening 10 per part, Reading 13-14 per passage), timing and difficulty as the exam-10 lesson. Write ORIGINAL
  material: never copy passages, scripts or questions from any book or website.
- Lesson shape stays: context (recurring topics, topic words, paraphrase pairs, traps) -> technique (step-by-step method on an
  exam-style item) -> practice in the real format -> check. No lessons about scoring or band descriptors. Neutral, precise
  Cambridge / British Council voice: short sentences, no jokes, no filler. No running story or cast.
- Objective (en): "After this lesson, you can ..." one sentence. tr: "Bu dersin sonunda ... -ebileceksin." fa: "بعد از این درس
  می‌توانی ...". The explain `remember` ends with one result line ("Result: you can now ...", tr/fa equivalents).
- New engine feature: on the technique key point (points[1]) add `"wrong": "<a typical learner answer or sentence>"` and
  `"right": "<the fixed one>"` (English only, short). It shows as a Common mistake box above the tip. Pick a mistake Persian
  or Turkish speakers really make in this exam part (e.g. writing two words where ONE WORD is allowed, a plural -s dropped,
  "discuss about", a T/F/NG confusion), and make the tip say why in en/tr/fa.
- Every learner-facing string has en, tr and fa like the exam-10 file (English exam material stays English only, as in exam-10).
- Persian: natural, fluent modern Persian an educated Iranian would write, never a translation. Informal تو, never شما.
  Correct half-spaces (می‌کنی، کتاب‌ها، آزمون‌ها), Persian punctuation (، ؛ « » ؟), Persian digits in Persian prose only
  where exam-10 does it. Keep English words that Iranians use for IELTS (Listening, Reading, Task 1, band, True/False/Not Given)
  and wrap English runs inside Persian text with U+2068 ... U+2069 isolates like exam-10 does. Point out mistakes Persian
  speakers make in English where it helps.
- Turkish: natural Turkish, sen form, correct İ/ı, no calques.
- Your Listening scripts need natural-voice audio that cannot be generated here: keep the `audio` object (voices + sequence)
  like exam-10, pick voices from the same kokoro/piper names exam-10 uses. Do not add mp3 files.

## Report back (short)
Files written, sizes, shape check result, the contexts and question types you used, and one before -> after line is not needed.
