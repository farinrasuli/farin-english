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
heroEb:['FE School · Kurslar + ücretsiz İngilizce öğrenme uygulaması','FE School · English courses + a free English learning app','FE School · دوره‌های زبان انگلیسی + اپلیکیشن رایگان'],
h1:['Neden İngilizce öğrenmek istiyorsun'+dot('?'),'Why do you want to learn English'+dot('?'),'چرا می‌خواهی انگلیسی یاد بگیری'+dot('؟')],
heroSub:['Cevabını seç. <b>Senin kursun hazır.</b>','Pick your answer. <b>Your course is ready.</b>','جوابت را انتخاب کن. <b>دوره‌ی تو آماده است.</b>'],
note:['birini seç','pick one','یکی را انتخاب کن'],
gIs:['İş ve kariyer','Work &amp; career','کار و شغل'],gIsS:['İK, toplantı, e-posta','HR, meetings, email','منابع انسانی، جلسه، ایمیل'],
gIe:['IELTS ve yurt dışı','IELTS &amp; moving abroad','آیلتس و مهاجرت'],gIeS:['Sınav, göç, eğitim','Exam, migration, study','آزمون، مهاجرت، تحصیل'],
gMu:['İş görüşmesi','Job interview','مصاحبه‌ی کاری'],gMuS:['Mülakata hazırlan','Get interview-ready','برای مصاحبه آماده شو'],
gKo:['Rahat konuşmak','Speak with confidence','راحت حرف زدن'],gKoS:['Kişisel, kendi hedefin','Personal, your own goal','شخصی، با هدف خودت'],
f1:['%97 öğrenci hedefine ulaştı','97% of students reached their goal','۹۷٪ شاگردها به هدفشان رسیدند'],
f2:['1. bölümün yarısı ücretsiz · birebir derste ilk analiz seansı hediye','Half of Chapter 1 free · a free analysis session with 1-to-1 lessons','نیمه‌ی اول فصل ۱ رایگان · کلاس آنلاین برای ۱ تا ۴ نفر'],
f3:['Uygulama için kart gerekmez','No card needed for the app','برای اپ کارت بانکی لازم نیست'],
forYou:['Senin için','For you','برای تو'],
oneWay:['Bu hedef için hazır bir kurs var.','There is a ready-made course for this goal.','برای این هدف یک دوره‌ی آماده هست.'],
twoWays:['İki yol var. Sana uyanı seç.','Two ways in. Pick what suits you.','دو راه هست. هر کدام که به تو می‌خورد را انتخاب کن.'],
selfT:['Kendi hızında kurs','Self-paced course','دوره با سرعت خودت'],
selfS:['Uygulamada · tek ödeme · 12 ay erişim','In the app · one payment · 12 months\' access','داخل اپ · یک‌بار پرداخت · ۱۲ ماه دسترسی'],
liveT:['Birebir canlı ders','Live 1-to-1 lessons','کلاس آنلاین با فرین'],
liveS:['Farin\'le online · ilk analiz seansı hediye','Online with Farin · free analysis session','تنها یا با حداکثر ۳ دوست (۱ تا ۴ نفر)'],
freebar:['Kursun FE App\'in içinde. Uygulamanın kendisi her zaman ücretsiz.','Your course lives inside FE App. The app itself is always free.','دوره‌ات داخل اپ FE است. خود اپ همیشه رایگان است.'],
seeApp:['Uygulamayı gör →','See the app →','اپ را ببین ←'],
appEb:['FE App · ücretsiz','FE App · free','اپ FE · رایگان'],
appH:['Kart yok, abonelik yok. Sadece başla'+dot('.'),'No card, no subscription. Just start'+dot('.'),'نه کارت، نه اشتراک. فقط شروع کن'+dot('.')],
t1:['Sana özel yol haritası','A roadmap made for you','نقشه‌ی راه مخصوص خودت'],
t2:['14 oyun, A1\'den C1\'e','14 games, A1 to C1','۱۴ بازی، از A1 تا C1'],
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
fP:['11 yıldır İngilizce öğretiyorum, beş dil konuşuyorum. FE School\'un yöntemini, yol haritasını ve oyunlarını bu deneyimle kurdum.',
  'I\'ve taught English for 11 years and I speak five languages. I built FE School\'s method, roadmap and games from that experience.',
  '۱۱ سال است انگلیسی درس می‌دهم و به پنج زبان صحبت می‌کنم. روش، نقشه‌ی راه و بازی‌های FE School را با همین تجربه ساختم.'],
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
apL:['Hedefini seç, yol haritan kurulsun, durak durak ilerle. Kart istemez, abonelik yok.','Pick your goal, get your roadmap and move forward stop by stop. No card, no subscription.','هدفت را انتخاب کن، نقشه‌ی راهت ساخته شود و ایستگاه به ایستگاه جلو برو. نه کارت لازم است، نه اشتراک.'],
k1:['Adım 1','Step 1','قدم ۱'],k2:['Adım 2','Step 2','قدم ۲'],k3:['Hikaye oyunu','Story game','بازی داستانی'],k4:['14 oyun','14 games','۱۴ بازی'],
b2:['Yolun kurulur','Your path is built','مسیرت ساخته می‌شود'],b3:['Kararı sen ver','You make the call','تصمیم با توست'],b4:['Oyunla pekiştir','Lock it in with games','با بازی تثبیتش کن'],
andA:['Android\'e indir','Download for Android','دانلود نسخه‌ی اندروید'],andB:['iPhone\'da tarayıcıdan açılır','opens in the browser on iPhone','در آیفون از مرورگر باز می‌شود'],
pmH:['Premium kursların da burada'+dot('.'),'Your premium courses are here too'+dot('.'),'دوره‌های ویژه‌ات هم همین‌جاست'+dot('.')],
pmP:['İş İngilizcesi ve IELTS kursları uygulamanın içinde açılır. 1. bölümün ilk yarısı ücretsiz, gerisi için WhatsApp\'tan şifre alırsın.','The Business English and IELTS courses open inside the app. The first half of Chapter 1 is free; for the rest you get a password on WhatsApp.','دوره‌های انگلیسی تجاری و آیلتس داخل اپ باز می‌شوند. نیمه‌ی اول فصل اول رایگان است و برای بقیه‌اش رمز را از واتس‌اپ می‌گیری.'],
pmBtn:['Hedefime uygun kurs','Find my course','دوره‌ی مناسب من'],
gamesEb:['Oyunlar','Games','بازی‌ها'],
gamesH:['Her durakta bir oyun'+dot('.'),'A game at every stop'+dot('.'),'در هر ایستگاه یک بازی'+dot('.')],
gamesL:['Siparişi hazırla, davayı çöz, odayı topla. On dört oyun, hepsi İngilizce, A1\'den C1\'e her seviyede.','Prepare the order, solve the case, tidy the room. Fourteen games, all in English, at every level from A1 to C1.','سفارش را آماده کن، پرونده را حل کن، اتاق را مرتب کن. چهارده بازی، همه به انگلیسی، در همه‌ی سطح‌ها از A1 تا C1.'],
gmore:['Ve 10 oyun daha','And 10 more games','و ۱۰ بازی دیگر'],
cmpEb:['Sana göre','Made for you','مخصوص تو'],
cmpH:['Aynı seviye. Başka hedef. Başka yol'+dot('.'),'Same level. Different goal. Different path'+dot('.'),'همان سطح. هدف دیگر. مسیر دیگر'+dot('.')],
cmpL:['Hedeflerin, seviyen ve sevdiğin konular yolunu çizer. Hedefin değişirse yolun da değişir.','Your goals, your level and the topics you enjoy draw your path. Change your goal and your path changes too.','هدف‌ها، سطح و موضوع‌های مورد علاقه‌ات مسیرت را می‌سازند. اگر هدفت عوض شود، مسیرت هم عوض می‌شود.'],
cap1:['B1 · Seyahat','B1 · Travel','B1 · سفر'],cap2:['B1 · Kariyer ve İş','B1 · Career &amp; work','B1 · کار و شغل'],
syH:['Diğer dil okullarına benzemiyoruz'+dot('.'),'We\'re not like other language schools'+dot('.'),'ما شبیه بقیه‌ی آموزشگاه‌های زبان نیستیم'+dot('.')],
syL:['Ezber listesi yok. Yaşadığını daha kolay hatırlarsın.','No lists to memorise. You remember what you live through.','خبری از لیست حفظ‌کردنی نیست. چیزی را که تجربه کنی راحت‌تر یادت می‌ماند.'],
bS:['Hikayeyle öğrenirsin','You learn through stories','با داستان یاد می‌گیری'],
bSp:['Kelimeler bir listede değil, bir hikayenin ya da videonun içinde gelir.','Words come inside a story or a video, not a list.','کلمه‌ها داخل یک داستان یا ویدیو می‌آیند، نه در یک لیست.'],
bE:['Başkasının yerine geçip konuşursun','You step into someone else\'s shoes','جای یک نفر دیگر حرف می‌زنی'],
bEp:['Gerçek cümleleri bir rolün içinde söylersin. Konuşma korkusu azalır.','You say real sentences inside a role, and your fear of speaking fades.','جمله‌های واقعی را در قالب یک نقش می‌گویی و ترس از حرف زدن کم می‌شود.'],
bL:['Oyunlarla pekiştirirsin','You lock it in with games','با بازی تثبیتش می‌کنی'],
bLp:['14 oyun, A1\'den C1\'e her seviyede. Tekrar, oyunun içinde olur.','14 games at every level from A1 to C1. Review happens inside the game.','۱۴ بازی در همه‌ی سطح‌ها از A1 تا C1. مرور داخل خود بازی اتفاق می‌افتد.'],
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
fa_1:['Evet. Yol haritası, oyunlar ve dersler ücretsiz. Sadece premium kurslar ücretli.','Yes. The roadmap, games and lessons are free. Only the premium courses are paid.','بله. نقشه‌ی راه، بازی‌ها و درس‌ها رایگان‌اند. فقط دوره‌های ویژه پولی هستند.'],
fq2:['Kursu nasıl alırım?','How do I get a course?','دوره را چطور بخرم؟'],
fa_2:['1. bölümün ilk yarısını uygulamada ücretsiz dene. Devam etmek istersen WhatsApp\'tan yaz, kursun şifresini gönderirim.','Try the first half of Chapter 1 free in the app. If you want to continue, message me on WhatsApp and I\'ll send you the course password.','نیمه‌ی اول فصل اول را رایگان در اپ امتحان کن. اگر خواستی ادامه بدهی، در واتس‌اپ پیام بده تا رمز دوره را برایت بفرستم.'],
fq3:['Birebir ders nasıl işliyor?','How do 1-to-1 lessons work?','کلاس آنلاین چطور است؟'],
fa_3:['Online, sadece sen ve Farin. Aylık paket: ayda 4 ders ₺3.400, 8 ders ₺6.720 ya da 12 ders ₺9.960, sen seç; 3 ayı tek seferde ödersen 8 ve 12 derslik paketlerde %20 indirim. Ödemeden sonra ücretsiz bir analiz seansı: seviye tespiti, hedef belirleme ve sana özel yol haritası. Paketinin dışında, ek olarak.','Online, just you and Farin. A monthly pack: 4 lessons a month ₺3,400, 8 lessons ₺6,720 or 12 lessons ₺9,960, your choice; pay 3 months at once and get 20% off the 8- and 12-lesson packs. Free analysis session after you pay: level test, goal setting and your personal roadmap. Extra to your pack.','آنلاین با فرین، تنها یا با حداکثر ۳ دوست (۱ تا ۴ نفر). پرداخت ماهانه است و هر جلسه ۵۰ دقیقه؛ ۴، ۸ یا ۱۲ جلسه در ماه، به انتخاب خودت. اگر هزینه‌ی ۳ ماه را یک‌جا بپردازی، بسته‌های ۸ و ۱۲ جلسه‌ای ۲۰٪ تخفیف دارند. بسته‌ی ۴ جلسه‌ای کلاس تجاری ماهی ۱۸٬۰۰۰٬۰۰۰ تومان و کلاس عمومی شخصی‌سازی‌شده ماهی ۱۴٬۰۰۰٬۰۰۰ تومان است (بسته‌ی ۸ و ۱۲ جلسه‌ای به همین نسبت) و هزینه‌ی بسته بین اعضای گروه تقسیم می‌شود. جلسه‌ی اول یک جلسه‌ی تحلیل رایگان است و جدا از جلسه‌های بسته‌ی ماهانه حساب می‌شود: تعیین سطح، تعیین هدف و ساخت نقشه‌ی راه شخصی‌ات. بعد از پرداخت برگزار می‌شود.'],
tag:['Öğrenmen gerektiği için değil, gidecek bir yerin olduğu için.','Not because you have to learn, but because you have somewhere to go.','نه چون باید یاد بگیری؛ چون جایی برای رفتن داری.'],
blog:['Blog','Blog (Turkish)','وبلاگ (ترکی)'],
also:['Ayrıca','Also','همچنین'],want:['Bu kursu istiyorum','I want this course','این دوره را می‌خواهم'],
waHello:['Merhaba Farin! FE School hakkında bilgi almak istiyorum.','Hi Farin! I\'d like to know more about FE School.','سلام فرین! می‌خواهم درباره‌ی FE School بیشتر بدانم.'],
// footer
fcCourses:['Kurslar ve dersler','Course pages (in Turkish)','صفحه‌های دوره (به ترکی)'],
fcSchool:['FE School','FE School','FE School'],fcGuide:['Rehber','Guides','راهنما'],fcContact:['İletişim','Contact','تماس'],
fBiz:['İş İngilizcesi','Business English','انگلیسی تجاری'],fIelts:['IELTS hazırlık','IELTS prep','آمادگی آیلتس'],
fEn:['Online İngilizce özel ders','English lessons','کلاس انگلیسی'],fEs:['İspanyolca özel ders','Spanish lessons','کلاس اسپانیایی'],fDe:['Almanca özel ders','German lessons','کلاس آلمانی'],
fStudio:['Stüdyo','Studio','استودیو'],fEmail:['E-posta','Email','ایمیل'],fPrivacy:['Gizlilik Politikası','Privacy policy (Turkish)','سیاست حریم خصوصی (ترکی)'],
rights:['FE School. Tüm hakları saklıdır.','FE School. All rights reserved.','FE School. همه‌ی حقوق محفوظ است.'],
};

