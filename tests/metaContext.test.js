import { describe, it, expect, vi } from 'vitest';
import { buildMetaContext } from '../src/metaContext.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/highScores.js', () => ({
    loadHighScore: vi.fn(() => 12),
    loadBestScoreAny: vi.fn(() => 12),
    loadBestHardcoreScore: vi.fn(() => 12),
}));

describe('metaContext', () => {
    it('buildMetaContext agrège score, modes et records', () => {
        const round = createRoundState();
        round.score = 3;
        const ctx = buildMetaContext({
            round,
            hardcoreMode: true,
            dailyChallengeMode: true,
        });
        expect(ctx.score).toBe(3);
        expect(ctx.hardcore).toBe(true);
        expect(ctx.dailyChallenge).toBe(true);
        expect(ctx.bestScoreAny).toBe(12);
        expect(ctx.unlockedSkinCount).toBeGreaterThan(0);
    });

    it('dailyChallenge false en mode aléatoire', () => {
        const ctx = buildMetaContext({
            round: createRoundState(),
            hardcoreMode: false,
            dailyChallengeMode: false,
        });
        expect(ctx.dailyChallenge).toBe(false);
    });
});
