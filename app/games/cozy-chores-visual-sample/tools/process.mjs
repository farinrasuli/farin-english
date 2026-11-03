// node tools/process.mjs [piece...]  ->  art/<id>.webp
// Reads the picked FLUX renders from render/out/ (names set in PICK below). Plates: 704x880 -> lanczos 864x1080, WebP q80 <= 150 KB,
// luminance >= 0.55. Cut-outs: flood-cut (below), trim, manifest size, WebP+alpha <= 30 KB.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { sharp, luminance, webpUnder } from './lib.mjs';
sharp.cache(false);   // sharp keeps files open otherwise, and Windows then refuses the rewrite of the same webp
const D = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(D, 'render', 'out'), TMP = path.join(D, 'render', 'tmp'), ART = path.join(D, 'art');
fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(ART, { recursive: true });
const PICK = JSON.parse(fs.readFileSync(path.join(D, 'render', 'pick.json'), 'utf8'));
const save = async (id, img, maxKB) => {
  const f = path.join(ART, id + '.webp'); const r = await webpUnder(img, f, maxKB);
  const m = await sharp(f).metadata(); console.log(id, m.width + 'x' + m.height, r.kb + ' KB q' + r.q); return f;
};
// Cut by flood-filling the white paper in from the open edges, so whites inside the outlines (apron, hair, tin) stay solid.
async function flood(srcFile, dstFile, open = ['t', 'l', 'r', 'b']) {
  const { data, info } = await sharp(srcFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, seen = new Uint8Array(W * H), st = [];
  const paper = (i) => data[i * 4] > 228 && data[i * 4 + 1] > 228 && data[i * 4 + 2] > 228;
  const push = (x, y) => { const i = y * W + x; if (!seen[i] && paper(i)) { seen[i] = 1; st.push(i); } };
  for (let x = 0; x < W; x++) { if (open.includes('t')) push(x, 0); if (open.includes('b')) push(x, H - 1); }
  for (let y = 0; y < H; y++) { if (open.includes('l')) push(0, y); if (open.includes('r')) push(W - 1, y); }
  while (st.length) { const i = st.pop(), x = i % W, y = (i - x) / W; data[i * 4 + 3] = 0; if (x) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y) push(x, y - 1); if (y < H - 1) push(x, y + 1); }
  await sharp(data, { raw: info }).png().toFile(dstFile);
}
async function cutout(src, box, id, size, maxKB = 30, opts = {}) {
  const crop = path.join(TMP, id + '-crop.png'), cutf = path.join(TMP, id + '-cut.png');
  let img = sharp(src); if (box) img = img.extract({ left: box[0], top: box[1], width: box[2], height: box[3] });
  await img.png().toFile(crop);
  await flood(crop, cutf, opts.open);
  let c = opts.noTrim ? sharp(cutf) : sharp(cutf).trim({ threshold: 1 });
  const tb = await c.png().toBuffer();
  let out = sharp(tb).resize(size.w ? { width: size.w, height: size.h, fit: size.h && size.w ? 'contain' : 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' } : { height: size.h, kernel: 'lanczos3' });
  return save(id, out, maxKB);
}
const jobs = {
  async plate() {
    const f = path.join(OUT, PICK.plate + '.png');
    const img = sharp(f).resize(864, 1080, { kernel: 'lanczos3' });
    const p = await save('plate-bakery-oven', img.webp({ quality: 80 }), 150);
    const L = await luminance(p); console.log('  luminance', L.toFixed(3), L >= .55 ? 'OK' : 'LOW');
  },
  async doorOpen() {   // the side-hinged open door, split from the plate by plate-split.mjs (one base, never generated twice)
    const img = sharp(path.join(TMP, 'door-open-full.png')).resize(174, 280, { fit: 'fill', kernel: 'lanczos3' });
    await save('co-oven-door-open', img, 30);
  },
  async doorClosed() {
    const src = path.join(OUT, PICK.door + '.png'); const f = await cutout(src, PICK.doorCrop, 'co-oven-door-closed', { w: 657, h: 497 }, 30);
    if (PICK.doorWin) {   // see-through glass: the window keeps 38 % alpha so the cake and glow show through
      const { data, info } = await sharp(fs.readFileSync(f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); const [x, y, w, h] = PICK.doorWin;
      for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) { const k = (j * info.width + i) * 4 + 3; data[k] = Math.min(data[k], 96); }
      await save('co-oven-door-closed', sharp(data, { raw: info }), 30);
    }
  },
  async cakes() {
        const H = { flat: 130, rising: 151, risen: 173 };
    for (const k of ['flat', 'rising', 'risen']) await cutout(path.join(OUT, PICK.cakes[k][0] + '.png'), PICK.cakes[k][1], 'co-cake-oven-' + k, { w: 225, h: H[k] }, 30);
  },
  async dial() {   // a knob is a circle: mask it exactly instead of cutting
    const [l, t, s] = PICK.dialCrop; const mask = Buffer.from(`<svg width="${s}" height="${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - 1}" fill="#fff"/></svg>`);
    const buf = await sharp(path.join(OUT, PICK.dial + '.png')).extract({ left: l, top: t, width: s, height: s }).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
    await save('co-oven-dial', sharp(buf).resize(156, 156, { kernel: 'lanczos3' }), 30);
  },
  async bell() {
        for (const k of ['calm', 'blink', 'warm', 'oh']) await cutout(path.join(TMP, 'bell-' + k + '.png'), PICK.bellBox, 'pt-bell-' + k, { h: 420 }, 40, { noTrim: true, open: ['t', 'l', 'r'] });
  },
};
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(jobs);
for (const k of want) await jobs[k]();
