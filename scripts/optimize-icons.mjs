import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicIcons = path.join(__dirname, '..', 'public', 'icons');
const source = path.join(publicIcons, 'icon-512.png');

if (!fs.existsSync(source)) {
    console.error('Placez une image source dans public/icons/icon-512.png');
    process.exit(1);
}

fs.mkdirSync(publicIcons, { recursive: true });

await sharp(source)
    .resize(512, 512, { fit: 'cover' })
    .png({ quality: 82, compressionLevel: 9 })
    .toFile(path.join(publicIcons, 'icon-512.png'));

await sharp(source)
    .resize(192, 192, { fit: 'cover' })
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(path.join(publicIcons, 'icon-192.png'));

const s192 = fs.statSync(path.join(publicIcons, 'icon-192.png')).size;
const s512 = fs.statSync(path.join(publicIcons, 'icon-512.png')).size;
console.log(`Icônes : 192px=${(s192 / 1024).toFixed(1)} Ko, 512px=${(s512 / 1024).toFixed(1)} Ko`);
