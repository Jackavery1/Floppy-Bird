import { describe, it, expect } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { handleScoreMilestones } from '../src/sceneScoreMilestones.js';

describe('midGameDifficulty (intégration paliers vitesse / gaps)', () => {
    it('enchaîne previews, séries et escalade sans coincider gap+vitesse', () => {
        const calls = [];
        const scene = {
            ui: {
                showSpeedBoostPreview: () => calls.push('speedPreview'),
                showDifficultyEscalationPreview: () => calls.push('escalationPreview'),
                showDifficultyEscalation: () => calls.push('gapEscalation'),
                showScoreStreak: (s) => calls.push(`streak:${s}`),
            },
        };
        const {
            speedBoostEvery,
            speedBoostPreviewOffset,
            gapTightenAfterScore,
            difficultyPreviewOffset,
        } = GAME_CONFIG.round;
        const scores = [
            speedBoostEvery - speedBoostPreviewOffset,
            15,
            gapTightenAfterScore - difficultyPreviewOffset,
            gapTightenAfterScore,
        ];
        for (const score of scores) {
            handleScoreMilestones(scene, score);
        }
        expect(calls).toEqual([
            'speedPreview',
            'streak:15',
            'escalationPreview',
            'streak:20',
            'gapEscalation',
        ]);
        expect(gapTightenAfterScore % speedBoostEvery).not.toBe(0);
    });
});
