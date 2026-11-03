// Cozy Chores "Open House": visual sample of ONE station (bake / oven), rendered clear-line art + a PixiJS motion layer.
// Preview only (farin-13, 2026-10-29). Not wired into the app. PixiJS v8.22.0 (MIT) is loaded lazily from ./vendor/ by this
// file only. Lines are farin-lxd's (content/cake.json, en A2, station "bake"), copied unchanged.
// URL flags: ?rm=1 reduced motion · ?shot=intro|tin|dial|bake|done (jump, for screenshots) · ?mute=1 · ?ui=tr|fa
const Q = new URLSearchParams(location.search);
const REDUCED = Q.get('rm') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const UI_LANG = Q.get('ui') === 'fa' ? 'fa' : 'tr';
let MUTED = Q.get('mute') === '1';

const LINES = {
  tin:   { en: 'Put the tin in the oven.', tr: 'Kalıbı fırına koy.', fa: 'قالب را بگذار توی فر.' },
  dial:  { en: 'Thirty minutes, please.', tr: 'Otuz dakika, lütfen.', fa: 'سی دقیقه، لطفاً.', listen: true },
  long:  { en: '{n}? That’s too long. Thirty minutes.', tr: '{n} mi? Bu çok uzun. Otuz dakika.', fa: '{n}؟ خیلی زیاد است. سی دقیقه.' },
  short: { en: '{n}? That’s too short. Thirty minutes.', tr: '{n} mi? Bu çok kısa. Otuz dakika.', fa: '{n}؟ خیلی کم است. سی دقیقه.' },
  done:  { en: 'Ding! It’s ready. Let it cool a little.', tr: 'Dıng! Hazır. Biraz soğusun.', fa: 'دینگ! آماده است. بگذار کمی خنک شود.' },
  hint:  { en: 'Turn the dial to thirty.', tr: 'Düğmeyi otuza çevir.', fa: 'پیچ را روی سی بچرخان.' },
};
const NUM = { 0: 'zero', 5: 'five', 10: 'ten', 15: 'fifteen', 20: 'twenty', 25: 'twenty-five', 30: 'thirty', 35: 'thirty-five', 40: 'forty', 45: 'forty-five', 50: 'fifty', 55: 'fifty-five', 60: 'sixty' };
const NUM_UP = (n) => NUM[n][0].toUpperCase() + NUM[n].slice(1);

// ---- layout of the art, in plate pixels (864x1080). Measured on the rendered plate (see render/README). ----
const LAYOUT = window.__LAYOUT || (await import('./layout.js')).LAYOUT;
const ART = (id) => (window.__ART && window.__ART[id]) || './art/' + id + '.webp';
const PIECES = ['plate-bakery-oven', 'co-oven-door-closed', 'co-oven-door-open', 'co-cake-oven-flat', 'co-cake-oven-rising', 'co-cake-oven-risen', 'co-oven-dial', 'pt-bell-calm', 'pt-bell-blink', 'pt-bell-warm', 'pt-bell-oh'];

const INK = 0x14332e, GOLD = 0xffd166, CREAM = 0xfffdf7, ORANGE = 0xff7a59;

// ---------------------------------------------------------------- tiny tween + timeline
const ease = {
  linear: t => t, outCubic: t => 1 - (1 - t) ** 3, inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
  outBack: t => { const c = 1.70158; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; },
  outElastic: t => t === 0 || t === 1 ? t : 2 ** (-10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1,
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
};
const tweens = new Set();
function tween(obj, to, ms, e = 'outCubic', delay = 0) {
  return new Promise(res => {
    if (REDUCED && ms > 0) { ms = 1; delay = 0; }
    const from = {}; for (const k in to) from[k] = getK(obj, k);
    tweens.add({ obj, from, to, ms, e: ease[e] || e, t: -delay, res });
  });
}
function getK(o, k) { const p = k.split('.'); return p.length > 1 ? o[p[0]][p[1]] : o[k]; }
function setK(o, k, v) { const p = k.split('.'); if (p.length > 1) o[p[0]][p[1]] = v; else o[k] = v; }
function stepTweens(dt) {
  for (const tw of tweens) {
    tw.t += dt; if (tw.t < 0) continue;
    const u = Math.min(1, tw.t / tw.ms), v = tw.e(u);
    for (const k in tw.to) setK(tw.obj, k, tw.from[k] + (tw.to[k] - tw.from[k]) * v);
    if (u >= 1) { tweens.delete(tw); tw.res(); }
  }
}
const wait = (ms) => new Promise(r => setTimeout(r, REDUCED ? Math.min(ms, 200) : ms));

// ---------------------------------------------------------------- sound: tiny synthesized sfx (no files)
let AC = null;
function sfx(kind) {
  if (MUTED) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); o.connect(g); g.connect(AC.destination);
  const env = (a, d, peak) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  if (kind === 'tick') { o.type = 'square'; o.frequency.setValueAtTime(1900, t); env(.002, .03, .05); }
  if (kind === 'thunk') { o.type = 'sine'; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(70, t + .15); env(.005, .2, .35); }
  if (kind === 'pop') { o.type = 'sine'; o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(980, t + .08); env(.005, .12, .18); }
  if (kind === 'ding') { o.type = 'sine'; o.frequency.setValueAtTime(1568, t); env(.005, 1.4, .25); const o2 = AC.createOscillator(); o2.frequency.value = 2093; o2.connect(g); o2.start(t); o2.stop(t + 1.5); }
  if (kind === 'nope') { o.type = 'triangle'; o.frequency.setValueAtTime(300, t); o.frequency.linearRampToValueAtTime(220, t + .18); env(.01, .2, .15); }
  o.start(t); o.stop(t + 1.6);
}
function speak(text) {
  if (MUTED || !('speechSynthesis' in window)) return Promise.resolve();
  return new Promise(res => {
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/[‘’]/g, "'")); u.lang = 'en-GB'; u.rate = .92;
    u.onend = u.onerror = res; speechSynthesis.speak(u); setTimeout(res, 5000);
  });
}

