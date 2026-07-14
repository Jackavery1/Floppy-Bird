import { describe, it, expect } from 'vitest';
import { DESIGN_TOKENS } from '../src/designTokens.js';
import { isHexColor, listColorTokens, UI_STATE_GALLERY } from '../src/tokensPage.js';

describe('tokensPage', () => {
    it('isHexColor détecte les valeurs hex', () => {
        expect(isHexColor('#fdd835')).toBe(true);
        expect(isHexColor('fdd835')).toBe(false);
        expect(isHexColor(42)).toBe(false);
    });

    it('listColorTokens extrait les couleurs du registre', () => {
        const colors = listColorTokens(DESIGN_TOKENS);
        expect(colors.length).toBeGreaterThan(20);
        expect(colors.some(([name]) => name === 'accent')).toBe(true);
        expect(colors.every(([, hex]) => isHexColor(hex))).toBe(true);
    });

    it('UI_STATE_GALLERY documente les écrans principaux', () => {
        expect(UI_STATE_GALLERY.map((s) => s.id)).toEqual(['menu', 'playing', 'pause', 'gameover']);
    });
});
