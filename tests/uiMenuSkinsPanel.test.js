import { describe, it, expect, beforeEach } from 'vitest';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { GAME_STATE } from '../src/gameState.js';
import { buildMenuSkinsPanel, toggleMenuSkins } from '../src/ui/menu/uiMenuSkinsPanel.js';
import { UI_LAYOUT } from '../src/ui/shared/uiLayout.js';

describe('uiMenuSkinsPanel', () => {
    let scene;
    let ui;
    let elements;

    beforeEach(() => {
        scene = createBaseScene({ round: createRoundState(), state: GAME_STATE.MENU });
        ui = new UI(scene);
        ui.closeAllMenuPanels = () => {};
        elements = [];
        buildMenuSkinsPanel(ui, elements, UI_LAYOUT.menu);
    });

    it('crée un bouton STYLE et un panneau', () => {
        expect(ui._skinsBtnLabel).toBeTruthy();
        expect(ui._skinsBackdrop).toBeTruthy();
        expect(ui._skinsOpen).toBe(false);
    });

    it('toggleMenuSkins ouvre et ferme le panneau', () => {
        toggleMenuSkins(ui);
        expect(ui._skinsOpen).toBe(true);
        toggleMenuSkins(ui);
        expect(ui._skinsOpen).toBe(false);
    });

    it('le bouton STYLE reste au-dessus du fond du panneau (pas de bleed-through)', () => {
        const btnDepth = ui._skinsBtnBg.setDepth.mock.calls.at(-1)?.[0];
        const backdropDepth = ui._skinsBackdrop.frame.setDepth.mock.calls.at(-1)?.[0];
        expect(btnDepth).toBeGreaterThan(backdropDepth);
    });
});
