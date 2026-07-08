import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { BIRD_W, BIRD_H, getBirdPixelRects } from './birdIconPixels.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'icons');

const SKY_BANDS = [
    { y: 0.0, h: 0.18, c: '#1a1a4e' },
    { y: 0.18, h: 0.18, c: '#1e3a6e' },
    { y: 0.36, h: 0.22, c: '#2d5a8e' },
    { y: 0.58, h: 0.22, c: '#4a82b8' },
    { y: 0.8, h: 0.12, c: '#6aafd8' },
    { y: 0.92, h: 0.08, c: '#87CEEB' },
];

/** @param {number} size @param {{ widthFill?: number, heightFill?: number, yCenter?: number }} [opts] */
function birdLayout(size, opts = {}) {
    const widthFill = opts.widthFill ?? 0.82;
    const heightFill = opts.heightFill ?? 0.66;
    const yCenter = opts.yCenter ?? 0.52;
    const scale = Math.min((size * widthFill) / BIRD_W, (size * heightFill) / BIRD_H);
    const birdPxW = BIRD_W * scale;
    const birdPxH = BIRD_H * scale;
    const bx = (size - birdPxW) / 2;
    const by = yCenter * size - birdPxH / 2;
    return { scale, bx, by };
}

function birdGroupSvg(layout) {
    const rects = getBirdPixelRects()
        .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.c}"/>`)
        .join('\n    ');
    return `<g transform="translate(${layout.bx},${layout.by}) scale(${layout.scale})" shape-rendering="crispEdges">
    ${rects}
  </g>`;
}

function sunSvg(size) {
    const r = Math.max(4, Math.round(size * 0.11));
    const cx = Math.round(size * 0.78);
    const cy = Math.round(size * 0.16);
    return [
        `<circle cx="${cx}" cy="${cy}" r="${Math.round(r * 1.45)}" fill="#FFD700" opacity="0.18"/>`,
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFD700"/>`,
    ].join('\n  ');
}

function starsSvg(size) {
    const positions = [
        [0.1, 0.07],
        [0.25, 0.03],
        [0.42, 0.1],
        [0.58, 0.05],
        [0.38, 0.19],
    ];
    return positions
        .map(([fx, fy]) => {
            const x = Math.round(fx * size);
            const y = Math.round(fy * size);
            const r = Math.max(1, Math.round(size * 0.012));
            return `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity="0.7"/>`;
        })
        .join('\n  ');
}

function skyRectsSvg(size) {
    return SKY_BANDS.map((b) => {
        const y = Math.round(b.y * size);
        const h = Math.max(1, Math.round(b.h * size));
        return `<rect x="0" y="${y}" width="${size}" height="${h}" fill="${b.c}"/>`;
    }).join('\n  ');
}

/** Icône d’app : ciel plein cadre, oiseau large (écran d’accueil / apple-touch). */
function appIconSvg(size) {
    const layout = birdLayout(size);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${skyRectsSvg(size)}
  ${starsSvg(size)}
  ${sunSvg(size)}
  ${birdGroupSvg(layout)}
</svg>`;
}

/** Favicon navigateur : fond uni, oiseau seul, remplit ~92 % du carré. */
function faviconSvg(size) {
    const inset = size * 0.04;
    const avail = size - inset * 2;
    const scale = Math.min(avail / BIRD_W, avail / BIRD_H);
    const birdPxW = BIRD_W * scale;
    const birdPxH = BIRD_H * scale;
    const bx = (size - birdPxW) / 2;
    const by = (size - birdPxH) / 2;
    const layout = { scale, bx, by };
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#1a1a4e"/>
  ${birdGroupSvg(layout)}
</svg>`;
}

async function writePngFromSvg(svg, name, size) {
    const buf = Buffer.from(svg);
    await sharp(buf, { density: 192 })
        .resize(size, size, { kernel: sharp.kernel.nearest })
        .png({ compressionLevel: 9 })
        .toFile(path.join(outDir, name));
}

fs.mkdirSync(outDir, { recursive: true });

await writePngFromSvg(appIconSvg(512), 'icon-512.png', 512);
await writePngFromSvg(appIconSvg(192), 'icon-192.png', 192);
await writePngFromSvg(appIconSvg(180), 'icon-180.png', 180);
await writePngFromSvg(appIconSvg(512), 'icon-maskable-512.png', 512);
await writePngFromSvg(appIconSvg(192), 'icon-maskable-192.png', 192);
await writePngFromSvg(faviconSvg(48), 'favicon-48.png', 48);
await writePngFromSvg(faviconSvg(32), 'favicon-32.png', 32);
await writePngFromSvg(faviconSvg(16), 'favicon-16.png', 16);

const faviconSvgFile = faviconSvg(32).replace(
    'width="32" height="32"',
    'width="32" height="32" role="img" aria-label="Floppy Bird"'
);
fs.writeFileSync(path.join(outDir, 'favicon.svg'), faviconSvgFile, 'utf8');

for (const f of [
    'favicon.svg',
    'favicon-16.png',
    'favicon-32.png',
    'favicon-48.png',
    'icon-180.png',
    'icon-192.png',
    'icon-512.png',
    'icon-maskable-192.png',
    'icon-maskable-512.png',
]) {
    const kb = (fs.statSync(path.join(outDir, f)).size / 1024).toFixed(1);
    console.log(`✓ ${f}: ${kb} Ko`);
}
