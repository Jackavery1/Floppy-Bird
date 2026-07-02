import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    showRecordBroken,
    showDailyGoalReached,
    showJumpTutorial,
    dismissJumpTutorial,
    showFlash,
    showDifficultyEscalation,
    showScoreStreak,
} from '../src/uiHudFeedback.js';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

describe('uiHudFeedback', () => {
    let ui;

    beforeEach(() => {
        ui = new UI(createBaseScene({ round: createRoundState() }));
        vi.clearAllMocks();
    });

    it('showRecordBroken crée une bannière unique', () => {
        showRecordBroken(ui);
        expect(ui._recordBanner).toBeTruthy();
        showRecordBroken(ui);
        expect(ui.scene.add.text).toHaveBeenCalledTimes(1);
    });

    it('showDifficultyEscalation crée une bannière', () => {
        showDifficultyEscalation(ui);
        expect(ui._escalationBanner).toBeTruthy();
    });

    it('showScoreStreak affiche la série ou EN FEU', () => {
        showScoreStreak(ui, 10);
        expect(ui._streakBanner).toBeTruthy();
        showScoreStreak(ui, 15);
        expect(ui.scene.add.text).toHaveBeenCalled();
    });

    it('showDailyGoalReached crée une bannière et un flash', () => {
        showDailyGoalReached(ui);
        expect(ui._dailyGoalBanner).toBeTruthy();
        expect(ui.scene.add.rectangle).toHaveBeenCalled();
    });

    it('showJumpTutorial et dismissJumpTutorial gèrent le hint', () => {
        showJumpTutorial(ui);
        expect(ui._tutorialHint).toBeTruthy();
        expect(dismissJumpTutorial(ui)).toBe(true);
        expect(ui._tutorialHint).toBeNull();
        expect(dismissJumpTutorial(ui)).toBe(false);
    });

    it('showFlash ajoute un rectangle plein écran', () => {
        showFlash(ui);
        expect(ui.scene.add.rectangle).toHaveBeenCalled();
    });
});
