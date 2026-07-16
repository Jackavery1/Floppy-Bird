import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targetDir = join(root, 'public', 'vendor');
const source = join(root, 'node_modules', 'phaser', 'dist', 'phaser.min.js');
const target = join(targetDir, 'phaser.min.js');
const sriPath = join(targetDir, 'phaser.min.js.sri');

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);

const hash = createHash('sha384').update(readFileSync(target)).digest('base64');
writeFileSync(sriPath, `sha384-${hash}\n`);

const fontDir = join(root, 'public', 'fonts');
mkdirSync(fontDir, { recursive: true });

// offline.html : latin uniquement (subset jeu = latin ; accents FR + œ inclus).
copyFileSync(
    join(
        root,
        'node_modules',
        '@fontsource',
        'press-start-2p',
        'files',
        'press-start-2p-latin-400-normal.woff2'
    ),
    join(fontDir, 'press-start-2p-latin-400-normal.woff2')
);
