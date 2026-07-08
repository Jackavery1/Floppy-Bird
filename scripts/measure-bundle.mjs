import fs from 'fs';
import path from 'path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

function walkFiles(dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    for (const name of fs.readdirSync(dir)) {
        const filePath = path.join(dir, name);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) out.push(...walkFiles(filePath));
        else out.push({ path: filePath, bytes: stat.size });
    }
    return out;
}

function dirSizeBytes(dir) {
    return walkFiles(dir).reduce((sum, f) => sum + f.bytes, 0);
}

function gzipKo(bytes) {
    const gz = zlib.gzipSync(bytes);
    return Math.round((gz.length / 1024) * 10) / 10;
}

function assetEntry(filePath, assetsDir) {
    const bytes = fs.readFileSync(filePath);
    return {
        name: path.relative(assetsDir, filePath),
        ko: Math.round((bytes.length / 1024) * 10) / 10,
        gzipKo: gzipKo(bytes),
    };
}

const dist = path.join(root, '..', 'dist');
const icons = path.join(root, '..', 'public', 'icons');
const distBytes = dirSizeBytes(dist);
const iconsBytes = dirSizeBytes(icons);
const assetsDir = path.join(dist, 'assets');
const jsAssets = walkFiles(assetsDir)
    .filter((f) => f.path.endsWith('.js'))
    .map((f) => assetEntry(f.path, assetsDir))
    .sort((a, b) => b.ko - a.ko);
const cssAssets = walkFiles(assetsDir)
    .filter((f) => f.path.endsWith('.css'))
    .map((f) => assetEntry(f.path, assetsDir))
    .sort((a, b) => b.ko - a.ko);
const vendorPath = path.join(dist, 'vendor', 'phaser.min.js');
const vendorJs = fs.existsSync(vendorPath) ? fs.statSync(vendorPath).size : 0;
const appJsGzipKo = jsAssets.reduce((sum, f) => sum + f.gzipKo, 0);

console.log(
    JSON.stringify(
        {
            distKo: Math.round((distBytes / 1024) * 10) / 10,
            iconsKo: Math.round((iconsBytes / 1024) * 10) / 10,
            vendorPhaserKo: Math.round((vendorJs / 1024) * 10) / 10,
            appJsGzipKo: Math.round(appJsGzipKo * 10) / 10,
            jsAssets,
            cssAssets,
        },
        null,
        2
    )
);