// ---------------------------------------------------------------- DOM UI (transform / opacity motion only)
const $ = (s) => document.querySelector(s);
const ui = {
  balloon: $('#balloon'), who: $('#who'), line: $('#line'), gloss: $('#gloss'), cue: $('#cue'), cta: $('#cta'),
  readout: $('#readout'), bars: [$('#bar-t'), $('#bar-b')], title: $('#title'), sound: $('#sound'), skip: $('#skip'), end: $('#end'),
};
function say(key, n) {
  const L = LINES[key]; const fill = (s) => s.replace('{n}', n != null ? NUM_UP(n) : '');
  ui.who.textContent = 'Mrs Bell';
  ui.line.textContent = fill(L.en); ui.gloss.textContent = fill(L[UI_LANG]).replace('{n}', n);
  ui.gloss.dir = UI_LANG === 'fa' ? 'rtl' : 'ltr';
  ui.balloon.classList.remove('in'); void ui.balloon.offsetWidth; ui.balloon.classList.add('in');
  bellTalk();
  return speak(fill(L.en));
}
function cue(text) { ui.cue.textContent = text || ''; ui.cue.classList.toggle('in', !!text); }
function cta(label, fn) {
  if (!label) { ui.cta.classList.remove('in'); ui.cta.onclick = null; return; }
  ui.cta.textContent = label; ui.cta.classList.add('in'); ui.cta.onclick = () => { sfx('pop'); cta(null); fn(); };
}
ui.sound.onclick = () => { MUTED = !MUTED; ui.sound.classList.toggle('off', MUTED); if (MUTED && window.speechSynthesis) speechSynthesis.cancel(); };
ui.sound.classList.toggle('off', MUTED);

// ---------------------------------------------------------------- boot: lazy-load PixiJS for this game only
const P = await import(window.__PIXI_SRC ? URL.createObjectURL(new Blob([document.getElementById(window.__PIXI_SRC).textContent], { type: 'text/javascript' })) : './vendor/pixi-8.22.0.mjs');
const { Application, Assets, Container, Sprite, Graphics, Texture, DisplacementFilter, Rectangle } = P;

const app = new Application();
await app.init({ resizeTo: window, backgroundAlpha: 0, antialias: true, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true, preference: 'webgl', powerPreference: 'low-power' });
$('#stage').appendChild(app.canvas);

const tex = {};
await Promise.all(PIECES.map(async id => { try { tex[id] = await Assets.load(ART(id)); } catch { tex[id] = null; } }));

// placeholder textures (only while a render is missing): flat shape + label, never shown as "art"
function ph(id, w, h, fill) {
  const g = new Graphics().roundRect(0, 0, w, h, 24).fill(fill).stroke({ width: 4, color: INK, alpha: .4 });
  const t = app.renderer.generateTexture(g); g.destroy(); return t;
}
const T = (id, w, h, fill) => tex[id] || (tex[id] = ph(id, w, h, fill));

// ---------------------------------------------------------------- scene graph
const PW = 864, PH = 1080;
const root = new Container(); app.stage.addChild(root);
const panelMask = new Graphics(); const panelInk = new Graphics();
const world = new Container(); world.mask = panelMask; root.addChild(world, panelMask, panelInk);
// parallax layers (p = how much a layer moves with the camera; 1 = the plate)
const L = { back: new Container(), inside: new Container(), door: new Container(), front: new Container(), air: new Container() };
const PAR = { back: 1, inside: 1, door: 1, front: 1.08, air: 1.16 };
for (const k in L) world.addChild(L[k]);
const fx = new Container(); root.addChild(fx);          // sparkles above the panel ink
const cast = new Container(); root.addChild(cast);      // Mrs Bell breaks the frame (outside the mask)

