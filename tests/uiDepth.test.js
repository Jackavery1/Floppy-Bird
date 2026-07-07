import { describe, it, expect } from 'vitest';
import { DEPTH } from '../src/uiDepth.js';

describe('uiDepth', () => {
    it('expose les profondeurs monde < UI < HUD', () => {
        expect(DEPTH.BIRD).toBeGreaterThan(DEPTH.PIPES);
        expect(DEPTH.MENU_PANEL).toBeGreaterThan(DEPTH.OVERLAY_DIM);
        expect(DEPTH.SCORE_HUD).toBeGreaterThan(DEPTH.PAUSE_HIT);
        expect(DEPTH.FLASH).toBeGreaterThan(DEPTH.SCORE_HUD);
    });

    it('ordonne les couches du monde (fond → collines → ciel → gameplay)', () => {
        expect(DEPTH.HILLS_FAR).toBeGreaterThan(DEPTH.WORLD_BG);
        expect(DEPTH.HILLS_NEAR).toBeGreaterThan(DEPTH.HILLS_FAR);
        expect(DEPTH.CELESTIAL).toBeGreaterThan(DEPTH.HILLS_NEAR);
        expect(DEPTH.CLOUDS).toBeGreaterThan(DEPTH.CELESTIAL);
        expect(DEPTH.GROUND).toBeGreaterThan(DEPTH.CLOUDS);
        expect(DEPTH.PIPES).toBeGreaterThan(DEPTH.GROUND);
        expect(DEPTH.BIRD).toBeGreaterThan(DEPTH.PIPES);
    });

    it('ordonne les couches de panneau menu', () => {
        expect(DEPTH.PANEL_BACKDROP).toBeGreaterThan(DEPTH.MENU_BTN_BG);
        expect(DEPTH.PANEL_HIT).toBeGreaterThan(DEPTH.PANEL_PREVIEW);
        expect(DEPTH.PANEL_TOP).toBeGreaterThan(DEPTH.PANEL_HIT);
        expect(DEPTH.MENU_ROW_BTN).toBeGreaterThan(DEPTH.PANEL_TOP);
    });

    it('affiche la bannière record au-dessus du score HUD', () => {
        expect(DEPTH.RECORD_BANNER).toBeGreaterThan(DEPTH.SCORE_HUD);
        expect(DEPTH.RECORD_BANNER).toBeGreaterThan(DEPTH.PAUSE_ICON_HIT);
    });
});
