/* Farin — marketing site interactivity (vanilla JS, no dependencies)
   Shared by the hub and all three language pages. Each language page
   sets window.FARIN_LANG before loading this file to localize the
   wizard and the mini story game; pages without it (the hub) simply
   skip anything that needs it. */
(function(){
"use strict";

var WHATSAPP_NUMBER = '905467615974';
var LANG = window.FARIN_LANG || null;

function waLink(text){
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
}

/* ---------------- Mobile nav ---------------- */
var burger = document.getElementById('burger');
var navLinks = document.getElementById('navLinks');
if (burger && navLinks){
  burger.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });
}

/* ---------------- Sticky header shadow ---------------- */
var header = document.getElementById('siteHeader');
if (header){
  window.addEventListener('scroll', function(){
    header.style.boxShadow = window.scrollY > 8 ? '0 6px 20px rgba(38,34,29,.08)' : 'none';
  }, { passive:true });
}

/* ---------------- Reveal on scroll ---------------- */
var revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold:.12 });
  revealEls.forEach(function(el){ io.observe(el); });
} else {
  revealEls.forEach(function(el){ el.classList.add('in'); });
}

/* ---------------- Global sparkles — magical dots drifting everywhere as you scroll the whole page ---------------- */
/* Pure CSS-driven (works even without GSAP); a fixed overlay so it's visible across every section. */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var sparkleWrap = document.createElement('div');
  sparkleWrap.className = 'global-sparkles';
  sparkleWrap.setAttribute('aria-hidden', 'true');
  var sparkleCount = 26;
  for (var gs = 0; gs < sparkleCount; gs++){
    var dot = document.createElement('span');
    dot.style.left = (Math.random() * 96 + 2) + '%';
    dot.style.top = (Math.random() * 100) + '%';
    dot.style.animationDelay = (Math.random() * 9) + 's';
    dot.style.animationDuration = (7 + Math.random() * 6) + 's';
    sparkleWrap.appendChild(dot);
  }
  document.body.appendChild(sparkleWrap);
}

/* ==================================================================
   3D DEPTH-PARALLAX MOTION ENGINE — GSAP + ScrollTrigger + Lenis
   Falls back to a plain fade (via the .reveal system below) if the
   CDN libraries fail to load, or if the visitor prefers reduced motion.
   ================================================================== */
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
var isNarrow = window.matchMedia('(max-width:760px)').matches;
var hasGSAP = !reduceMotion && typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
document.documentElement.classList.add(hasGSAP ? 'has-gsap' : 'no-gsap');

