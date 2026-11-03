// Wires IELTS Exam 11 (cloud 2026-11-03) into the English app: writes ielts/exam-11/course.js, adds the exam-11 module to
// the generated IELTS course block, and renames the course from 10 to 11 full exams in that block. Safe to re-run.
// Listening lessons get waitsForAudio:true until their natural-voice clips exist (see docs-claude/AUDIO-TODO.md);
// remove that flag (and add the clips to ielts/audio/manifest.json) when the recordings are made.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const here = path.dirname(new URL(import.meta.url).pathname);
const app = path.join(here, '..', '..', 'app');
const dir = path.join(app, 'ielts', 'exam-11');
const ORDER = ['x11-l1', 'x11-l2', 'x11-l3', 'x11-l4', 'x11-r1', 'x11-r2', 'x11-r3', 'x11-w1', 'x11-w2', 'x11-s'];
const MINS = {l1: [10, 6, 4], l2: [10, 7, 4], l3: [10, 7, 4], l4: [10, 8, 4], r1: [10, 20, 4], r2: [10, 20, 4], r3: [10, 20, 4], w1: [10, 20, 4], w2: [10, 40, 4], s: [10, 15, 4]};
const t = (en, tr, fa) => ({en, tr, fa});
const SUB = {
  l1: t('booking a holiday cottage', 'bir tatil evi kiralamak', 'رزرو یک کلبه برای تعطیلات'),
  l2: t('volunteering at a city farm', 'bir şehir çiftliğinde gönüllülük', 'کار داوطلبانه در یک مزرعه‌ی شهری'),
  l3: t('research on learning through play', 'oyunla öğrenme üzerine bir araştırma', 'پژوهشی درباره‌ی یادگیری از راه بازی'),
  l4: t('a lecture on tide mills', 'gelgit değirmenleri üzerine bir ders', 'سخنرانی‌ای درباره‌ی آسیاب‌های جزرومدی'),
  r1: t('farms on city rooftops', 'şehirlerde çatı çiftlikleri', 'مزرعه‌های روی پشت‌بام‌های شهر'),
  r2: t('the psychology of queuing', 'sıra beklemenin psikolojisi', 'روان‌شناسیِ صف کشیدن'),
  r3: t('the value of boredom', 'can sıkıntısının değeri', 'ارزشِ حوصله‌سررفتن'),
  w1: t('household spending in three countries', 'üç ülkede hane harcamaları', 'هزینه‌های خانوار در سه کشور'),
  w2: t('cooking lessons at school', 'okulda yemek dersleri', 'کلاس آشپزی در مدرسه'),
  s: t('the weather, a skill from an older person, learning between generations', 'hava, yaşça büyük birinden öğrenilen bir beceri, kuşaklar arası öğrenme', 'آب‌وهوا، مهارتی که از یک آدم مسن‌تر یاد گرفتی، یادگیری بین نسل‌ها')
};
const SUBGT = {
  r1: t('a community garden and allotment notices', 'bir topluluk bahçesi ve hobi bahçesi duyuruları', 'یک باغ محلی و اطلاعیه‌های قطعه‌زمین‌های اجاره‌ای'),
  r2: t('a new staff rota and a service policy', 'yeni bir vardiya çizelgesi ve bir hizmet politikası', 'برنامه‌ی شیفت تازه و آیین‌نامه‌ی خدمات'),
  r3: t('a long text for Section 3', 'Section 3 için uzun bir metin', 'یک متن بلند برای Section 3'),
  w1: t('a letter to a neighbour about building work', 'tadilat hakkında bir komşuya mektup', 'نامه به همسایه درباره‌ی کارهای ساختمانی')
};
const files = ['course.js'].concat(ORDER.map(id => id + '.js'));
const w = {};
for (const id of ORDER) new Function('globalThis', fs.readFileSync(path.join(dir, id + '.js'), 'utf8'))(w);
const units = w.IELTS_EXAMS['exam-11'].units;
const TITLE = t('Cottages, queues, a skill from an older person', 'Tatil evleri, sıralar, yaşça büyük birinden bir beceri', 'کلبه‌ها، صف‌ها، مهارتی از یک آدم مسن‌تر');
const GOAL = t('By the end of this exam you will have done a complete IELTS test, part by part: Listening, Reading, Writing and Speaking, in the real format and timing.',
  'Bu sınavın sonunda eksiksiz bir IELTS sınavını kısım kısım yapmış olacaksın: Listening, Reading, Writing ve Speaking, gerçek format ve sürelerle.',
  'آخر این آزمون یک آزمون کامل آیلتس را بخش به بخش انجام داده‌ای: Listening، Reading، Writing و Speaking، با همان شکل و زمان‌بندی آزمون واقعی.');
