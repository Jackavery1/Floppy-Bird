import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();

/** Classes référencées par le shell jeu (HTML + JS bootstrap/a11y). */
const REFERENCED_SHELL_CLASSES = Object.freeze([
    'loading-inner',
    'loading-label',
    'loading-dots',
    'visually-hidden',
    'a11y-btn',
    'partie-active',
    'game-ready',
    'hidden',
]);

/** Héritent d’un parent stylé (#loading) — pas de règle dédiée requise. */
const ALLOW_INHERITED_CLASSES = Object.freeze([]);

function extractCssClasses(css) {
    const classes = new Set();
    for (const match of css.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
        classes.add(match[1]);
    }
    for (const match of css.matchAll(/html\.([a-zA-Z_][\w-]*)/g)) {
        classes.add(match[1]);
    }
    classes.delete('css');
    classes.delete('woff2');
    return classes;
}

describe('cssShellClasses', () => {
    it('classes shell référencées ont une règle CSS (style.css)', () => {
        const cssPath = resolve(ROOT, 'style.css');
        const defined = extractCssClasses(readFileSync(cssPath, 'utf8'));
        const missing = REFERENCED_SHELL_CLASSES.filter(
            (name) => !defined.has(name) && !ALLOW_INHERITED_CLASSES.includes(name)
        );
        expect(missing, `classes sans règle dans style.css: ${missing.join(', ')}`).toEqual([]);
    });

    it('style.css n’accumule pas de sélecteurs orphelins connus', () => {
        const cssPath = resolve(ROOT, 'style.css');
        const defined = extractCssClasses(readFileSync(cssPath, 'utf8'));
        const allowUnused = new Set(['offline-shell']);
        const likelyOrphans = [...defined].filter(
            (name) =>
                !REFERENCED_SHELL_CLASSES.includes(name) &&
                !allowUnused.has(name) &&
                !name.startsWith('tokens-')
        );
        expect(likelyOrphans).toEqual([]);
    });

    it('style.css déclare safe-area via env()', () => {
        const css = readFileSync(resolve(ROOT, 'style.css'), 'utf8');
        expect(css).toMatch(/env\(safe-area-inset-top\)/);
        expect(css).toMatch(/env\(safe-area-inset-bottom\)/);
    });

    it('a11y-btn : repère tactile coarse pointer sans masquer le canvas', () => {
        const css = readFileSync(resolve(ROOT, 'style.css'), 'utf8');
        const coarseBlock = css.match(/@media \(pointer: coarse\)\s*\{([\s\S]*?)\n\}/);
        expect(coarseBlock?.[1]).toMatch(/\.a11y-btn\s*\{[\s\S]*opacity:\s*0\.08/);
    });
});
