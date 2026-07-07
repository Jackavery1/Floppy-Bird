import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { buildMenuOptions, toggleMenuOptions } from '../src/uiMenuOptions.js';
import { setOptionsTab } from '../src/uiMenuOptionsTabs.js';
import { UI_LAYOUT } from '../src/uiLayout.js';

vi.mock('../src/audio.js', () => ({
    cycleSoundLevel: vi.fn(),
    formatSoundLabel: vi.fn(() => '100 %'),
    isAudioAvailable: vi.fn(() => true),
}));

describe('uiMenuOptions', () => {
    let scene;
    let ui;
    let elements;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: false,
            dailyChallengeMode: true,
            toggleTraining: vi.fn(),
            toggleHardcore: vi.fn(),
            launchDailyChallenge: vi.fn(),
            bird: { setSkin: vi.fn() },
        });
        ui = new UI(scene);
        ui._closeAllMenuPanels = vi.fn();
        elements = [];
        buildMenuOptions(ui, elements, UI_LAYOUT.menu);
    });

    it('crée un bouton OPTIONS et un panneau à onglets', () => {
        expect(ui._optionsBtnLabel).toBeTruthy();
        expect(ui._optionsBtnBg).toBeTruthy();
        expect(ui._optionsTabButtons).toHaveLength(3);
        expect(ui._trainingLabel).toBeTruthy();
        expect(ui._optionsOpen).toBe(false);
    });

    it('toggleMenuOptions ouvre sur l’onglet modes par défaut', () => {
        toggleMenuOptions(ui);
        expect(ui._optionsOpen).toBe(true);
        expect(ui._optionsActiveTab).toBe('modes');
        expect(ui._optionsModesElements[0].setVisible).toHaveBeenCalledWith(true);
        toggleMenuOptions(ui);
        expect(ui._optionsOpen).toBe(false);
    });

    it('le bouton OPTIONS reste au-dessus du fond du panneau (pas de bleed-through)', () => {
        const btnDepth = ui._optionsBtnBg.setDepth.mock.calls.at(-1)?.[0];
        const backdropDepth = ui._optionsBackdrop.frame.setDepth.mock.calls.at(-1)?.[0];
        expect(btnDepth).toBeGreaterThan(backdropDepth);
    });

    it('masque les contrôles stylisés après fermeture de l’onglet Contrôles', () => {
        toggleMenuOptions(ui);
        setOptionsTab(ui, 'controls');
        const badge = ui._optionsControlsElements.find(
            (el) => el !== ui._optionsControlsElements[0] && el.setVisible
        );
        toggleMenuOptions(ui);
        for (const el of ui._optionsControlsElements) {
            expect(el.setVisible).toHaveBeenCalledWith(false);
        }
        expect(badge).toBeTruthy();
    });
});