const plate = new Sprite(T('plate-bakery-oven', PW, PH, 0xfcefdc)); plate.width = PW; plate.height = PH; L.back.addChild(plate);

// light shafts from the window side: flat translucent bands (graphic, not blur)
const shafts = new Graphics(); L.back.addChild(shafts);
function drawShafts(a) {
  shafts.clear();
  const S = LAYOUT.shafts;
  S.bands.forEach((b, i) => shafts.poly([b[0], 0, b[0] + b[1], 0, b[0] + b[1] + S.slant, PH, b[0] + S.slant, PH]).fill({ color: 0xfff4cf, alpha: a * (i % 2 ? .10 : .16) }));
}

// oven interior: glow (stacked flat ellipses), cake, heat shimmer
const O = LAYOUT.oven;
const glow = new Container(); glow.position.set(O.cx, O.cy); glow.blendMode = 'add'; L.inside.addChild(glow);
[[1, .10], [.78, .12], [.55, .16], [.33, .2]].forEach(([s, a]) => glow.addChild(new Graphics().ellipse(0, 0, O.rx * s, O.ry * s).fill({ color: 0xff9a3c, alpha: a })));
glow.alpha = .35;
const cakeBox = new Container(); L.inside.addChild(cakeBox);
const C = LAYOUT.cake;
const cakes = ['flat', 'rising', 'risen'].map(k => {
  const s = new Sprite(T('co-cake-oven-' + k, 225, 150, 0xf0c47a)); s.anchor.set(.5, 1);
  const sc = C.w / s.texture.width; s.scale.set(sc); s.baseScale = sc; s.position.set(C.x, C.y); s.alpha = 0; cakeBox.addChild(s); return s;
});
// heat shimmer: displacement from a generated noise texture, only over the oven opening
const nC = document.createElement('canvas'); nC.width = nC.height = 128; const nx = nC.getContext('2d');
for (let y = 0; y < 128; y += 4) for (let x = 0; x < 128; x += 4) { const v = 128 + 60 * Math.sin(x * .19 + y * .07) + 50 * Math.sin(y * .23 - x * .05); nx.fillStyle = `rgb(${v | 0},${(255 - v) | 0},128)`; nx.fillRect(x, y, 4, 4); }
const nSprite = new Sprite(Texture.from(nC)); nSprite.texture.source.addressMode = 'repeat'; nSprite.scale.set(3); nSprite.renderable = false; L.inside.addChild(nSprite);
const shimmer = new DisplacementFilter({ sprite: nSprite, scale: 0 });
if (!REDUCED) { L.inside.filters = [shimmer]; L.inside.filterArea = new Rectangle(O.x, O.y, O.w, O.h); }

// door: the open-door plate crop sits under; the closed door hinges up from its bottom edge
const D = LAYOUT.door;
const doorOpen = new Sprite(T('co-oven-door-open', 657, 540, 0x6e4a36)); doorOpen.position.set(D.open.x, D.open.y); doorOpen.width = D.open.w; doorOpen.height = D.open.h; doorOpen.alpha = 0; L.door.addChild(doorOpen);
const doorClosed = new Sprite(T('co-oven-door-closed', 657, 540, 0xf7c79c)); doorClosed.anchor.set(.5, 1);
doorClosed.position.set(D.x + D.w / 2, D.y + D.h); doorClosed.width = D.w; doorClosed.height = D.h; doorClosed.baseSY = doorClosed.scale.y; doorClosed.scale.y = 0; doorClosed.visible = false; L.door.addChild(doorClosed);
const doorGlow = new Graphics().roundRect(D.win[0], D.win[1], D.win[2], D.win[3], 10).fill({ color: 0xffa040, alpha: 1 }); doorGlow.blendMode = 'add'; doorGlow.alpha = 0; L.door.addChild(doorGlow);

// the dial (front layer, parallax), drawn with its own ink ring and detent ticks
const K = LAYOUT.dial;
const dialBox = new Container(); dialBox.position.set(K.x, K.y); L.front.addChild(dialBox);
const dialHalo = new Graphics().circle(0, 0, K.r * 1.32).stroke({ width: 7, color: ORANGE, alpha: .9 }); dialHalo.alpha = 0; dialBox.addChild(dialHalo);
const dial = new Sprite(T('co-oven-dial', 156, 156, 0xffffff)); dial.anchor.set(.5); dial.scale.set(K.r * 2 / dial.texture.width); dial.baseScale = dial.scale.x; dialBox.addChild(dial);
const ARC = [-150, 150], MAXV = 60, STEP = 5;
const angOf = (v) => (ARC[0] + (ARC[1] - ARC[0]) * v / MAXV) * Math.PI / 180;
dial.rotation = angOf(0);

