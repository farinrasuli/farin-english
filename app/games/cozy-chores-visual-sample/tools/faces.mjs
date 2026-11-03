// node tools/faces.mjs -> render/tmp/bell-<mood>.png: one Bell render, face interior flattened to skin and redrawn with dot eyes (GAME-ART-STYLE §3).
// FLUX keeps drawing lashes and blush, so every mood shares one body and only the features change.
import { sharp } from './lib.mjs';
const SRC = 'render/out/bell-s11.png', W = 1056, H = 528, INK = '#17120f', S = 5;
const FACE = '806,165 820,150 845,146 868,146 878,160 889,168 900,158 905,148 925,150 945,162 955,180 953,250 940,272 915,290 880,296 845,292 815,278 800,255 800,180';
const dot = (x, y, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
const line = (d, w = S) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const nose = line('M872 230 q6 7 11 0');
const MOODS = {
  calm: dot(846, 212) + dot(906, 212) + line('M826 186 q18 -11 36 -3') + line('M890 183 q18 -8 36 3') + nose + line('M852 255 q24 15 48 0'),
  blink: line('M838 213 h16') + line('M898 213 h16') + line('M826 186 q18 -11 36 -3') + line('M890 183 q18 -8 36 3') + nose + line('M852 255 q24 15 48 0'),
  warm: dot(846, 210) + dot(906, 210) + line('M826 182 q18 -13 36 -5') + line('M890 177 q18 -8 36 5') + nose
    + `<path d="M846 250 q30 7 60 0 q-5 30 -30 30 q-25 0 -30 -30 z" fill="#b5392f" stroke="${INK}" stroke-width="${S}" stroke-linejoin="round"/>`,
  oh: dot(846, 212) + dot(906, 212) + line('M826 176 q18 -13 36 -6') + line('M890 170 q18 -7 36 6') + nose
    + `<ellipse cx="876" cy="263" rx="11" ry="14" fill="#b5392f" stroke="${INK}" stroke-width="${S}"/>`,
};
const { data, info } = await sharp(SRC).extract({ left: 876, top: 195, width: 3, height: 3 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const skin = `rgb(${data[0]},${data[1]},${data[2]})`;
console.log('skin', skin, info.width);
for (const [m, f] of Object.entries(MOODS)) {
  const svg = `<svg width="${W}" height="${H}"><polygon points="${FACE}" fill="${skin}"/>${f}</svg>`;
  await sharp(SRC).composite([{ input: Buffer.from(svg) }]).png().toFile(`render/tmp/bell-${m}.png`);
}