fs.writeFileSync(path.join(dir, 'course.js'), '// Written in the cloud session 2026-11-03 (exam 11). Source of truth until ported to Claude/specs/lxd-course-ielts-exams/exam-11/.\n' +
  '(function(E){ E["exam-11"] = Object.assign(E["exam-11"] || {units:{}}, ' + JSON.stringify({id: 'exam-11', n: 11, status: 'full', title: t('Exam 11', '11. sınav', 'آزمون ۱۱'), goal: GOAL, order: ORDER}) + '); })(globalThis.IELTS_EXAMS = globalThis.IELTS_EXAMS || {});\n');
const v = crypto.createHash('sha1').update(files.map(f => fs.readFileSync(path.join(dir, f))).join('')).digest('hex').slice(0, 10);
const mod = {id: 'exam-11', title: TITLE, goal: GOAL, lazy: {key: 'exam-11', global: 'IELTS_EXAMS', dir: 'ielts/exam-11/', files, v}, units: ORDER.map(id => {
  const u = units[id], k = id.split('-')[1];
  const o = {id, title: u.title, objective: u.objective, sessions: u.sessions};
  if (u.objectiveGT) o.objectiveGT = u.objectiveGT;
  o.sub = SUB[k];
  if (u.gt) { if (SUBGT[k]) o.subGT = SUBGT[k]; o.gt = true; }
  o.mins = MINS[k];
  if (k[0] === 'l') o.waitsForAudio = true;
  return o;
})};
const f = path.join(app, 'farin-english-app.html');
let html = fs.readFileSync(f, 'utf8');
const lines = html.split('\n');
const i = lines.findIndex(l => l.startsWith('COURSES.push(Object.assign({"id":"ielts"'));
let l = lines[i];
l = l.replace(/,\{"id":"exam-11".*?(?=\]\}, \{status:'live')/, ''); // re-run: drop the old exam-11 module
const at = l.lastIndexOf("]}, {status:'live'");
l = l.slice(0, at) + ',' + JSON.stringify(mod) + l.slice(at);
const REN = [['IELTS: 10 full exams', 'IELTS: 11 full exams'], ['IELTS: 10 tam sınav', 'IELTS: 11 tam sınav'], ['آیلتس: ۱۰ آزمون کامل', 'آیلتس: ۱۱ آزمون کامل'], ['IELTS: 10 exámenes completos', 'IELTS: 11 exámenes completos'],
  ['"10 full exams that', '"11 full exams that'], ['izleyen 10 tam sınav', 'izleyen 11 tam sınav'], ['"۱۰ آزمون کامل که', '"۱۱ آزمون کامل که'], ['"10 exámenes completos que', '"11 exámenes completos que'],
  ['ten full tests', 'eleven full tests'], ['Ten exams, each with ten lessons', 'Eleven exams, each with ten lessons'], ['I have done ten full IELTS practice tests', 'I have done eleven full IELTS practice tests']];
for (const [a, b] of REN) l = l.split(a).join(b);
lines[i] = l;
html = lines.join('\n').split("{id:'ielts', app:'en', title:'IELTS: 10 full exams'}").join("{id:'ielts', app:'en', title:'IELTS: 11 full exams'}");
fs.writeFileSync(f, html);
console.log('exam-11 wired, v=' + v + '; units:', mod.units.map(u => u.id + (u.waitsForAudio ? '(waits for audio)' : '')).join(' '));
const left = l.match(/[^"]{0,40}(\bten\b|\b10\b|on tam|ده آزمون|۱۰ آزمون|diez)[^"]{0,40}/gi) || [];
console.log('check these remaining counts in the IELTS block:', left.slice(0, 20));
