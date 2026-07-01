import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { BIRD_W, BIRD_H, getBirdPixelRects } from './birdIconPixels.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'icons');

// Gradient matching the new game background (dark night → sky blue)
const SKY_BANDS = [
    { y: 0.00, h: 0.18, c: '#1a1a4e' },
    { y: 0.18, h: 0.18, c: '#1e3a6e' },
    { y: 0.36, h: 0.22, c: '#2d5a8e' },
    { y: 0.58, h: 0.22, c: '#4a82b8' },
    { y: 0.80, h: 0.12, c: '#6aafd8' },
    { y: 0.92, h: 0.08, c: '#87CEEB' },
];

// Soleil (coin supérieur droit de l'icône)
function sunSvg(size) {
    const r = Math.max(4, Math.round(size * 0.11));
    const cx = Math.round(size * 0.78);
    const cy = Math.round(size * 0.16);
    return [
        // Halo
        `<circle cx="${cx}" cy="${cy}" r="${Math.round(r * 1.45)}" fill="#FFD700" opacity="0.18"/>`,
        // Disque
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFD700"/>`,
    ].join('\n  ');
}

// Quelques étoiles dans la zone sombre
function starsSvg(size) {
    const positions = [
        [0.10, 0.07], [0.25, 0.03], [0.42, 0.10], [0.58, 0.05], [0.38, 0.19],
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

function iconSvg(size) {
    // Scale de l'oiseau : occupe ~70% de la largeur et ~55% de la hauteur
    const scale = Math.max(6, Math.floor(Math.min((size * 0.72) / BIRD_W, (size * 0.55) / BIRD_H)));
    const birdPxW = BIRD_W * scale;
    const birdPxH = BIRD_H * scale;
    const bx = Math.round((size - birdPxW) / 2);
    // Légèrement en dessous du centre pour laisser de la place au ciel
    const by = Math.round(size * 0.52 - birdPxH / 2);

    const skyRects = SKY_BANDS.map(b => {
        const y = Math.round(b.y * size);
        const h = Math.max(1, Math.round(b.h * size));
        return `<rect x="0" y="${y}" width="${size}" height="${h}" fill="${b.c}"/>`;
    }).join('\n  ');

    const birdRects = getBirdPixelRects()
        .map(r =>
            `<rect x="${bx + r.x * scale}" y="${by + r.y * scale}" width="${r.w * scale}" height="${r.h * scale}" fill="${r.c}"/>`
        )
        .join('\n  ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${skyRects}
  ${starsSvg(size)}
  ${sunSvg(size)}
  <g shape-rendering="crispEdges">
  ${birdRects}
  </g>
</svg>`;
}

async function writePng(name, size) {
    const buf = Buffer.from(iconSvg(size));
    await sharp(buf, { density: 144 })
        .resize(size, size, { kernel: sharp.kernel.nearest })
        .png({ compressionLevel: 9 })
        .toFile(path.join(outDir, name));
}

fs.mkdirSync(outDir, { recursive: true });

await writePng('icon-512.png', 512);
await writePng('icon-192.png', 192);
await writePng('icon-180.png', 180);
await writePng('favicon-32.png', 32);

for (const f of ['favicon-32.png', 'icon-180.png', 'icon-192.png', 'icon-512.png']) {
    const kb = (fs.statSync(path.join(outDir, f)).size / 1024).toFixed(1);
    console.log(`✓ ${f}: ${kb} Ko`);
}
