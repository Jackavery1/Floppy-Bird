import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { buildOptionsTabs, setOptionsTab } from '../src/uiMenuOptionsTabs.js';
import { UI_LAYOUT } from '../src/uiLayout.js';

describe('uiMenuOptionsTabs', () => {
    let scene;
    let ui;
    let elements;

    beforeEach(() => {
        scene = createBaseScene({ round: createRoundState() });
        ui = new UI(scene);
        ui._optionsPanelElements = [];
        ui._optionsChromeElements = [];
        ui._optionsControlsElements = [{ setVisible: vi.fn() }];
        ui._optionsSettingsElements = [{ setVisible: vi.fn() }];
        ui._optionsModesElements = [{ setVisible: vi.fn() }];
        elements = [];
        const pushChrome = (targetUi, targetElements, el) => {
            targetElements.push(el);
            targetUi._optionsPanelElements.push(el);
            targetUi._optionsChromeElements.push(el);
        };
        buildOptionsTabs(ui, elements, pushChrome);
    });

    it('crée trois onglets en haut du panneau', () => {
        expect(ui._optionsTabButtons).toHaveLength(3);
        expect(ui._optionsActiveTab).toBe('modes');
    });

    it('setOptionsTab affiche uniquement la section active quand le panneau est ouvert', () => {
        ui._optionsOpen = true;
        setOptionsTab(ui, 'controls');
        expect(ui._optionsControlsElements[0].setVisible).toHaveBeenCalledWith(true);
        expect(ui._optionsSettingsElements[0].setVisible).toHaveBeenCalledWith(false);
        expect(ui._optionsModesElements[0].setVisible).toHaveBeenCalledWith(false);
    });

    it('setOptionsTab masque les sections quand le panneau est fermé', () => {
        ui._optionsOpen = false;
        setOptionsTab(ui, 'controls');
        expect(ui._optionsControlsElements[0].setVisible).toHaveBeenCalledWith(false);
        expect(ui._optionsModesElements[0].setVisible).toHaveBeenCalledWith(false);
    });

    it('les onglets sont alignés gauche / centre / droite', () => {
        const panel = UI_LAYOUT.optionsPanel;
        const xs = ui._optionsTabButtons.map(
            ({ id }) =>
                panel[
                    id === 'controls'
                        ? 'tabControlsX'
                        : id === 'settings'
                          ? 'tabSettingsX'
                          : 'tabModesX'
                ]
        );
        expect(xs).toEqual([panel.tabControlsX, panel.tabSettingsX, panel.tabModesX]);
    });
});
