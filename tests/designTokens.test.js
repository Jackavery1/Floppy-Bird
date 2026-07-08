import { describe, it, expect, vi } from 'vitest';
import {
    DESIGN_TOKENS,
    hexVersPhaser,
    hudTextStyle,
    menuTextStyle,
    panelChromeTextStyle,
} from '../src/designTokens.js';

function hexToRgb(hex) {
    const n = Number.parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg, bg) {
    const l1 = relativeLuminance(fg);
    const l2 = relativeLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

describe('designTokens', () => {
    it('expose les couleurs fond jour/nuit', () => {
        expect(DESIGN_TOKENS.fondJour).toBe('#87ceeb');
        expect(DESIGN_TOKENS.fondNuit).toBe('#1a1a2e');
    });

    it('hexVersPhaser convertit en entier Phaser', () => {
        expect(hexVersPhaser('#fdd835')).toBe(0xfdd835);
    });

    it('hudTextStyle applique le contour HUD', () => {
        expect(hudTextStyle({ fill: '#fff' })).toEqual({
            stroke: DESIGN_TOKENS.contourHud,
            strokeThickness: 2,
            fill: '#fff',
        });
    });

    it('hudTextStyle épaissit le contour en prefers-contrast: more', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query) => ({
                matches: query.includes('prefers-contrast: more'),
                media: query,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            }))
        );
        vi.resetModules();
        const { hudTextStyle: hudContraste } = await import('../src/designTokens.js');
        expect(hudContraste().strokeThickness).toBe(3);
        vi.unstubAllGlobals();
    });

    it('menuTextStyle applique le contour menu', () => {
        expect(menuTextStyle({ fill: DESIGN_TOKENS.texteMenu })).toEqual({
            stroke: DESIGN_TOKENS.contourMenu,
            strokeThickness: 2,
            fill: DESIGN_TOKENS.texteMenu,
        });
    });

    it('texte HUD blanc atteint AA sur fond nuit (contour noir en jeu)', () => {
        expect(
            contrastRatio(DESIGN_TOKENS.texteHud, DESIGN_TOKENS.fondNuit)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('texte HUD blanc seul sous AA sur fond jour — contour noir requis', () => {
        expect(contrastRatio(DESIGN_TOKENS.texteHud, DESIGN_TOKENS.fondJour)).toBeLessThan(4.5);
        expect(hudTextStyle().stroke).toBe(DESIGN_TOKENS.contourHud);
        expect(
            contrastRatio(DESIGN_TOKENS.contourHud, DESIGN_TOKENS.fondJour)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('accent record atteint AA sur fond nuit', () => {
        expect(contrastRatio(DESIGN_TOKENS.accent, DESIGN_TOKENS.fondNuit)).toBeGreaterThanOrEqual(
            4.5
        );
    });

    it('texteHintFaible reste lisible sur fond panneau game over', () => {
        expect(
            contrastRatio(DESIGN_TOKENS.texteHintFaible, DESIGN_TOKENS.fondPanneauGameOver)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('contour badge daily atteint AA sur fond jour', () => {
        expect(
            contrastRatio(DESIGN_TOKENS.badgeDailyContour, DESIGN_TOKENS.fondJour)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('badges HUD utilisent un contour sombre (lisibilité mode jour)', () => {
        expect(hudTextStyle({ fill: DESIGN_TOKENS.badgeDaily }).stroke).toBe(
            DESIGN_TOKENS.contourHud
        );
        expect(
            hudTextStyle({
                fill: DESIGN_TOKENS.badgeDaily,
                stroke: DESIGN_TOKENS.badgeDailyContour,
            }).stroke
        ).toBe(DESIGN_TOKENS.badgeDailyContour);
    });

    it('texteVerrouille atteint AA sur cadre skin', () => {
        expect(
            contrastRatio(DESIGN_TOKENS.texteVerrouille, DESIGN_TOKENS.cadreSkinFond)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('texteSecondaire atteint AA sur fond nuit', () => {
        expect(
            contrastRatio(DESIGN_TOKENS.texteSecondaire, DESIGN_TOKENS.fondNuit)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('texteHintMenu atteint AA sur fond nuit', () => {
        expect(
            contrastRatio(DESIGN_TOKENS.texteHintMenu, DESIGN_TOKENS.fondNuit)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('panelChromeTextStyle impose 12 px minimum', () => {
        expect(panelChromeTextStyle().fontSize).toBe('12px');
    });

    it('expose les couleurs Phaser médailles et confettis', async () => {
        const { MEDAILLE_COLORS_PHASER, CONFETTI_COLORS_PHASER, hexVersPhaser } =
            await import('../src/designTokens.js');
        expect(MEDAILLE_COLORS_PHASER.or).toBe(hexVersPhaser(DESIGN_TOKENS.medailleOr));
        expect(CONFETTI_COLORS_PHASER.length).toBe(5);
    });
});