if (hasGSAP){
  gsap.registerPlugin(ScrollTrigger);

  /* Lenis smooth scroll, wired into GSAP's ticker so ScrollTrigger stays in sync */
  if (typeof window.Lenis !== 'undefined'){
    var lenis = new Lenis({ duration: 1.2, smoothWheel: true, smoothTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- Hero depth layers (data-depth driven, further back = slower) ---------------- */
  var heroScene = document.querySelector('.hero-scene');
  if (heroScene){
    var particleWrap = heroScene.querySelector('.hero-particles');
    if (particleWrap){
      var particleCount = isNarrow ? 7 : 14;
      for (var i = 0; i < particleCount; i++){
        var p = document.createElement('span');
        p.style.left = (Math.random()*94 + 3) + '%';
        p.style.bottom = (Math.random()*30) + '%';
        p.style.animationDelay = (Math.random()*8) + 's';
        p.style.animationDuration = (6 + Math.random()*5) + 's';
        particleWrap.appendChild(p);
      }
    }

    var depthStrength = isNarrow ? 0.4 : 1; /* mobile: parallax strength cut ~60% per perf rules */
    var heroDepthLayers = [
      { el: heroScene.querySelector('.layer-backdrop'), depth:.15, zBase:-260, scale:1.35 },
      { el: heroScene.querySelector('.hero-particles'), depth:1.6, zBase:10 }
    ].filter(function(l){ return l.el; });

    heroDepthLayers.forEach(function(l){
      /* no local transformPerspective here — .hero-scene's CSS `perspective` already
         gives these sibling layers one shared, coordinated 3D scene */
      gsap.set(l.el, { z: l.zBase, scale: l.scale || 1 });
      gsap.to(l.el, {
        yPercent: -l.depth * 30 * depthStrength,
        z: l.zBase + l.depth * 60 * depthStrength,
        rotateX: 4 * depthStrength,
        ease: 'none',
        scrollTrigger: { trigger: heroScene, start:'top top', end:'bottom top', scrub: 1 }
      });
    });
  }

  /* ---------------- Difference cards + steps: 3D settle-in, one ScrollTrigger per element ---------------- */
  var depthEls = document.querySelectorAll('.grid.cols-4 > .depth-card, .steps > .step');
  depthEls.forEach(function(el, i){
    gsap.set(el, { transformPerspective: 1000, transformOrigin:'50% 100%' });
    gsap.fromTo(el,
      { rotateX: 16, y: 30, scale: .94 },
      {
        rotateX: 0, y: 0, scale: 1, ease:'power2.out',
        scrollTrigger: { trigger: el, start:'top 92%', end:'top 55%', scrub: .6 }
      }
    );
  });

  /* Feature showcase is now a continuous CSS-driven infinite marquee (see .feature-track
     keyframes in site.css) — no scroll-triggered JS needed; it just loops on its own. */

  /* ---------------- 3-language cards: staggered rise-in + hover-forward ---------------- */
  var langGrid = document.querySelector('.lang-grid');
  if (langGrid){
    var langCards = Array.prototype.slice.call(langGrid.querySelectorAll('.lang-card'));
    langCards.forEach(function(el, i){
      gsap.fromTo(el, { y:40, scale:.94, autoAlpha:0 }, {
        y:0, scale:1, autoAlpha:1, duration:.7, delay:i * .12, ease:'power3.out',
        scrollTrigger: { trigger: langGrid, start:'top 85%', toggleActions:'play none none none' }
      });
      if (canHover){
        el.addEventListener('mouseenter', function(){ gsap.to(el, { scale:1.04, y:-8, duration:.3, ease:'power2.out' }); });
        el.addEventListener('mouseleave', function(){ gsap.to(el, { scale:1, y:0, duration:.4, ease:'power2.out' }); });
      }
    });
  }

  /* ---------------- Mouse-follow 3D tilt on glass surfaces (fine-pointer only) ---------------- */
  /* .lang-card is excluded — it already gets its own mouseenter/leave hover-forward above */
  if (canHover){
    var tiltEls = document.querySelectorAll('.card, .plan, .feature-card');
    tiltEls.forEach(function(el){
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        var rotateY = ((x / r.width) - .5) * 12;
        var rotateX = ((y / r.height) - .5) * -12;
        gsap.to(el, { rotateX: rotateX, rotateY: rotateY, y:-4, duration:.4, ease:'power2.out' });
      });
      el.addEventListener('mouseleave', function(){
        gsap.to(el, { rotateX:0, rotateY:0, y:0, duration:.6, ease:'power2.out' });
      });
    });
  }

  /* ---------------- Section vortex — a BIG spinning "landspout" of sparkles that sweeps
     across the whole viewport at each section boundary: it grows in, swirls at full size,
     then shrinks away, so crossing into a new section feels like a real gust carrying you
     through rather than a small decorative detail ---------------- */
  var vortexSections = Array.prototype.slice.call(document.querySelectorAll('section')).filter(function(s){
    return !s.classList.contains('hero-scene');
  });
  vortexSections.forEach(function(section){
    var vortex = document.createElement('div');
    vortex.className = 'section-vortex';
    vortex.setAttribute('aria-hidden', 'true');
    var glow = document.createElement('div');
    glow.className = 'vortex-glow';
    var spin = document.createElement('div');
    spin.className = 'vortex-spin';
    var dotCount = isNarrow ? 14 : 24;
    var vortexHeight = isNarrow ? 440 : 720;
    var maxRadius = isNarrow ? 100 : 190;
    for (var v = 0; v < dotCount; v++){
      var t = v / (dotCount - 1);
      var radius = 10 + t * maxRadius;
      var angle = t * 1080 + v * 41;
      var dot = document.createElement('span');
      dot.style.top = (t * vortexHeight) + 'px';
      dot.style.transform = 'rotate(' + angle + 'deg) translateX(' + radius.toFixed(1) + 'px)';
      dot.style.opacity = (0.45 + Math.random() * 0.55).toFixed(2);
      spin.appendChild(dot);
    }
    vortex.appendChild(glow);
    vortex.appendChild(spin);
    section.insertBefore(vortex, section.firstChild);
    gsap.set(vortex, { scale:.4, transformOrigin:'50% 50%' });

    ScrollTrigger.create({
      trigger: section, start:'top 100%', end:'top -20%', scrub:true,
      onUpdate: function(self){
        var p = self.progress;
        var peak = p < .5 ? p * 2 : (1 - p) * 2; /* 0 -> 1 -> 0 across the crossing */
        gsap.set(vortex, { opacity: peak, scale: .4 + peak * .9 });
      }
    });
  });
} else {
  /* ---------------- No-GSAP / reduced-motion fallback: lightweight vanilla tilt ---------------- */
  var tiltElsFallback = canHover
    ? document.querySelectorAll('.card, .plan, .lang-card, .feature-card')
    : [];
  tiltElsFallback.forEach(function(el){
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rx = (py - .5) * -2;
      var ry = (px - .5) * 2;
      el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
    });
    el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
  });
}

