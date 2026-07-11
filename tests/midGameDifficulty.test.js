import { describe, it, expect } from 'vitest';
import { handleScoreMilestones } from '../src/sceneScoreMilestones.js';

describe('midGameDifficulty (intégration paliers 9–20)', () => {
    it('enchaîne previews, séries et escalade aux scores 9, 15 et 20', () => {
        const calls = [];
        const scene = {
            ui: {
                showSpeedBoostPreview: () => calls.push('speedPreview'),
                showDifficultyEscalationPreview: () => calls.push('escalationPreview'),
                showDifficultyEscalation: () => calls.push('gapEscalation'),
                showScoreStreak: (s) => calls.push(`streak:${s}`),
            },
        };
        for (const score of [9, 15, 20]) {
            handleScoreMilestones(scene, score);
        }
        expect(calls).toEqual([
            'speedPreview',
            'escalationPreview',
            'streak:15',
            'gapEscalation',
            'streak:20',
        ]);
    });
});
