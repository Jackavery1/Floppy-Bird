import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targetDir = join(root, 'public', 'vendor');
const source = join(root, 'node_modules', 'phaser', 'dist', 'phaser.min.js');
const target = join(targetDir, 'phaser.min.js');

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);

const fontDir = join(root, 'public', 'fonts');
mkdirSync(fontDir, { recursive: true });

for (const subset of ['latin', 'latin-ext']) {
    const name = `press-start-2p-${subset}-400-normal.woff2`;
    copyFileSync(
        join(root, 'node_modules', '@fontsource', 'press-start-2p', 'files', name),
        join(fontDir, name)
    );
}
