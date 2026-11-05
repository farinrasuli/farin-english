# Persian editing brief (cloud session 2026-11-03)

You are a native Persian editor (an educated Iranian who also teaches English) reviewing one slice of the Farin English app's
Persian strings. Repo: /home/user/farin-english. Read first: /home/user/farin-english/CLAUDE.md (Design section) and the
"Native-quality check" paragraph in /home/user/farin-english/docs-claude/agents/farin-lxd.md.

## Input
Your slice: `docs-claude/cloud-patches/fa/slice-<name>.jsonl`, one JSON object per line: {en, tr, fa, owner}. `owner` is the
data array or function the string lives in (UI = buttons, labels, messages; COMPANION = Farin's companion speech bubbles;
GRAMMAR_ITEMS / GRAMMAR_PRACTICE / DW_* = grammar explainers and feedback on wrong answers; COURSES = premium course pages;
COURSE_EXTRA = HR course lesson content). Read the whole slice.

## Goal
Rewrite every Persian string that an educated Iranian would find unnatural, calqued from English, too formal or bookish,
unclear, or wrong in grammar or terminology, so that it reads as natural, fluent, modern Persian that an Iranian teacher would
actually say. Leave strings that are already good exactly as they are (expect to change roughly 10-30%). Quality over quantity.

Rules:
- Informal تو, never شما (except inside a quoted example of formal speech). Correct half-spaces (می‌کنی، کتاب‌ها، نقشه‌ی راه),
  Persian punctuation (، ؛ « » ؟), Persian digits where the string already uses them. Ezafe on ه-words as «ه‌ی» (half-space + ی).
- Use the terms Iranians really use for business, HR, IELTS and the internet (رزومه، مصاحبه، استخدام، حقوق و مزایا، مرخصی،
  صورت‌جلسه، مهلت/ددلاین، پیشنهاد قیمت، فاکتور، لیسنینگ/ریدینگ…). Where the English term is the normal word, keep it in English.
- Grammar explainers must really help an Iranian learner: say the point plainly, and where the mistake is typical of Persian
  speakers, say so («ما فارسی‌زبان‌ها معمولاً…») with the Persian pattern that causes it. Keep them short.
- Keep EXACTLY: every `${...}` placeholder, HTML tag, `\n`, emoji, number, English word or example, «» quote, and any U+2068/U+2069
  isolate characters the original has (do not add new ones). Keep the meaning and roughly the length; UI strings must stay short.
- Do not translate afresh from the English; fix the Persian. Do not change strings that are only a name or one word unless wrong.
- Turkish (secondary): while reading, if a `tr` string is clearly wrong or unnatural (sen form, İ/ı, calques), include a fix.

## Output
Write `docs-claude/cloud-patches/fa/fix-<name>.json`:
{"_notes": ["3-6 short lines: what kinds of problems you found and fixed"],
 "fa": {"<old fa, copied byte-exactly from the slice>": "<new fa>", ...},
 "tr": {"<old tr, byte-exact>": "<new tr>", ...}}
Valid JSON, UTF-8. The old strings are the keys; the apply script finds them in the app files, so copy them exactly (write the file
with a script that reads the slice and emits the keys, never by retyping). Do NOT edit the app files or anything else, do not
commit or push. Run a check that every key exists in the slice and that each new value keeps the placeholders/tags/«»/English
tokens of the old one. Report back briefly: counts, and five before → after examples.
