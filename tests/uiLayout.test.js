import { describe, it, expect } from 'vitest';
import { diffButtonCenter, diffLabelColor } from '../src/uiLayout.js';
import { DIFFICULTY } from '../src/config.js';

describe('uiLayout', () => {
    it('calcule le centre des boutons difficulté', () => {
        expect(diffButtonCenter(0)).toBe(32 + 34);
        expect(diffButtonCenter(1)).toBe(110 + 34);
    });

    it('colore le bouton actif en noir', () => {
        expect(diffLabelColor(DIFFICULTY.NORMAL, DIFFICULTY.NORMAL)).toBe('#000000');
        expect(diffLabelColor(DIFFICULTY.NORMAL, DIFFICULTY.HARD)).toBe('#ff8888');
    });
});
