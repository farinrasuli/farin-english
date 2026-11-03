import * as esbuild from 'esbuild';
const RX = /gpu[\/]WebGPURenderer\.mjs$|canvas[\/]CanvasRenderer\.mjs$|accessibility[\/]init\.mjs$|spritesheet[\/]init\.mjs$|dom[\/]init\.mjs$/;
const stub = { name: 'stub', setup(b) {
  b.onResolve({ filter: RX }, a => ({ path: a.path, namespace: 'stub' }));
  b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const WebGPURenderer=null, CanvasRenderer=null;' }));
} };
await esbuild.build({ entryPoints: ['entry.mjs'], bundle: true, format: 'esm', minify: true, target: 'es2020', outfile: 'out/pixi-slim.mjs', legalComments: 'none', plugins: [stub],
  banner: { js: '/* PixiJS v8.22.0 (MIT, https://pixijs.com) slim build for the Cozy Chores visual sample: WebGL only; no WebGPU/Canvas renderer, accessibility, DOM container or spritesheet. */' } });
