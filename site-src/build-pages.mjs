// FE School site builder (farin-website, 2026-10-29).
// Generates the 4 main pages x 3 languages from ONE dictionary, so TR / EN / FA never drift.
//   TR: /index.html  /uygulama.html  /sistem.html  /iletisim.html
//   EN: /en/index.html /en/app.html /en/system.html /en/contact.html
//   FA: /fa/index.html /fa/app.html /fa/system.html /fa/contact.html   (dir="rtl")
// Also writes /feschool.css (fe-base.css + fe-extra.css).
// Run:  node "D:/farin/english app/site-src/build-pages.mjs"
// DO NOT hand-edit the generated HTML: edit this file and re-run.
// Rules baked in: Persian always informal تو (never شما); no USD; app is only linked
// out to farinrasuli.github.io (never served from thefeschool.com); %97 + testimonials kept.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '../site');
const ORIGIN = 'https://thefeschool.com';
const APP = 'https://farinrasuli.github.io/farin-english-app/farin-english-app.html';
const APK = 'https://farinrasuli.github.io/farin-english-app/farin-english.apk';
const WAN = '905467615951';
const WA = t => 'https://wa.me/' + WAN + (t ? '?text=' + encodeURIComponent(t) : '');
const ext = 'target="_blank" rel="noopener"';
/* course requests go to the shared waiting list page (Farin 2026-11-02), not WhatsApp. Ids = the app's course ids. */
/* 2026-11-07: Persian sales are open for courses complete in the app (Farin via farin-31) -> their /fa/c/ sale page (noindex share pages, not in the sitemap). Others keep the waiting list. */
/* Same day: Job Interview, Copywriting & Content and Sales & Trade are live in the app too (Farin: "dont say coming soon, say its on the app"). */
const FA_SALE = { hr: 'hr', ielts: 'ielts', 'ai-internet': 'ai', business: 'business', interview: 'interview', marketing: 'copywriting', sales: 'sales' };
const WL = (key, l) => (l === 'fa' && FA_SALE[key]) ? `/fa/c/${FA_SALE[key]}.html` : `/waitlist/?course=${key}&amp;lang=${l}`;
const dot = c => `<span class="dot">${c}</span>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = s => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');

const LANGS = {
  tr: { i: 0, dir: 'ltr', base: '/', locale: 'tr_TR', label: 'TR', name: 'Türkçe',
        pages: { home: '', app: 'uygulama.html', sys: 'sistem.html', contact: 'iletisim.html' } },
  en: { i: 1, dir: 'ltr', base: '/en/', locale: 'en_US', label: 'EN', name: 'English',
        pages: { home: '', app: 'app.html', sys: 'system.html', contact: 'contact.html' } },
  fa: { i: 2, dir: 'rtl', base: '/fa/', locale: 'fa_IR', label: 'فا', name: 'فارسی',
        pages: { home: '', app: 'app.html', sys: 'system.html', contact: 'contact.html' } },
};
const url = (l, p) => LANGS[l].base + LANGS[l].pages[p];

/* every string: [Türkçe, English, فارسی] — fa always informal تو */
const S = {
nav1:['Kurslar','Courses','دوره‌ها'],nav2:['Uygulama','App','اپلیکیشن'],nav3:['Sistemimiz','Our system','روش ما'],nav4:['İletişim','Contact','تماس'],
openApp:['Uygulamayı aç','Open the app','باز کردن اپ'],
skip:['İçeriğe geç','Skip to content','رفتن به محتوا'],
menu:['Menü','Menu','منو'],langLabel:['Dil','Language','زبان'],
heroEb:['FE School · Ücretsiz İngilizce uygulaması, oyunlar ve kurslar','FE School · A free English app, games and courses','FE School · اپ رایگان انگلیسی، بازی‌ها و دوره‌ها'],
h1:['Neden İngilizce öğrenmek istiyorsun'+dot('?'),'Why do you want to learn English'+dot('?'),'چرا می‌خواهی انگلیسی یاد بگیری'+dot('؟')],
heroSub:['Cevabını seç. <b>Senin kursun hazır.</b>','Pick your answer. <b>Your course is ready.</b>','جوابت را انتخاب کن. <b>دوره‌ی تو آماده است.</b>'],
note:['birini seç','pick one','یکی را انتخاب کن'],
gIs:['İş ve kariyer','Work &amp; career','کار و شغل'],gIsS:['İK, toplantı, e-posta','HR, meetings, email','منابع انسانی، جلسه، ایمیل'],
gIe:['IELTS ve yurt dışı','IELTS &amp; moving abroad','آیلتس و مهاجرت'],gIeS:['Sınav, göç, eğitim','Exam, migration, study','آزمون، مهاجرت، تحصیل'],
gMu:['İş görüşmesi','Job interview','مصاحبه‌ی کاری'],gMuS:['Mülakata hazırlan','Get interview-ready','برای مصاحبه آماده شو'],
gKo:['Rahat konuşmak','Speak with confidence','راحت حرف زدن'],gKoS:['Kişisel, kendi hedefin','Personal, your own goal','شخصی، با هدف خودت'],
f1:['%97 öğrenci hedefine ulaştı','97% of students reached their goal','۹۷٪ شاگردها به هدفشان رسیدند'],
f2:['Yol haritanın yarısı oyun','Half your roadmap is games','نیمی از نقشه‌ی راهت بازی است'],
f3:['Uygulama için kart gerekmez','No card needed for the app','برای اپ کارت بانکی لازم نیست'],
forYou:['Senin için','For you','برای تو'],
oneWay:['Bu hedef için hazır bir kurs var.','There is a ready-made course for this goal.','برای این هدف یک دوره‌ی آماده هست.'],
twoWays:['İki yol var. Sana uyanı seç.','Two ways in. Pick what suits you.','دو راه هست. هر کدام که به تو می‌خورد را انتخاب کن.'],
selfT:['Kendi hızında kurs','Self-paced course','دوره با سرعت خودت'],
selfS:['Uygulamada · Plus üyeliğiyle','In the app · with Plus','داخل اپ · با عضویت Plus'],
liveT:['Birebir canlı ders','Live 1-to-1 lessons','کلاس آنلاین با فرین'],
liveS:['Farin\'le online · ilk analiz seansı hediye','Online with Farin · free analysis session','تنها یا با حداکثر ۳ دوست (۱ تا ۴ نفر)'],
/* 2026-11-10 (farin-seo, Loop 5): freebar + fP carry in-body text links to the app / system page of their own language (crawl help: /en/app.html + /en/system.html were nav/tlink-only) */
freebar:['Kurslar <a href="/uygulama.html">FE App</a>\'in içinde ve Plus ile açılır. Uygulamanın kendisi her zaman ücretsiz.','The courses live inside <a href="/en/app.html">FE App</a> and open with Plus. The app itself is always free.','دوره‌ها داخل <a href="/fa/app.html">اپ FE</a> هستند و با Plus باز می‌شوند. خود اپ همیشه رایگان است.'],
seeApp:['Uygulamayı gör →','See the app →','اپ را ببین ←'],
appEb:['FE App','FE App','اپ FE'],
appH:['Sana göre kurulan bir uygulama'+dot('.'),'An app built around you'+dot('.'),'اپی که برای تو ساخته می‌شود'+dot('.')],
t1:['Sana özel yol haritası','A roadmap made for you','نقشه‌ی راه مخصوص خودت'],
t2:['15 oyun, A1\'den C1\'e','15 games, A1 to C1','۱۵ بازی، از A1 تا C1'],
t3:['İngilizce ve İspanyolca','English and Spanish','انگلیسی و اسپانیایی'],
startFree:['Ücretsiz başla','Start free','رایگان شروع کن'],
explore:['Uygulamayı keşfet','Explore the app','اپ را کشف کن'],
st1:['senin yolun','your path','مسیر تو'],st2:['oyna, öğren!','play, learn!','بازی کن، یاد بگیر!'],
prEb:['Öğrencilerimiz','Our students','شاگردهای ما'],
prH:['Hedeflerine ulaşanlar konuşuyor'+dot('.'),'Hear it from students who got there'+dot('.'),'از زبان کسانی که به هدفشان رسیدند'+dot('.')],
real:['gerçek sonuç','real results','نتیجه‌ی واقعی'],
pct:['%97','97%','۹۷٪'],
pctL:['öğrenci hedefine ulaştı','of students reached their goal','از شاگردها به هدفشان رسیدند'],
/* Tuğba + Dilara = real quotes, kept verbatim in their original language (Farin 09-19 / 10-07). */
q1:['"İngilizce öğrenirken hem anlaşılır hem de sıkılmadan ilerleyebileceğim bir platform arıyordum. Derslerin anlatımı oldukça açık ve anlaşılır, konular da seviyeme uygun şekilde ilerliyor. Özellikle anlamadığım yerleri daha kolay kavramamı sağlaması benim için çok faydalı oldu. İngilizcesini geliştirmek isteyen herkesin deneyebileceği güzel ve faydalı bir platform olduğunu düşünüyorum. Emeğiniz için teşekkür ederim, Farin teacher!"',
  '"I was looking for a platform where I could learn English clearly and without getting bored. The lessons are explained very clearly, and the topics move along at my level. It has been especially helpful that it makes the parts I didn\'t understand easier to grasp. I think it\'s a great, useful platform that anyone who wants to improve their English can try. Thank you for your effort, Farin teacher!"<span class="trn">Translated from Turkish</span>',
  '«دنبال پلتفرمی بودم که انگلیسی را هم قابل‌فهم و هم بدون حوصله‌سررفتن یاد بگیرم. توضیح درس‌ها خیلی روشن و قابل‌فهم است و موضوع‌ها متناسب با سطحم جلو می‌روند. مخصوصاً این‌که کمک می‌کند جاهایی را که نفهمیده بودم راحت‌تر بفهمم، برایم خیلی مفید بوده. فکر می‌کنم پلتفرم خوب و مفیدی است که هر کسی بخواهد انگلیسی‌اش را بهتر کند می‌تواند امتحانش کند. ممنون از زحمتت، فرین تیچر!»<span class="trn">ترجمه از ترکی</span>'],
q2:['<span lang="en">"Everything is going so well so far. Our lessons are both fun and sometimes challenging, but I enjoy all of them. I also like seeing my progress in the app &mdash; it is so helpful for reviewing and studying for our lessons. I can see my improvement in real life too, and it makes me so happy. I appreciate everything!"</span>',
  '"Everything is going so well so far. Our lessons are both fun and sometimes challenging, but I enjoy all of them. I also like seeing my progress in the app &mdash; it is so helpful for reviewing and studying for our lessons. I can see my improvement in real life too, and it makes me so happy. I appreciate everything!"',
  '«تا این‌جا همه‌چیز خیلی خوب پیش رفته. کلاس‌هایمان هم سرگرم‌کننده‌اند و هم گاهی چالشی، ولی از همه‌شان لذت می‌برم. دیدن پیشرفتم در اپ را هم دوست دارم؛ برای مرور و درس خواندن برای کلاس‌هایمان خیلی کمک می‌کند. پیشرفتم را در زندگی واقعی هم می‌بینم و این خیلی خوشحالم می‌کند. از همه‌چیز ممنونم!»<span class="trn">ترجمه از انگلیسی</span>'],
q3:['"İlk derste bile fark ettim, bu genel bir kurs değil, benim için kurgulanmıştı."','"Even in the first lesson I noticed: this isn\'t a generic course. It was designed for me."','«همان جلسه‌ی اول فهمیدم این یک دوره‌ی عمومی نیست؛ برای من طراحی شده بود.»'],
q4:['"Oyunlarla pratik yapmak konuşma korkumu bitirdi. Artık toplantılarda rahat konuşuyorum."','"Practising with games ended my fear of speaking. Now I speak comfortably in meetings."','«تمرین با بازی‌ها ترسم از حرف زدن را از بین برد. حالا در جلسه‌ها راحت حرف می‌زنم.»'],
q5:['"Yol haritam tam bana göreydi. Sınavıma 3 ayda hazır oldum."','"My roadmap was made exactly for me. I was ready for my exam in 3 months."','«نقشه‌ی راهم دقیقاً مخصوص من بود. در ۳ ماه برای آزمونم آماده شدم.»'],
n1:['Tuğba','Tuğba','توغبا'],n2:['Dilara','Dilara','دیلارا'],n3:['Elif','Elif','الیف'],n4:['Mert','Mert','مرت'],n5:['Zeynep','Zeynep','زینب'],
l1:['A1 öğrencisi','A1 student','شاگرد سطح A1'],l2:['B1 öğrencisi','B1 student','شاگرد سطح B1'],
lCar:['Kariyer hedefi','Career goal','هدف: کار'],lEx:['Sınav hazırlığı','Exam prep','آمادگی آزمون'],
fEb:['Kurucu eğitmen','Founder &amp; teacher','بنیان‌گذار و معلم'],
fH:['Merhaba, ben Farin'+dot('.'),'Hi, I\'m Farin'+dot('.'),'سلام، من فرین هستم'+dot('.')],
fP:['11 yıldır İngilizce öğretiyorum, beş dil konuşuyorum. FE School\'un <a href="/sistem.html">yöntemini</a>, yol haritasını ve oyunlarını bu deneyimle kurdum.',
  'I\'ve taught English for 11 years and I speak five languages. I built FE School\'s <a href="/en/system.html">method</a>, roadmap and games from that experience.',
  '۱۱ سال است انگلیسی درس می‌دهم و به پنج زبان صحبت می‌کنم. <a href="/fa/system.html">روش</a>، نقشه‌ی راه و بازی‌های FE School را با همین تجربه ساختم.'],
fAlt:['Farin, FE School kurucu eğitmeni','Farin, founder and teacher at FE School','فرین، بنیان‌گذار و معلم FE School'],
fa1:['11 yıl','11 years','۱۱ سال'],fa2:['5 dil','5 languages','۵ زبان'],fa3:['Premier TEFL (120 saat)','Premier TEFL (120 hours)','Premier TEFL (۱۲۰ ساعت)'],
sign:['Farin','Farin','فرین'],
d1:['1','1','۱'],d2:['2','2','۲'],d3:['3','3','۳'],d4:['4','4','۴'],
s1:['Hedefini seç','Pick your goal','هدفت را انتخاب کن'],s1s:['Yolun sana göre kurulur.','Your path is built around you.','مسیرت مخصوص تو ساخته می‌شود.'],
s2:['Oyna ve konuş','Play and speak','بازی کن و حرف بزن'],s2s:['Hikaye, oyun, gerçek cümleler.','Stories, games, real sentences.','داستان، بازی، جمله‌های واقعی.'],
s3:['İlerlemeni gör','See your progress','پیشرفتت را ببین'],s3s:['Her durak bir adım.','Every stop is a step.','هر ایستگاه یک قدم است.'],
howSys:['Sistemimiz nasıl çalışır? →','How does our system work? →','روش ما چطور کار می‌کند؟ ←'],
cH:['Yolun burada başlıyor'+dot('.'),'Your path starts here'+dot('.'),'مسیرت از همین‌جا شروع می‌شود'+dot('.')],
cP:['Soruların mı var? WhatsApp\'tan yaz, aynı gün dönüyorum.','Got questions? Message me on WhatsApp. I reply the same day.','سؤالی داری؟ در واتس‌اپ پیام بده، همان روز جواب می‌دهم.'],
cBtn:['Cevabını seç ↑','Pick your answer ↑','جوابت را انتخاب کن ↑'],
apH:['İngilizceni oynayarak kur'+dot('.'),'Build your English by playing'+dot('.'),'انگلیسی‌ات را با بازی بساز'+dot('.')],
apL:['Hedefini seç, yol haritan kurulsun, durak durak ilerle. Başlamak ücretsiz, kart gerekmez.','Pick your goal, get your roadmap and move forward stop by stop. Starting is free and needs no card.','هدفت را انتخاب کن، نقشه‌ی راهت ساخته شود و ایستگاه به ایستگاه جلو برو. شروع رایگان است و کارت بانکی لازم نیست.'],
k1:['Adım 1','Step 1','قدم ۱'],k2:['Adım 2','Step 2','قدم ۲'],k3:['Kırmızı Bavul','The Red Suitcase','چمدان قرمز'],k4:['15 oyun','15 games','۱۵ بازی'],
b2:['Yolun kurulur','Your path is built','مسیرت ساخته می‌شود'],b3:['Senin seçimin, senin hikâyen','Your choices, your story','انتخاب با تو، داستان مال تو'],b4:['Oyunla pekiştir','Lock it in with games','با بازی تثبیتش کن'],
andA:['Android\'e indir','Download for Android','دانلود نسخه‌ی اندروید'],andB:['iPhone\'da tarayıcıdan açılır','opens in the browser on iPhone','در آیفون از مرورگر باز می‌شود'],
pmH:['Premium kurslar Plus\'ta'+dot('.'),'The premium courses are in Plus'+dot('.'),'دوره‌های ویژه در Plus هستند'+dot('.')],
pmP:['İş İngilizcesi, IELTS, mülakat ve daha fazlası uygulamanın içinde. Her kursun Ders 1.1\'i ücretsiz; tam kurslar Plus üyeliğiyle açılır.','Business English, IELTS, job interviews and more, inside the app. Lesson 1.1 of every course is free; the full courses open with a Plus membership.','انگلیسی تجاری، آیلتس، مصاحبه و دوره‌های دیگر داخل اپ هستند. درس ۱.۱ هر دوره رایگان است و دوره‌های کامل با عضویت Plus باز می‌شوند.'],
pmBtn:['Üyelikleri gör','See the plans','عضویت‌ها را ببین'],
gamesEb:['Oyunlar','Games','بازی‌ها'],
gamesH:['Yol haritanın yarısı oyun'+dot('.'),'Half your roadmap is games'+dot('.'),'نیمی از نقشه‌ی راهت بازی است'+dot('.')],  /* 2026-11-12: app rot:5 'Learn, then play' puts a game between every two lessons, at least half of every roadmap page (was 'A game at every stop') */
gamesL:['Siparişi hazırla, davayı çöz, odayı topla. On beş oyun, hepsi İngilizce, A1\'den C1\'e her seviyede.','Prepare the order, solve the case, tidy the room. Fifteen games, all in English, at every level from A1 to C1.','سفارش را آماده کن، پرونده را حل کن، اتاق را مرتب کن. پانزده بازی، همه به انگلیسی، در همه‌ی سطح‌ها از A1 تا C1.'],
gmore:['Ve 11 oyun daha','And 11 more games','و ۱۱ بازی دیگر'],
/* homepage games band (#oyunlar, 2026-11-15: IG game posts link /#oyunlar). Art = the games' own key art (app games/posters, The Red Suitcase album 1 cover, Mini Radio sill). */
hgL:['Hikâyeli dört büyük oyun ve 11 hızlı oyun, hepsi ücretsiz uygulamada. Oyunlar yol haritanın içinde, A1\'den C1\'e.','Four big story games and 11 quick games, all in the free app. They sit on your roadmap, from A1 to C1.','چهار بازی بزرگ داستانی و ۱۱ بازی سریع، همه در اپ رایگان. بازی‌ها داخل نقشه‌ی راهت هستند، از A1 تا C1.'],
hgBtn:['Ücretsiz oyna →','Play for free →','رایگان بازی کن ←'],
hgAll:['15 oyunun hepsi','All 15 games','هر ۱۵ بازی'],
/* app page, games section: The Red Suitcase album 2 (YC_A2_LIVE = true in the English app since 2026-11-15, cbb80ac6; art/istanbul; A2 roadmap cards). Spanish A2 not live yet, the site's app is the English one. */
gNewP:['Yeni','New','تازه'],
gNew:['Kırmızı Bavul\'un 2. albümü <b>The Bazaar Key</b>, İstanbul\'da geçiyor: Galata, Pera ve Kapalıçarşı. A2 yol haritanda, ücretsiz.','The Red Suitcase album 2, <b>The Bazaar Key</b>, is set in Istanbul: Galata, Pera and the Grand Bazaar. It is on your A2 roadmap, free.','آلبوم دوم چمدان قرمز، <b>The Bazaar Key</b>، در استانبول می‌گذرد: گالاتا، پرا و بازار بزرگ. در نقشه‌ی راه A2 توست و رایگان است.'],
/* natural-voice band (brief 5.1 §4b, gate G1 cleared 2026-11-09: audio/en/manifest.json + alt/manifest.json live on the deployed app, words, sentences and stories voiced, accent pill on screen) */
vEb:['Dinle','Listen','گوش کن'],
vH:['Doğal ses. İki aksan'+dot('.'),'Natural voices. Two accents'+dot('.'),'صدای طبیعی. دو لهجه'+dot('.')],
vP:['Kelimeleri, cümleleri ve hikayeleri doğal bir ses okur: Bella Amerikan, George İngiliz aksanıyla.','Words, sentences and stories are read by a natural voice: Bella with an American accent, George with a British one.','کلمه‌ها، جمله‌ها و داستان‌ها را یک صدای طبیعی می‌خواند: بلا با لهجه‌ی آمریکایی و جورج با لهجه‌ی بریتانیایی.'],
vB:['Bella · Amerikan İngilizcesi','Bella · American English','بلا · انگلیسی آمریکایی'],vG:['George · İngiliz İngilizcesi','George · British English','جورج · انگلیسی بریتانیایی'],
vM:['Hangi aksanı duyduğun ekranda yazar.','The screen shows which accent you are hearing.','روی صفحه نوشته می‌شود کدام لهجه را می‌شنوی.'],
cmpEb:['Sana göre','Made for you','مخصوص تو'],
cmpH:['Aynı seviye. Başka hedef. Başka yol'+dot('.'),'Same level. Different goal. Different path'+dot('.'),'همان سطح. هدف دیگر. مسیر دیگر'+dot('.')],
cmpL:['Hedeflerin, seviyen ve sevdiğin konular yolunu çizer. Hedefin değişirse yolun da değişir. Bir uygulama seçerken neden önce hedef sorusuna bakman gerektiğini <a href="/blog/ingilizce-ogrenmek-icin-hangi-uygulama.html">İngilizce öğrenmek için hangi uygulama daha iyi</a> yazısında anlattım.','Your goals, your level and the topics you enjoy draw your path. Change your goal and your path changes too.','هدف‌ها، سطح و موضوع‌های مورد علاقه‌ات مسیرت را می‌سازند. اگر هدفت عوض شود، مسیرت هم عوض می‌شود.'],
cap1:['B1 · Seyahat','B1 · Travel','B1 · سفر'],cap2:['B1 · Kariyer ve İş','B1 · Career &amp; work','B1 · کار و شغل'],
syH:['Diğer dil okullarına benzemiyoruz'+dot('.'),'We\'re not like other language schools'+dot('.'),'ما شبیه بقیه‌ی آموزشگاه‌های زبان نیستیم'+dot('.')],
syL:['Ezber listesi yok. Yaşadığını daha kolay hatırlarsın.','No lists to memorise. You remember what you live through.','خبری از لیست حفظ‌کردنی نیست. چیزی را که تجربه کنی راحت‌تر یادت می‌ماند.'],
bS:['Hikayeyle öğrenirsin','You learn through stories','با داستان یاد می‌گیری'],
bSp:['Kelimeler bir listede değil, bir hikayenin ya da videonun içinde gelir.','Words come inside a story or a video, not a list.','کلمه‌ها داخل یک داستان یا ویدیو می‌آیند، نه در یک لیست.'],
bE:['Başkasının yerine geçip konuşursun','You step into someone else\'s shoes','جای یک نفر دیگر حرف می‌زنی'],
bEp:['Gerçek cümleleri bir rolün içinde söylersin. Konuşma korkusu azalır.','You say real sentences inside a role, and your fear of speaking fades.','جمله‌های واقعی را در قالب یک نقش می‌گویی و ترس از حرف زدن کم می‌شود.'],
bL:['Oyunlarla pekiştirirsin','You lock it in with games','با بازی تثبیتش می‌کنی'],
bLp:['15 oyun, A1\'den C1\'e her seviyede. Tekrar, oyunun içinde olur.','15 games at every level from A1 to C1. Review happens inside the game.','۱۵ بازی در همه‌ی سطح‌ها از A1 تا C1. مرور داخل خود بازی اتفاق می‌افتد.'],
bF:['Yol sana göre kurulur','Your path is built around you','مسیر برای تو ساخته می‌شود'],
bFp:['Hedefin, seviyen ve temponla. İki kişinin yolu aynı olmaz.','From your goal, your level and your pace. No two paths are the same.','با هدف، سطح و سرعت خودت. مسیر هیچ دو نفری یکی نیست.'],
trEb:['Nasıl ilerlersin','How you progress','چطور پیش می‌روی'],
trH:['Testten bir sonraki seviyeye'+dot('.'),'From the test to your next level'+dot('.'),'از تعیین سطح تا سطح بعدی'+dot('.')],
t_1:['Seviye testi','Level test','تعیین سطح'],t_1s:['5 dakika','5 minutes','۵ دقیقه'],
t_2:['Yol haritan','Your roadmap','نقشه‌ی راهت'],t_2s:['hedefine göre','built on your goal','بر اساس هدفت'],
t_3:['Hikaye + oyun','Stories + games','داستان + بازی'],t_3s:['durak durak','stop by stop','ایستگاه به ایستگاه'],
t_4:['Kontrol','Check','سنجش'],t_4s:['ne öğrendin','what you learned','آنچه یاد گرفتی'],
t_5:['Sonraki seviye','Next level','سطح بعدی'],
studio:['FE Studio: oyunlarımızı kendimiz yapıyoruz →','FE Studio: we make our own games →','FE Studio: بازی‌هایمان را خودمان می‌سازیم ←'],
ctH:['Bir mesaj yeter'+dot('.'),'One message is enough'+dot('.'),'یک پیام کافی است'+dot('.')],
ctL:['Kurs, birebir ders ya da sadece bir soru. Aynı gün dönüyorum.','A course, 1-to-1 lessons or just a question. I reply the same day.','دوره، کلاس آنلاین یا فقط یک سؤال. همان روز جواب می‌دهم.'],
waL:['WhatsApp','WhatsApp','واتس‌اپ'],
waBtn:['WhatsApp\'tan yaz','Message on WhatsApp','پیام در واتس‌اپ'],
copy:['Numarayı kopyala','Copy number','کپی شماره'],copied:['Kopyalandı','Copied','کپی شد'],
needH:['Yazarken bunları ekle','What to include','در پیامت این‌ها را بنویس'],
nd1:['Adın','Your name','اسمت'],
nd2:['Hedefin: iş, IELTS, mülakat, konuşma…','Your goal: work, IELTS, interview, speaking…','هدفت: کار، آیلتس، مصاحبه، مکالمه…'],
nd3:['Seviyen, biliyorsan','Your level, if you know it','سطحت، اگر می‌دانی'],
nd4:['Birebir ders için uygun gün ve saatler','Days and times that suit you for 1-to-1 lessons','روزها و ساعت‌های مناسب، و اگر با دوستانت می‌آیی، تعداد نفرات'],
faqH:['Sık sorulanlar','Common questions','سؤال‌های رایج'],
fq1:['Uygulama gerçekten ücretsiz mi?','Is the app really free?','اپ واقعاً رایگان است؟'],
fa_1:['Evet. Yol haritası, oyunlar, dersler ve pratik ücretsiz. Plus üyeliği bütün premium kursları ve her yol haritası sayfasının sonundaki sayfa karnesini açar; Guided buna birebir koçluğu ekler.','Yes. The roadmap, games, lessons and practice are free. A Plus membership opens every premium course and the page report at the end of each roadmap page; Guided adds one-to-one coaching.','بله. نقشه‌ی راه، بازی‌ها، درس‌ها و تمرین‌ها رایگان‌اند. عضویت Plus همه‌ی دوره‌های ویژه و کارنامه‌ی پایان هر صفحه‌ی نقشه‌ی راه را باز می‌کند و Guided کوچینگ خصوصی را هم اضافه می‌کند.'],
fq2:['Bir kursu nasıl alırım?','How do I get a course?','دوره را چطور بگیرم؟'],
fa_2:['Her premium kursun Ders 1.1\'i uygulamada ücretsiz. Kursun tamamı Plus üyeliğinde: aylık ₺319 ya da yıllık ₺2.290. Uygulamada Ana Sayfa\'daki üyelik kutusuna dokun, Plus\'ı seç ve ödemeni yap; ödemen onaylanınca bütün premium kurslar açılır.','Lesson 1.1 of every premium course is free in the app. The full course comes with a Plus membership: ₺319 a month or ₺2,290 a year (in Iran 629,000 toman a month or 5,690,000 a year). In the app, tap the membership box on Home, choose Plus and pay; once your payment is confirmed, every premium course opens.','درس ۱.۱ هر دوره‌ی ویژه داخل اپ رایگان است. دوره‌ی کامل با عضویت Plus باز می‌شود: ماهی ۶۲۹٬۰۰۰ تومان یا سالی ۵٬۶۹۰٬۰۰۰ تومان. داخل اپ روی کادر عضویت در صفحه‌ی اصلی بزن، Plus را انتخاب کن و پرداخت را انجام بده؛ بعد از تأیید پرداخت، همه‌ی دوره‌های ویژه باز می‌شوند.'],
fq4:['Perşembe konuşma kulüpleri nasıl işliyor?','How do the Thursday speaking clubs work?','باشگاه‌های مکالمه‌ی پنجشنبه چطور برگزار می‌شوند؟'],
fa_4:['Her perşembe Türkiye saatiyle 12:30, 13:30, 14:30, 15:30, 16:30 ve 17:30\'da birer grup başlar (İran saatiyle 13:00–18:00): 4 İngilizce, 2 İspanyolca grup, A1–B1 seviyelerinde. Her grupta 8 kişilik yer var ve her seans bir saat sürer. Seans ₺300; Guided üyelerine ücretsiz. Yerini uygulamadan ayırtırsın: Kulüp › Gruplarım.','Every Thursday a group starts on the hour from 13:00 to 18:00 Iran time (12:30 to 17:30 in Turkey): 4 English and 2 Spanish groups, A1 to B1. Each group has 8 seats and each session lasts an hour. A session costs ₺300 or 500,000 toman, and Guided members join free. You book your seat in the app: Club › My Groups.','هر پنجشنبه از ساعت ۱۳ تا ۱۸ به وقت ایران، سر هر ساعت یک گروه شروع می‌شود: ۴ گروه انگلیسی و ۲ گروه اسپانیایی، در سطح A1 تا B1. هر گروه ۸ جا دارد و هر جلسه یک ساعت است. هر جلسه ۵۰۰٬۰۰۰ تومان است و برای اعضای Guided رایگان. جایت را داخل اپ رزرو می‌کنی: باشگاه › گروه‌های من.'],
fq3:['Birebir ders nasıl işliyor?','How do 1-to-1 lessons work?','کلاس آنلاین چطور است؟'],
fa_3:['Online, sadece sen ve Farin. Aylık paket: ayda 4 ders ₺3.400, 8 ders ₺6.720 ya da 12 ders ₺9.960, sen seç; 3 ayı tek seferde ödersen 8 ve 12 derslik paketlerde %20 indirim. Ödemeden sonra ücretsiz bir analiz seansı: seviye tespiti, hedef belirleme ve sana özel yol haritası. Paketinin dışında, ek olarak.','Online, just you and Farin. A monthly pack: 4 lessons a month ₺3,400, 8 lessons ₺6,720 or 12 lessons ₺9,960, your choice; pay 3 months at once and get 20% off the 8- and 12-lesson packs. Free analysis session after you pay: level test, goal setting and your personal roadmap. Extra to your pack.','آنلاین با فرین، تنها یا با حداکثر ۳ دوست (۱ تا ۴ نفر). پرداخت ماهانه است و هر جلسه ۵۰ دقیقه؛ ۴، ۸ یا ۱۲ جلسه در ماه، به انتخاب خودت. اگر هزینه‌ی ۳ ماه را یک‌جا بپردازی، بسته‌های ۸ و ۱۲ جلسه‌ای ۲۰٪ تخفیف دارند. بسته‌ی ۴ جلسه‌ای کلاس تجاری ماهی ۱۸٬۰۰۰٬۰۰۰ تومان و کلاس عمومی شخصی‌سازی‌شده ماهی ۱۴٬۰۰۰٬۰۰۰ تومان است (بسته‌ی ۸ و ۱۲ جلسه‌ای به همین نسبت) و هزینه‌ی بسته بین اعضای گروه تقسیم می‌شود. جلسه‌ی اول یک جلسه‌ی تحلیل رایگان است و جدا از جلسه‌های بسته‌ی ماهانه حساب می‌شود: تعیین سطح، تعیین هدف و ساخت نقشه‌ی راه شخصی‌ات. بعد از پرداخت برگزار می‌شود.'],
tag:['Öğrenmen gerektiği için değil, gidecek bir yerin olduğu için.','Not because you have to learn, but because you have somewhere to go.','نه چون باید یاد بگیری؛ چون جایی برای رفتن داری.'],
blog:['Blog','Blog (Turkish)','وبلاگ (ترکی)'],
coQ:['Şirketin için profesyonel kurslar mı istiyorsun','Want professional courses for your company','برای شرکتت دوره‌ی حرفه‌ای می‌خواهی'],
coMark:['?','?','؟'],
coS:['Çalışanların için Plus üyelikleri: bütün iş İngilizcesi kursları','Plus seats for your staff: every work English course','عضویت Plus برای کارمندانت: همه‌ی دوره‌های انگلیسی کاری'],
coEb:['Şirketler için','For companies','برای شرکت‌ها'],
coP:['Her çalışana bir Plus üyeliği: bütün premium kurslar ve her yol haritası sayfasının karnesi. Herkes kendi hızında, kendi rolüne uyan kursla başlar.','Each employee gets a Plus seat: every premium course and the page reports. Everyone learns at their own pace and starts with the course for their role.','برای هر کارمند یک عضویت Plus: همه‌ی دوره‌های ویژه و کارنامه‌ی هر صفحه‌ی نقشه‌ی راه. هر کس با سرعت خودش و با دوره‌ی متناسب با نقشش شروع می‌کند.'],
coEach:['çalışan başına','per employee','برای هر کارمند'],coSeat:['Plus üyeliği','Plus seat','عضویت Plus'],coIn:['Her Plus üyeliğinde','In every Plus seat','داخل هر عضویت Plus'],
coOffer:['Ekibinin büyüklüğüne göre sana yazılı bir teklif hazırlarım. Analiz seansı ve Kurs Raporu her çalışan için ücretsiz. Canlı dersler isteğe bağlıdır ve ayrıca konuşulur.','I\'ll prepare a written offer based on the size of your team. The analysis session and the Course Report are free for every employee. Live classes are optional and agreed separately.','جلسه‌ی نیازسنجی و گزارش دوره برای هر کارمند رایگان است. کلاس زنده اختیاری است و جدا توافق می‌شود: هر ۵۰ دقیقه ۴٬۵۰۰٬۰۰۰ تومان برای گروه ۲ تا ۴ نفره، بدون تخفیف و بیرون از برآورد عضویت‌ها.'],
coFill:['','','برآورد هزینه برای تیمت'],
coWa:['Şirketim için teklif al','Get an offer for my company','در واتس‌اپ بپرس'],
coWaMsg:['Merhaba Farin! Şirketimiz için kurslarla ilgileniyoruz.','Hi Farin! We\'re interested in courses for our company.','سلام فرین! برای شرکتمان به دوره‌ها علاقه داریم.'],
fCo:['Şirketler için','For companies','برای شرکت‌ها'],
also:['Ayrıca','Also','همچنین'],want:['Bu kursu istiyorum','I want this course','این دوره را می‌خواهم'],
waHello:['Merhaba Farin! FE School hakkında bilgi almak istiyorum.','Hi Farin! I\'d like to know more about FE School.','سلام فرین! می‌خواهم درباره‌ی FE School بیشتر بدانم.'],
// footer
fcCourses:['Kurslar ve dersler','Course pages (in Turkish)','صفحه‌های دوره (به ترکی)'],
fcSchool:['FE School','FE School','FE School'],fcGuide:['Rehber','Guides','راهنما'],
gH:['Yeni rehberler','New guides','راهنماهای تازه'],gMore:['Diğer rehberler','More guides','راهنماهای دیگر'],gRead:['Oku','Read','بخوان'],gAll:['Tüm rehberler','All guides','همه‌ی راهنماها'],fcContact:['İletişim','Contact','تماس'],
fBiz:['İş İngilizcesi','Business English','انگلیسی تجاری'],fIelts:['IELTS hazırlık','IELTS prep','آمادگی آیلتس'],
fEn:['Online İngilizce özel ders','English lessons','کلاس انگلیسی'],fEs:['İspanyolca özel ders','Spanish lessons','کلاس اسپانیایی'],fDe:['Almanca özel ders','German lessons','کلاس آلمانی'],
fStudio:['Stüdyo','Studio','استودیو'],fEmail:['E-posta','Email','ایمیل'],fPrivacy:['Gizlilik Politikası','Privacy policy','سیاست حریم خصوصی'],
rights:['FE School. Tüm hakları saklıdır.','FE School. All rights reserved.','FE School. همه‌ی حقوق محفوظ است.'],
};

/* ===== 2026-11-26 refresh (Farin: "update the website, and focus on our community, the app, our features, specially the games").
   Order of weight on the home pages: games, community, the app's features, then the Free / Plus / Guided packages.
   Courses have no price of their own any more (Farin 2026-11-26: "courses can be get through plus and guided"). ===== */
const S2 = {
/* course cards: the app's own wording ("Lesson 1.1 free · full course with Plus") */
fullPlus:['Tam kurs Plus ile','Full course with Plus','دوره‌ی کامل با Plus'],
fullPlusMid:['tam kurs Plus ile','full course with Plus','دوره‌ی کامل با Plus'],
seePlus:['Plus\'ı gör','See Plus','Plus را ببین'],
/* games band */
rsK:['Çizgi roman macera','Comic adventure','ماجرای کمیک'],
rsP:['Bir kırmızı bavulla küçük bir sahil kasabasına gelirsin. Ne diyeceğini sen seçersin, hikâye ona göre ilerler. Başrolde sen varsın, kendi adınla.','You arrive in a small seaside town with one red suitcase. You choose what to say, and the story follows. You play the lead, under your own name.','با یک چمدان قرمز به یک شهر کوچک ساحلی می‌رسی. خودت انتخاب می‌کنی چه بگویی و داستان بر همان اساس جلو می‌رود. نقش اصلی با توست، با اسم خودت.'],
rsAlb:['Dört albüm, A1\'den B2\'ye','Four albums, A1 to B2','چهار آلبوم، از A1 تا B2'],
rsEs:['İspanyolca öğreniyorsan: <i lang="es">La maleta roja</i>, Cudillero\'da.','Learning Spanish? <i lang="es">La maleta roja</i> is set in Cudillero.','اسپانیایی یاد می‌گیری؟ <i lang="es">La maleta roja</i> در <bdi lang="es">Cudillero</bdi> می‌گذرد.'],
faceH:['Kasabanın insanları','Meet the town','آدم‌های شهر'],
faceP:['Oyunların çoğu aynı liman kasabasında geçer: aynı komşularla kafede, sokakta ve iskelede yeniden karşılaşırsın.','Most games are set in the same harbour town, so you keep meeting the same neighbours: in the café, on the street, on the pier.','بیشتر بازی‌ها در همان شهر بندری می‌گذرند؛ همان همسایه‌ها را دوباره در کافه، خیابان و اسکله می‌بینی.'],
quickL:['+ 8 hızlı oyun','+ 8 quick games','+ ۸ بازی سریع'],
gsL:['Uygulamada 15 oyun var: hikâyeli büyük oyunlar ve hızlı oyunlar, A1\'den C1\'e. Yol haritanın her sayfasının yarısı oyun ve oyunların hepsi ücretsiz.','The app has 15 games: big story games and quick ones, from A1 to C1. Half of every roadmap page is games, and every game is free.','اپ ۱۵ بازی دارد: بازی‌های بزرگ داستانی و بازی‌های سریع، از A1 تا C1. نیمی از هر صفحه‌ی نقشه‌ی راهت بازی است و همه‌ی بازی‌ها رایگان‌اند.'],
/* community band */
cmEb:['Topluluğumuz','Our community','جمع ما'],
cmH:['Yalnız öğrenmiyorsun'+dot('.'),'You don\'t learn alone'+dot('.'),'تنها یاد نمی‌گیری'+dot('.')],
cmL:['Her perşembe canlı konuşma kulüpleri, uygulamada kendi Öğrenci Kulübün ve sorularına cevap veren Farin.','Live speaking clubs every Thursday, your own Student Club in the app, and Farin answering your questions.','هر پنجشنبه باشگاه مکالمه‌ی زنده، باشگاه دانش‌آموزان خودت داخل اپ و فرین که جواب سؤال‌هایت را می‌دهد.'],
spPill:['Her perşembe','Every Thursday','هر پنجشنبه'],
spH:['Perşembe konuşma kulüpleri','Thursday speaking clubs','باشگاه‌های مکالمه‌ی پنجشنبه'],
spP:['Bir saatlik canlı gruplarda, seviyene yakın insanlarla İngilizce ya da İspanyolca konuşursun. Uygulama sana seviyene, hedeflerine ve sevdiğin konulara uyan grupları gösterir.','One-hour live groups where you speak English or Spanish with people near your level. The app shows you the groups that fit your level, your goals and the topics you love.','در گروه‌های زنده‌ی یک‌ساعته با آدم‌های هم‌سطح خودت انگلیسی یا اسپانیایی حرف می‌زنی. اپ گروه‌هایی را نشانت می‌دهد که به سطح، هدف‌ها و موضوع‌های مورد علاقه‌ات می‌خورند.'],
spTz:['Türkiye saati (İran saatiyle 13:00–18:00)','Iran time (in Turkey, 30 minutes earlier)','به وقت ایران'],
spEn:['İngilizce','English','انگلیسی'],spEs:['İspanyolca','Spanish','اسپانیایی'],
spF1:['8 kişilik gruplar','Groups of 8','گروه‌های ۸ نفره'],spF2:['Seans 1 saat','One-hour sessions','جلسه‌های یک‌ساعته'],
spF3:['Seans ₺300','₺300 or 500,000 toman a session','هر جلسه ۵۰۰٬۰۰۰ تومان'],spF4:['Guided üyelerine ücretsiz','Free with Guided','برای اعضای Guided رایگان'],
spHow:['Yerini uygulamadan ayırt: <b>Kulüp › Gruplarım</b>. Bir seferde 1–4 perşembe seçebilirsin; Farin ödemeni onaylayınca yer senindir.','Book your seat in the app: <b>Club › My Groups</b>. Pick 1 to 4 Thursdays at a time; the seat is yours once Farin confirms your payment.','جایت را داخل اپ رزرو کن: <b>باشگاه › گروه‌های من</b>. هر بار می‌توانی ۱ تا ۴ پنجشنبه انتخاب کنی؛ وقتی فرین پرداختت را تأیید کند، جا مال توست.'],
spAlt:['FE App: Gruplarım ekranında sana uyan konuşma kulüpleri','FE App: the My Groups screen with the speaking clubs that fit you','اپ FE: صفحه‌ی «گروه‌های من» با باشگاه‌های مکالمه‌ای که به تو می‌خورند'],
scH:['Öğrenci Kulübü','Student Club','باشگاه دانش‌آموزان'],
scP:['Alt çubuktaki <b>Kulüp</b> sekmesi senin köşen: ilerlemen ve konuşma grupların burada.','The <b>Club</b> tab in the bottom bar is your corner: your progress and your speaking groups live there.','تب <b>باشگاه</b> در نوار پایین اپ گوشه‌ی خودت است: پیشرفتت و گروه‌های مکالمه‌ات همین‌جاست.'],
msH:['Farin\'e uygulamadan yaz','Message Farin in the app','در اپ به فرین پیام بده'],
msP:['<b>Mesajlar</b> sekmesinden her şeyi sorabilirsin: bir kelime, bir kurs, bir kulüp yeri. Farin genelde bir gün içinde cevap verir.','Ask anything in the <b>Messages</b> tab: a word, a course, a club seat. Farin usually answers within a day.','در تب <b>پیام‌ها</b> هر سؤالی داری بپرس: یک کلمه، یک دوره، یک جا در باشگاه. فرین معمولاً تا یک روز جواب می‌دهد.'],
cmBtn:['Kulübü uygulamada aç','Open the Club in the app','باشگاه را در اپ باز کن'],
/* app features band */
ftL:['İlk sorularda seviyeni, hedeflerini ve sevdiğin konuları seçersin; yol haritan bunlardan kurulur. Başlamak ücretsiz, kart gerekmez.','In the first questions you pick your level, your goals and the topics you love, and your roadmap is built from them. Starting is free and needs no card.','در سؤال‌های اول سطح، هدف‌ها و موضوع‌های مورد علاقه‌ات را انتخاب می‌کنی و نقشه‌ی راهت از همین‌ها ساخته می‌شود. شروع رایگان است و کارت بانکی لازم نیست.'],
ftEb:['Uygulamada neler var','What\'s in the app','داخل اپ چه چیزهایی هست'],
/* packages band */
pkEb:['Üyelik','Membership','عضویت'],
pkH:['Ücretsiz başla. İstediğinde büyüt'+dot('.'),'Start free. Grow when you\'re ready'+dot('.'),'رایگان شروع کن. هر وقت خواستی بیشترش کن'+dot('.')],
pkL:['Uygulamanın kendisi ücretsiz. Premium kurslar Plus\'ta; Guided\'da yanında bir öğretmen de var.','The app itself is free. The premium courses are in Plus, and Guided adds a teacher by your side.','خود اپ رایگان است. دوره‌های ویژه در Plus هستند و Guided یک معلم هم کنارت می‌گذارد.'],
pkFreeB:['Sana özel İngilizce yolun.','Your personal English path.','مسیر شخصی تو برای یادگیری انگلیسی.'],
pkPlusB:['Bütün premium kurslar ve her yol haritası sayfası için bir karne.','Every premium course, and a report on each roadmap page.','همه‌ی دوره‌های ویژه، و یک کارنامه برای هر صفحه‌ی نقشه‌ی راه.'],
pkGuidB:['Plus\'taki her şey, yanında bir öğretmenle.','Everything in Plus, with a teacher by your side.','همه‌ی امکانات Plus، با معلمی که کنارت است.'],
pkFree:['Ücretsiz','Free','رایگان'],pkAlways:['her zaman','always','همیشه'],
pkMonth:['/ ay','/ month','تومان در ماه'],
pkInFree:['Free\'deki her şey, artı:','Everything in Free, plus:','همه‌ی امکانات Free، به‌اضافه‌ی:'],
pkInPlus:['Plus\'taki her şey, artı:','Everything in Plus, plus:','همه‌ی امکانات Plus، به‌اضافه‌ی:'],
pkF:[['Kişisel seviye testi ve yol haritası','Personal level test and roadmap','تعیین سطح و نقشه‌ی راه شخصی'],['Bütün öğrenme hedefleri','All learning goals','همه‌ی هدف‌های یادگیری'],['Oyunlar, dersler, alıştırmalar ve pratik','Games, lessons, exercises and practice','بازی‌ها، درس‌ها، تمرین‌ها و پرکتیس'],['Her premium kursun ilk dersi','The first lesson of every premium course','درس اول همه‌ی دوره‌های ویژه']],
pkP:[['Bütün premium kurslar','All premium courses','همه‌ی دوره‌های ویژه'],['Her yol haritası sayfasını bitirince sayfa karnen','A page report each time you finish a roadmap page','کارنامه‌ی صفحه، هر بار که یک صفحه‌ی نقشه‌ی راه را تمام می‌کنی']],
pkG:[['Ayda 2 birebir koçluk seansı, öğrenme yoluna göre','2 one-to-one coaching sessions a month, on your learning path','ماهی ۲ جلسه‌ی کوچینگ خصوصی، بر اساس مسیر یادگیری‌ات'],['Perşembe konuşma kulüpleri ücretsiz','Thursday speaking clubs, free','باشگاه‌های مکالمه‌ی پنجشنبه، رایگان'],['Sana özel ödevler','Homework made for you','تکلیف‌هایی که مخصوص تو طراحی می‌شوند'],['Farin ödevlerini kontrol edip geri bildirim verir','Farin checks your homework and gives you feedback','فرین تکلیف‌هایت را بررسی می‌کند و بازخورد می‌دهد'],['Farin\'e WhatsApp\'tan yaz','Message Farin on WhatsApp','در واتس‌اپ به فرین پیام بده']],
pkCourses:['İK ve İş İngilizcesi · IELTS · İş Mülakatı · Metin Yazarlığı · Satış ve Dış Ticaret · Yapay Zekâ ve İnternet · Kapsamlı İş İngilizcesi','HR &amp; Business · IELTS · Job Interview · Copywriting · Sales &amp; Trade · AI &amp; the Internet · Complete Business English','منابع انسانی و کسب‌وکار · آیلتس · مصاحبه‌ی شغلی · کپی‌رایتینگ · فروش و بازرگانی · هوش مصنوعی و اینترنت · دوره‌ی جامع تجاری'],
pkBtnF:['Ücretsiz başla','Start free','رایگان شروع کن'],pkBtnP:['Plus\'ı uygulamada al','Get Plus in the app','Plus را در اپ بگیر'],pkBtnG:['Guided\'ı uygulamada seç','Choose Guided in the app','Guided را در اپ انتخاب کن'],
pkBadge:['Bütün kurslar','Every course','همه‌ی دوره‌ها'],
pkNote:['Üyeliği uygulamadan alırsın: Ana Sayfa\'daki üyelik kutusuna dokun, planını seç ve ödemeni yap; ödemen onaylanınca üyeliğin başlar. Uygulamada, üyelik sayfasını ilk açtığında 48 saatlik bir tanışma fiyatı var.','You get a membership in the app: tap the membership box on Home, pick your plan and pay; it starts once your payment is confirmed. There is a 48-hour intro price in the app when you first open the membership page.','عضویت را داخل اپ می‌گیری: روی کادر عضویت در صفحه‌ی اصلی بزن، پلن خودت را انتخاب کن و پرداخت را انجام بده؛ بعد از تأیید پرداخت، عضویتت شروع می‌شود. وقتی صفحه‌ی عضویت را برای اولین بار باز کنی، داخل اپ یک قیمت ۴۸ ساعته‌ی شروع می‌بینی.'],
pkAlt:['FE App: premium kurslar, her kartta "Ders 1.1 ücretsiz · tam kurs Plus ile"','FE App: the premium courses, each card saying "Lesson 1.1 free · full course with Plus"','اپ FE: دوره‌های ویژه، روی هر کارت «درس ۱.۱ رایگان · دوره‌ی کامل با Plus»'],
};
/* membership prices = MB_PRICES regular in the app (Claude/tools/membership/mb-app.js, farin-24, 2026-11-26). Regular prices only:
   the 48-hour intro price lives only in the app (per account, server clock). Iran in toman, never rial. */
const MB = { tr: { plus: [319, 2290], guided: [3190, 28900] }, ir: { plus: [629000, 5690000], guided: [2490000, 22490000] } };
const SPK_TL = 300, SPK_TOMAN = 500000;   /* speaking club session, = SPK_PRICE in Claude/tools/speaking-club/spk-block.js */
const grp = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const faNum = n => grp(n, '٬').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const lira = (l, n) => '₺' + grp(n, l === 'tr' ? '.' : ',');
const yearTxt = (l, plan) => l === 'fa' ? `یا سالی ${faNum(MB.ir[plan][1])} تومان` : l === 'tr' ? `ya da yıllık ${lira('tr', MB.tr[plan][1])}` : `or ${lira('en', MB.tr[plan][1])} a year`;
/* The games (names = gameDisplayName() in the app; levels checked in the app's GAME_ROTATION / CASE_LEVELS / YC_LEVELS, 2026-11-26).
   Art = the 3D posters of farin-english dda98a5a, copied into site/assets/game (the site never links the app's files). */
const RS_ALBUMS = [['A1', 'Whitby', 'The Camera'], ['A2', ['İstanbul', 'Istanbul', 'استانبول'], 'The Bazaar Key'], ['B1', 'Vík', 'Fire and Ice'], ['B2', 'Tsugaru', 'The Silent Train']];
const GAMES3D = [
  { img: 'p3d-harbour-files', c: '--purple', lv: 'A1–C1', k: ['Gizem', 'Mystery', 'معمایی'], name: ['Liman Dosyaları', 'Harbour Files', 'پرونده‌های بندر'], en: 'Harbour Files',
    d: ['İpuçlarını dikkatle oku ve kimin yaptığını bul. Her seviyede iki gizem bölümü.', 'Read the clues carefully and find who did it. Two mystery episodes at every level.', 'سرنخ‌ها را با دقت بخوان و پیدا کن کار چه کسی بوده. در هر سطح دو قسمت معمایی.'],
    alt: ['Liman Dosyaları afişi: yağmurlu limanda not defteriyle bir dedektif', 'Harbour Files poster: a detective with a notebook on the rainy harbour', 'پوستر پرونده‌های بندر: کارآگاهی با دفترچه در بندر بارانی'] },
  { img: 'p3d-open-house', c: '--g-career', lv: 'A1–C1', k: ['Komşuluk', 'Neighbours', 'همسایگی'], name: ['Açık Kapı', 'Open House', 'خانه‌ی باز'], en: 'Open House',
    d: ['Bir sokakta komşulara küçük işlerde yardım et: kek pişir, çamaşırı yık. Cümleleri takip et, işi bitir.', 'Help the neighbours with small jobs on one street: bake a cake, do the laundry. Follow the sentences, finish the job.', 'در یک خیابان به همسایه‌ها در کارهای کوچک کمک کن: کیک بپز، لباس‌ها را بشوی. جمله‌ها را دنبال کن و کار را تمام کن.'],
    alt: ['Açık Kapı afişi: sokakta gülümseyen komşular ve bir kedi', 'Open House poster: smiling neighbours and a cat in the street', 'پوستر خانه‌ی باز: همسایه‌های خندان و یک گربه در خیابان'] },
  { img: 'p3d-order-up', c: '--orange-deep', lv: 'A1–C1', k: ['Kafe', 'Café', 'کافه'], name: ['Sipariş Hazır!', 'Order Up!', 'سفارش حاضر!'], en: 'Order Up!',
    d: ['Sam\'in kafesinde her müşterinin siparişini dinle ve tepsiye hazırla.', 'At Sam\'s café, listen to each customer\'s order and build it on the tray.', 'در کافه‌ی سم سفارش هر مشتری را گوش کن و روی سینی بچین.'],
    alt: ['Sipariş Hazır! afişi: elinde kahve ve pastayla gülümseyen Sam', 'Order Up! poster: Sam smiling with a coffee and a slice of cake', 'پوستر سفارش حاضر!: سم با یک فنجان قهوه و یک برش کیک'] },
  { img: 'p3d-passport-desk', c: '--g-imm', lv: 'A1–C1', k: ['Dinle ve düzelt', 'Listen and fix', 'گوش کن و درست کن'], name: ['Pasaport Masası', 'Passport Desk', 'میز گذرنامه'], en: 'Passport Desk',
    d: ['İskeledeki kulübede her yolcuyu dinle ve kartındaki hatayı düzelt.', 'In the booth on the pier, listen to each traveller and fix the mistake on their card.', 'در باجه‌ی کنار اسکله به هر مسافر گوش کن و اشتباه کارتش را درست کن.'],
    alt: ['Pasaport Masası afişi: kulübede damga basan görevli', 'Passport Desk poster: the officer stamping a passport in his booth', 'پوستر میز گذرنامه: مأموری که در باجه مهر می‌زند'] },
  { img: 'p3d-mini-radio', c: '--g-exam', lv: 'A1–C1', k: ['Dinleme', 'Listening', 'شنیداری'], name: ['Mini Radyo', 'Mini Radio', 'رادیو کوچک'], en: 'Mini Radio',
    d: ['Radyoyu ayarla, parça parça dinle ve ana fikri yakala.', 'Tune in, listen part by part, and catch the big picture.', 'رادیو را تنظیم کن، قسمت‌به‌قسمت گوش کن و موضوع اصلی را بفهم.'],
    alt: ['Mini Radyo afişi: eski radyonun yanında kahvesini içen bir balıkçı', 'Mini Radio poster: a fisherman with his coffee next to an old radio', 'پوستر رادیو کوچک: ماهیگیری کنار یک رادیوی قدیمی با فنجان قهوه'] },
  { img: 'p3d-magic-words', c: '--purple-ink', lv: null, k: ['Hızlı oyun', 'Quick game', 'بازی سریع'], name: ['Sihirli Kelimeler', 'Magic Words', 'کلمات جادویی'], en: 'Magic Words',
    d: ['Eksik kelimeyi bul, harf harf yaz ve sihirli kapıyı aç.', 'Find the missing word, spell it, and open the magic door.', 'کلمه‌ی جاافتاده را پیدا کن، حرف‌هایش را بچین و در جادویی را باز کن.'],
    alt: ['Sihirli Kelimeler afişi: parlayan sihirli kapıyı açan bir kız', 'Magic Words poster: a girl opening the glowing magic door', 'پوستر کلمات جادویی: دختری که در جادویی درخشان را باز می‌کند'] },
];
/* the other 8 quick games (app gameDisplayName + gameBlurb) */
const QUICK = [
  [['Kelime Tombalası', 'Word Bingo', 'بینگوی کلمات'], ['İpucunu dinle, kartındaki kelimeye dokun.', 'Listen to the clue and tap the word on your card.', 'سرنخ را گوش کن و روی کلمه در کارتت بزن.']],
  [['Cümle Kur', 'Build It', 'جمله بساز'], ['Kelime karolarına dokunarak cümleyi kur.', 'Tap the word tiles to build the sentence.', 'روی کاشی‌های کلمه بزن و جمله را بساز.']],
  [['Hikaye Avı', 'Story Hunt', 'شکار داستان'], ['Hikayenden bir bölümde gizli kelimeleri bul.', 'Find the words hidden in a passage from your story.', 'کلمه‌ها را در بخشی از داستانت پیدا کن.']],
  [['Tekrar Et', 'Say It Back', 'بگو ببینم'], ['Bir cümle dinle ve tekrar et.', 'Listen to a line and say it back.', 'یک جمله گوش کن و همان را بگو.']],
  [['Dinle ve Yaz', 'Listen & Type', 'گوش کن و بنویس'], ['Bir cümle dinle, duyduğunu yaz.', 'Listen to a sentence and type what you hear.', 'یک جمله گوش کن و همان را تایپ کن.']],
  [['Mini Bulmaca', 'Mini Cross', 'جدول کوچک'], ['Öğrendiğin kelimeleri mini bir bulmacaya yaz.', 'Spell the words you learned into a pocket crossword.', 'کلمه‌هایی که یاد گرفتی را در یک جدول کوچک بنویس.']],
  [['Kelime Yarışı', 'Word Rush', 'مسابقه کلمات'], ['Karoları çevir, her kelimeyi anlamıyla eşleştir.', 'Flip tiles and match each word with its meaning.', 'کاشی‌ها را برگردان و هر کلمه را با معنی‌اش جفت کن.']],
  [['Tuzak Kaçışı', 'Trap Dash', 'فرار از تله‌ها'], ['Doğru şekli hızla seç, tuzaklar bekliyor.', 'Pick the right form quickly, the traps are waiting.', 'سریع شکل درست را انتخاب کن، تله‌ها منتظرند.']],
];
const FACES = ['bell', 'sam', 'gran', 'tom', 'meg', 'ada', 'leyla', 'ben', 'rosa', 'captain'];
const FACE_NAME = { bell: 'Bell', sam: 'Sam', gran: 'Gran', tom: 'Tom', meg: 'Meg', ada: 'Ada', leyla: 'Leyla', ben: 'Ben', rosa: 'Rosa', captain: 'Captain' };
/* Thursday clubs = SPK_GROUPS in Claude/tools/speaking-club/spk-block.js, one per hour, Iran time (UTC+3:30, no DST). Never a date: "every Thursday". */
const SLOTS = [[13, 'First Words Café', 'en', 'A1'], [14, 'First Trip', 'en', 'A1'], [15, 'Work &amp; Study Talk', 'en', 'A2–B1'], [16, 'Café en español', 'es', 'A1–A2'], [17, 'Español para el trabajo', 'es', 'A1–A2'], [18, 'Everyday Chat', 'en', 'A2–B1']];
/* app features: [icon, title x3, line x3, on the home page too] */
const FEATS = [
  ['map', ['Sana özel yol haritası', 'A roadmap made for you', 'نقشه‌ی راه مخصوص خودت'], ['Seviyene, hedeflerine ve sevdiğin konulara göre kurulur.', 'Built from your level, your goals and your favourite topics.', 'بر اساس سطح، هدف‌ها و موضوع‌های مورد علاقه‌ات ساخته می‌شود.'], 1],
  ['story', ['Turlarla dersler', 'Lessons in rounds', 'درس‌ها در چند دور'], ['Kelimeler ve dilbilgisi kısa turlarla gelir; her tur bir öncekinin üstüne kurulur.', 'Words and grammar come in short rounds, each one building on the last.', 'واژه‌ها و گرامر در دورهای کوتاه می‌آیند و هر دور روی دور قبلی ساخته می‌شود.'], 1],
  ['game', ['15 oyun', '15 games', '۱۵ بازی'], ['Yol haritanın yarısı oyun, A1\'den C1\'e.', 'Half your roadmap is games, from A1 to C1.', 'نیمی از نقشه‌ی راهت بازی است، از A1 تا C1.'], 1],
  ['mic', ['Konuşma ve yazma pratiği', 'Speaking and writing practice', 'تمرین صحبت و نوشتن'], ['Cevabını sesli söyle ya da yaz, geri bildirimini hemen al.', 'Say or write your answer and get feedback right away.', 'جوابت را بلند بگو یا بنویس و فوراً بازخورد بگیر.'], 1],
  ['box', ['Kelime Kutusu', 'Vocab Box', 'جعبه‌ی لغات'], ['"Tekrar çalışayım" dediğin kelimeler kutuya girer ve yol haritanda geri gelir.', 'Words you mark "Practice again" go into the box and come back on your roadmap.', 'واژه‌هایی که رویشان «دوباره تمرین کنم» را می‌زنی به جعبه می‌روند و در نقشه‌ی راهت برمی‌گردند.'], 1],
  ['report', ['Sayfa karnesi (Plus)', 'Page report (Plus)', 'کارنامه‌ی صفحه (Plus)'], ['Her yol haritası sayfasını bitirince ne öğrendiğini gösteren bir karne.', 'A report on what you learned each time you finish a roadmap page.', 'هر بار که یک صفحه‌ی نقشه‌ی راه را تمام می‌کنی، کارنامه‌ای از آنچه یاد گرفتی.'], 1],
  ['chat', ['Mesajlar', 'Messages', 'پیام‌ها'], ['Farin\'e uygulamadan yaz; genelde bir gün içinde cevap verir.', 'Write to Farin in the app; he usually answers within a day.', 'در اپ به فرین پیام بده؛ معمولاً تا یک روز جواب می‌دهد.'], 1],
  ['globe', ['İngilizce ve İspanyolca', 'English and Spanish', 'انگلیسی و اسپانیایی'], ['İlk ekranda hangi dili öğreneceğini seçersin.', 'On the first screen you choose which language to learn.', 'در صفحه‌ی اول انتخاب می‌کنی کدام زبان را یاد بگیری.'], 1],
  ['bell', ['Telefon bildirimleri', 'Phone notifications', 'اعلان روی گوشی'], ['Kısa hatırlatmalar; Ayarlar\'dan istediğin zaman kapatırsın.', 'Short reminders; turn them off in Settings any time.', 'یادآوری‌های کوتاه؛ هر وقت خواستی از تنظیمات خاموششان کن.'], 0],
  ['users', ['Konuşma kulüpleri', 'Speaking clubs', 'باشگاه‌های مکالمه'], ['Her perşembe canlı gruplar; yerini Kulüp sekmesinden ayırtırsın.', 'Live groups every Thursday; book your seat in the Club tab.', 'هر پنجشنبه گروه‌های زنده؛ جایت را از تب باشگاه رزرو می‌کنی.'], 0],
];
const shot = (l, name) => `/assets/app/s26-${l}-${name}.webp`;

/* the games band: the home pages (#oyunlar, IG game posts link /#oyunlar) and the app page (full = every quick game with its line) */
function gamesShow(l, full) {
  const i = LANGS[l].i, rtl = l === 'fa';
  const nm = (g) => g.name[i] + (l === 'en' ? '' : ` <small dir="ltr" lang="en">${g.en}</small>`);
  const albums = RS_ALBUMS.map(([lv, town, title]) => `<li><b dir="ltr">${lv}</b><span>${esc(Array.isArray(town) ? town[i] : town)}</span><i lang="en" dir="ltr">${title}</i></li>`).join('');
  const posters = GAMES3D.map(g => `<figure class="gcard3" style="--c:var(${g.c})"><img src="/assets/game/${g.img}.webp" alt="${esc(g.alt[i])}" width="480" height="600" loading="lazy" decoding="async"><figcaption><span class="gk">${esc(g.k[i])}${g.lv ? ` · <bdi dir="ltr">${g.lv}</bdi>` : ''}</span><b>${nm(g)}</b><p>${esc(g.d[i])}</p></figcaption></figure>`).join('\n      ');
  const quick = full
    ? `<ul class="qlist">${QUICK.map(([n, d]) => `<li><b>${esc(n[i])}</b><span>${esc(d[i])}</span></li>`).join('')}</ul>`
    : `<p class="qchips"><b>${S2.quickL[i]}</b>${QUICK.map(([n]) => `<span>${esc(n[i])}</span>`).join('')}</p>`;
  return `