// the tin (= the flat cake cut-out) waiting on the worktop, front layer
const tin = new Sprite(tex['co-cake-oven-flat'] || cakes[0].texture); tin.anchor.set(.5, 1); tin.scale.set(LAYOUT.tin.w / tin.texture.width); tin.baseScale = tin.scale.x;
tin.position.set(LAYOUT.tin.x, LAYOUT.tin.y); tin.visible = false; L.front.addChild(tin);
const tinShadow = new Graphics().ellipse(0, 0, LAYOUT.tin.w * .46, 12).fill({ color: INK, alpha: .16 }); tinShadow.position.set(LAYOUT.tin.x, LAYOUT.tin.y - 4); tinShadow.visible = false; L.front.addChildAt(tinShadow, 0);

// air: flour dust motes + steam puffs (outlined clear-line clouds)
const dust = []; const dustLayer = new Container(); L.air.addChild(dustLayer);
if (!REDUCED) for (let i = 0; i < 46; i++) { const g = new Graphics().circle(0, 0, 1.6 + Math.random() * 2.8).fill({ color: 0xfffaf0, alpha: 1 }); g.alpha = .25 + Math.random() * .55; g.position.set(Math.random() * PW, Math.random() * PH * .8); g.v = { x: (Math.random() - .5) * .08, y: -.02 - Math.random() * .05, ph: Math.random() * 6 }; dustLayer.addChild(g); dust.push(g); }
const steamLayer = new Container(); L.air.addChild(steamLayer); let steamOn = 0, steamAcc = 0;
function puff(x, y, big = 1) {
  const c = new Container(); const g = new Graphics(); const blobs = [[0, 0, 22], [-20, 6, 15], [19, 5, 16], [-6, -14, 15], [10, -12, 13]];
  blobs.forEach(([bx, by, r]) => g.circle(bx, by, r + 3).fill(INK)); blobs.forEach(([bx, by, r]) => g.circle(bx, by, r).fill(CREAM));
  c.addChild(g); c.position.set(x + (Math.random() - .5) * 30, y); c.scale.set(.35 * big); c.alpha = .95; steamLayer.addChild(c);
  const dx = (Math.random() - .5) * 60, life = 2200 + Math.random() * 900;
  tween(c, { y: y - 230 * big, x: c.x + dx, 'scale.x': 1.05 * big, 'scale.y': 1.05 * big, alpha: 0 }, life, 'outCubic').then(() => c.destroy());
}

// sparkles: four-point stars with an ink outline + dots (flat, graphic)
function star(r) { const pts = []; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .34 : r; pts.push(Math.cos(a) * rr, Math.sin(a) * rr); } return new Graphics().poly(pts).fill(GOLD).stroke({ width: 3, color: INK, join: 'round' }); }
function burst(gx, gy, n = 14, spread = 120) {
  if (REDUCED) n = 4;
  for (let i = 0; i < n; i++) {
    const s = i % 3 === 2 ? new Graphics().circle(0, 0, 4).fill(i % 2 ? ORANGE : GOLD) : star(9 + Math.random() * 12);
    s.position.set(gx, gy); s.scale.set(.2); fx.addChild(s);
    const a = Math.random() * Math.PI * 2, d = spread * (.45 + Math.random() * .7);
    tween(s, { x: gx + Math.cos(a) * d, y: gy + Math.sin(a) * d * .8, 'scale.x': 1, 'scale.y': 1, rotation: (Math.random() - .5) * 2 }, 520, 'outBack')
      .then(() => tween(s, { alpha: 0, 'scale.x': .3, 'scale.y': .3, y: s.y + 18 }, 520, 'inOutCubic', 160)).then(() => s.destroy());
  }
}
function flourPuff(x, y) { // a soft graphic ring of flour specks on landing (in world space)
  for (let i = 0; i < (REDUCED ? 0 : 16); i++) { const g = new Graphics().circle(0, 0, 3 + Math.random() * 4).fill(CREAM).stroke({ width: 1.5, color: INK, alpha: .5 }); g.position.set(x, y); L.air.addChild(g); const a = Math.PI + Math.random() * Math.PI; tween(g, { x: x + Math.cos(a) * 90, y: y + Math.sin(a) * 50, alpha: 0 }, 700, 'outCubic').then(() => g.destroy()); }
}