const WAMSG = [n => `Merhaba Farin! "${n}" ile ilgileniyorum.`, n => `Hi Farin! I'm interested in "${n}".`, n => `سلام فرین! به «${n}» علاقه دارم.`];
const LIVE_PRICE = ['₺3.400<small>\'dan / ay</small>', '<small style="margin:0 4px 0 0">from</small>₺3,400<small>/ month</small>', null];
const FREE1 = ['İlk analiz seansı hediye', 'Free analysis session', '۱ تا ۴ نفر'];
const BOOK = ['Dersini ayarla', 'Book your lessons', 'رزرو کلاس'];
const OWN = ['Kendi hızında, uygulamada', 'At your own pace, in the app', 'با سرعت خودت، داخل اپ'];
const DETAILS = ['Kurs detayları →', 'Details (Turkish) →', 'جزئیات (ترکی) ←'];

/* SALE STATUS: one field per premium course. Courses go on sale as soon as they are complete
   (Farin 2026-10-29: the sale-date calendar is gone). Flip 'soon' -> 'now' here and re-run.
   Then also flip the data-sale markers in /kelas/ + /dersler/ and the IELTS block in ielts-hazirlik.html by hand. */
const SALE = { hr: 'soon', ielts: 'soon', interview: 'soon', marketing: 'soon', sales: 'soon' };
const SALE_TXT = { soon: ['Yakında satışta', 'Coming soon', 'به‌زودی'], now: ['Şimdi satışta', 'On sale now', 'در حال فروش'] };
const salePill = k => [SALE[k] === 'now' ? 'free' : 'soon', SALE_TXT[SALE[k]]];