<section class="gshow" id="oyunlar"><div class="wrap"><div class="gshow-in">
  <div class="sec-head c"><p class="eyebrow">${S.gamesEb[i]}</p><h2>${S.gamesH[i]}</h2><p class="lead">${S2.gsL[i]}</p></div>
  <article class="rs">
    <div class="rs-art"><img src="/assets/game/rs-whitby.webp" alt="${esc(['Kırmızı Bavul, 1. albüm The Camera: Whitby limanında kırmızı bavullu kahraman', 'The Red Suitcase, album 1 The Camera: the hero with the red suitcase on the Whitby harbour', 'چمدان قرمز، آلبوم اول The Camera: قهرمان با چمدان قرمز در بندر ویتبی'][i])}" width="560" height="700" loading="lazy" decoding="async"></div>
    <div class="rs-txt">
      <span class="pill dark">${S2.rsK[i]} · <bdi dir="ltr">A1–B2</bdi></span>
      <h3>${['Kırmızı Bavul', 'The Red Suitcase', 'چمدان قرمز'][i]}${l === 'en' ? '' : ` <small dir="ltr" lang="en">The Red Suitcase</small>`}</h3>
      <p>${S2.rsP[i]}</p>
      <p class="rs-alb-h">${S2.rsAlb[i]}</p>
      <ul class="rs-alb">${albums}</ul>
      <div class="rs-es"><img src="/assets/game/rs-cudillero.webp" alt="${esc(['La maleta roja, 1. albüm La cámara: Cudillero', 'La maleta roja, album 1 La cámara: Cudillero', 'La maleta roja، آلبوم اول La cámara: کودیرو'][i])}" width="400" height="500" loading="lazy" decoding="async"><p>${S2.rsEs[i]}</p></div>
    </div>
  </article>
  <div class="g3grid">
      ${posters}
  </div>
  <div class="faces">
    <ul>${FACES.map(f => `<li><img src="/assets/game/face-${f}.webp" alt="${FACE_NAME[f]}" width="90" height="90" loading="lazy" decoding="async"></li>`).join('')}</ul>
    <div><b>${S2.faceH[i]}</b><p>${S2.faceP[i]}</p></div>
  </div>
  ${quick}
  <div class="cta-row"><a class="btn btn-orange" data-loc="${full ? 'app-games' : 'home-games'}" href="${APP}" ${ext}>${S.hgBtn[i]}</a>${full ? '' : `<a class="tlink tlink-w" href="${url(l, 'app')}#oyunlar">${S.hgAll[i]}</a>`}</div>