// ---------------------------------------------------------------- Mrs Bell: blink by swap, breathe, react
const bell = new Container(); cast.addChild(bell);
const bellSp = new Sprite(T('pt-bell-calm', 292, 420, 0x7c93ff)); bellSp.anchor.set(.5, 1); bell.addChild(bellSp);
let bellMood = 'calm', bellBaseS = 1;
function bellPose(m, hold = 0) {
  const t = tex['pt-bell-' + m]; if (!t) return; bellSp.texture = t; bellMood = m;
  if (!REDUCED) { bellSp.scale.set(bellBaseS * 1.04, bellBaseS * .97); tween(bellSp, { 'scale.x': bellBaseS, 'scale.y': bellBaseS }, 380, 'outElastic'); }
  if (hold) setTimeout(() => bellPose('calm'), hold);
}
function bellTalk() { if (REDUCED) return; tween(bell, { y: bell.baseY - 10 }, 140, 'outCubic').then(() => tween(bell, { y: bell.baseY }, 420, 'outBack')); }
// blink: a quick 110 ms swap calm -> blink -> calm every few seconds
(function blinkLoop() { setTimeout(() => { if (!REDUCED && bellMood === 'calm' && tex['pt-bell-blink']) { bellSp.texture = tex['pt-bell-blink']; setTimeout(() => { if (bellMood === 'calm') bellSp.texture = tex['pt-bell-calm']; }, 110); } blinkLoop(); }, 2600 + Math.random() * 2600); })();

// ---------------------------------------------------------------- layout + camera
let VW = 0, VH = 0, panel = { x: 8, y: 60, w: 374, h: 560 }, s0 = 1;
const cam = { fx: LAYOUT.rest.fx, fy: LAYOUT.rest.fy, zoom: 1 };     // focus in plate px
function layout() {
  VW = app.screen.width; VH = app.screen.height;
  const top = 58, ui = Math.max(232, VH * .28);
  panel.w = Math.min(VW - 16, 560); panel.x = (VW - panel.w) / 2; panel.y = top; panel.h = Math.min(VH - top - ui, panel.w * 1.6);
  if (VW >= 600) { panel.w = Math.min(panel.w, panel.h * PW * .84 / PH); panel.x = (VW - panel.w) / 2; }   // wide windows: narrow the panel so the whole plate height shows and the tin stays reachable
  s0 = Math.max(panel.h / PH, panel.w / (PW * .84));
  panelMask.clear().roundRect(panel.x, panel.y, panel.w, panel.h, 22).fill(0xffffff);
  panelInk.clear().roundRect(panel.x, panel.y, panel.w, panel.h, 22).stroke({ width: 3, color: INK });
  // Mrs Bell: bottom-left, breaking the bottom edge of the panel
  const bh = Math.min(panel.h * .36, 220); bellBaseS = bh / (bellSp.texture.height || 600); bellSp.scale.set(bellBaseS);
  bell.baseX = panel.x + bh * .3; bell.baseY = panel.y + panel.h + 26; bell.position.set(bell.baseX, bell.baseY);
  document.documentElement.style.setProperty('--panel-b', (panel.y + panel.h) + 'px');
  document.documentElement.style.setProperty('--panel-x', panel.x + 'px');
  document.documentElement.style.setProperty('--panel-w', panel.w + 'px');
  document.documentElement.style.setProperty('--bell-w', (bh * .62) + 'px');
}
function applyCam(t) {
  const s = s0 * cam.zoom, ax = panel.x + panel.w / 2, ay = panel.y + panel.h / 2;
  const sx = Math.sin(t * .00031) * 5, sy = Math.cos(t * .00023) * 4;            // idle drift: the world never fully stops
  for (const k in L) {
    const p = PAR[k], c = L[k];
    const fx_ = LAYOUT.rest.fx + (cam.fx - LAYOUT.rest.fx) * p, fy_ = LAYOUT.rest.fy + (cam.fy - LAYOUT.rest.fy) * p;
    c.scale.set(s); c.position.set(ax - fx_ * s + (REDUCED ? 0 : sx * (p - .9) * 3), ay - fy_ * s + (REDUCED ? 0 : sy * (p - .9) * 3));
  }
}
const toScreen = (layer, x, y) => { const c = L[layer]; return { x: c.position.x + x * c.scale.x, y: c.position.y + y * c.scale.y }; };
const toPlate = (layer, x, y) => { const c = L[layer]; return { x: (x - c.position.x) / c.scale.x, y: (y - c.position.y) / c.scale.y }; };
layout(); window.addEventListener('resize', () => setTimeout(layout, 30));

