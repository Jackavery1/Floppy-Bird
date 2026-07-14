import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    showRecordBroken,
    showDailyGoalReached,
    showJumpTutorial,
    dismissJumpTutorial,
    showFlash,
    showDifficultyEscalation,
    showDifficultyEscalationPreview,
    showSpeedBoostPreview,
    showScoreStreak,
    showGapTutorial,
    showScoreTutorial,
    dismissGameplayTutorial,
    showGameOverLoading,
    hideGameOverLoading,
} from '../src/uiHud.js';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
    prefersReducedMotion: vi.fn(() => false),
}));

vi.mock('../src/haptics.js', () => ({
    hapticMedium: vi.fn(),
    hapticLight: vi.fn(),
}));

describe('uiHudBanners', () => {
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

    it('deux bannières distinctes utilisent des lignes différentes', () => {
        showRecordBroken(ui);
        showScoreStreak(ui, 10);
        expect(ui._recordBanner.__bannerRow).not.toBe(ui._streakBanner.__bannerRow);
    });

    it('showDifficultyEscalation crée une bannière', () => {
        showDifficultyEscalation(ui);
        expect(ui._escalationBanner).toBeTruthy();
    });

    it('showScoreStreak affiche la série ou EN FEU', async () => {
        const { hapticMedium } = await import('../src/haptics.js');
        showScoreStreak(ui, 10);
        expect(ui._streakBanner).toBeTruthy();
        expect(hapticMedium).toHaveBeenCalled();
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

    it('showSpeedBoostPreview crée une bannière', () => {
        showSpeedBoostPreview(ui);
        expect(ui._speedBoostPreviewBanner).toBeTruthy();
    });

    it('showGapTutorial et showScoreTutorial utilisent le hint pulsant', () => {
        showGapTutorial(ui);
        expect(ui._tutorialHint).toBeTruthy();
        dismissGameplayTutorial(ui);
        showScoreTutorial(ui);
        expect(ui._tutorialHint).toBeTruthy();
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

    it('showGameOverLoading affiche skeleton puis masque l’indicateur', async () => {
        const { sceneTween } = await import('../src/motion.js');
        showGameOverLoading(ui);
        expect(ui._gameOverLoadingText).toBeTruthy();
        expect(ui._gameOverLoadingOverlay).toBeTruthy();
        expect(ui._gameOverLoadingPanel).toBeTruthy();
        expect(sceneTween).toHaveBeenCalled();
        showGameOverLoading(ui);
        expect(ui.scene.add.text).toHaveBeenCalledTimes(1);
        hideGameOverLoading(ui);
        expect(ui._gameOverLoadingText).toBeNull();
        expect(ui._gameOverLoadingOverlay).toBeNull();
        expect(ui._gameOverLoadingPanel).toBeNull();
        hideGameOverLoading(ui);
    });
});
