import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    showRecordBroken,
    showDailyGoalReached,
    showJumpTutorial,
    dismissJumpTutorial,
    showFlash,
    showDifficultyEscalation,
    showDifficultyEscalationPreview,
    showCoyoteHint,
    showHardcoreInvincibilityHint,
    showScoreStreak,
    showGapTutorial,
    showScoreTutorial,
    dismissGameplayTutorial,
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

    it('showScoreStreak affiche les paliers long run', () => {
        showScoreStreak(ui, 30);
        expect(ui._streakBanner).toBeTruthy();
        showScoreStreak(ui, 50);
        expect(ui.scene.add.text).toHaveBeenCalled();
    });

    it('showDailyGoalReached crée une bannière et un flash', () => {
        showDailyGoalReached(ui);
        expect(ui._dailyGoalBanner).toBeTruthy();
        expect(ui.scene.add.rectangle).toHaveBeenCalled();
    });

    it('showDifficultyEscalationPreview crée une bannière', () => {
        showDifficultyEscalationPreview(ui);
        expect(ui._escalationPreviewBanner).toBeTruthy();
    });

    it('showCoyoteHint crée une bannière', () => {
        showCoyoteHint(ui);
        expect(ui._coyoteHintBanner).toBeTruthy();
    });

    it('showGapTutorial et showScoreTutorial utilisent le hint pulsant', () => {
        showGapTutorial(ui);
        expect(ui._tutorialHint).toBeTruthy();
        dismissGameplayTutorial(ui);
        showScoreTutorial(ui);
        expect(ui._tutorialHint).toBeTruthy();
    });

    it('showHardcoreInvincibilityHint remplace la bannière précédente', () => {
        showHardcoreInvincibilityHint(ui, 700);
        expect(ui._hardcoreInvBanner).toBeTruthy();
        showHardcoreInvincibilityHint(ui, 625);
        expect(ui.scene.add.text).toHaveBeenCalledTimes(2);
    });

    it('showJumpTutorial et dismissJumpTutorial gèrent le hint', () => {
        showJumpTutorial(ui);
        expect(ui._tutorialHint).toBeTruthy();
        expect(dismissJumpTutorial(ui)).toBe(true);
        expect(ui._tutorialHint).toBeNull();
        expect(dismissGameplayTutorial(ui)).toBe(false);
    });

    it('showFlash ajoute un rectangle plein écran', () => {
        showFlash(ui);
        expect(ui.scene.add.rectangle).toHaveBeenCalled();
    });
});