/* ---------------- Footer year ---------------- */
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------- FAQ accordion ---------------- */
document.querySelectorAll('.faq-item').forEach(function(item){
  var q = item.querySelector('.faq-q');
  var a = item.querySelector('.faq-a');
  q.addEventListener('click', function(){
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(other){
      if (other !== item){ other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = null; }
    });
    if (isOpen){ item.classList.remove('open'); a.style.maxHeight = null; }
    else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    q.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ==================================================================
   PERSONALIZATION WIZARD — "Sana Özel Programını Oluştur"
   Same categories for every language; only the exam names in the
   "sınav" goal and the outgoing WhatsApp text are localized.
   ================================================================== */
var GOALS = [
  { id:'kariyer', label:'Kariyer / İş Hayatı', desc:'Toplantı, e-posta, sunum' },
  { id:'seyahat', label:'Seyahat', desc:'Gezerken rahat konuşmak' },
  { id:'sinav', label:'Sınav', desc:(LANG && LANG.examLabel) || 'Uluslararası sınavlar' },
  { id:'gocyurtdisi', label:'Yurt Dışı Yaşam', desc:'Taşınma, göç, günlük hayat' },
  { id:'akici', label:'Sadece Akıcı Konuşmak', desc:'Özgüvenle konuşabilmek' },
  { id:'yenidenbasla', label:'Yeniden Başlamak', desc:'Yarım kalmıştı, tazelemek istiyorum' }
];
var LEVELS = [
  { id:'a1', label:'Yeni Başlıyorum', desc:'A1 seviyesi' },
  { id:'a2b1', label:'Temel Bilgim Var', desc:'A2–B1 seviyesi' },
  { id:'b1b2', label:'Orta Seviyeyim', desc:'B1–B2 seviyesi' },
  { id:'c1', label:'İleri Seviyeyim', desc:'C1 ve üzeri' },
  { id:'belirsiz', label:'Emin Değilim', desc:'İlk derste birlikte netleştirelim' }
];
var CHARS = [
  { id:'kasif', label:'Kâşif', desc:'Yeni yerler, yeni kültürler, keşfetmeyi severim', plan:'Derslerde seni yeni senaryolara ve kültürel deneyimlere götüreceğiz — her ders küçük bir keşif olacak.' },
  { id:'stratejist', label:'Stratejist', desc:'Net hedef ve ölçülebilir ilerleme isterim', plan:'Derslerde net hedefler, düzenli tekrar ve somut ilerleme takibiyle ilerleyeceğiz.' },
  { id:'deneyimci', label:'Deneyimci', desc:'Rol yapmayı, karakterleri, dramayı severim', plan:'Derslerde rol yapma, karakter canlandırma ve uzun soluklu deneyim çizgileri seni bekliyor.' },
  { id:'yarismaci', label:'Yarışmacı', desc:'Oyunlar, skorlar, hız beni motive eder', plan:'Derslerde mini oyunlar, zamana karşı yarışlar ve seviye atlama hissiyle ilerleyeceğiz.' }
];
var LEVEL_LABELS = {}; LEVELS.forEach(function(l){ LEVEL_LABELS[l.id] = l.label + ' (' + l.desc + ')'; });
var GOAL_LABELS = {}; GOALS.forEach(function(g){ GOAL_LABELS[g.id] = g.label; });

var PACKAGES = {
  ilkadim: { name:'İlk Adım — Ücretsiz Deneme Dersi', sessions:1, price:0, blurb:'Tanışma + seviye tespiti + ilk mini deneyimle başlangıç. Kart bilgisi gerekmez.' },
  kesif:   { name:'Keşif Paketi', sessions:4,  price:690, blurb:'Ritmi yakalamak ve düzenli konuşma alışkanlığı için ideal.' },
  macera:     { name:'Macera Paketi', sessions:8,  price:670, blurb:'Belirgin bir hedefe düzenli adımlarla ilerlemek için.' },
  kahraman:   { name:'Kahraman Yolculuğu Paketi', sessions:12, price:650, blurb:'Sınav, göç veya iş hedefi gibi yoğun programlar için en avantajlısı.' }
};
function recommendPackage(goalId){
  if (goalId === 'sinav' || goalId === 'gocyurtdisi') return 'kahraman';
  if (goalId === 'kariyer' || goalId === 'yenidenbasla') return 'macera';
  return 'kesif';
}

var wizardEl = document.getElementById('wizard');
if (wizardEl){
  var langName = (LANG && LANG.name) || 'dil';
  var state = { step:1, goal:null, level:null, character:null };
  var stepsTotal = 3;

  function renderOptions(list, key){
    return list.map(function(o){
      var selected = state[key] === o.id;
      return '<button type="button" class="option'+(selected?' selected':'')+'" data-key="'+key+'" data-id="'+o.id+'" aria-pressed="'+selected+'">'+
        '<strong>'+o.label+'</strong><span class="desc">'+o.desc+'</span>'+
      '</button>';
    }).join('');
  }

  function progressHTML(){
    var html = '';
    for (var i=1;i<=stepsTotal;i++){
      var cls = i < state.step ? 'done' : (i === state.step ? 'active' : '');
      html += '<i class="'+cls+'"><span></span></i>';
    }
    return html;
  }

  function render(){
    if (state.step > stepsTotal){ renderResult(); return; }
    var key, title, list, label;
    if (state.step === 1){ key='goal'; title='Hedefin ne?'; list=GOALS; label='Adım 1 / 3 · Hedef'; }
    else if (state.step === 2){ key='level'; title='Şu an '+langName+' seviyen ne?'; list=LEVELS; label='Adım 2 / 3 · Seviye'; }
    else { key='character'; title='Nasıl öğrenmekten keyif alırsın?'; list=CHARS; label='Adım 3 / 3 · Öğrenme Karakterin'; }

    wizardEl.innerHTML =
      '<div class="wizard-progress">'+progressHTML()+'</div>'+
      '<div class="wizard-step-label">'+label+'</div>'+
      '<h3>'+title+'</h3>'+
      '<div class="option-grid" role="group">'+renderOptions(list,key)+'</div>'+
      '<div class="wizard-nav">'+
        (state.step>1 ? '<button type="button" class="btn btn-ghost btn-sm" id="wizBack">← Geri</button>' : '<span></span>')+
        '<span class="spacer"></span>'+
        '<button type="button" class="btn btn-primary btn-sm" id="wizNext" '+(state[key]?'':'disabled')+'>'+(state.step<stepsTotal?'İleri →':'Programımı Göster')+'</button>'+
      '</div>';

    wizardEl.querySelectorAll('.option').forEach(function(btn){
      btn.addEventListener('click', function(){
        state[btn.dataset.key] = btn.dataset.id;
        render();
      });
    });
    var backBtn = document.getElementById('wizBack');
    if (backBtn) backBtn.addEventListener('click', function(){ state.step--; render(); });
    document.getElementById('wizNext').addEventListener('click', function(){ state.step++; render(); });
  }

  function renderResult(){
    var charObj = CHARS.filter(function(c){ return c.id === state.character; })[0];
    var pkgId = recommendPackage(state.goal);
    var pkg = PACKAGES[pkgId];
    var levelLabel = LEVEL_LABELS[state.level];
    var goalLabel = GOAL_LABELS[state.goal];
    var monogram = charObj.label.charAt(0);

    var msg = 'Merhaba Farin! '+langName+' için "Sana Özel Program" aracını kullandım:\n'+
      'Hedefim: '+goalLabel+'\n'+
      'Seviyem: '+levelLabel+'\n'+
      'Öğrenme karakterim: '+charObj.label+'\n'+
      'Önerilen paket: '+pkg.name+'\n\n'+
      'Ücretsiz deneme dersiyle başlamak istiyorum.';

    wizardEl.innerHTML =
      '<div class="result-card">'+
        '<div class="result-badge-ring"><span class="result-badge">'+monogram+'</span></div>'+
        '<div class="eyebrow">SENİN ÖĞRENME KARAKTERİN</div>'+
        '<h3>'+charObj.label+'</h3>'+
        '<p class="lead center">'+charObj.desc+'</p>'+
        '<div class="result-grid">'+
          '<div class="result-item"><div class="k">Hedef</div><div class="v">'+goalLabel+'</div></div>'+
          '<div class="result-item"><div class="k">Seviye</div><div class="v">'+levelLabel+'</div></div>'+
          '<div class="result-item"><div class="k">Karakter</div><div class="v">'+charObj.label+'</div></div>'+
        '</div>'+
        '<div class="result-plan">'+
          '<h4>Başlangıç: İlk Adım dersin tamamen ücretsiz</h4>'+
          '<p>Tanışma, hedef ve seviye tespiti + ilk mini deneyim — kart bilgisi gerekmez.</p>'+
        '</div>'+
        '<div class="result-plan">'+
          '<h4>Sonrası için önerilen: '+pkg.name+'</h4>'+
          '<p>'+charObj.plan+' '+pkg.blurb+' Seans başına ₺'+pkg.price+'.</p>'+
        '</div>'+
        '<div class="cta-row center">'+
          '<a class="btn btn-cta" target="_blank" rel="noopener" href="'+waLink(msg)+'">Ücretsiz Dersimi Ayarla</a>'+
          '<button type="button" class="btn btn-ghost" id="wizRestart">Baştan Başla</button>'+
        '</div>'+
      '</div>';

    document.getElementById('wizRestart').addEventListener('click', function(){
      state = { step:1, goal:null, level:null, character:null };
      render();
    });
  }

  render();
}

/* ==================================================================
   MINI STORY GAME — localized per language via window.FARIN_LANG.story
   ================================================================== */
var storyEl = document.getElementById('storyGame');
if (storyEl && LANG && LANG.story){
  var STORY = LANG.story;
  var storyMsg = 'Merhaba Farin! '+(LANG.name||'')+' mini deneyimini az önce denedim ve yöntemini çok sevdim — ücretsiz deneme dersi almak istiyorum.';

  function renderStory(nodeId){
    var node = STORY[nodeId];
    var html =
      '<div class="story-scene">'+
        '<span class="story-tag">'+node.tag+'</span>'+
        '<p class="story-en">'+node.en+'</p>'+
        '<p class="story-tr">'+node.tr+'</p>'+
        (node.tip ? '<div class="story-tip">'+node.tip+'</div>' : '');

    if (node.end){
      html += '<div class="cta-row">'+
        '<button type="button" class="btn btn-ghost" id="storyReplay">Tekrar Oyna</button>'+
        '<a class="btn btn-cta" target="_blank" rel="noopener" href="'+waLink(storyMsg)+'">Gerçek Derste Bunu Konuşalım</a>'+
      '</div></div>';
    } else {
      html += '<div class="story-choices">'+
        node.choices.map(function(c){ return '<button type="button" class="story-choice" data-next="'+c.next+'">'+c.label+'</button>'; }).join('')+
      '</div></div>';
    }
    storyEl.innerHTML = html;

    storyEl.querySelectorAll('.story-choice').forEach(function(btn){
      btn.addEventListener('click', function(){ renderStory(btn.dataset.next); });
    });
    var replay = document.getElementById('storyReplay');
    if (replay) replay.addEventListener('click', function(){ renderStory('start'); });
  }

  renderStory('start');
}

})();
