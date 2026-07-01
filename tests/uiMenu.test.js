import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { DIFFICULTY } from '../src/config.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import {
    refreshBestScore,
    showMenu,
    updateTrainingLabel,
    updateHardcoreLabel,
    updateDailyLabel,
    updateDifficultyButtons,
    refreshHighScore,
} from '../src/uiMenu.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
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
            trainingMode: false,
            hardcoreMode: false,
            dailyChallengeMode: true,
        });
        ui = new UI(scene);
    });

    it('refreshBestScore met à jour le texte record', () => {
        ui._bestText = { setText: vi.fn() };
        refreshBestScore(ui, DIFFICULTY.NORMAL, false);
        expect(ui.highScore).toBe(42);
        expect(ui._bestText.setText).toHaveBeenCalled();
    });

    it('showMenu construit le menu complet', () => {
        const elements = showMenu(ui, DIFFICULTY.NORMAL, false, false, true);
        expect(elements.length).toBeGreaterThan(5);
        expect(ui._startText).toBeTruthy();
        expect(ui._menuLayout).toBeTruthy();
    });

    it('showMenu détruit le score en jeu', () => {
        ui.scoreText = { destroy: vi.fn() };
        showMenu(ui, DIFFICULTY.NORMAL, false, false, false);
        expect(ui.scoreText).toBeNull();
    });

    it('updateTrainingLabel reflète le mode entraînement', () => {
        ui._trainingLabel = { setText: vi.fn(), setColor: vi.fn() };
        updateTrainingLabel(ui, true);
        expect(ui._trainingLabel.setText).toHaveBeenCalled();
        expect(ui._trainingLabel.setColor).toHaveBeenCalledWith('#81D4FA');
    });

    it('updateHardcoreLabel rafraîchit le record hardcore', () => {
        ui._hardcoreLabel = { setText: vi.fn(), setColor: vi.fn() };
        ui._bestText = { setText: vi.fn() };
        updateHardcoreLabel(ui, true);
        expect(ui._hardcoreLabel.setColor).toHaveBeenCalledWith('#FF8A80');
        expect(ui.highScore).toBe(99);
    });

    it('updateDailyLabel met à jour sous-titre et couleur', () => {
        ui._dailyLabel = { setText: vi.fn(), setColor: vi.fn() };
        ui._dailySubtitle = { setText: vi.fn() };
        updateDailyLabel(ui, true);
        expect(ui._dailyLabel.setColor).toHaveBeenCalledWith('#CE93D8');
        expect(ui._dailySubtitle.setText).toHaveBeenCalled();
    });

    it('updateDifficultyButtons synchronise difficulté et record', () => {
        ui._diffBtnLabels = [
            { label: { setColor: vi.fn() }, diff: DIFFICULTY.EASY },
            { label: { setColor: vi.fn() }, diff: DIFFICULTY.NORMAL },
            { label: { setColor: vi.fn() }, diff: DIFFICULTY.HARD },
        ];
        ui._diffBtnGraphics = { clear: vi.fn(), fillStyle: vi.fn(), fillRoundedRect: vi.fn() };
        ui._menuLayout = { diffBtnW: 80, diffBtnH: 36, diffGap: 8 };
        ui._bestText = { setText: vi.fn() };
        updateDifficultyButtons(ui, DIFFICULTY.HARD);
        expect(ui._currentDifficulty).toBe(DIFFICULTY.HARD);
    });

    it('refreshHighScore délègue à refreshBestScore', () => {
        ui._bestText = { setText: vi.fn() };
        refreshHighScore(ui, DIFFICULTY.NORMAL, false);
        expect(ui.highScore).toBe(42);
    });
});
