import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
    SHELL_TOKEN_CSS_FALLBACKS,
    SHELL_HIGH_CONTRAST_CSS_VARS,
} from '../src/shellTokenDefaults.js';

function normalizeCssValue(value) {
    return value.replace(/"/g, "'").replace(/\s+/g, ' ').trim();
}

function parseShellTokensCss(css) {
    /** @type {Record<string, string>} */
    const vars = {};
    for (const match of css.matchAll(/--([a-z0-9-]+):\s*([^;]+);/gi)) {
        vars[`--${match[1]}`] = match[2].trim();
    }
    return vars;
}

describe('shellTokenSync', () => {
    it('shell-tokens.css aligne shellTokenDefaults (designTokens + spacing)', () => {
        const cssPath = resolve(process.cwd(), 'public/shell-tokens.css');
        const parsed = parseShellTokensCss(readFileSync(cssPath, 'utf8'));
        for (const [name, expected] of Object.entries(SHELL_TOKEN_CSS_FALLBACKS)) {
            expect(normalizeCssValue(parsed[name]), `${name} dans shell-tokens.css`).toBe(
                normalizeCssValue(expected)
            );
        }
    });

    it('shellHighContrast aligne shellTokenDefaults', () => {
        expect(SHELL_HIGH_CONTRAST_CSS_VARS['--couleur-accent']).toBe('#ffeb3b');
        expect(SHELL_HIGH_CONTRAST_CSS_VARS['--couleur-texte-chargement']).toBe('#bbdefb');
    });

    it('expose les variables d’alerte shell AA', () => {
        expect(SHELL_TOKEN_CSS_FALLBACKS['--couleur-alerte']).toBe('#C62828');
        expect(SHELL_TOKEN_CSS_FALLBACKS['--couleur-alerte-texte']).toBe('#ffffff');
    });

    it('sync:tokens:check — shell-tokens.css à jour', () => {
        const cssPath = resolve(process.cwd(), 'public/shell-tokens.css');
        const parsed = parseShellTokensCss(readFileSync(cssPath, 'utf8'));
        for (const [name, expected] of Object.entries(SHELL_TOKEN_CSS_FALLBACKS)) {
            expect(normalizeCssValue(parsed[name]), `${name} après sync:tokens`).toBe(
                normalizeCssValue(expected)
            );
        }
    });
});