// ---------------------------------------------------------------- frame loop
let baking = 0, glowBase = .35, lastT = performance.now();
app.ticker.add(() => {
  const now = performance.now(), dt = Math.min(200, now - lastT); lastT = now;
  stepTweens(dt); applyCam(now);
  if (!REDUCED) {
    const pulse = .5 + .5 * Math.sin(now * (baking ? .006 : .0025));
    glow.alpha = glowBase * (.78 + .22 * pulse); glow.scale.set(1 + .03 * pulse);
    doorGlow.alpha = doorClosed.visible ? glowBase * (.28 + .12 * pulse) : 0;
    drawShafts(.85 + .15 * Math.sin(now * .0007));
    nSprite.x = (nSprite.x - dt * .05) % 384; nSprite.y = (nSprite.y - dt * .09) % 384;
    shimmer.scale.x = shimmer.scale.y = 3 + 7 * baking;
    for (const d of dust) { d.v.ph += dt * .001; d.x += d.v.x * dt + Math.sin(d.v.ph) * .08; d.y += d.v.y * dt; if (d.y < -10) { d.y = PH * .8; d.x = Math.random() * PW; } }
    const breath = Math.sin(now * .0021); bellSp.skew.x = 0; bell.scale.set(1 + .006 * breath, 1 + .014 * breath);
    if (steamOn) { steamAcc += dt; const every = 700 / steamOn; while (steamAcc > every) { steamAcc -= every; puff(LAYOUT.steam.x, LAYOUT.steam.y, .7 + .5 * steamOn); } }
    if (dialIdle) dialHalo.alpha = .35 + .45 * (.5 + .5 * Math.sin(now * .006)), dialHalo.scale.set(1 + .05 * Math.sin(now * .006));
  } else { glow.alpha = glowBase; drawShafts(1); doorGlow.alpha = doorClosed.visible ? glowBase * .3 : 0; }
});

// ---------------------------------------------------------------- the station: beats
let dialIdle = false, dialVal = 0;
const SHOTS = {
  intro: { fx: LAYOUT.intro.fx, fy: LAYOUT.intro.fy, zoom: 1.55 },
  rest:  { fx: LAYOUT.rest.fx, fy: LAYOUT.rest.fy, zoom: 1 },
  tin:   { fx: LAYOUT.rest.fx, fy: LAYOUT.rest.fy + 40, zoom: 1.02 },
  dial:  { fx: LAYOUT.dialShot.fx, fy: LAYOUT.dialShot.fy, zoom: 1.28 },
  bake:  { fx: O.cx, fy: O.cy, zoom: 1.42 },
};
const camTo = (s, ms = 1400, e = 'inOutSine') => tween(cam, { fx: s.fx, fy: s.fy, zoom: s.zoom }, ms, e);

async function intro() {
  Object.assign(cam, SHOTS.intro);
  ui.bars.forEach(b => b.classList.add('in')); ui.title.classList.add('in');
  bell.alpha = 0;
  await wait(500);
  await camTo(SHOTS.rest, 3600, 'inOutCubic');
  ui.title.classList.remove('in'); ui.bars.forEach(b => b.classList.remove('in'));
  bell.y = bell.baseY + 80; bell.alpha = 1; tween(bell, { y: bell.baseY }, 620, 'outBack');
  await wait(380);
}

