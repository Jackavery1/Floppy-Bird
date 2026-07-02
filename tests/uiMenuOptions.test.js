import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import {
    buildMenuOptions,
    toggleMenuOptions,
} from '../src/uiMenuOptions.js';
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

    it('crée un bouton OPTIONS et un panneau jeu', () => {
        expect(ui._optionsBtnLabel).toBeTruthy();
        expect(ui._optionsBtnBg).toBeTruthy();
        expect(ui._trainingLabel).toBeTruthy();
        expect(ui._optionsOpen).toBe(false);
    });

    it('toggleMenuOptions ouvre et ferme le panneau', () => {
        toggleMenuOptions(ui);
        expect(ui._optionsOpen).toBe(true);
        toggleMenuOptions(ui);
        expect(ui._optionsOpen).toBe(false);
    });

    it('le bouton OPTIONS reste au-dessus du fond du panneau (pas de bleed-through)', () => {
        const btnDepth = ui._optionsBtnBg.setDepth.mock.calls.at(-1)?.[0];
        const backdropDepth = ui._optionsBackdrop.setDepth.mock.calls.at(-1)?.[0];
        expect(btnDepth).toBeGreaterThan(backdropDepth);
    });
});
