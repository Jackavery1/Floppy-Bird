import { describe, it, expect, vi } from 'vitest';
import {
    DESIGN_TOKENS,
    hexVersPhaser,
    hudTextStyle,
    menuHomeTextStyle,
    menuTextStyle,
    panelChromeTextStyle,
} from '../src/designTokens.js';

vi.mock('../src/backgroundPeriod.js', () => ({
    getBackgroundPeriod: vi.fn(() => 'night'),
}));

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

    it('texte chargement jour atteint AA sur fond ciel', () => {
        expect(contrastRatio(DESIGN_TOKENS.texteChargement, DESIGN_TOKENS.fondJour)).toBeLessThan(
            4.5
        );
        expect(
            contrastRatio(DESIGN_TOKENS.texteChargementJour, DESIGN_TOKENS.fondJour)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('texte HUD blanc seul sous AA sur fond jour — fill jour + contour noir', async () => {
        expect(contrastRatio(DESIGN_TOKENS.texteHud, DESIGN_TOKENS.fondJour)).toBeLessThan(4.5);
        expect(
            contrastRatio(DESIGN_TOKENS.texteHudJour, DESIGN_TOKENS.fondJour)
        ).toBeGreaterThanOrEqual(4.5);
        expect(
            contrastRatio(DESIGN_TOKENS.contourHud, DESIGN_TOKENS.fondJour)
        ).toBeGreaterThanOrEqual(4.5);

        const { getBackgroundPeriod } = await import('../src/backgroundPeriod.js');
        getBackgroundPeriod.mockReturnValue('day');
        vi.resetModules();
        const { hudTextStyle: hudJour, DESIGN_TOKENS: tokens } =
            await import('../src/designTokens.js');
        const style = hudJour({ fill: tokens.texteHud });
        expect(style.fill).toBe(tokens.texteHudJour);
        expect(style.stroke).toBe(tokens.contourHud);
        expect(hudJour({ fill: tokens.texteMenu }).fill).toBe(tokens.texteHudJour);
        getBackgroundPeriod.mockReturnValue('night');
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

    it('menuHomeTextStyle hint first-run garde le contour HUD en fond jour', async () => {
        const { getBackgroundPeriod } = await import('../src/backgroundPeriod.js');
        vi.mocked(getBackgroundPeriod).mockReturnValue('day');
        const style = menuHomeTextStyle({
            fill: DESIGN_TOKENS.texteHintMenu,
            fontStyle: 'italic',
        });
        expect(style.stroke).toBe(DESIGN_TOKENS.contourHud);
        expect(contrastRatio(style.stroke, DESIGN_TOKENS.fondJour)).toBeGreaterThanOrEqual(4.5);
        vi.mocked(getBackgroundPeriod).mockReturnValue('night');
    });

    it('panelChromeTextStyle impose 14 px par défaut', () => {
        expect(panelChromeTextStyle().fontSize).toBe('14px');
    });

    it('renforce le contour HUD en fond jour', async () => {
        const { getBackgroundPeriod } = await import('../src/backgroundPeriod.js');
        vi.mocked(getBackgroundPeriod).mockReturnValue('day');
        const style = hudTextStyle();
        expect(style.strokeThickness).toBeGreaterThanOrEqual(4);
        expect(style.shadow).toEqual(
            expect.objectContaining({ color: DESIGN_TOKENS.contourHud, stroke: true })
        );
        vi.mocked(getBackgroundPeriod).mockReturnValue('night');
        expect(hudTextStyle().strokeThickness).toBe(2);
        expect(hudTextStyle().shadow).toBeUndefined();
    });

    it('expose teinteCoyoteActif pour le feedback sprite', () => {
        expect(DESIGN_TOKENS.teinteCoyoteActif).toBe('#FFD54F');
    });

    it('pastels HUD restent lisibles sur fond jour avec contour', async () => {
        const { getBackgroundPeriod } = await import('../src/backgroundPeriod.js');
        vi.mocked(getBackgroundPeriod).mockReturnValue('day');
        for (const fill of [
            DESIGN_TOKENS.accentGap,
            DESIGN_TOKENS.bannerStreak,
            DESIGN_TOKENS.bannerEscalation,
            DESIGN_TOKENS.badgeHardcore,
            DESIGN_TOKENS.badgeDaily,
        ]) {
            const stroke = hudTextStyle({ fill }).stroke;
            expect(contrastRatio(stroke, DESIGN_TOKENS.fondJour)).toBeGreaterThanOrEqual(4.5);
        }
        const { hudBannerFill } = await import('../src/designTokens.js');
        expect(hudBannerFill('bannerStreak')).not.toBe(DESIGN_TOKENS.bannerStreak);
        vi.mocked(getBackgroundPeriod).mockReturnValue('night');
    });

    it('texte bouton jaune atteint AA sur fond accent', async () => {
        const { yellowChromeButtonTextStyle } = await import('../src/designTokens.js');
        expect(yellowChromeButtonTextStyle().fill).toBe(DESIGN_TOKENS.texteBoutonJaune);
        expect(
            contrastRatio(DESIGN_TOKENS.texteBoutonJaune, DESIGN_TOKENS.accent)
        ).toBeGreaterThanOrEqual(4.5);
        expect(
            contrastRatio(DESIGN_TOKENS.texteBoutonJaune, DESIGN_TOKENS.accentHover)
        ).toBeGreaterThanOrEqual(4.5);
    });

    it('expose les couleurs Phaser médailles et confettis', async () => {
        const { MEDAILLE_COLORS_PHASER, CONFETTI_COLORS_PHASER, hexVersPhaser } =
            await import('../src/designTokens.js');
        expect(MEDAILLE_COLORS_PHASER.or).toBe(hexVersPhaser(DESIGN_TOKENS.medailleOr));
        expect(CONFETTI_COLORS_PHASER.length).toBe(5);
    });
});