const LIVES = {
  biz: { key: 'business-live', name: ['Birebir İş İngilizcesi', 'Business English 1-to-1', 'کلاس انگلیسی تجاری'],
    for: ['Senin işin ve senin toplantıların üzerine kurulur.', 'Built around your job and your meetings.', 'بر اساس کار و جلسه‌های کاری خودت ساخته می‌شود.'],
    outs: [['Konuşma ağırlıklı', 'Speaking-focused', 'تمرکز روی مکالمه'], ['Sektörüne göre içerik, mülakat provası dahil', 'Content for your industry, interview practice included', 'محتوا بر اساس حوزه‌ی کاری، همراه با تمرین مصاحبه'], ['Esnek saatler', 'Flexible hours', 'ساعت‌های منعطف']],
    toman: '۴٬۵۰۰٬۰۰۰', month: '۱۸٬۰۰۰٬۰۰۰', each: '۱٬۱۲۵٬۰۰۰', more: ['/is-ingilizcesi.html#ders', 'İş İngilizcesi dersleri →'] },
  gen: { key: 'general-live', name: ['Birebir genel İngilizce', 'General English 1-to-1', 'کلاس انگلیسی عمومی شخصی‌سازی‌شده'],
    for: ['Ders tamamen senin hedefine ve ilgi alanına göre.', 'Lessons built entirely on your goal and interests.', 'کلاس کاملاً بر اساس هدف و علاقه‌های خودت.'],
    outs: [['Konuşma odaklı', 'Speaking-focused', 'تمرکز روی مکالمه'], ['Senin konuların', 'Your topics', 'موضوع‌های خودت'], ['İspanyolca ve Almanca da var', 'Spanish and German too', 'اسپانیایی و آلمانی هم هست']],
    toman: '۳٬۵۰۰٬۰۰۰', month: '۱۴٬۰۰۰٬۰۰۰', each: '۸۷۵٬۰۰۰', more: ['/english.html#paketler', 'Online İngilizce özel ders →'] },
};
const GOALS = {
  is: { img: 'char-career', c: '--g-career', title: ['İş ve kariyer', 'Work & career', 'کار و شغل'], label: 'gIs', sub: 'gIsS',
    self: { key: 'hr', name: ['İK & İş İngilizcesi', 'HR & Business English', 'انگلیسی منابع انسانی و تجاری'],
      for: ['Toplantı, e-posta, sunum ve İK yazışmaları için hazır bir yol.', 'A ready path for meetings, emails, presentations and HR writing.', 'یک مسیر آماده برای جلسه، ایمیل، ارائه و مکاتبات منابع انسانی.'],
      outs: [['Gerçek iş senaryoları', 'Real workplace scenarios', 'سناریوهای واقعی محیط کار'], ['Hazır cümle kalıpları', 'Ready-to-use phrases', 'الگوهای جمله‌ی آماده'], OWN],
      price: ['₺3.490', '₺3,490', '۴٬۹۹۰٬۰۰۰<small>تومان</small>'], pills: [salePill('hr'), ['free', ['1. bölümün yarısı ücretsiz', 'Half of Chapter 1 free', 'نیمه‌ی فصل ۱ رایگان']]],
      cta: ['Ücretsiz başla', 'Start free', 'رایگان شروع کن'], more: ['/is-ingilizcesi.html', 'İş İngilizcesi sayfası →'], moreFa: ['/fa/blog/estelahat-manabe-ensani-englisi.html', 'راهنما: اصطلاحات منابع انسانی به انگلیسی ←'] },
    live: 'biz', also: [['mulakat', ['İş Görüşmesi İngilizcesi', 'Job Interview English', 'انگلیسی مصاحبه‌ی کاری'], ['₺1.290', '₺1,290', '۲٬۹۹۰٬۰۰۰ تومان'], 'interview'],
      [null, ['Pazarlama İngilizcesi', 'Marketing English', 'انگلیسی برای بازاریابی'], ['₺1.690', '₺1,690', '۳٬۴۹۰٬۰۰۰ تومان'], 'marketing'],
      [null, ['Satış ve Müşteri Yönetimi İngilizcesi', 'Sales & Customer Management English', 'انگلیسی فروش و مدیریت مشتری'], ['₺1.690', '₺1,690', '۳٬۸۰۰٬۰۰۰ تومان'], 'sales']] },
  ielts: { img: 'char-exam', c: '--g-exam', title: ['IELTS ve yurt dışı', 'IELTS & moving abroad', 'آیلتس و مهاجرت'], label: 'gIe', sub: 'gIeS',
    self: { key: 'ielts', name: ['IELTS: 10 Tam Sınav', 'IELTS: 10 Full Exams', 'آیلتس: ۱۰ آزمون کامل'],
      for: ['Gerçek sınava yakın 10 deneme, bölüm bölüm teknik.', '10 practice tests close to the real exam, with technique part by part.', '۱۰ آزمون نزدیک به آزمون واقعی، با تکنیک بخش به بخش.'],
      outs: [['Listening, Reading, Writing, Speaking', 'Listening, Reading, Writing, Speaking', 'Listening، Reading، Writing، Speaking'], ['Her sınav 10 ders', '10 lessons per exam', '۱۰ درس برای هر آزمون'], OWN],
      price: ['₺9.490', '₺9,490', '۹٬۹۹۰٬۰۰۰<small>تومان</small>'], pills: [salePill('ielts'), ['free', ['Sınav 1\'in ilk yarısı ücretsiz', 'First half of Exam 1 free', 'نیمه‌ی اول آزمون ۱ رایگان']]],
      cta: ['Ücretsiz başla', 'Start free', 'رایگان شروع کن'], more: ['/ielts-hazirlik.html#ielts-kursu', 'IELTS kursunun detayları →'], moreFa: ['/fa/blog/nameh-nevisi-ielts-general.html', 'راهنما: نامه‌نویسی آیلتس جنرال ←'] },
    live: null },
  mulakat: { img: 'char-immigration', c: '--g-imm', title: ['İş görüşmesi', 'Job interview', 'مصاحبه‌ی کاری'], label: 'gMu', sub: 'gMuS',
    self: { key: 'interview', name: ['İş Görüşmesi İngilizcesi', 'Job Interview English', 'انگلیسی مصاحبه‌ی کاری'],
      for: ['En sık sorulan sorular ve güçlü cevaplar.', 'The most common questions and strong answers.', 'رایج‌ترین سؤال‌ها و جواب‌های قوی.'],
      outs: [['Hazır cevap kalıpları', 'Ready-made answer patterns', 'الگوهای آماده برای جواب'], ['Kendini tanıtma', 'Introducing yourself', 'معرفی خودت'], OWN],
      price: ['₺1.290', '₺1,290', '۲٬۹۹۰٬۰۰۰<small>تومان</small>'], pills: [salePill('interview')],
      cta: ['Açılınca haber ver', 'Tell me when it opens', 'وقتی باز شد خبرم کن'], notify: true, more: ['/blog/is-ingilizcesi-mulakat-sorulari.html', 'Mülakat soruları rehberi →'], moreFa: ['/fa/blog/moarefi-khod-mosahebe-englisi.html', 'راهنما: معرفی خود در مصاحبه به انگلیسی ←'] },
    live: 'biz', also: [['is', ['İK & İş İngilizcesi', 'HR & Business English', 'انگلیسی منابع انسانی و تجاری'], ['₺3.490', '₺3,490', '۴٬۹۹۰٬۰۰۰ تومان'], 'hr']] },
  konusma: { img: 'char-everyday', c: '--g-every', title: ['Rahat konuşmak', 'Speak with confidence', 'راحت حرف زدن'], label: 'gKo', sub: 'gKoS',
    self: { key: 'roadmap', name: ['Ücretsiz yol haritası', 'Free roadmap', 'نقشه‌ی راه رایگان'],
      for: ['Hedefini ve seviyeni seç, uygulama yolunu kursun.', 'Pick your goal and level, and the app builds your path.', 'هدف و سطحت را انتخاب کن تا اپ مسیرت را بسازد.'],
      outs: [['Hikaye, kelime, dilbilgisi', 'Stories, vocabulary, grammar', 'داستان، واژگان، گرامر'], ['14 oyun', '14 games', '۱۴ بازی'], ['Tamamen ücretsiz', 'Completely free', 'کاملاً رایگان']],
      price: ['₺0', 'Free', 'رایگان'], pills: [['free', ['Her zaman ücretsiz', 'Always free', 'همیشه رایگان']]],
      cta: ['Yol haritamı kur', 'Build my roadmap', 'نقشه‌ی راهم را بساز'], noWa: true, more: ['/blog/ingilizce-konusma-pratigi-nasil-yapilir.html', 'Konuşma pratiği rehberi →'] },
    live: 'gen' },
};
const GAMES_SHOWN = [
  { img: 'screen-game-siparis', c: '--orange-deep', name: ['Sipariş Hazır!', 'Order Up!', 'سفارش حاضر!'], d: ['Müşteriyi dinle, tepsiyi hazırla.', 'Listen to the customer, fill the tray.', 'به مشتری گوش کن و سینی را آماده کن.'] },
  { img: 'screen-game-dava', c: '--purple', name: ['Dava Kapandı', 'Case Closed', 'پرونده مختومه'], d: ['İpuçlarını oku, kimin yaptığını bul.', 'Read the clues, find who did it.', 'سرنخ‌ها را بخوان و پیدا کن کار چه کسی بوده.'] },
  { img: 'screen-game-pasaport', c: '--g-imm', name: ['Pasaport Masası', 'Passport Desk', 'میز گذرنامه'], d: ['Yolcuyu dinle, karttaki hatayı düzelt.', 'Listen to the traveller, fix the mistake on the card.', 'به مسافر گوش کن و اشتباه روی کارت را درست کن.'] },
  { img: 'screen-game-sihirli', c: '--g-career', name: ['Sihirli Kelimeler', 'Magic Words', 'کلمات جادویی'], d: ['Kelimeyi sesli söyle, kapıyı aç.', 'Say the word out loud, open the door.', 'کلمه را بلند بگو و در را باز کن.'] },
];
const GAMES_MORE = [
  [['Ev İşleri', 'Cozy Chores', 'کارهای دنج خانه'], ['Boyalı bir mutfakta cümleleri takip et, odayı sırayla topla.', 'Follow the sentences and tidy a painted kitchen step by step.', 'جمله‌ها را دنبال کن و یک آشپزخانه‌ی نقاشی‌شده را قدم به قدم مرتب کن.']],
  [['Karar Senin', 'Your Call', 'تصمیم با تو'], ['Ne diyeceğini sen seçersin, hikaye ona göre ilerler.', 'You choose what to say, and the story follows.', 'خودت انتخاب می‌کنی چه بگویی و داستان بر همان اساس جلو می‌رود.']],
  [['Mini Bulmaca', 'Mini Cross', 'جدول کوچک'], ['Öğrendiğin kelimeleri bulmacaya yaz.', 'Write the words you learned into the crossword.', 'کلمه‌هایی را که یاد گرفتی در جدول بنویس.']],
  [['Kelime Yarışı', 'Word Rush', 'مسابقه کلمات'], ['Karoları çevir, kelimeyi anlamıyla eşleştir.', 'Flip the tiles and match each word to its meaning.', 'کاشی‌ها را برگردان و هر کلمه را با معنی‌اش جفت کن.']],
  [['Hikaye Avı', 'Story Hunt', 'شکار داستان'], ['Hikayende gizli kelimeleri bul.', 'Find the hidden words in your story.', 'کلمه‌های پنهان را در داستانت پیدا کن.']],
  [['Cümle Kur', 'Build It', 'جمله بساز'], ['Karolara dokun, cümleyi kur.', 'Tap the tiles and build the sentence.', 'روی کاشی‌ها بزن و جمله را بساز.']],
  [['Kelime Tombalası', 'Word Bingo', 'بینگوی کلمات'], ['İpucunu dinle, kelimeye dokun.', 'Listen to the clue, tap the word.', 'به سرنخ گوش کن و روی کلمه بزن.']],
  [['Tekrar Et', 'Say It Back', 'بگو ببینم'], ['Cümleyi dinle, sesli tekrar et.', 'Listen to the sentence and say it back.', 'به جمله گوش کن و بلند تکرارش کن.']],
  [['Dinle ve Yaz', 'Listen & Type', 'گوش کن و بنویس'], ['Cümleyi dinle, duyduğunu yaz.', 'Listen to the sentence and type what you hear.', 'به جمله گوش کن و آنچه می‌شنوی را بنویس.']],
  [['Tuzak Kaçışı', 'Trap Dash', 'فرار از تله‌ها'], ['Doğru şekli hızla seç.', 'Pick the right form, fast.', 'شکل درست را سریع انتخاب کن.']],
];
const ALT = {
  goals: ['FE App ilk ekranı: hedeflerini seçtiğin ekran', 'FE App first screen: pick your goals', 'صفحه‌ی اول اپ FE: انتخاب هدف‌ها'],
  kariyer: ['FE App yol haritası: B1 Kariyer ve İş hedefi', 'FE App roadmap: B1, career and work goal', 'نقشه‌ی راه اپ FE: سطح B1، هدف کار و شغل'],
  ielts: ['FE App yol haritası: B1 IELTS hedefi', 'FE App roadmap: B1, IELTS goal', 'نقشه‌ی راه اپ FE: سطح B1، هدف آیلتس'],
  seyahat: ['FE App yol haritası: B1 Seyahat hedefi', 'FE App roadmap: B1, travel goal', 'نقشه‌ی راه اپ FE: سطح B1، هدف سفر'],
  karar: ['Karar Senin oyunu: Whitby\'de bir sahne ve iki İngilizce cevap seçeneği', 'Your Call story game: a scene in Whitby with two English answers to choose from', 'بازی داستانی «تصمیم با تو»: صحنه‌ای در ویتبی با دو جواب انگلیسی'],
  ev: ['Ev İşleri oyunu: boyalı bir mutfak ve sırayla yapılacak işler', 'Cozy Chores game: a painted kitchen and tasks to do in order', 'بازی «کارهای دنج خانه»: آشپزخانه‌ی نقاشی‌شده و کارهایی که باید به ترتیب انجام شود'],
  game: ['FE App oyun ekranı: ', 'FE App game screen: ', 'صفحه‌ی بازی در اپ FE: '],
};