</div></div></section>
`;
}

/* community: Thursday speaking clubs, the Student Club, Messages */
function communityBand(l) {
  const i = LANGS[l].i;
  const t = h => l === 'tr' ? `${h - 1}:30` : l === 'fa' ? faNum(h) + ':۰۰' : `${h}:00`;
  const slots = SLOTS.map(([h, name, lang, lv]) => `<li><time dir="ltr">${t(h)}</time><b lang="${lang === 'es' ? 'es' : 'en'}" dir="ltr">${name}</b><span>${(lang === 'es' ? S2.spEs : S2.spEn)[i]} · <bdi dir="ltr">${lv}</bdi></span></li>`).join('\n          ');
  const facts = [S2.spF1, S2.spF2, S2.spF3, S2.spF4].map((f, n) => `<li style="--c:var(${['--purple', '--g-imm', '--orange', '--green'][n]})"><i></i><span>${f[i]}</span></li>`).join('');
  return `
<section class="sec cm" id="topluluk"><div class="wrap">
  <div class="sec-head c"><p class="eyebrow">${S2.cmEb[i]}</p><h2>${S2.cmH[i]}</h2><p class="lead">${S2.cmL[i]}</p></div>
  <article class="clubs">
    <div class="clubs-txt">
      <span class="pill dark">${S2.spPill[i]}</span>
      <h3>${S2.spH[i]}</h3>
      <p>${S2.spP[i]}</p>
      <div class="slots">
        <p class="slots-h">${S2.spTz[i]}</p>
        <ul>
          ${slots}
        </ul>
      </div>
      <ul class="facts">${facts}</ul>
      <p class="clubs-how">${S2.spHow[i]}</p>
    </div>
    <div class="ph clubs-ph"><img src="${shot(l, 'groups')}" alt="${esc(S2.spAlt[i])}" width="600" height="1298" loading="lazy" decoding="async"></div>
  </article>
  <div class="cm-two">
    <article class="cm-card"><span class="cm-ico" style="--c:var(--orange)">${ic('users')}</span><div><h3>${S2.scH[i]}</h3><p>${S2.scP[i]}</p></div></article>
    <article class="cm-card"><span class="cm-ico" style="--c:var(--purple)">${ic('chat')}</span><div><h3>${S2.msH[i]}</h3><p>${S2.msP[i]}</p></div></article>
  </div>
  <div class="cta-row"><a class="btn btn-purple" data-loc="community" href="${APP}" ${ext}>${S2.cmBtn[i]}</a></div>
