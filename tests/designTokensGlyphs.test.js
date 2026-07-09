import { describe, it, expect } from 'vitest';
import { GLYPHES_TITRE_UI } from '../src/designTokens.js';

/** Plages unicode couvertes par latin + latin-ext (@fontsource). */
const LATIN_RANGES = [
    [0x0000, 0x007f],
    [0x0080, 0x00ff],
    [0x0100, 0x017f],
    [0x0180, 0x024f],
];

function isLatinOrLatinExt(codePoint) {
    return LATIN_RANGES.some(([min, max]) => codePoint >= min && codePoint <= max);
}

describe('designTokens glyphes titre', () => {
    it('les lettres accentuées titre sont couvertes par latin-ext', () => {
        const letters = GLYPHES_TITRE_UI.replace(/[^A-Za-zÀ-ÿ]/g, '');
        const missing = [];
        for (const char of letters) {
            const cp = char.codePointAt(0);
            if (!isLatinOrLatinExt(cp)) missing.push(char);
        }
        expect(missing, `hors subset : ${missing.join(' ')}`).toEqual([]);
    });
});
