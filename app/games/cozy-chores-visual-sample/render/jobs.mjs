// Cozy Chores visual sample: oven station renders (art3 clear-line recipe, PRE3/POST3)
// node jobs.mjs -> jobs.json ; then: node <art3>/tools/local.mjs jobs.json out vulkan
import fs from 'fs';
const PRE3 = "clear line comic art, classic European adventure comic album style: clean thin uniform black outlines, flat unshaded colour fills, simple cartoon face with small dot eyes, no hatching, no gradients, no texture, no shading: ";
const POST3 = ". Clean flat colouring like a printed 1960s comic album, bright cheerful flat colours, crisp uniform black outlines, ligne claire, no text";
const ISO = ". Isolated on a plain pure white background, nothing else in the picture, centered";
const J = {
  plate: { w: 704, h: 880, p: "inside a cosy old English village bakery kitchen in bright morning daylight, seen straight on and close: a big cream enamel kitchen range cooker fills the middle of the picture, its large oven door folded down and open so you look into the empty bright oven with one wire shelf and warm orange light inside, a row of round cream control knobs along the top of the cooker, pale mint green and white square wall tiles around it, copper pans hanging from a rail above, a wooden worktop at the bottom edge with a folded checked tea towel and a jar of wooden spoons, sunlight on the tiles, no people" },
  door: { w: 704, h: 576, p: "the closed front door of a cream enamel kitchen oven seen straight on, a wide rectangular door with rounded corners, a big rectangular glass window in the middle showing a dark brown interior, a long chrome handle bar across the top edge" + ISO },
  cakes: { w: 1024, h: 384, p: "three identical straight-sided round silver metal cake tins in a row with space between them, seen exactly from the side in flat elevation like a shop sign, the top of each tin not visible, each tin drawn as a plain silver rectangle: the left tin has only a thin flat strip of pale yellow batter just showing at its rim, the middle tin has a low soft golden sponge dome just above its rim, the right tin has a tall light brown baked sponge cake with a big rounded top and a small crack across the crust rising high above its rim" + ISO },
  dial: { w: 512, h: 512, p: "one single round oven timer knob seen straight from the front, a cream enamel disc with a chrome rim, a raised grip bar across its centre with one short straight red line painted on the end of the bar, a ring of short black tick marks around the edge, no numbers, no cast shadow" + ISO },
  bell: { w: 1056, h: 528, p: "very simple cartoon character expression sheet, the same kind old English baker lady drawn three times side by side, all three facing straight forward, head and shoulders only, simple round face with two small solid black dots for eyes, a small nose, thin plain eyebrows, no wrinkles, no pink cheeks, no lipstick, no eyelashes, flat skin colour, bold black outlines, short fluffy white curly hair, a white apron bib over a plain blue blouse with one blue sling strap over the shoulder; left: small closed smile, middle: wide open happy smile, right: eyebrows raised and a small round open mouth; no arms and no hands in the picture, on a plain pure white background, nothing else in the picture" },
};
const seeds = (process.env.SEEDS || '23').split(',').map(Number);
const only = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(J);
const jobs = [];
for (const k of only) for (const s of seeds) jobs.push({ name: k, seed: s, w: J[k].w, h: J[k].h, prompt: PRE3 + J[k].p + POST3 });
fs.writeFileSync(process.env.OUT || 'jobs.json', JSON.stringify(jobs, null, 1));
console.log(jobs.length, 'jobs');
