#!/usr/bin/env node
/*
 * Build the image derivatives used by /photography/.
 *
 *   npm install sharp        (once)
 *   node tools/build-images.js            # build anything missing
 *   node tools/build-images.js --force    # rebuild everything
 *   node tools/build-images.js 20260414   # rebuild one photo
 *
 * Reads the photo list from _data/photography.yml and writes, per photo:
 *
 *   assets/img/photography/thumb/<name>@1x|2x|3x.avif|webp|jpg
 *       grid thumbnails. Landscape cells are 150x100 css px and portrait
 *       cells 73px wide, so 1x/2x/3x cover normal through 3x-density screens.
 *   assets/img/photography/large/<name>.jpg  and  .avif
 *       2560px longest edge, used by the lightbox. The <a href> points at the
 *       JPEG; the page swaps in the AVIF where the browser supports it.
 *
 * Originals in assets/img/photography/<name>.jpg are the archive copy and are
 * never modified or deleted. EXIF orientation is applied (.rotate()) so the
 * derivatives match what a browser shows for the original.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets/img/photography');
const OUT_THUMB = path.join(SRC, 'thumb');
const OUT_LARGE = path.join(SRC, 'large');
const DATA = path.join(ROOT, '_data/photography.yml');

const LANDSCAPE_H = 100; // css px, see _sass/layouts/_photography.scss
const PORTRAIT_W = 73;
const DENSITIES = [1, 2, 3];
const LARGE_EDGE = 2560;

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

/* Minimal reader for the shape of _data/photography.yml: track the nearest
   "layout:" above each "- file:" entry. Avoids a YAML dependency. */
function readPhotos() {
  const out = [];
  let layout = 'landscape';
  for (const line of fs.readFileSync(DATA, 'utf8').split('\n')) {
    const l = line.match(/^\s*-?\s*layout:\s*(\w+)/);
    if (l) { layout = l[1]; continue; }
    const f = line.match(/^\s*-\s*file:\s*"?([\w-]+)"?/);
    if (f) out.push({ name: f[1], layout });
  }
  return out;
}

async function build(photo) {
  const { name, layout } = photo;
  const src = path.join(SRC, name + '.jpg');
  if (!fs.existsSync(src)) { console.warn(`! missing original: ${name}.jpg`); return null; }

  let firstJpeg = null;
  for (const d of DENSITIES) {
    const stem = path.join(OUT_THUMB, `${name}@${d}x`);
    const resize = layout === 'portrait'
      ? { width: PORTRAIT_W * d, withoutEnlargement: true }
      : { height: LANDSCAPE_H * d, withoutEnlargement: true };
    const base = sharp(src).rotate().resize(resize).sharpen({ sigma: 0.6 });
    for (const [ext, encode] of [
      ['avif', (p) => p.avif({ quality: 63, effort: 4 })],
      ['webp', (p) => p.webp({ quality: 82 })],
      ['jpg', (p) => p.jpeg({ quality: 84, mozjpeg: true, progressive: true })],
    ]) {
      const file = `${stem}.${ext}`;
      if (!force && fs.existsSync(file)) continue;
      const info = await encode(base.clone()).toFile(file);
      if (d === 1 && ext === 'jpg') firstJpeg = info;
    }
  }
  if (!firstJpeg) firstJpeg = await sharp(path.join(OUT_THUMB, `${name}@1x.jpg`)).metadata();

  const big = sharp(src).rotate().resize({ width: LARGE_EDGE, height: LARGE_EDGE, fit: 'inside', withoutEnlargement: true });
  for (const [ext, encode] of [
    ['jpg', (p) => p.jpeg({ quality: 82, mozjpeg: true, progressive: true })],
    ['avif', (p) => p.avif({ quality: 58, effort: 4 })],
  ]) {
    const file = path.join(OUT_LARGE, `${name}.${ext}`);
    if (!force && fs.existsSync(file)) continue;
    await encode(big.clone()).toFile(file);
  }
  return { w: firstJpeg.width, h: firstJpeg.height };
}

(async () => {
  fs.mkdirSync(OUT_THUMB, { recursive: true });
  fs.mkdirSync(OUT_LARGE, { recursive: true });

  const photos = readPhotos().filter((p) => !only.length || only.includes(p.name));
  console.log(`${photos.length} photo(s)${force ? ', forced rebuild' : ''}`);

  const yaml = fs.readFileSync(DATA, 'utf8');
  const mismatches = [];
  for (const p of photos) {
    const dims = await build(p);
    if (!dims) continue;
    // The page sets width/height from the 1x thumbnail; warn if the data file drifted.
    const block = yaml.split(`file: "${p.name}"`)[1] || '';
    const w = (block.match(/w:\s*(\d+)/) || [])[1];
    const h = (block.match(/h:\s*(\d+)/) || [])[1];
    if (+w !== dims.w || +h !== dims.h) mismatches.push(`${p.name}: w: ${dims.w}  h: ${dims.h}`);
    console.log(`  ${p.name} (${p.layout}) 1x ${dims.w}x${dims.h}`);
  }
  if (mismatches.length) {
    console.log('\nUpdate these w/h values in _data/photography.yml:');
    mismatches.forEach((m) => console.log('  ' + m));
  }
})();