async function beatTin() {
  tin.visible = tinShadow.visible = true; tin.alpha = 0; tin.y = LAYOUT.tin.y + 30;
  tween(tin, { alpha: 1, y: LAYOUT.tin.y }, 500, 'outBack');
  say('tin');   // not awaited: the tin can be grabbed while she speaks
  camTo(SHOTS.tin, 900);
  cue('Drag the tin into the oven');
  await dragTin();
  cue('');
}
function dragTin() {
  return new Promise(res => {
    tin.eventMode = 'static'; tin.cursor = 'grab';
    const hint = setInterval(() => { if (!dragging && !REDUCED) tween(tin, { y: LAYOUT.tin.y - 26 }, 260, 'outCubic').then(() => tween(tin, { y: LAYOUT.tin.y }, 520, 'outBack')); }, 2400);
    let dragging = false, off = { x: 0, y: 0 };
    tin.on('pointerdown', (e) => { dragging = true; const p = toPlate('front', e.global.x, e.global.y); off = { x: tin.x - p.x, y: tin.y - p.y }; tween(tin, { 'scale.x': tin.baseScale * 1.12, 'scale.y': tin.baseScale * 1.12 }, 160, 'outBack'); sfx('pop'); });
    app.stage.eventMode = 'static'; app.stage.hitArea = app.screen;
    app.stage.on('pointermove', (e) => { if (!dragging) return; const p = toPlate('front', e.global.x, e.global.y); const nx = p.x + off.x, ny = p.y + off.y; tin.rotation = Math.max(-.25, Math.min(.25, (nx - tin.x) * .02)); tin.x = nx; tin.y = ny; tinShadow.x = nx; tinShadow.y = ny - 4; tinShadow.alpha = .5; });
    const up = async () => {
      if (!dragging) return; dragging = false; tin.rotation = 0;
      const inOven = tin.x > O.x && tin.x < O.x + O.w && tin.y > O.y && tin.y < O.y + O.h + 120;
      if (!inOven) { sfx('nope'); tween(tin, { x: LAYOUT.tin.x, y: LAYOUT.tin.y, 'scale.x': tin.baseScale, 'scale.y': tin.baseScale }, 520, 'outBack'); tinShadow.position.set(LAYOUT.tin.x, LAYOUT.tin.y - 4); tinShadow.alpha = 1; return; }
      clearInterval(hint); app.stage.off('pointermove'); app.stage.off('pointerup'); app.stage.off('pointerupoutside'); tin.eventMode = 'none';
      await placeTin(); res();
    };
    app.stage.on('pointerup', up); app.stage.on('pointerupoutside', up);
    window.__autoTin = async () => { clearInterval(hint); app.stage.removeAllListeners(); tin.eventMode = 'none'; await placeTin(); res(); };
  });
}
async function placeTin() {
  tinShadow.visible = false;
  const target = toPlate('front', ...Object.values(toScreen('inside', C.x, C.y)));
  await tween(tin, { x: target.x, y: target.y, 'scale.x': cakes[0].baseScale * 1.08, 'scale.y': cakes[0].baseScale * 1.08 }, 380, 'outCubic');
  tin.visible = false; const c = cakes[0]; c.alpha = 1;
  // landing: squash then stretch back, a thunk + flour
  c.scale.set(c.baseScale * 1.22, c.baseScale * .74); tween(c, { 'scale.x': c.baseScale, 'scale.y': c.baseScale }, 560, 'outElastic');
  sfx('thunk'); flourPuff(C.x, C.y - 10); glowBase = .5;
  await wait(420);
  await closeDoor();
}
async function closeDoor() {
  doorClosed.visible = true; doorClosed.scale.y = 0;
  await tween(doorClosed.scale, { y: doorClosed.baseSY * 1.04 }, 420, 'inOutCubic'); sfx('thunk');
  await tween(doorClosed.scale, { y: doorClosed.baseSY }, 260, 'outBack');
  if (!REDUCED) { const wx = L.door.x; L.door.x += 3; tween(L.door, { x: wx }, 200, 'outElastic'); }
}
async function openDoor() {
  sfx('thunk');
  await tween(doorClosed.scale, { y: 0 }, 460, 'inOutCubic'); doorClosed.visible = false;
}

async function beatDial() { console.log('beat dial');
  await camTo(SHOTS.dial, 1100);
  ui.readout.classList.add('in'); setReadout(0);
  say('dial');
  cue('Turn the dial');
  dialIdle = true;
  for (;;) {
    const v = await turnDial();
    dialIdle = false;
    if (v === 30) break;
    sfx('nope'); bellPose('oh', 1800);
    if (!REDUCED) { const x0 = dialBox.x; for (const dx of [10, -8, 5, 0]) await tween(dialBox, { x: x0 + dx }, 60, 'linear'); }
    say(v > 30 ? 'long' : 'short', v); dialIdle = true;
  }
  cue('');
  // snap + success
  dial.scale.set(dial.baseScale * 1.18, dial.baseScale * .88); tween(dial.scale, { x: dial.baseScale, y: dial.baseScale }, 620, 'outElastic');
  const sp = toScreen('front', K.x, K.y); burst(sp.x, sp.y, 16, 110); sfx('pop');
  tween(dialHalo, { alpha: 0 }, 300); bellPose('warm', 1600);
  await wait(700);
}
function setReadout(v) { ui.readout.querySelector('b').textContent = v; ui.readout.querySelector('i').textContent = NUM[v]; ui.readout.classList.remove('bump'); void ui.readout.offsetWidth; ui.readout.classList.add('bump'); }
function turnDial() {
  return new Promise(res => {
    dial.eventMode = 'static'; dial.cursor = 'grab'; dial.hitArea = new Rectangle(-dial.texture.width * .8, -dial.texture.height * .8, dial.texture.width * 1.6, dial.texture.height * 1.6);
    let on = false;
    const angAt = (e) => { const c = toScreen('front', K.x, K.y); return Math.atan2(e.global.x - c.x, -(e.global.y - c.y)) * 180 / Math.PI; };
    dial.on('pointerdown', () => { on = true; });
    app.stage.eventMode = 'static'; app.stage.hitArea = app.screen;
    app.stage.on('pointermove', (e) => {
      if (!on) return; const a = Math.max(ARC[0], Math.min(ARC[1], angAt(e)));
      const v = Math.round(((a - ARC[0]) / (ARC[1] - ARC[0]) * MAXV) / STEP) * STEP;
      if (v !== dialVal) { dialVal = v; sfx('tick'); setReadout(v); tween(dial, { rotation: angOf(v) }, 120, 'outBack'); if (!REDUCED) { dial.scale.set(dial.baseScale * 1.05); tween(dial.scale, { x: dial.baseScale, y: dial.baseScale }, 160, 'outCubic'); } }
    });
    const up = () => { if (!on) return; on = false; done(dialVal); };
    const done = (v) => { app.stage.removeAllListeners(); dial.removeAllListeners(); dial.eventMode = 'none'; res(v); };
    app.stage.on('pointerup', up); app.stage.on('pointerupoutside', up);
    window.__setDial = async (v) => { for (let x = dialVal; x !== v; x += Math.sign(v - x) * 5) { dialVal = x + Math.sign(v - x) * 5; sfx('tick'); setReadout(dialVal); dial.rotation = angOf(dialVal); await wait(90); } done(v); };
  });
}

