import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { GAME_STATE } from '../src/gameState.js';
import {
    buildMenuOptions,
    toggleMenuOptions,
    refreshHardcoreLockState,
    teardownOptionsPanel,
    ensureOptionsPanelBuilt,
} from '../src/uiMenuOptions.js';
import { setOptionsTab } from '../src/uiMenuOptionsTabs.js';
import { UI_LAYOUT } from '../src/uiLayout.js';

vi.mock('../src/audio.js', () => ({
    cycleSoundLevel: vi.fn(),
    formatSoundLabel: vi.fn(() => '100 %'),
    isAudioAvailable: vi.fn(() => true),
}));

vi.mock('../src/hardcoreUnlock.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        isHardcoreUnlocked: vi.fn(() => true),
    };
});

vi.mock('../src/uiDomAccessibilityControls.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        setAccessibilityControlDisabled: vi.fn(),
    };
});

describe('uiMenuOptions', () => {
    let scene;
    let ui;
    let elements;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            state: GAME_STATE.MENU,
            trainingMode: false,
            hardcoreMode: false,
            dailyChallengeMode: true,
            toggleTraining: vi.fn(),
            toggleHardcore: vi.fn(),
            launchDailyChallenge: vi.fn(),
            bird: { setSkin: vi.fn() },
        });
        ui = new UI(scene);
        ui.closeAllMenuPanels = vi.fn();
        elements = [];
        buildMenuOptions(ui, elements, UI_LAYOUT.menu);
    });

    it('crée le bouton OPTIONS sans panneau tant qu’il n’est pas ouvert', () => {
        expect(ui._optionsBtnLabel).toBeTruthy();
        expect(ui._optionsBtnBg).toBeTruthy();
        expect(ui._optionsTabButtons ?? []).toHaveLength(0);
        expect(ui._optionsPanelRoot).toBeFalsy();
        expect(ui._optionsOpen).toBe(false);
    });

    it('toggleMenuOptions construit puis ouvre sur l’onglet réglages par défaut', () => {
        toggleMenuOptions(ui);
        expect(ui._optionsTabButtons).toHaveLength(2);
        expect(ui._optionsOpen).toBe(true);
        expect(ui._optionsActiveTab).toBe('preferences');
        expect(ui._optionsSettingsElements[0].setVisible).toHaveBeenCalledWith(true);
        expect(ui._hardcoreLabel).toBeTruthy();
        toggleMenuOptions(ui);
        expect(ui._optionsOpen).toBe(false);
    });

    it('le bouton OPTIONS reste au-dessus du fond du panneau (pas de bleed-through)', () => {
        toggleMenuOptions(ui);
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

    it('ignore toggleMenuOptions hors menu principal', () => {
        scene.state = GAME_STATE.PLAYING;
        toggleMenuOptions(ui);
        expect(ui._optionsOpen).toBe(false);
        expect(ui._optionsPanelRoot).toBeFalsy();
    });

    it('refreshHardcoreLockState désactive le hit quand hardcore verrouillé', async () => {
        const { isHardcoreUnlocked } = await import('../src/hardcoreUnlock.js');
        const { setAccessibilityControlDisabled } =
            await import('../src/uiDomAccessibilityControls.js');
        isHardcoreUnlocked.mockReturnValue(false);
        ui._hardcoreLabel = { scene: ui.scene, setText: vi.fn(), setColor: vi.fn() };
        ui._hardcoreHit = {
            scene: ui.scene,
            disableInteractive: vi.fn(),
            setInteractive: vi.fn(),
        };
        refreshHardcoreLockState(ui);
        expect(ui._hardcoreHit.disableInteractive).toHaveBeenCalled();
        expect(setAccessibilityControlDisabled).toHaveBeenCalledWith('menuHardcore', true);
    });

    it('refreshHardcoreLockState réactive le hit quand hardcore déverrouillé', async () => {
        const { isHardcoreUnlocked } = await import('../src/hardcoreUnlock.js');
        const { setAccessibilityControlDisabled } =
            await import('../src/uiDomAccessibilityControls.js');
        isHardcoreUnlocked.mockReturnValue(true);
        ui._hardcoreLabel = { scene: ui.scene, setText: vi.fn(), setColor: vi.fn() };
        ui._hardcoreHit = {
            scene: ui.scene,
            disableInteractive: vi.fn(),
            setInteractive: vi.fn(),
        };
        refreshHardcoreLockState(ui);
        expect(ui._hardcoreHit.setInteractive).toHaveBeenCalled();
        expect(setAccessibilityControlDisabled).toHaveBeenCalledWith('menuHardcore', false);
    });

    it('teardownOptionsPanel détruit backdrop sans panel root', () => {
        const frame = { destroy: vi.fn() };
        const hit = { destroy: vi.fn() };
        ui._optionsPanelRoot = null;
        ui._optionsBackdrop = { frame, hit };
        teardownOptionsPanel(ui);
        expect(frame.destroy).toHaveBeenCalled();
        expect(hit.destroy).toHaveBeenCalled();
        expect(ui._optionsPanelBuilt).toBe(false);
    });

    it('ensureOptionsPanelBuilt ignore hors menu', () => {
        scene.state = GAME_STATE.PLAYING;
        ui._optionsPanelBuilt = false;
        ensureOptionsPanelBuilt(ui);
        expect(ui._optionsPanelBuilt).toBe(false);
    });
});