const META = {
  home: { t: ['Ücretsiz İngilizce Öğrenme Uygulaması ve Kurslar | FE School', 'English Courses and a Free English App | FE School', 'کلاس و دوره‌ی آنلاین زبان انگلیسی + اپ رایگان | FE School'],
    d: ['Hedefini seç: İş İngilizcesi, IELTS, iş görüşmesi ya da konuşma. Ücretsiz İngilizce öğrenme uygulaması, kendi hızında kurslar ve birebir ders.',
        'Pick your goal: Business English, IELTS, job interviews or confident speaking. Self-paced courses, live lessons with Farin and a free app.',
        'هدفت را انتخاب کن: انگلیسی تجاری، آیلتس، مصاحبه‌ی کاری یا راحت حرف زدن. دوره با سرعت خودت، کلاس آنلاین با فرین و یک اپ رایگان.'] },
  app: { t: ['FE App: Oyunla İngilizce, Sana Özel Yol Haritası | FE School', 'FE App: a Free English App with Games | FE School', 'اپ FE: انگلیسی با بازی و نقشه‌ی راه شخصی | FE School'],
    d: ['Hedefini seç, sana özel yol haritan kurulsun, 14 oyunla A1\'den C1\'e ilerle. Ücretsiz İngilizce öğrenme uygulaması: kart yok, abonelik yok.',
        'Pick your goal, get a roadmap made for you and move from A1 to C1 with 14 games. A free English learning app: no card, no subscription.',
        'هدفت را انتخاب کن، نقشه‌ی راه مخصوص خودت ساخته شود و با ۱۴ بازی از A1 تا C1 جلو برو. اپ رایگان یادگیری انگلیسی؛ نه کارت، نه اشتراک.'] },
  sys: { t: ['Sistemimiz: Hikaye ve Oyunla İngilizce | FE School', 'Our System: Learn English Through Stories | FE School', 'روش ما: یادگیری انگلیسی با داستان و بازی | FE School'],
    d: ['Ezber listesi yok. Hikaye, rol, oyun ve sana göre kurulan bir yol: FE School\'un SELIF yöntemi, seviye testinden sonraki seviyeye.',
        'No lists to memorise. Stories, roles, games and a path built around you: how the FE School SELIF method works, from level test to next level.',
        'خبری از لیست حفظ‌کردنی نیست. داستان، نقش، بازی و مسیری که برای تو ساخته می‌شود: روش SELIF در FE School از تعیین سطح تا سطح بعدی.'] },
  contact: { t: ['İletişim: Farin\'e WhatsApp\'tan Yaz | FE School', 'Contact: Message Farin on WhatsApp | FE School', 'تماس: در واتس‌اپ به فرین پیام بده | FE School'],
    d: ['Kurs, birebir ders ya da sadece bir soru: Farin\'e WhatsApp\'tan yaz, aynı gün dönüyor. Uygulama, kurs şifresi ve birebir ders hakkında sık sorulanlar.',
        'A course, live lessons or just a question: message Farin on WhatsApp and get a reply the same day. Plus answers to the most common questions.',
        'دوره، کلاس آنلاین یا فقط یک سؤال: در واتس‌اپ به فرین پیام بده، همان روز جواب می‌دهد. جواب سؤال‌های رایج درباره‌ی اپ، رمز دوره و کلاس‌ها.'] },
};

