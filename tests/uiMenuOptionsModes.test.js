import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildModeControls } from '../src/uiMenuOptionsModes.js';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { UI_LAYOUT } from '../src/uiLayout.js';

describe('uiMenuOptionsModes', () => {
    let scene;
    let ui;
    let elements;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: false,
            toggleTraining: vi.fn(),
            toggleHardcore: vi.fn(),
        });
        ui = new UI(scene);
        ui._optionsPanelElements = [];
        elements = [];
        buildModeControls(ui, elements, UI_LAYOUT.optionsPanel);
    });

    it('crée les contrôles entraînement et hardcore', () => {
        expect(ui._trainingLabel).toBeTruthy();
        expect(ui._trainingHit).toBeTruthy();
        expect(ui._hardcoreLabel).toBeTruthy();
        expect(ui._hardcoreHit).toBeTruthy();
        expect(ui._classicHint).toBeTruthy();
    });

    it('refléte le mode entraînement actif', () => {
        expect(ui._trainingLabel.setText).toHaveBeenCalled();
    });
});
