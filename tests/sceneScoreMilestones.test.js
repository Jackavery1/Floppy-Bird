import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleScoreMilestones } from '../src/sceneScoreMilestones.js';
import { GAME_CONFIG } from '../src/config.js';

vi.mock('../src/sceneA11ySync.js', () => ({
    announceScoreReached: vi.fn(),
}));

describe('sceneScoreMilestones', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('affiche l’escalade à 20 points', () => {
        const showDifficultyEscalation = vi.fn();
        const scene = { ui: { showDifficultyEscalation, showScoreStreak: vi.fn() } };
        handleScoreMilestones(scene, GAME_CONFIG.round.gapTightenAfterScore);
        expect(showDifficultyEscalation).toHaveBeenCalled();
    });

    it('affiche les paliers de série à 10, 15, 20, 30, 40 et 50', () => {
        const showScoreStreak = vi.fn();
        const scene = { ui: { showDifficultyEscalation: vi.fn(), showScoreStreak } };
        for (const score of GAME_CONFIG.round.streakMilestones) {
            handleScoreMilestones(scene, score);
        }
        expect(showScoreStreak).toHaveBeenCalledTimes(6);
        expect(showScoreStreak).toHaveBeenCalledWith(50);
    });

    it('affiche les previews avant escalade vitesse et gaps', () => {
        const showSpeedBoostPreview = vi.fn();
        const showDifficultyEscalationPreview = vi.fn();
        const scene = {
            ui: {
                showDifficultyEscalation: vi.fn(),
                showScoreStreak: vi.fn(),
                showSpeedBoostPreview,
                showDifficultyEscalationPreview,
            },
        };
        const {
            speedBoostEvery,
            speedBoostPreviewOffset,
            gapTightenAfterScore,
            difficultyPreviewOffset,
        } = GAME_CONFIG.round;
        handleScoreMilestones(scene, speedBoostEvery - speedBoostPreviewOffset);
        handleScoreMilestones(scene, gapTightenAfterScore - difficultyPreviewOffset);
        expect(showSpeedBoostPreview).toHaveBeenCalled();
        expect(showDifficultyEscalationPreview).toHaveBeenCalled();
    });

    it('annonce les paliers de score accessibles', async () => {
        const { announceScoreReached } = await import('../src/sceneA11ySync.js');
        const scene = {
            ui: { showDifficultyEscalation: vi.fn(), showScoreStreak: vi.fn() },
        };
        handleScoreMilestones(scene, 1);
        handleScoreMilestones(scene, 5);
        handleScoreMilestones(scene, 10);
        expect(announceScoreReached).toHaveBeenCalledWith(1);
        expect(announceScoreReached).toHaveBeenCalledWith(5);
        expect(announceScoreReached).toHaveBeenCalledWith(10);
        handleScoreMilestones(scene, 7);
        expect(announceScoreReached).toHaveBeenCalledTimes(3);
    });

    it('planifie une annonce debounced pour les scores inter-paliers', async () => {
        vi.useFakeTimers();
        const { announceScoreReached } = await import('../src/sceneA11ySync.js');
        const scene = {
            ui: { showDifficultyEscalation: vi.fn(), showScoreStreak: vi.fn() },
        };
        handleScoreMilestones(scene, 3);
        expect(announceScoreReached).not.toHaveBeenCalled();
        vi.advanceTimersByTime(700);
        expect(announceScoreReached).toHaveBeenCalledWith(3);
        vi.useRealTimers();
    });

    it('ignore les scores hors paliers', () => {
        const scene = {
            ui: { showDifficultyEscalation: vi.fn(), showScoreStreak: vi.fn() },
        };
        handleScoreMilestones(scene, 7);
        expect(scene.ui.showDifficultyEscalation).not.toHaveBeenCalled();
        expect(scene.ui.showScoreStreak).not.toHaveBeenCalled();
    });
});
