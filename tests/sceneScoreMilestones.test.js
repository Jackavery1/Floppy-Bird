import { describe, it, expect, vi } from 'vitest';
import { handleScoreMilestones } from '../src/sceneScoreMilestones.js';
import { GAME_CONFIG } from '../src/config.js';

describe('sceneScoreMilestones', () => {
    it('affiche l’escalade à 20 points', () => {
        const showDifficultyEscalation = vi.fn();
        const scene = { ui: { showDifficultyEscalation, showScoreStreak: vi.fn() } };
        handleScoreMilestones(scene, GAME_CONFIG.round.gapTightenAfterScore);
        expect(showDifficultyEscalation).toHaveBeenCalled();
    });

    it('affiche les paliers de série à 10 et 15', () => {
        const showScoreStreak = vi.fn();
        const scene = { ui: { showDifficultyEscalation: vi.fn(), showScoreStreak } };
        for (const score of GAME_CONFIG.round.streakMilestones) {
            handleScoreMilestones(scene, score);
        }
        expect(showScoreStreak).toHaveBeenCalledTimes(2);
        expect(showScoreStreak).toHaveBeenCalledWith(10);
        expect(showScoreStreak).toHaveBeenCalledWith(15);
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
