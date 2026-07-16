import { describe, it, expect } from 'vitest';
import { GLYPHES_TITRE_UI } from '../src/designTokens.js';

/** Plages unicode du subset latin @fontsource (inclut œ U+0152–0153). */
const LATIN_RANGES = [
    [0x0000, 0x00ff],
    [0x0131, 0x0131],
    [0x0152, 0x0153],
];

function isLatinSubset(codePoint) {
    return LATIN_RANGES.some(([min, max]) => codePoint >= min && codePoint <= max);
}

describe('designTokens glyphes titre', () => {
    it('les lettres accentuées titre sont couvertes par le subset latin', () => {
        const letters = GLYPHES_TITRE_UI.replace(/[^A-Za-zÀ-ÿŒœ]/g, '');
        const missing = [];
        for (const char of letters) {
            const cp = char.codePointAt(0);
            if (!isLatinSubset(cp)) missing.push(char);
        }
        expect(missing, `hors subset latin : ${missing.join(' ')}`).toEqual([]);
    });
});
