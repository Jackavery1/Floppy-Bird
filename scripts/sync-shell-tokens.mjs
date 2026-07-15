import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SHELL_TOKEN_CSS_FALLBACKS } from '../src/shellTokenDefaults.js';

const cssPath = resolve(process.cwd(), 'public/shell-tokens.css');
const checkOnly = process.argv.includes('--check');

const lines = [
    '/* Tokens shell — généré par scripts/sync-shell-tokens.mjs. Source JS : src/shellTokenDefaults.js */',
    ':root {',
    ...Object.entries(SHELL_TOKEN_CSS_FALLBACKS).map(([name, value]) => `    ${name}: ${value};`),
    '}',
    '',
];
const content = lines.join('\n');

if (checkOnly) {
    const existing = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';
    if (existing !== content) {
        console.error(
            'public/shell-tokens.css désynchronisé — lancez npm run sync:tokens puis committez.'
        );
        process.exit(1);
    }
    process.exit(0);
}

writeFileSync(cssPath, content, 'utf8');
console.log(`Écrit ${cssPath}`);
