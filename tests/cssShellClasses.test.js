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
    'skip-link',
    'a11y-btn',
    'partie-active',
    'game-ready',
    'hidden',
    'pwa-install',
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
    function definedShellClasses() {
        const files = ['style.css', 'style-pwa.css'];
        const defined = new Set();
        for (const file of files) {
            for (const name of extractCssClasses(readFileSync(resolve(ROOT, file), 'utf8'))) {
                defined.add(name);
            }
        }
        return defined;
    }

    it('classes shell référencées ont une règle CSS (style.css / style-pwa.css)', () => {
        const defined = definedShellClasses();
        const missing = REFERENCED_SHELL_CLASSES.filter(
            (name) => !defined.has(name) && !ALLOW_INHERITED_CLASSES.includes(name)
        );
        expect(missing, `classes sans règle CSS: ${missing.join(', ')}`).toEqual([]);
    });

    it('style.css n’accumule pas de sélecteurs orphelins connus', () => {
        const defined = extractCssClasses(readFileSync(resolve(ROOT, 'style.css'), 'utf8'));
        const likelyOrphans = [...defined].filter(
            (name) => !REFERENCED_SHELL_CLASSES.includes(name) && !name.startsWith('tokens-')
        );
        expect(likelyOrphans).toEqual([]);
    });

    it('style-pwa.css ne contient que le CTA install', () => {
        const defined = extractCssClasses(readFileSync(resolve(ROOT, 'style-pwa.css'), 'utf8'));
        expect(defined.has('pwa-install')).toBe(true);
        expect([...defined].every((n) => n === 'pwa-install' || n === 'partie-active')).toBe(true);
    });

    it('style.css déclare safe-area via env()', () => {
        const css = readFileSync(resolve(ROOT, 'style.css'), 'utf8');
        expect(css).toMatch(/env\(safe-area-inset-top\)/);
        expect(css).toMatch(/env\(safe-area-inset-bottom\)/);
    });

    it('a11y-btn : repère discret desktop et tactile coarse pointer', () => {
        const css = readFileSync(resolve(ROOT, 'style.css'), 'utf8');
        expect(css).toMatch(/\.a11y-btn\s*\{[\s\S]*opacity:\s*0\.12/);
        const coarseBlock = css.match(/@media \(pointer: coarse\)\s*\{([\s\S]*?)\n\}/);
        expect(coarseBlock?.[1]).toMatch(/\.a11y-btn\s*\{[\s\S]*opacity:\s*0\.14/);
    });
});
