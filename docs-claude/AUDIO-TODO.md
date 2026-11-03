# Audio to record (cloud sessions can't generate Kokoro/Piper clips)

Lines added or changed in the cloud that need a natural-voice clip. Generate them on the PC with the usual TTS pipeline,
then add them to the clip manifest. Until then the app uses the device voice for these lines (nothing fake was added).

| Task | Where | Line(s) | Voice |
|---|---|---|---|
| 1 HR | none | Common mistake lines are text only | - |
| 2 IELTS exam 11 | ielts/exam-11/x11-l1.js drill.script + audio.sequence | 32 script lines + 5 announcer texts | Announcer: kokoro bm_george; Lorna: kokoro bf_isabella; Mark: piper en_GB-northern_english_male-medium |
| 2 IELTS exam 11 | ielts/exam-11/x11-l2.js drill.script + audio.sequence | 14 script lines + 5 announcer texts | Announcer: kokoro bm_george; Manager: kokoro af_heart |
| 2 IELTS exam 11 | ielts/exam-11/x11-l3.js drill.script + audio.sequence | 33 script lines + 5 announcer texts | Announcer: kokoro bm_george; Grace: kokoro af_heart; Ben: piper en_GB-northern_english_male-medium |
| 2 IELTS exam 11 | ielts/exam-11/x11-l4.js drill.script + audio.sequence | 11 script lines + 3 announcer texts | Announcer: kokoro bm_george; Lecturer: kokoro bf_isabella |
| 2 IELTS exam 11 | ielts/exam-11/x11-s.js (examiner lines) | about 20 new examiner lines (5 standard lines already have clips) | examiner: kokoro bm_fable |
| Business ch. 2 (bus-m2) | app/courses/business/bus-m2/*.js: Learn phrases, speaking models (Play), vocab words and sentences | 86 lines, listed in docs-claude/cloud-patches/business/bus-m2-audio.json | default course narrator |
| Business ch. 4 (bus-m4) | app/courses/business/bus-m4/*.js: Learn phrases, speaking models (Play), vocab words and sentences | 73 lines, listed in docs-claude/cloud-patches/business/bus-m4-audio.json | default course narrator |
| 3 Business | courses/business/bus-m3/bus-9..12 + bus-cp-3 (Learn phrases, speaking models) | 21 lines (list: writer's audio-lines-bus-m3.txt; re-derive with the app's ttsKey) | Bella/George natural voices |
