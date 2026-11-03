// shared helpers for the sample's art pipeline (sharp from the art3 tools, imgly cut from FEschool/social/tools/segment)
import { createRequire } from 'module'; import { spawnSync } from 'child_process'; import fs from 'fs'; import path from 'path';
const require = createRequire('D:/farin/Claude/specs/your-call-v2/art3/tools/package.json');
export const sharp = require('sharp');
export const CUT = 'D:/farin/FEschool/social/tools/segment/cut.mjs';
export function cut(inp, out) {
  const r = spawnSync(process.execPath, [CUT, path.resolve(inp), path.resolve(out)], { cwd: path.dirname(CUT), encoding: 'utf8', maxBuffer: 1 << 26 });
  if (!fs.existsSync(out)) throw new Error('cut failed ' + inp + ' ' + (r.stderr || '').slice(-400));
}
// mean relative luminance (sRGB -> linear, Rec.709 weights)
export async function luminance(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const lin = (v) => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  let s = 0; for (let i = 0; i < data.length; i += 3) s += .2126 * lin(data[i]) + .7152 * lin(data[i + 1]) + .0722 * lin(data[i + 2]);
  return s / (info.width * info.height);
}
// write a WebP with alpha under a byte budget, stepping quality down
export async function webpUnder(img, out, maxKB, q0 = 86) {
  for (let q = q0; q >= 40; q -= 4) {
    const buf = await img.clone().webp({ quality: q, alphaQuality: 90, effort: 6, smartSubsample: true }).toBuffer();
    if (buf.length <= maxKB * 1024 || q <= 44) { fs.writeFileSync(out, buf); return { q, kb: +(buf.length / 1024).toFixed(1) }; }
  }
}
