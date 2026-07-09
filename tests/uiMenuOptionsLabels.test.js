import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import {
    applyTrainingLabel,
    applyHardcoreLabel,
    setOptionsContentVisible,
    TOGGLE_ICON_X_OFFSET,
} from '../src/uiMenuOptionsLabels.js';

vi.mock('../src/uiToggleIcons.js', () => ({
    drawTrainingToggleIcon: vi.fn(),
    drawHardcoreToggleIcon: vi.fn(),
}));

describe('uiMenuOptionsLabels', () => {
    let ui;

    beforeEach(() => {
        ui = new UI(createBaseScene({ round: createRoundState() }));
        ui._trainingLabel = { setColor: vi.fn(), setText: vi.fn() };
        ui._hardcoreLabel = { setColor: vi.fn(), setText: vi.fn() };
        ui._trainingIcon = {};
        ui._hardcoreIcon = {};
        ui._optionsPanelElements = [{ setVisible: vi.fn() }];
    });

    it('expose un offset icône toggle cohérent', () => {
        expect(TOGGLE_ICON_X_OFFSET).toBe(-98);
    });

    it('applyTrainingLabel met à jour couleur et texte', () => {
        applyTrainingLabel(ui, true);
        expect(ui._trainingLabel.setColor).toHaveBeenCalledWith('#81D4FA');
        applyTrainingLabel(ui, false);
        expect(ui._trainingLabel.setColor).toHaveBeenCalledWith('#ECEFF1');
    });

    it('applyHardcoreLabel grise le mode verrouillé', () => {
        applyHardcoreLabel(ui, false, false);
        expect(ui._hardcoreLabel.setColor).toHaveBeenCalledWith('#B0BEC5');
        applyHardcoreLabel(ui, true, true);
        expect(ui._hardcoreLabel.setColor).toHaveBeenCalledWith('#FF8A80');
    });

    it('setOptionsContentVisible bascule la visibilité du panneau', () => {
        ui._optionsOpen = true;
        const chrome = { setVisible: vi.fn(), setAlpha: vi.fn() };
        ui._optionsChromeElements = [chrome];
        ui._optionsSettingsElements = [{ setVisible: vi.fn(), setAlpha: vi.fn() }];
        setOptionsContentVisible(ui, true);
        expect(chrome.setVisible).toHaveBeenCalledWith(true);
    });

    it('setOptionsContentVisible masque les sections à la fermeture', () => {
        const controlRoot = { setVisible: vi.fn(), setAlpha: vi.fn() };
        const controlChild = { setVisible: vi.fn(), setAlpha: vi.fn() };
        ui._optionsControlsElements = [controlRoot, controlChild];
        ui._optionsChromeElements = [{ setVisible: vi.fn(), setAlpha: vi.fn() }];
        ui._optionsPanelElements = [{ setVisible: vi.fn(), setAlpha: vi.fn() }];
        setOptionsContentVisible(ui, false);
        expect(controlRoot.setVisible).toHaveBeenCalledWith(false);
        expect(controlChild.setVisible).toHaveBeenCalledWith(false);
    });
});
