import { describe, it, expect } from 'vitest';
import { DEPTH } from '../src/uiDepth.js';

describe('uiDepth', () => {
    it('expose les profondeurs monde < UI < HUD', () => {
        expect(DEPTH.BIRD).toBeGreaterThan(DEPTH.PIPES);
        expect(DEPTH.MENU_PANEL).toBeGreaterThan(DEPTH.OVERLAY_DIM);
        expect(DEPTH.SCORE_HUD).toBeGreaterThan(DEPTH.PAUSE_HIT);
        expect(DEPTH.FLASH).toBeGreaterThan(DEPTH.SCORE_HUD);
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
