// Where things sit on the rendered oven plate, in plate pixels (864x1080). Measured on render/out/plate-s23.png (x1.227).
export const LAYOUT = {
  oven:  { x: 221, y: 456, w: 356, h: 226, cx: 399, cy: 569, rx: 178, ry: 113 },   // the open oven mouth
  door:  { x: 209, y: 442, w: 380, h: 251, win: [274, 500, 246, 120], open: { x: 577, y: 430, w: 174, h: 280 } },   // closed-door box, its glass window, the side-hinged open door
  cake:  { x: 399, y: 650, w: 190 },                                                 // bottom-centre of the cake on the lower shelf
  dial:  { x: 421, y: 352, r: 52 },
  tin:   { x: 600, y: 1000, w: 230 },
  steam: { x: 399, y: 440 },
  shafts: { bands: [[560, 70], [660, 40], [720, 90]], slant: -420 },
  rest:  { fx: 432, fy: 560 },
  intro: { fx: 640, fy: 200 },
  dialShot: { fx: 421, fy: 420 },
};