/* ---------------- templates ---------------- */
const ICONS = fs.readFileSync(path.join(HERE, 'icons.svg'), 'utf8').trim();
const ic = (id, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#i-${id}"/></svg>`;

function head(l, page) {
  const L = LANGS[l], i = L.i, m = META[page];
  const canon = ORIGIN + url(l, page);
  const alts = Object.keys(LANGS).map(k => `<link rel="alternate" hreflang="${k}" href="${ORIGIN + url(k, page)}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${ORIGIN + url('tr', page)}">`;
  const fonts = l === 'fa'
    ? 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap'
    : 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&family=Caveat:wght@600;700&display=swap';
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fonts}" rel="stylesheet">
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
        description: 'Ücretsiz İngilizce öğrenme uygulaması (FE App), uygulama içinde kendi hızında İngilizce kursları (İK ve İş İngilizcesi, IELTS, İş Görüşmesi, Pazarlama, Satış ve Müşteri Yönetimi) ve Farin ile canlı online dersler.',
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
        description: 'Hedeflerine göre kişisel yol haritası kuran, her durağında bir oyun olan ücretsiz İngilizce öğrenme uygulaması.',
        featureList: ['Hedefe göre kişisel yol haritası', 'Dilbilgisi ve kelime oyunları', 'Aralıklı tekrar', 'Seviyeye göre hikâye kütüphanesi'],
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
  if (page === 'contact') graph.push({ '@type': 'FAQPage', mainEntity: [1, 2, 3].map(n => ({ '@type': 'Question', name: strip(S['fq' + n][i]),
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
  <a class="logo" href="${url(l, 'home')}" aria-label="FE School"><img src="/assets/app-icon.png" alt="" width="38" height="38"><span class="wm" dir="ltr">FE<i>School</i></span></a>
  <nav class="main" aria-label="${S.menu[i]}">
    ${nav}
  </nav>
  <nav class="langs" aria-label="${S.langLabel[i]}">${langs}</nav>
  <a class="btn btn-orange btn-sm" data-loc="nav" href="${APP}" ${ext}>${S.openApp[i]}</a>
</div></header>
<main id="main">`;
}

function footer(l) {
  const i = LANGS[l].i, tr = l === 'tr' ? '' : ' hreflang="tr"';
  const guide = l === 'tr' ? `<div><h4>${S.fcGuide[i]}</h4>
      <a href="/blog/insan-kaynaklari-ingilizcesi.html">İK İngilizcesi terimleri</a>
      <a href="/blog/ielts-writing-task-2-puanlama.html">IELTS Writing puanlama</a>
      <a href="/blog/online-ingilizce-ozel-ders-fiyatlari.html">Özel ders fiyatları</a>
      <a href="/blog/ingilizce-konusma-pratigi-nasil-yapilir.html">Konuşma pratiği</a>
      <a href="/blog/ingilizce-ogrenme-plani-nasil-olusturulur.html">Öğrenme planı nasıl kurulur?</a>
      <a href="/blog/">${S.blog[i]}</a></div>` : '';
  return `</main>
<footer class="site"><div class="wrap">
  <div class="f-top"><a class="logo" href="${url(l, 'home')}" aria-label="FE School"><img src="/assets/app-icon.png" alt="" width="38" height="38" loading="lazy"><span class="wm" dir="ltr">FE<i>School</i></span></a><span class="tag">${S.tag[i]}</span></div>
  <div class="f-cols">
    <div><h4>${S.fcCourses[i]}</h4>
      <a href="/is-ingilizcesi.html"${tr}>${S.fBiz[i]}</a>
      <a href="/ielts-hazirlik.html"${tr}>${S.fIelts[i]}</a>
      <a href="/english.html"${tr}>${S.fEn[i]}</a>
      <a href="/spanish.html"${tr}>${S.fEs[i]}</a>
      <a href="/german.html"${tr}>${S.fDe[i]}</a>${l === 'tr' ? '' : `\n      <a href="/blog/"${tr}>${S.blog[i]}</a>`}${l === 'fa' ? `\n      <a href="/fa/blog/">وبلاگ فارسی</a>` : ''}</div>
    <div><h4>${S.fcSchool[i]}</h4>
      <a href="${url(l, 'home')}">${S.nav1[i]}</a>
      <a href="${url(l, 'app')}">${S.nav2[i]}</a>
      <a href="${url(l, 'sys')}">${S.nav3[i]}</a>
      <a href="${url(l, 'contact')}">${S.nav4[i]}</a>
      <a href="/studio.html"${tr}>${S.fStudio[i]}</a></div>
    ${guide}
    <div><h4>${S.fcContact[i]}</h4>
      <a data-lead="contact" href="${WA()}" ${ext}>WhatsApp</a>
      <a href="https://www.instagram.com/the_feschool/" ${ext}>Instagram</a>
      <a href="mailto:farinrasuli@gmail.com">${S.fEmail[i]}</a>
      <a href="/gizlilik-politikasi.html"${tr}>${S.fPrivacy[i]}</a></div>
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
  if (live) ctas = `<a class="btn btn-purple" data-lead="private" href="${msg}" ${ext}>${esc(BOOK[i])}</a>`;
  else if (c.notify) ctas = `<a class="btn btn-ghost" data-lead="course" data-course="${c.key}" href="${msg}" ${ext}>${esc(c.cta[i])}</a>`;
  else ctas = `<a class="btn btn-orange" data-loc="course-${c.key}" href="${APP}" ${ext}>${esc(c.cta[i])}</a>` +
    (c.noWa ? '' : `<a class="btn btn-want" data-lead="course" data-course="${c.key}" href="${msg}" ${ext}>${esc(S.want[i])} <span aria-hidden="true">${l === 'fa' ? '←' : '→'}</span></a>`);
  const price = live ? (l === 'fa' ? c.month + '<small>تومان در ماه، از بسته‌ی ۴ جلسه‌ای</small>' : LIVE_PRICE[i]) : c.price[i];
  const PACK = ['Aylık · 50 dk · ayda 4, 8 veya 12 ders · 3 ay peşin: 8 ve 12 derslik paketlerde %20 indirim', 'Monthly · 50 min · 4, 8 or 12 lessons a month · Pay 3 months upfront: 20% off the 8- and 12-lesson packs'];
  const note = (icon, html, cls = '') => `<li${cls ? ` class="${cls}"` : ''}>${ic(icon)}<span>${html}</span></li>`;
  const liveNotes = !live ? '' : l === 'fa'
    ? `<ul class="lnotes">${note('cal', 'ماهانه · جلسه‌ی ۵۰ دقیقه · ۴، ۸ یا ۱۲ جلسه در ماه · ۳ ماه یک‌جا: ۲۰٪ تخفیف (بسته‌ی ۸ و ۱۲)')}${note('users', `هزینه‌ی بسته بین اعضای گروه (۱ تا ۴ نفر) تقسیم می‌شود`)}${note('gift', '<b>هدیه:</b> بعد از پرداخت، یک جلسه‌ی تحلیل رایگان (تعیین سطح و هدف، ساخت نقشه‌ی راهت)، جدا از جلسه‌های بسته', 'g')}</ul>`
    : `<ul class="lnotes">${note('cal', esc(PACK[i]))}${note('gift', ['<b>Hediye:</b> ödemeden sonra ücretsiz bir analiz seansı (seviye tespiti, hedef belirleme, sana özel yol haritası). Paketinin dışında, ek olarak.', '<b>Free:</b> after you pay, an analysis session (level test, goal setting, your personal roadmap). Extra to your pack.'][i], 'g')}</ul>`;
  const more = l === 'tr' && c.more ? `<a class="tlink more" href="${c.more[0]}">${esc(c.more[1])}</a>`
    : l === 'fa' && c.moreFa ? `<a class="tlink more" href="${c.moreFa[0]}">${esc(c.moreFa[1])}</a>` : '';
  /* also = list of [panel anchor or null, name x3, price x3, SALE key]; one row per course, one 'Also' label */
  const alsoRow = also && also.length ? `<div class="also"><b class="al">${esc(S.also[i])}</b>${also.map(a => `<div class="arow"><b>${a[0] ? `<a href="#kurs-${a[0]}">${esc(a[1][i])}</a>` : esc(a[1][i])}</b><span>${esc(SALE_TXT[SALE[a[3]]][i] + ' · ' + a[2][i])}</span></div>`).join('')}</div>` : '';
  return `<div class="course"><h3>${esc(name)}</h3><p class="for">${esc(c.for[i])}</p>
        <ul class="outs">${c.outs.map(o => `<li>${ic('check')}${esc(o[i])}</li>`).join('')}</ul>
        <div class="pricebox"><span class="price">${price}</span><span class="pills">${pills}</span></div>${liveNotes}
        <div class="ctas">${ctas}</div>${more}</div>${alsoRow}`;
}

function home(l) {
  const i = LANGS[l].i;
  const goalCards = Object.entries(GOALS).map(([k, g]) =>
    `<a class="goal" href="#kurs-${k}" data-goal="${k}"${k === 'is' ? ' aria-current="true"' : ''} style="--c:var(${g.c})"><span class="tick">${ic('tick')}</span><span class="art"><img src="/assets/${g.img}.png" alt="" width="128" height="128"></span><span><strong>${S[g.label][i]}</strong><small>${S[g.sub][i]}</small></span></a>`).join('\n        ');
  const panels = Object.entries(GOALS).map(([k, g]) => {
    const lv = g.live ? LIVES[g.live] : null;
    return `<div class="gres${k === 'is' ? ' on' : ''}" id="kurs-${k}" data-goal="${k}">
    <div class="r-head">
      <div class="r-who"><span class="r-badge" style="--c:var(${g.c})"><img src="/assets/${g.img}.png" alt="" width="56" height="56" loading="lazy"></span>
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
  }).join('\n  ');
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
      <span>${ic('gift')}<b style="font-weight:700">${S.f2[i]}</b></span>
      <span>${ic('card')}<b style="font-weight:700">${S.f3[i]}</b></span>
    </div>
  </section>
</div>

<section class="result" id="dersler"><div class="wrap">
  ${panels}
  <div class="freebar">${ic('gift')}<span>${S.freebar[i]}</span><a class="tlink" href="${url(l, 'app')}">${S.seeApp[i]}</a></div>
</div></section>

<div class="wrap">
  <section class="appband">
    <div class="copy">
      <p class="eyebrow">${S.appEb[i]}</p>
      <h2>${S.appH[i]}</h2>
      <ul class="ticks">
        <li><b>${ic('tick')}</b><span>${S.t1[i]}</span></li>
        <li><b>${ic('tick')}</b><span>${S.t2[i]}</span></li>
        <li><b>${ic('tick')}</b><span>${S.t3[i]}</span></li>
      </ul>
      <div class="ctas"><a class="btn btn-purple" data-loc="appband" href="${APP}" ${ext}>${S.startFree[i]}</a><a class="tlink" href="${url(l, 'app')}">${S.explore[i]}</a></div>
    </div>
    <div class="phones" aria-hidden="false">
      <span class="sticker s1" aria-hidden="true">${S.st1[i]}</span>
      <span class="sticker s2" aria-hidden="true">${S.st2[i]}</span>
      <div class="ph"><img src="/assets/app/screen-goals.webp" alt="${esc(ALT.goals[i])}" width="600" height="1298" loading="lazy" decoding="async"></div>
      <div class="ph"><img src="/assets/app/screen-roadmap-b1-kariyer.webp" alt="${esc(ALT.kariyer[i])}" width="600" height="1298" loading="lazy" decoding="async"></div>
      <div class="ph"><img src="/assets/app/screen-game-karar-senin.webp" alt="${esc(ALT.karar[i])}" width="600" height="1298" loading="lazy" decoding="async"></div>
    </div>
  </section>
</div>

<section class="sec" id="ogrenciler"><div class="wrap">
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
    <div class="portrait"><img src="/assets/farin-portrait.jpg" alt="${esc(S.fAlt[i])}" width="200" height="200" loading="lazy"></div>
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
  const fc = (img, alt, col, k, b) => `<figure class="fcard" style="--c:var(${col})"><div class="scr"><img src="/assets/app/${img}.webp" alt="${esc(alt)}" width="600" height="1298" loading="lazy" decoding="async"></div><figcaption><span class="k">${k}</span><b>${b}</b></figcaption></figure>`;
  return `
<section class="phero"><div class="wrap">
  <p class="eyebrow">${S.appEb[i]}</p>
  <h1>${S.apH[i]}</h1>
  <p class="lead">${S.apL[i]}</p>
</div></section>
<div class="wrap">
  <div class="feat" id="nasil">
    ${fc('screen-goals', ALT.goals[i], '--g-career', S.k1[i], S.s1[i])}
    ${fc('screen-roadmap-b1-ielts', ALT.ielts[i], '--purple', S.k2[i], S.b2[i])}
    ${fc('screen-game-karar-senin', ALT.karar[i], '--g-imm', S.k3[i], S.b3[i])}
    ${fc('screen-game-ev-isleri', ALT.ev[i], '--orange-deep', S.k4[i], S.b4[i])}
  </div>
  <div class="cta-row">
    <a class="btn btn-purple" data-loc="app-page" href="${APP}" ${ext}>${S.startFree[i]}</a>
    <span class="muted"><a class="tlink" data-loc="app-page" href="${APK}">${S.andA[i]}</a> · ${S.andB[i]}</span>
  </div>
</div>

<section class="sec" id="oyunlar"><div class="wrap">
  <div class="sec-head c"><p class="eyebrow">${S.gamesEb[i]}</p><h2>${S.gamesH[i]}</h2><p class="lead">${S.gamesL[i]}</p></div>
  <div class="games">
    ${GAMES_SHOWN.map(g => `<figure class="fcard" style="--c:var(${g.c})"><div class="scr"><img src="/assets/app/${g.img}.webp" alt="${esc(ALT.game[i] + g.name[i])}" width="600" height="1298" loading="lazy" decoding="async"></div><figcaption><b>${esc(g.name[i])}</b><p>${esc(g.d[i])}</p></figcaption></figure>`).join('\n    ')}
  </div>
  <div class="gmore"><details><summary>${S.gmore[i]}</summary><ul>
    ${GAMES_MORE.map(([n, d]) => `<li><b>${esc(n[i])}</b>${esc(d[i])}</li>`).join('\n    ')}
  </ul></details></div>
</div></section>

<section class="sec" id="sana-gore" style="padding-top:0"><div class="wrap">
  <div class="sec-head c"><p class="eyebrow">${S.cmpEb[i]}</p><h2>${S.cmpH[i]}</h2><p class="lead">${S.cmpL[i]}</p></div>
  <div class="compare">
    <figure><div class="ph"><img src="/assets/app/screen-roadmap-b1-seyahat.webp" alt="${esc(ALT.seyahat[i])}" width="600" height="1298" loading="lazy" decoding="async"></div><figcaption>${S.cap1[i]}</figcaption></figure>
    <figure><div class="ph"><img src="/assets/app/screen-roadmap-b1-kariyer.webp" alt="${esc(ALT.kariyer[i])}" width="600" height="1298" loading="lazy" decoding="async"></div><figcaption>${S.cap2[i]}</figcaption></figure>
  </div>
  <div class="cta-row"><a class="btn btn-orange" data-loc="personal" href="${APP}" ${ext}>${GOALS.konusma.self.cta[i]}</a></div>
</div></section>

<div class="wrap">
  <div class="premium-strip">
    <span class="p-ico"><svg style="width:30px;height:30px" aria-hidden="true"><use href="#i-star"/></svg></span>
    <div><h2 style="font-size:1.6rem">${S.pmH[i]}</h2><p>${S.pmP[i]}</p></div>
    <a class="btn btn-orange btn-sm" href="${url(l, 'home')}#program">${S.pmBtn[i]}</a>
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
      </div>
    </div>
  </div>
</div>
`;
}

/* ---------------- write ---------------- */
const BODY = { home, app: appPage, sys: sysPage, contact: contactPage };
const css = fs.readFileSync(path.join(HERE, 'fe-base.css'), 'utf8') + fs.readFileSync(path.join(HERE, 'fe-extra.css'), 'utf8');
fs.writeFileSync(path.join(SITE, 'feschool.css'), '/* Generated by site-src/build-pages.mjs from fe-base.css + fe-extra.css. Edit those, then re-run. */\n' + css);
const report = [];
for (const l of Object.keys(LANGS)) {
  for (const p of Object.keys(BODY)) {
    const rel = (LANGS[l].base + (LANGS[l].pages[p] || 'index.html')).replace(/^\//, '');
    const out = path.join(SITE, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, head(l, p) + '\n' + header(l, p) + BODY[p](l) + footer(l));
    const i = LANGS[l].i;
    report.push(`${rel.padEnd(20)} title ${META[p].t[i].length}  desc ${META[p].d[i].length}`);
  }
}
console.log(report.join('\n'));
