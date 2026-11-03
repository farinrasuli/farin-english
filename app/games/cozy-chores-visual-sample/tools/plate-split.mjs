// node tools/plate-split.mjs <render.png> -> render/tmp/plate-base.png (open door painted out by stretching the cooker row above it)
//   + render/tmp/door-open-full.png (the open door alone, alpha where the base differs) ; coordinates in 704x880 render px
import fs from 'fs'; import { sharp } from './lib.mjs';
const [src] = process.argv.slice(2); const P = JSON.parse(fs.readFileSync('render/pick.json', 'utf8')).patch; // {x0,x1,y0,y1,row}
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, base = Buffer.from(data), door = Buffer.alloc(W * info.height * 4);
for (let y = P.y0; y <= P.y1; y++) for (let x = P.x0; x <= P.x1; x++) {
  const s = (P.row * W + x) * 3, d = (y * W + x) * 3; base[d] = data[s]; base[d + 1] = data[s + 1]; base[d + 2] = data[s + 2];
}
for (let i = 0, n = W * info.height; i < n; i++) {
  const diff = Math.abs(base[i * 3] - data[i * 3]) + Math.abs(base[i * 3 + 1] - data[i * 3 + 1]) + Math.abs(base[i * 3 + 2] - data[i * 3 + 2]);
  door[i * 4] = data[i * 3]; door[i * 4 + 1] = data[i * 3 + 1]; door[i * 4 + 2] = data[i * 3 + 2]; door[i * 4 + 3] = diff > 18 ? 255 : 0;
}
fs.mkdirSync('render/tmp', { recursive: true });
await sharp(base, { raw: { width: W, height: info.height, channels: 3 } }).png().toFile('render/tmp/plate-base.png');
await sharp(door, { raw: { width: W, height: info.height, channels: 4 } }).extract({ left: P.x0, top: P.y0, width: P.x1 - P.x0 + 1, height: P.y1 - P.y0 + 1 }).png().toFile('render/tmp/door-open-full.png');
console.log('ok');