async function beatBake() { console.log('beat bake'); ui.balloon.classList.remove('in');
  camTo(SHOTS.bake, 2600, 'inOutCubic');
  baking = 1; glowBase = .85; steamOn = .4;
  const ms = REDUCED ? 300 : 6000, t0 = performance.now();
  // the dial counts down while the cake rises: flat -> rising -> risen, crossfade + a vertical warp with overshoot
  const states = [0, 1, 2];
  const rise = async (i) => {
    const a = cakes[i - 1], b = cakes[i]; b.alpha = 0; b.scale.set(b.baseScale * 1.02, b.baseScale * .82);
    tween(a, { alpha: 0 }, 700, 'inOutSine'); await tween(b, { alpha: 1, 'scale.y': b.baseScale * 1.07 }, 900, 'outCubic');
    await tween(b.scale, { y: b.baseScale }, 600, 'outElastic');
  };
  const countdown = (async () => { for (let v = 30; v >= 0; v -= 5) { setReadout(v); dial.rotation = angOf(v); sfx('tick'); await wait(ms / 7); } })();
  await wait(ms * .33); await rise(1); steamOn = .7;
  await wait(ms * .22); await rise(2); steamOn = 1;
  await countdown; void t0; void states;
  ui.readout.classList.remove('in');
}

async function beatDone() { console.log('beat done');
  sfx('ding'); bellPose('oh'); baking = .3;
  const sp = toScreen('door', D.x + D.w / 2, D.y + D.h * .45); burst(sp.x, sp.y, 22, 170);
  await wait(500); await openDoor();
  for (let i = 0; i < 5; i++) puff(O.cx + (i - 2) * 40, O.y + 20, 1.4);
  glowBase = .5; steamOn = .5;
  const c = cakes[2]; c.scale.set(c.baseScale * .9, c.baseScale * 1.12); tween(c.scale, { x: c.baseScale, y: c.baseScale }, 700, 'outElastic');
  burst(...Object.values(toScreen('inside', C.x, C.y - 60)), 12, 120);
  camTo(SHOTS.rest, 1600);
  bellPose('warm');
  await say('done');
  cta('Next station', () => { ui.end.classList.add('in'); });
}

document.querySelector('#end a').onclick = (e) => { e.preventDefault(); location.reload(); };
ui.skip.onclick = () => { tweens.forEach(t => { t.t = t.ms; }); };

// ---------------------------------------------------------------- run (or jump to a shot for screenshots)
const shot = Q.get('shot');
window.__ready = false;
async function run() {
  if (shot === 'intro') { Object.assign(cam, SHOTS.intro); ui.bars.forEach(b => b.classList.add('in')); ui.title.classList.add('in'); bell.alpha = 0; tween(cam, { zoom: 1.4, fy: LAYOUT.intro.fy + 120 }, 1600, 'inOutSine'); window.__ready = true; return; }
  if (!shot) await intro();
  if (shot === 'tin') { tin.visible = tinShadow.visible = true; say('tin'); cue('Drag the tin into the oven'); Object.assign(cam, SHOTS.tin); window.__ready = true; return; }
  if (!shot) await beatTin();
  else { cakes[0].alpha = 1; doorClosed.visible = true; doorClosed.scale.y = doorClosed.baseSY; glowBase = .5; }
  if (shot === 'dial') { Object.assign(cam, SHOTS.dial); ui.readout.classList.add('in'); dialVal = 25; setReadout(25); dial.rotation = angOf(25); say('dial'); cue('Turn the dial'); dialIdle = true; window.__ready = true; return; }
  if (!shot) await beatDial();
  if (shot === 'bake') { Object.assign(cam, SHOTS.bake); baking = 1; glowBase = .85; steamOn = 1; cakes[0].alpha = 0; cakes[1].alpha = 1; ui.readout.classList.add('in'); setReadout(15); dial.rotation = angOf(15); ui.balloon.classList.remove('in'); bellPose('calm'); window.__ready = true; return; }
  if (!shot) await beatBake();
  if (shot === 'done') { cakes[0].alpha = 0; cakes[2].alpha = 1; doorClosed.visible = true; }
  await beatDone();
  window.__ready = true;
}
$('#boot').classList.add('gone');
run();
