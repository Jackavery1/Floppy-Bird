import { describe, it, expect, vi } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import {
    buildMenuToggleButton,
    createMenuPanelController,
    setMenuPanelVisible,
} from '../src/uiMenuPanel.js';
import { MENU_BTN_COLOR } from '../src/uiLayout.js';
import { hexVersPhaser, DESIGN_TOKENS } from '../src/designTokens.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('uiMenuPanel', () => {
    it('setMenuPanelVisible bascule la visibilité', () => {
        const visible = { setVisible: vi.fn() };
        const hidden = { setVisible: vi.fn() };
        setMenuPanelVisible([visible, hidden], true);
        expect(visible.setVisible).toHaveBeenCalledWith(true);
        expect(hidden.setVisible).toHaveBeenCalledWith(true);
    });

    it('buildMenuToggleButton applique le hover', () => {
        const scene = createBaseScene();
        const elements = [];
        const onToggle = vi.fn();
        const { bg, hit } = buildMenuToggleButton(scene, elements, {
            cx: GAME_CONFIG.centerX,
            cy: 200,
            width: 88,
            depth: 10,
            color: MENU_BTN_COLOR,
            stroke: hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke),
            labelText: 'Scores',
            labelStroke: DESIGN_TOKENS.contourOptions,
            onToggle,
        });
        const overHandler = hit.on.mock.calls.find(([evt]) => evt === 'pointerover')?.[1];
        const outHandler = hit.on.mock.calls.find(([evt]) => evt === 'pointerout')?.[1];
        expect(overHandler).toBeTypeOf('function');
        overHandler();
        expect(bg.setFillStyle).toHaveBeenCalled();
        outHandler();
        expect(bg.setFillStyle).toHaveBeenCalledWith(MENU_BTN_COLOR, 0.88);
    });

    it('createMenuPanelController ouvre et ferme', () => {
        const ui = {
            _scoresOpen: false,
            _scoresBackdrop: { setVisible: vi.fn() },
            _scoresPanelElements: [{ setVisible: vi.fn() }],
            _scoresBtnLabel: { setText: vi.fn() },
            _closeAllMenuPanels: vi.fn(),
        };
        const controller = createMenuPanelController(ui, {
            openKey: '_scoresOpen',
            backdropKey: '_scoresBackdrop',
            panelElementsKey: '_scoresPanelElements',
            btnLabelKey: '_scoresBtnLabel',
            buttonLabelFn: (open) => (open ? 'FERMER' : 'SCORES'),
        });
        controller.setOpen(true);
        expect(ui._scoresOpen).toBe(true);
        expect(ui._scoresBackdrop.setVisible).toHaveBeenCalledWith(true);
        controller.toggle();
        expect(ui._scoresOpen).toBe(false);
    });
});