</div></section>
`;
}

/* the app's features grid (home: 8, app page: all) */
function featGrid(l, all) {
  const i = LANGS[l].i;
  return `<ul class="fgrid${all ? ' all' : ''}">${FEATS.filter(f => all || f[3]).map(([icn, h, p]) => `<li><span class="fg-ico">${ic(icn)}</span><b>${h[i]}</b><span>${p[i]}</span></li>`).join('')}</ul>`;
}

/* Free / Plus / Guided (prices = MB regular; TR in lira, FA in toman, EN both) */
function packagesBand(l) {
  const i = LANGS[l].i, fa = l === 'fa';
  const price = plan => fa
    ? `<div class="pk-price"><b>${faNum(MB.ir[plan][0])}</b><span>${S2.pkMonth[i]}</span><small>${yearTxt(l, plan)}</small></div>`
    : `<div class="pk-price"><b>${lira(l, MB.tr[plan][0])}</b><span>${S2.pkMonth[i]}</span><small>${yearTxt(l, plan)}</small>${l === 'en' ? `<small class="pk-ir">Iran: ${grp(MB.ir[plan][0], ',')} toman a month · ${grp(MB.ir[plan][1], ',')} a year</small>` : ''}</div>`;
  const ul = arr => `<ul class="pk-feats">${arr.map(f => `<li>${ic('check')}<span>${f[i]}</span></li>`).join('')}</ul>`;
  const arrow = fa ? '←' : '→';
  return `
