import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const targets = ['dist', 'coverage', 'dev-dist', 'test-results', 'playwright-report'];

for (const name of targets) {
    const dir = path.join(root, '..', name);
    if (!fs.existsSync(dir)) continue;
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✓ supprimé ${name}/`);
}

console.log('Artefacts locaux nettoyés (voir .gitignore).');
