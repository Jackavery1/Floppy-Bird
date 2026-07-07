import { describe, it, expect, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { buildMenuScoresPanel, toggleMenuScores } from '../src/uiMenuScoresPanel.js';
import { UI_LAYOUT } from '../src/uiLayout.js';

describe('uiMenuScoresPanel', () => {
    let scene;
    let ui;
    let elements;

    beforeEach(() => {
        scene = createBaseScene({ round: createRoundState() });
        ui = new UI(scene);
        ui._closeAllMenuPanels = () => {};
        elements = [];
        buildMenuScoresPanel(ui, elements, UI_LAYOUT.menu);
    });

    it('crée un bouton SCORES et un panneau', () => {
        expect(ui._scoresBtnLabel).toBeTruthy();
        expect(ui._scoresBackdrop).toBeTruthy();
        expect(ui._scoresOpen).toBe(false);
    });

    it('toggleMenuScores ouvre et ferme le panneau', () => {
        toggleMenuScores(ui);
        expect(ui._scoresOpen).toBe(true);
        toggleMenuScores(ui);
        expect(ui._scoresOpen).toBe(false);
    });

    it('le bouton SCORES reste au-dessus du fond du panneau (pas de bleed-through)', () => {
        const btnDepth = ui._scoresBtnBg.setDepth.mock.calls.at(-1)?.[0];
        const backdropDepth = ui._scoresBackdrop.frame.setDepth.mock.calls.at(-1)?.[0];
        expect(btnDepth).toBeGreaterThan(backdropDepth);
    });
});
