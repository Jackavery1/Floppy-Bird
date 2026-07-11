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
        const visible = { setVisible: vi.fn(), setAlpha: vi.fn() };
        const hidden = { setVisible: vi.fn(), setAlpha: vi.fn() };
        setMenuPanelVisible([visible, hidden], true);
        expect(visible.setVisible).toHaveBeenCalledWith(true);
        expect(hidden.setVisible).toHaveBeenCalledWith(true);
        expect(visible.setAlpha).toHaveBeenCalledWith(1);
    });

    it('setMenuPanelVisible remet alpha à 1 à la fermeture immédiate', () => {
        const el = { setVisible: vi.fn(), setAlpha: vi.fn() };
        setMenuPanelVisible([el], false);
        expect(el.setVisible).toHaveBeenCalledWith(false);
        expect(el.setAlpha).toHaveBeenCalledWith(1);
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
            scene: { tweens: { killTweensOf: vi.fn(), add: vi.fn() } },
            _scoresOpen: false,
            _scoresBackdrop: { setVisible: vi.fn() },
            _scoresPanelElements: [{ setVisible: vi.fn(), setAlpha: vi.fn() }],
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

    it('setOpen ignore les appels redondants (évite tweens fantômes)', () => {
        const el = { setVisible: vi.fn(), setAlpha: vi.fn() };
        const ui = {
            scene: { tweens: { killTweensOf: vi.fn(), add: vi.fn() } },
            _scoresOpen: false,
            _scoresBackdrop: { setVisible: vi.fn() },
            _scoresPanelElements: [el],
            _scoresBtnLabel: { setText: vi.fn() },
        };
        const controller = createMenuPanelController(ui, {
            openKey: '_scoresOpen',
            backdropKey: '_scoresBackdrop',
            panelElementsKey: '_scoresPanelElements',
            btnLabelKey: '_scoresBtnLabel',
            buttonLabelFn: () => 'SCORES',
        });
        controller.setOpen(false);
        controller.setOpen(false);
        expect(el.setVisible).not.toHaveBeenCalled();
    });

    it('setOpen({ force: true }) referme visuellement même si le flag est déjà fermé', () => {
        const el = { setVisible: vi.fn(), setAlpha: vi.fn() };
        const onClose = vi.fn();
        const ui = {
            scene: { tweens: { killTweensOf: vi.fn(), add: vi.fn() } },
            _scoresOpen: false,
            _scoresBackdrop: { setVisible: vi.fn() },
            _scoresPanelElements: [el],
            _scoresBtnLabel: { setText: vi.fn() },
        };
        const controller = createMenuPanelController(ui, {
            openKey: '_scoresOpen',
            backdropKey: '_scoresBackdrop',
            panelElementsKey: '_scoresPanelElements',
            btnLabelKey: '_scoresBtnLabel',
            buttonLabelFn: () => 'SCORES',
            onClose,
        });
        controller.setOpen(false, { force: true });
        expect(el.setVisible).toHaveBeenCalledWith(false);
        expect(ui._scoresBackdrop.setVisible).toHaveBeenCalledWith(false);
        expect(onClose).toHaveBeenCalledWith(ui);
    });
});
