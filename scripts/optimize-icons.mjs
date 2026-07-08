import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
    console.error('Dossier public/icons introuvable — exécutez npm run icons d’abord.');
    process.exit(1);
}

const pngFiles = fs.readdirSync(iconsDir).filter((name) => name.endsWith('.png'));
if (pngFiles.length === 0) {
    console.error('Aucun PNG dans public/icons.');
    process.exit(1);
}

let savedBytes = 0;

for (const name of pngFiles) {
    const filePath = path.join(iconsDir, name);
    const before = fs.statSync(filePath).size;
    const optimized = await sharp(filePath).png({ compressionLevel: 9 }).toBuffer();
    if (optimized.length < before) {
        fs.writeFileSync(filePath, optimized);
        savedBytes += before - optimized.length;
    }
    const after = fs.statSync(filePath).size;
    console.log(`✓ ${name}: ${(after / 1024).toFixed(1)} Ko`);
}

const total = pngFiles.reduce((sum, name) => sum + fs.statSync(path.join(iconsDir, name)).size, 0);
console.log(
    `Icônes PNG : ${pngFiles.length} fichiers, ${(total / 1024).toFixed(1)} Ko total` +
        (savedBytes > 0 ? ` (−${(savedBytes / 1024).toFixed(1)} Ko)` : '')
);