<section class="sec pk" id="paketler"><div class="wrap">
  <div class="sec-head c"><p class="eyebrow">${S2.pkEb[i]}</p><h2>${S2.pkH[i]}</h2><p class="lead">${S2.pkL[i]}</p></div>
  <div class="pk-grid">
    <article class="pk-card">
      <p class="pk-name" lang="en">Free</p><p class="pk-blurb">${S2.pkFreeB[i]}</p>
      <div class="pk-price"><b>${S2.pkFree[i]}</b><span>${S2.pkAlways[i]}</span></div>
      ${ul(S2.pkF)}
      <a class="btn btn-ghost" data-loc="pk-free" href="${APP}" ${ext}>${S2.pkBtnF[i]}</a>
    </article>
    <article class="pk-card pk-plus">
      <span class="pill pk-badge">${S2.pkBadge[i]}</span>
      <p class="pk-name" lang="en">Plus</p><p class="pk-blurb">${S2.pkPlusB[i]}</p>
      ${price('plus')}
      <p class="pk-in">${S2.pkInFree[i]}</p>
      ${ul(S2.pkP)}
      <p class="pk-courses">${S2.pkCourses[i]}</p>
      <a class="btn btn-orange" data-loc="pk-plus" href="${APP}" ${ext}>${S2.pkBtnP[i]} <span aria-hidden="true">${arrow}</span></a>
    </article>
    <article class="pk-card pk-guided">
      <p class="pk-name" lang="en">Guided</p><p class="pk-blurb">${S2.pkGuidB[i]}</p>
      ${price('guided')}
      <p class="pk-in">${S2.pkInPlus[i]}</p>
      ${ul(S2.pkG)}
      <a class="btn btn-ghost" data-loc="pk-guided" href="${APP}" ${ext}>${S2.pkBtnG[i]}</a>
    </article>
  </div>
  <p class="pk-note">${S2.pkNote[i]}</p>
</div></section>
`;
}

const WAMSG = [n => `Merhaba Farin! "${n}" ile ilgileniyorum.`, n => `Hi Farin! I'm interested in "${n}".`, n => `سلام فرین! به «${n}» علاقه دارم.`];
const LIVE_PRICE = ['₺3.400<small>\'dan / ay</small>', '<small style="margin:0 4px 0 0">from</small>₺3,400<small>/ month</small>', null];
const FREE1 = ['İlk analiz seansı hediye', 'Free analysis session', '۱ تا ۴ نفر'];
const BOOK = ['Dersini ayarla', 'Book your lessons', 'رزرو کلاس'];
const OWN = ['Kendi hızında, uygulamada', 'At your own pace, in the app', 'با سرعت خودت، داخل اپ'];
/* Farin 2026-11-07 (P8): only Lesson 1.1 of each premium course is free; every other lesson is paid. */
const FREE11 = ['Ücretsiz Ders 1.1\'e başla', 'Start free Lesson 1.1', 'شروع درس ۱.۱ رایگان'];
const DETAILS = ['Kurs detayları →', 'Details (Turkish) →', 'جزئیات (ترکی) ←'];

/* SALE STATUS: one field per premium course. Courses go on sale as soon as they are complete
   (Farin 2026-10-29: the sale-date calendar is gone). Flip 'soon' -> 'now' here and re-run.
   Then also flip the data-sale markers in /kelas/ + /dersler/ and the IELTS block in ielts-hazirlik.html by hand. */
const SALE = { hr: 'start11', ielts: 'start11', interview: 'start11', marketing: 'start11', sales: 'start11', ai: 'start11', biz: 'start11', mktg: 'plan', pro: 'plan', meetings: 'plan', email: 'plan' };
/* 'start11' = live in the app, Lesson 1.1 free, the rest paid (Farin 2026-11-07, P8; replaces the old free parts HR 2/4, IELTS 5/10, Interview/Copywriting/AI/Business 2, Sales 1). Complete Business English is complete in the app (40 lessons) since 2026-11-09. */
const SALE_TXT = { start11: ['Ders 1.1 ücretsiz', 'Lesson 1.1 free', 'درس ۱.۱ رایگان'], soon: ['Yakında satışta', 'Coming soon', 'به‌زودی'], now: ['Şimdi satışta', 'On sale now', 'در حال فروش'], plan: ['Planlanıyor', 'Planned', 'در برنامه'] };
const salePill = k => [SALE[k] === 'now' || SALE[k].startsWith('start') ? 'free' : 'soon', SALE_TXT[SALE[k]]];

/* 2026-11-10 (farin-seo, Loop 5): TR line links the Spanish + German lesson pages (both had no in-body links); rendered unescaped in card() */
const ES_DE = ['<a href="/spanish.html">İspanyolca</a> ve <a href="/german.html">Almanca</a> da var', 'Spanish and German too', 'اسپانیایی و آلمانی هم هست'];
/* 2026-11-09 (farin-seo): pageFa = the indexable FA live-class page, linked under the FA live-class button */
const LIVES = {
  biz: { key: 'business-live', name: ['Birebir İş İngilizcesi', 'Business English 1-to-1', 'کلاس انگلیسی تجاری'],
    for: ['Senin işin ve senin toplantıların üzerine kurulur.', 'Built around your job and your meetings.', 'بر اساس کار و جلسه‌های کاری خودت ساخته می‌شود.'],
    outs: [['Konuşma ağırlıklı', 'Speaking-focused', 'تمرکز روی مکالمه'], ['Sektörüne göre içerik, mülakat provası dahil', 'Content for your industry, interview practice included', 'محتوا بر اساس حوزه‌ی کاری، همراه با تمرین مصاحبه'], ['Esnek saatler', 'Flexible hours', 'ساعت‌های منعطف']],
    toman: '۴٬۵۰۰٬۰۰۰', month: '۱۸٬۰۰۰٬۰۰۰', each: '۱٬۱۲۵٬۰۰۰', more: ['/is-ingilizcesi.html#ders', 'İş İngilizcesi dersleri →'], pageFa: ['/fa/kelas-zaban-englisi-online.html', 'جزئیات کلاس: بسته‌ها، قیمت و سؤال‌ها ←'] },
  gen: { key: 'general-live', name: ['Birebir genel İngilizce', 'General English 1-to-1', 'کلاس انگلیسی عمومی شخصی‌سازی‌شده'],
    for: ['Ders tamamen senin hedefine ve ilgi alanına göre.', 'Lessons built entirely on your goal and interests.', 'کلاس کاملاً بر اساس هدف و علاقه‌های خودت.'],
    outs: [['Konuşma odaklı', 'Speaking-focused', 'تمرکز روی مکالمه'], ['Senin konuların', 'Your topics', 'موضوع‌های خودت'], ES_DE],
    toman: '۳٬۵۰۰٬۰۰۰', month: '۱۴٬۰۰۰٬۰۰۰', each: '۸۷۵٬۰۰۰', more: ['/english.html#paketler', 'Online İngilizce özel ders →'], pageFa: ['/fa/kelas-zaban-englisi-online.html', 'جزئیات کلاس: بسته‌ها، قیمت و سؤال‌ها ←'] },
};
const GOALS = {
  is: { img: 'char-career', c: '--g-career', title: ['İş ve kariyer', 'Work & career', 'کار و شغل'], label: 'gIs', sub: 'gIsS',
    self: { key: 'hr', name: ['İK ve İş İngilizcesi', 'HR & Business English', 'انگلیسی منابع انسانی و کسب‌وکار'],
      for: ['Toplantı, e-posta, sunum ve İK yazışmaları için hazır bir yol.', 'A ready path for meetings, emails, presentations and HR writing.', 'یک مسیر آماده برای جلسه، ایمیل، ارائه و مکاتبات منابع انسانی.'],
      outs: [['Gerçek iş senaryoları', 'Real workplace scenarios', 'سناریوهای واقعی محیط کار'], ['Hazır cümle kalıpları', 'Ready-to-use phrases', 'الگوهای جمله‌ی آماده'], OWN],
      pills: [salePill('hr')],
      cta: FREE11, more: ['/is-ingilizcesi.html', 'İş İngilizcesi sayfası →'], moreFa: ['/fa/blog/estelahat-manabe-ensani-englisi.html', 'راهنما: اصطلاحات منابع انسانی به انگلیسی ←'], pageFa: ['/fa/dore-englisi-manabe-ensani.html', 'جزئیات دوره: فصل‌ها و درس‌ها ←'] },
    live: 'biz', also: [['mulakat', ['İngilizce İş Mülakatı', 'Job Interview English', 'مصاحبه‌ی شغلی به انگلیسی'], null, 'interview', null, null, null, '/ingilizce-mulakat-hazirligi.html'],
      [null, ['Metin Yazarlığı ve İçerik İngilizcesi', 'Copywriting & Content English', 'انگلیسی کپی‌رایتینگ و تولید محتوا'], null, 'marketing', 'marketing', true, '/fa/dore-copywriting-englisi.html', '/ingilizce-metin-yazarligi.html'],
      [null, ['Satış ve Dış Ticaret İngilizcesi', 'Sales & Trade English', 'انگلیسی فروش و بازرگانی'], null, 'sales', 'sales', true, '/fa/dore-zaban-englisi-bazargani.html', '/dis-ticaret-ingilizcesi.html'],
      [null, ['Yapay Zekâ ve İnternet için İngilizce', 'English for AI and the Internet', 'انگلیسی برای هوش مصنوعی و اینترنت'], null, 'ai', 'ai-internet', true, '/fa/dore-prompt-nevisi-englisi.html', '/ingilizce-prompt-yazma.html'],
      [null, ['Kapsamlı İş İngilizcesi', 'Complete Business English', 'دوره‌ی جامع انگلیسی تجاری'], null, 'biz', 'business', true, '/fa/dore-zaban-englisi-tejari.html', '/is-ingilizcesi.html#kapsamli-kurs']] },
  ielts: { img: 'char-exam', c: '--g-exam', title: ['IELTS ve yurt dışı', 'IELTS & moving abroad', 'آیلتس و مهاجرت'], label: 'gIe', sub: 'gIeS',
    self: { key: 'ielts', name: ['IELTS: 10 tam sınav', 'IELTS: 10 full exams', 'آیلتس: ۱۰ آزمون کامل'],
      for: ['Gerçek sınava yakın 10 deneme, bölüm bölüm teknik.', '10 practice tests close to the real exam, with technique part by part.', '۱۰ آزمون نزدیک به آزمون واقعی، با تکنیک بخش به بخش.'],
      outs: [['Listening, Reading, Writing, Speaking', 'Listening, Reading, Writing, Speaking', 'Listening، Reading، Writing، Speaking'], ['Her sınav 10 ders', '10 lessons per exam', '۱۰ درس برای هر آزمون'], OWN],
      pills: [salePill('ielts')],
      cta: FREE11, more: ['/ielts-hazirlik.html#ielts-kursu', 'IELTS kursunun detayları →'], moreFa: ['/fa/blog/nameh-nevisi-ielts-general.html', 'راهنما: نامه‌نویسی آیلتس جنرال ←'], pageFa: ['/fa/dore-ielts-online.html', 'جزئیات دوره: فصل‌ها و درس‌ها ←'] },
    live: null },
  mulakat: { img: 'char-immigration', c: '--g-imm', title: ['İş görüşmesi', 'Job interview', 'مصاحبه‌ی کاری'], label: 'gMu', sub: 'gMuS',
    self: { key: 'interview', name: ['İngilizce İş Mülakatı', 'Job Interview English', 'مصاحبه‌ی شغلی به انگلیسی'],
      for: ['En sık sorulan sorular ve güçlü cevaplar.', 'The most common questions and strong answers.', 'رایج‌ترین سؤال‌ها و جواب‌های قوی.'],
      outs: [['Hazır cevap kalıpları', 'Ready-made answer patterns', 'الگوهای آماده برای جواب'], ['Kendini tanıtma, CV ve ön yazı', 'Your introduction, CV and cover letter', 'معرفی خودت، رزومه و کاور لتر'], OWN],
      pills: [salePill('interview')],
      cta: FREE11, pageTr: '/ingilizce-mulakat-hazirligi.html', more: ['/blog/is-ingilizcesi-mulakat-sorulari.html', 'Mülakat soruları rehberi →'], moreFa: ['/fa/blog/moarefi-khod-mosahebe-englisi.html', 'راهنما: معرفی خود در مصاحبه به انگلیسی ←'], pageFa: ['/fa/amadegi-mosahebe-kari-englisi.html', 'جزئیات دوره: فصل‌ها و درس‌ها ←'] },
    live: 'biz', also: [['is', ['İK ve İş İngilizcesi', 'HR & Business English', 'انگلیسی منابع انسانی و کسب‌وکار'], null, 'hr']] },
  konusma: { img: 'char-everyday', c: '--g-every', title: ['Rahat konuşmak', 'Speak with confidence', 'راحت حرف زدن'], label: 'gKo', sub: 'gKoS',
    self: { key: 'roadmap', name: ['Ücretsiz yol haritası', 'Free roadmap', 'نقشه‌ی راه رایگان'],
      for: ['Hedefini ve seviyeni seç, uygulama yolunu kursun.', 'Pick your goal and level, and the app builds your path.', 'هدف و سطحت را انتخاب کن تا اپ مسیرت را بسازد.'],
      outs: [['Hikaye, kelime, dilbilgisi', 'Stories, vocabulary, grammar', 'داستان، واژگان، گرامر'], ['15 oyun', '15 games', '۱۵ بازی'], ['Tamamen ücretsiz', 'Completely free', 'کاملاً رایگان']],
      price: ['Ücretsiz', 'Free', 'رایگان'], pills: [['free', ['Her zaman ücretsiz', 'Always free', 'همیشه رایگان']]],
      cta: ['Yol haritamı kur', 'Build my roadmap', 'نقشه‌ی راهم را بساز'], noWa: true, more: ['/blog/ingilizce-konusma-pratigi-nasil-yapilir.html', 'Konuşma pratiği rehberi →'] },
    live: 'gen' },
};
/* Company option (Farin 2026-10-31). Rules + toman prices: business/farin-monetization/08-final-prices.md "Company orders".
   The team discount is set for Iranian companies, so the tiers show on FA only; TR/EN ask for a written offer. */
