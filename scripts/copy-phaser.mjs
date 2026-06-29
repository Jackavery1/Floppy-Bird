import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targetDir = join(root, 'public', 'vendor');
const source = join(root, 'node_modules', 'phaser', 'dist', 'phaser.min.js');
const target = join(targetDir, 'phaser.min.js');

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
