import { describe, it, expect, vi } from 'vitest';
import { handleScoreMilestones } from '../src/sceneScoreMilestones.js';
import { GAME_CONFIG } from '../src/config.js';

describe('sceneScoreMilestones', () => {
    it('affiche l’aperçu vitesse au score 9', () => {
        const showSpeedBoostPreview = vi.fn();
        const scene = {
            ui: {
                showSpeedBoostPreview,
                showDifficultyEscalationPreview: vi.fn(),
                showDifficultyEscalation: vi.fn(),
                showScoreStreak: vi.fn(),
            },
        };
        handleScoreMilestones(
            scene,
            GAME_CONFIG.round.speedBoostEvery - GAME_CONFIG.round.speedBoostPreviewOffset
        );
        expect(showSpeedBoostPreview).toHaveBeenCalled();
    });

    it('affiche l’aperçu avant l’escalade à 20 points', () => {
        const showDifficultyEscalationPreview = vi.fn();
        const scene = {
            ui: {
                showDifficultyEscalationPreview,
                showDifficultyEscalation: vi.fn(),
                showScoreStreak: vi.fn(),
            },
        };
        handleScoreMilestones(
            scene,
            GAME_CONFIG.round.gapTightenAfterScore - GAME_CONFIG.round.difficultyPreviewOffset
        );
        expect(showDifficultyEscalationPreview).toHaveBeenCalled();
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

    it('ignore les scores hors paliers', () => {
        const scene = {
            ui: { showDifficultyEscalation: vi.fn(), showScoreStreak: vi.fn() },
        };
        handleScoreMilestones(scene, 7);
        expect(scene.ui.showDifficultyEscalation).not.toHaveBeenCalled();
        expect(scene.ui.showScoreStreak).not.toHaveBeenCalled();
    });
});
