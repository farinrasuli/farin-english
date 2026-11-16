/* FEschool group-class offer page (thefeschool.com/class/ + /tr/ /fa/ /es/). Farin 2026-11-16: "when you are making the classes also
   make a document having a design and text that i can offer that course to those students and by my click on whatsapp it would be
   available to send ... show that this mid-private classes are going to be super personal based on the specific goals ... 4-6".
   The English app's admin (Insights › Group classes) links this page from each learner's WhatsApp invite. Everything the page shows
   comes from the link, so there is no database read:
     k  c = course class, l = level class        t  course theme (business, ielts, interview, travel, marketing, sales, ai-internet)
     g  goal (career, exam, everyday, travel, immigration)    lv  level or band (B1, A1-A2, B2-C1)    a  es = a Spanish class
     n  first name    p  their weak spot (grammar, vocab, listening, speaking)    tp  the group's favourite topics, dot-separated
     m  learners matched    w  a = they asked for this course    id  the class id (goes into the WhatsApp reply)
   The language is the folder (/class/ = English, /class/tr/, /class/fa/, /class/es/), or l=. Keep the theme names in step with
   ADMIN_CLASS_THEMES in app/farin-english-app.html. */
(function(){
'use strict';
const Q = new URLSearchParams(location.search);
const LANGS = ['en', 'tr', 'fa', 'es'];
const L = LANGS.indexOf(Q.get('l')) >= 0 ? Q.get('l') : (LANGS.indexOf(document.documentElement.lang) >= 0 ? document.documentElement.lang : 'en');
const WA = '905467615951';
const GOALS = ['career', 'exam', 'everyday', 'travel', 'immigration'];
const GOAL_COLOR = {career:'#CB7D4D', everyday:'#C9978A', exam:'#8B7273', immigration:'#48796B', travel:'#4C6C82'};
const THEME_GOAL = {business:'career', ielts:'exam', interview:'career', travel:'travel', marketing:'career', sales:'career', 'ai-internet':'everyday'};
const PRIOS = ['grammar', 'vocab', 'listening', 'speaking'];

// ---------------------------------------------------------------- words
const THEMES = {
  business:{en:'Business English', tr:'İş İngilizcesi', fa:'انگلیسی تجاری', es:'Inglés de negocios'},
  ielts:{en:'IELTS prep', tr:'IELTS hazırlığı', fa:'آمادگی آیلتس', es:'Preparación para el IELTS'},
  interview:{en:'Job Interview English', tr:'İş görüşmesi İngilizcesi', fa:'انگلیسی مصاحبه‌ی کاری', es:'Inglés para entrevistas de trabajo'},
  travel:{en:'Travel English', tr:'Seyahat İngilizcesi', fa:'انگلیسی سفر', es:'Inglés para viajar'},
  marketing:{en:'Copywriting & Content English', tr:'Metin yazarlığı ve içerik İngilizcesi', fa:'انگلیسی کپی‌رایتینگ و محتوا', es:'Inglés para redacción y contenidos'},
  sales:{en:'Sales & Trade English', tr:'Satış ve ticaret İngilizcesi', fa:'انگلیسی فروش و تجارت', es:'Inglés de ventas y comercio'},
  'ai-internet':{en:'English for AI and the Internet', tr:'Yapay zekâ ve internet İngilizcesi', fa:'انگلیسی برای هوش مصنوعی و اینترنت', es:'Inglés para la IA e internet'}
};
// level-class titles: [ui language][the language they learn][goal]
const GOAL_TITLES = {
  en:{en:{career:'Career English', exam:'Exam English', everyday:'Everyday English', travel:'Travel English', immigration:'English for moving abroad'},
      es:{career:'Career Spanish', exam:'Exam Spanish', everyday:'Everyday Spanish', travel:'Travel Spanish', immigration:'Spanish for moving abroad'}},
  tr:{en:{career:'Kariyer İngilizcesi', exam:'Sınav İngilizcesi', everyday:'Günlük İngilizce', travel:'Seyahat İngilizcesi', immigration:'Yurt dışına taşınanlar için İngilizce'},
      es:{career:'Kariyer İspanyolcası', exam:'Sınav İspanyolcası', everyday:'Günlük İspanyolca', travel:'Seyahat İspanyolcası', immigration:'Yurt dışına taşınanlar için İspanyolca'}},
  fa:{en:{career:'انگلیسی برای کار', exam:'انگلیسی برای آزمون', everyday:'انگلیسی روزمره', travel:'انگلیسی سفر', immigration:'انگلیسی برای مهاجرت'},
      es:{career:'اسپانیایی برای کار', exam:'اسپانیایی برای آزمون', everyday:'اسپانیایی روزمره', travel:'اسپانیایی سفر', immigration:'اسپانیایی برای مهاجرت'}},
  es:{en:{career:'Inglés para el trabajo', exam:'Inglés para exámenes', everyday:'Inglés para el día a día', travel:'Inglés para viajar', immigration:'Inglés para mudarte al extranjero'},
      es:{career:'Español para el trabajo', exam:'Español para exámenes', everyday:'Español para el día a día', travel:'Español para viajar', immigration:'Español para mudarte al extranjero'}}
};
const SUBJ = {en:{en:'English', es:'Spanish'}, tr:{en:'İngilizce', es:'İspanyolca'}, fa:{en:'انگلیسی', es:'اسپانیایی'}, es:{en:'inglés', es:'español'}};
const TOPICS = {
  sport:{en:'Sport', tr:'Spor', fa:'ورزش', es:'Deporte'}, art:{en:'Art & Design', tr:'Sanat ve Tasarım', fa:'هنر و طراحی', es:'Arte y diseño'},
  science:{en:'Science', tr:'Bilim', fa:'علم', es:'Ciencia'}, history:{en:'History', tr:'Tarih', fa:'تاریخ', es:'Historia'},
  technology:{en:'Technology', tr:'Teknoloji', fa:'فناوری', es:'Tecnología'}, music:{en:'Music', tr:'Müzik', fa:'موسیقی', es:'Música'},
  food:{en:'Food & Cooking', tr:'Yemek ve Mutfak', fa:'غذا و آشپزی', es:'Comida y cocina'}, nature:{en:'Nature & Animals', tr:'Doğa ve Hayvanlar', fa:'طبیعت و حیوانات', es:'Naturaleza y animales'},
  movies:{en:'Movies & TV', tr:'Film ve Dizi', fa:'فیلم و سریال', es:'Cine y series'}, business:{en:'Business & Money', tr:'İş ve Para', fa:'کسب‌وکار و پول', es:'Negocios y dinero'}
};
// What we practise: [key][lang] = [[title, line] x4]; key = a course theme, or a goal for a level class.
const PRACTISE = {
  business:{
    en:[['Meetings', 'Give your opinion, agree and disagree politely, and finish what you started saying.'], ['E-mails', 'Write e-mails that are short, clear and professional.'], ['Presenting', 'Present your work and answer questions without panic.'], ['Small talk at work', 'Coffee-break chats that build real relationships.']],
    tr:[['Toplantılar', 'Fikrini söyle, kibarca katıl ya da itiraz et, sözünü sonuna kadar getir.'], ['E-postalar', 'Kısa, net ve profesyonel e-postalar yaz.'], ['Sunum', 'İşini sun, sorulara paniğe kapılmadan cevap ver.'], ['İşte sohbet', 'Gerçek ilişkiler kuran kahve molası sohbetleri.']],
    fa:[['جلسه‌ها', 'نظرت رو بگو، مؤدبانه موافقت یا مخالفت کن و حرفت رو تا آخر بزن.'], ['ایمیل‌ها', 'ایمیل‌هایی بنویس که کوتاه، روشن و حرفه‌ای باشن.'], ['ارائه', 'کارت رو ارائه بده و بدون استرس به سؤال‌ها جواب بده.'], ['گپ‌های محیط کار', 'گپ‌های کوتاه وقت استراحت که رابطه‌ی واقعی می‌سازن.']],
    es:[['Reuniones', 'Da tu opinión, muestra acuerdo o desacuerdo con educación y termina lo que empezaste a decir.'], ['Correos', 'Escribe correos breves, claros y profesionales.'], ['Presentaciones', 'Presenta tu trabajo y responde preguntas sin pánico.'], ['Charlas en el trabajo', 'Conversaciones en la pausa del café que crean relaciones de verdad.']]},
  ielts:{
    en:[['Speaking, parts 1–3', 'Live, with feedback on the exam criteria after every answer.'], ['A writing task every week', 'With feedback on what lifts your band.'], ['A timed mock every month', 'So exam day feels like any other day.'], ['Exam techniques', 'Paraphrasing, timing, and what examiners look for.']],
    tr:[['Speaking, 1–3. bölümler', 'Canlı; her cevaptan sonra sınav kriterlerine göre geri bildirimle.'], ['Her hafta bir writing görevi', 'Puanını neyin yükselteceğini gösteren geri bildirimle.'], ['Her ay süreli bir deneme', 'Sınav günü sıradan bir gün gibi gelsin diye.'], ['Sınav teknikleri', 'Paraphrase, zaman yönetimi ve değerlendiricilerin aradıkları.']],
    fa:[['اسپیکینگ، بخش‌های ۱ تا ۳', 'زنده، با بازخورد بر اساس معیارهای آزمون بعد از هر جواب.'], ['هر هفته یه تسک رایتینگ', 'با بازخوردی که نشون می‌ده چی نمره‌ت رو بالا می‌بره.'], ['هر ماه یه آزمون آزمایشی زمان‌دار', 'تا روز آزمون برات مثل یه روز عادی باشه.'], ['تکنیک‌های آزمون', 'پارافریز، مدیریت زمان و چیزهایی که ممتحن دنبالشه.']],
    es:[['Speaking, partes 1–3', 'En vivo, con comentarios según los criterios del examen después de cada respuesta.'], ['Una tarea de writing cada semana', 'Con comentarios sobre lo que sube tu nota.'], ['Un simulacro cronometrado al mes', 'Para que el día del examen sea un día más.'], ['Técnicas de examen', 'Parafrasear, gestionar el tiempo y lo que buscan los examinadores.']]},
  interview:{
    en:[['“Tell me about yourself”', 'A 60-second answer you\'ll be proud of.'], ['Strengths and weaknesses', 'Honest answers that still sell you.'], ['Salary talk', 'Ask for what you\'re worth, calmly.'], ['Mock interviews in pairs', 'Real questions, real nerves, real feedback.']],
    tr:[['“Bize kendinden bahset”', 'Gurur duyacağın 60 saniyelik bir cevap.'], ['Güçlü ve zayıf yönler', 'Dürüst ama seni yine de öne çıkaran cevaplar.'], ['Maaş konuşması', 'Hak ettiğini sakin bir şekilde iste.'], ['İkili deneme mülakatları', 'Gerçek sorular, gerçek heyecan, gerçek geri bildirim.']],
    fa:[['«از خودت بگو»', 'یه جواب ۶۰ ثانیه‌ای که بهش افتخار کنی.'], ['نقاط قوت و ضعف', 'جواب‌های صادقانه که باز هم تو رو خوب معرفی می‌کنن.'], ['صحبت درباره‌ی حقوق', 'با آرامش چیزی رو که حقته بخواه.'], ['مصاحبه‌ی تمرینی دونفره', 'سؤال واقعی، استرس واقعی، بازخورد واقعی.']],
    es:[['«Háblame de ti»', 'Una respuesta de 60 segundos que te dé orgullo.'], ['Fortalezas y debilidades', 'Respuestas sinceras que aun así te venden bien.'], ['Hablar de salario', 'Pide lo que vales, con calma.'], ['Entrevistas de práctica en parejas', 'Preguntas reales, nervios reales, comentarios reales.']]},
  travel:{
    en:[['Airport and hotel', 'Check-in, delays, room problems: sorted.'], ['Directions and transport', 'Ask, understand the answer, get there.'], ['Ordering food', 'Menus, allergies, the bill and a little chat.'], ['Fixing small problems', 'A lost bag, a wrong order, a polite complaint.']],
    tr:[['Havalimanı ve otel', 'Check-in, rötarlar, oda sorunları: hepsi çözülür.'], ['Yol tarifi ve ulaşım', 'Sor, cevabı anla, yerine var.'], ['Yemek siparişi', 'Menü, alerjiler, hesap ve biraz sohbet.'], ['Küçük sorunları çözmek', 'Kayıp bavul, yanlış sipariş, kibar bir şikâyet.']],
    fa:[['فرودگاه و هتل', 'چک‌این، تأخیر پرواز، مشکل اتاق: همه حل می‌شه.'], ['آدرس پرسیدن و رفت‌وآمد', 'بپرس، جواب رو بفهم و برس به مقصد.'], ['سفارش غذا', 'منو، حساسیت غذایی، صورت‌حساب و یه گپ کوچیک.'], ['حل مشکل‌های کوچیک', 'چمدون گم‌شده، سفارش اشتباه، یه اعتراض مؤدبانه.']],
    es:[['Aeropuerto y hotel', 'Check-in, retrasos, problemas con la habitación: resueltos.'], ['Direcciones y transporte', 'Pregunta, entiende la respuesta y llega.'], ['Pedir comida', 'La carta, alergias, la cuenta y una pequeña charla.'], ['Resolver pequeños problemas', 'Una maleta perdida, un pedido equivocado, una queja con educación.']]},
  marketing:{
    en:[['Posts and captions', 'First lines that stop the scroll, in natural English.'], ['Ads', 'Short lines that sell without sounding pushy.'], ['Product pages', 'Clear, persuasive descriptions.'], ['Live feedback', 'We edit each other\'s writing in class.']],
    tr:[['Gönderiler ve açıklamalar', 'Akışı durduran ilk cümleler, doğal İngilizceyle.'], ['Reklamlar', 'Israrcı görünmeden satan kısa cümleler.'], ['Ürün sayfaları', 'Net ve ikna edici açıklamalar.'], ['Canlı geri bildirim', 'Derste birbirimizin metinlerini düzenliyoruz.']],
    fa:[['پست و کپشن', 'جمله‌های اولی که اسکرول رو متوقف می‌کنن، با انگلیسی طبیعی.'], ['تبلیغ', 'جمله‌های کوتاهی که می‌فروشن، بدون اینکه زورکی به نظر برسن.'], ['صفحه‌ی محصول', 'توضیح‌های روشن و قانع‌کننده.'], ['بازخورد زنده', 'سر کلاس متن‌های همدیگه رو ویرایش می‌کنیم.']],
    es:[['Posts y captions', 'Primeras frases que frenan el scroll, en un inglés natural.'], ['Anuncios', 'Frases cortas que venden sin sonar insistentes.'], ['Páginas de producto', 'Descripciones claras y persuasivas.'], ['Comentarios en vivo', 'En clase editamos los textos de los demás.']]},
  sales:{
    en:[['The pitch', 'Explain your product in 30 seconds.'], ['Negotiating', 'Price, terms, and saying no politely.'], ['Sales calls', 'Role-plays with real objections.'], ['Trade e-mails', 'Quotes, follow-ups and closing the deal.']],
    tr:[['Satış konuşması', 'Ürününü 30 saniyede anlat.'], ['Pazarlık', 'Fiyat, koşullar ve kibarca hayır demek.'], ['Satış görüşmeleri', 'Gerçek itirazlarla canlandırmalar.'], ['Ticari e-postalar', 'Teklifler, takip mesajları ve anlaşmayı kapatmak.']],
    fa:[['معرفی محصول', 'محصولت رو توی ۳۰ ثانیه معرفی کن.'], ['مذاکره', 'قیمت، شرایط و «نه» گفتنِ مؤدبانه.'], ['تماس فروش', 'نقش‌آفرینی با اعتراض‌های واقعی مشتری.'], ['ایمیل‌های تجاری', 'پیش‌فاکتور، پیگیری و بستن قرارداد.']],
    es:[['El pitch', 'Explica tu producto en 30 segundos.'], ['Negociar', 'Precio, condiciones y decir que no con educación.'], ['Llamadas de venta', 'Role-plays con objeciones reales.'], ['Correos comerciales', 'Presupuestos, seguimientos y cerrar el trato.']]},
  'ai-internet':{
    en:[['Prompting in English', 'Get better answers from AI tools.'], ['Tech news', 'Read and discuss what\'s happening in AI.'], ['AI tools, hands-on', 'Use them live in class, in English.'], ['Talking tech', 'Explain what you use or build, simply.']],
    tr:[['İngilizce prompt yazmak', 'Yapay zekâ araçlarından daha iyi cevaplar al.'], ['Teknoloji haberleri', 'Yapay zekâda olanları oku ve tartış.'], ['Uygulamalı yapay zekâ araçları', 'Derste, canlı ve İngilizce kullan.'], ['Teknoloji hakkında konuşmak', 'Kullandığın ya da yaptığın şeyi basitçe anlat.']],
    fa:[['پرامپت‌نویسی به انگلیسی', 'از ابزارهای هوش مصنوعی جواب‌های بهتری بگیر.'], ['اخبار تکنولوژی', 'خبرهای هوش مصنوعی رو بخون و درباره‌شون حرف بزن.'], ['کار عملی با ابزارهای هوش مصنوعی', 'سر کلاس، زنده و به انگلیسی.'], ['حرف زدن درباره‌ی تکنولوژی', 'چیزی رو که استفاده می‌کنی یا می‌سازی ساده توضیح بده.']],
    es:[['Prompts en inglés', 'Consigue mejores respuestas de las herramientas de IA.'], ['Noticias de tecnología', 'Lee y comenta lo que pasa en la IA.'], ['Herramientas de IA, en la práctica', 'Úsalas en vivo en clase, en inglés.'], ['Hablar de tecnología', 'Explica de forma sencilla lo que usas o creas.']]},
  career:{
    en:[['Talking about your job', 'What you do, clearly and with confidence.'], ['Meetings', 'Give your opinion and be understood.'], ['E-mails and messages', 'Short, polite, professional.'], ['Small talk at work', 'Easy chats with colleagues and clients.']],
    tr:[['İşini anlatmak', 'Ne yaptığını net ve özgüvenle anlat.'], ['Toplantılar', 'Fikrini söyle ve anlaşıl.'], ['E-postalar ve mesajlar', 'Kısa, kibar, profesyonel.'], ['İşte sohbet', 'İş arkadaşları ve müşterilerle rahat sohbetler.']],
    fa:[['حرف زدن درباره‌ی کارت', 'کاری رو که می‌کنی روشن و با اعتمادبه‌نفس توضیح بده.'], ['جلسه‌ها', 'نظرت رو بگو و منظورت رو برسون.'], ['ایمیل و پیام', 'کوتاه، مؤدب، حرفه‌ای.'], ['گپ‌های محیط کار', 'گپ راحت با همکارها و مشتری‌ها.']],
    es:[['Hablar de tu trabajo', 'Qué haces, con claridad y confianza.'], ['Reuniones', 'Da tu opinión y que te entiendan.'], ['Correos y mensajes', 'Breves, educados, profesionales.'], ['Charlas en el trabajo', 'Conversaciones fáciles con colegas y clientes.']]},
  exam:{
    en:[['Speaking tasks', 'Live practice with feedback after every answer.'], ['Writing tasks', 'With feedback on what lifts your score.'], ['Exam strategies', 'Timing, structure, and what examiners look for.'], ['Mock tests', 'So exam day feels familiar.']],
    tr:[['Konuşma görevleri', 'Her cevaptan sonra geri bildirimle canlı pratik.'], ['Yazma görevleri', 'Puanını neyin yükselteceğini gösteren geri bildirimle.'], ['Sınav stratejileri', 'Zaman, yapı ve değerlendiricilerin aradıkları.'], ['Deneme sınavları', 'Sınav günü sana tanıdık gelsin diye.']],
    fa:[['تسک‌های اسپیکینگ', 'تمرین زنده با بازخورد بعد از هر جواب.'], ['تسک‌های رایتینگ', 'با بازخوردی که نشون می‌ده چی نمره‌ت رو بالا می‌بره.'], ['استراتژی‌های آزمون', 'زمان، ساختار و چیزهایی که ممتحن دنبالشه.'], ['آزمون آزمایشی', 'تا روز آزمون همه‌چیز برات آشنا باشه.']],
    es:[['Tareas orales', 'Práctica en vivo con comentarios después de cada respuesta.'], ['Tareas escritas', 'Con comentarios sobre lo que sube tu nota.'], ['Estrategias de examen', 'Tiempo, estructura y lo que buscan los examinadores.'], ['Simulacros', 'Para que el día del examen te resulte familiar.']]},
  everyday:{
    en:[['A new topic every week', 'Picked from what your group loves.'], ['Real conversations', 'Opinions, stories, jokes: the way people really talk.'], ['Words you\'ll actually use', 'Taken from the conversation, not from a list.'], ['Confidence', 'Speak first, translate less.']],
    tr:[['Her hafta yeni bir konu', 'Grubunun sevdiği konulardan seçilir.'], ['Gerçek sohbetler', 'Fikirler, hikâyeler, şakalar: insanların gerçekten konuştuğu gibi.'], ['Gerçekten kullanacağın kelimeler', 'Listeden değil, sohbetin içinden.'], ['Özgüven', 'Önce konuş, daha az çevir.']],
    fa:[['هر هفته یه موضوع تازه', 'از بین چیزهایی که گروهت دوست داره.'], ['مکالمه‌ی واقعی', 'نظر، قصه، شوخی؛ همون‌طور که آدم‌ها واقعاً حرف می‌زنن.'], ['کلمه‌هایی که واقعاً به کارت میان', 'از دل همون مکالمه، نه از یه لیست.'], ['اعتمادبه‌نفس', 'اول حرف بزن، کمتر ترجمه کن.']],
    es:[['Un tema nuevo cada semana', 'Elegido entre lo que le encanta a tu grupo.'], ['Conversaciones reales', 'Opiniones, historias, bromas: como habla la gente de verdad.'], ['Palabras que de verdad usarás', 'Salen de la conversación, no de una lista.'], ['Confianza', 'Habla primero, traduce menos.']]},
  immigration:{
    en:[['Phone calls and appointments', 'Doctors, banks, offices, without the stress.'], ['Forms and documents', 'Understand them, fill them in, ask about them.'], ['Renting a home', 'Viewings, contracts, talking to landlords.'], ['Your first weeks', 'Neighbours, shops, new colleagues.']],
    tr:[['Telefon görüşmeleri ve randevular', 'Doktor, banka, resmî daireler: stressiz.'], ['Formlar ve belgeler', 'Anla, doldur, sorularını sor.'], ['Ev kiralamak', 'Ev gezmek, sözleşmeler, ev sahibiyle konuşmak.'], ['İlk haftaların', 'Komşular, alışveriş, yeni iş arkadaşları.']],
    fa:[['تماس تلفنی و وقت گرفتن', 'دکتر، بانک، اداره؛ بدون استرس.'], ['فرم‌ها و مدارک', 'بفهمشون، پرشون کن و درباره‌شون سؤال بپرس.'], ['اجاره‌ی خونه', 'بازدید، قرارداد و حرف زدن با صاحبخونه.'], ['هفته‌های اول', 'همسایه‌ها، خرید، همکارهای جدید.']],
    es:[['Llamadas y citas', 'Médicos, bancos, oficinas, sin estrés.'], ['Formularios y documentos', 'Entiéndelos, rellénalos y pregunta por ellos.'], ['Alquilar una casa', 'Visitas, contratos y hablar con el casero.'], ['Tus primeras semanas', 'Vecinos, tiendas, compañeros nuevos.']]}
};
// The page text. {lv} level, {S} the language they learn, {m} matched, {n} name, {cls} class name.
const T = {
  en:{
    pill:'Mid-private · 4–6 people', hello:'{n}, this one\'s for you', helloNo:'A small class, built around you', lvl:'Level',
    lead:'Only 4 to 6 people, and all of you share the same goal. Small enough that every class is built around you.',
    tiles:[['4–6', 'people, never more'], ['{lv}', 'everyone at your level'], ['Live', 'online, face to face']],
    whyEb:'Why you', whyH:'Matched by your goal',
    why:'You\'re at {lv} and {reason}. So I looked for learners who want exactly the same thing, and put you in one group.',
    reason:{career:'you want {S} for your career', exam:'you\'re preparing for an exam', everyday:'you want {S} for everyday life', travel:'you want {S} for travel', immigration:'you\'re planning a move abroad', asked:'you asked me about {cls}'},
    saidLabel:'You told us',
    said:{speaking:'I freeze up when I need to speak', listening:'Native speakers talk too fast', vocab:'I don\'t know enough words', grammar:'Grammar rules trip me up'},
    fix:{speaking:'With only 4–6 people you speak in every round, in a friendly room, until it feels normal.', listening:'We train your ear with real audio from your goal, step by step, until fast speech makes sense.', vocab:'You leave every class with the exact words your goal needs, and you use them straight away.', grammar:'I correct you live, kindly, one mistake at a time, so the rules finally stick.'},
    midEb:'Mid-private', midH:'Not a crowd. Not alone.', best:'Your class',
    rooms:[['A big class', ['20+ people', 'You speak for a few minutes', 'One plan for everyone']], ['Private lessons', ['Just you', 'Costs the most', 'Nobody to practise with']], ['FEschool mid-private', ['4–6 people', 'You speak again and again', 'Planned around your goals']]],
    pracEb:'What we\'ll practise', pracH:'Real moments from your goal',
    howEb:'How it works', howH:'Every class starts with you',
    how:[['Your goal first', 'Before we start, I ask each of you what exactly you need {S} for. The plan comes from your answers.'], ['Your real situations', 'We practise the moments you will really face, not textbook dialogues.'], ['Your mistakes, fixed live', 'In a group this small I hear everyone. You get corrected by name, kindly, right there.'], ['The app in between', 'Your FEschool roadmap keeps you practising between classes.']],
    grpEb:'Your group', grpH:'{m} matched, 6 seats', grpHNo:'Only 6 seats',
    grp:'I matched {m} learners with your level and goal. The class takes 6 at most, and seats go in the order people say yes.',
    grpNo:'The class takes 6 at most, and seats go in the order people say yes.',
    matched:'matched', seats:'seats', you:'You?', loves:'Your group loves', lovesP:'So that\'s what we\'ll talk about.',
    timeH:'We pick the time together', time:'Tell me which days and times suit you. The group meets when most of you can.',
    note:'I\'ll build this class around you.', role:'Your teacher at FEschool',
    cta:'I\'m in, save my seat', ask:'Ask me something first',
    waYes:'Hi Farin! I\'m in for the {cls} group class 🙌', waAsk:'Hi Farin! I have a question about the {cls} group class: ',
    title:'{cls} · small group class · FEschool'},
  tr:{
    pill:'Yarı özel · 4–6 kişi', hello:'{n}, bu sınıf senin için', helloNo:'Senin etrafında kurulan küçük bir sınıf', lvl:'Seviye',
    lead:'Sadece 4–6 kişi ve hepiniz aynı hedefi paylaşıyorsunuz. Her ders senin etrafında kurulacak kadar küçük.',
    tiles:[['4–6', 'kişi, asla fazlası değil'], ['{lv}', 'herkes senin seviyende'], ['Canlı', 'online, yüz yüze']],
    whyEb:'Neden sen', whyH:'Hedefine göre eşleştin',
    why:'Seviyen {lv} ve {reason}. Ben de tam olarak aynı şeyi isteyen öğrencileri aradım ve sizi aynı gruba koydum.',
    reason:{career:'kariyerin için {S} öğrenmek istiyorsun', exam:'bir sınava hazırlanıyorsun', everyday:'günlük hayatta {S} konuşmak istiyorsun', travel:'seyahatlerinde {S} konuşmak istiyorsun', immigration:'yurt dışına taşınmayı planlıyorsun', asked:'bana {cls} hakkında sordun'},
    saidLabel:'Bize şunu söyledin',
    said:{speaking:'Konuşmam gerektiğinde donup kalıyorum', listening:'Anadili İngilizce olanlar çok hızlı konuşuyor', vocab:'Yeterince kelime bilmiyorum', grammar:'Dilbilgisi kuralları kafamı karıştırıyor'},
    fix:{speaking:'Sadece 4–6 kişiyle her turda konuşursun; samimi bir ortamda, doğal gelene kadar.', listening:'Hedefinden gerçek seslerle kulağını adım adım eğitiriz; hızlı konuşma anlam kazanana kadar.', vocab:'Her dersten hedefinin ihtiyaç duyduğu kelimelerle çıkarsın ve onları hemen kullanırsın.', grammar:'Seni canlı, nazikçe ve her seferinde tek bir hatayla düzeltirim; böylece kurallar sonunda yerine oturur.'},
    midEb:'Yarı özel', midH:'Ne kalabalık ne yalnız.', best:'Senin sınıfın',
    rooms:[['Kalabalık sınıf', ['20+ kişi', 'Birkaç dakika konuşursun', 'Herkese tek bir plan']], ['Özel ders', ['Sadece sen', 'En pahalısı', 'Pratik yapacak kimse yok']], ['FEschool yarı özel', ['4–6 kişi', 'Tekrar tekrar konuşursun', 'Hedeflerine göre planlanır']]],
    pracEb:'Ne çalışacağız', pracH:'Hedefinden gerçek anlar',
    howEb:'Nasıl işliyor', howH:'Her ders seninle başlar',
    how:[['Önce senin hedefin', 'Başlamadan önce her birinize {S} ile tam olarak ne yapmak istediğinizi soruyorum. Plan sizin cevaplarınızdan çıkıyor.'], ['Senin gerçek durumların', 'Ders kitabı diyaloglarını değil, gerçekten karşılaşacağın anları çalışıyoruz.'], ['Hataların, anında düzeltilir', 'Bu kadar küçük bir grupta herkesi duyuyorum. Adınla, nazikçe, o anda düzeltilirsin.'], ['Aralarda uygulama', 'FEschool yol haritan, dersler arasında da pratik yapmanı sağlar.']],
    grpEb:'Grubun', grpH:'{m} eşleşme, 6 yer', grpHNo:'Sadece 6 yer',
    grp:'Seviyen ve hedefinle {m} öğrenciyi eşleştirdim. Sınıf en fazla 6 kişilik ve yerler “evet” diyenlere sırayla veriliyor.',
    grpNo:'Sınıf en fazla 6 kişilik ve yerler “evet” diyenlere sırayla veriliyor.',
    matched:'eşleşme', seats:'yer', you:'Sen?', loves:'Grubunun sevdiği konular', lovesP:'Biz de bunlar hakkında konuşacağız.',
    timeH:'Saati birlikte seçiyoruz', time:'Sana uyan gün ve saatleri söyle. Grup, çoğunuzun uygun olduğu saatte buluşur.',
    note:'Bu sınıfı senin etrafında kuracağım.', role:'FEschool\'daki öğretmenin',
    cta:'Varım, yerimi ayır', ask:'Önce bir şey sormak istiyorum',
    waYes:'Merhaba Farin! {cls} mini grubuna varım 🙌', waAsk:'Merhaba Farin! {cls} mini grubu hakkında bir sorum var: ',
    title:'{cls} · mini grup dersi · FEschool'},
  fa:{
    pill:'نیمه‌خصوصی · ۴ تا ۶ نفر', hello:'{n} جان، این کلاس مال توئه', helloNo:'یه کلاس کوچیک که دور تو ساخته می‌شه', lvl:'سطح',
    lead:'فقط ۴ تا ۶ نفر، و همه‌تون یه هدف دارین. اون‌قدر کوچیک که هر جلسه دور هدف تو ساخته می‌شه.',
    tiles:[['۴–۶', 'نفر، نه بیشتر'], ['{lv}', 'همه هم‌سطح تو'], ['زنده', 'آنلاین، رودررو']],
    whyEb:'چرا تو', whyH:'بر اساس هدفت انتخاب شدی',
    why:'تو سطح {lv} هستی و {reason}. برای همین دنبال زبان‌آموزهایی گشتم که دقیقاً همینو می‌خوان و همه‌تون رو توی یه گروه گذاشتم.',
    reason:{career:'برای کارت به {S} نیاز داری', exam:'داری برای یه آزمون آماده می‌شی', everyday:'می‌خوای توی زندگی روزمره {S} حرف بزنی', travel:'می‌خوای توی سفرهات {S} حرف بزنی', immigration:'داری برای مهاجرت برنامه‌ریزی می‌کنی', asked:'درباره‌ی «{cls}» ازم پرسیده بودی'},
    saidLabel:'خودت گفتی',
    said:{speaking:'وقتی باید صحبت کنم یخ می‌زنم', listening:'انگلیسی‌زبان‌های بومی خیلی سریع صحبت می‌کنند', vocab:'کلمات کافی بلد نیستم', grammar:'قواعد گرامری گیجم می‌کنند'},
    fix:{speaking:'با فقط ۴ تا ۶ نفر، توی هر دور حرف می‌زنی؛ توی یه فضای دوستانه، تا وقتی که برات عادی بشه.', listening:'گوشت رو با صداهای واقعی از هدف خودت قدم‌به‌قدم تمرین می‌دیم، تا حرف‌های سریع رو هم بفهمی.', vocab:'از هر جلسه با همون کلمه‌هایی بیرون میای که هدفت لازم داره، و همون موقع ازشون استفاده می‌کنی.', grammar:'همون لحظه و با مهربونی اصلاحت می‌کنم، هر بار فقط یه اشتباه، تا قاعده‌ها بالاخره توی ذهنت بشینن.'},
    midEb:'نیمه‌خصوصی', midH:'نه شلوغ، نه تنها.', best:'کلاس تو',
    rooms:[['کلاس شلوغ', ['بیشتر از ۲۰ نفر', 'فقط چند دقیقه حرف می‌زنی', 'یه برنامه برای همه']], ['کلاس خصوصی', ['فقط خودت', 'گرون‌ترین گزینه', 'کسی نیست باهاش تمرین کنی']], ['نیمه‌خصوصی FEschool', ['۴ تا ۶ نفر', 'بارها و بارها حرف می‌زنی', 'برنامه بر اساس هدف‌های تو']]],
    pracEb:'چی تمرین می‌کنیم', pracH:'لحظه‌های واقعی از هدف تو',
    howEb:'چطور پیش می‌ریم', howH:'هر جلسه با تو شروع می‌شه',
    how:[['اول هدف تو', 'قبل از شروع، از تک‌تکتون می‌پرسم دقیقاً برای چی {S} می‌خواین. برنامه از جواب‌های خودتون درمیاد.'], ['موقعیت‌های واقعی خودت', 'به‌جای دیالوگ‌های کتابی، همون لحظه‌هایی رو تمرین می‌کنیم که واقعاً برات پیش میان.'], ['اشتباه‌هات، همون لحظه درست می‌شن', 'توی گروهی به این کوچیکی صدای همه رو می‌شنوم. با اسم خودت، با مهربونی و همون لحظه اصلاح می‌شی.'], ['اپ، بین جلسه‌ها', 'نقشه‌ی راهت توی اپ FEschool بین جلسه‌ها هم تمرینت رو ادامه می‌ده.']],
    grpEb:'گروه تو', grpH:'{m} نفر پیدا شدن، ۶ صندلی', grpHNo:'فقط ۶ صندلی',
    grp:'{m} زبان‌آموز با سطح و هدف تو پیدا کردم. کلاس حداکثر ۶ نفره‌ست و جاها به ترتیبِ کسایی که «هستم» می‌گن پر می‌شه.',
    grpNo:'کلاس حداکثر ۶ نفره‌ست و جاها به ترتیبِ کسایی که «هستم» می‌گن پر می‌شه.',
    matched:'نفر پیدا شدن', seats:'صندلی', you:'تو؟', loves:'گروهت عاشق اینهاست', lovesP:'پس درباره‌ی همینا حرف می‌زنیم.',
    timeH:'زمان کلاس رو با هم انتخاب می‌کنیم', time:'بهم بگو چه روزها و ساعت‌هایی برات مناسبه. گروه وقتی کلاس داره که برای بیشترتون جور باشه.',
    note:'این کلاس رو دور هدف تو می‌سازم.', role:'معلمت در FEschool',
    cta:'هستم، جام رو نگه دار', ask:'اول یه سؤال دارم',
    waYes:'سلام فرین! برای کلاس گروهی «{cls}» هستم 🙌', waAsk:'سلام فرین! درباره‌ی کلاس گروهی «{cls}» یه سؤال دارم: ',
    title:'{cls} · کلاس گروهی کوچک · FEschool'},
  es:{
    pill:'Semiprivada · 4–6 personas', hello:'{n}, esta clase es para ti', helloNo:'Una clase pequeña, hecha a tu medida', lvl:'Nivel',
    lead:'Solo de 4 a 6 personas, y todas comparten tu objetivo. Tan pequeña que cada clase se construye en torno a ti.',
    tiles:[['4–6', 'personas, nunca más'], ['{lv}', 'todos con tu nivel'], ['En vivo', 'online, cara a cara']],
    whyEb:'Por qué tú', whyH:'Elegido por tu objetivo',
    why:'Tienes nivel {lv} y {reason}. Así que busqué estudiantes que quieren exactamente lo mismo y te puse en el mismo grupo.',
    reason:{career:'quieres {S} para tu carrera', exam:'te estás preparando para un examen', everyday:'quieres {S} para el día a día', travel:'quieres {S} para viajar', immigration:'estás pensando en mudarte al extranjero', asked:'me preguntaste por {cls}'},
    saidLabel:'Nos dijiste',
    said:{speaking:'Me bloqueo cuando tengo que hablar', listening:'Los nativos hablan demasiado rápido', vocab:'No sé suficientes palabras', grammar:'Las reglas de gramática me confunden'},
    fix:{speaking:'Con solo 4–6 personas hablas en cada ronda, en un ambiente amable, hasta que te salga natural.', listening:'Entrenamos tu oído con audio real de tu objetivo, paso a paso, hasta que entiendas el habla rápida.', vocab:'Sales de cada clase con las palabras exactas que necesita tu objetivo, y las usas enseguida.', grammar:'Te corrijo en vivo, con cariño, un error cada vez, para que por fin se te queden las reglas.'},
    midEb:'Semiprivada', midH:'Ni una multitud, ni a solas.', best:'Tu clase',
    rooms:[['Una clase grande', ['Más de 20 personas', 'Hablas unos pocos minutos', 'Un mismo plan para todos']], ['Clases particulares', ['Solo tú', 'Lo más caro', 'Nadie con quien practicar']], ['Semiprivada FEschool', ['4–6 personas', 'Hablas una y otra vez', 'Planificada según tus objetivos']]],
    pracEb:'Qué practicaremos', pracH:'Momentos reales de tu objetivo',
    howEb:'Cómo funciona', howH:'Cada clase empieza por ti',
    how:[['Primero, tu objetivo', 'Antes de empezar, le pregunto a cada persona para qué necesita exactamente el {S}. El plan sale de sus respuestas.'], ['Tus situaciones reales', 'Practicamos los momentos que de verdad vas a vivir, no diálogos de libro.'], ['Tus errores, corregidos al momento', 'En un grupo tan pequeño oigo a todos. Te corrijo por tu nombre, con amabilidad, en el momento.'], ['La app entre clases', 'Tu ruta en la app de FEschool te mantiene practicando entre clases.']],
    grpEb:'Tu grupo', grpH:'{m} coincidencias, 6 plazas', grpHNo:'Solo 6 plazas',
    grp:'Encontré {m} estudiantes con tu nivel y tu objetivo. La clase tiene 6 plazas como máximo, y se asignan por orden de respuesta.',
    grpNo:'La clase tiene 6 plazas como máximo, y se asignan por orden de respuesta.',
    matched:'coincidencias', seats:'plazas', you:'¿Tú?', loves:'A tu grupo le encanta', lovesP:'Así que de eso hablaremos.',
    timeH:'Elegimos el horario juntos', time:'Dime qué días y horas te vienen bien. El grupo se reúne cuando la mayoría puede.',
    note:'Voy a construir esta clase en torno a ti.', role:'Tu profesor en FEschool',
    cta:'Me apunto, guárdame plaza', ask:'Antes quiero preguntar algo',
    waYes:'¡Hola, Farin! Me apunto a la clase en grupo de {cls} 🙌', waAsk:'¡Hola, Farin! Tengo una pregunta sobre la clase en grupo de {cls}: ',
    title:'{cls} · clase en grupo pequeño · FEschool'}
};

// ---------------------------------------------------------------- the link
const kindIn = Q.get('k') === 'c' && THEMES[Q.get('t')] ? 'course' : 'level';
const theme = kindIn === 'course' ? Q.get('t') : '';
const goal = GOALS.indexOf(Q.get('g')) >= 0 ? Q.get('g') : (theme ? THEME_GOAL[theme] : 'everyday');
const lvRaw = String(Q.get('lv') || '').toUpperCase().replace(/[–—]/g, '-');
const lv = /^[ABC][12](-[ABC][12])?$/.test(lvRaw) ? lvRaw.replace('-', '–') : '';
const subj = Q.get('a') === 'es' && kindIn === 'level' ? 'es' : 'en';
const name = String(Q.get('n') || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 30);
const prio = subj === 'en' && PRIOS.indexOf(Q.get('p')) >= 0 ? Q.get('p') : '';
const topics = String(Q.get('tp') || '').split('.').filter((x, i, a)=>TOPICS[x] && a.indexOf(x) === i).slice(0, 3);
const mNum = Math.min(999, Math.max(0, parseInt(Q.get('m'), 10) || 0));
const asked = Q.get('w') === 'a' && kindIn === 'course';
const cid = String(Q.get('id') || '').replace(/[^a-z0-9]/gi, '').slice(0, 20);

const W = T[L];
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const num = s=>L === 'fa' ? String(s).replace(/[0-9]/g, d=>FA_DIGITS[d]) : String(s);
const esc = s=>String(s).replace(/[&<>"']/g, c=>({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);
const clsName = kindIn === 'course' ? THEMES[theme][L] : GOAL_TITLES[L][subj][goal];
const S = SUBJ[L][subj];
// One piece of text: escaped, Persian digits in fa, then the {placeholders} (a level code stays Latin, isolated for RTL).
function fill(str, extra){
  const v = Object.assign({lv:lv ? '<bdi dir="ltr">' + esc(lv) + '</bdi>' : '', S:esc(S), m:esc(num(mNum)), n:'<bdi>' + esc(name) + '</bdi>', cls:esc(L === 'es' ? clsName.charAt(0).toLowerCase() + clsName.slice(1) : clsName)}, extra || {});
  return esc(num(str)).replace(/\{(\w+)\}/g, (all, k)=>v[k] != null ? v[k] : all);
}
const plain = (str, extra)=>{ const d = document.createElement('div'); d.innerHTML = fill(str, extra); return d.textContent; };
const waLink = text=>'https://wa.me/' + WA + '?text=' + encodeURIComponent(text + (cid ? ' (' + cid + ')' : ''));

// ---------------------------------------------------------------- the page
const ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.01c-.24.68-1.42 1.31-1.95 1.36-.5.05-.97.23-3.28-.68-2.78-1.1-4.54-3.95-4.68-4.13-.13-.18-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.29.25-.27.55-.34.73-.34l.52.01c.17.01.39-.06.61.47.24.55.79 1.9.86 2.04.07.14.11.3.02.48-.09.18-.13.29-.27.45-.13.16-.28.36-.4.48-.13.13-.27.28-.12.55.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.88.27.13.45.2.52.31.06.11.06.66-.18 1.33z"/></svg>';
const ICON_CAL = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="7" width="32" height="29" rx="8" fill="#fff" stroke="#E9E2D3" stroke-width="2"/><rect x="4" y="7" width="32" height="9" rx="4" fill="#7C5CFC"/><circle cx="13" cy="24" r="2.6" fill="#C9BFAE"/><circle cx="20" cy="24" r="2.6" fill="#FFA53D"/><circle cx="27" cy="24" r="2.6" fill="#C9BFAE"/><circle cx="13" cy="30.5" r="2.6" fill="#C9BFAE"/><circle cx="20" cy="30.5" r="2.6" fill="#FFA53D"/><rect x="11" y="3" width="4" height="8" rx="2" fill="#5A3FD6"/><rect x="25" y="3" width="4" height="8" rx="2" fill="#5A3FD6"/></svg>';
const dots = (n, cls)=>'<span class="dots" aria-hidden="true">' + Array.from({length:n}, (x, i)=>'<i' + (cls && i === 0 ? ' class="' + cls + '"' : '') + '></i>').join('') + '</span>';
const QUOTE = L === 'fa' || L === 'es' ? ['«', '»'] : ['“', '”'];
const reason = asked ? W.reason.asked : W.reason[goal];
const practise = PRACTISE[theme || goal][L];

const hero = `
  <header class="top">
    <div class="hero" style="--goal:${GOAL_COLOR[goal]}">
      <div class="hero-bar"><span class="brand"><img src="/assets/app-icon-128.png" alt="" width="28" height="28"><span>FE<i>school</i></span></span><span class="pill"><i></i>${fill(W.pill)}</span></div>
      <div class="hero-grid">
        <div class="hero-main">
          <span class="hello">${name ? fill(W.hello) : fill(W.helloNo)}</span>
          <h1>${esc(clsName)}<span class="dot">.</span></h1>
          ${lv ? `<span class="lvl">${fill(W.lvl)} <b><bdi dir="ltr">${esc(lv)}</bdi></b></span>` : ''}
          <p class="lead">${fill(W.lead)}</p>
        </div>
        <div class="art"><div class="disc"></div><img src="/assets/char-${goal}.webp" alt="" width="360" height="360" decoding="async"></div>
      </div>
    </div>
    <div class="tiles wrap" style="grid-template-columns:repeat(${lv ? 3 : 2},1fr)">${W.tiles.filter(t=>t[0] !== '{lv}' || lv).map((t, i)=>`<div class="tile${i === 0 ? ' on' : ''}"><b>${fill(t[0])}</b><span>${fill(t[1])}</span></div>`).join('')}</div>
  </header>`;

const why = `
  <section class="sec wrap">
    <div class="head"><span class="eb">${fill(W.whyEb)}</span><h2>${fill(W.whyH)}<span class="dot">.</span></h2></div>
    <div class="why" style="--goal:${GOAL_COLOR[goal]}">
      <p class="st">${lv ? fill(W.why, {reason:fill(reason)}) : fill(reason.charAt(0).toUpperCase() + reason.slice(1)) + '.'}</p>
      ${prio ? `<div class="quote"><small>${fill(W.saidLabel)}</small><q>${QUOTE[0]}${fill(W.said[prio])}${QUOTE[1]}</q><p>${fill(W.fix[prio])}</p></div>` : ''}
    </div>
  </section>`;

const rooms = `
  <section class="sec wrap">
    <div class="head"><span class="eb">${fill(W.midEb)}</span><h2>${fill(W.midH)}</h2></div>
    <div class="rooms">
      ${W.rooms.map((r, i)=>`<div class="room${i === 1 ? ' one' : ''}${i === 2 ? ' best' : ''}">${i === 2 ? `<span class="tag">${fill(W.best)}</span>` : ''}
        ${dots([24, 1, 6][i], i === 2 ? 'you' : '')}
        <div><h3>${fill(r[0])}</h3><ul>${r[1].map(x=>`<li>${fill(x)}</li>`).join('')}</ul></div></div>`).join('')}
    </div>
  </section>`;

const rows = (list, cls)=>`<ol class="rows${cls ? ' ' + cls : ''}">${list.map((r, i)=>`<li><span class="n">${num(i + 1)}</span><div><b>${fill(r[0])}</b><span>${fill(r[1])}</span></div></li>`).join('')}</ol>`;
const prac = `
  <section class="sec wrap">
    <div class="head"><span class="eb">${fill(W.pracEb)}</span><h2>${fill(W.pracH)}<span class="dot">.</span></h2></div>
    ${rows(practise)}
  </section>`;
const how = `
  <section class="sec wrap" style="--goal:${GOAL_COLOR[goal]}">
    <div class="head"><span class="eb">${fill(W.howEb)}</span><h2>${fill(W.howH)}<span class="dot">.</span></h2></div>
    ${rows(W.how, 'how')}
  </section>`;

const group = `
  <section class="sec wrap">
    <div class="head"><span class="eb">${fill(W.grpEb)}</span><h2>${fill(mNum >= 7 ? W.grpH : W.grpHNo)}<span class="dot">.</span></h2></div>
    <div class="group">
      ${mNum >= 7 ? `<div class="flow"><span class="big"><b>${num(mNum)}</b><span>${fill(W.matched)}</span></span><span class="arrow" aria-hidden="true">→</span><span class="big"><b>${num(6)}</b><span>${fill(W.seats)}</span></span></div>` : ''}
      <div class="seats" aria-hidden="true">${Array.from({length:6}, (x, i)=>`<span class="seat${i === 0 ? ' you' : ''}">${i === 0 ? fill(W.you) : ''}</span>`).join('')}</div>
      <p>${fill(mNum >= 7 ? W.grp : W.grpNo)}</p>
      ${topics.length ? `<div class="loves"><small>${fill(W.loves)}</small><div class="chips">${topics.map(t=>`<span class="chip">${esc(TOPICS[t][L])}</span>`).join('')}</div><p>${fill(W.lovesP)}</p></div>` : ''}
    </div>
    <div class="time">${ICON_CAL}<div><h3>${fill(W.timeH)}</h3><p>${fill(W.time)}</p></div></div>
  </section>`;

const note = `
  <section class="wrap">
    <div class="note"><img src="/assets/farin-portrait.webp" alt="Farin" width="76" height="76" decoding="async"><div><p>${fill(W.note)}</p><span class="sign">Farin</span><small>${fill(W.role)}</small></div></div>
  </section>
  <footer class="wrap"><b>FE<i>school</i></b><a href="https://thefeschool.com/">thefeschool.com</a></footer>`;

const cta = `
  <div class="cta"><div class="cta-in">
    <a class="go" href="${esc(waLink(plain(W.waYes)))}" target="_blank" rel="noopener">${ICON_WA}<span>${fill(W.cta)}</span><span class="ar" aria-hidden="true">→</span></a>
    <a class="ask" href="${esc(waLink(plain(W.waAsk)))}" target="_blank" rel="noopener">${fill(W.ask)}</a>
  </div></div>`;

document.title = plain(W.title);
const root = document.getElementById('offer');
root.innerHTML = hero + why + rooms + prac + how + group + note;
root.insertAdjacentHTML('afterend', cta);
})();