const [ALSO_INT, ALSO_MKT, ALSO_SALES] = GOALS.is.also;
const COMPANY = [
  /* Q8rawI70 answer 5B (Farin 2026-10-31): the old Business package is the Sales & Trade package; managers and mixed office teams go to Complete Business, not here. */
  { sale: 'sales', c: '--orange-deep', pkg: ['Satış ve Dış Ticaret', 'Sales & Trade', 'فروش و بازرگانی'], name: ALSO_SALES[1], price: ALSO_SALES[2],
    for: ['Satış, ihracat ve müşteri hizmetleri ekipleri', 'Sales, export and customer-service teams', 'تیم‌های فروش، صادرات و خدمات مشتری'] },
  { sale: 'hr', c: '--g-career', pkg: ['İK', 'HR', 'منابع انسانی'], name: GOALS.is.self.name, price: null,
    for: ['İK ekipleri, işe alım uzmanları, ekip liderleri', 'HR staff, recruiters and team leads', 'تیم منابع انسانی، کارشناسان جذب و سرپرست‌ها'] },
  { sale: 'marketing', c: '--purple', pkg: ['İçerik', 'Content', 'محتوا'], name: ALSO_MKT[1], price: ALSO_MKT[2],
    for: ['İçerik, metin yazarlığı ve sosyal medya ekipleri', 'Content, copy and social media teams', 'تیم‌های محتوا، کپی‌رایتینگ و شبکه‌های اجتماعی'] },
  { sale: 'interview', c: '--g-imm', pkg: ['Mülakat', 'Interview', 'مصاحبه'], name: ALSO_INT[1], price: ALSO_INT[2],
    for: ['İç geçişler ve uluslararası projeler için', 'For internal moves and international projects', 'برای جابه‌جایی داخلی و پروژه‌های بین‌المللی'] },
  { sale: 'ai', c: '--g-exam', pkg: ['Yapay Zekâ', 'AI & Internet', 'هوش مصنوعی و اینترنت'], name: ['Yapay Zekâ ve İnternet için İngilizce', 'English for AI and the Internet', 'انگلیسی برای هوش مصنوعی و اینترنت'], price: null,
    for: ['Yapay zekâ araçları kullanan her ekip', 'Every team that uses AI tools', 'هر تیمی که با ابزارهای هوش مصنوعی کار می‌کند'] },
  { sale: 'biz', c: '--purple-ink', pkg: ['Kapsamlı İş', 'Complete Business', 'جامع بیزنس'], name: ['Kapsamlı İş İngilizcesi', 'Complete Business English', 'دوره‌ی جامع انگلیسی تجاری'], price: null,
    for: ['Yöneticiler, şirket sahipleri ve karma ofis ekipleri', 'Owners, managers and mixed office teams', 'مدیران، صاحبان کسب‌وکار و تیم‌های اداری'] },
  { sale: 'mktg', c: '--orange-deep', pkg: ['Pazarlama', 'Marketing', 'بازاریابی'], name: ['Pazarlama İngilizcesi', 'Marketing English', 'انگلیسی بازاریابی'], price: null,
    for: ['Pazarlama ekipleri ve yöneticileri', 'Marketing teams and managers', 'تیم‌های بازاریابی و مدیران'] },
  { sale: 'pro', c: '--g-imm', pkg: ['İleri Mülakat', 'Interview Pro', 'مصاحبه‌ی پیشرفته'], name: ['İngilizce İş Mülakatı Pro', 'Interview English Pro', 'مصاحبه‌ی شغلی پیشرفته به انگلیسی'], price: null,
    for: ['Üst düzey roller ve zor mülakatlar için', 'For senior moves and harder interviews', 'برای جایگاه‌های ارشد و مصاحبه‌های سخت‌تر'] },
  { sale: 'meetings', c: '--g-exam', pkg: ['Toplantı', 'Meetings', 'جلسه و ارائه'], name: ['Toplantı ve Sunum İngilizcesi', 'Meetings & Presentations', 'جلسه و ارائه به انگلیسی'], price: null,
    for: ['Uluslararası ve uzaktan çalışan ekipler', 'International and remote teams', 'تیم‌های بین‌المللی و دورکار'] },
  { sale: 'email', c: '--g-career', pkg: ['E-posta', 'Email & Writing', 'ایمیل و نگارش'], name: ['Profesyonel E-posta ve Yazışma', 'Professional Email & Writing', 'ایمیل و نگارش حرفه‌ای به انگلیسی'], price: null,
    for: ['İngilizce yazan ofis çalışanları', 'Office staff who write in English', 'کارکنان اداری که به انگلیسی می‌نویسند'] },
];
/* Company tiers (Farin 2026-10-31, kept for Plus seats 2026-11-26): set for Iranian companies, so they show on FA (toman); TR/EN ask for a written offer.
   21-39 people -15%, 40+ -20% on the final price of the seats, list price struck through; weekly support (one 50-minute group session per order, up to 8 weeks) above 20 people. */
const CO_TIERS = [['۱ تا ۲۰ نفر', 0, 'قیمت پایه'], ['۲۱ تا ۳۹ نفر', 0.15, '٪۱۵ تخفیف + جلسه‌ی پشتیبانی گروهی هفتگی تا ۸ هفته'], ['۴۰ نفر به بالا', 0.2, '٪۲۰ تخفیف + جلسه‌ی پشتیبانی گروهی هفتگی تا ۸ هفته']];
const ALT = {
  goals: ['FE App ilk ekranı: hedeflerini seçtiğin ekran', 'FE App first screen: pick your goals', 'صفحه‌ی اول اپ FE: انتخاب هدف‌ها'],
  kariyer: ['FE App yol haritası: B1 Kariyer ve İş hedefi', 'FE App roadmap: B1, career and work goal', 'نقشه‌ی راه اپ FE: سطح B1، هدف کار و شغل'],
  ielts: ['FE App yol haritası: B1 IELTS hedefi', 'FE App roadmap: B1, IELTS goal', 'نقشه‌ی راه اپ FE: سطح B1، هدف آیلتس'],
  seyahat: ['FE App yol haritası: B1 Seyahat hedefi', 'FE App roadmap: B1, travel goal', 'نقشه‌ی راه اپ FE: سطح B1، هدف سفر'],
  karar: ['Kırmızı Bavul oyunu: Whitby\'de çizgi roman bir sayfa ve iki İngilizce cevap seçeneği', 'The Red Suitcase story game: a comic page in Whitby with two English answers to choose from', 'بازی داستانی «چمدان قرمز»: یک صفحه‌ی کمیک در ویتبی با دو جواب انگلیسی'],
  ev: ['Ev İşleri oyunu: boyalı bir mutfak ve sırayla yapılacak işler', 'Cozy Chores game: a painted kitchen and tasks to do in order', 'بازی «کارهای دنج خانه»: آشپزخانه‌ی نقاشی‌شده و کارهایی که باید به ترتیب انجام شود'],
  game: ['FE App oyun ekranı: ', 'FE App game screen: ', 'صفحه‌ی بازی در اپ FE: '],
  home: ['FE App Ana Sayfa: üyelik kutusu ve yol haritasının ilk kartı, Kırmızı Bavul', 'FE App Home: the membership box and the first roadmap card, The Red Suitcase', 'صفحه‌ی اصلی اپ FE: کادر عضویت و اولین کارت نقشه‌ی راه، چمدان قرمز'],
  album: ['Kırmızı Bavul albüm ekranı: The Camera, başrolde öğrencinin kendi adı', 'The Red Suitcase album screen: The Camera, starring the learner by name', 'صفحه‌ی آلبوم چمدان قرمز: The Camera، با اسم خود بازیکن در نقش اصلی'],
  courses: ['FE App: premium kurslar, her kartta "Ders 1.1 ücretsiz · tam kurs Plus ile"', 'FE App: the premium courses, each card saying "Lesson 1.1 free · full course with Plus"', 'اپ FE: دوره‌های ویژه، روی هر کارت «درس ۱.۱ رایگان · دوره‌ی کامل با Plus»'],
};

const META = {
  /* TR title, farin-seo 2026-11-15 (Loop 6, Trello 00woqQiS): targets 'online ingilizce kursu' (#1 completion of "online ingilizce");
     GSC 08-01..11-14 shows no non-brand impression for the old app phrase. Keep "Ücretsiz" + "Uygulama" (IG calls to action promise free). */
  home: { t: ['Online İngilizce Kursu ve Ücretsiz Uygulama | FE School', 'English Courses and a Free English App | FE School', 'کلاس و دوره‌ی آنلاین زبان انگلیسی + اپ رایگان | FE School'],
    d: ['Hedefini seç: İş İngilizcesi, IELTS, iş görüşmesi ya da konuşma. Oyunlarla ücretsiz İngilizce uygulaması, perşembe konuşma kulüpleri ve Plus ile online kurslar.',
        'Pick your goal: Business English, IELTS, interviews or speaking. A free English app full of games, Thursday speaking clubs and every course with Plus.',
        'هدفت را انتخاب کن: انگلیسی تجاری، آیلتس، مصاحبه یا مکالمه. اپ رایگان انگلیسی پر از بازی، باشگاه مکالمه‌ی پنجشنبه و همه‌ی دوره‌ها با Plus.'] },
  app: { t: ['FE App: Oyunla İngilizce, Sana Özel Yol Haritası | FE School', 'FE App: a Free English App with Games | FE School', 'اپ FE: انگلیسی با بازی و نقشه‌ی راه شخصی | FE School'],
    d: ['Hedefini seç, sana özel yol haritan kurulsun, 15 oyunla A1\'den C1\'e ilerle. Ücretsiz İngilizce öğrenme uygulaması: başlamak için kart gerekmez.',
        'Pick your goal, get a roadmap made for you and move from A1 to C1 with 15 games. A free English learning app: no card needed to start.',
        'هدفت را انتخاب کن، نقشه‌ی راه مخصوص خودت ساخته شود و با ۱۵ بازی از A1 تا C1 جلو برو. اپ رایگان یادگیری انگلیسی؛ برای شروع کارت لازم نیست.'] },
  sys: { t: ['Sistemimiz: Hikaye ve Oyunla İngilizce | FE School', 'Our System: Learn English Through Stories | FE School', 'روش ما: یادگیری انگلیسی با داستان و بازی | FE School'],
    d: ['Ezber listesi yok. Hikaye, rol, oyun ve sana göre kurulan bir yol: FE School\'un SELIF yöntemi, seviye testinden sonraki seviyeye.',
        'No lists to memorise. Stories, roles, games and a path built around you: how the FE School SELIF method works, from level test to next level.',
        'خبری از لیست حفظ‌کردنی نیست. داستان، نقش، بازی و مسیری که برای تو ساخته می‌شود: روش SELIF در FE School از تعیین سطح تا سطح بعدی.'] },
  contact: { t: ['İletişim: Farin\'e WhatsApp\'tan Yaz | FE School', 'Contact: Message Farin on WhatsApp | FE School', 'تماس: در واتس‌اپ به فرین پیام بده | FE School'],
    d: ['Kurs, birebir ders ya da sadece bir soru: Farin\'e WhatsApp\'tan yaz, aynı gün dönüyor. Uygulama, Plus üyeliği, konuşma kulüpleri ve birebir ders hakkında sık sorulanlar.',
        'A course, live lessons or just a question: message Farin on WhatsApp and get a reply the same day. Plus answers to the most common questions.',
        'دوره، کلاس آنلاین یا فقط یک سؤال: در واتس‌اپ به فرین پیام بده، همان روز جواب می‌دهد. جواب سؤال‌های رایج درباره‌ی اپ، عضویت Plus، باشگاه مکالمه و کلاس‌ها.'] },
};

