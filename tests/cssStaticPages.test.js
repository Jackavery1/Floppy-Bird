import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();

function extractCssClasses(css) {
    const classes = new Set();
    for (const match of css.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
        classes.add(match[1]);
    }
    return classes;
}

function extractHtmlClasses(html) {
    const classes = new Set();
    for (const match of html.matchAll(/class="([^"]+)"/g)) {
        for (const name of match[1].split(/\s+/)) {
            if (name) classes.add(name);
        }
    }
    return classes;
}

describe('cssStaticPages', () => {
    it('offline.html référence des classes définies dans offline-page.css', () => {
        const html = readFileSync(resolve(ROOT, 'public/offline.html'), 'utf8');
        const css = readFileSync(resolve(ROOT, 'public/offline-page.css'), 'utf8');
        const defined = extractCssClasses(css);
        const referenced = extractHtmlClasses(html);
        const missing = [...referenced].filter((name) => !defined.has(name));
        expect(missing, `classes offline sans règle: ${missing.join(', ')}`).toEqual([]);
    });

    it('tokens.html référence des classes définies dans tokensPage.css', () => {
        const html = readFileSync(resolve(ROOT, 'tokens.html'), 'utf8');
        const css = readFileSync(resolve(ROOT, 'src/tokensPage.css'), 'utf8');
        const defined = extractCssClasses(css);
        const referenced = extractHtmlClasses(html);
        const missing = [...referenced].filter((name) => !defined.has(name));
        expect(missing, `classes tokens sans règle: ${missing.join(', ')}`).toEqual([]);
    });

    it('tokensPage.js génère des classes présentes dans tokensPage.css', () => {
        const css = readFileSync(resolve(ROOT, 'src/tokensPage.css'), 'utf8');
        const js = readFileSync(resolve(ROOT, 'src/tokensPage.js'), 'utf8');
        const defined = extractCssClasses(css);
        const generated = new Set();
        for (const match of js.matchAll(/className:\s*'([^']+)'/g)) {
            generated.add(match[1]);
        }
        for (const match of js.matchAll(/className\s*=\s*'([^']+)'/g)) {
            generated.add(match[1]);
        }
        for (const match of js.matchAll(/class="([^"]+)"/g)) {
            for (const name of match[1].split(/\s+/)) {
                if (name) generated.add(name);
            }
        }
        for (const state of ['menu', 'playing', 'pause', 'gameover']) {
            generated.add(`tokens-ui-card--${state}`);
        }
        const missing = [...generated].filter((name) => !defined.has(name));
        expect(missing, `classes JS tokens sans règle: ${missing.join(', ')}`).toEqual([]);
    });
});
