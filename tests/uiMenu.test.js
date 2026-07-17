import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui/core/ui.js';
import { DIFFICULTY } from '../src/config.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { GAME_STATE } from '../src/gameState.js';
import {
    refreshBestScore,
    showMenu,
    prepareMenuRebuild,
    updateTrainingLabel,
    updateHardcoreLabel,
    updateDifficultyButtons,
    refreshHighScore,
} from '../src/ui/menu/uiMenu.js';
import { toggleMenuOptions } from '../src/ui/menu/uiMenuOptions.js';
import { setOptionsTab } from '../src/ui/menu/uiMenuOptionsTabs.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
    prefersReducedMotion: vi.fn(() => false),
}));

vi.mock('../src/audio.js', () => ({
    cycleSoundLevel: vi.fn(),
    formatSoundLabel: vi.fn(() => '100 %'),
    isAudioAvailable: vi.fn(() => true),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn((difficulty, hardcore) => (hardcore ? 99 : 42)),
}));

describe('uiMenu', () => {
    let scene;
    let ui;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            state: GAME_STATE.MENU,
            trainingMode: false,
            hardcoreMode: false,
            dailyChallengeMode: true,
        });
        ui = new UI(scene);
    });

    it('refreshBestScore met à jour le record interne', () => {
        refreshBestScore(ui, DIFFICULTY.NORMAL, false);
        expect(ui.highScore).toBe(42);
    });

    it('showMenu construit le menu complet', () => {
        const elements = showMenu(ui, DIFFICULTY.NORMAL, false, false);
        expect(elements.length).toBeGreaterThan(5);
        expect(ui._startText).toBeTruthy();
        expect(ui._dailyBtnLabel).toBeTruthy();
        expect(ui._menuLayout).toBeTruthy();
    });

    it('showMenu détruit le score en jeu', () => {
        ui.scoreText = { destroy: vi.fn() };
        showMenu(ui, DIFFICULTY.NORMAL, false, false);
        expect(ui.scoreText).toBeNull();
    });

    it('prepareMenuRebuild puis showMenu masque le panneau options après game over', () => {
        showMenu(ui, DIFFICULTY.NORMAL, false, false);
        toggleMenuOptions(ui);
        setOptionsTab(ui, 'controls');
        expect(ui._optionsOpen).toBe(true);

        ui._overlays.menu.forEach((el) => el.destroy?.());
        ui._overlays.menu.length = 0;

        prepareMenuRebuild(ui);
        showMenu(ui, DIFFICULTY.NORMAL, false, false);

        expect(ui._optionsOpen).toBe(false);
        expect(ui._optionsPanelBuilt).toBe(false);
        expect(ui._optionsPanelRoot).toBeFalsy();
        expect(ui._startText.visible).toBe(true);
        expect(ui._skinsBtnBg.visible).toBe(true);
        expect(ui._skinsBtnLabel.visible).toBe(true);
    });

    it('showMenu n’instancie pas le panneau options tant qu’OPT. n’est pas ouvert', () => {
        showMenu(ui, DIFFICULTY.NORMAL, false, false);
        expect(ui._optionsPanelBuilt).toBe(false);
        expect(ui._optionsPanelRoot).toBeFalsy();
        expect(ui._optionsTabButtons ?? []).toHaveLength(0);
    });

    it('updateTrainingLabel reflète le mode entraînement', () => {
        ui._trainingLabel = { setText: vi.fn(), setColor: vi.fn() };
        updateTrainingLabel(ui, true);
        expect(ui._trainingLabel.setText).toHaveBeenCalled();
        expect(ui._trainingLabel.setColor).toHaveBeenCalledWith('#81D4FA');
    });

    it('updateHardcoreLabel rafraîchit le record interne', () => {
        ui._hardcoreLabel = { setText: vi.fn(), setColor: vi.fn() };
        updateHardcoreLabel(ui, true);
        expect(ui._hardcoreLabel.setColor).toHaveBeenCalled();
        expect(ui.highScore).toBe(99);
    });

    it('updateDifficultyButtons synchronise difficulté et record', () => {
        ui._diffBtnLabels = [
            { label: { setColor: vi.fn() }, diff: DIFFICULTY.EASY },
            { label: { setColor: vi.fn() }, diff: DIFFICULTY.NORMAL },
            { label: { setColor: vi.fn() }, diff: DIFFICULTY.HARD },
        ];
        ui._diffBtnGraphics = { clear: vi.fn(), fillStyle: vi.fn(), fillRoundedRect: vi.fn() };
        ui._menuLayout = { diffBtnW: 80, diffBtnH: 36, diffGap: 8 };
        updateDifficultyButtons(ui, DIFFICULTY.HARD);
        expect(ui._currentDifficulty).toBe(DIFFICULTY.HARD);
    });

    it('refreshHighScore délègue à refreshBestScore', () => {
        refreshHighScore(ui, DIFFICULTY.NORMAL, false);
        expect(ui.highScore).toBe(42);
    });

    it("la rangée SCORES/OPT./SKINS se cache quand un panneau s'ouvre (anti-chevauchement)", () => {
        showMenu(ui, DIFFICULTY.NORMAL, false, false);

        expect(ui._menuChromeElements).toContain(ui._scoresBtnBg);
        expect(ui._menuChromeElements).toContain(ui._optionsBtnBg);
        expect(ui._menuChromeElements).toContain(ui._skinsBtnBg);

        ui._optionsPanelController.setOpen(true);

        expect(ui._scoresBtnBg.setVisible).toHaveBeenLastCalledWith(false);
        expect(ui._optionsBtnBg.setVisible).toHaveBeenLastCalledWith(false);
        expect(ui._skinsBtnBg.setVisible).toHaveBeenLastCalledWith(false);
    });

    it('un bouton RETOUR dans chaque panneau referme celui-ci', () => {
        showMenu(ui, DIFFICULTY.NORMAL, false, false);

        ui._optionsPanelController.setOpen(true);
        expect(ui._optionsOpen).toBe(true);

        const closeHandler = ui._optionsCloseHit.on.mock.calls.find(
            ([evt]) => evt === 'pointerdown'
        )?.[1];
        expect(closeHandler).toBeTypeOf('function');
        closeHandler({}, 0, 0, {});
        expect(ui._optionsOpen).toBe(false);
    });
});