/* ---------------- templates ---------------- */
const ICONS = fs.readFileSync(path.join(HERE, 'icons.svg'), 'utf8').trim();
const ic = (id, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#i-${id}"/></svg>`;

function head(l, page) {
  const L = LANGS[l], i = L.i, m = META[page];
  const canon = ORIGIN + url(l, page);
  const alts = Object.keys(LANGS).map(k => `<link rel="alternate" hreflang="${k}" href="${ORIGIN + url(k, page)}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${ORIGIN + url('tr', page)}">`;
  /* fonts are self-hosted (site-src/self-host-fonts.mjs, 2026-11-07): no third-party render-blocking CSS */
  const fonts = l === 'fa' ? '/fonts/fa.css' : '/fonts/tr.css';
  /* speed (Loop 11, 2026-11-11): also preload the second subset every page renders above the fold (Turkish ğ ş İ and ₺ live in
     latin-ext; the FA header's Latin wordmark lives in vazirmatn-latin). Before, those were found only after CSS + first layout,
     ~300 ms later, so the first layout ran on system fallback fonts and was redone. EN pages without such characters drop the
     two -ext lines at write time (see dropUnusedExt). */
  const fontPreload = (l === 'fa' ? ['vazirmatn-arabic', 'vazirmatn-latin'] : ['nunito-latin', 'fredoka-latin', 'nunito-latin-ext', 'fredoka-latin-ext']).map(f => `<link rel="preload" href="/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n');
  const ogAlt = Object.keys(LANGS).filter(k => k !== l).map(k => `<meta property="og:locale:alternate" content="${LANGS[k].locale}">`).join('\n');
  return `<!doctype html>
<!-- Generated by site-src/build-pages.mjs. Do not edit by hand: change the builder and re-run it. -->
<html lang="${l}" dir="${L.dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${l === 'tr' && page === 'home' ? '<meta name="google-site-verification" content="cMZcZ6nKUvityEwt3TjnHa58UoihA6lW4R0a3sUNj2Y" />\n' : ''}<title>${esc(m.t[i])}</title>
<meta name="description" content="${esc(m.d[i])}">
<meta name="robots" content="index, follow">
<meta name="author" content="FE School">
<link rel="canonical" href="${canon}">
${alts}
<meta name="theme-color" content="#7C5CFC">
<meta name="color-scheme" content="light">
<link rel="icon" href="/icon-512.png" type="image/png">
<link rel="apple-touch-icon" href="/icon-180.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="FE School">
<meta property="og:locale" content="${L.locale}">
${ogAlt}
<meta property="og:url" content="${canon}">
<meta property="og:title" content="${esc(m.t[i])}">
<meta property="og:description" content="${esc(m.d[i])}">
<meta property="og:image" content="${ORIGIN}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(m.t[i])}">
<meta name="twitter:description" content="${esc(m.d[i])}">
<meta name="twitter:image" content="${ORIGIN}/og-image.jpg">
<script>document.documentElement.classList.add('js')</script>
${fontPreload}
<link rel="stylesheet" href="${fonts}">
<link rel="stylesheet" href="/feschool.css">
<script type="application/ld+json">
${JSON.stringify(schema(l, page), null, 1)}
</script>
<script src="/consent.js" defer></script>
</head>`;
}

function schema(l, page) {
  const i = LANGS[l].i, canon = ORIGIN + url(l, page);
  const graph = [];
  const webpage = { '@type': page === 'contact' ? 'ContactPage' : 'WebPage', '@id': canon + '#webpage', url: canon, name: META[page].t[i], inLanguage: l,
    isPartOf: { '@id': ORIGIN + '/#website' }, about: { '@id': ORIGIN + '/#fe-school' } };
  graph.push(webpage);
  if (page === 'home' && l === 'tr') {
    graph.push(
      { '@type': 'EducationalOrganization', '@id': ORIGIN + '/#fe-school', name: 'FE School', alternateName: 'FEschool', url: ORIGIN + '/',
        logo: { '@type': 'ImageObject', url: ORIGIN + '/icon-512.png', width: 512, height: 512 }, image: ORIGIN + '/og-image.jpg',
        description: 'Oyunlarla ücretsiz İngilizce öğrenme uygulaması (FE App), Plus üyeliğiyle uygulama içinde kendi hızında premium İngilizce kursları (İK ve İş İngilizcesi, Kapsamlı İş İngilizcesi, IELTS, İş Mülakatı, Metin Yazarlığı ve İçerik, Satış ve Dış Ticaret, Yapay Zekâ ve İnternet), perşembe konuşma kulüpleri ve Farin ile canlı online dersler.',
        email: 'mailto:farinrasuli@gmail.com', founder: { '@id': ORIGIN + '/#farin' }, areaServed: ['TR', 'IR'],
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: 'https://wa.me/' + WAN, email: 'farinrasuli@gmail.com', availableLanguage: ['tr', 'en', 'fa'] },
        sameAs: ['https://www.instagram.com/the_feschool/', 'https://www.linkedin.com/company/thefeschool/'] },
      { '@type': 'Person', '@id': ORIGIN + '/#farin', name: 'Farin', jobTitle: 'Kurucu Eğitmen, FE School', url: ORIGIN + '/', image: ORIGIN + '/assets/farin-portrait.jpg',
        description: '11 yıldır İngilizce öğreten, 120 saatlik Premier TEFL sertifikalı (The TEFL Org, 2024) eğitmen. Bilişsel psikoloji ve yeni öğrenme metodolojileri üzerine çalışıyor.',
        knowsLanguage: ['fa', 'en', 'es', 'de', 'tr'],
        hasCredential: { '@type': 'EducationalOccupationalCredential', name: '120-hour Premier TEFL course (TEFL/TESOL certificate)', credentialCategory: 'certificate', dateCreated: '2024-09-24',
          recognizedBy: { '@type': 'Organization', name: 'The TEFL Org', url: 'https://www.tefl.org' } }, email: 'mailto:farinrasuli@gmail.com' },
      { '@type': 'WebSite', '@id': ORIGIN + '/#website', name: 'FE School', alternateName: ['FEschool', 'The FE School', 'thefeschool'], url: ORIGIN + '/', inLanguage: ['tr', 'en', 'fa'], publisher: { '@id': ORIGIN + '/#fe-school' } },
      { '@type': 'SoftwareApplication', '@id': ORIGIN + '/#uygulama', name: 'FE App', alternateName: 'Farin English', applicationCategory: 'EducationalApplication', operatingSystem: 'Web, Android',
        url: APP, downloadUrl: APK, inLanguage: ['tr', 'en', 'fa'],
        description: 'Hedeflerine göre kişisel yol haritası kuran, yol haritasının yarısı oyunlardan oluşan ücretsiz İngilizce öğrenme uygulaması.',
        featureList: ['Hedefe ve sevdiğin konulara göre kişisel yol haritası', '15 oyun: Kırmızı Bavul, Liman Dosyaları, Açık Kapı, Sipariş Hazır!, Pasaport Masası, Mini Radyo, Sihirli Kelimeler ve hızlı oyunlar', 'Konuşma ve yazma pratiği', 'Kelime Kutusu', 'Perşembe konuşma kulüpleri', 'Farin ile Mesajlar', 'İngilizce ve İspanyolca'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' }, publisher: { '@id': ORIGIN + '/#fe-school' } },
      { '@type': 'ItemList', name: 'FE School ile öğrenilebilecek diller', itemListElement: [
        { '@type': 'ListItem', position: 1, url: ORIGIN + '/english.html', name: 'İngilizce özel ders' },
        { '@type': 'ListItem', position: 2, url: ORIGIN + '/spanish.html', name: 'İspanyolca özel ders' },
        { '@type': 'ListItem', position: 3, url: ORIGIN + '/german.html', name: 'Almanca özel ders' }] });
  }
  if (page === 'app') webpage.mainEntity = { '@id': ORIGIN + '/#uygulama' };
  if (page !== 'home') graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: strip(S.nav1[i]), item: ORIGIN + url(l, 'home') },
    { '@type': 'ListItem', position: 2, name: strip(S[{ app: 'nav2', sys: 'nav3', contact: 'nav4' }[page]][i]), item: canon }] });
  if (page === 'contact') graph.push({ '@type': 'FAQPage', mainEntity: [1, 2, 3, 4].map(n => ({ '@type': 'Question', name: strip(S['fq' + n][i]),
    acceptedAnswer: { '@type': 'Answer', text: strip(S['fa_' + n][i]) } })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}

function header(l, page) {
  const i = LANGS[l].i;
  const nav = [['home', 'nav1'], ['app', 'nav2'], ['sys', 'nav3'], ['contact', 'nav4']]
    .map(([p, k]) => `<a href="${url(l, p)}"${p === page ? ' aria-current="page"' : ''}>${S[k][i]}</a>`).join('\n    ');
  const langs = Object.keys(LANGS).map(k => `<a href="${url(k, page)}" hreflang="${k}" lang="${k}"${k === l ? ' aria-current="true"' : ''}>${LANGS[k].label}</a>`).join('');
  return `<body>
${ICONS}
<a class="skip" href="#main">${S.skip[i]}</a>
<header class="site"><div class="wrap">
  <a class="logo" href="${url(l, 'home')}" aria-label="FE School"><img src="/assets/app-icon-128.png" alt="" width="38" height="38"><span class="wm" dir="ltr">FE<i>School</i></span></a>
  <nav class="main" aria-label="${S.menu[i]}">
    ${nav}
  </nav>
  <nav class="langs" aria-label="${S.langLabel[i]}">${langs}</nav>
  <a class="btn btn-orange btn-sm" data-loc="nav" href="${APP}" ${ext}>${S.openApp[i]}</a>
</div></header>
<main id="main">`;
}

/* Newest guides, read from the blog folders at build time (2026-11-09): the homepage cards and the footer
   "Guides" column list the latest posts, so a new post is linked from every page as soon as the site is rebuilt
   (re-run reshell-content.mjs too: it copies this footer onto the content pages). TR reads site/blog, FA site/fa/blog. */
const POSTS = {};
const unent = s => String(s).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
function posts(l) {
  if (POSTS[l]) return POSTS[l];
  const dir = l === 'fa' ? 'fa/blog' : (l === 'tr' ? 'blog' : null);
  const abs = dir && path.join(SITE, dir);
  const list = abs && fs.existsSync(abs) ? fs.readdirSync(abs).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => {
    const h = fs.readFileSync(path.join(abs, f), 'utf8');
    if (/name="robots" content="[^"]*noindex/i.test(h)) return null;
    const title = unent(strip((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '')).replace(/\s+/g, ' ').trim();
    const desc = unent((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
    const date = (h.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/) || [])[1] || '0000-00-00';
    return title ? { href: `/${dir}/${f}`, title, desc, date } : null;
  }).filter(Boolean) : [];
  list.sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
  return (POSTS[l] = list);
}
/* footer label: the title up to its first colon/dash, or through its first question mark */
const shortTitle = t => { const q = t.search(/[?؟]/); const c = t.search(/\s[:—–-]\s|:\s/); const cut = [q >= 0 ? q + 1 : -1, c].filter(n => n > 0).sort((a, b) => a - b)[0]; return (cut ? t.slice(0, cut) : t).trim(); };

// The mail link sits inside <!--email_off--> (2026-11-12 speed pass): otherwise Cloudflare's Email Obfuscation
// rewrites it and injects a parser-blocking email-decode.min.js before site.js on every page (~180 ms of main
// thread on a slow phone). The address is public in the JSON-LD anyway, so the obfuscation protected nothing.
// Privacy link per language (2026-11-14): TR -> /gizlilik-politikasi.html, EN -> /privacy-policy.html (Trello I0MaSI5K), FA -> /fa/privacy.html (eDtXMaZG).
function footer(l) {
  const i = LANGS[l].i, tr = l === 'tr' ? '' : ' hreflang="tr"';
  const P = posts(l).slice(0, 5);
  const guide = P.length ? `<div><h4>${S.fcGuide[i]}</h4>
      ${P.map(p => `<a href="${p.href}">${esc(shortTitle(p.title))}</a>`).join('\n      ')}
      <a href="/${l === 'fa' ? 'fa/' : ''}blog/">${S.gAll[i]}</a></div>` : '';
  return `</main>
<footer class="site"><div class="wrap">
  <div class="f-top"><a class="logo" href="${url(l, 'home')}" aria-label="FE School"><img src="/assets/app-icon-128.png" alt="" width="38" height="38" loading="lazy"><span class="wm" dir="ltr">FE<i>School</i></span></a><span class="tag">${S.tag[i]}</span></div>
  <div class="f-cols">
    <div><h4>${S.fcCourses[i]}</h4>
      <a href="/is-ingilizcesi.html"${tr}>${S.fBiz[i]}</a>
      <a href="/ielts-hazirlik.html"${tr}>${S.fIelts[i]}</a>
      ${l === 'fa' ? `<a href="/fa/kelas-zaban-englisi-online.html">${S.fEn[i]}</a>` : `<a href="/english.html"${tr}>${S.fEn[i]}</a>`}
      <a href="/spanish.html"${tr}>${S.fEs[i]}</a>
      <a href="/german.html"${tr}>${S.fDe[i]}</a>${l === 'tr' ? '' : `\n      <a href="/blog/"${tr}>${S.blog[i]}</a>`}${l === 'fa' ? `\n      <a href="/fa/blog/">وبلاگ فارسی</a>` : ''}</div>
    <div><h4>${S.fcSchool[i]}</h4>
      <a href="${url(l, 'home')}">${S.nav1[i]}</a>
      <a href="${url(l, 'app')}">${S.nav2[i]}</a>
      <a href="${url(l, 'sys')}">${S.nav3[i]}</a>
      <a href="${url(l, 'contact')}">${S.nav4[i]}</a>
      <a href="${url(l, 'home')}#kurs-sirket">${S.fCo[i]}</a>
      <a href="/studio.html"${tr}>${S.fStudio[i]}</a></div>
    ${guide}
    <div><h4>${S.fcContact[i]}</h4>
      <a data-lead="contact" href="${WA()}" ${ext}>WhatsApp</a>
      <a href="https://www.instagram.com/the_feschool/" ${ext}>Instagram</a>
      <!--email_off--><a href="mailto:farinrasuli@gmail.com">${S.fEmail[i]}</a><!--/email_off-->
      <a href="${{ tr: '/gizlilik-politikasi.html', en: '/privacy-policy.html', fa: '/fa/privacy.html' }[l]}">${S.fPrivacy[i]}</a></div>
  </div>
  <div class="footer-bottom"><span>© 2026 ${S.rights[i]}</span></div>
</div></footer>
<script src="/site.js"></script>
<script src="/feschool.js"></script>
</body>
</html>
`;
}

/* course card (port of the preview's card()) */
function card(l, c, live, also) {
  const i = LANGS[l].i, name = c.name[i];
  const pills = (live ? (l === 'fa' ? [['free', FREE1], ['free', ['', '', 'جلسه‌ی اول هدیه']]] : [['free', FREE1]]) : c.pills)
    .map(p => `<span class="pill ${p[0]}"><i></i>${esc(p[1][i])}</span>`).join('');
  const msg = WA(WAMSG[i](name));
  let ctas;
  /* 2026-11-26: courses have no price or buy button of their own; the full course comes with Plus (the app's wording), see #paketler */
  const arrow = l === 'fa' ? '←' : '→';
  if (live) ctas = `<a class="btn btn-purple" data-lead="private" href="${msg}" ${ext}>${esc(BOOK[i])}</a>`;
  else ctas = `<a class="btn btn-orange" data-loc="course-${c.key}" href="${APP}${c.cta === FREE11 ? `?course=${c.key}&amp;lang=${l}` : ''}" ${ext}>${esc(c.cta[i])}</a>` +
    (c.noWa ? '' : `<a class="tlink" data-loc="course-plus" href="${url(l, 'home')}#paketler">${esc(S2.seePlus[i])} <span aria-hidden="true">${arrow}</span></a>`);
  const price = live ? (l === 'fa' ? c.month + '<small>تومان در ماه، از بسته‌ی ۴ جلسه‌ای</small>' : LIVE_PRICE[i]) : (c.price ? c.price[i] : `<span class="inplus">${ic('star')}${esc(S2.fullPlus[i])}</span>`);
  const PACK = ['Aylık · 50 dk · ayda 4, 8 veya 12 ders · 3 ay peşin: 8 ve 12 derslik paketlerde %20 indirim', 'Monthly · 50 min · 4, 8 or 12 lessons a month · Pay 3 months upfront: 20% off the 8- and 12-lesson packs'];
  const note = (icon, html, cls = '') => `<li${cls ? ` class="${cls}"` : ''}>${ic(icon)}<span>${html}</span></li>`;
  const liveNotes = !live ? '' : l === 'fa'
    ? `<ul class="lnotes">${note('cal', 'ماهانه · جلسه‌ی ۵۰ دقیقه · ۴، ۸ یا ۱۲ جلسه در ماه · ۳ ماه یک‌جا: ۲۰٪ تخفیف (بسته‌ی ۸ و ۱۲)')}${note('users', `هزینه‌ی بسته بین اعضای گروه (۱ تا ۴ نفر) تقسیم می‌شود`)}${note('gift', '<b>هدیه:</b> بعد از پرداخت، یک جلسه‌ی تحلیل رایگان (تعیین سطح و هدف، ساخت نقشه‌ی راهت)، جدا از جلسه‌های بسته', 'g')}</ul>`
    : `<ul class="lnotes">${note('cal', esc(PACK[i]))}${note('gift', ['<b>Hediye:</b> ödemeden sonra ücretsiz bir analiz seansı (seviye tespiti, hedef belirleme, sana özel yol haritası). Paketinin dışında, ek olarak.', '<b>Free:</b> after you pay, an analysis session (level test, goal setting, your personal roadmap). Extra to your pack.'][i], 'g')}</ul>`;
  const more = l === 'tr' && c.more ? `<a class="tlink more" href="${c.more[0]}">${esc(c.more[1])}</a>`
    : l === 'fa' && c.moreFa ? `<a class="tlink more" href="${c.moreFa[0]}">${esc(c.moreFa[1])}</a>` : '';
  /* 2026-11-07 (farin-seo): indexable FA course pages (/fa/<slug>.html), linked above the guide */
  const pageFa = l === 'fa' && c.pageFa ? `<a class="tlink more" href="${c.pageFa[0]}">${esc(c.pageFa[1])}</a>`
    /* 2026-11-09 (farin-seo, Loop 2): indexable TR course pages (/<slug>.html) */
    : l === 'tr' && c.pageTr ? `<a class="tlink more" href="${c.pageTr}">${esc(DETAILS[0])}</a>` : '';
  /* also = list of [panel anchor or null, name x3, price x3, SALE key, app course id for the request button, true (or its own label) if it also has a free Lesson 1.1 link, optional FA course page that the name links to, optional TR course page that the name links to (2026-11-09)]; one row per course, one 'Also' label */
  /* 2026-11-26: one row per course = name + "Lesson 1.1 free · full course with Plus" + the free lesson link (no price, no request button) */
  const alsoRow = also && also.length ? `<div class="also"><b class="al">${esc(S.also[i])}</b>${also.map(a => `<div class="arow"><b>${a[0] ? `<a href="#kurs-${a[0]}">${esc(a[1][i])}</a>` : l === 'fa' && a[6] ? `<a href="${a[6]}">${esc(a[1][i])}</a>` : l === 'tr' && a[7] ? `<a href="${a[7]}">${esc(a[1][i])}</a>` : esc(a[1][i])}</b><span>${esc(SALE_TXT[SALE[a[3]]][i] + ' · ' + S2.fullPlusMid[i])}</span>${a[4] ? `<div class="alinks"><a data-loc="course-${a[4]}" href="${APP}?course=${a[4]}&amp;lang=${l}" ${ext}>${esc(FREE11[i])}</a></div>` : ''}</div>`).join('')}</div>` : '';
  return `<div class="course"><h3>${esc(name)}</h3><p class="for">${esc(c.for[i])}</p>
        <ul class="outs">${c.outs.map(o => `<li>${ic('check')}${o === ES_DE ? o[i] : esc(o[i])}</li>`).join('')}</ul>
        <div class="pricebox"><span class="price">${price}</span><span class="pills">${pills}</span></div>${liveNotes}
        <div class="ctas">${ctas}</div>${pageFa}${more}</div>${alsoRow}`;
}

/* company panel: same goal-picker panel as the courses, one small card per course */
function companyPanel(l) {
  const i = LANGS[l].i;
  /* 2026-11-26: companies buy Plus seats (one per employee); no per-course prices. FA shows Farin's team tiers in toman, TR/EN the seat price in lira. */
  const cutp = (p, t) => Math.round(p * (1 - t));
  const seat = l === 'fa'
    ? `<div class="co-seat"><b>${S.coSeat[i]}</b><span><strong>${faNum(MB.ir.plus[0])}</strong> تومان در ماه · یا سالی ${faNum(MB.ir.plus[1])} تومان، ${S.coEach[i]}</span></div>`
    : `<div class="co-seat"><b>${S.coSeat[i]}</b><span><strong>${lira(l, MB.tr.plus[0])}</strong> ${['/ ay', 'a month'][i]} · ${yearTxt(l, 'plus')}, ${S.coEach[i]}${l === 'en' ? ` (Iran: ${grp(MB.ir.plus[0], ',')} toman a month · ${grp(MB.ir.plus[1], ',')} a year)` : ''}</span></div>`;
  const tiers = l === 'fa' ? `<ul class="co-tiers">${CO_TIERS.map(([sz, t, note]) => `<li><b>${sz}</b><span class="co-tp">${t ? `<s>${faNum(MB.ir.plus[0])}</s> ` : ''}${faNum(cutp(MB.ir.plus[0], t))} تومان در ماه</span><span class="co-tp">${t ? `<s>${faNum(MB.ir.plus[1])}</s> ` : ''}${faNum(cutp(MB.ir.plus[1], t))} تومان در سال</span><span>${note}</span></li>`).join('')}</ul>` : '';
  const wa = `href="${WA(S.coWaMsg[i])}" ${ext}`;
  const ctas = l === 'fa'
    ? `<a class="btn btn-orange" href="/companies/">${S.coFill[i]} <span aria-hidden="true">←</span></a><a class="btn btn-ghost" data-lead="course" data-course="company" ${wa}>${S.coWa[i]}</a>`
    : `<a class="btn btn-orange" data-lead="course" data-course="company" ${wa}>${S.coWa[i]} <span aria-hidden="true">→</span></a>`;
  return `<div class="gres" id="kurs-sirket" data-goal="sirket">
    <div class="r-head">
      <div class="r-who"><span class="r-badge co-badge">${ic('users')}</span>
        <div><p class="eyebrow">${S.coEb[i]}</p><h2>${S.coQ[i]}${dot(S.coMark[i])}</h2></div></div>
      <p>${S.coP[i]}</p>
    </div>
    ${seat}
    <p class="co-in">${S.coIn[i]}</p>
    <div class="co-grid">
      ${COMPANY.map(c => {
        const [cls, txt] = salePill(c.sale);
        return `<article class="co-card" style="--c:var(${c.c})"><p class="co-pkg">${esc(c.pkg[i])}</p><h3>${esc(c.name[i])}</h3><p class="for">${esc(c.for[i])}</p><div class="co-foot"><span class="pill ${cls}"><i></i>${esc(txt[i])}</span></div></article>`;
      }).join('\n      ')}
    </div>
    ${tiers}
    <p class="co-note">${S.coOffer[i]}</p>
    <div class="ctas co-ctas">${ctas}</div>
  </div>`;
}

/* homepage: the 3 newest guides (TR and FA homepages only; EN has no posts of its own) */
function guidesBand(l) {
  const i = LANGS[l].i, all = posts(l), G = all.slice(0, 3);
  if (!G.length) return '';
  /* 2026-11-09: every other guide gets a compact homepage link too. GSC showed 4 older TR guides stuck at
     "Discovered - currently not indexed" after the newest posts took their footer slots; the homepage is the page
     Google crawls most, so linking all guides from it is the strongest crawl signal a young site has. */
  const rest = all.slice(3, 33);
  const arrow = l === 'fa' ? '←' : '→';
  const cut = (s, n) => s.length > n ? s.slice(0, s.lastIndexOf(' ', n)).replace(/[,،;:]$/, '') + '…' : s;
  return `
<div class="wrap guides" id="rehber" style="margin-top:clamp(64px,8vw,104px)">
  <div class="sec-head c"><p class="eyebrow">${S.fcGuide[i]}</p><h2>${S.gH[i]}</h2></div>
  <div class="gcards">
    ${G.map(p => `<a class="gcard" data-loc="home-guides" href="${p.href}"><b>${esc(p.title)}</b><span>${esc(cut(p.desc, 125))}</span><span class="gread">${S.gRead[i]} <span aria-hidden="true">${arrow}</span></span></a>`).join('\n    ')}
  </div>${rest.length ? `
  <nav class="glist" aria-label="${esc(S.gMore[i])}"><b>${S.gMore[i]}</b>
    ${rest.map(p => `<a data-loc="home-guides-list" href="${p.href}">${esc(shortTitle(p.title))}</a>`).join('\n    ')}
  </nav>` : ''}
  <div class="cta-row c"><a class="tlink" href="/${l === 'fa' ? 'fa/' : ''}blog/">${S.gAll[i]} ${arrow}</a></div>
</div>
`;
}

function home(l) {
  const i = LANGS[l].i;
  const goalCards = Object.entries(GOALS).map(([k, g]) =>
    `<a class="goal" href="#kurs-${k}" data-goal="${k}"${k === 'is' ? ' aria-current="true"' : ''} style="--c:var(${g.c})"><span class="tick">${ic('tick')}</span><span class="art"><img src="/assets/${g.img}.webp" alt="" width="128" height="128"></span><span><strong>${S[g.label][i]}</strong><small>${S[g.sub][i]}</small></span></a>`).join('\n        ')
    + `\n        <a class="goal goal-co" href="#kurs-sirket" data-goal="sirket"><span class="co-ico">${ic('users')}</span><span><strong>${S.coQ[i]}${S.coMark[i]}</strong><small>${S.coS[i]}</small></span><span class="co-arrow" aria-hidden="true">${l === 'fa' ? '←' : '→'}</span></a>`;
  const panels = Object.entries(GOALS).map(([k, g]) => {
    const lv = g.live ? LIVES[g.live] : null;
    return `<div class="gres${k === 'is' ? ' on' : ''}" id="kurs-${k}" data-goal="${k}">
    <div class="r-head">
      <div class="r-who"><span class="r-badge" style="--c:var(${g.c})"><img src="/assets/${g.img}.webp" alt="" width="56" height="56" loading="lazy"></span>
        <div><p class="eyebrow">${S.forYou[i]}</p><h2>${esc(g.title[i])}${dot('.')}</h2></div></div>
      <p>${(lv ? S.twoWays : S.oneWay)[i]}</p>
    </div>
    <div class="paths${lv ? '' : ' one'}">
      <article class="path self">
        <div class="p-top"><span class="p-ico">${ic('play')}</span><div><strong>${S.selfT[i]}</strong><span>${S.selfS[i]}</span></div></div>
        ${card(l, g.self, false, g.also)}
      </article>${lv ? `
      <article class="path live">
        <div class="p-top"><span class="p-ico">${ic('live')}</span><div><strong>${S.liveT[i]}</strong><span>${S.liveS[i]}</span></div></div>
        ${card(l, lv, true)}
      </article>` : ''}
    </div>
  </div>`;
  }).join('\n  ') + '\n  ' + companyPanel(l);
  const q = (n, av, col, name, lab, sm) => `<blockquote class="q${sm ? ' sm' : ''}"><p>${S[n][i]}</p><footer><span class="av" style="background:var(${col})" aria-hidden="true">${av}</span><cite>${S[name][i]}<span>${S[lab][i]}</span></cite></footer></blockquote>`;
  return `
<div class="wrap hero-out">
  <section class="hero" aria-labelledby="h1">
    <div class="hero-top">
      <p class="eyebrow">${S.heroEb[i]}</p>
      <h1 id="h1">${S.h1[i]}</h1>
      <p class="hero-sub">${S.heroSub[i]}</p>
    </div>
    <div class="hero-note hand" aria-hidden="true"><span>${S.note[i]}</span><svg><use href="#i-arrow"/></svg></div>
    <div class="goals" id="program">
        ${goalCards}
    </div>
    <div class="hero-foot">
      <span>${ic('star')}<b style="font-weight:700">${S.f1[i]}</b></span>
      <span>${ic('game')}<b style="font-weight:700">${S.f2[i]}</b></span>
      <span>${ic('card')}<b style="font-weight:700">${S.f3[i]}</b></span>
    </div>
  </section>
</div>

<section class="result" id="dersler"><div class="wrap">
  ${panels}
  <div class="freebar">${ic('gift')}<span>${S.freebar[i]}</span><a class="tlink" href="${url(l, 'app')}">${S.seeApp[i]}</a></div>
</div></section>

${gamesShow(l)}${communityBand(l)}
<div class="wrap" id="uygulama">
  <section class="appband">
    <div class="copy">
      <p class="eyebrow">${S.appEb[i]}</p>
      <h2>${S.appH[i]}</h2>
      <p class="lead">${S2.ftL[i]}</p>
      <div class="ctas"><a class="btn btn-purple" data-loc="appband" href="${APP}" ${ext}>${S.startFree[i]}</a><a class="tlink" href="${url(l, 'app')}">${S.explore[i]}</a></div>
    </div>
    <div class="phones" aria-hidden="false">
      <span class="sticker s1" aria-hidden="true">${S.st1[i]}</span>
      <span class="sticker s2" aria-hidden="true">${S.st2[i]}</span>
      <div class="ph"><img src="${shot(l, 'q1')}" alt="${esc(ALT.goals[i])}" width="600" height="1298" loading="lazy" decoding="async"></div>
      <div class="ph"><img src="${shot(l, 'home')}" alt="${esc(ALT.home[i])}" width="600" height="1298" loading="lazy" decoding="async"></div>
      <div class="ph"><img src="${shot(l, 'album')}" alt="${esc(ALT.album[i])}" width="600" height="1298" loading="lazy" decoding="async"></div>
    </div>
  </section>
  <div class="feats-home"><p class="eyebrow">${S2.ftEb[i]}</p>${featGrid(l, false)}</div>
</div>
${packagesBand(l)}<section class="sec" id="ogrenciler"><div class="wrap">
  <div class="sec-head c"><p class="eyebrow">${S.prEb[i]}</p><h2>${S.prH[i]}</h2></div>
  <div class="proof">
    <div class="bigstat"><span class="hand">${S.real[i]}</span><b>${S.pct[i]}</b><p>${S.pctL[i]}</p></div>
    <div class="qgrid">
      ${q('q1', l === 'fa' ? 'ت' : 'T', '--g-career', 'n1', 'l1')}
      ${q('q2', l === 'fa' ? 'د' : 'D', '--purple', 'n2', 'l2')}
    </div>
  </div>
  <div class="qgrid three">
    ${q('q3', l === 'fa' ? 'ا' : 'E', '--g-imm', 'n3', 'lCar', 1)}
    ${q('q4', l === 'fa' ? 'م' : 'M', '--orange-deep', 'n4', 'lCar', 1)}
    ${q('q5', l === 'fa' ? 'ز' : 'Z', '--g-exam', 'n5', 'lEx', 1)}
  </div>
</div></section>

<div class="wrap" id="hakkimda">
  <section class="founder">
    <div class="portrait"><img src="/assets/farin-portrait.webp" alt="${esc(S.fAlt[i])}" width="200" height="200" loading="lazy" decoding="async"></div>
    <div class="txt">
      <p class="eyebrow" style="color:var(--purple-ink)">${S.fEb[i]}</p>
      <h2>${S.fH[i]}</h2>
      <p>${S.fP[i]}</p>
      <ul class="facts"><li style="--c:var(--orange)"><i></i><span>${S.fa1[i]}</span></li><li style="--c:var(--purple)"><i></i><span>${S.fa2[i]}</span></li><li style="--c:var(--green)"><i></i><span>${S.fa3[i]}</span></li></ul>
      <span class="sign" aria-hidden="true">${S.sign[i]}</span>
    </div>
  </section>
  <div class="steps">
    <div class="step"><span class="n">${S.d1[i]}</span><div><b>${S.s1[i]}</b><span>${S.s1s[i]}</span></div></div>
    <div class="step"><span class="n">${S.d2[i]}</span><div><b>${S.s2[i]}</b><span>${S.s2s[i]}</span></div></div>
    <div class="step"><span class="n">${S.d3[i]}</span><div><b>${S.s3[i]}</b><span>${S.s3s[i]}</span></div></div>
  </div>
  <div class="cta-row" style="margin-top:26px"><a class="tlink" href="${url(l, 'sys')}">${S.howSys[i]}</a></div>
</div>

${guidesBand(l)}
<div class="wrap" style="margin-top:clamp(72px,9vw,120px)">
  <section class="close">
    <h2>${S.cH[i]}</h2>
    <p>${S.cP[i]}</p>
    <div class="row"><a class="btn btn-orange" href="#program">${S.cBtn[i]}</a><a class="btn btn-ghost" href="${url(l, 'contact')}">${S.nav4[i]}</a></div>
  </section>
</div>
`;
}

function appPage(l) {
  const i = LANGS[l].i;
  /* 2026-11-26 refresh: fresh screens from the live app (a throwaway local profile, nothing sent), the 3D game art, the community */
  const fc = (src, alt, col, k, b) => `<figure class="fcard" style="--c:var(${col})"><div class="scr"><img src="${src}" alt="${esc(alt)}" width="600" height="1298" loading="lazy" decoding="async"></div><figcaption><span class="k">${k}</span><b>${b}</b></figcaption></figure>`;
  return `
<section class="phero"><div class="wrap">
  <p class="eyebrow">${S.appEb[i]}</p>
  <h1>${S.apH[i]}</h1>
  <p class="lead">${S.apL[i]}</p>
</div></section>
<div class="wrap">
  <div class="feat" id="nasil">
    ${fc(shot(l, 'q1'), ALT.goals[i], '--g-career', S.k1[i], S.s1[i])}
    ${fc(shot(l, 'home'), ALT.home[i], '--purple', S.k2[i], S.b2[i])}
    ${fc(shot(l, 'album'), ALT.album[i], '--orange-deep', S.k3[i], S.b3[i])}
    ${fc(shot(l, 'groups'), S2.spAlt[i], '--g-imm', S2.spPill[i], S2.spH[i])}
  </div>
  <div class="cta-row">
    <a class="btn btn-purple" data-loc="app-page" href="${APP}" ${ext}>${S.startFree[i]}</a>
    <span class="muted"><a class="tlink" data-loc="app-page" href="${APK}">${S.andA[i]}</a> · ${S.andB[i]}</span>
  </div>
</div>

<section class="sec" id="sana-gore"><div class="wrap">
  <div class="sec-head c"><p class="eyebrow">${S.cmpEb[i]}</p><h2>${S.cmpH[i]}</h2><p class="lead">${S.cmpL[i]}</p></div>
  ${featGrid(l, true)}
  <div class="cta-row"><a class="btn btn-orange" data-loc="personal" href="${APP}" ${ext}>${GOALS.konusma.self.cta[i]}</a></div>
</div></section>
${gamesShow(l, true)}${communityBand(l)}
<section class="sec" id="dogal-ses" style="padding-top:clamp(40px,5vw,64px)"><div class="wrap">
  <div class="sec-head c" style="margin-bottom:24px"><p class="eyebrow">${S.vEb[i]}</p><h2>${S.vH[i]}</h2><p class="lead">${S.vP[i]}</p></div>
  <ul class="facts" style="justify-content:center"><li style="--c:var(--purple)"><i></i><span>${S.vB[i]}</span></li><li style="--c:var(--orange)"><i></i><span>${S.vG[i]}</span></li></ul>
  <p class="muted" style="text-align:center;margin-top:16px">${S.vM[i]}</p>
</div></section>

<div class="wrap">
  <div class="premium-strip">
    <span class="p-ico"><svg style="width:30px;height:30px" aria-hidden="true"><use href="#i-star"/></svg></span>
    <div><h2 style="font-size:1.6rem">${S.pmH[i]}</h2><p>${S.pmP[i]}</p></div>
    <a class="btn btn-orange btn-sm" href="${url(l, 'home')}#paketler">${S.pmBtn[i]}</a>
  </div>
</div>
`;
}

function sysPage(l) {
  const i = LANGS[l].i;
  const blk = (col, letter, icon, h, p) => `<div class="blk" style="--c:var(${col})"><span class="letter" aria-hidden="true">${letter}</span><span class="bi">${ic(icon)}</span><h2 style="font-size:1.5rem">${S[h][i]}</h2><p>${S[p][i]}</p></div>`;
  return `
<section class="phero"><div class="wrap">
  <p class="eyebrow">${S.nav3[i]}</p>
  <h1>${S.syH[i]}</h1>
  <p class="lead">${S.syL[i]}</p>
</div></section>
<div class="wrap">
  <div class="sys" id="yontem">
    ${blk('--purple', 'S', 'story', 'bS', 'bSp')}
    ${blk('--orange-deep', 'E', 'mask', 'bE', 'bEp')}
    ${blk('--g-imm', 'L', 'game', 'bL', 'bLp')}
    ${blk('--g-career', 'F', 'map', 'bF', 'bFp')}
  </div>
  <div class="selif" aria-label="SELIF" dir="ltr" lang="en"><span><b>S</b>tory</span><span><b>E</b>mpathy</span><span><b>L</b>iving language</span><span><b>I</b>mmersion</span><span><b>F</b>lexibility</span></div>

  <section class="track" style="margin-top:clamp(64px,8vw,104px)">
    <div class="sec-head" style="margin-bottom:18px"><p class="eyebrow">${S.trEb[i]}</p><h2 style="font-size:clamp(1.7rem,3.6vw,2.3rem)">${S.trH[i]}</h2></div>
    <ol class="trk" style="list-style:none;padding:0;margin:10px 0 0">
      <li class="st done"><span>${S.t_1[i]}</span><small>${S.t_1s[i]}</small></li>
      <li class="st done"><span>${S.t_2[i]}</span><small>${S.t_2s[i]}</small></li>
      <li class="st now"><span>${S.t_3[i]}</span><small>${S.t_3s[i]}</small></li>
      <li class="st"><span>${S.t_4[i]}</span><small>${S.t_4s[i]}</small></li>
      <li class="st"><span>${S.t_5[i]}</span><small dir="ltr">A1 → C1</small></li>
    </ol>
  </section>
  <div class="cta-row"><a class="btn btn-orange" href="${url(l, 'home')}#program">${S.s1[i]}</a><a class="tlink" href="/studio.html"${l === 'tr' ? '' : ' hreflang="tr"'}>${S.studio[i]}</a></div>
</div>
`;
}

function contactPage(l) {
  const i = LANGS[l].i;
  return `
<section class="phero"><div class="wrap">
  <p class="eyebrow">${S.nav4[i]}</p>
  <h1>${S.ctH[i]}</h1>
  <p class="lead">${S.ctL[i]}</p>
</div></section>
<div class="wrap">
  <div class="contact">
    <div class="card">
      <div class="wa"><span class="p-ico">${ic('chat')}</span><div><p class="eyebrow" style="color:#1B7E44">${S.waL[i]}</p><p class="num" id="waNum" dir="ltr">+90 546 761 59 51</p></div></div>
      <div class="ctas">
        <a class="btn btn-coral" data-lead="contact" href="${WA(S.waHello[i])}" ${ext}>${S.waBtn[i]}</a>
        <button class="btn btn-ghost btn-sm" type="button" id="copyWa">${S.copy[i]}</button>
        <span class="copy-ok" id="copyOk" hidden>${S.copied[i]}</span>
      </div>
      <h2 style="font-size:1.3rem;margin-top:6px">${S.needH[i]}</h2>
      <ul class="need">
        <li><b>${S.d1[i]}</b><span>${S.nd1[i]}</span></li>
        <li><b>${S.d2[i]}</b><span>${S.nd2[i]}</span></li>
        <li><b>${S.d3[i]}</b><span>${S.nd3[i]}</span></li>
        <li><b>${S.d4[i]}</b><span>${S.nd4[i]}</span></li>
      </ul>
    </div>
    <div class="card" id="sss">
      <h2 style="font-size:1.3rem">${S.faqH[i]}</h2>
      <div>
        <details open><summary>${S.fq1[i]}</summary><p>${S.fa_1[i]}</p></details>
        <details><summary>${S.fq2[i]}</summary><p>${S.fa_2[i]}</p></details>
        <details><summary>${S.fq3[i]}</summary><p>${S.fa_3[i]}</p></details>
        <details><summary>${S.fq4[i]}</summary><p>${S.fa_4[i]}</p></details>
      </div>
    </div>
  </div>
</div>
`;
}

/* ---------------- write ---------------- */
const BODY = { home, app: appPage, sys: sysPage, contact: contactPage };
/* a latin-ext preload is only worth it when the visible text has latin-ext characters (unicode-range of the -ext faces in fonts/tr.css) */
function dropUnusedExt(html) {
  if (!/latin-ext\.woff2" as="font"/.test(html)) return html;
  const text = html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ');
  const needsExt = /[Ā-ʺʽ-˅ˇ-ˌˎ-˗˝-˿Ḁ-ẟỲ-ỿ₠-₫₭-⃄Ⱡ-Ɀ꜠-ꟿ]/.test(text);
  return needsExt ? html : html.replace(/\n<link rel="preload" href="\/fonts\/(nunito|fredoka)-latin-ext\.woff2" as="font" type="font\/woff2" crossorigin>/g, '');
}
const css = fs.readFileSync(path.join(HERE, 'fe-base.css'), 'utf8') + fs.readFileSync(path.join(HERE, 'fe-extra.css'), 'utf8');
fs.writeFileSync(path.join(SITE, 'feschool.css'), '/* Generated by site-src/build-pages.mjs from fe-base.css + fe-extra.css. Edit those, then re-run. */\n' + css);
const report = [];
for (const l of Object.keys(LANGS)) {
  for (const p of Object.keys(BODY)) {
    const rel = (LANGS[l].base + (LANGS[l].pages[p] || 'index.html')).replace(/^\//, '');
    const out = path.join(SITE, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, dropUnusedExt(head(l, p) + '\n' + header(l, p) + BODY[p](l) + footer(l)));
    const i = LANGS[l].i;
    report.push(`${rel.padEnd(20)} title ${META[p].t[i].length}  desc ${META[p].d[i].length}`);
  }
}
console.log(report.join('\n'));
